import { automationRequest, AutomationError } from "@/lib/automation-api";
import {
  readBoundedBody,
  readPublicForm,
  FormError,
} from "@/lib/public-form-guard";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const raw = await readBoundedBody(request);
    let input;
    try {
      input = JSON.parse(raw);
    } catch {
      throw new FormError("Invalid booking request.");
    }
    if (
      !input ||
      Array.isArray(input) ||
      !["status", "cancel", "notifications_off"].includes(input.action)
    )
      throw new FormError("Invalid booking action.");
    if (input.action === "cancel")
      await readPublicForm(
        new Request(request.url, {
          method: "POST",
          headers: request.headers,
          body: raw,
        }),
      );
    const result = await automationRequest("/v1/bookings/manage", {
      id: input.id,
      code: input.code,
      action: input.action,
    });
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof FormError || error instanceof AutomationError
            ? error.message
            : "Bookings are temporarily unavailable.",
      },
      {
        status:
          error instanceof FormError || error instanceof AutomationError
            ? error.status
            : 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
