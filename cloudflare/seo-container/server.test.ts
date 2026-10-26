import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { request as httpRequest } from "node:http";
import type { AddressInfo } from "node:net";
import { createSeoServer } from "./server";
import { scannerGateway } from "./gateway";
import { SEO_NODE_PATH, seoNodeHeaders } from "../../lib/seo-node-auth";
import type { runSeoAudit } from "../../lib/seo-audit";
import { runContainerSeoAudit } from "../../lib/seo-node-client";

const key = "container-test-only-".repeat(3);

test("container HTTP server rejects unsigned, private, oversized and unexpected requests before scanning", async t => {
  let calls = 0;
  const audit = (async () => { calls++; return { ok: true, checks: [] }; }) as unknown as typeof runSeoAudit;
  const server = createSeoServer(key, audit).listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => { server.closeAllConnections(); server.close(); });
  const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const send = async (body: string, signed = true) => fetch(origin + SEO_NODE_PATH, {
    method: "POST", headers: signed ? seoNodeHeaders(body, key) : {}, body,
  });
  assert.equal((await fetch(origin + "/health")).status, 200);
  assert.equal((await fetch(origin + "/other")).status, 404);
  assert.equal((await fetch(origin + SEO_NODE_PATH)).status, 405);
  assert.equal((await send('{"websiteUrl":"https://example.com"}', false)).status, 401);
  assert.equal((await send('{"websiteUrl":"http://127.0.0.1"}')).status, 400);
  assert.equal((await send('{"websiteUrl":"https://example.com","email":"private@example.com"}')).status, 400);
  assert.equal((await send("not-json")).status, 400);
  assert.equal((await send("x".repeat(2049))).status, 413);
  const chunkedStatus = await new Promise<number>((resolve, reject) => {
    const request = httpRequest(origin + SEO_NODE_PATH, { method: "POST" }, response => {
      response.resume();
      resolve(response.statusCode!);
    });
    request.on("error", reject);
    request.write("x".repeat(1024));
    request.end("x".repeat(1025));
  });
  assert.equal(chunkedStatus, 413);
  assert.equal(calls, 0);
  assert.equal((await send('{"websiteUrl":"https://example.com"}')).status, 200);
  assert.equal(calls, 1);
});

test("container concurrency is bounded and scanner failures do not expose internals", async t => {
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  let started = 0;
  let both!: () => void;
  const admitted = new Promise<void>(resolve => { both = resolve; });
  const server = createSeoServer(key, (async () => {
    if (++started === 2) both();
    await pending;
    throw new Error("private backend detail");
  }) as typeof runSeoAudit).listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => { release(); server.closeAllConnections(); server.close(); });
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}${SEO_NODE_PATH}`;
  const body = '{"websiteUrl":"https://example.com"}';
  const send = () => fetch(url, { method: "POST", body, headers: seoNodeHeaders(body, key) });
  const first = send(), second = send();
  await admitted;
  assert.equal((await send()).status, 503);
  release();
  for (const response of await Promise.all([first, second])) {
    assert.equal(response.status, 502);
    assert.ok(!(await response.text()).includes("private backend detail"));
  }
});

test("gateway prevents unauthenticated container starts and strips unrelated credentials", async () => {
  let calls = 0;
  const forward = async (request: Request) => {
    calls++;
    assert.equal(request.headers.get("cookie"), null);
    assert.equal(request.headers.get("x-vercel-protection-bypass"), null);
    const body = await request.text();
    assert.equal(body, '{"websiteUrl":"https://example.com"}');
    return Response.json({ ok: true });
  };
  const make = (body: string, signed = true) => new Request("https://scanner" + SEO_NODE_PATH, {
    method: "POST", body, headers: { ...(signed ? seoNodeHeaders(body, key) : {}),
      cookie: "private-cookie", "x-vercel-protection-bypass": "private-bypass" },
  });
  assert.equal((await scannerGateway(make("{}", false), key, forward)).status, 401);
  assert.equal((await scannerGateway(make("x".repeat(2049)), key, forward)).status, 413);
  assert.equal((await scannerGateway(make('{"websiteUrl":"http://169.254.169.254"}'), key, forward)).status, 400);
  assert.equal(calls, 0);
  assert.equal((await scannerGateway(make('{"websiteUrl":"https://example.com"}'), key, forward)).status, 200);
  assert.equal(calls, 1);
});

test("website container client uses the private service and never forwards Vercel credentials", async () => {
  const service = { fetch: async (request: Request) => scannerGateway(request, key, async forwarded => {
    assert.equal(forwarded.headers.get("x-vercel-protection-bypass"), null);
    assert.equal(request.redirect, "manual");
    assert.equal(await forwarded.text(), '{"websiteUrl":"https://example.com"}');
    return Response.json({ ok: true, quickScore: 50, checks: [] });
  }) };
  assert.equal((await runContainerSeoAudit("https://example.com", service, key)).ok, true);
  await assert.rejects(runContainerSeoAudit("https://example.com", {
    fetch: async () => Response.redirect("https://other.example", 302),
  }, key), /redirect rejected/);
});
