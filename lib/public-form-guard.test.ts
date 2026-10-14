import test from "node:test";
import assert from "node:assert/strict";
import { readPublicForm, validateLead, FormError } from "./public-form-guard";
import { createHmac } from "node:crypto";
const request = (body: string, ip = "test-ip") =>
  new Request("https://example.com/test", {
    method: "POST",
    headers: { "x-real-ip": ip },
    body,
  });
test("reject invalid JSON, arrays, oversized submissions and honeypots", async () => {
  for (const body of [
    "{",
    "null",
    "[]",
    JSON.stringify({ companyWebsite: "spam" }),
    JSON.stringify({ message: "x".repeat(17000) }),
  ])
    await assert.rejects(readPublicForm(request(body)));
});
test("validate actual email and name bounds", () => {
  validateLead("Person", "person@example.com");
  for (const email of ["person@", "@example.com", "person example@site.com"])
    assert.throws(() => validateLead("Person", email));
  assert.throws(() => validateLead("", "person@example.com"));
});
test("hourly process-local limiter rejects request six", async () => {
  for (let i = 0; i < 5; i++)
    await readPublicForm(request("{}", "rate-limit-test"));
  await assert.rejects(
    readPublicForm(request("{}", "rate-limit-test")),
    /hourly limit/,
  );
});

test("distributed admission uses the platform IP hash and fails closed", async () => {
  const keys = ["AUTOMATION_API_BASE", "AUTOMATION_HMAC_SECRET", "VERCEL"];
  const previous = keys.map(key => process.env[key]);
  const originalFetch = globalThis.fetch;
  Object.assign(process.env, { AUTOMATION_API_BASE: "https://worker.example", AUTOMATION_HMAC_SECRET: "test-only-hmac-key", VERCEL: "1" });
  const headers = { "x-vercel-forwarded-for": "203.0.113.7", "x-real-ip": "spoofed-client-header" };
  try {
    globalThis.fetch = async (_url, init) => {
      const body = JSON.parse(String(init?.body));
      assert.equal(body.ipKey, createHmac("sha256", "test-only-hmac-key").update("203.0.113.7").digest("hex"));
      assert.equal(String(init?.body).includes("203.0.113.7"), false);
      return Response.json({ allowed: false });
    };
    await assert.rejects(readPublicForm(new Request("https://example.com/distributed-test", { method: "POST", headers, body: "{}" })), error => error instanceof FormError && error.status === 429);
    globalThis.fetch = async () => { throw new Error("temporary upstream failure"); };
    await assert.rejects(readPublicForm(new Request("https://example.com/distributed-test", { method: "POST", headers, body: "{}" })), error => error instanceof FormError && error.status === 503);
  } finally {
    globalThis.fetch = originalFetch;
    keys.forEach((key, i) => { if(previous[i] === undefined) delete process.env[key]; else process.env[key] = previous[i]; });
  }
});

test("production Turnstile rejects valid tokens for a different hostname or action", async () => {
  const keys = ["NEXT_PUBLIC_TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY", "NODE_ENV"];
  const previous = keys.map(key => process.env[key]);
  const originalFetch = globalThis.fetch;
  Object.assign(process.env, { NEXT_PUBLIC_TURNSTILE_SITE_KEY: "test-sitekey", TURNSTILE_SECRET_KEY: "test-only-turnstile-secret", NODE_ENV: "production" });
  try {
    for (const check of [{ success: true, hostname: "unapproved.example", action: "lead_enquiry" }, { success: true, hostname: "triumphantech.com", action: "other_form" }]) {
      globalThis.fetch = async () => Response.json(check);
      await assert.rejects(readPublicForm(request(JSON.stringify({turnstileToken: "test-token"}), "turnstile-host-test")), /security check expired/);
    }
  } finally {
    globalThis.fetch = originalFetch;
    keys.forEach((key, i) => { if(previous[i] === undefined) delete process.env[key]; else process.env[key] = previous[i]; });
  }
});
