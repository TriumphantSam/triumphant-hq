import test from "node:test";
import assert from "node:assert/strict";
import { handleScan } from "./functions/seo-snapshot.mjs";
import { seoNodeHeaders } from "../../lib/seo-node-auth";

const secret = "netlify-local-test-secret-at-least-32-characters";
function request(value: unknown, signed = true) {
  const body = JSON.stringify(value);
  return new Request("https://scanner.netlify.app/api/internal/seo-snapshot", {
    method: "POST", body, headers: signed ? seoNodeHeaders(body, secret) : {},
  });
}
test("Netlify scanner refuses unsigned requests, private addresses and oversized bodies", async () => {
  assert.equal((await handleScan(request({ websiteUrl: "https://example.com" }, false), secret)).status, 401);
  assert.equal((await handleScan(request({ websiteUrl: "http://127.0.0.1" }), secret)).status, 400);
  assert.equal((await handleScan(request({ websiteUrl: "http://localtest.me" }), secret)).status, 400);
  assert.equal((await handleScan(request({ websiteUrl: "x".repeat(3000) }), secret)).status, 413);
  assert.equal((await handleScan(request({ websiteUrl: "https://example.com", email: "private@example.com" }), secret)).status, 400);
});
test("Netlify runs the existing scanner and returns uncached results", async () => {
  const response = await handleScan(request({ websiteUrl: "https://example.com" }), secret);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control") || "", /no-store/);
  const result = await response.json();
  assert.equal(result.ok, true);
  assert.equal(result.checks.length, 17);
});
