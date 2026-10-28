import type { Env } from "../types";
import {tenantAnswer} from "./tenant-ai";
import { hmac } from "../security";
import {subscriptionAccess} from './subscription-access';
import {
  admit,
  matchFaq,
  PlatformError,
  requireWorkspace,
  validId,
  type Faq,
  type Workspace,
} from "./core";

type Policy = {
  days: string;
  start_hour: number;
  end_hour: number;
  duration: number;
  buffer: number;
  notice_hours: number;
};
type Slot = { start: string; end: string; blockedUntil: string };
type Booking = {
  id: string;
  workspace_id: string;
  request_digest: string;
  start: string;
  end: string;
  blocked_until: string;
  state: string;
  version: number;
};
export function policySlots(policy: Policy, now = Date.now()): Slot[] {
  const slots: Slot[] = [],
    days = JSON.parse(policy.days) as number[];
  for (let day = 0; day < 14; day++) {
    const date = new Date(now + 3600000 + day * 86400000)
      .toISOString()
      .slice(0, 10);
    const midnight = Date.parse(date + "T00:00:00+01:00");
    if (!days.includes(new Date(midnight + 3600000).getUTCDay())) continue;
    for (
      let minute = policy.start_hour * 60;
      minute + policy.duration <= policy.end_hour * 60;
      minute += policy.duration + policy.buffer
    ) {
      const start = midnight + minute * 60000;
      if (start < now + policy.notice_hours * 3600000) continue;
      slots.push({
        start: new Date(start).toISOString(),
        end: new Date(start + policy.duration * 60000).toISOString(),
        blockedUntil: new Date(
          start + (policy.duration + policy.buffer) * 60000,
        ).toISOString(),
      });
    }
  }
  return slots;
}
async function published(env: Env, id: unknown) {
  if (!validId(id))
    throw new PlatformError("This business page is unavailable.", 404);
  const w = await env.DB.prepare(
    "SELECT * FROM platform_workspaces WHERE id=? AND state='published'",
  )
    .bind(id)
    .first<Workspace>();
  if (!w) throw new PlatformError("This business page is unavailable.", 404);
  return w;
}
async function policy(env: Env, id: string) {
  const p = await env.DB.prepare(
    "SELECT days,start_hour,end_hour,duration,buffer,notice_hours FROM platform_booking_policy WHERE workspace_id=?",
  )
    .bind(id)
    .first<Policy>();
  if (!p) throw new PlatformError("Appointments are not available.", 503);
  return p;
}
function contact(input: Record<string, unknown>, needsMessage = false) {
  const name = typeof input.name === "string" ? input.name.trim() : "",
    email =
      typeof input.email === "string" ? input.email.trim().toLowerCase() : "",
    need = typeof input.need === "string" ? input.need.trim() : "";
  if (
    name.length < 2 ||
    name.length > 120 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !validId(input.requestId) ||
    input.consent !== true ||
    (needsMessage && (need.length < 10 || need.length > 4000))
  )
    throw new PlatformError(
      "Provide your name, email, request and permission to store this submission.",
    );
  return { name, email, need, requestId: input.requestId };
}
export async function publishWorkspace(
  env: Env,
  userId: string,
  id: unknown,
  version: unknown,
  pause = false,
) {
  const w = await requireWorkspace(env, userId, id, true);
  if (!Number.isSafeInteger(version))
    throw new PlatformError("Reload your settings.");
  if (!pause) {
    if (env.ENVIRONMENT === "production" && (env.PLATFORM_CUSTOMER_RELEASE_ENABLED !== 'true' || !(await subscriptionAccess(env,w.id)).active))
      throw new PlatformError(
        "Customer launch awaits billing and channel release checks.",
        503,
      );
    const count = await env.DB.prepare(
      "SELECT count(*) n FROM platform_faqs WHERE workspace_id=?",
    )
      .bind(w.id)
      .first<{ n: number }>();
    if (!w.description || !Number(count?.n))
      throw new PlatformError(
        "Save a business description and at least one approved answer first.",
      );
  }
  const row = await env.DB.prepare(
    "UPDATE platform_workspaces SET state=?,version=version+1,updated_at=? WHERE id=? AND version=? RETURNING id",
  )
    .bind(
      pause ? "draft" : "published",
      new Date().toISOString(),
      w.id,
      version,
    )
    .first();
  if (!row)
    throw new PlatformError("Settings changed. Reload before publishing.", 409);
  return {
    ok: true,
    sandbox: env.ENVIRONMENT !== "production",
    path: pause ? null : `/business/${w.id}`,
    notifications: "disabled",
    charged: false,
  };
}
export async function inbox(env: Env, userId: string, id: unknown) {
  const w = await requireWorkspace(env, userId, id);
  const leads = await env.DB.prepare(
    "SELECT id,name,email,need,status,version,created_at FROM platform_leads WHERE workspace_id=? ORDER BY created_at DESC LIMIT 50",
  )
    .bind(w.id)
    .all();
  const bookings = await env.DB.prepare(
    "SELECT id,name,email,start,end,state,version,created_at FROM platform_bookings WHERE workspace_id=? ORDER BY start DESC LIMIT 50",
  )
    .bind(w.id)
    .all();
  return {
    leads: leads.results,
    bookings: bookings.results,
    exportAvailable:w.role==='owner',
    sandbox: env.ENVIRONMENT !== "production",
    notifications: "disabled",
  };
}
export async function updateLead(
  env: Env,
  userId: string,
  input: Record<string, unknown>,
) {
  const w = await requireWorkspace(env, userId, input.workspaceId);
  if (
    !validId(input.id) ||
    !Number.isSafeInteger(input.version) ||
    !["new", "contacted", "qualified", "won", "lost"].includes(
      String(input.status),
    )
  )
    throw new PlatformError("Choose a valid enquiry status.");
  const row = await env.DB.prepare(
    "UPDATE platform_leads SET status=?,version=version+1,updated_at=? WHERE id=? AND workspace_id=? AND version=? RETURNING id",
  )
    .bind(input.status, new Date().toISOString(), input.id, w.id, input.version)
    .first();
  if (!row)
    throw new PlatformError(
      "This enquiry is unavailable or has changed. Reload the inbox.",
      409,
    );
  return { ok: true };
}
export async function ownerCancelBooking(
  env: Env,
  userId: string,
  input: Record<string, unknown>,
) {
  const w = await requireWorkspace(env, userId, input.workspaceId);
  if (!validId(input.id) || !Number.isSafeInteger(input.version))
    throw new PlatformError("Invalid appointment.");
  const row = await env.DB.prepare(
    "UPDATE platform_bookings SET state='cancelled',version=version+1,updated_at=? WHERE id=? AND workspace_id=? AND state='confirmed' AND version=? RETURNING id",
  )
    .bind(new Date().toISOString(), input.id, w.id, input.version)
    .first();
  if (!row)
    throw new PlatformError(
      "This appointment is unavailable or has changed. Reload the inbox.",
      409,
    );
  return { ok: true, notifications: "disabled" };
}
export async function publicWorkflow(
  env: Env,
  action: string,
  input: Record<string, unknown>,
  ipKey: string,
  now = Date.now(),
) {
  if (env.ENVIRONMENT === "production" && env.PLATFORM_CUSTOMER_RELEASE_ENABLED !== 'true')
    throw new PlatformError("Customer workflows are not open yet.", 503);
  await admit(env, "public:" + ipKey, 200);
  if (action === "public.cancel") {
    if (
      !validId(input.workspaceId) ||
      !validId(input.id) ||
      typeof input.manageCode !== "string" ||
      !/^[a-f0-9]{64}$/.test(input.manageCode)
    )
      throw new PlatformError("Appointment not found.", 404);
    const digest = await hmac(
      env.AUTOMATION_HMAC_SECRET,
      "platform-management-code:" + input.manageCode,
    );
    const row = await env.DB.prepare(
      "SELECT id,state FROM platform_bookings WHERE id=? AND workspace_id=? AND manage_digest=?",
    )
      .bind(input.id, input.workspaceId, digest)
      .first<{ id: string; state: string }>();
    if (!row) throw new PlatformError("Appointment not found.", 404);
    await env.DB.prepare(
      "UPDATE platform_bookings SET state='cancelled',version=version+1,updated_at=? WHERE id=? AND workspace_id=? AND manage_digest=? AND state='confirmed'",
    )
      .bind(new Date(now).toISOString(), row.id, input.workspaceId, digest)
      .run();
    return { ok: true, sandbox: env.ENVIRONMENT !== "production", notifications: "disabled" };
  }
  const w = await published(env, input.workspaceId),
    date = new Date(now).toISOString(),
    period = new Date(now + 3600000).toISOString().slice(0, 7),
    monthStart = new Date(period + "-01T00:00:00+01:00").toISOString();
  if (env.ENVIRONMENT === 'production' && !(await subscriptionAccess(env,w.id,now)).active) throw new PlatformError('This business subscription is not currently active.',503);
  if(action==="public.widget"){
    const config=await env.DB.prepare("SELECT origin FROM platform_widget_settings WHERE workspace_id=? AND enabled=1").bind(w.id).first<{origin:string}>();
    if(!config)throw new PlatformError("The sandbox widget is unavailable.",404);
    return {origin:config.origin,sandbox:true};
  }
  if (action === "public.read") {
    const answers = await env.DB.prepare(
      "SELECT id,question,answer FROM platform_faqs WHERE workspace_id=? ORDER BY id",
    )
      .bind(w.id)
      .all<Faq>();
    return {
      business: {
        id: w.id,
        name: w.name,
        description: w.description,
        contactUrl: w.contact_url,
        timezone: w.timezone,
      },
      faqs: answers.results,
      sandbox: env.ENVIRONMENT !== "production",
      notifications: "disabled",
    };
  }
  if (action === "public.ask") {
    const access = await subscriptionAccess(env, w.id, now);
    if (
      typeof input.question !== "string" ||
      !input.question.trim() ||
      input.question.length > 800 ||
      !validId(input.requestId)
    )
      throw new PlatformError("Ask a short business question.");
    await admit(env, "question:" + w.id + ":" + ipKey, 20);
    const digest = await hmac(env.AUTOMATION_HMAC_SECRET, input.question);
    const existing = await env.DB.prepare(
      "SELECT payload_digest,reply FROM platform_reply_requests WHERE workspace_id=? AND request_id=?",
    )
      .bind(w.id, input.requestId)
      .first<{ payload_digest: string; reply: string }>();
    if (existing) {
      if (existing.payload_digest !== digest)
        throw new PlatformError("This request reference has changed.", 409);
      return JSON.parse(existing.reply);
    }
    const faqs = await env.DB.prepare(
      "SELECT id,question,answer FROM platform_faqs WHERE workspace_id=? ORDER BY id",
    )
      .bind(w.id)
      .all<Faq>();
    const config=await env.DB.prepare("SELECT ai_enabled,fallback FROM platform_responder_settings WHERE workspace_id=?").bind(w.id).first<{ai_enabled:number;fallback:string}>();
    const allowance=await env.DB.prepare("SELECT count FROM platform_usage WHERE workspace_id=? AND period=? AND kind='assistant_replies'").bind(w.id,period).first<{count:number}>();
    if(Number(allowance?.count)>=access.replies)throw new PlatformError("This business has reached its current answer allowance.",429);
    const resolved=config?.ai_enabled?await tenantAnswer(env,w.id,input.requestId,input.question,faqs.results,config.fallback,now):null;
    const chosen = matchFaq(input.question, faqs.results),
      reply = {
        answer:
          resolved?.answer || chosen?.answer ||
          "I do not have an approved answer for that. Please send an enquiry to the business team.",
        source: chosen?.question || null,
        method:resolved?.method||"approved",
        handoff:resolved?resolved.handoff:!chosen,
        sandbox: env.ENVIRONMENT !== "production",
        notifications: "disabled",
      };
    const claimId = crypto.randomUUID();
    const result = await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO platform_reply_requests(workspace_id,request_id,payload_digest,reply,claim_id,created_at) SELECT ?,?,?,?,?,? WHERE COALESCE((SELECT count FROM platform_usage WHERE workspace_id=? AND period=? AND kind='assistant_replies'),0)<? ON CONFLICT DO NOTHING RETURNING request_id",
      ).bind(
        w.id,
        input.requestId,
        digest,
        JSON.stringify(reply),
        claimId,
        date,
        w.id,
        period,
        access.replies,
      ),
      env.DB.prepare(
        "INSERT INTO platform_usage(workspace_id,period,kind,count) SELECT ?,?,'assistant_replies',1 WHERE EXISTS(SELECT 1 FROM platform_reply_requests WHERE workspace_id=? AND request_id=? AND claim_id=?) ON CONFLICT(workspace_id,period,kind) DO UPDATE SET count=count+1",
      ).bind(w.id, period, w.id, input.requestId, claimId),
    ]);
    if (!result[0].results.length) {
      const cached = await env.DB.prepare(
        "SELECT payload_digest,reply FROM platform_reply_requests WHERE workspace_id=? AND request_id=?",
      )
        .bind(w.id, input.requestId)
        .first<{ payload_digest: string; reply: string }>();
      if (cached?.payload_digest === digest) return JSON.parse(cached.reply);
      throw new PlatformError(
        "This business has reached its sandbox answer allowance.",
        429,
      );
    }
    return reply;
  }
  if (action === "public.enquiry") {
    const data = contact(input, true),
      digest = await hmac(
        env.AUTOMATION_HMAC_SECRET,
        JSON.stringify([data.name, data.email, data.need]),
      );
    const old = await env.DB.prepare(
      "SELECT id,request_digest FROM platform_leads WHERE workspace_id=? AND request_id=?",
    )
      .bind(w.id, data.requestId)
      .first<{ id: string; request_digest: string }>();
    if (old) {
      if (old.request_digest !== digest)
        throw new PlatformError("This request reference has changed.", 409);
      return {
        reference: old.id,
        stored: true,
        sandbox: env.ENVIRONMENT !== "production",
        notifications: "disabled",
      };
    }
    const row = await env.DB.prepare(
      "INSERT INTO platform_leads(id,workspace_id,request_id,request_digest,name,email,need,created_at,updated_at) SELECT ?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM platform_workspaces WHERE id=? AND state='published') AND (SELECT count(*) FROM platform_leads WHERE workspace_id=? AND created_at>=?)<100 ON CONFLICT DO NOTHING RETURNING id",
    )
      .bind(
        crypto.randomUUID(),
        w.id,
        data.requestId,
        digest,
        data.name,
        data.email,
        data.need,
        date,
        date,
        w.id,
        w.id,
        monthStart,
      )
      .first<{ id: string }>();
    if (!row)
      throw new PlatformError(
        "The enquiry could not be saved. Please refresh or contact the business.",
        409,
      );
    return {
      reference: row.id,
      stored: true,
      sandbox: env.ENVIRONMENT !== "production",
      notifications: "disabled",
    };
  }
  if (action === "public.slots") {
    const p = await policy(env, w.id);
    const bookings = await env.DB.prepare(
      "SELECT start,blocked_until FROM platform_bookings WHERE workspace_id=? AND state='confirmed' AND blocked_until>? ORDER BY start",
    )
      .bind(w.id, date)
      .all<{ start: string; blocked_until: string }>();
    return {
      slots: policySlots(p, now)
        .filter(
          (s) =>
            !bookings.results.some(
              (b) => s.start < b.blocked_until && s.blockedUntil > b.start,
            ),
        )
        .slice(0, 100),
      sandbox: env.ENVIRONMENT !== "production",
      duration: p.duration,
      buffer: p.buffer,
      noticeHours: p.notice_hours,
    };
  }
  if (action === "public.book") {
    const data = contact(input),
      p = await policy(env, w.id);
    const digest = await hmac(
      env.AUTOMATION_HMAC_SECRET,
      JSON.stringify([data.name, data.email, input.start]),
    );
    const code = await hmac(
      env.AUTOMATION_HMAC_SECRET,
      `platform-management:${w.id}:${data.requestId}`,
    );
    const old = await env.DB.prepare(
      "SELECT id,request_digest,start,end,state FROM platform_bookings WHERE workspace_id=? AND request_id=?",
    )
      .bind(w.id, data.requestId)
      .first<Booking>();
    if (old) {
      if (old.request_digest !== digest)
        throw new PlatformError("This request reference has changed.", 409);
      return {
        reference: old.id,
        start: old.start,
        end: old.end,
        state: old.state,
        manageCode: code,
        sandbox: env.ENVIRONMENT !== "production",
        notifications: "disabled",
      };
    }
    const slot = policySlots(p, now).find((s) => s.start === input.start);
    if (!slot)
      throw new PlatformError(
        "This time is not available. Choose a current appointment slot.",
        409,
      );
    const manageDigest = await hmac(
      env.AUTOMATION_HMAC_SECRET,
      "platform-management-code:" + code,
    );
    const row = await env.DB.prepare(
      "INSERT INTO platform_bookings(id,workspace_id,request_id,request_digest,manage_digest,name,email,start,end,blocked_until,created_at,updated_at) SELECT ?,?,?,?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM platform_workspaces WHERE id=? AND state='published' AND version=?) AND NOT EXISTS(SELECT 1 FROM platform_bookings WHERE workspace_id=? AND state='confirmed' AND start<? AND blocked_until>?) AND (SELECT count(*) FROM platform_bookings WHERE workspace_id=? AND created_at>=?)<100 ON CONFLICT DO NOTHING RETURNING id",
    )
      .bind(
        crypto.randomUUID(),
        w.id,
        data.requestId,
        digest,
        manageDigest,
        data.name,
        data.email,
        slot.start,
        slot.end,
        slot.blockedUntil,
        date,
        date,
        w.id,
        w.version,
        w.id,
        slot.blockedUntil,
        slot.start,
        w.id,
        monthStart,
      )
      .first<{ id: string }>();
    if (!row)
      throw new PlatformError(
        "This time was taken or the business settings changed. Refresh the available times.",
        409,
      );
    return {
      reference: row.id,
      start: slot.start,
      end: slot.end,
      state: "confirmed",
      manageCode: code,
      sandbox: env.ENVIRONMENT !== "production",
      notifications: "disabled",
    };
  }
  throw new PlatformError("This customer workflow is unavailable.", 404);
}
