import { Hono } from "hono";
import type { Env } from "./types";
import { hmac } from "./security";
import { claimLabJobs } from "./lab-delivery";
import { billingEvent, billingReady } from "./platform/billing";
type Invoice = {
  id: string;
  email: string;
  fingerprint: string;
  status: string;
  authorization_url: string | null;
  provider_id: string | null;
  paid_at: string | null;
  created_at: string;
  reminder_opt_in: number;
};
type Transaction = {
  reference: string;
  status: string;
  amount: number;
  currency: string;
  domain: string;
  id: number;
  paid_at: string;
};
type Context = { Bindings: Env; Variables: { raw: string } };
export const paymentRoutes = new Hono<Context>();
export const testPaymentsReady = (env: Env) =>
  /^sk_test_[A-Za-z0-9]+$/.test(env.PAYSTACK_TEST_SECRET_KEY || "");
async function paystack(env: Env, path: string, body?: unknown) {
  const response = await fetch("https://api.paystack.co" + path, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: "Bearer " + env.PAYSTACK_TEST_SECRET_KEY,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(7000),
    redirect: "manual",
  }).catch((error: unknown) => {
    console.warn("paystack_transport_failed", {
      name: error instanceof Error ? error.name : "unknown",
      reason: error instanceof Error
        ? error.message.replace(/https?:\/\/\S+/g, "[provider]").slice(0, 160)
        : "unknown",
    });
    throw error;
  });
  if (!response.ok) {
    console.warn("paystack_request_rejected", {
      status: response.status,
      operation: body ? "initialize" : "verify",
    });
    throw new Error("Paystack request failed");
  }
  const result = (await response.json()) as {
    status: boolean;
    data: Record<string, unknown>;
  };
  if (!result.status || !result.data)
    throw new Error("Paystack response invalid");
  return result.data;
}
export function validTestTransaction(
  transaction: Transaction,
  reference: string,
) {
  return (
    transaction.reference === reference &&
    transaction.status === "success" &&
    transaction.amount === 10000 &&
    transaction.currency === "NGN" &&
    transaction.domain === "test" &&
    Number.isSafeInteger(transaction.id) &&
    transaction.id > 0 &&
    typeof transaction.paid_at === "string" &&
    Number.isFinite(Date.parse(transaction.paid_at))
  );
}
export async function verifyTestInvoice(env: Env, reference: string) {
  const invoice = await env.DB.prepare("SELECT * FROM lab_invoices WHERE id=?")
    .bind(reference)
    .first<Invoice>();
  if (!invoice) return null;
  if (invoice.status === "paid") return invoice;
  const transaction = (await paystack(
    env,
    "/transaction/verify/" + encodeURIComponent(reference),
  )) as unknown as Transaction;
  if (!validTestTransaction(transaction, reference)) return invoice;
  const now = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare(
      "UPDATE lab_invoices SET status='paid',provider_id=?,paid_at=? WHERE id=? AND status!='paid'",
    ).bind(String(transaction.id), transaction.paid_at, reference),
    env.DB.prepare(
      "UPDATE lab_payment_jobs SET state='cancelled' WHERE invoice_id=? AND kind LIKE 'reminder_%' AND state IN ('pending','failed')",
    ).bind(reference),
    env.DB.prepare(
      "INSERT INTO lab_payment_jobs(id,invoice_id,kind,next_attempt_at) VALUES(?,?,'receipt',?) ON CONFLICT(invoice_id,kind) DO NOTHING",
    ).bind(reference + ":receipt", reference, now),
    env.DB.prepare(
      "INSERT INTO lab_payment_jobs(id,invoice_id,kind,next_attempt_at) VALUES(?,?,'owner',?) ON CONFLICT(invoice_id,kind) DO NOTHING",
    ).bind(reference + ":owner", reference, now),
  ]);
  return { ...invoice, status: "paid", paid_at: transaction.paid_at };
}
paymentRoutes.get("/ready", (c) =>
  c.json({
    ok: true,
    mode: "test",
    connected: testPaymentsReady(c.env),
    amountKobo: 10000,
    currency: "NGN",
  }),
);
paymentRoutes.post("/initialize", async (c) => {
  if (!testPaymentsReady(c.env))
    return c.json(
      { error: "Paystack test checkout is not connected yet." },
      503,
    );
  let input;
  try {
    input = JSON.parse(c.get("raw"));
  } catch {
    return c.json({ error: "Invalid checkout request." }, 400);
  }
  if (
    typeof input.email !== "string" ||
    input.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) ||
    !/^[a-f0-9-]{36}$/.test(input.requestId || "")
  )
    return c.json({ error: "Provide a valid email." }, 400);
  if (
    input.reminderOptIn !== undefined &&
    typeof input.reminderOptIn !== "boolean"
  )
    return c.json({ error: "Invalid reminder choice." }, 400);
  const email = input.email.trim().toLowerCase(),
    reference = "thq-test-" + input.requestId,
    fingerprint = await hmac(
      c.env.AUTOMATION_HMAC_SECRET,
      JSON.stringify([email, input.reminderOptIn === true]),
    ),
    now = new Date().toISOString();
  const inserted = await c.env.DB.prepare(
    "INSERT INTO lab_invoices(id,request_id,fingerprint,email,created_at,amount_kobo,reminder_opt_in) VALUES(?,?,?,?,?,10000,?) ON CONFLICT(request_id) DO NOTHING RETURNING id",
  )
    .bind(
      reference,
      input.requestId,
      fingerprint,
      email,
      now,
      input.reminderOptIn ? 1 : 0,
    )
    .first();
  if (!inserted) {
    const existing = await c.env.DB.prepare(
      "SELECT * FROM lab_invoices WHERE request_id=?",
    )
      .bind(input.requestId)
      .first<Invoice>();
    if (!existing || existing.fingerprint !== fingerprint)
      return c.json(
        { error: "This checkout reference belongs to different details." },
        409,
      );
    if (existing.authorization_url)
      return c.json({
        ok: true,
        reference,
        url: existing.authorization_url,
        mode: "test",
      });
    return c.json(
      {
        error:
          "Checkout could not be confirmed. Use the status check with your reference; do not submit another payment.",
        reference,
      },
      409,
    );
  }
  try {
    const transaction = await paystack(c.env, "/transaction/initialize", {
      email,
      amount: 10000,
      currency: "NGN",
      reference,
      callback_url: "https://triumphantech.com/automation-lab/payments",
      metadata: { purpose: "automation_lab_test" },
    });
    const url = new URL(String(transaction.authorization_url));
    if (
      url.protocol !== "https:" ||
      url.hostname !== "checkout.paystack.com" ||
      url.username ||
      url.password ||
      transaction.reference !== reference
    )
      throw new Error("Invalid checkout URL");
    await c.env.DB.batch([
      c.env.DB.prepare(
        "UPDATE lab_invoices SET status='awaiting_payment',authorization_url=? WHERE id=? AND status='initializing'",
      ).bind(url.href, reference),
      ...(input.reminderOptIn
        ? [
            ["reminder_due", 1],
            ["reminder_3d", 4],
            ["reminder_7d", 8],
          ].map(([kind, days]) =>
            c.env.DB.prepare(
              "INSERT INTO lab_payment_jobs(id,invoice_id,kind,next_attempt_at) VALUES(?,?,?,?) ON CONFLICT(invoice_id,kind) DO NOTHING",
            ).bind(
              reference + ":" + kind,
              reference,
              kind,
              new Date(Date.now() + Number(days) * 86400000).toISOString(),
            ),
          )
        : []),
    ]);
    return c.json({ ok: true, reference, url: url.href, mode: "test" });
  } catch {
    await c.env.DB.prepare(
      "UPDATE lab_invoices SET status='unknown' WHERE id=? AND status='initializing'",
    )
      .bind(reference)
      .run();
    return c.json(
      {
        error:
          "Checkout initialization was not confirmed. Check the reference before trying again.",
        reference,
      },
      503,
    );
  }
});
paymentRoutes.post("/verify", async (c) => {
  let input;
  try {
    input = JSON.parse(c.get("raw"));
  } catch {
    return c.json({ error: "Invalid reference." }, 400);
  }
  if (!/^thq-test-[a-f0-9-]{36}$/.test(input.reference || ""))
    return c.json({ error: "Invalid reference." }, 400);
  if (!testPaymentsReady(c.env))
    return c.json(
      { error: "Test payment verification is not connected." },
      503,
    );
  const now = Date.now(),
    rateKey = "payment-check:" + input.reference;
  const admitted = await c.env.DB.prepare(
    "INSERT INTO rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires_at<? THEN 1 ELSE count+1 END,expires_at=CASE WHEN expires_at<? THEN excluded.expires_at ELSE expires_at END WHERE count<10 OR expires_at<? RETURNING count",
  )
    .bind(rateKey, now + 3600000, now, now, now)
    .first();
  if (!admitted)
    return c.json(
      {
        error:
          "This reference has reached its hourly status-check limit. Please try again later.",
      },
      429,
    );
  try {
    const invoice = await verifyTestInvoice(c.env, input.reference);
    if (!invoice) return c.json({ error: "Reference not found." }, 404);
    return c.json({
      ok: true,
      reference: invoice.id,
      status: invoice.status,
      amountKobo: 10000,
      currency: "NGN",
      mode: "test",
      paidAt: invoice.paid_at,
    });
  } catch {
    return c.json(
      {
        error:
          "Paystack verification is temporarily unavailable. Payment is not confirmed.",
      },
      503,
    );
  }
});
paymentRoutes.post("/receipt", async (c) => {
  let input;
  try {
    input = JSON.parse(c.get("raw"));
  } catch {
    return c.json({ error: "Invalid reference." }, 400);
  }
  if (!/^thq-test-[a-f0-9-]{36}$/.test(input.reference || ""))
    return c.json({ error: "Invalid reference." }, 400);
  const invoice = await c.env.DB.prepare(
    "SELECT id,paid_at FROM lab_invoices WHERE id=? AND status='paid'",
  )
    .bind(input.reference)
    .first<{ id: string; paid_at: string }>();
  if (!invoice)
    return c.json(
      { error: "No verified test receipt is available for this reference." },
      404,
    );
  return c.json({
    ok: true,
    reference: invoice.id,
    status: "paid",
    mode: "test",
    amountKobo: 10000,
    currency: "NGN",
    paidAt: invoice.paid_at,
  });
});
paymentRoutes.post("/stop", async (c) => {
  let input;
  try {
    input = JSON.parse(c.get("raw"));
  } catch {
    return c.json({ error: "Invalid reference." }, 400);
  }
  if (!/^thq-test-[a-f0-9-]{36}$/.test(input.reference || ""))
    return c.json({ error: "Invalid reference." }, 400);
  await c.env.DB.batch([
    c.env.DB.prepare(
      "UPDATE lab_invoices SET reminder_opt_in=0 WHERE id=?",
    ).bind(input.reference),
    c.env.DB.prepare(
      "UPDATE lab_payment_jobs SET state='cancelled' WHERE invoice_id=? AND kind LIKE 'reminder_%' AND state IN ('pending','failed')",
    ).bind(input.reference),
  ]);
  return c.json({ ok: true, stopped: true });
});
export async function validPaystackSignature(
  secret: string,
  body: string,
  signature: string,
  mode: 'test' | 'live' = 'test',
) {
  if (
    !(new RegExp(`^sk_${mode}_[A-Za-z0-9]+$`)).test(secret) ||
    !/^[a-f0-9]{128}$/.test(signature)
  )
    return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const bytes = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body)),
  );
  const expected = [...bytes]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  let diff = 0;
  for (let i = 0; i < 128; i++)
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}
export async function paystackWebhook(request: Request, env: Env) {
  const reader = request.body?.getReader();
  let body = "";
  let bytes = 0;
  if (reader) {
    const decoder = new TextDecoder();
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      bytes += result.value.length;
      if (bytes > 16384) {
        await reader.cancel();
        return new Response("Too large", { status: 413 });
      }
      body += decoder.decode(result.value, { stream: true });
    }
    body += decoder.decode();
  }
  if (
    !(await validPaystackSignature(
      env.PAYSTACK_TEST_SECRET_KEY || "",
      body,
      request.headers.get("x-paystack-signature") || "",
    ))
  )
    return new Response("Unauthorized", { status: 401 });
  try {
    const event = JSON.parse(body);
    if (env.ENVIRONMENT === 'staging' && billingReady(env) && typeof event.event === "string" && event.data && typeof event.data === "object" && !Array.isArray(event.data))
      await billingEvent(env,event.event,event.data);
    if (event.event !== "charge.success")
      return new Response("Ignored", { status: 200 });
    if (!/^thq-test-[a-f0-9-]{36}$/.test(event.data?.reference || ""))
      return new Response("Ignored", { status: 200 });
    await verifyTestInvoice(env, event.data.reference);
    return new Response("OK");
  } catch {
    return new Response("Verification unavailable", { status: 503 });
  }
}
export async function drainPaymentJobs(env: Env) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM || !env.OWNER_EMAIL) return;
  const results = await claimLabJobs<{
    id: string;
    invoice_id: string;
    kind: string;
    attempts: number;
  }>(env, "lab_payment_jobs");
  for (const job of results) {
    const invoice = await env.DB.prepare(
      "SELECT * FROM lab_invoices WHERE id=?",
    )
      .bind(job.invoice_id)
      .first<Invoice>();
    if (!invoice) continue;
    const reminder = job.kind.startsWith("reminder_");
    if (
      reminder
        ? invoice.status !== "awaiting_payment" || !invoice.reminder_opt_in
        : invoice.status !== "paid"
    ) {
      await env.DB.prepare(
        "UPDATE lab_payment_jobs SET state='cancelled' WHERE id=?",
      )
        .bind(job.id)
        .run();
      continue;
    }
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + env.RESEND_API_KEY,
          "Content-Type": "application/json",
          "Idempotency-Key": job.id,
        },
        body: JSON.stringify({
          from: env.EMAIL_FROM,
          to: job.kind === "owner" ? env.OWNER_EMAIL : invoice.email,
          subject: reminder
            ? "Your requested test checkout reminder"
            : job.kind === "receipt"
              ? "Your Automation Lab test receipt"
              : "Automation Lab test payment verified",
          text: reminder
            ? `You opted into demonstration checkout reminders. No money is owed; this is not an overdue bill.\nYour optional test checkout: ${invoice.authorization_url}\nCheck payment or stop further reminders: https://triumphantech.com/automation-lab/payments?reference=${invoice.id}\nAt most three reminders are scheduled; verified payment stops them.`
            : `TEST PAYMENT — no real money collected.\nAmount: NGN 100.00\nReference: ${invoice.id}\nPaid: ${new Date(invoice.paid_at!).toLocaleString("en-GB", { timeZone: "Africa/Lagos" })} WAT\nTriumphant Technological Services, Basorun Rd, Ibadan.\nThis is demonstration proof, not a real purchase or tax invoice.\nReceipt: https://triumphantech.com/receipt/${invoice.id}`,
        }),
        signal: AbortSignal.timeout(8000),
        redirect: "manual",
      });
      if (!response.ok) throw new Error("Provider rejected");
      await env.DB.prepare(
        "UPDATE lab_payment_jobs SET state='sent',lease_until=NULL WHERE id=?",
      )
        .bind(job.id)
        .run();
    } catch {
      const attempts = job.attempts + 1;
      await env.DB.prepare(
        "UPDATE lab_payment_jobs SET state=?,attempts=?,lease_until=NULL,next_attempt_at=? WHERE id=?",
      )
        .bind(
          attempts >= 10 ? "failed" : "pending",
          attempts,
          new Date(Date.now() + 2 ** attempts * 60000).toISOString(),
          job.id,
        )
        .run();
    }
  }
}
