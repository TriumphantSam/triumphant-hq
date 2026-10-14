import { NextResponse } from "next/server";

type ContactLeadPayload = {
  name: string;
  email: string;
  service: string;
  message: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ContactLeadPayload>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email.includes("@") || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to process contact lead." }, { status: 500 });
  }
}
