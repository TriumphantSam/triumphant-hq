import { createHmac } from "node:crypto";
import { clientIp } from "@/lib/client-ip";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, validAdminSession } from "@/lib/admin-lab-auth";
import { automationRequest, AutomationError } from "@/lib/automation-api";
import {
  readBoundedBody,
  readPublicForm,
  FormError,
} from "@/lib/public-form-guard";

export const maxDuration = 20;
export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  try {
    if (request.headers.get("origin") !== new URL(request.url).origin)
      throw new FormError("Invalid request origin.", 403);
    const secret = process.env.AUTOMATION_HMAC_SECRET;
    if (!secret)
      throw new FormError("The assistant is not connected yet.", 503);
    const raw = await readBoundedBody(request, 4096);
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      throw new FormError("Invalid message.");
    }
    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      !["customer", "owner"].includes(body.mode)
    )
      throw new FormError("Invalid conversation mode.");
    const scope = body.mode as "customer" | "owner";
    let actor: string;
    if (scope === "owner") {
      const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
      if (!validAdminSession(cookie))
        throw new FormError("Please sign in to the owner workspace.", 401);
      actor = "owner:" + cookie;
    } else {
      actor = "customer:" + clientIp(request.headers);
    }
    const actorKey = createHmac("sha256", secret)
      .update("assistant-actor:" + actor)
      .digest("hex");
    if (body.action === "start") {
      if (scope === "customer")
        await readPublicForm(
          new Request(request.url, {
            method: "POST",
            headers: request.headers,
            body: raw,
          }),
        );
      return Response.json(
        await automationRequest("/v1/assistant/start", { scope, actorKey }),
        { headers },
      );
    }
    if (body.action !== "turn")
      throw new FormError("Invalid conversation action.");
    return Response.json(
      await automationRequest("/v1/assistant/turn", {
        scope,
        actorKey,
        token: body.token,
        requestId: body.requestId,
        version: body.version,
        ...(body.decision
          ? { decision: body.decision, pendingId: body.pendingId }
          : { message: body.message }),
      }),
      { headers },
    );
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof FormError || error instanceof AutomationError
            ? error.message
            : "The assistant is temporarily unavailable. Try again later.",
      },
      {
        status:
          error instanceof FormError || error instanceof AutomationError
            ? error.status
            : 503,
        headers,
      },
    );
  }
}
