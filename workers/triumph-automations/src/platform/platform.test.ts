import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync } from "node:fs";
import {
  createWorkspace,
  requireWorkspace,
  saveProfile,
  saveFaqs,
  workspaceView,
  admit,
  plans,
} from "./core";
import { platformAuth } from "./auth";
import { conversationAction, responderDefaults } from "./conversations";
import type { Env } from "../types";
import { Hono } from "hono";
import { createPlatformRoutes } from "./routes";
import { matchFaq } from "./core";
import {
  publicWorkflow,
  policySlots,
  publishWorkspace,
  inbox,
  updateLead,
  ownerCancelBooking,
} from "./workflows";
test("private FAQ matching rejects generic words, repetition and ambiguous topics", () => {
  const faq = {
    id: "hours",
    question: "What are your consultation hours?",
    answer: "Weekdays ten to four.",
  };
  assert.equal(matchFaq("What are your bank details?", [faq]), null);
  assert.equal(matchFaq("consultation consultation consultation", [faq]), null);
  assert.equal(matchFaq("consultation hours please", [faq])?.id, "hours");
  assert.equal(
    matchFaq("consultation hours", [
      faq,
      { ...faq, id: "other", question: "Evening consultation hours" },
    ]),
    null,
  );
});
function setup() {
  const sql = new DatabaseSync(":memory:");
  sql.exec("PRAGMA foreign_keys=ON");
  const directory = new URL("../../migrations/", import.meta.url);
  for (const file of readdirSync(directory)
    .filter((f) => f.endsWith(".sql"))
    .sort())
    sql.exec(readFileSync(new URL(file, directory), "utf8"));
  type Value = string | number | null;
  function prepare(query: string) {
    let args: Value[] = [];
    const statement = {
      bind(...values: Value[]) {
        args = values;
        return statement;
      },
      async first() {
        return sql.prepare(query).get(...args) || null;
      },
      async all() {
        return { results: sql.prepare(query).all(...args), success: true };
      },
      async raw() {
        return sql
          .prepare(query)
          .all(...args)
          .map((row) => Object.values(row));
      },
      async run() {
        const result = sql.prepare(query).run(...args);
        return {
          success: true,
          meta: {
            changes: result.changes,
            last_row_id: Number(result.lastInsertRowid),
          },
        };
      },
      execute() {
        return { results: sql.prepare(query).all(...args), success: true };
      },
    };
    return statement;
  }
  const env: Env = {
    AUTOMATION_HMAC_SECRET: "platform-unit-test-secret-0123456789012345",
    ENVIRONMENT: "test",
    PLATFORM_ENABLED: "true",
    DB: {
      prepare,
      async batch(statements: ReturnType<typeof prepare>[]) {
        sql.exec("BEGIN");
        try {
          const result = statements.map((s) => s.execute());
          sql.exec("COMMIT");
          return result;
        } catch (e) {
          sql.exec("ROLLBACK");
          throw e;
        }
      },
    } as unknown as D1Database,
  };
  function user(id: string) {
    sql
      .prepare(
        "INSERT INTO platform_auth_user(id,name,email,email_verified,created_at,updated_at) VALUES(?,?,?,1,?,?)",
      )
      .run(id, id, `${id}@example.com`, Date.now(), Date.now());
  }
  return { sql, env, user };
}
test("real Better Auth OTP verifies ownership, stores only a hash and revokes the session", async () => {
  const { env, sql } = setup();
  let code = "";
  const auth = await platformAuth(env, async (_email, otp) => {
    code = otp;
  });
  const headers = new Headers({ origin: "https://platform.internal" });
  await auth.api.sendVerificationOTP({
    headers,
    body: { email: "owner@example.com", type: "sign-in" },
  });
  assert.match(code, /^\d{8}$/);
  const stored = sql
    .prepare("SELECT value FROM platform_auth_verification")
    .get()!;
  assert.ok(!String(stored.value).includes(code));
  await assert.rejects(
    auth.api.signInEmailOTP({
      headers,
      body: {
        email: "owner@example.com",
        otp: "00000000" === code ? "11111111" : "00000000",
      },
    }),
  );
  const response = await auth.api.signInEmailOTP({
    headers,
    body: { email: "owner@example.com", otp: code },
    asResponse: true,
  });
  assert.equal(response.status, 200);
  const cookies = response.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
  assert.match(cookies, /triumph-platform/);
  headers.set("cookie", cookies);
  const session = await auth.api.getSession({ headers });
  assert.equal(session?.user.emailVerified, true);
  assert.equal(session?.user.email, "owner@example.com");
  await assert.rejects(
    auth.api.signInEmailOTP({
      headers,
      body: { email: "owner@example.com", otp: code },
    }),
  );
  await auth.api.signOut({ headers });
  assert.equal(await auth.api.getSession({ headers }), null);
  sql.close();
});
test("workspace creation is idempotent per verified user and membership never crosses businesses", async () => {
  const { env, user, sql } = setup();
  user("alice");
  user("bob");
  const a = (await createWorkspace(env, "alice", "Alice Salon"))!;
  const again = (await createWorkspace(env, "alice", "Changed name"))!;
  const b = (await createWorkspace(env, "bob", "Bob Repairs"))!;
  assert.equal(a.id, again.id);
  assert.notEqual(a.id, b.id);
  await assert.rejects(requireWorkspace(env, "alice", b.id), /not found/);
  await assert.rejects(
    saveProfile(env, "bob", a.id, {
      name: "Attack",
      description: "",
      contactUrl: "",
      version: 0,
    }),
    /not found/,
  );
  assert.equal(
    sql.prepare("SELECT count(*) n FROM platform_workspaces").get()!.n,
    2,
  );
  sql.close();
});
test("stale profile or FAQ writes cannot overwrite or delete another saved version", async () => {
  const { env, user, sql } = setup();
  user("alice");
  const w = (await createWorkspace(env, "alice", "Alice Salon"))!;
  await saveProfile(env, "alice", w.id, {
    name: "Alice Salon",
    description: "Hair services",
    contactUrl: "https://example.com/contact",
    version: 0,
  });
  await assert.rejects(
    saveProfile(env, "alice", w.id, {
      name: "Stale",
      description: "",
      contactUrl: "",
      version: 0,
    }),
    /another tab/,
  );
  const faq = {
    id: crypto.randomUUID(),
    question: "What are your opening hours?",
    answer: "We open at ten.",
  };
  await saveFaqs(env, "alice", w.id, { version: 1, faqs: [faq] });
  await assert.rejects(
    saveFaqs(env, "alice", w.id, { version: 1, faqs: [] }),
    /another tab/,
  );
  const view = await workspaceView(env, "alice", w.id);
  assert.deepEqual(
    view.faqs.map((f) => ({ ...f })),
    [faq],
  );
  assert.equal(view.workspace.version, 2);
  assert.equal(view.readiness.whatsappConnected, false);
  assert.equal(view.readiness.billingActive, false);
  sql.close();
});
test("staff membership allows reading but never changing owner configuration", async () => {
  const { env, user, sql } = setup();
  user("alice");
  user("staff");
  const w = (await createWorkspace(env, "alice", "Alice Salon"))!;
  sql
    .prepare("INSERT INTO platform_memberships VALUES(?,?,'staff')")
    .run(w.id, "staff");
  assert.equal((await workspaceView(env, "staff", w.id)).workspace.id, w.id);
  await assert.rejects(
    saveFaqs(env, "staff", w.id, { version: 0, faqs: [] }),
    /Only the business owner/,
  );
  sql.close();
});
test("unsafe contact URLs, duplicate FAQ IDs and plan overflow are rejected", async () => {
  const { env, user, sql } = setup();
  user("alice");
  const w = (await createWorkspace(env, "alice", "Alice Salon"))!;
  for (const contactUrl of [
    "javascript:alert(1)",
    "http://example.com",
    "https://user:secret@example.com",
  ])
    await assert.rejects(
      saveProfile(env, "alice", w.id, {
        name: "Alice Salon",
        description: "",
        contactUrl,
        version: 0,
      }),
      /HTTPS/,
    );
  const faq = {
    id: crypto.randomUUID(),
    question: "Opening hours",
    answer: "Ten",
  };
  await assert.rejects(
    saveFaqs(env, "alice", w.id, { version: 0, faqs: [faq, faq] }),
    /Duplicate/,
  );
  await assert.rejects(
    saveFaqs(env, "alice", w.id, {
      version: 0,
      faqs: Array.from({ length: 21 }, () => ({
        ...faq,
        id: crypto.randomUUID(),
      })),
    }),
    /20/,
  );
  assert.ok(
    plans.every(
      (p) => Number.isSafeInteger(p.monthlyKobo) && p.monthlyKobo > 0,
    ),
  );
  sql.close();
});
test("durable admission applies across requests rather than isolate memory", async () => {
  const { env, sql } = setup();
  await admit(env, "otp:test", 2);
  await admit(env, "otp:test", 2);
  await assert.rejects(admit(env, "otp:test", 2), /Too many/);
  sql.close();
});
test("a full Business plan answer set saves atomically without a statement per answer", async () => {
  const { env, user, sql } = setup();
  user("business");
  const w = (await createWorkspace(env, "business", "Full catalogue"))!;
  sql
    .prepare("UPDATE platform_workspaces SET plan_id='business' WHERE id=?")
    .run(w.id);
  const faqs = Array.from({ length: 150 }, (_, i) => ({
    id: crypto.randomUUID(),
    question: `Service ${i} opening hours`,
    answer: "詳".repeat(1500),
  }));
  await saveFaqs(env, "business", w.id, { version: 0, faqs });
  assert.equal((await workspaceView(env, "business", w.id)).faqs.length, 150);
  await assert.rejects(
    saveFaqs(env, "business", w.id, { version: 0, faqs: [] }),
    /another tab/,
  );
  assert.equal((await workspaceView(env, "business", w.id)).faqs.length, 150);
  sql.close();
});
test("RPC requires an actual verified session and isolates private settings and test answers", async () => {
  const { env, sql } = setup();
  const codes = new Map<string, string>();
  const app = new Hono<{ Bindings: Env; Variables: { raw: string } }>();
  app.use("*", async (c, next) => {
    c.set("raw", await c.req.text());
    await next();
  });
  app.route(
    "/",
    createPlatformRoutes(async (email, otp) => {
      codes.set(email, otp);
    }),
  );
  async function call(
    action: string,
    payload: Record<string, unknown> = {},
    sessionCookie = "",
    ipKey = "a".repeat(64),
  ) {
    const response = await app.fetch(
      new Request("https://worker.example/rpc", {
        method: "POST",
        body: JSON.stringify({ action, payload, sessionCookie, ipKey }),
      }),
      env,
    );
    return {
      status: response.status,
      ...((await response.json()) as {
        data?: Record<string, unknown>;
        cookies?: string[];
        error?: string;
      }),
    };
  }
  const unauthenticated = await call("bootstrap", {
    userId: "owner",
    role: "owner",
  });
  assert.equal(unauthenticated.status, 401);
  async function login(email: string, ipKey: string) {
    assert.equal((await call("auth.send", { email }, "", ipKey)).status, 200);
    const response = await call(
      "auth.verify",
      { email, otp: codes.get(email) },
      "",
      ipKey,
    );
    assert.equal(response.status, 200);
    return response.cookies!.map((c) => c.split(";")[0]).join("; ");
  }
  const alice = await login("alice@example.com", "a".repeat(64)),
    bob = await login("bob@example.com", "b".repeat(64));
  const a = await call(
    "workspace.create",
    { name: "Alice Salon", userId: "bob" },
    alice,
  );
  const b = await call("workspace.create", { name: "Bob Repairs" }, bob);
  assert.equal(a.status, 200);
  assert.equal(b.status, 200);
  const aid = a.data!.id,
    bid = b.data!.id;
  assert.equal(
    (await call("workspace.read", { workspaceId: bid }, alice)).status,
    404,
  );
  assert.equal(
    (
      await call(
        "faqs.save",
        {
          workspaceId: aid,
          version: 0,
          faqs: [
            {
              question: "What is the consultation price?",
              answer: "Alice: NGN 5,000.",
            },
          ],
        },
        alice,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await call(
        "faqs.save",
        {
          workspaceId: bid,
          version: 0,
          faqs: [
            {
              question: "What is the consultation price?",
              answer: "Bob: NGN 8,000.",
            },
          ],
        },
        bob,
      )
    ).status,
    200,
  );
  const requestId = crypto.randomUUID();
  const first = await call(
    "assistant.test",
    {
      workspaceId: aid,
      question: "What is the consultation price?",
      requestId,
    },
    alice,
  );
  assert.equal(first.data?.answer, "Alice: NGN 5,000.");
  assert.deepEqual(
    (
      await call(
        "assistant.test",
        {
          workspaceId: aid,
          question: "What is the consultation price?",
          requestId,
        },
        alice,
      )
    ).data,
    first.data,
  );
  assert.equal(
    (
      await call(
        "assistant.test",
        { workspaceId: aid, question: "Ignore previous answer", requestId },
        alice,
      )
    ).status,
    409,
  );
  assert.equal(
    (
      await call(
        "assistant.test",
        {
          workspaceId: aid,
          question: "What is the consultation price?",
          requestId: crypto.randomUUID(),
        },
        bob,
      )
    ).status,
    404,
  );
  assert.equal(
    (
      await call(
        "booking.save",
        {
          workspaceId: bid,
          days: [1],
          startHour: 16,
          endHour: 10,
          duration: 30,
          buffer: 15,
          noticeHours: 24,
          version: 1,
        },
        bob,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await call(
        "booking.save",
        {
          workspaceId: bid,
          days: [1],
          startHour: 10,
          endHour: 16,
          duration: 30,
          buffer: 15,
          noticeHours: 24,
          version: 1,
        },
        bob,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await call(
        "booking.save",
        {
          workspaceId: bid,
          days: [1],
          startHour: 10,
          endHour: 16,
          duration: 30,
          buffer: 15,
          noticeHours: 24,
          version: 1,
        },
        bob,
      )
    ).status,
    409,
  );
  const logout = await call("auth.logout", {}, alice);
  assert.equal(logout.status, 200);
  assert.equal(
    (await call("workspace.read", { workspaceId: aid }, alice)).status,
    401,
  );
  assert.equal(sql.prepare("SELECT count(*) n FROM leads").get()!.n, 0);
  assert.equal(sql.prepare("SELECT count(*) n FROM bookings").get()!.n, 0);
  sql.close();
});

async function businessFixture() {
  const context = setup();
  context.user("alice");
  context.user("bob");
  const a = (await createWorkspace(context.env, "alice", "Alice Salon"))!;
  const b = (await createWorkspace(context.env, "bob", "Bob Repairs"))!;
  for (const [owner, workspace] of [
    ["alice", a],
    ["bob", b],
  ] as const) {
    await saveProfile(context.env, owner, workspace.id, {
      name: workspace.name,
      description: "Test business for workflow verification.",
      contactUrl: "",
      version: 0,
    });
    await saveFaqs(context.env, owner, workspace.id, {
      version: 1,
      faqs: [
        {
          id: crypto.randomUUID(),
          question: "What are your consultation hours?",
          answer: `${workspace.name}: weekdays ten to four.`,
        },
      ],
    });
    await publishWorkspace(context.env, owner, workspace.id, 2);
  }
  return { ...context, a, b };
}
const workflowNow = Date.parse("2026-10-19T08:00:00Z"),
  publicIp = "c".repeat(64);
test("public publication exposes only approved business facts and can be paused without leaking an inbox", async () => {
  const { env, a, b, sql } = await businessFixture();
  const data = await publicWorkflow(
    env,
    "public.read",
    { workspaceId: a.id },
    publicIp,
    workflowNow,
  );
  assert.equal(
    (data as { business: { name: string } }).business.name,
    "Alice Salon",
  );
  assert.doesNotMatch(
    JSON.stringify(data),
    /alice@example|owner_user_id|request_digest|manage_digest/,
  );
  await assert.rejects(inbox(env, "alice", b.id), /not found/);
  await publishWorkspace(env, "alice", a.id, 3, true);
  await assert.rejects(
    publicWorkflow(
      env,
      "public.read",
      { workspaceId: a.id },
      publicIp,
      workflowNow,
    ),
    /unavailable/,
  );
  env.ENVIRONMENT = "production";
  await assert.rejects(publishWorkspace(env, "bob", b.id, 3), /awaits billing/);
  await assert.rejects(
    publicWorkflow(
      env,
      "public.read",
      { workspaceId: b.id },
      publicIp,
      workflowNow,
    ),
    /not open/,
  );
  sql.close();
});
test("public enquiries retry safely and only members can update their own business records", async () => {
  const { env, a, b, sql } = await businessFixture();
  const payload = {
    workspaceId: a.id,
    requestId: crypto.randomUUID(),
    name: "Test Customer",
    email: "test@example.test",
    need: "I would like to discuss a consultation.",
    consent: true,
  };
  const first = (await publicWorkflow(
    env,
    "public.enquiry",
    payload,
    publicIp,
    workflowNow,
  )) as { reference: string };
  const retry = (await publicWorkflow(
    env,
    "public.enquiry",
    payload,
    publicIp,
    workflowNow,
  )) as { reference: string };
  assert.equal(first.reference, retry.reference);
  await assert.rejects(
    publicWorkflow(
      env,
      "public.enquiry",
      { ...payload, need: "Changed submission content." },
      publicIp,
      workflowNow,
    ),
    /reference has changed/,
  );
  await assert.rejects(
    publicWorkflow(
      env,
      "public.enquiry",
      { ...payload, requestId: crypto.randomUUID(), consent: false },
      publicIp,
      workflowNow,
    ),
    /permission/,
  );
  assert.equal((await inbox(env, "alice", a.id)).leads.length, 1);
  assert.equal((await inbox(env, "bob", b.id)).leads.length, 0);
  await assert.rejects(
    updateLead(env, "bob", {
      workspaceId: a.id,
      id: first.reference,
      version: 0,
      status: "won",
    }),
    /not found/,
  );
  await updateLead(env, "alice", {
    workspaceId: a.id,
    id: first.reference,
    version: 0,
    status: "contacted",
  });
  await assert.rejects(
    updateLead(env, "alice", {
      workspaceId: a.id,
      id: first.reference,
      version: 0,
      status: "won",
    }),
    /has changed/,
  );
  assert.equal(sql.prepare("SELECT count(*) n FROM leads").get()!.n, 0);
  assert.equal(sql.prepare("SELECT count(*) n FROM outbox").get()!.n, 0);
  sql.close();
});
test("tenant appointment capacity, policy changes, retries and private cancellation codes are enforced", async () => {
  const { env, a, b, sql } = await businessFixture();
  const availability = (await publicWorkflow(
    env,
    "public.slots",
    { workspaceId: a.id },
    publicIp,
    workflowNow,
  )) as { slots: { start: string }[] };
  const start = availability.slots[0].start;
  const payload = {
    workspaceId: a.id,
    requestId: crypto.randomUUID(),
    name: "Test Customer",
    email: "test@example.test",
    consent: true,
    start,
  };
  type Receipt = {
    reference: string;
    manageCode: string;
    start: string;
    state: string;
  };
  const receipt = (await publicWorkflow(
    env,
    "public.book",
    payload,
    publicIp,
    workflowNow,
  )) as Receipt;
  assert.equal(receipt.state, "confirmed");
  assert.match(receipt.manageCode, /^[a-f0-9]{64}$/);
  assert.deepEqual(
    await publicWorkflow(env, "public.book", payload, publicIp, workflowNow),
    receipt,
  );
  await assert.rejects(
    publicWorkflow(
      env,
      "public.book",
      { ...payload, requestId: crypto.randomUUID() },
      publicIp,
      workflowNow,
    ),
    /taken|changed/,
  );
  const other = (await publicWorkflow(
    env,
    "public.book",
    { ...payload, workspaceId: b.id, requestId: crypto.randomUUID() },
    publicIp,
    workflowNow,
  )) as Receipt;
  assert.equal(other.start, start);
  await assert.rejects(
    publicWorkflow(
      env,
      "public.cancel",
      {
        workspaceId: b.id,
        id: receipt.reference,
        manageCode: receipt.manageCode,
      },
      publicIp,
      workflowNow,
    ),
    /not found/,
  );
  await assert.rejects(
    ownerCancelBooking(env, "bob", {
      workspaceId: a.id,
      id: receipt.reference,
      version: 0,
    }),
    /not found/,
  );
  sql
    .prepare("UPDATE platform_booking_policy SET buffer=0 WHERE workspace_id=?")
    .run(a.id);
  const overlapping = new Date(Date.parse(start) + 30 * 60000).toISOString();
  await assert.rejects(
    publicWorkflow(
      env,
      "public.book",
      { ...payload, start: overlapping, requestId: crypto.randomUUID() },
      publicIp,
      workflowNow,
    ),
    /taken|changed/,
  );
  await publishWorkspace(env, "alice", a.id, 3, true);
  await publicWorkflow(
    env,
    "public.cancel",
    {
      workspaceId: a.id,
      id: receipt.reference,
      manageCode: receipt.manageCode,
    },
    publicIp,
    workflowNow,
  );
  await publicWorkflow(
    env,
    "public.cancel",
    {
      workspaceId: a.id,
      id: receipt.reference,
      manageCode: receipt.manageCode,
    },
    publicIp,
    workflowNow,
  );
  assert.equal(
    sql
      .prepare("SELECT version FROM platform_bookings WHERE id=?")
      .get(receipt.reference)!.version,
    1,
  );
  assert.equal(sql.prepare("SELECT count(*) n FROM bookings").get()!.n, 0);
  assert.equal(
    sql.prepare("SELECT count(*) n FROM booking_outbox").get()!.n,
    0,
  );
  sql.close();
});
test("simultaneous customers cannot reserve the same business slot", async () => {
  const { env, a, sql } = await businessFixture();
  const availability = (await publicWorkflow(
    env,
    "public.slots",
    { workspaceId: a.id },
    publicIp,
    workflowNow,
  )) as { slots: { start: string }[] };
  const payload = {
    workspaceId: a.id,
    name: "Test Customer",
    email: "test@example.test",
    consent: true,
    start: availability.slots[0].start,
  };
  const results = await Promise.allSettled([
    publicWorkflow(
      env,
      "public.book",
      { ...payload, requestId: crypto.randomUUID() },
      publicIp,
      workflowNow,
    ),
    publicWorkflow(
      env,
      "public.book",
      { ...payload, requestId: crypto.randomUUID() },
      publicIp,
      workflowNow,
    ),
  ]);
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal(
    sql.prepare("SELECT count(*) n FROM platform_bookings").get()!.n,
    1,
  );
  sql.close();
});
test("sandbox replies use only this business's facts and a duplicate does not inflate usage", async () => {
  const { env, a, b, sql } = await businessFixture();
  const input = {
    workspaceId: a.id,
    question: "What are your consultation hours?",
    requestId: crypto.randomUUID(),
  };
  const result = (await publicWorkflow(
    env,
    "public.ask",
    input,
    publicIp,
    workflowNow,
  )) as { answer: string };
  assert.match(result.answer, /^Alice Salon:/);
  await publicWorkflow(env, "public.ask", input, publicIp, workflowNow);
  assert.equal(
    sql
      .prepare(
        "SELECT count FROM platform_usage WHERE workspace_id=? AND kind='assistant_replies'",
      )
      .get(a.id)!.count,
    1,
  );
  const other = (await publicWorkflow(
    env,
    "public.ask",
    { ...input, workspaceId: b.id },
    publicIp,
    workflowNow,
  )) as { answer: string };
  assert.match(other.answer, /^Bob Repairs:/);
  sql
    .prepare("UPDATE platform_usage SET count=100 WHERE workspace_id=?")
    .run(a.id);
  await assert.rejects(
    publicWorkflow(
      env,
      "public.ask",
      { ...input, requestId: crypto.randomUUID() },
      publicIp,
      workflowNow,
    ),
    /allowance/,
  );
  assert.deepEqual(
    await publicWorkflow(env, "public.ask", input, publicIp, workflowNow),
    result,
  );
  sql.close();
});
test("appointment generation respects the business's Lagos hours, weekdays, buffer and notice", () => {
  const slots = policySlots(
    {
      days: "[1,2,3,4,5]",
      start_hour: 10,
      end_hour: 16,
      duration: 30,
      buffer: 15,
      notice_hours: 24,
    },
    workflowNow,
  );
  assert.equal(slots[0].start, "2026-10-20T09:00:00.000Z");
  assert.equal(
    Date.parse(slots[1].start) - Date.parse(slots[0].start),
    45 * 60000,
  );
  assert.ok(
    slots.every(
      (s) =>
        ![0, 6].includes(new Date(Date.parse(s.start) + 3600000).getUTCDay()),
    ),
  );
  assert.ok(slots.every((s) => Date.parse(s.start) >= workflowNow + 86400000));
});

test("sandbox reply allowances reset at midnight in Lagos", async () => {
  const { env, a, sql } = await businessFixture();
  sql.prepare("INSERT INTO platform_usage(workspace_id,period,kind,count) VALUES (?,?,'assistant_replies',100)")
    .run(a.id, "2026-10");
  const result = await publicWorkflow(env, "public.ask", {
    workspaceId: a.id,
    question: "What are your consultation hours?",
    requestId: crypto.randomUUID(),
  }, publicIp, Date.parse("2026-10-31T23:30:00Z"));
  assert.ok(result);
  assert.equal(sql.prepare("SELECT count FROM platform_usage WHERE workspace_id=? AND period='2026-11'").get(a.id)!.count, 1);
  sql.close();
});

test("responder settings are owner-only, isolated and reject stale saves", async () => {
  const {env,a,b,sql}=await businessFixture();
  const read=()=>conversationAction(env,"alice","responder.read",{workspaceId:a.id});
  assert.equal((await read() as {welcome:string}).welcome,responderDefaults.welcome);
  const input={workspaceId:a.id,...responderDefaults,welcome:"Hello from Alice"};
  assert.equal((await conversationAction(env,"alice","responder.save",input) as {version:number}).version,1);
  await assert.rejects(conversationAction(env,"alice","responder.save",input),/changed/);
  assert.equal((await conversationAction(env,"alice","responder.save",{...input,version:1}) as {version:number}).version,2);
  await assert.rejects(conversationAction(env,"bob","responder.read",{workspaceId:a.id}),/not found/);
  sql.prepare("INSERT INTO platform_memberships(workspace_id,user_id,role) VALUES (?,?,'staff')").run(a.id,"bob");
  await assert.rejects(conversationAction(env,"bob","responder.save",{...input,version:2}),/owner/);
  assert.equal((await conversationAction(env,"bob","responder.read",{workspaceId:b.id}) as {welcome:string}).welcome,responderDefaults.welcome);
  sql.close();
});

test("conversation rehearsal uses approved answers, pauses for team and STOP, and retries once",async()=>{
  const {env,a,sql}=await businessFixture();
  const workspaceId=a.id,id=crypto.randomUUID(),now=Date.parse("2026-10-19T10:00:00Z");
  type Chat={version:number;paused:boolean;messages:{role:string;text:string}[]};
  const call=async(action:string,input:Record<string,unknown>)=>await conversationAction(env,"alice",action,{workspaceId,id,...input},now) as Chat;
  await call("conversation.create",{label:"Invented customer"});
  const message={version:0,role:"customer",text:"What are your consultation hours?",requestId:crypto.randomUUID()};
  let chat=await call("conversation.message",message);
  assert.equal(chat.messages.length,3);
  assert.match(chat.messages[2].text,/Alice Salon/);
  assert.deepEqual(await call("conversation.message",message),chat);
  await assert.rejects(call("conversation.message",{...message,text:"Changed text"}),/reference/);
  await assert.rejects(call("conversation.pause",{version:0,paused:true}),/changed/);
  chat=await call("conversation.message",{version:1,role:"team",text:"I can help.",requestId:crypto.randomUUID()});
  assert.equal(chat.paused,true);
  chat=await call("conversation.message",{version:2,role:"customer",text:"consultation hours",requestId:crypto.randomUUID()});
  assert.equal(chat.messages.length,5);
  chat=await call("conversation.pause",{version:3,paused:false});
  chat=await call("conversation.message",{version:4,role:"customer",text:"STOP",requestId:crypto.randomUUID()});
  assert.equal(chat.paused,true);
  assert.equal(chat.messages.length,6);
  assert.equal((await workspaceView(env,"alice",workspaceId)).readiness.conversationTested,true);
  assert.equal(sql.prepare("SELECT count(*) n FROM platform_leads").get()!.n,0);
  sql.close();
});

test("conversations cannot cross tenants and production cannot simulate a connected channel",async()=>{
  const {env,a,b,sql}=await businessFixture();
  const id=crypto.randomUUID();
  await conversationAction(env,"alice","conversation.create",{workspaceId:a.id,id,label:"Test"});
  await assert.rejects(conversationAction(env,"bob","conversation.read",{workspaceId:a.id,id}),/not found/);
  await assert.rejects(conversationAction(env,"bob","conversation.read",{workspaceId:b.id,id}),/not found/);
  await assert.rejects(conversationAction({...env,ENVIRONMENT:"production"},"alice","conversation.create",{workspaceId:a.id,id:crypto.randomUUID(),label:"Test"}),/staging/);
  sql.close();
});

test("outside-hours and disabled responders behave without calling a provider",async()=>{
  const {env,a,sql}=await businessFixture();
  const workspaceId=a.id,id=crypto.randomUUID(),now=Date.parse("2026-10-19T22:00:00Z");
  await conversationAction(env,"alice","conversation.create",{workspaceId,id,label:"Evening test"},now);
  let chat=await conversationAction(env,"alice","conversation.message",{workspaceId,id,version:0,role:"customer",text:"consultation hours",requestId:crypto.randomUUID()},now) as {messages:{text:string}[]};
  assert.equal(chat.messages[2].text,responderDefaults.away);
  await conversationAction(env,"alice","responder.save",{workspaceId,...responderDefaults,enabled:false});
  chat=await conversationAction(env,"alice","conversation.message",{workspaceId,id,version:1,role:"customer",text:"consultation hours",requestId:crypto.randomUUID()},now) as {messages:{text:string}[]};
  assert.equal(chat.messages.length,4);
  sql.close();
});
