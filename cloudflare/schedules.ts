type ScheduleEnv = {
  SITE_CRON_ENABLED?: string;
  SEO_FOLLOWUP_CRON_SECRET?: string;
  FOLLOW_UP_RUNNER_SECRET?: string;
  CRON_SECRET?: string;
  WORKER_SELF_REFERENCE: { fetch: typeof fetch };
};

export async function runSchedule(cron: string, env: ScheduleEnv) {
  // Enable only at cutover, after disabling the equivalent Vercel schedules.
  if (env.SITE_CRON_ENABLED !== "true") return;
  const job = cron === "0 0 * * *"
    ? { path: "/api/seo/run-follow-ups", secret: env.SEO_FOLLOWUP_CRON_SECRET ?? env.CRON_SECRET }
    : cron === "0 2 * * *"
      ? { path: "/api/digital-forge/follow-ups/run", secret: env.FOLLOW_UP_RUNNER_SECRET ?? env.CRON_SECRET }
      : null;
  if (!job) throw new Error("Unknown site schedule");
  if (!job.secret) throw new Error("Site schedule secret is missing");
  const response = await env.WORKER_SELF_REFERENCE.fetch(new Request(
    `https://triumphantech.com${job.path}`,
    { headers: { authorization: `Bearer ${job.secret}` } },
  ));
  if (!response.ok) throw new Error(`Site schedule failed: ${response.status}`);
}
