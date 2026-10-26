import test from "node:test";
import assert from "node:assert/strict";
import { clientIp } from "./client-ip";

test("Cloudflare client identity ignores spoofed forwarding headers", () => {
  const previous = process.env.HOSTING_PLATFORM;
  process.env.HOSTING_PLATFORM = "cloudflare";
  try {
    const headers = new Headers({
      "cf-connecting-ip": "203.0.113.20",
      "x-vercel-forwarded-for": "192.0.2.8",
      "x-real-ip": "192.0.2.9",
      "x-forwarded-for": "192.0.2.10",
    });
    assert.equal(clientIp(headers), "203.0.113.20");
    headers.delete("cf-connecting-ip");
    assert.equal(clientIp(headers), "unknown");
  } finally {
    if (previous === undefined) delete process.env.HOSTING_PLATFORM;
    else process.env.HOSTING_PLATFORM = previous;
  }
});
