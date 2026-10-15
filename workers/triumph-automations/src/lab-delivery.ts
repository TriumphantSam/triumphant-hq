import type { Env } from "./types";
type JobTable =
  | "lab_payment_jobs"
  | "review_jobs"
  | "review_invite_jobs"
  | "owner_report_jobs";
export async function claimLabJobs<T>(env: Env, table: JobTable, limit = 5) {
  if (
    ![
      "lab_payment_jobs",
      "review_jobs",
      "review_invite_jobs",
      "owner_report_jobs",
    ].includes(table) ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 5
  )
    throw new Error("Invalid job queue");
  const now = new Date().toISOString();
  await env.DB.prepare(
    `UPDATE ${table} SET state='unknown',lease_until=NULL WHERE state IN ('pending','sending') AND first_attempt_at<?`,
  )
    .bind(new Date(Date.now() - 23 * 3600000).toISOString())
    .run();
  const { results } = await env.DB.prepare(
    `UPDATE ${table} SET state='sending',lease_until=?,first_attempt_at=COALESCE(first_attempt_at,?) WHERE id IN (SELECT id FROM ${table} WHERE (state='pending' AND next_attempt_at<=?) OR (state='sending' AND lease_until<?) ORDER BY next_attempt_at LIMIT ${limit}) RETURNING *`,
  )
    .bind(new Date(Date.now() + 60000).toISOString(), now, now, now)
    .all<T>();
  return results;
}
