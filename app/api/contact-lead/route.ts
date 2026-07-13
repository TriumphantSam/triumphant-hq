import { NextResponse } from "next/server";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const AIRTABLE_CONTACT_LEADS_TABLE = process.env.AIRTABLE_CONTACT_LEADS_TABLE ?? "Contact Leads";

type ContactLeadPayload = {
  name: string;
  email: string;
  service: string;
  message: string;
};

async function pushContactLeadToAirtable(payload: ContactLeadPayload) {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) return false;

  const endpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_CONTACT_LEADS_TABLE)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            Name: payload.name,
            Email: payload.email,
            Service: payload.service,
            Message: payload.message,
            Source: "contact_form",
            CapturedAt: new Date().toISOString(),
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Airtable contact lead capture failed: ${response.status} ${detail}`);
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ContactLeadPayload>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const service = typeof body.service === "string" ? body.service.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email.includes("@") || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    let storedInAirtable = false;
    try {
      storedInAirtable = await pushContactLeadToAirtable({ name, email, service, message });
    } catch (error) {
      console.error("[Contact Lead] Airtable lead capture failed", error);
    }

    return NextResponse.json({ ok: true, storedInAirtable });
  } catch {
    return NextResponse.json({ error: "Failed to process contact lead." }, { status: 500 });
  }
}

