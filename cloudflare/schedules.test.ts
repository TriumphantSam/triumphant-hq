import test from "node:test";
import assert from "node:assert/strict";
import { runSchedule } from "./schedules";

test("migration preview never sends scheduled follow-ups", async () => {
  const env = { WORKER_SELF_REFERENCE: { fetch: async () => { throw new Error("must not call"); } } };
  await runSchedule("0 0 * * *", env);
});

test("enabled schedules retain each existing route and dedicated secret", async () => {
  const requests: Request[] = [];
  const env = {
    SITE_CRON_ENABLED: "true", SEO_FOLLOWUP_CRON_SECRET: "seo-test-only",
    FOLLOW_UP_RUNNER_SECRET: "forge-test-only", CRON_SECRET: "fallback-test-only",
    WORKER_SELF_REFERENCE: { fetch: async (request: Request) => {
      requests.push(request); return new Response("{}");
    } },
  };
  await runSchedule("0 0 * * *", env);
  await runSchedule("0 2 * * *", env);
  assert.deepEqual(requests.map(request => [new URL(request.url).pathname, request.headers.get("authorization")]), [
    ["/api/seo/run-follow-ups", "Bearer seo-test-only"],
    ["/api/digital-forge/follow-ups/run", "Bearer forge-test-only"],
  ]);
  await assert.rejects(runSchedule("unknown", env), /Unknown/);
  env.WORKER_SELF_REFERENCE.fetch = async () => new Response("", { status: 502 });
  await assert.rejects(runSchedule("0 0 * * *", env), /502/);
});
