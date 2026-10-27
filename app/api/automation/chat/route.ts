import { createHmac } from "node:crypto";
import { clientIp } from "@/lib/client-ip";
import { NextResponse } from "next/server";
import { automationRequest, AutomationError } from "@/lib/automation-api";
import {
  readPublicForm,
  readBoundedBody,
  FormError,
} from "@/lib/public-form-guard";
export const maxDuration = 20;
export async function POST(request: Request) {
  try {
    const raw = await readBoundedBody(request, 4096);
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      throw new FormError("Invalid message.");
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new FormError("Invalid message.");
    const ip = clientIp(request.headers);
    if (!process.env.AUTOMATION_HMAC_SECRET)
      throw new FormError("The assistant is not connected yet.", 503);
    const ipKey = createHmac("sha256", process.env.AUTOMATION_HMAC_SECRET)
      .update(ip)
      .digest("hex");
    if (body.action === "start") {
      await readPublicForm(
        new Request(request.url, {
          method: "POST",
          headers: request.headers,
          body: raw,
        }),
      );
      return NextResponse.json(
        await automationRequest("/v1/chat/start", { ipKey }),
      );
    }
    if (
      body.action !== "message" ||
      typeof body.message !== "string" ||
      body.message.length > 800 ||
      typeof body.token !== "string"
    )
      throw new FormError("Please ask a short business question.");
    return NextResponse.json(
      await automationRequest("/v1/chat/message", {
        message: body.message,
        token: body.token,
        ipKey,
      }),
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof FormError || error instanceof AutomationError
            ? error.message
            : "The assistant is temporarily unavailable.",
      },
      {
        status:
          error instanceof FormError || error instanceof AutomationError
            ? error.status
            : 503,
      },
    );
  }
}
