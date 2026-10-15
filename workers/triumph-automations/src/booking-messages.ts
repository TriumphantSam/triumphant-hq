import type { Env } from "./types";
const BUSINESS_NUMBER = "2349090090910";
type Channel = "sms" | "whatsapp";
export type MessageBooking = {
  id: string;
  name: string;
  phone: string;
  slot_start: string;
  status: string;
  whatsapp_opt_in: number;
  sms_opt_in: number;
};
type MessageJob = {
  id: string;
  booking_id: string;
  channel: Channel;
  kind: string;
  attempts: number;
};
function termiiBase(env: Env) {
  try {
    const url = new URL(env.TERMII_API_BASE || "");
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.port ||
      !/^(?:[a-z0-9-]+\.)*termii\.(?:com|ai)$/.test(url.hostname) ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    )
      return null;
    return url.origin;
  } catch {
    return null;
  }
}
export function messageChannels(env: Env) {
  return {
    sms:
      env.BOOKING_SMS_ENABLED === "true" &&
      Boolean(
        env.TERMII_API_KEY &&
        termiiBase(env) &&
        /^[A-Za-z0-9 ]{3,11}$/.test(env.TERMII_SENDER_ID || "") &&
        env.TERMII_DND_APPROVED === "true",
      ),
    whatsapp:
      env.BOOKING_WHATSAPP_ENABLED === "true" &&
      Boolean(
        env.BOOKING_WA_ACCESS_TOKEN &&
        /^\d+$/.test(env.BOOKING_WA_PHONE_NUMBER_ID || "") &&
        /^v\d+\.0$/.test(env.BOOKING_WA_GRAPH_VERSION || "") &&
        [
          env.BOOKING_WA_CONFIRMATION_TEMPLATE,
          env.BOOKING_WA_REMINDER_TEMPLATE,
          env.BOOKING_WA_CANCELLATION_TEMPLATE,
        ].every((value) => /^[a-z0-9_]{1,512}$/.test(value || "")),
      ),
  };
}
export function notificationPhone(value: string) {
  const compact = value.replace(/[ ()-]/g, "");
  const phone = /^0[789]\d{9}$/.test(compact)
    ? `234${compact.slice(1)}`
    : compact.replace(/^\+/, "");
  return /^[1-9]\d{7,14}$/.test(phone) ? phone : null;
}
export function messageJobs(
  env: Env,
  b: MessageBooking,
  now: string,
  cancellation = false,
) {
  const available = messageChannels(env);
  return (["sms", "whatsapp"] as const).flatMap((channel) => {
    if (
      !available[channel] ||
      !(channel === "sms" ? b.sms_opt_in : b.whatsapp_opt_in)
    )
      return [];
    return (
      cancellation
        ? ["cancellation"]
        : ["confirmation", "reminder_24h", "reminder_2h"]
    ).map((kind) =>
      env.DB.prepare(
        "INSERT INTO booking_messages(id,booking_id,channel,kind,next_attempt_at) VALUES(?,?,?,?,?) ON CONFLICT(booking_id,channel,kind) DO NOTHING",
      ).bind(
        `${b.id}:${channel}:${kind}`,
        b.id,
        channel,
        kind,
        kind.startsWith("reminder")
          ? new Date(
              Date.parse(b.slot_start) -
                (kind === "reminder_24h" ? 24 : 2) * 3600000,
            ).toISOString()
          : now,
      ),
    );
  });
}
class SendFailure extends Error {
  constructor(
    public outcome: "retry" | "failed" | "unknown",
    public reason: string,
  ) {
    super(reason);
  }
}
export async function verifiedBusinessSender(env: Env) {
  if (!messageChannels(env).whatsapp) return false;
  try {
    const url = `https://graph.facebook.com/${env.BOOKING_WA_GRAPH_VERSION}/${env.BOOKING_WA_PHONE_NUMBER_ID}?fields=display_phone_number`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${env.BOOKING_WA_ACCESS_TOKEN}` },
      signal: AbortSignal.timeout(8000),
      redirect: "manual",
    });
    if (!response.ok) return false;
    const data = (await response.json()) as { display_phone_number?: string };
    return (
      notificationPhone(data.display_phone_number || "") === BUSINESS_NUMBER
    );
  } catch {
    return false;
  }
}
export async function sendBookingMessage(
  env: Env,
  job: MessageJob,
  b: MessageBooking,
) {
  const phone = notificationPhone(b.phone);
  if (!phone) throw new SendFailure("failed", "invalid_phone");
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(b.slot_start));
  let response: Response;
  try {
    if (job.channel === "sms") {
      const verb =
        job.kind === "cancellation"
          ? "Cancelled"
          : job.kind === "confirmation"
            ? "Confirmed"
            : "Reminder";
      // No private management code, meeting secrets or sensitive service details in SMS.
      const sms = `TriumphantTech: ${verb} - automation consultation ${time} WAT. Manage via your confirmation email. Help: admin@triumphantech.com`;
      response = await fetch(`${termiiBase(env)}/api/sms/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: env.TERMII_API_KEY,
          to: phone,
          from: env.TERMII_SENDER_ID,
          sms,
          type: "plain",
          channel: "dnd",
        }),
        signal: AbortSignal.timeout(8000),
        redirect: "manual",
      });
    } else {
      const name =
        job.kind === "cancellation"
          ? env.BOOKING_WA_CANCELLATION_TEMPLATE
          : job.kind === "confirmation"
            ? env.BOOKING_WA_CONFIRMATION_TEMPLATE
            : env.BOOKING_WA_REMINDER_TEMPLATE;
      response = await fetch(
        `https://graph.facebook.com/${env.BOOKING_WA_GRAPH_VERSION}/${env.BOOKING_WA_PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.BOOKING_WA_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: phone,
            type: "template",
            template: {
              name,
              language: { code: env.BOOKING_WA_TEMPLATE_LANGUAGE || "en" },
              components: [
                {
                  type: "body",
                  parameters: [
                    { type: "text", text: b.name },
                    { type: "text", text: time },
                  ],
                },
              ],
            },
          }),
          signal: AbortSignal.timeout(8000),
          redirect: "manual",
        },
      );
    }
  } catch {
    throw new SendFailure("unknown", "provider_response_unknown");
  }
  if (!response.ok)
    throw new SendFailure(
      response.status === 429
        ? "retry"
        : response.status >= 500 || response.status === 408
          ? "unknown"
          : "failed",
      `provider_http_${response.status}`,
    );
  let data: { message_id?: unknown; messages?: { id?: unknown }[] };
  try {
    data = await response.json();
  } catch {
    throw new SendFailure("unknown", "provider_response_unknown");
  }
  const id = job.channel === "sms" ? data.message_id : data.messages?.[0]?.id;
  if (typeof id !== "string" || !/^[A-Za-z0-9._=+\/-]{1,256}$/.test(id))
    throw new SendFailure("unknown", "provider_response_unknown");
  return id;
}
export async function drainBookingMessages(env: Env) {
  if (env.BOOKING_ENABLED !== "true") return;
  const now = new Date().toISOString(),
    channels = messageChannels(env);
  // A crashed sender may already have reached the provider. Never replay it blindly.
  await env.DB.prepare(
    "UPDATE booking_messages SET state='unknown',lease_until=NULL,last_error='provider_response_unknown' WHERE state='sending' AND lease_until<?",
  )
    .bind(now)
    .run();
  if (!channels.sms && !channels.whatsapp) return;
  const waVerified = channels.whatsapp && (await verifiedBusinessSender(env));
  const due = await env.DB.prepare(
    "SELECT id,booking_id,channel,kind,attempts FROM booking_messages WHERE state='pending' AND next_attempt_at<=? AND attempts<5 ORDER BY next_attempt_at LIMIT 10",
  )
    .bind(now)
    .all<MessageJob>();
  for (const job of due.results) {
    const b = await env.DB.prepare("SELECT * FROM bookings WHERE id=?")
      .bind(job.booking_id)
      .first<MessageBooking>();
    if (
      !b ||
      !(job.channel === "sms" ? b.sms_opt_in : b.whatsapp_opt_in) ||
      (b.status === "cancelled" && job.kind !== "cancellation") ||
      (job.kind !== "cancellation" && Date.parse(b.slot_start) <= Date.now())
    ) {
      await env.DB.prepare(
        "UPDATE booking_messages SET state='cancelled',lease_until=NULL WHERE id=?",
      )
        .bind(job.id)
        .run();
      continue;
    }
    if (!channels[job.channel] || (job.channel === "whatsapp" && !waVerified))
      continue;
    const claim = await env.DB.prepare(
      "UPDATE booking_messages SET state='sending',lease_until=?,attempts=attempts+1 WHERE id=? AND state='pending' RETURNING id",
    )
      .bind(new Date(Date.now() + 120000).toISOString(), job.id)
      .first();
    if (!claim) continue;
    const localNow = Date.now() + 3600000,
      day = new Date(localNow).toISOString().slice(0, 10);
    const dayEnd = (Math.floor(localNow / 86400000) + 1) * 86400000 - 3600000;
    const configuredLimit = Number(
      job.channel === "sms"
        ? env.BOOKING_SMS_DAILY_LIMIT
        : env.BOOKING_WA_DAILY_LIMIT,
    );
    const limit =
      Number.isInteger(configuredLimit) &&
      configuredLimit >= 1 &&
      configuredLimit <= 5000
        ? configuredLimit
        : 50;
    const allowance = await env.DB.prepare(
      "INSERT INTO rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count",
    )
      .bind(`booking_phone:${job.channel}:${day}`, dayEnd)
      .first<{ count: number }>();
    if (!allowance || allowance.count > limit) {
      await env.DB.prepare(
        "UPDATE booking_messages SET state='pending',attempts=attempts-1,lease_until=NULL,next_attempt_at=?,last_error='daily_limit' WHERE id=?",
      )
        .bind(new Date(dayEnd).toISOString(), job.id)
        .run();
      continue;
    }
    try {
      const providerId = await sendBookingMessage(env, job, b);
      await env.DB.prepare(
        "UPDATE booking_messages SET state='accepted',provider_id=?,accepted_at=?,lease_until=NULL,last_error=NULL WHERE id=?",
      )
        .bind(providerId, new Date().toISOString(), job.id)
        .run();
    } catch (error) {
      const failure =
        error instanceof SendFailure
          ? error
          : new SendFailure("unknown", "provider_response_unknown");
      await env.DB.prepare(
        "UPDATE booking_messages SET state=?,lease_until=NULL,next_attempt_at=?,last_error=? WHERE id=?",
      )
        .bind(
          failure.outcome === "retry" && job.attempts < 4
            ? "pending"
            : failure.outcome === "retry"
              ? "failed"
              : failure.outcome,
          new Date(Date.now() + 60000 * 2 ** job.attempts).toISOString(),
          failure.reason,
          job.id,
        )
        .run();
    }
  }
}
