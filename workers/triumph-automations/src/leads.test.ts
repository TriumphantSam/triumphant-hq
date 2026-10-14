import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import worker from "./index";
import { hmac } from "./security";
import { drainOutbox } from "./delivery";
import { bookingSlots, drainBookingOutbox } from "./bookings";
import type { Env } from "./types";

function setup() {
  const sql = new DatabaseSync(":memory:");
  sql.exec(
    readFileSync(
      new URL("../migrations/0001_leads.sql", import.meta.url),
      "utf8",
    ),
  );
  sql.exec(
    readFileSync(
      new URL("../migrations/0002_bookings.sql", import.meta.url),
      "utf8",
    ),
  );
  const prepare = (query: string) => {
    let args: (string | number | null)[] = [];
    const statement = {
      bind(...values: (string | number | null)[]) {
        args = values;
        return statement;
      },
      async first() {
        return sql.prepare(query).get(...args) || null;
      },
      async run() {
        return sql.prepare(query).run(...args);
      },
      async all() {
        return { results: sql.prepare(query).all(...args) };
      },
      execute() {
        return { results: sql.prepare(query).all(...args) };
      },
    };
    return statement;
  };
  const db = {
    prepare,
    async batch(statements: ReturnType<typeof prepare>[]) {
      sql.exec("BEGIN");
      try {
        const results = statements.map((s) => s.execute());
        sql.exec("COMMIT");
        return results;
      } catch (error) {
        sql.exec("ROLLBACK");
        throw error;
      }
    },
  } as unknown as D1Database;
  const env: Env = {
    DB: db,
    AUTOMATION_HMAC_SECRET: "test-only-secret",
    ENVIRONMENT: "test",
  };
  async function request(
    path: string,
    payload: unknown,
    nonce = crypto.randomUUID(),
    signingSecret = env.AUTOMATION_HMAC_SECRET,
  ) {
    const timestamp = String(Date.now()),
      body = JSON.stringify(payload),
      signature = await hmac(
        signingSecret,
        `${timestamp}\n${nonce}\nPOST\n${path}\n${body}`,
      );
    return worker.fetch(
      new Request(`https://worker.example${path}`, {
        method: "POST",
        headers: {
          "x-triumph-timestamp": timestamp,
          "x-triumph-nonce": nonce,
          "x-triumph-signature": signature,
        },
        body,
      }),
      env,
      {} as ExecutionContext,
    );
  }
  return { sql, env, request };
}
const enquiry = {
  name: "Test Person",
  email: "test@example.com",
  message: "A test enquiry",
  source: "automation_lab",
};
test("consultation schedule follows Lagos weekdays, buffer and minimum notice", () => {
  const now = Date.parse("2026-10-16T08:59:00Z"),
    slots = bookingSlots(now);
  assert.ok(slots.length > 0);
  for (const slot of slots) {
    const start = Date.parse(slot.start),
      local = new Date(start + 3600000);
    assert.ok(start >= now + 86400000);
    assert.ok(local.getUTCDay() >= 1 && local.getUTCDay() <= 5);
    assert.ok(local.getUTCHours() >= 10 && local.getUTCHours() < 16);
    assert.equal(Date.parse(slot.end) - start, 1800000);
  }
  const monday = slots.filter((s) => s.start.startsWith("2026-10-19"));
  assert.equal(monday.length, 8);
  assert.equal(
    Date.parse(monday[1].start) - Date.parse(monday[0].start),
    2700000,
  );
});
test("booking capacity is atomic, retries are idempotent and management requires its code", async () => {
  const { sql, env, request } = setup();
  env.BOOKING_ENABLED = "true";
  const input = {
    name: "Test Person",
    email: "test@example.com",
    phone: "",
    start: bookingSlots()[0].start,
    requestId: crypto.randomUUID(),
  };
  const results = await Promise.all([
    request("/v1/bookings/create", input),
    request("/v1/bookings/create", {
      ...input,
      requestId: crypto.randomUUID(),
      email: "other@example.com",
    }),
  ]);
  assert.deepEqual(results.map((r) => r.status).sort(), [201, 409]);
  const result = (await results.find((r) => r.status === 201)!.json()) as {
    booking: { id: string };
    code: string;
  };
  assert.equal(sql.prepare("SELECT count(*) n FROM bookings").get()!.n, 1);
  assert.equal(sql.prepare("SELECT count(*) n FROM leads").get()!.n, 1);
  assert.equal(
    sql.prepare("SELECT count(*) n FROM booking_outbox").get()!.n,
    4,
  );
  const saved = sql.prepare("SELECT request_id,email FROM bookings").get()!;
  const retryInput = {
    ...input,
    requestId: saved.request_id,
    email: saved.email,
  };
  const retry = await request("/v1/bookings/create", retryInput);
  assert.equal(retry.status, 200);
  assert.equal(((await retry.json()) as { code: string }).code, result.code);
  assert.equal(
    (await request("/v1/bookings/create", { ...retryInput, name: "Different" }))
      .status,
    409,
  );
  assert.equal(
    (
      await request("/v1/bookings/manage", {
        id: result.booking.id,
        code: "a".repeat(64),
        action: "status",
      })
    ).status,
    404,
  );
  for (let i = 0; i < 2; i++)
    assert.equal(
      (
        await request("/v1/bookings/manage", {
          id: result.booking.id,
          code: result.code,
          action: "cancel",
        })
      ).status,
      200,
    );
  assert.equal(
    sql
      .prepare(
        "SELECT count(*) n FROM booking_outbox WHERE kind LIKE '%cancellation'",
      )
      .get()!.n,
    2,
  );
  assert.equal(
    sql
      .prepare(
        "SELECT count(*) n FROM booking_outbox WHERE kind LIKE 'reminder%' AND state='cancelled'",
      )
      .get()!.n,
    2,
  );
  assert.equal(
    (
      await request("/v1/bookings/create", {
        ...input,
        requestId: crypto.randomUUID(),
      })
    ).status,
    201,
  );
  assert.equal(
    (
      await request("/v1/bookings/create", {
        ...input,
        start: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      })
    ).status,
    400,
  );
  sql.close();
});
test("booking emails retry privately, reuse provider idempotency keys and suppress cancelled reminders", async () => {
  const { sql, env, request } = setup();
  Object.assign(env, {
    BOOKING_ENABLED: "true",
    RESEND_API_KEY: "test-only",
    EMAIL_FROM: "test@example.com",
    OWNER_EMAIL: "owner@example.com",
  });
  const result = (await (
    await request("/v1/bookings/create", {
      name: "Test Person",
      email: "test@example.com",
      start: bookingSlots()[0].start,
      requestId: crypto.randomUUID(),
    })
  ).json()) as { booking: { id: string }; code: string };
  const originalFetch = globalThis.fetch,
    messages: { headers: Headers; body: { to: string[]; text: string } }[] = [];
  globalThis.fetch = async (_url, options) => {
    messages.push({
      headers: new Headers(options?.headers),
      body: JSON.parse(String(options?.body)),
    });
    return new Response("private-provider-body", { status: 429 });
  };
  try {
    await drainBookingOutbox(env);
    assert.equal(messages.length, 2);
    assert.equal(
      sql
        .prepare(
          "SELECT last_error FROM booking_outbox WHERE kind='confirmation'",
        )
        .get()!.last_error,
      "email_provider_failed_429",
    );
    sql.exec(
      "UPDATE booking_outbox SET next_attempt_at='2000-01-01T00:00:00.000Z' WHERE state='pending'",
    );
    globalThis.fetch = async (_url, options) => {
      messages.push({
        headers: new Headers(options?.headers),
        body: JSON.parse(String(options?.body)),
      });
      return new Response("{}", { status: 200 });
    };
    await drainBookingOutbox(env);
    await drainBookingOutbox(env);
    assert.equal(messages.length, 6);
    assert.equal(
      messages[0].headers.get("Idempotency-Key"),
      messages[2].headers.get("Idempotency-Key"),
    );
    assert.ok(
      messages
        .filter((m) => m.body.to[0] === "test@example.com")
        .every((m) => m.body.text.includes(result.code)),
    );
    assert.ok(
      messages
        .filter((m) => m.body.to[0] === "owner@example.com")
        .every((m) => !m.body.text.includes(result.code)),
    );
    await request("/v1/bookings/manage", {
      ...result.booking,
      code: result.code,
      action: "cancel",
    });
    await drainBookingOutbox(env);
    await drainBookingOutbox(env);
    assert.equal(messages.length, 8);
  } finally {
    globalThis.fetch = originalFetch;
    sql.close();
  }
});
test("WhatsApp handoff is idempotent, scoped and queues no customer email", async () => {
  const { sql, env, request } = setup();
  env.WHATSAPP_BRIDGE_SECRET = "test-bridge-only";
  const input = { phone: "2348000000000", messageId: "wamid.test-handoff" };
  assert.equal((await request("/v1/whatsapp/handoff", input)).status, 401);
  for (let i = 0; i < 2; i++)
    assert.equal(
      (
        await request(
          "/v1/whatsapp/handoff",
          input,
          crypto.randomUUID(),
          env.WHATSAPP_BRIDGE_SECRET,
        )
      ).status,
      200,
    );
  assert.equal(sql.prepare("SELECT count(*) AS n FROM leads").get()!.n, 1);
  assert.deepEqual(
    sql
      .prepare("SELECT kind FROM outbox ORDER BY kind")
      .all()
      .map((r) => r.kind),
    ["owner_email", "sheet"],
  );
  assert.equal(sql.prepare("SELECT email FROM leads").get()!.email, "");
  assert.equal(
    (
      await request(
        "/v1/leads",
        enquiry,
        crypto.randomUUID(),
        env.WHATSAPP_BRIDGE_SECRET,
      )
    ).status,
    401,
  );
  assert.equal(
    (
      await request(
        "/v1/whatsapp/handoff",
        { ...input, phone: "bad" },
        crypto.randomUUID(),
        env.WHATSAPP_BRIDGE_SECRET,
      )
    ).status,
    400,
  );
  sql.close();
});
test("qualified WhatsApp enquiries preserve details without marketing consent", async () => {
  const { sql, env, request } = setup();
  env.WHATSAPP_BRIDGE_SECRET = "test-bridge-only";
  const input = {
    phone: "2348000000000",
    messageId: "wamid.qualified",
    name: "Adéyemi",
    email: "test@example.com",
    service: "Automation",
    need: "Automate the incoming enquiries for my business",
  };
  assert.equal(
    (
      await request(
        "/v1/whatsapp/handoff",
        input,
        crypto.randomUUID(),
        env.WHATSAPP_BRIDGE_SECRET,
      )
    ).status,
    200,
  );
  const row = sql
    .prepare("SELECT name,email,service,need,consent_marketing FROM leads")
    .get()!;
  assert.equal(row.name, input.name);
  assert.equal(row.email, input.email);
  assert.equal(row.need, input.need);
  assert.equal(row.consent_marketing, 0);
  assert.equal(
    (
      await request(
        "/v1/whatsapp/handoff",
        { ...input, messageId: "bad.email", email: "invalid" },
        crypto.randomUUID(),
        env.WHATSAPP_BRIDGE_SECRET,
      )
    ).status,
    400,
  );
  assert.equal(sql.prepare("SELECT count(*) AS n FROM leads").get()!.n, 1);
  sql.close();
});
test("the bound Sheet acknowledges WhatsApp references after mirroring", async () => {
  const { sql, env, request } = setup();
  env.WHATSAPP_BRIDGE_SECRET = "test-bridge-only";
  env.SHEETS_SYNC_SECRET = "test-sheet-only";
  await request(
    "/v1/whatsapp/handoff",
    { phone: "2348000000000", messageId: "wamid.sheet" },
    crypto.randomUUID(),
    env.WHATSAPP_BRIDGE_SECRET,
  );
  const row = sql.prepare("SELECT id,updated_at FROM leads").get()!;
  assert.match(String(row.id), /^wa-[a-f0-9]{64}$/);
  const ack = await request(
    "/v1/sheets/ack",
    { rows: [{ id: row.id, updatedAt: row.updated_at }] },
    crypto.randomUUID(),
    env.SHEETS_SYNC_SECRET,
  );
  assert.equal(ack.status, 200);
  assert.equal(
    ((await ack.json()) as { acknowledged: number }).acknowledged,
    1,
  );
  assert.equal(
    sql.prepare("SELECT sheet_synced FROM leads").get()!.sheet_synced,
    1,
  );
  sql.close();
});
test("distributed IP admission is shared across requests and resets only after expiry", async () => {
  const { sql, request } = setup();
  const ipKey = "a".repeat(64);
  for (let i = 0; i < 6; i++) {
    const response = await request("/v1/form-admission", { ipKey });
    assert.equal(response.status, 200);
    assert.equal(
      ((await response.json()) as { allowed: boolean }).allowed,
      i < 5,
    );
  }
  assert.equal(sql.prepare("SELECT count FROM rate_limits").get()!.count, 6);
  sql.prepare("UPDATE rate_limits SET expires_at=0").run();
  const reset = await request("/v1/form-admission", { ipKey });
  assert.equal(((await reset.json()) as { allowed: boolean }).allowed, true);
  assert.equal(
    (await request("/v1/form-admission", { ipKey: "not-an-ip-hash" })).status,
    400,
  );
  sql.close();
});
test("lead capture merges a recent duplicate and creates only three durable jobs", async () => {
  const { sql, request } = setup();
  const first = await request("/v1/leads", enquiry);
  assert.equal(first.status, 201);
  const a = (await first.json()) as { leadId: string };
  const second = await request("/v1/leads", {
    ...enquiry,
    message: "Updated enquiry",
  });
  const b = (await second.json()) as { leadId: string };
  assert.equal(a.leadId, b.leadId);
  assert.equal(sql.prepare("SELECT count(*) AS n FROM leads").get()!.n, 1);
  assert.equal(sql.prepare("SELECT count(*) AS n FROM outbox").get()!.n, 3);
  assert.equal(
    sql.prepare("SELECT need FROM leads").get()!.need,
    "Updated enquiry",
  );
  sql.close();
});
test("a merged enquiry refreshes the Sheet without resending accepted email jobs", async () => {
  const { sql, request } = setup();
  await request("/v1/leads", enquiry);
  sql.prepare("UPDATE outbox SET state='sent'").run();
  sql.prepare("UPDATE leads SET sheet_synced=1").run();
  await request("/v1/leads", {
    ...enquiry,
    message: "Updated after the first sync",
  });
  assert.equal(sql.prepare("SELECT count(*) AS n FROM outbox").get()!.n, 3);
  assert.equal(
    sql.prepare("SELECT sheet_synced FROM leads").get()!.sheet_synced,
    0,
  );
  assert.equal(
    sql.prepare("SELECT state FROM outbox WHERE kind='sheet'").get()!.state,
    "pending",
  );
  assert.equal(
    sql
      .prepare(
        "SELECT count(*) AS n FROM outbox WHERE kind<>'sheet' AND state='sent'",
      )
      .get()!.n,
    2,
  );
  sql.close();
});
test("expired duplicate creates a new enquiry; replayed nonce is rejected", async () => {
  const { sql, request } = setup(),
    nonce = crypto.randomUUID();
  await request("/v1/leads", enquiry, nonce);
  assert.equal((await request("/v1/leads", enquiry, nonce)).status, 409);
  sql
    .prepare("UPDATE leads SET created_at=?")
    .run(new Date(Date.now() - 601000).toISOString());
  await request("/v1/leads", enquiry);
  assert.equal(sql.prepare("SELECT count(*) AS n FROM leads").get()!.n, 2);
  sql.close();
});
test("provider failures remain queued and never report sent", async () => {
  const { sql, env, request } = setup();
  await request("/v1/leads", enquiry);
  await drainOutbox(env);
  const jobs = sql
    .prepare("SELECT state,attempts,last_error FROM outbox")
    .all();
  assert.equal(jobs.length, 3);
  for (const job of jobs) {
    assert.equal(job.state, "pending");
    assert.equal(job.attempts, 1);
    assert.match(String(job.last_error), /not_configured/);
  }
  sql.close();
});
test("public status exposes delivery states without enquiry details", async () => {
  const { sql, request } = setup();
  const response = await request("/v1/leads", enquiry);
  const { leadId } = (await response.json()) as { leadId: string };
  const status = await request("/v1/lead-status", { leadId });
  const text = await status.text();
  assert.equal(status.status, 200);
  assert.equal(text.includes(enquiry.email), false);
  assert.equal(text.includes(enquiry.name), false);
  assert.equal(text.includes("pending"), true);
  sql.close();
});

test("email rejections retain only HTTP status, never provider response contents", async () => {
  const { sql, env, request } = setup();
  env.SHEETS_SYNC_SECRET = "s".repeat(64);
  env.RESEND_API_KEY = "test-only-provider-key";
  env.EMAIL_FROM = "test@example.com";
  env.OWNER_EMAIL = "owner@example.com";
  await request("/v1/leads", enquiry);
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response("Sensitive provider response", { status: 401 });
  try {
    await drainOutbox(env);
    const jobs = sql
      .prepare("SELECT state,last_error FROM outbox WHERE kind<>'sheet'")
      .all();
    assert.equal(jobs.length, 2);
    for (const job of jobs) {
      assert.equal(job.state, "pending");
      assert.equal(job.last_error, "email_provider_failed_401");
    }
  } finally {
    globalThis.fetch = originalFetch;
    sql.close();
  }
});

test("keyless Sheet connector is scoped and requires acknowledgement before claiming sync", async () => {
  const { sql, env, request } = setup();
  env.SHEETS_SYNC_SECRET = "s".repeat(64);
  const lead = await request("/v1/leads", enquiry);
  assert.equal(lead.status, 201);
  assert.equal((await request("/v1/sheets/pull", {})).status, 401);
  assert.equal(
    (await request("/v1/leads", enquiry, undefined, env.SHEETS_SYNC_SECRET))
      .status,
    401,
  );
  const pull = await request(
    "/v1/sheets/pull",
    {},
    undefined,
    env.SHEETS_SYNC_SECRET,
  );
  const data = (await pull.json()) as {
    leads: { id: string; updated_at: string }[];
  };
  assert.equal(data.leads.length, 1);
  const row = data.leads[0];
  assert.equal(
    sql.prepare("SELECT sheet_synced FROM leads").get()!.sheet_synced,
    0,
  );
  const stale = await request(
    "/v1/sheets/ack",
    { rows: [{ id: row.id, updatedAt: "stale" }] },
    undefined,
    env.SHEETS_SYNC_SECRET,
  );
  assert.equal(
    ((await stale.json()) as { acknowledged: number }).acknowledged,
    0,
  );
  const ack = await request(
    "/v1/sheets/ack",
    { rows: [{ id: row.id, updatedAt: row.updated_at }] },
    undefined,
    env.SHEETS_SYNC_SECRET,
  );
  assert.equal(
    ((await ack.json()) as { acknowledged: number }).acknowledged,
    1,
  );
  assert.equal(
    sql.prepare("SELECT sheet_synced FROM leads").get()!.sheet_synced,
    1,
  );
  sql.close();
});

test("keyless Sheet jobs remain pending for the bound script while cron handles email", async () => {
  const { sql, env, request } = setup();
  env.SHEETS_SYNC_SECRET = "s".repeat(64);
  await request("/v1/leads", enquiry);
  await drainOutbox(env);
  const sheet = sql
    .prepare("SELECT state,attempts FROM outbox WHERE kind='sheet'")
    .get()!;
  assert.equal(sheet.state, "pending");
  assert.equal(sheet.attempts, 0);
  sql.close();
});
