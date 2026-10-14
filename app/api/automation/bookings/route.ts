import { automationRequest, AutomationError } from "@/lib/automation-api";
import { readPublicForm, FormError } from "@/lib/public-form-guard";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const failure = (error: unknown) =>
  Response.json(
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
export async function GET() {
  try {
    return Response.json(
      await automationRequest("/v1/bookings/slots", undefined, "GET"),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request) {
  try {
    const input = await readPublicForm(request);
    const result = await automationRequest("/v1/bookings/create", {
      name: input.name,
      email: input.email,
      phone: input.phone,
      start: input.start,
      requestId: input.requestId,
      whatsappOptIn: input.whatsappOptIn,
      smsOptIn: input.smsOptIn,
    });
    return Response.json(result, {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return failure(error);
  }
}
