import test from "node:test";
import assert from "node:assert/strict";
import {
  inspectHtml,
  normalizeAuditUrl,
  isPublicAddress,
  fetchPublicPage,
  pinnedLookup,
} from "./seo-audit";

test('pinned DNS lookup supports Node single-address and all-address callbacks', () => {
  const record={address:'1.1.1.1',family:4}, lookup=pinnedLookup(record);
  lookup('example.com', {all:false}, (error,address,family) => {assert.equal(error,null);assert.equal(address,'1.1.1.1');assert.equal(family,4);});
  lookup('example.com', {all:true}, (error,addresses) => {assert.equal(error,null);assert.deepEqual(addresses,[record]);});
});

test("SSRF: reject private, reserved, mapped and transition addresses", () => {
  for (const address of [
    "127.0.0.1",
    "10.0.0.1",
    "172.16.0.1",
    "192.168.1.1",
    "169.254.169.254",
    "100.64.0.1",
    "0.0.0.0",
    "224.0.0.1",
    "192.0.2.1",
    "::1",
    "fe80::1",
    "fc00::1",
    "::ffff:127.0.0.1",
    "2002:7f00:1::",
    "2001:db8::1",
  ])
    assert.equal(isPublicAddress(address), false, address);
  for (const address of ["8.8.8.8", "1.1.1.1", "2606:4700:4700::1111"])
    assert.equal(isPublicAddress(address), true, address);
});
test("SSRF: normalize common inputs and block unsafe URLs", () => {
  assert.equal(normalizeAuditUrl("example.com").href, "https://example.com/");
  for (const url of [
    "http://localhost",
    "http://0x7f000001",
    "http://2130706433",
    "http://127.1",
    "http://[::1]",
    "http://192.168.1.1",
    "https://example.com:3000",
    "https://user:pass@example.com",
    "file:///etc/passwd",
  ])
    assert.throws(() => normalizeAuditUrl(url), { name: "Error" }, url);
});
test("safe fetch rejects private DNS before opening the socket", async () => {
  await assert.rejects(
    fetchPublicPage("https://localtest.me"),
    /public servers/,
  );
});
test("HTML parser handles reordered attributes, entities, uppercase tags and nested JSON-LD", () => {
  const html = `<html><head><TITLE>Helpful &amp; trustworthy local business services</TITLE><meta content="A helpful description of local business services with enough useful information for customers to choose what they need today." name="description"><meta content="width=device-width" name="viewport"><meta property="og:title" content="Example"><meta content="Description" property="og:description"><meta property="og:image" content="/cover.png"><link href="https://example.com/" rel="canonical"><script type="application/ld+json">{"@graph":[{"@type":["Organization","LocalBusiness"]}]}</script></head><body><h1>Services</h1><img src="/decorative.png" alt=""><a href="/contact">Contact</a><a href="https://other.example/">Partner</a><p>${"Useful content ".repeat(100)}</p><script>${"ignored ".repeat(100)}</script></body></html>`;
  const checks = inspectHtml(html, new URL("https://example.com"), 500, 100);
  for (const id of [
    "title",
    "description",
    "viewport",
    "open_graph",
    "canonical",
    "local_business",
    "h1",
    "image_alt",
    "content",
    "links",
  ])
    assert.equal(checks.find((c) => c.id === id)?.passed, true, id);
  assert.match(
    checks.find((c) => c.id === "links")!.detail,
    /1 internal and 1 external/,
  );
});
test("missing and conflicting tags produce measured failures without inventing findings", () => {
  const checks = inspectHtml(
    '<html><head><meta name="robots" content="noindex"></head><body><h1>One</h1><h1>Two</h1><img src="/x"></body></html>',
    new URL("http://example.com"),
    200,
    3000,
  );
  for (const id of [
    "https",
    "title",
    "description",
    "robots",
    "h1",
    "image_alt",
    "response_time",
  ])
    assert.equal(checks.find((c) => c.id === id)?.passed, false, id);
  assert.equal(checks.find((c) => c.id === "local_business")?.passed, null);
});
