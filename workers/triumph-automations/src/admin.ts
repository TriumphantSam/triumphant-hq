import { Hono } from "hono";
import type { Env } from "./types";
import { privateReport } from "./reports";
import { hmac } from "./security";
import { claimLabJobs } from "./lab-delivery";
import facts from "../../../content/kb/business.json";
export const adminRoutes = new Hono<{
  Bindings: Env;
  Variables: { raw: string };
}>();
export async function generateDrafts(env: Env, now = new Date()) {
  const monday = new Date(now.getTime() + 3600000);
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
  const week = monday.toISOString().slice(0, 10),
    created = now.toISOString();
  await env.DB.batch(
    facts
      .filter((fact) => ["websites", "seo", "booking"].includes(fact.id))
      .map((fact) =>
        env.DB.prepare(
          "INSERT INTO social_drafts(id,created_at,body,source) VALUES(?,?,?,?) ON CONFLICT(id) DO NOTHING",
        ).bind(
          week + ":" + fact.id,
          created,
          fact.text + " Learn more: https://triumphantech.com" + fact.href,
          fact.href,
        ),
      ),
  );
}
export async function completeConsultation(env: Env, id: string) {
  const booking = await env.DB.prepare(
    "SELECT id,email,slot_end,status,review_opt_in,completed_at FROM bookings WHERE id=?",
  )
    .bind(id)
    .first<{
      id: string;
      email: string;
      slot_end: string;
      status: string;
      review_opt_in: number;
      completed_at: string | null;
    }>();
  if (
    !booking ||
    booking.status !== "confirmed" ||
    Date.parse(booking.slot_end) > Date.now()
  )
    return {
      ok: false,
      error:
        "Only a delivered, uncancelled consultation whose time has passed can be completed.",
    };
  const now = new Date().toISOString(),
    invite = crypto.randomUUID(),
    emailHash = await hmac(
      env.AUTOMATION_HMAC_SECRET,
      "review-contact:" + booking.email.toLowerCase(),
    );
  const statements = [
    env.DB.prepare(
      "UPDATE bookings SET completed_at=? WHERE id=? AND completed_at IS NULL",
    ).bind(now, id),
  ];
  if (booking.review_opt_in && !booking.completed_at) {
    statements.push(
      env.DB.prepare(
        "INSERT INTO review_contacts(email_hash,last_requested_at,invite_id) VALUES(?,?,?) ON CONFLICT(email_hash) DO UPDATE SET last_requested_at=excluded.last_requested_at,invite_id=excluded.invite_id WHERE last_requested_at<? AND opted_out=0",
      ).bind(
        emailHash,
        now,
        invite,
        new Date(Date.now() - 90 * 86400000).toISOString(),
      ),
      env.DB.prepare(
        "INSERT INTO review_invites(id,booking_id,created_at,email) SELECT ?,?,?,? WHERE EXISTS(SELECT 1 FROM review_contacts WHERE email_hash=? AND invite_id=?) ON CONFLICT(booking_id) DO NOTHING",
      ).bind(invite, id, now, booking.email, emailHash, invite),
      env.DB.prepare(
        "INSERT INTO review_invite_jobs(id,invite_id,next_attempt_at) SELECT ?,?,? WHERE EXISTS(SELECT 1 FROM review_invites WHERE id=?) ON CONFLICT(id) DO NOTHING",
      ).bind(invite + ":request", invite, now, invite),
    );
  }
  await env.DB.batch(statements);
  return { ok: true, reviewPermission: Boolean(booking.review_opt_in) };
}
adminRoutes.post("/dashboard", async (c) => {
  let input;
  try {
    input = JSON.parse(c.get("raw"));
  } catch {
    return c.json({ error: "Invalid report." }, 400);
  }
  let report;
  try {
    report = await privateReport(c.env, input.date, input.days);
  } catch {
    return c.json({ error: "Invalid report period." }, 400);
  }
  const [leads, bookings, drafts, feedback] = await Promise.all([
    c.env.DB.prepare(
      "SELECT id,name,email,service FROM leads ORDER BY created_at DESC LIMIT 20",
    ).all(),
    c.env.DB.prepare(
      "SELECT id,name,email,slot_start,slot_end,completed_at,review_opt_in FROM bookings WHERE status='confirmed' ORDER BY created_at DESC LIMIT 20",
    ).all(),
    c.env.DB.prepare(
      "SELECT id,body,source,state FROM social_drafts ORDER BY created_at DESC LIMIT 12",
    ).all(),
    c.env.DB.prepare(
      "SELECT id,rating,feedback,name FROM review_feedback ORDER BY created_at DESC LIMIT 20",
    ).all(),
  ]);
  return c.json({
    ok: true,
    report,
    leads: leads.results,
    bookings: bookings.results,
    drafts: drafts.results,
    feedback: feedback.results,
  });
});
adminRoutes.post("/action", async (c) => {
  let input;
  try {
    input = JSON.parse(c.get("raw"));
  } catch {
    return c.json({ error: "Invalid action." }, 400);
  }
  if (input.action === "generate_drafts") {
    await generateDrafts(c.env);
    return c.json({ ok: true });
  }
  if (
    input.action === "complete_booking" &&
    /^[a-f0-9-]{36}$/.test(input.id || "")
  ) {
    const result = await completeConsultation(c.env, input.id);
    return c.json(result, result.ok ? 200 : 400);
  }
  if (
    input.action === "approve_draft" &&
    /^\d{4}-\d{2}-\d{2}:(websites|seo|booking)$/.test(input.id || "")
  ) {
    const result = await c.env.DB.prepare(
      "UPDATE social_drafts SET state='approved' WHERE id=? RETURNING id",
    )
      .bind(input.id)
      .first();
    return result
      ? c.json({ ok: true, published: false })
      : c.json({ error: "Draft not found." }, 404);
  }
  return c.json({ error: "Invalid action." }, 400);
});
export async function scheduleOwnerReports(env: Env, now = new Date()) {
  const lagos = new Date(now.getTime() + 3600000);
  if (lagos.getUTCHours() !== 8) return;
  if (lagos.getUTCDay() === 1) await generateDrafts(env, now);
  if (env.REPORTS_EMAIL_ENABLED !== "true") return;
  // Every run in the 08:00 hour may recover a missed tick. Unique date claims once.
  const date = new Date(lagos.getTime() - 86400000).toISOString().slice(0, 10),
    days = lagos.getUTCDay() === 1 ? 7 : 1;
  const report = await privateReport(env, date, days),
    id = "owner-report:" + date;
  await env.DB.prepare(
    "INSERT INTO owner_report_jobs(id,created_at,report,next_attempt_at) VALUES(?,?,?,?) ON CONFLICT(id) DO NOTHING",
  )
    .bind(
      id,
      now.toISOString(),
      JSON.stringify(report, null, 2),
      now.toISOString(),
    )
    .run();
}
export async function drainOwnerReports(env: Env) {
  if (
    env.REPORTS_EMAIL_ENABLED !== "true" ||
    !env.RESEND_API_KEY ||
    !env.EMAIL_FROM ||
    !env.OWNER_EMAIL
  )
    return;
  const results = await claimLabJobs<{
    id: string;
    report: string;
    attempts: number;
  }>(env, "owner_report_jobs", 3);
  for (const job of results) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + env.RESEND_API_KEY,
          "Content-Type": "application/json",
          "Idempotency-Key": job.id,
        },
        body: JSON.stringify({
          from: env.EMAIL_FROM,
          to: env.OWNER_EMAIL,
          subject: "TriumphantTech operational report",
          text:
            job.report +
            "\nPrivate owner workspace: https://triumphantech.com/admin\nTest records are included in operational counts; payment totals here are unavailable until live billing is connected.",
        }),
        signal: AbortSignal.timeout(8000),
        redirect: "manual",
      });
      if (!response.ok) throw new Error("Rejected");
      await env.DB.prepare(
        "UPDATE owner_report_jobs SET state='sent',lease_until=NULL WHERE id=?",
      )
        .bind(job.id)
        .run();
    } catch {
      const attempts = job.attempts + 1;
      await env.DB.prepare(
        "UPDATE owner_report_jobs SET state=?,attempts=?,lease_until=NULL,next_attempt_at=? WHERE id=?",
      )
        .bind(
          attempts >= 10 ? "failed" : "pending",
          attempts,
          new Date(Date.now() + 2 ** attempts * 60000).toISOString(),
          job.id,
        )
        .run();
    }
  }
}
