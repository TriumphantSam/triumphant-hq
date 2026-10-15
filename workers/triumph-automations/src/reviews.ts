import { Hono } from "hono";
import type { Env } from "./types";
import { hmac } from "./security";
import { claimLabJobs } from "./lab-delivery";
export const GOOGLE_REVIEW_URL = "https://g.page/r/CYfV5FDkEGq_EAI/review";
export const reviewRoutes = new Hono<{
  Bindings: Env;
  Variables: { raw: string };
}>();
reviewRoutes.post("/invite", async (c) => {
  let input;
  try {
    input = JSON.parse(c.get("raw"));
  } catch {
    return c.json({ error: "Invalid request." }, 400);
  }
  if (!/^[a-f0-9-]{36}$/.test(input.id || ""))
    return c.json({ error: "Invalid request." }, 400);
  const invite = await c.env.DB.prepare(
    "SELECT id,email FROM review_invites WHERE id=? AND created_at>?",
  )
    .bind(input.id, new Date(Date.now() - 90 * 86400000).toISOString())
    .first<{ id: string; email: string }>();
  if (!invite)
    return c.json({ error: "This invitation is unavailable or expired." }, 404);
  if (input.action === "stop") {
    const hash = await hmac(
      c.env.AUTOMATION_HMAC_SECRET,
      "review-contact:" + invite.email.toLowerCase(),
    );
    await c.env.DB.batch([
      c.env.DB.prepare(
        "UPDATE review_contacts SET opted_out=1 WHERE email_hash=?",
      ).bind(hash),
      c.env.DB.prepare(
        "UPDATE review_invite_jobs SET state='cancelled' WHERE state='pending' AND invite_id IN (SELECT id FROM review_invites WHERE email=?)",
      ).bind(invite.email),
    ]);
    return c.json({ ok: true, stopped: true });
  }
  if (input.action === "click")
    await c.env.DB.prepare(
      "UPDATE review_invites SET clicked_at=COALESCE(clicked_at,?) WHERE id=?",
    )
      .bind(new Date().toISOString(), invite.id)
      .run();
  else if (input.action !== "status")
    return c.json({ error: "Invalid action." }, 400);
  return c.json({ ok: true, googleReviewUrl: GOOGLE_REVIEW_URL });
});
reviewRoutes.post("/feedback", async (c) => {
  let input;
  try {
    input = JSON.parse(c.get("raw"));
  } catch {
    return c.json({ error: "Invalid feedback." }, 400);
  }
  if (
    !Number.isInteger(input.rating) ||
    input.rating < 1 ||
    input.rating > 5 ||
    typeof input.feedback !== "string" ||
    input.feedback.length > 2000 ||
    typeof input.name !== "string" ||
    input.name.length > 80 ||
    typeof input.email !== "string" ||
    input.email.length > 254 ||
    (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) ||
    !/^[a-f0-9-]{36}$/.test(input.requestId || "")
  )
    return c.json(
      {
        error:
          "Choose a rating from 1 to 5 and provide valid optional details.",
      },
      400,
    );
  const now = new Date().toISOString();
  await c.env.DB.batch([
    c.env.DB.prepare(
      "INSERT INTO review_feedback(id,created_at,rating,feedback,name,email) VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING",
    ).bind(
      input.requestId,
      now,
      input.rating,
      input.feedback.trim(),
      input.name.trim(),
      input.email.trim(),
    ),
    c.env.DB.prepare(
      "INSERT INTO review_jobs(id,feedback_id,next_attempt_at) VALUES(?,?,?) ON CONFLICT(id) DO NOTHING",
    ).bind(input.requestId + ":owner", input.requestId, now),
  ]);
  return c.json({
    ok: true,
    reference: input.requestId,
    googleReviewUrl: GOOGLE_REVIEW_URL,
    ownerAlert: "queued",
  });
});
export async function drainReviewJobs(env: Env) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM || !env.OWNER_EMAIL) return;
  const results = await claimLabJobs<{
    id: string;
    feedback_id: string;
    attempts: number;
  }>(env, "review_jobs");
  for (const job of results) {
    const feedback = await env.DB.prepare(
      "SELECT * FROM review_feedback WHERE id=?",
    )
      .bind(job.feedback_id)
      .first<{
        rating: number;
        feedback: string;
        name: string;
        email: string;
      }>();
    if (!feedback) continue;
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
          subject: "Private customer feedback received",
          text: `Rating: ${feedback.rating}/5\nName: ${feedback.name || "Not provided"}\nEmail: ${feedback.email || "Not provided"}\nFeedback: ${feedback.feedback || "No written feedback"}\nReference: ${job.feedback_id}\nEvery rating has the same Google review option.`,
        }),
        signal: AbortSignal.timeout(8000),
        redirect: "manual",
      });
      if (!response.ok) {
        console.warn("review_email_rejected", { status: response.status });
        throw new Error("Rejected");
      }
      await env.DB.prepare(
        "UPDATE review_jobs SET state='sent',lease_until=NULL WHERE id=?",
      )
        .bind(job.id)
        .run();
    } catch {
      const attempts = job.attempts + 1;
      await env.DB.prepare(
        "UPDATE review_jobs SET state=?,attempts=?,lease_until=NULL,next_attempt_at=? WHERE id=?",
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
export async function drainReviewInvites(env: Env) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return;
  const results = await claimLabJobs<{
    id: string;
    invite_id: string;
    attempts: number;
  }>(env, "review_invite_jobs");
  for (const job of results) {
    const invite = await env.DB.prepare(
      "SELECT id,email FROM review_invites WHERE id=?",
    )
      .bind(job.invite_id)
      .first<{ id: string; email: string }>();
    if (!invite) continue;
    const hash = await hmac(
      env.AUTOMATION_HMAC_SECRET,
      "review-contact:" + invite.email.toLowerCase(),
    );
    const contact = await env.DB.prepare(
      "SELECT opted_out FROM review_contacts WHERE email_hash=?",
    )
      .bind(hash)
      .first<{ opted_out: number }>();
    if (contact?.opted_out) {
      await env.DB.prepare(
        "UPDATE review_invite_jobs SET state='cancelled' WHERE id=?",
      )
        .bind(job.id)
        .run();
      continue;
    }
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
          to: invite.email,
          subject: "How was your TriumphantTech consultation?",
          text: `Thank you for your consultation. You gave permission for one honest feedback request.\nAll ratings are welcome; the same Google review option is available to everyone. Private feedback is optional.\nReview or stop future review invitations: https://triumphantech.com/automation-lab/reviews?request=${invite.id}\nNo incentive is offered.\nQuestions: admin@triumphantech.com`,
        }),
        signal: AbortSignal.timeout(8000),
        redirect: "manual",
      });
      if (!response.ok) throw new Error("Rejected");
      await env.DB.prepare(
        "UPDATE review_invite_jobs SET state='sent',lease_until=NULL WHERE id=?",
      )
        .bind(job.id)
        .run();
    } catch {
      const attempts = job.attempts + 1;
      await env.DB.prepare(
        "UPDATE review_invite_jobs SET state=?,attempts=?,lease_until=NULL,next_attempt_at=? WHERE id=?",
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
