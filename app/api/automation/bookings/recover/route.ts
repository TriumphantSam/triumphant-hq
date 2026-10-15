import { automationRequest, AutomationError } from "@/lib/automation-api";
import { readBoundedBody, FormError } from "@/lib/public-form-guard";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const raw = await readBoundedBody(request);
    let input;
    try {
      input = JSON.parse(raw);
    } catch {
      throw new FormError("Invalid booking recovery.");
    }
    const result = await automationRequest("/v1/bookings/recover", input);
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof FormError || error instanceof AutomationError
            ? error.message
            : "Check your confirmation email before booking again.",
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
