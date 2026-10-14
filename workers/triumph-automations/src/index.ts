import { Hono } from "hono";
import { verifySignedRequest } from "./security";
import { drainOutbox } from "./delivery";
import type { Env } from "./types";
import { bookingRoutes, drainBookingOutbox } from "./bookings";
import { drainBookingMessages, messageChannels } from "./booking-messages";
import { privateReport, reportWindow } from "./reports";

const app = new Hono<{ Bindings: Env; Variables: { raw: string } }>();
app.use("/v1/*", async (c, next) => {
  const reader = c.req.raw.body?.getReader(),
    chunks: Uint8Array[] = [];
  let bytes = 0;
  if (reader) {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.length;
        if (bytes > 16384) {
          await reader.cancel();
          return c.json({ error: "Submission too large." }, 413);
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
  }
  const buffer = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }
  const raw = new TextDecoder().decode(buffer);
  if (
    !(await verifySignedRequest(
      c.req.raw,
      raw,
      c.req.path.startsWith("/v1/sheets/")
        ? c.env.SHEETS_SYNC_SECRET || ""
        : c.req.path.startsWith("/v1/whatsapp/")
          ? c.env.WHATSAPP_BRIDGE_SECRET || ""
          : c.env.AUTOMATION_HMAC_SECRET,
    ))
  )
    return c.json({ error: "Unauthorized" }, 401);
  const nonce = c.req.header("x-triumph-nonce")!;
  const result = await c.env.DB.prepare(
    "INSERT INTO request_nonces(nonce,expires_at) VALUES(?,?) ON CONFLICT(nonce) DO NOTHING RETURNING nonce",
  )
    .bind(nonce, Date.now() + 120000)
    .first();
  if (!result) return c.json({ error: "Request already used." }, 409);
  c.set("raw", raw);
  await next();
  c.header("Cache-Control", "no-store");
});
app.get("/v1/health", (c) =>
  c.json({
    ok: true,
    leadCapture: true,
    bookingEnabled: c.env.BOOKING_ENABLED === "true",
    bookingChannels: messageChannels(c.env),
    sheetConfigured: Boolean(
      c.env.SHEETS_SYNC_SECRET ||
      (c.env.LEADS_SHEET_ID &&
        c.env.GOOGLE_SA_EMAIL &&
        c.env.GOOGLE_SA_PRIVATE_KEY),
    ),
    sheetMode: c.env.SHEETS_SYNC_SECRET ? "bound_script" : "service_account",
    emailConfigured: Boolean(
      c.env.RESEND_API_KEY && c.env.EMAIL_FROM && c.env.OWNER_EMAIL,
    ),
  }),
);
app.route("/v1/bookings", bookingRoutes);
// Internal only: signed requests, no public Next.js proxy and no customer fields.
app.post("/v1/reports/summary", async (c) => {
  let input;
  try {
    input = JSON.parse(c.get("raw"));
    reportWindow(input.date, input.days);
  } catch {
    return c.json(
      { error: "Use a valid YYYY-MM-DD date and days 1 or 7." },
      400,
    );
  }
  return c.json(await privateReport(c.env, input.date, input.days));
});
app.post("/v1/whatsapp/notification-optout", async (c) => {
  let input;
  try {
    input = JSON.parse(c.get("raw"));
  } catch {
    return c.json({ error: "Invalid request." }, 400);
  }
  if (
    !input ||
    typeof input.phone !== "string" ||
    !/^[1-9]\d{7,14}$/.test(input.phone)
  )
    return c.json({ error: "Invalid phone." }, 400);
  await c.env.DB.batch([
    c.env.DB.prepare(
      "UPDATE bookings SET whatsapp_opt_in=0 WHERE phone=?",
    ).bind(input.phone),
    c.env.DB.prepare(
      "UPDATE booking_messages SET state='cancelled' WHERE channel='whatsapp' AND state IN ('pending','failed') AND booking_id IN (SELECT id FROM bookings WHERE phone=?)",
    ).bind(input.phone),
  ]);
  return c.json({ ok: true });
});
app.post("/v1/whatsapp/handoff", async (c) => {
  let input: Record<string, unknown>;
  try {
    input = JSON.parse(c.get("raw"));
  } catch {
    return c.json({ error: "Invalid request." }, 400);
  }
  if (
    !input ||
    typeof input.phone !== "string" ||
    !/^\d{7,15}$/.test(input.phone) ||
    typeof input.messageId !== "string" ||
    !/^[A-Za-z0-9._=+\/-]{1,256}$/.test(input.messageId)
  )
    return c.json({ error: "Invalid request." }, 400);
  for (const [field, limit] of [
    ["name", 80],
    ["email", 254],
    ["service", 80],
    ["need", 1000],
  ] as const) {
    if (
      input[field] !== undefined &&
      (typeof input[field] !== "string" ||
        (input[field] as string).length > limit)
    )
      return c.json({ error: "Invalid request." }, 400);
  }
  const name = String(input.name || "").trim(),
    email = String(input.email || "").trim();
  const service = String(input.service || "").trim(),
    need = String(input.need || "").trim();
  if (
    (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
    ((name || email || service || need) &&
      (name.length < 2 ||
        need.length < 10 ||
        !["Website", "Seo", "Automation"].includes(service)))
  )
    return c.json({ error: "Invalid request." }, 400);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input.messageId),
  );
  const id =
    "wa-" +
    [...new Uint8Array(digest)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  const now = new Date().toISOString();
  await c.env.DB.batch([
    c.env.DB.prepare(
      "INSERT INTO leads(id,created_at,updated_at,source,name,email,phone,service,need) VALUES(?,?,?,'whatsapp',?,?,?,?,?) ON CONFLICT(id) DO NOTHING",
    ).bind(
      id,
      now,
      now,
      name || "WhatsApp contact",
      email,
      input.phone,
      service || "Human handoff",
      need ||
        "A WhatsApp contact requested a human. Reply through the business WhatsApp conversation; bot replies are paused for 24 hours.",
    ),
    ...(["sheet", "owner_email"] as const).map((kind) =>
      c.env.DB.prepare(
        "INSERT INTO outbox(id,lead_id,kind,next_attempt_at) VALUES(?,?,?,?) ON CONFLICT(lead_id,kind) DO NOTHING",
      ).bind(`${id}:${kind}`, id, kind, now),
    ),
  ]);
  return c.json({ ok: true, reference: id });
});
app.post("/v1/form-admission", async (c) => {
  let input: { ipKey?: string };
  try {
    input = JSON.parse(c.get("raw"));
  } catch {
    return c.json({ error: "Invalid request." }, 400);
  }
  if (
    !input ||
    typeof input.ipKey !== "string" ||
    !/^[a-f0-9]{64}$/.test(input.ipKey)
  )
    return c.json({ error: "Invalid request." }, 400);
  const now = Date.now();
  const result = await c.env.DB.prepare(
    "INSERT INTO rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN rate_limits.expires_at<=? THEN 1 ELSE rate_limits.count+1 END,expires_at=CASE WHEN rate_limits.expires_at<=? THEN excluded.expires_at ELSE rate_limits.expires_at END RETURNING count",
  )
    .bind(`ip:${input.ipKey}`, now + 3600000, now, now)
    .first<{ count: number }>();
  return c.json({ allowed: Boolean(result && result.count <= 5) });
});
app.post("/v1/leads", async (c) => {
  let input: Record<string, unknown>;
  try {
    input = JSON.parse(c.get("raw"));
  } catch {
    return c.json({ error: "Invalid JSON." }, 400);
  }
  if (!input || typeof input !== "object" || Array.isArray(input))
    return c.json({ error: "Invalid enquiry." }, 400);
  const value = (key: string, max: number) =>
    typeof input[key] === "string"
      ? String(input[key]).trim().slice(0, max)
      : "";
  const name = value("name", 120),
    email = value("email", 254).toLowerCase(),
    message = value("message", 8000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message)
    return c.json(
      { error: "Please include a name, valid email and message." },
      400,
    );
  const now = new Date().toISOString(),
    cutoff = new Date(Date.now() - 600000).toISOString(),
    id = crypto.randomUUID();
  const rateKey = `${email}:${Math.floor(Date.now() / 3600000)}`;
  const rate = await c.env.DB.prepare(
    "INSERT INTO rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count",
  )
    .bind(rateKey, Date.now() + 3600000)
    .first<{ count: number }>();
  if (!rate || rate.count > 5)
    return c.json(
      { error: "You have reached the hourly limit. Please try later." },
      429,
    );
  const consent = input.consentMarketing === true;
  const statements = [
    c.env.DB.prepare(
      "INSERT INTO leads(id,created_at,updated_at,source,name,email,phone,service,need,consent_marketing,consent_at) SELECT ?,?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM leads WHERE email=? AND created_at>=?)",
    ).bind(
      id,
      now,
      now,
      value("source", 80) || "web_form",
      name,
      email,
      value("phone", 30),
      value("service", 120),
      message,
      consent ? 1 : 0,
      consent ? now : null,
      email,
      cutoff,
    ),
    c.env.DB.prepare(
      "UPDATE leads SET updated_at=?,need=?,service=? WHERE email=? AND created_at>=?",
    ).bind(now, message, value("service", 120), email, cutoff),
    c.env.DB.prepare(
      "INSERT INTO events(id,type,ref_id,created_at) SELECT ?,?,id,? FROM leads WHERE email=? AND created_at>=? ORDER BY created_at DESC LIMIT 1",
    ).bind(crypto.randomUUID(), "lead_captured", now, email, cutoff),
    ...(["sheet", "reply_email", "owner_email"] as const).map((kind) =>
      c.env.DB.prepare(
        "INSERT INTO outbox(id,lead_id,kind,next_attempt_at) SELECT id || ?,id,?,? FROM leads WHERE email=? AND created_at>=? ORDER BY created_at DESC LIMIT 1 ON CONFLICT(lead_id,kind) DO NOTHING",
      ).bind(`:${kind}`, kind, now, email, cutoff),
    ),
    c.env.DB.prepare(
      "UPDATE leads SET sheet_synced=0 WHERE email=? AND created_at>=?",
    ).bind(email, cutoff),
    c.env.DB.prepare(
      "UPDATE outbox SET state='pending',next_attempt_at=?,last_error=NULL,sent_at=NULL WHERE kind='sheet' AND lead_id IN (SELECT id FROM leads WHERE email=? AND created_at>=?) AND state='sent'",
    ).bind(now, email, cutoff),
    c.env.DB.prepare(
      "SELECT id FROM leads WHERE email=? AND created_at>=? ORDER BY created_at DESC LIMIT 1",
    ).bind(email, cutoff),
  ];
  const results = await c.env.DB.batch(statements);
  const leadId = (results[results.length - 1].results[0] as { id: string }).id;
  // Cron owns delivery. Returning a stored lead never claims an email was sent.
  return c.json({ ok: true, leadId, stored: true, deliveries: "queued" }, 201);
});
app.post("/v1/lead-status", async (c) => {
  const input = JSON.parse(c.get("raw")) as { leadId?: string };
  if (!input.leadId || !/^[a-f0-9-]{36}$/.test(input.leadId))
    return c.json({ error: "Invalid reference." }, 400);
  const rows = await c.env.DB.prepare(
    "SELECT kind,state FROM outbox WHERE lead_id=?",
  )
    .bind(input.leadId)
    .all();
  if (!rows.results.length) return c.json({ error: "Enquiry not found." }, 404);
  return c.json({ ok: true, deliveries: rows.results });
});
app.post("/v1/sheets/pull", async (c) => {
  const result = await c.env.DB.prepare(
    "SELECT l.id,l.created_at,l.updated_at,l.source,l.name,l.email,l.phone,l.service,l.need,l.consent_marketing FROM leads l JOIN outbox o ON o.lead_id=l.id WHERE o.kind='sheet' AND (o.state IN ('pending','failed') OR (o.state='sending' AND o.lease_until<?)) ORDER BY l.created_at LIMIT 20",
  )
    .bind(new Date().toISOString())
    .all();
  return c.json({ ok: true, leads: result.results });
});
app.post("/v1/sheets/ack", async (c) => {
  let input: { rows?: { id: string; updatedAt: string }[] };
  try {
    input = JSON.parse(c.get("raw"));
  } catch {
    return c.json({ error: "Invalid acknowledgement." }, 400);
  }
  if (
    !input ||
    !Array.isArray(input.rows) ||
    input.rows.length > 20 ||
    input.rows.some(
      (row) =>
        !row ||
        !/^(?:[a-f0-9-]{36}|wa-[a-f0-9]{64})$/.test(row.id) ||
        typeof row.updatedAt !== "string" ||
        row.updatedAt.length > 30,
    )
  )
    return c.json({ error: "Invalid acknowledgement." }, 400);
  const now = new Date().toISOString();
  const statements = input.rows.flatMap((row) => [
    c.env.DB.prepare(
      "UPDATE outbox SET state='sent',sent_at=?,lease_until=NULL,last_error=NULL WHERE lead_id=? AND kind='sheet' AND EXISTS(SELECT 1 FROM leads WHERE id=? AND updated_at=?) RETURNING lead_id",
    ).bind(now, row.id, row.id, row.updatedAt),
    c.env.DB.prepare(
      "UPDATE leads SET sheet_synced=1 WHERE id=? AND updated_at=? AND EXISTS(SELECT 1 FROM outbox WHERE lead_id=? AND kind='sheet' AND state='sent')",
    ).bind(row.id, row.updatedAt, row.id),
  ]);
  if (!statements.length) return c.json({ ok: true, acknowledged: 0 });
  const results = await c.env.DB.batch(statements);
  return c.json({
    ok: true,
    acknowledged: results
      .filter((_, i) => i % 2 === 0)
      .reduce((n, r) => n + r.results.length, 0),
  });
});
app.onError(
  () =>
    new Response(
      JSON.stringify({
        ok: false,
        error: "Automation service is temporarily unavailable.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    ),
);

export default {
  fetch: app.fetch,
  async scheduled(_controller: ScheduledController, env: Env) {
    await drainOutbox(env);
    await drainBookingOutbox(env);
    await drainBookingMessages(env);
    await env.DB.batch([
      env.DB.prepare("DELETE FROM request_nonces WHERE expires_at<?").bind(
        Date.now(),
      ),
      env.DB.prepare("DELETE FROM rate_limits WHERE expires_at<?").bind(
        Date.now(),
      ),
      env.DB.prepare("DELETE FROM leads WHERE created_at<?").bind(
        new Date(Date.now() - 365 * 86400000).toISOString(),
      ),
      env.DB.prepare("DELETE FROM events WHERE created_at<?").bind(
        new Date(Date.now() - 365 * 86400000).toISOString(),
      ),
      env.DB.prepare("DELETE FROM bookings WHERE created_at<?").bind(
        new Date(Date.now() - 365 * 86400000).toISOString(),
      ),
    ]);
  },
} satisfies ExportedHandler<Env>;
