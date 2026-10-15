import { NextResponse } from "next/server";
import { automationRequest, AutomationError } from "@/lib/automation-api";
import {
  readPublicForm,
  readBoundedBody,
  FormError,
  field,
} from "@/lib/public-form-guard";
export async function POST(request: Request) {
  try {
    const raw = await readBoundedBody(request);
    let input;
    try {
      input = JSON.parse(raw);
    } catch {
      throw new FormError("Invalid feedback.");
    }
    if (input && ["click", "stop", "status"].includes(input.action))
      return NextResponse.json(
        await automationRequest("/v1/reviews/invite", {
          id: input.id,
          action: input.action,
        }),
      );
    const body = await readPublicForm(
      new Request(request.url, {
        method: "POST",
        headers: request.headers,
        body: raw,
      }),
    );
    return NextResponse.json(
      await automationRequest("/v1/reviews/feedback", {
        requestId: body.requestId,
        rating: body.rating,
        feedback: field(body, "feedback", 2001),
        name: field(body, "name", 81),
        email: field(body, "email", 255),
      }),
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof FormError || error instanceof AutomationError
            ? error.message
            : "Feedback could not be saved. Please try again.",
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
