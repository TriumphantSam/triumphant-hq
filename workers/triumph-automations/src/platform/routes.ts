import { Hono } from "hono";
import type { Env } from "../types";
import { hmac } from "../security";
import { platformAuth, type OtpSender } from "./auth";
import { conversationAction } from "./conversations";
import { widgetAction } from "./widget";
import { billingAction, provisionTestPlans } from "./billing";
import { teamAction } from "./team";
import {
  admit,
  createWorkspace,
  plans,
  PlatformError,
  requireWorkspace,
  saveFaqs,
  saveProfile,
  validId,
  workspaceView,
  matchFaq,
} from "./core";
import {
  publicWorkflow,
  publishWorkspace,
  inbox,
  updateLead,
  ownerCancelBooking,
} from "./workflows";

export function createPlatformRoutes(sender?: OtpSender) {
  const routes = new Hono<{ Bindings: Env; Variables: { raw: string } }>();
  routes.post("/billing/test-plans",async(c)=>{
    try {return c.json({data:await provisionTestPlans(c.env)});}
    catch(error){return c.json({error:error instanceof PlatformError?error.message:"Test plan provisioning failed."},error instanceof PlatformError?error.status:503);}
  });
  routes.post("/rpc", async (c) => {
    try {
      if (c.env.PLATFORM_ENABLED !== "true")
        throw new PlatformError("The customer platform is not open yet.", 503);
      let body: Record<string, unknown>;
      try {
        body = JSON.parse(c.get("raw"));
      } catch {
        throw new PlatformError("Invalid request.");
      }
      if (
        !body ||
        typeof body !== "object" ||
        Array.isArray(body) ||
        typeof body.action !== "string" ||
        typeof body.ipKey !== "string" ||
        !/^[a-f0-9]{64}$/.test(body.ipKey)
      )
        throw new PlatformError("Invalid request.");
      const payload =
        body.payload &&
        typeof body.payload === "object" &&
        !Array.isArray(body.payload)
          ? (body.payload as Record<string, unknown>)
          : {};
      if (body.action.startsWith("public."))
        return c.json({
          data: await publicWorkflow(c.env, body.action, payload, body.ipKey),
        });
      const auth = await platformAuth(c.env, sender);
      const headers = new Headers({ origin: "https://platform.internal" });
      if (
        typeof body.sessionCookie === "string" &&
        body.sessionCookie.length <= 4096
      )
        headers.set("cookie", body.sessionCookie);
      if (body.action === "auth.send") {
        if (
          typeof payload.email !== "string" ||
          payload.email.length > 254 ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)
        )
          throw new PlatformError("Enter a valid email address.");
        const email = payload.email.trim().toLowerCase();
        await admit(c.env, "otp-ip:" + body.ipKey, 5);
        await admit(
          c.env,
          "otp-email:" + (await hmac(c.env.AUTOMATION_HMAC_SECRET, email)),
          5,
        );
        await auth.api.sendVerificationOTP({
          headers,
          body: { email, type: "sign-in" },
        });
        return c.json({ data: { ok: true } });
      }
      if (body.action === "auth.verify") {
        if (
          typeof payload.email !== "string" ||
          payload.email.length > 254 ||
          typeof payload.otp !== "string" ||
          !/^\d{8}$/.test(payload.otp)
        )
          throw new PlatformError(
            "Enter the eight-digit code from your email.",
          );
        await admit(c.env, "verify-ip:" + body.ipKey, 20);
        const response = await auth.api.signInEmailOTP({
          headers,
          body: { email: payload.email.trim().toLowerCase(), otp: payload.otp },
          asResponse: true,
        });
        if (!response.ok)
          throw new PlatformError(
            "The code is invalid or expired. Request a new code.",
            401,
          );
        return c.json({
          data: { ok: true },
          cookies: response.headers.getSetCookie(),
        });
      }
      if (body.action === "auth.logout") {
        const response = await auth.api.signOut({ headers, asResponse: true });
        return c.json({
          data: { ok: true },
          cookies: response.headers.getSetCookie(),
        });
      }
      const session = await auth.api.getSession({ headers });
      if (!session?.user.emailVerified)
        throw new PlatformError("Sign in to your business workspace.", 401);
      const userId = session.user.id;
      await admit(c.env, "account:" + userId, 240);
      if (body.action === "bootstrap") {
        const memberships = await c.env.DB.prepare(
          "SELECT w.id,w.name,m.role FROM platform_workspaces w JOIN platform_memberships m ON m.workspace_id=w.id WHERE m.user_id=? ORDER BY w.created_at",
        )
          .bind(userId)
          .all();
        return c.json({
          data: {
            user: { name: session.user.name, email: session.user.email },
            workspaces: memberships.results,
            plans,
          },
        });
      }
      if (body.action === "workspace.create") {
        return c.json({
          data: await createWorkspace(c.env, userId, payload.name),
        });
      }
      const id = payload.workspaceId;
      if(body.action.startsWith("team."))return c.json({data:await teamAction(c.env,{id:userId,email:session.user.email},body.action,payload)});
      if (body.action.startsWith("billing.")) return c.json({data:await billingAction(c.env,{id:userId,email:session.user.email},body.action,payload)});
      if(body.action.startsWith("widget."))return c.json({data:await widgetAction(c.env,userId,body.action,payload)});
      if (body.action.startsWith("conversation.") || body.action.startsWith("responder."))
        return c.json({ data: await conversationAction(c.env, userId, body.action, payload) });
      if (body.action === "website.publish" || body.action === "website.pause")
        return c.json({
          data: await publishWorkspace(
            c.env,
            userId,
            id,
            payload.version,
            body.action === "website.pause",
          ),
        });
      if (body.action === "inbox.read")
        return c.json({ data: await inbox(c.env, userId, id) });
      if (body.action === "lead.update")
        return c.json({ data: await updateLead(c.env, userId, payload) });
      if (body.action === "booking.cancel")
        return c.json({
          data: await ownerCancelBooking(c.env, userId, payload),
        });
      if (body.action === "workspace.read")
        return c.json({ data: await workspaceView(c.env, userId, id) });
      if (body.action === "profile.save")
        return c.json({ data: await saveProfile(c.env, userId, id, payload) });
      if (body.action === "faqs.save")
        return c.json({ data: await saveFaqs(c.env, userId, id, payload) });
      if (body.action === "plan.select") {
        const w = await requireWorkspace(c.env, userId, id, true);
        const plan = plans.find((p) => p.id === payload.planId);
        if (!plan || !Number.isSafeInteger(payload.version))
          throw new PlatformError("Choose a valid plan.");
        const count = await c.env.DB.prepare(
          "SELECT count(*) n FROM platform_faqs WHERE workspace_id=?",
        )
          .bind(w.id)
          .first<{ n: number }>();
        if (Number(count?.n) > plan.faqs)
          throw new PlatformError(
            "Remove answers above the new plan limit before changing plan.",
          );
        const row = await c.env.DB.prepare(
          "UPDATE platform_workspaces SET plan_id=?,version=version+1,updated_at=? WHERE id=? AND version=? RETURNING id",
        )
          .bind(plan.id, new Date().toISOString(), w.id, payload.version)
          .first();
        if (!row)
          throw new PlatformError(
            "Settings changed. Reload before choosing a plan.",
            409,
          );
        return c.json({
          data: { ok: true, charged: false, subscriptionActive: false },
        });
      }
      if (body.action === "booking.save") {
        const w = await requireWorkspace(c.env, userId, id, true);
        const { days, startHour, endHour, duration, buffer, noticeHours } =
          payload;
        if (
          !Array.isArray(days) ||
          !days.length ||
          days.length > 7 ||
          days.some((d) => !Number.isInteger(d) || d < 0 || d > 6) ||
          new Set(days).size !== days.length ||
          ![
            startHour,
            endHour,
            duration,
            buffer,
            noticeHours,
            payload.version,
          ].every(Number.isSafeInteger) ||
          Number(startHour) < 0 ||
          Number(endHour) > 24 ||
          Number(startHour) >= Number(endHour) ||
          ![15, 30, 45, 60, 90, 120].includes(Number(duration)) ||
          Number(buffer) < 0 ||
          Number(buffer) > 120 ||
          Number(noticeHours) < 1 ||
          Number(noticeHours) > 168 ||
          Number(endHour) * 60 - Number(startHour) * 60 < Number(duration)
        )
          throw new PlatformError(
            "Check working days, hours, duration, buffer and notice.",
          );
        const lock = crypto.randomUUID();
        const result = await c.env.DB.batch([
          c.env.DB.prepare(
            "UPDATE platform_workspaces SET version=version+1,updated_at=? WHERE id=? AND version=? RETURNING id",
          ).bind(lock, w.id, payload.version),
          c.env.DB.prepare(
            "UPDATE platform_booking_policy SET days=?,start_hour=?,end_hour=?,duration=?,buffer=?,notice_hours=? WHERE workspace_id=? AND EXISTS(SELECT 1 FROM platform_workspaces WHERE id=? AND updated_at=?)",
          ).bind(
            JSON.stringify(days),
            startHour,
            endHour,
            duration,
            buffer,
            noticeHours,
            w.id,
            w.id,
            lock,
          ),
          c.env.DB.prepare(
            "UPDATE platform_workspaces SET updated_at=? WHERE id=? AND updated_at=?",
          ).bind(new Date().toISOString(), w.id, lock),
        ]);
        if (!result[0].results.length)
          throw new PlatformError(
            "Settings changed. Reload before saving.",
            409,
          );
        return c.json({ data: { ok: true } });
      }
      if (body.action === "assistant.test") {
        const view = await workspaceView(c.env, userId, id);
        if (
          typeof payload.question !== "string" ||
          !payload.question.trim() ||
          payload.question.length > 800 ||
          !validId(payload.requestId)
        )
          throw new PlatformError("Ask a short question.");
        const digest = await hmac(
          c.env.AUTOMATION_HMAC_SECRET,
          payload.question,
        );
        const previous = await c.env.DB.prepare(
          "SELECT payload_digest,response FROM platform_requests WHERE workspace_id=? AND request_id=?",
        )
          .bind(view.workspace.id, payload.requestId)
          .first<{ payload_digest: string; response: string | null }>();
        if (previous) {
          if (previous.payload_digest !== digest || !previous.response)
            throw new PlatformError(
              "This request is already being processed or has changed.",
              409,
            );
          return c.json({ data: JSON.parse(previous.response) });
        }
        const chosen = matchFaq(payload.question, view.faqs);
        const data = {
          answer:
            chosen?.answer ||
            "I do not have an approved answer for that yet. Please contact the business team.",
          source: chosen?.question || null,
          mode: "private-test",
          sent: false,
          reserved: false,
        };
        // No message transcript is saved; only the keyed request digest and reply.
        await c.env.DB.prepare(
          "INSERT INTO platform_requests(workspace_id,request_id,payload_digest,response,created_at) VALUES(?,?,?,?,?) ON CONFLICT DO NOTHING",
        )
          .bind(
            view.workspace.id,
            payload.requestId,
            digest,
            JSON.stringify(data),
            new Date().toISOString(),
          )
          .run();
        return c.json({ data });
      }
      throw new PlatformError("This platform action is not available.", 404);
    } catch (error) {
      if (error instanceof PlatformError)
        return c.json({ error: error.message }, error.status);
      return c.json(
        {
          error:
            "The workspace service could not complete this request. Please try again.",
        },
        503,
      );
    }
  });
  return routes;
}
export const platformRoutes = createPlatformRoutes();
