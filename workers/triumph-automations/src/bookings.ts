import { Hono } from "hono";
import { hmac } from "./security";
import type { Env } from "./types";

const DAY = 86400000,
  HOUR = 3600000;
type Booking = {
  id: string;
  request_id: string;
  fingerprint: string;
  name: string;
  email: string;
  phone: string;
  slot_start: string;
  slot_end: string;
  status: string;
};
type BookingJob = {
  id: string;
  booking_id: string;
  kind: string;
  attempts: number;
};
export function bookingSlots(now = Date.now()) {
  const day = Math.floor((now + HOUR) / DAY) * DAY - HOUR;
  const slots: { start: string; end: string }[] = [];
  for (let d = 0; d < 14; d++) {
    const midnight = day + d * DAY,
      weekday = new Date(midnight + HOUR).getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    for (let minute = 600; minute + 30 <= 960; minute += 45) {
      const start = midnight + minute * 60000;
      if (start < now + DAY) continue;
      slots.push({
        start: new Date(start).toISOString(),
        end: new Date(start + 1800000).toISOString(),
      });
    }
  }
  return slots;
}
const codeFor = (env: Env, id: string) =>
  hmac(env.AUTOMATION_HMAC_SECRET, `booking-management-v1\n${id}`);
function bookingInput(raw: string) {
  let input: Record<string, unknown>;
  try {
    input = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!input || Array.isArray(input)) return null;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email =
    typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  if (
    !name ||
    name.length > 120 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    phone.length > 30 ||
    typeof input.requestId !== "string" ||
    !/^[a-f0-9-]{36}$/.test(input.requestId) ||
    typeof input.start !== "string"
  )
    return null;
  return { name, email, phone, requestId: input.requestId, start: input.start };
}
const fingerprintFor = (
  env: Env,
  input: NonNullable<ReturnType<typeof bookingInput>>,
) =>
  hmac(
    env.AUTOMATION_HMAC_SECRET,
    JSON.stringify([input.name, input.email, input.phone, input.start]),
  );
async function authorised(env: Env, input: Record<string, unknown>) {
  if (
    typeof input.id !== "string" ||
    !/^[a-f0-9-]{36}$/.test(input.id) ||
    typeof input.code !== "string" ||
    !/^[a-f0-9]{64}$/.test(input.code)
  )
    return null;
  const expected = await codeFor(env, input.id);
  let difference = 0;
  for (let i = 0; i < 64; i++)
    difference |= expected.charCodeAt(i) ^ input.code.charCodeAt(i);
  if (difference) return null;
  return env.DB.prepare("SELECT * FROM bookings WHERE id=?")
    .bind(input.id)
    .first<Booking>();
}
export const bookingRoutes = new Hono<{
  Bindings: Env;
  Variables: { raw: string };
}>();
bookingRoutes.use("*", async (c, next) => {
  if (c.env.BOOKING_ENABLED !== "true")
    return c.json({ error: "Bookings are not available yet." }, 503);
  await next();
});
bookingRoutes.get("/slots", async (c) => {
  const rows = await c.env.DB.prepare(
    "SELECT slot_start FROM bookings WHERE status='confirmed' AND slot_start>=?",
  )
    .bind(new Date().toISOString())
    .all<{ slot_start: string }>();
  const taken = new Set(rows.results.map((r) => r.slot_start));
  return c.json({
    slots: bookingSlots().filter((s) => !taken.has(s.start)),
    timezone: "Africa/Lagos",
  });
});
bookingRoutes.post("/recover", async (c) => {
  const input = bookingInput(c.get("raw"));
  if (!input) return c.json({ error: "Invalid booking recovery." }, 400);
  // The private random request ID and exact bound details authorize read-only recovery.
  // This route cannot create a reservation, change it or queue another email.
  const existing = await c.env.DB.prepare(
    "SELECT * FROM bookings WHERE request_id=? AND fingerprint=?",
  )
    .bind(input.requestId, await fingerprintFor(c.env, input))
    .first<Booking>();
  if (!existing)
    return c.json(
      {
        error:
          "No matching booking was found. Check your confirmation email before booking again.",
      },
      404,
    );
  return c.json({
    booking: {
      id: existing.id,
      start: existing.slot_start,
      end: existing.slot_end,
      status: existing.status,
    },
    code: await codeFor(c.env, existing.id),
  });
});
bookingRoutes.post("/create", async (c) => {
  const input = bookingInput(c.get("raw"));
  if (!input)
    return c.json(
      { error: "Please include your name, email and a valid time." },
      400,
    );
  const { name, email, phone } = input;
  const fingerprint = await fingerprintFor(c.env, input);
  const existing = await c.env.DB.prepare(
    "SELECT * FROM bookings WHERE request_id=?",
  )
    .bind(input.requestId)
    .first<Booking>();
  if (existing) {
    if (existing.fingerprint !== fingerprint)
      return c.json({ error: "Please start a new booking." }, 409);
    return c.json({
      booking: {
        id: existing.id,
        start: existing.slot_start,
        end: existing.slot_end,
        status: existing.status,
      },
      code: await codeFor(c.env, existing.id),
    });
  }
  const slot = bookingSlots().find((s) => s.start === input.start);
  if (!slot)
    return c.json(
      { error: "Please choose an available time at least 24 hours ahead." },
      400,
    );
  const id = crypto.randomUUID(),
    now = new Date().toISOString();
  const kinds = [
    "confirmation",
    "owner_confirmation",
    "reminder_24h",
    "reminder_2h",
  ];
  try {
    await c.env.DB.batch([
      c.env.DB.prepare(
        "INSERT INTO bookings(id,request_id,fingerprint,created_at,slot_start,slot_end,name,email,phone) VALUES(?,?,?,?,?,?,?,?,?)",
      ).bind(
        id,
        input.requestId,
        fingerprint,
        now,
        slot.start,
        slot.end,
        name,
        email,
        phone,
      ),
      c.env.DB.prepare(
        "INSERT INTO leads(id,created_at,updated_at,source,name,email,phone,service,need) VALUES(?,?,?,'booking',?,?,?,'Automation consultation',?)",
      ).bind(
        id,
        now,
        now,
        name,
        email,
        phone,
        `30-minute consultation: ${slot.start}. Confirmation and reminders sent separately.`,
      ),
      c.env.DB.prepare(
        "INSERT INTO outbox(id,lead_id,kind,next_attempt_at) VALUES(?,?,'sheet',?)",
      ).bind(`${id}:sheet`, id, now),
      ...kinds.map((kind) =>
        c.env.DB.prepare(
          "INSERT INTO booking_outbox(id,booking_id,kind,next_attempt_at) VALUES(?,?,?,?)",
        ).bind(
          `${id}:${kind}`,
          id,
          kind,
          kind.startsWith("reminder")
            ? new Date(
                Date.parse(slot.start) -
                  (kind === "reminder_24h" ? 24 : 2) * HOUR,
              ).toISOString()
            : now,
        ),
      ),
    ]);
  } catch {
    // A unique capacity index arbitrates concurrent submissions; D1 rolls back the entire batch.
    const replay = await c.env.DB.prepare(
      "SELECT * FROM bookings WHERE request_id=? AND fingerprint=?",
    )
      .bind(input.requestId, fingerprint)
      .first<Booking>();
    if (replay)
      return c.json({
        booking: {
          id: replay.id,
          start: replay.slot_start,
          end: replay.slot_end,
          status: replay.status,
        },
        code: await codeFor(c.env, replay.id),
      });
    const occupied = await c.env.DB.prepare(
      "SELECT id FROM bookings WHERE slot_start=? AND status='confirmed'",
    )
      .bind(slot.start)
      .first();
    return occupied
      ? c.json(
          { error: "That time was just booked. Please choose another." },
          409,
        )
      : c.json({ error: "Booking is temporarily unavailable." }, 503);
  }
  return c.json(
    {
      booking: { id, start: slot.start, end: slot.end, status: "confirmed" },
      code: await codeFor(c.env, id),
    },
    201,
  );
});
bookingRoutes.post("/manage", async (c) => {
  let input: Record<string, unknown>;
  try {
    input = JSON.parse(c.get("raw"));
  } catch {
    return c.json({ error: "Invalid booking." }, 400);
  }
  if (!input || Array.isArray(input))
    return c.json({ error: "Invalid booking." }, 400);
  const booking = await authorised(c.env, input);
  if (!booking)
    return c.json(
      { error: "Booking reference or management code is incorrect." },
      404,
    );
  if (input.action === "cancel") {
    const now = new Date().toISOString();
    await c.env.DB.batch([
      c.env.DB.prepare(
        "UPDATE bookings SET status='cancelled',cancelled_at=? WHERE id=? AND status='confirmed'",
      ).bind(now, booking.id),
      c.env.DB.prepare(
        "UPDATE booking_outbox SET state='cancelled',lease_until=NULL WHERE booking_id=? AND kind IN ('reminder_24h','reminder_2h','confirmation','owner_confirmation') AND state IN ('pending','failed')",
      ).bind(booking.id),
      ...["cancellation", "owner_cancellation"].map((kind) =>
        c.env.DB.prepare(
          "INSERT INTO booking_outbox(id,booking_id,kind,next_attempt_at) VALUES(?,?,?,?) ON CONFLICT(booking_id,kind) DO NOTHING",
        ).bind(`${booking.id}:${kind}`, booking.id, kind, now),
      ),
      c.env.DB.prepare(
        "UPDATE leads SET need=?,updated_at=?,sheet_synced=0,status='lost' WHERE id=?",
      ).bind(`Cancelled consultation: ${booking.slot_start}`, now, booking.id),
      c.env.DB.prepare(
        "UPDATE outbox SET state='pending',next_attempt_at=? WHERE lead_id=? AND kind='sheet'",
      ).bind(now, booking.id),
    ]);
    booking.status = "cancelled";
  } else if (input.action !== "status")
    return c.json({ error: "Invalid action." }, 400);
  const deliveries = await c.env.DB.prepare(
    "SELECT kind,state FROM booking_outbox WHERE booking_id=?",
  )
    .bind(booking.id)
    .all();
  return c.json({
    booking: {
      id: booking.id,
      start: booking.slot_start,
      end: booking.slot_end,
      status: booking.status,
    },
    deliveries: deliveries.results,
  });
});

export async function drainBookingOutbox(env: Env) {
  if (env.BOOKING_ENABLED !== "true") return;
  const now = new Date().toISOString();
  const due = await env.DB.prepare(
    "SELECT id,booking_id,kind,attempts FROM booking_outbox WHERE (state='pending' OR (state='sending' AND lease_until<?)) AND next_attempt_at<=? AND attempts<10 ORDER BY next_attempt_at LIMIT 15",
  )
    .bind(now, now)
    .all<BookingJob>();
  for (const job of due.results) {
    const claim = await env.DB.prepare(
      "UPDATE booking_outbox SET state='sending',attempts=attempts+1,lease_until=? WHERE id=? AND (state='pending' OR (state='sending' AND lease_until<?)) RETURNING id",
    )
      .bind(new Date(Date.now() + 120000).toISOString(), job.id, now)
      .first();
    if (!claim) continue;
    const b = await env.DB.prepare("SELECT * FROM bookings WHERE id=?")
      .bind(job.booking_id)
      .first<Booking>();
    const cancellation = job.kind.includes("cancellation");
    if (
      !b ||
      (b.status === "cancelled" && !cancellation) ||
      (job.kind.startsWith("reminder") &&
        Date.parse(b.slot_start) <= Date.now())
    ) {
      await env.DB.prepare(
        "UPDATE booking_outbox SET state='cancelled',lease_until=NULL WHERE id=?",
      )
        .bind(job.id)
        .run();
      continue;
    }
    try {
      if (!env.RESEND_API_KEY || !env.EMAIL_FROM || !env.OWNER_EMAIL)
        throw new Error("email_not_configured");
      const owner = job.kind.startsWith("owner");
      const time = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Lagos",
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date(b.slot_start));
      const title = cancellation
        ? "Consultation cancelled"
        : job.kind.startsWith("reminder")
          ? "Consultation reminder"
          : "Consultation confirmed";
      const text = `${title}\n\nHi ${owner ? "TriumphantTech" : b.name},\n${cancellation ? "The appointment has been cancelled." : "Free 30-minute automation consultation."}\n${time} (Lagos / WAT)\nReference: ${b.id}\n\n${owner ? `Customer: ${b.name}\nEmail: ${b.email}\nPhone: ${b.phone || "Not provided"}` : cancellation ? "You can choose a new time on our booking page." : `Our team will email you the joining details.\nManage or cancel: open https://triumphantech.com/automation-lab/booking#manage and enter your reference and this private code:\n${await codeFor(env, b.id)}`}\n\nTriumphantTech\nadmin@triumphantech.com`;
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        signal: AbortSignal.timeout(8000),
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": job.id,
        },
        body: JSON.stringify({
          from: env.EMAIL_FROM,
          to: [owner ? env.OWNER_EMAIL : b.email],
          reply_to: owner ? b.email : env.OWNER_EMAIL,
          subject: `TriumphantTech: ${title}`,
          text,
        }),
      });
      if (!response.ok)
        throw new Error(`email_provider_failed_${response.status}`);
      await env.DB.prepare(
        "UPDATE booking_outbox SET state='sent',sent_at=?,lease_until=NULL,last_error=NULL WHERE id=?",
      )
        .bind(new Date().toISOString(), job.id)
        .run();
    } catch (error) {
      const reason =
        error instanceof Error &&
        /^(email_not_configured|email_provider_failed_[45]\d{2})$/.test(
          error.message,
        )
          ? error.message
          : "delivery_failed";
      await env.DB.prepare(
        "UPDATE booking_outbox SET state=?,next_attempt_at=?,lease_until=NULL,last_error=? WHERE id=?",
      )
        .bind(
          job.attempts >= 9 ? "failed" : "pending",
          new Date(
            Date.now() + Math.min(HOUR, 60000 * 2 ** job.attempts),
          ).toISOString(),
          reason,
          job.id,
        )
        .run();
    }
  }
}
