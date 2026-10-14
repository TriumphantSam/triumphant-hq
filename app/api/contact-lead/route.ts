import { NextResponse } from "next/server";
import { captureLead } from "@/lib/lead-capture";
import {
  readPublicForm,
  field,
  validateLead,
  FormError,
} from "@/lib/public-form-guard";

export async function POST(request: Request) {
  let validated = false;
  try {
    const body = await readPublicForm(request);
    const name = field(body, "name", 121),
      email = field(body, "email", 255),
      service = field(body, "service", 120),
      message = field(body, "message", 8000);
    validateLead(name, email);

    if (!name || !email.includes("@") || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }
    validated = true;

    const lead = await captureLead({
      name,
      email,
      service,
      message,
      source: ["scorecard", "web_form", "automation_lab"].includes(
        String(body.source),
      )
        ? String(body.source)
        : "web_form",
      phone: field(body, "phone", 30),
      consentMarketing: body.consentMarketing === true,
    });
    if (!lead.stored)
      return NextResponse.json(
        {
          ok: false,
          deliveryFallbackAllowed: true,
          error:
            "Online enquiries are temporarily unavailable. Please contact us on WhatsApp.",
        },
        { status: 503 },
      );
    return NextResponse.json({
      ok: true,
      stored: true,
      leadId: lead.leadId,
      storedInAirtable: lead.destination === "airtable",
      deliveriesQueued: lead.destination === "worker",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        deliveryFallbackAllowed: validated,
        error:
          error instanceof FormError
            ? error.message
            : "Your enquiry could not be saved. Please try again or contact us on WhatsApp.",
      },
      { status: error instanceof FormError ? error.status : 503 },
    );
  }
}
