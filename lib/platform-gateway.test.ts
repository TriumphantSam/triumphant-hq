import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { POST } from "../app/api/platform/route";

test("platform gateway rejects cross-origin, oversized and unknown actions before a provider request", async () => {
  const secret = process.env.AUTOMATION_HMAC_SECRET,
    originalFetch = globalThis.fetch;
  process.env.AUTOMATION_HMAC_SECRET = "gateway-test-key-not-a-real-secret";
  let calls = 0;
  globalThis.fetch = (async () => {
    calls++;
    throw new Error("Unexpected upstream call");
  }) as typeof fetch;
  try {
    const make = (body: string, origin = "https://site.example") =>
      new Request("https://site.example/api/platform", {
        method: "POST",
        headers: { Origin: origin, "Content-Type": "application/json" },
        body,
      });
    assert.equal(
      (
        await POST(
          make(
            JSON.stringify({ action: "bootstrap" }),
            "https://attacker.example",
          ),
        )
      ).status,
      403,
    );
    assert.equal(
      (await POST(make(JSON.stringify({ action: "dump.all.clients" })))).status,
      400,
    );
    assert.equal((await POST(make("x".repeat(1048577)))).status, 413);
    for (const action of ["admin.platform", "platform.overview", "operator.read"])
      assert.equal((await POST(make(JSON.stringify({action})))).status,400);
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = originalFetch;
    if (secret === undefined) delete process.env.AUTOMATION_HMAC_SECRET;
    else process.env.AUTOMATION_HMAC_SECRET = secret;
  }
});
test("platform gateway signs trusted cookie context and never returns authentication cookies as JSON", async () => {
  const prior = {
      key: process.env.AUTOMATION_HMAC_SECRET,
      base: process.env.AUTOMATION_API_BASE,
    },
    originalFetch = globalThis.fetch;
  const key = "gateway-test-key-not-a-real-secret";
  process.env.AUTOMATION_HMAC_SECRET = key;
  process.env.AUTOMATION_API_BASE = "https://worker.example";
  let forwarded: Record<string, unknown> | undefined;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    assert.equal(String(input), "https://worker.example/v1/platform/rpc");
    const raw = String(init?.body),
      headers = new Headers(init?.headers);
    const expected = createHmac("sha256", key)
      .update(
        `${headers.get("x-triumph-timestamp")}\n${headers.get("x-triumph-nonce")}\nPOST\n/v1/platform/rpc\n${raw}`,
      )
      .digest("hex");
    assert.equal(headers.get("x-triumph-signature"), expected);
    forwarded = JSON.parse(raw);
    return Response.json({
      data: { ok: true },
      cookies: [
        "__Secure-triumph-platform.session_token=fixture; Path=/; HttpOnly; Secure; SameSite=Strict",
      ],
    });
  }) as typeof fetch;
  try {
    const response = await POST(
      new Request("https://site.example/api/platform", {
        method: "POST",
        headers: {
          Origin: "https://site.example",
          "Content-Type": "application/json",
          Cookie:
            "agency_owner=private; __Secure-triumph-platform.session_token=fixture; analytics=unrelated",
          "x-vercel-forwarded-for": "192.0.2.5",
        },
        body: JSON.stringify({
          action: "bootstrap",
          sessionCookie: "forged",
          ipKey: "forged",
          userId: "forged",
          role: "owner",
        }),
      }),
    );
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(
      forwarded?.sessionCookie,
      "__Secure-triumph-platform.session_token=fixture",
    );
    assert.equal(
      forwarded?.ipKey,
      createHmac("sha256", key).update("platform-ip:192.0.2.5").digest("hex"),
    );
    assert.equal(forwarded?.userId, undefined);
    assert.match(
      response.headers.getSetCookie()[0],
      /HttpOnly; Secure; SameSite=Strict/,
    );
    assert.match(response.headers.get("cache-control")!, /no-store/);
  } finally {
    globalThis.fetch = originalFetch;
    if (prior.key === undefined) delete process.env.AUTOMATION_HMAC_SECRET;
    else process.env.AUTOMATION_HMAC_SECRET = prior.key;
    if (prior.base === undefined) delete process.env.AUTOMATION_API_BASE;
    else process.env.AUTOMATION_API_BASE = prior.base;
  }
});
