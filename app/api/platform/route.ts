import { createHmac } from "node:crypto";
import { clientIp } from "@/lib/client-ip";
import { automationRequest, AutomationError } from "@/lib/automation-api";
import {
  FormError,
  readBoundedBody,
  readPublicForm,
} from "@/lib/public-form-guard";

export const maxDuration = 20;
const allowed = new Set([
  "operations.read",
  "followup.read",
  "followup.save",
  "followup.complete",
  "setup.read",
  "setup.save",
  "retention.read",
  "retention.save",
  "records.export",
  "usage.read",
  "collaboration.read",
  "collaboration.seen",
  "collaboration.assign",
  "collaboration.note",
  "auth.send",
  "auth.verify",
  "auth.logout",
  "bootstrap",
  "workspace.create",
  "workspace.read",
  "profile.save",
  "faqs.save",
  "booking.save",
  "plan.select",
  "team.read",
  "team.history",
  "team.invite",
  "team.email",
  "team.revoke",
  "team.remove",
  "team.invitations",
  "team.accept",
  "billing.read",
  "billing.checkout",
  "billing.refresh",
  "billing.cancel",
  "billing.resume",
  "billing.manage",
  "assistant.test",
  "widget.read",
  "widget.save",
  "responder.read",
  "responder.save",
  "conversation.list",
  "conversation.create",
  "conversation.read",
  "conversation.message",
  "conversation.pause",
  "website.publish",
  "website.pause",
  "inbox.read",
  "lead.update",
  "booking.cancel",
  "whatsapp.read",
  "whatsapp.connect",
  "whatsapp.disconnect",
  "whatsapp.inbox",
  "whatsapp.thread",
  "whatsapp.pause",
  "whatsapp.reply",
  "whatsapp.review.read",
  "whatsapp.review.send",
  "public.read",
  "public.ask",
  "public.enquiry",
  "public.slots",
  "public.book",
  "public.cancel",
]);
const cookieName = /^(?:__Secure-)?triumph-platform\.[a-z_]+=/;
export async function POST(request: Request) {
  const headers = new Headers({
    "Cache-Control": "no-store, private",
    "X-Robots-Tag": "noindex, nofollow",
  });
  try {
    if (request.headers.get("origin") !== new URL(request.url).origin)
      throw new FormError("Invalid request origin.", 403);
    const secret = process.env.AUTOMATION_HMAC_SECRET;
    if (!secret)
      throw new FormError("The workspace is not connected yet.", 503);
    const raw = await readBoundedBody(request, 1048576);
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      throw new FormError("Invalid request.");
    }
    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      !allowed.has(body.action)
    )
      throw new FormError("Invalid workspace action.");
    if (
      ["auth.send", "public.enquiry", "public.book", "public.cancel"].includes(
        body.action,
      )
    )
      await readPublicForm(
        new Request(request.url, {
          method: "POST",
          headers: request.headers,
          body: raw,
        }),
      );
    const ip = clientIp(request.headers);
    const ipKey = createHmac("sha256", secret)
      .update("platform-ip:" + ip)
      .digest("hex");
    const sessionCookie = (request.headers.get("cookie") || "")
      .split(";")
      .map((c) => c.trim())
      .filter((c) => cookieName.test(c))
      .join("; ");
    // Identity and IP context are signed with the RPC body; the browser cannot
    // substitute an owner ID, another customer's membership or a forged header.
    const result = await automationRequest<{
      data?: unknown;
      cookies?: string[];
    }>("/v1/platform/rpc", {
      action: body.action,
      payload: body.payload,
      ipKey,
      sessionCookie,
    });
    for (const cookie of result.cookies || []) {
      if (
        !cookieName.test(cookie) ||
        /[\r\n]/.test(cookie) ||
        /;\s*domain=/i.test(cookie)
      )
        throw new Error("Invalid session cookie");
      headers.append("Set-Cookie", cookie);
    }
    return Response.json(result.data, { headers });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof FormError || error instanceof AutomationError
            ? error.message
            : "The workspace is temporarily unavailable. Please try later.",
      },
      {
        headers,
        status:
          error instanceof FormError || error instanceof AutomationError
            ? error.status
            : 503,
      },
    );
  }
}
