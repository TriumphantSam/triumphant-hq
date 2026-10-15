import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import worker from "./index";
import { hmac } from "./security";
import { drainOutbox } from "./delivery";
import { bookingSlots, drainBookingOutbox } from "./bookings";
import { drainBookingMessages, notificationPhone } from "./booking-messages";
import type { Env } from "./types";
import { reportWindow } from "./reports";
import {
  validPaystackSignature,
  validTestTransaction,
  verifyTestInvoice,
  testPaymentsReady,
} from "./payments";
import { groundedAnswer } from "./chat";
import { createHmac } from "node:crypto";
import { claimLabJobs } from "./lab-delivery";
import { completeConsultation, scheduleOwnerReports } from "./admin";
import { drainReviewJobs } from "./reviews";

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
  sql.exec(
    readFileSync(
      new URL("../migrations/0003_booking_messages.sql", import.meta.url),
      "utf8",
    ),
  );
  sql.exec(
    readFileSync(
      new URL("../migrations/0004_lab_flows.sql", import.meta.url),
      "utf8",
    ),
  );
  sql.exec(
    readFileSync(
      new URL("../migrations/0005_delivery_guards.sql", import.meta.url),
      "utf8",
    ),
  );
  const prepare = (query: string) => {
    // All supported migrations run against the same SQLite engine as D1.
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
test("completed service invitations require permission, respect 90 days and honour opt-out", async () => {
  const { env, sql, request } = setup();
  const create = (
    email: string,
    opt: number,
    start = "2026-01-01T09:00:00.000Z",
    end = "2026-01-01T09:30:00.000Z",
  ) => {
    const id = crypto.randomUUID();
    sql
      .prepare(
        "INSERT INTO bookings(id,request_id,fingerprint,created_at,slot_start,slot_end,name,email,review_opt_in) VALUES(?,?,?,'2026-01-01',?,?,'Test customer',?,?)",
      )
      .run(id, id, "test", start, end, email, opt);
    return id;
  };
  const first = create("same@example.com", 1);
  assert.equal((await completeConsultation(env, first)).ok, true);
  await completeConsultation(env, first);
  const second = create(
    "same@example.com",
    1,
    "2026-01-02T09:00:00.000Z",
    "2026-01-02T09:30:00.000Z",
  );
  await completeConsultation(env, second);
  const noConsent = create(
    "other@example.com",
    0,
    "2026-01-03T09:00:00.000Z",
    "2026-01-03T09:30:00.000Z",
  );
  await completeConsultation(env, noConsent);
  assert.equal(
    sql.prepare("SELECT COUNT(*) AS count FROM review_invites").get()?.count,
    1,
  );
  const invite = sql.prepare("SELECT id FROM review_invites").get()?.id;
  assert.equal(
    (await request("/v1/reviews/invite", { id: invite, action: "stop" }))
      .status,
    200,
  );
  sql.exec(
    "UPDATE review_contacts SET last_requested_at='2026-01-01T00:00:00.000Z'",
  );
  await completeConsultation(
    env,
    create(
      "same@example.com",
      1,
      "2026-01-04T09:00:00.000Z",
      "2026-01-04T09:30:00.000Z",
    ),
  );
  assert.equal(
    sql.prepare("SELECT COUNT(*) AS count FROM review_invites").get()?.count,
    1,
  );
  const future = new Date(Date.now() + 86400000).toISOString();
  assert.equal(
    (
      await completeConsultation(
        env,
        create(
          "future@example.com",
          1,
          future,
          new Date(Date.now() + 86400000 + 1800000).toISOString(),
        ),
      )
    ).ok,
    false,
  );
});
test("owner reports claim one daily job, weekly Monday period, and never publish drafts", async () => {
  const { env, sql } = setup();
  await scheduleOwnerReports(env, new Date("2026-10-15T07:10:00Z"));
  assert.equal(
    sql.prepare("SELECT COUNT(*) AS count FROM owner_report_jobs").get()?.count,
    0,
  );
  env.REPORTS_EMAIL_ENABLED = "true";
  await scheduleOwnerReports(env, new Date("2026-10-15T07:10:00Z"));
  await scheduleOwnerReports(env, new Date("2026-10-15T07:11:00Z"));
  assert.equal(
    sql.prepare("SELECT COUNT(*) AS count FROM owner_report_jobs").get()?.count,
    1,
  );
  await scheduleOwnerReports(env, new Date("2026-10-19T07:00:00Z"));
  assert.equal(
    sql
      .prepare(
        "SELECT COUNT(*) AS count FROM social_drafts WHERE state='draft'",
      )
      .get()?.count,
    3,
  );
  const weekly = JSON.parse(
    String(
      sql
        .prepare(
          "SELECT report FROM owner_report_jobs WHERE id='owner-report:2026-10-18'",
        )
        .get()?.report,
    ),
  );
  assert.equal(weekly.window.days, 7);
});
test("uncertain email jobs past the provider idempotency window cannot replay", async () => {
  const { env, sql } = setup();
  const created = new Date().toISOString(),
    old = new Date(Date.now() - 25 * 3600000).toISOString(),
    id = crypto.randomUUID();
  sql
    .prepare(
      "INSERT INTO review_feedback(id,created_at,rating,feedback) VALUES(?,?,5,'test')",
    )
    .run(id, created);
  sql
    .prepare(
      "INSERT INTO review_jobs(id,feedback_id,state,next_attempt_at,lease_until,first_attempt_at) VALUES(?,?,'sending',?,?,?)",
    )
    .run(id + ":owner", id, old, old, old);
  assert.equal((await claimLabJobs(env, "review_jobs")).length, 0);
  assert.equal(
    sql.prepare("SELECT state FROM review_jobs").get()?.state,
    "unknown",
  );
});
test("chat sessions bind to the initiating address digest and stop at twenty attempts", async () => {
  const { env, sql, request } = setup();
  env.CHAT_ENABLED = "true";
  let calls = 0;
  env.AI = {
    run: async () => {
      calls++;
      throw new Error("Provider unavailable");
    },
  } as unknown as Ai;
  const ipKey = "a".repeat(64),
    start = await request("/v1/chat/start", { ipKey });
  assert.equal(start.status, 200);
  const { token } = (await start.json()) as { token: string };
  assert.equal(
    (
      await request("/v1/chat/message", {
        token,
        ipKey: "b".repeat(64),
        message: "Price?",
      })
    ).status,
    429,
  );
  for (let index = 0; index < 20; index++)
    assert.equal(
      (await request("/v1/chat/message", { token, ipKey, message: "Price?" }))
        .status,
      503,
    );
  assert.equal(
    (await request("/v1/chat/message", { token, ipKey, message: "Price?" }))
      .status,
    429,
  );
  assert.equal(calls, 20);
  assert.equal(sql.prepare("SELECT turns FROM chat_sessions").get()?.turns, 20);
});
const enquiry = {
  name: "Test Person",
  email: "test@example.com",
  message: "A test enquiry",
  source: "automation_lab",
};
test("AI answers only expose selected known facts, source links and safe handoff", () => {
  assert.equal(groundedAnswer(["invented"]).handoff, true);
  const answer = groundedAnswer(["pricing", "location", "booking", "websites"]);
  assert.equal(answer.sources.length, 3);
  assert.match(answer.answer, /written proposal/);
  assert.equal(answer.answer.includes("₦"), false);
  assert.ok(
    answer.sources.every(
      (source) => source.href.startsWith("/") && !source.href.startsWith("//"),
    ),
  );
});
test("test payments reject live credentials and mismatched verification data", async () => {
  const { env } = setup();
  env.PAYSTACK_TEST_SECRET_KEY = "sk_live_invalid";
  assert.equal(testPaymentsReady(env), false);
  env.PAYSTACK_TEST_SECRET_KEY = "sk_test_fake";
  assert.equal(testPaymentsReady(env), true);
  const valid = {
    reference: "reference",
    status: "success",
    amount: 10000,
    currency: "NGN",
    domain: "test",
    id: 123,
    paid_at: "2026-10-15T09:00:00Z",
  };
  assert.equal(validTestTransaction(valid, "reference"), true);
  for (const invalid of [
    { ...valid, amount: 100 },
    { ...valid, currency: "USD" },
    { ...valid, domain: "live" },
    { ...valid, status: "failed" },
    { ...valid, reference: "another" },
    { ...valid, paid_at: "bad" },
  ])
    assert.equal(validTestTransaction(invalid, "reference"), false);
  const body = '{"event":"charge.success"}',
    signature = createHmac("sha512", env.PAYSTACK_TEST_SECRET_KEY)
      .update(body)
      .digest("hex");
  assert.equal(
    await validPaystackSignature(env.PAYSTACK_TEST_SECRET_KEY, body, signature),
    true,
  );
  assert.equal(
    await validPaystackSignature(
      env.PAYSTACK_TEST_SECRET_KEY,
      body + " ",
      signature,
    ),
    false,
  );
  assert.equal(
    await validPaystackSignature("sk_live_fake", body, signature),
    false,
  );
});
test("verified test payments are idempotent and receipts contain no customer details", async () => {
  const { env, sql, request } = setup();
  env.PAYSTACK_TEST_SECRET_KEY = "sk_test_fake";
  const ref = "thq-test-" + crypto.randomUUID();
  sql
    .prepare(
      "INSERT INTO lab_invoices(id,request_id,fingerprint,email,created_at,amount_kobo,status) VALUES(?,?,?,?,?,10000,'awaiting_payment')",
    )
    .run(
      ref,
      ref.slice(9),
      "test",
      "private@example.com",
      "2026-10-15T00:00:00Z",
    );
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async (_url, options) => {
    assert.equal(options?.redirect, "manual");
    calls++;
    return Response.json({
      status: true,
      data: {
        reference: ref,
        status: "success",
        amount: 10000,
        currency: "NGN",
        domain: "test",
        id: 987,
        paid_at: "2026-10-15T09:00:00Z",
      },
    });
  };
  try {
    await verifyTestInvoice(env, ref);
    await verifyTestInvoice(env, ref);
    assert.equal(calls, 1);
    assert.equal(
      sql.prepare("SELECT COUNT(*) AS count FROM lab_payment_jobs").get()
        ?.count,
      2,
    );
    const receipt = await request("/v1/payments/receipt", { reference: ref });
    assert.equal(receipt.status, 200);
    const body = await receipt.text();
    assert.equal(body.includes("private@example.com"), false);
    assert.match(body, /"mode":"test"/);
  } finally {
    globalThis.fetch = original;
  }
});
test("review feedback saves once and offers the same Google link at low and high scores", async () => {
  const { request, sql } = setup();
  const input = {
    requestId: crypto.randomUUID(),
    rating: 1,
    name: "",
    email: "",
    feedback: "Needs improvement",
  };
  const low = await request("/v1/reviews/feedback", input);
  assert.equal(low.status, 200);
  await request("/v1/reviews/feedback", input);
  const high = await request("/v1/reviews/feedback", {
    ...input,
    requestId: crypto.randomUUID(),
    rating: 5,
  });
  assert.equal(
    ((await low.json()) as { googleReviewUrl: string }).googleReviewUrl,
    ((await high.json()) as { googleReviewUrl: string }).googleReviewUrl,
  );
  assert.equal(
    sql.prepare("SELECT COUNT(*) AS count FROM review_jobs").get()?.count,
    2,
  );
  assert.equal(
    (await request("/v1/reviews/feedback", { ...input, rating: 0 })).status,
    400,
  );
});

test("feedback delivery rejects provider redirects and retries the same idempotency key", async () => {
  const { env, request, sql } = setup();
  env.RESEND_API_KEY = "test-key";
  env.EMAIL_FROM = "Team <team@example.com>";
  env.OWNER_EMAIL = "owner@example.com";
  const id = crypto.randomUUID();
  await request("/v1/reviews/feedback", {
    requestId: id,
    rating: 4,
    name: "",
    email: "",
    feedback: "Test",
  });
  const original = globalThis.fetch;
  const keys: string[] = [];
  globalThis.fetch = async (_url, options) => {
    assert.equal(options?.redirect, "manual");
    keys.push(new Headers(options?.headers).get("Idempotency-Key")!);
    return keys.length === 1
      ? new Response(null, {
          status: 302,
          headers: { Location: "https://elsewhere.example" },
        })
      : Response.json({ id: "accepted" });
  };
  try {
    await drainReviewJobs(env);
    assert.equal(
      sql.prepare("SELECT state FROM review_jobs").get()?.state,
      "pending",
    );
    sql.exec("UPDATE review_jobs SET next_attempt_at='2020-01-01'");
    await drainReviewJobs(env);
    assert.equal(
      sql.prepare("SELECT state FROM review_jobs").get()?.state,
      "sent",
    );
    assert.equal(keys.length, 2);
    assert.equal(keys[0], keys[1]);
  } finally {
    globalThis.fetch = original;
  }
});

test("owner lead updates protect concurrent edits, mirror status without notes, and never resend customer emails", async () => {
  const { env, request, sql } = setup();
  const captured = await request("/v1/leads", {
    name: "Test",
    email: "test@example.com",
    message: "Authorised in-memory pipeline test",
  });
  const { leadId } = (await captured.json()) as { leadId: string };
  const original = sql
    .prepare("SELECT updated_at FROM leads WHERE id=?")
    .get(leadId)?.updated_at;
  sql.exec("UPDATE outbox SET state='sent'; UPDATE leads SET sheet_synced=1;");
  const input = {
    action: "update_lead",
    id: leadId,
    status: "qualified",
    notes: "Private owner follow-up notes",
    updatedAt: original,
  };
  assert.equal((await request("/v1/admin/action", input)).status, 200);
  assert.equal(
    sql.prepare("SELECT status FROM leads WHERE id=?").get(leadId)?.status,
    "qualified",
  );
  assert.equal(
    sql.prepare("SELECT sheet_synced FROM leads WHERE id=?").get(leadId)
      ?.sheet_synced,
    0,
  );
  assert.equal(
    sql
      .prepare(
        "SELECT COUNT(*) AS count FROM outbox WHERE kind!='sheet' AND state='sent'",
      )
      .get()?.count,
    2,
  );
  assert.equal(
    sql.prepare("SELECT state FROM outbox WHERE kind='sheet'").get()?.state,
    "pending",
  );
  assert.equal(
    (await request("/v1/admin/action", { ...input, notes: "Stale overwrite" }))
      .status,
    409,
  );
  assert.equal(
    sql.prepare("SELECT owner_notes FROM leads WHERE id=?").get(leadId)
      ?.owner_notes,
    input.notes,
  );
  assert.equal(
    sql
      .prepare("SELECT COUNT(*) AS count FROM events WHERE type='lead_updated'")
      .get()?.count,
    1,
  );
  env.SHEETS_SYNC_SECRET = "s".repeat(64);
  const sheet = await request(
    "/v1/sheets/pull",
    {},
    crypto.randomUUID(),
    env.SHEETS_SYNC_SECRET,
  );
  const body = await sheet.text();
  assert.match(body, /"status":"qualified"/);
  assert.equal(body.includes(input.notes), false);
  assert.equal(body.includes("owner_notes"), false);
  assert.equal(
    (await request("/v1/admin/action", { ...input, status: "invalid" })).status,
    400,
  );
  assert.equal(
    (await request("/v1/admin/action", { ...input, notes: "x".repeat(2001) }))
      .status,
    400,
  );
  assert.equal(
    (
      await request(
        "/v1/admin/action",
        input,
        crypto.randomUUID(),
        env.SHEETS_SYNC_SECRET,
      )
    ).status,
    401,
  );
});

test("private reports use exclusive Lagos day boundaries and reject invalid periods", () => {
  assert.deepEqual(reportWindow("2026-10-14", 1), {
    start: "2026-10-13T23:00:00.000Z",
    end: "2026-10-14T23:00:00.000Z",
    date: "2026-10-14",
    days: 1,
    timezone: "Africa/Lagos",
  });
  assert.equal(reportWindow("2026-10-14", 7).start, "2026-10-07T23:00:00.000Z");
  for (const date of ["2026-02-30", "2026-13-01", "yesterday"])
    assert.throws(() => reportWindow(date, 1));
  assert.throws(() => reportWindow("2026-10-14", 30));
});

test("reports count the requested period without exposing customer fields or inventing payments", async () => {
  const { sql, request, env } = setup();
  const insert = sql.prepare(
    "INSERT INTO leads(id,created_at,updated_at,source,name,email,need,sheet_synced) VALUES(?,?,?,'test','Private Person','private@example.com','Private enquiry',?)",
  );
  for (const [id, time, synced] of [
    ["before", "2026-10-13T22:59:59.000Z", 1],
    ["start", "2026-10-13T23:00:00.000Z", 1],
    ["inside", "2026-10-14T22:59:59.000Z", 0],
    ["end", "2026-10-14T23:00:00.000Z", 1],
  ] as const)
    insert.run(id, time, time, synced);
  sql.exec(
    "INSERT INTO outbox(id,lead_id,kind,state,next_attempt_at) VALUES('sheet','inside','sheet','failed','2026-10-14'),('reply','inside','reply_email','failed','2026-10-14')",
  );
  const result = await request("/v1/reports/summary", {
    date: "2026-10-14",
    days: 1,
  });
  assert.equal(result.status, 200);
  const body = (await result.json()) as Record<string, unknown>;
  assert.equal(body.leadsCreated, 2);
  assert.equal(body.leadsAwaitingSheetSync, 1);
  assert.equal(body.emailJobsFailed, 1);
  assert.equal(body.payments, null);
  assert.equal(body.stock, null);
  assert.equal(JSON.stringify(body).includes("private@example.com"), false);
  assert.equal(JSON.stringify(body).includes("Private Person"), false);
  const unauthenticated = await worker.fetch(
    new Request("https://worker.example/v1/reports/summary", {
      method: "POST",
      body: JSON.stringify({ date: "2026-10-14", days: 1 }),
    }),
    env,
    {} as ExecutionContext,
  );
  assert.equal(unauthenticated.status, 401);
  const invalid = await request("/v1/reports/summary", {
    date: "2026-02-30",
    days: 1,
  });
  assert.equal(invalid.status, 400);
});
const smsSettings = {
  BOOKING_ENABLED: "true",
  BOOKING_SMS_ENABLED: "true",
  TERMII_API_KEY: "test-only-key",
  TERMII_API_BASE: "https://api.ng.termii.com",
  TERMII_SENDER_ID: "TriumphTec",
  TERMII_DND_APPROVED: "true",
};
test("phone send quotas defer work and a clear 429 rejection can retry safely", async () => {
  const { sql, env, request } = setup();
  Object.assign(env, smsSettings, { BOOKING_SMS_DAILY_LIMIT: "1" });
  for (let i = 0; i < 2; i++)
    await request("/v1/bookings/create", {
      ...enquiry,
      start: bookingSlots()[i].start,
      phone: "09090090910",
      smsOptIn: true,
      requestId: crypto.randomUUID(),
    });
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return new Response("private-provider-body", { status: 429 });
  };
  try {
    await drainBookingMessages(env);
    assert.equal(calls, 1);
    assert.equal(
      sql
        .prepare(
          "SELECT count(*) n FROM booking_messages WHERE last_error='daily_limit'",
        )
        .get()!.n,
      1,
    );
    assert.equal(
      sql
        .prepare(
          "SELECT attempts FROM booking_messages WHERE last_error='daily_limit'",
        )
        .get()!.attempts,
      0,
    );
    env.BOOKING_SMS_DAILY_LIMIT = "50";
    sql.exec(
      "UPDATE booking_messages SET next_attempt_at='2000-01-01' WHERE kind='confirmation'",
    );
    globalThis.fetch = async () => {
      calls++;
      return Response.json({ message_id: `test-${calls}` });
    };
    await drainBookingMessages(env);
    await drainBookingMessages(env);
    assert.equal(calls, 3);
    assert.equal(
      sql
        .prepare(
          "SELECT count(*) n FROM booking_messages WHERE state='accepted'",
        )
        .get()!.n,
      2,
    );
  } finally {
    globalThis.fetch = original;
    sql.close();
  }
});
test("phone channels require readiness and explicit consent, without changing legacy recovery", async () => {
  assert.equal(notificationPhone("09090090910"), "2349090090910");
  assert.equal(notificationPhone("+234 909 009 0910"), "2349090090910");
  assert.equal(notificationPhone("0909invalid"), null);
  const { sql, env, request } = setup();
  env.BOOKING_ENABLED = "true";
  const input = {
    ...enquiry,
    start: bookingSlots()[0].start,
    requestId: crypto.randomUUID(),
    phone: "09090090910",
    smsOptIn: true,
  };
  assert.equal((await request("/v1/bookings/create", input)).status, 400);
  assert.equal(sql.prepare("SELECT count(*) n FROM bookings").get()!.n, 0);
  Object.assign(env, smsSettings);
  assert.equal(
    (await request("/v1/bookings/create", { ...input, phone: "invalid" }))
      .status,
    400,
  );
  const data = (await (await request("/v1/bookings/create", input)).json()) as {
    booking: { id: string };
    code: string;
  };
  const row = sql.prepare("SELECT * FROM bookings").get()!;
  assert.equal(row.phone, "2349090090910");
  assert.equal(row.sms_opt_in, 1);
  assert.equal(row.whatsapp_opt_in, 0);
  assert.ok(row.notification_consent_at);
  assert.equal(
    sql.prepare("SELECT count(*) n FROM booking_messages").get()!.n,
    3,
  );
  assert.equal(
    (await request("/v1/bookings/recover", { ...input, smsOptIn: false }))
      .status,
    404,
  );
  const fetchBefore = globalThis.fetch,
    sends: Record<string, unknown>[] = [];
  globalThis.fetch = async (_url, options) => {
    sends.push(JSON.parse(String(options?.body)));
    return Response.json({ message_id: "sms-test-1" });
  };
  try {
    await drainBookingMessages(env);
    await drainBookingMessages(env);
    assert.equal(sends.length, 1);
    assert.equal(sends[0].channel, "dnd");
    assert.equal(sends[0].to, "2349090090910");
    assert.ok(String(sends[0].sms).length <= 160);
    assert.ok(!String(sends[0].sms).includes(data.code));
    assert.equal(
      sql
        .prepare("SELECT state FROM booking_messages WHERE kind='confirmation'")
        .get()!.state,
      "accepted",
    );
    await request("/v1/bookings/manage", {
      ...data.booking,
      code: data.code,
      action: "notifications_off",
    });
    assert.equal(
      sql.prepare("SELECT status,sms_opt_in FROM bookings").get()!.status,
      "confirmed",
    );
    assert.equal(
      sql.prepare("SELECT sms_opt_in FROM bookings").get()!.sms_opt_in,
      0,
    );
    assert.equal(
      sql
        .prepare(
          "SELECT count(*) n FROM booking_messages WHERE state='cancelled'",
        )
        .get()!.n,
      2,
    );
  } finally {
    globalThis.fetch = fetchBefore;
    sql.close();
  }
});
test("ambiguous sends and expired sender leases cannot replay a possibly accepted message", async () => {
  const { sql, env, request } = setup();
  Object.assign(env, smsSettings);
  const data = (await (
    await request("/v1/bookings/create", {
      ...enquiry,
      start: bookingSlots()[0].start,
      phone: "+2349090090910",
      smsOptIn: true,
      requestId: crypto.randomUUID(),
    })
  ).json()) as { booking: { id: string }; code: string };
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    throw new Error("private-provider-data");
  };
  try {
    await drainBookingMessages(env);
    await drainBookingMessages(env);
    assert.equal(calls, 1);
    assert.equal(
      sql
        .prepare(
          "SELECT state,last_error FROM booking_messages WHERE kind='confirmation'",
        )
        .get()!.state,
      "unknown",
    );
    sql.exec(
      "UPDATE booking_messages SET state='sending',lease_until='2000-01-01' WHERE kind='reminder_24h'",
    );
    await drainBookingMessages(env);
    assert.equal(calls, 1);
    assert.equal(
      sql
        .prepare("SELECT state FROM booking_messages WHERE kind='reminder_24h'")
        .get()!.state,
      "unknown",
    );
    await request("/v1/bookings/manage", {
      ...data.booking,
      code: data.code,
      action: "cancel",
    });
    assert.equal(
      sql
        .prepare("SELECT state FROM booking_messages WHERE kind='reminder_2h'")
        .get()!.state,
      "cancelled",
    );
  } finally {
    globalThis.fetch = original;
    sql.close();
  }
});
test("WhatsApp sender verification rejects the UK number and STOP is signed and scoped", async () => {
  const { sql, env, request } = setup();
  Object.assign(env, {
    BOOKING_ENABLED: "true",
    BOOKING_WHATSAPP_ENABLED: "true",
    BOOKING_WA_ACCESS_TOKEN: "test-token",
    BOOKING_WA_PHONE_NUMBER_ID: "1092109073976406",
    BOOKING_WA_GRAPH_VERSION: "v23.0",
    BOOKING_WA_CONFIRMATION_TEMPLATE: "booking_confirmed",
    BOOKING_WA_REMINDER_TEMPLATE: "booking_reminder",
    BOOKING_WA_CANCELLATION_TEMPLATE: "booking_cancelled",
    WHATSAPP_BRIDGE_SECRET: "test-bridge",
  });
  const data = (await (
    await request("/v1/bookings/create", {
      ...enquiry,
      start: bookingSlots()[0].start,
      phone: "09090090910",
      whatsappOptIn: true,
      requestId: crypto.randomUUID(),
    })
  ).json()) as { booking: { id: string }; code: string };
  const original = globalThis.fetch;
  const sends: Record<string, unknown>[] = [];
  globalThis.fetch = async () =>
    Response.json({ display_phone_number: "+44 7478 036301" });
  try {
    await drainBookingMessages(env);
    assert.equal(
      sql
        .prepare(
          "SELECT attempts FROM booking_messages WHERE kind='confirmation'",
        )
        .get()!.attempts,
      0,
    );
    globalThis.fetch = async (_url, options) => {
      if (!options?.body)
        return Response.json({ display_phone_number: "+234 909 009 0910" });
      sends.push(JSON.parse(String(options.body)));
      return Response.json({ messages: [{ id: "wamid.test" }] });
    };
    await drainBookingMessages(env);
    assert.equal(sends.length, 1);
    assert.equal(sends[0].type, "template");
    assert.equal(sends[0].to, "2349090090910");
    assert.ok(!JSON.stringify(sends).includes(data.code));
    assert.equal(
      (
        await request("/v1/whatsapp/notification-optout", {
          phone: "2349090090910",
        })
      ).status,
      401,
    );
    assert.equal(
      (
        await request(
          "/v1/whatsapp/notification-optout",
          { phone: "2349090090910" },
          crypto.randomUUID(),
          env.WHATSAPP_BRIDGE_SECRET,
        )
      ).status,
      200,
    );
    assert.equal(
      sql.prepare("SELECT whatsapp_opt_in FROM bookings").get()!
        .whatsapp_opt_in,
      0,
    );
    sql.exec("UPDATE booking_messages SET next_attempt_at='2000-01-01'");
    await drainBookingMessages(env);
    assert.equal(sends.length, 1);
  } finally {
    globalThis.fetch = original;
    sql.close();
  }
});
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
  const recovered = await request("/v1/bookings/recover", retryInput);
  assert.equal(recovered.status, 200);
  assert.equal(
    ((await recovered.json()) as { code: string }).code,
    result.code,
  );
  assert.equal(
    (
      await request("/v1/bookings/recover", {
        ...retryInput,
        email: "wrong@example.com",
      })
    ).status,
    404,
  );
  assert.equal(
    (
      await request("/v1/bookings/recover", {
        ...retryInput,
        requestId: crypto.randomUUID(),
      })
    ).status,
    404,
  );
  assert.equal(sql.prepare("SELECT count(*) n FROM bookings").get()!.n, 1);
  assert.equal(
    sql.prepare("SELECT count(*) n FROM booking_outbox").get()!.n,
    4,
  );
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
    sql.prepare("SELECT status FROM leads WHERE id=?").get(result.booking.id)!
      .status,
    "new",
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
