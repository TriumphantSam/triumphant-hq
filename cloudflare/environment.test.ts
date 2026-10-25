import test from "node:test";
import assert from "node:assert/strict";
import { siteEnvironment } from "./environment";
test("public config expansion preserves bindings and cannot replace private or platform settings", () => {
  const assets = { fetch: () => {} };
  const env = siteEnvironment({ ASSETS: assets, SITE_PREVIEW: "true", SITE_PUBLIC_CONFIG: JSON.stringify({ NEXT_PUBLIC_META_APP_ID: "test-app" }) });
  assert.equal(env.ASSETS, assets);
  assert.equal(env.SITE_PREVIEW, "true");
  assert.equal(env.NEXT_PUBLIC_META_APP_ID, "test-app");
  for (const bad of ["null", "[]", '{"DATABASE_URL":"override"}', '{"HOSTING_PLATFORM":"override"}', '{"__proto__":{}}', '{"NEXT_PUBLIC_TEST":{}}'])
    assert.throws(() => siteEnvironment({ SITE_PUBLIC_CONFIG: bad }), /Invalid public site configuration/);
});
