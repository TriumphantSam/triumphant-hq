import { NextResponse } from "next/server";
import { automationRequest, AutomationError } from "@/lib/automation-api";
import {
  readPublicForm,
  readBoundedBody,
  FormError,
  field,
} from "@/lib/public-form-guard";
export const maxDuration = 20;
export async function GET() {
  try {
    return NextResponse.json(
      await automationRequest("/v1/payments/ready", undefined, "GET"),
    );
  } catch {
    return NextResponse.json({ connected: false, mode: "test" });
  }
}
export async function POST(request: Request) {
  try {
    const raw = await readBoundedBody(request, 4096);
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      throw new FormError("Invalid request.");
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new FormError("Invalid request.");
    if (body.action === "initialize") {
      const form = await readPublicForm(
        new Request(request.url, {
          method: "POST",
          headers: request.headers,
          body: raw,
        }),
      );
      return NextResponse.json(
        await automationRequest("/v1/payments/initialize", {
          email: field(form, "email", 255),
          requestId: body.requestId,
          reminderOptIn: body.reminderOptIn === true,
        }),
      );
    }
    if (
      !["verify", "receipt", "stop"].includes(body.action) ||
      !/^thq-test-[a-f0-9-]{36}$/.test(body.reference || "")
    )
      throw new FormError("Invalid reference.");
    return NextResponse.json(
      await automationRequest("/v1/payments/" + body.action, {
        reference: body.reference,
      }),
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof FormError || error instanceof AutomationError
            ? error.message
            : "Payment status could not be confirmed. Please try again.",
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
