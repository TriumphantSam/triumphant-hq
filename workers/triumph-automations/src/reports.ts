import type { Env } from "./types";

export function reportWindow(date: string, days: number) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || ![1, 7].includes(days))
    throw new Error("Invalid period");
  const midnight = new Date(`${date}T00:00:00.000Z`);
  if (
    !Number.isFinite(midnight.getTime()) ||
    midnight.toISOString().slice(0, 10) !== date
  )
    throw new Error("Invalid date");
  // Report includes the selected Lagos day, with an exclusive next-midnight bound.
  const end = midnight.getTime() + 86400000 - 3600000;
  return {
    start: new Date(end - days * 86400000).toISOString(),
    end: new Date(end).toISOString(),
    date,
    days,
    timezone: "Africa/Lagos",
  };
}

export async function privateReport(env: Env, date: string, days: number) {
  const window = reportWindow(date, days);
  const result = await env.DB.batch([
    env.DB.prepare(
      "SELECT COUNT(*) AS count FROM leads WHERE created_at>=? AND created_at<?",
    ).bind(window.start, window.end),
    env.DB.prepare(
      "SELECT COUNT(*) AS count FROM bookings WHERE created_at>=? AND created_at<?",
    ).bind(window.start, window.end),
    env.DB.prepare(
      "SELECT COUNT(*) AS count FROM bookings WHERE cancelled_at>=? AND cancelled_at<?",
    ).bind(window.start, window.end),
    env.DB.prepare(
      "SELECT COUNT(*) AS count FROM bookings WHERE status='confirmed' AND slot_start>=? AND slot_start<?",
    ).bind(
      window.end,
      new Date(Date.parse(window.end) + 7 * 86400000).toISOString(),
    ),
    env.DB.prepare(
      "SELECT COUNT(*) AS count FROM outbox WHERE state='failed' AND kind IN ('reply_email','owner_email')",
    ),
    env.DB.prepare(
      "SELECT COUNT(*) AS count FROM booking_outbox WHERE state='failed'",
    ),
    env.DB.prepare(
      "SELECT COUNT(*) AS count FROM booking_messages WHERE state IN ('failed','unknown')",
    ),
    env.DB.prepare("SELECT COUNT(*) AS count FROM leads WHERE sheet_synced=0"),
  ]);
  const count = (index: number) =>
    Number((result[index].results[0] as { count: number }).count);
  return {
    ok: true,
    source: "private_business_data",
    window,
    leadsCreated: count(0),
    bookingsCreated: count(1),
    cancellations: count(2),
    upcomingBookingsNext7Days: count(3),
    emailJobsFailed: count(4) + count(5),
    phoneJobsNeedingAttention: count(6),
    leadsAwaitingSheetSync: count(7),
    payments: null,
    invoices: null,
    stock: null,
    coverage: {
      payments: "not_connected",
      invoices: "not_connected",
      stock: "not_connected",
    },
    note: "Job and Sheet counts are the current backlog, not period totals. Test records are included until explicitly classified or removed.",
  };
}
