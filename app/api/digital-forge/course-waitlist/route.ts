import { NextResponse } from "next/server";

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID ?? "";
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID ?? "";
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY ?? "";
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY ?? "";
const EMAILJS_FROM_NAME = process.env.EMAILJS_FROM_NAME ?? "TriumphantTech";

type WaitlistPayload = {
  name: string;
  email: string;
  whatsapp?: string;
  accessPath: string;
  helpTopic: string;
  note?: string;
};

async function sendWaitlistEmail(payload: WaitlistPayload) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    return false;
  }

  const message = [
    `Priority access request for the Digital Forge Course.`,
    ``,
    `Preferred access path: ${payload.accessPath}`,
    `Main help topic: ${payload.helpTopic}`,
    `WhatsApp number: ${payload.whatsapp || "Not provided"}`,
    ``,
    `Additional note:`,
    payload.note || "No extra note provided.",
  ].join("\n");

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PRIVATE_KEY || undefined,
      template_params: {
        from_name: payload.name,
        reply_to: payload.email,
        service: "Digital Forge Course Waitlist",
        message,
        brand_name: EMAILJS_FROM_NAME,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`EmailJS waitlist send failed: ${response.status} ${detail}`);
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload: WaitlistPayload = {
      name: typeof body.name === "string" ? body.name.trim() : "",
      email: typeof body.email === "string" ? body.email.trim() : "",
      whatsapp: typeof body.whatsapp === "string" ? body.whatsapp.trim() : "",
      accessPath: typeof body.accessPath === "string" ? body.accessPath.trim() : "",
      helpTopic: typeof body.helpTopic === "string" ? body.helpTopic.trim() : "",
      note: typeof body.note === "string" ? body.note.trim() : "",
    };

    if (!payload.name || !payload.email || !payload.accessPath || !payload.helpTopic) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let sentNotificationEmail = false;

    try {
      sentNotificationEmail = await sendWaitlistEmail(payload);
    } catch (error) {
      console.error("[Digital Forge Course Waitlist] Email notification failed", error);
    }

    if (!sentNotificationEmail) {
      return NextResponse.json({ error: "Failed to capture waitlist entry" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      sentNotificationEmail,
      message: "Joined waitlist successfully.",
    });
  } catch {
    return NextResponse.json({ error: "Failed to process waitlist submission" }, { status: 500 });
  }
}
