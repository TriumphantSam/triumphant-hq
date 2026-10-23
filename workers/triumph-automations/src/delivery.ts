import type { Env, Job, Lead } from "./types";
import { safeSheetCell } from "./security";

const b64url = (value: Uint8Array) =>
  btoa(String.fromCharCode(...value))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
const encode = (value: unknown) =>
  b64url(new TextEncoder().encode(JSON.stringify(value)));
async function googleToken(env: Env) {
  if (!env.GOOGLE_SA_EMAIL || !env.GOOGLE_SA_PRIVATE_KEY)
    throw new Error("sheet_not_configured");
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({ iss: env.GOOGLE_SA_EMAIL, scope: "https://www.googleapis.com/auth/spreadsheets", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
  const pem = env.GOOGLE_SA_PRIVATE_KEY.replace(/\\n/g, "\n").replace(
    /-----[^-]+-----|\s/g,
    "",
  );
  const key = await crypto.subtle.importKey(
    "pkcs8",
    Uint8Array.from(atob(pem), (c) => c.charCodeAt(0)),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsigned),
  );
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${b64url(new Uint8Array(signature))}`,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("sheet_auth_failed");
  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}
async function mirrorLead(env: Env, lead: Lead) {
  if (!env.LEADS_SHEET_ID) throw new Error("sheet_not_configured");
  const token = await googleToken(env);
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(env.LEADS_SHEET_ID)}/values/`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const existing = await fetch(`${base}${encodeURIComponent("Leads!A:A")}`, {
    headers,
    signal: AbortSignal.timeout(8000),
  });
  if (!existing.ok) throw new Error("sheet_read_failed");
  const rows = (await existing.json()) as { values?: string[][] };
  if (!rows.values?.some((row) => row[0] === lead.id)) {
    const response = await fetch(
      `${base}${encodeURIComponent("Leads!A:J")}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: "POST",
        headers,
        signal: AbortSignal.timeout(8000),
        body: JSON.stringify({
          values: [
            [
              lead.id,
              lead.created_at,
              lead.source,
              lead.name,
              lead.email,
              lead.phone,
              lead.service,
              lead.need,
              lead.consent_marketing ? "Yes" : "No",
              "new",
            ].map(safeSheetCell),
          ],
        }),
      },
    );
    if (!response.ok) throw new Error("sheet_append_failed");
  }
  await env.DB.prepare("UPDATE leads SET sheet_synced=1 WHERE id=?")
    .bind(lead.id)
    .run();
}
async function sendEmail(env: Env, job: Job, lead: Lead) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM || !env.OWNER_EMAIL)
    throw new Error("email_not_configured");
  const owner = job.kind === "owner_email";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    signal: AbortSignal.timeout(8000),
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": job.id,
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [owner ? env.OWNER_EMAIL : lead.email],
      reply_to: owner ? lead.email || env.OWNER_EMAIL : env.OWNER_EMAIL,
      subject: owner
        ? "New TriumphantTech enquiry"
        : "We received your TriumphantTech enquiry",
      text: owner
        ? `Name: ${lead.name}\nEmail: ${lead.email || "Not provided"}\nPhone: ${lead.phone || "Not provided"}\nService: ${lead.service}\n${lead.need}\nReference: ${lead.id}`
        : `Hi ${lead.name},\n\nWe received your enquiry about ${lead.service || "our services"}. We will review it and reply with a practical next step.\n\nReference: ${lead.id}\nTriumphantTech\nadmin@triumphantech.com\n+234 909 009 0910`,
    }),
  });
  if (!response.ok)
    throw new Error(`email_provider_failed_${response.status}`);
}

export async function drainOutbox(env: Env) {
  const now = new Date().toISOString();
  const due = await env.DB.prepare(
      "SELECT id,lead_id,kind,attempts FROM outbox WHERE (state='pending' OR (state='sending' AND lease_until<?)) AND next_attempt_at<=? AND attempts<10 AND (?=0 OR kind<>'sheet') LIMIT 15",
  )
    .bind(now, now, env.SHEETS_SYNC_SECRET ? 1 : 0)
    .all<Job>();
  for (const job of due.results) {
    const claim = await env.DB.prepare(
      "UPDATE outbox SET state='sending',lease_until=?,attempts=attempts+1 WHERE id=? AND (state='pending' OR (state='sending' AND lease_until<?)) RETURNING id",
    )
      .bind(new Date(Date.now() + 120000).toISOString(), job.id, now)
      .first();
    if (!claim) continue;
    try {
      const lead = await env.DB.prepare("SELECT * FROM leads WHERE id=?")
        .bind(job.lead_id)
        .first<Lead>();
      if (!lead) throw new Error("lead_missing");
      if (job.kind === "sheet") await mirrorLead(env, lead);
      else await sendEmail(env, job, lead);
      await env.DB.prepare(
        "UPDATE outbox SET state='sent',sent_at=?,lease_until=NULL,last_error=NULL WHERE id=?",
      )
        .bind(new Date().toISOString(), job.id)
        .run();
      await env.DB.prepare(
        "INSERT INTO events(id,type,ref_id,created_at) VALUES(?,?,?,?)",
      )
        .bind(
          crypto.randomUUID(),
          `delivery_${job.kind}`,
          job.lead_id,
          new Date().toISOString(),
        )
        .run();
    } catch (error) {
      // Provider bodies and user input never enter logs or the failure field.
      const known = [
        "sheet_not_configured",
        "sheet_auth_failed",
        "sheet_read_failed",
        "sheet_append_failed",
        "email_not_configured",
        "email_provider_failed",
        "lead_missing",
      ];
      const reason =
        error instanceof Error &&
        (known.includes(error.message) ||
          /^email_provider_failed_[45]\d{2}$/.test(error.message))
          ? error.message
          : "delivery_failed";
      await env.DB.prepare(
        "UPDATE outbox SET state=?,next_attempt_at=?,lease_until=NULL,last_error=? WHERE id=?",
      )
        .bind(
          job.attempts >= 9 ? "failed" : "pending",
          new Date(
            Date.now() + Math.min(3600000, 60000 * 2 ** job.attempts),
          ).toISOString(),
          reason,
          job.id,
        )
        .run();
    }
  }
}
