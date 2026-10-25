import test from "node:test";
import assert from "node:assert/strict";
import { seoNodeHeaders, validSeoNodeRequest } from "./seo-node-auth";
import { POST } from "../app/api/internal/seo-snapshot/route";
import { runHostedSeoAudit } from "./seo-node-client";

const key = "seo-test-key-for-local-verification-only";
test("SEO bridge signatures expire and bind the exact request body", () => {
  const body = JSON.stringify({ websiteUrl: "https://example.com" });
  const now = 1792920000000;
  const headers = new Headers(seoNodeHeaders(body, key, now));
  assert.equal(validSeoNodeRequest(headers, body, key, now), true);
  assert.equal(validSeoNodeRequest(headers, body + " ", key, now), false);
  assert.equal(validSeoNodeRequest(headers, body, key, now + 60001), false);
  assert.equal(validSeoNodeRequest(headers, body, "", now), false);
  assert.equal(validSeoNodeRequest(headers, body, key + "x", now), false);
});

test("Node endpoint fails closed, rejects private targets, and is absent on Workers", async () => {
  const previous = { key: process.env.SEO_NODE_SHARED_SECRET, platform: process.env.HOSTING_PLATFORM };
  try {
    delete process.env.HOSTING_PLATFORM;
    process.env.SEO_NODE_SHARED_SECRET = key;
    const body = JSON.stringify({ websiteUrl: "http://127.0.0.1" });
    const request = (headers = {}) => new Request("https://node.example/api/internal/seo-snapshot", { method: "POST", body, headers });
    assert.equal((await POST(request())).status, 401);
    assert.equal((await POST(request(seoNodeHeaders(body, key)))).status, 400);
    process.env.HOSTING_PLATFORM = "cloudflare";
    assert.equal((await POST(request(seoNodeHeaders(body, key)))).status, 404);
  } finally {
    if (previous.key === undefined) delete process.env.SEO_NODE_SHARED_SECRET; else process.env.SEO_NODE_SHARED_SECRET = previous.key;
    if (previous.platform === undefined) delete process.env.HOSTING_PLATFORM; else process.env.HOSTING_PLATFORM = previous.platform;
  }
});

test("Workers sends no lead details and refuses credential-leaking redirects or invalid origins", async () => {
  const previous = { url: process.env.SEO_NODE_BACKEND_URL, key: process.env.SEO_NODE_SHARED_SECRET, bypass: process.env.SEO_NODE_VERCEL_BYPASS, fetch: globalThis.fetch };
  Object.assign(process.env, { SEO_NODE_BACKEND_URL: "https://private-scanner.vercel.app", SEO_NODE_SHARED_SECRET: key, SEO_NODE_VERCEL_BYPASS: "test-only-bypass" });
  try {
    globalThis.fetch = async (input, init) => {
      assert.equal(String(input), "https://private-scanner.vercel.app/api/internal/seo-snapshot");
      assert.equal(init?.redirect, "error");
      assert.deepEqual(JSON.parse(String(init?.body)), { websiteUrl: "https://example.com" });
      assert.equal(validSeoNodeRequest(new Headers(init?.headers), String(init?.body), key), true);
      return Response.json({ ok: true, checks: [], quickScore: 50 });
    };
    assert.equal((await runHostedSeoAudit("https://example.com")).quickScore, 50);
    process.env.SEO_NODE_BACKEND_URL = "https://attacker.example";
    await assert.rejects(runHostedSeoAudit("https://example.com"), /Invalid SEO/);
  } finally {
    globalThis.fetch = previous.fetch;
    for (const [envKey, value] of [["SEO_NODE_BACKEND_URL", previous.url], ["SEO_NODE_SHARED_SECRET", previous.key], ["SEO_NODE_VERCEL_BYPASS", previous.bypass]]) {
      if (value === undefined) delete process.env[envKey!]; else process.env[envKey!] = value;
    }
  }
});
