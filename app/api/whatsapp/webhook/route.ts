import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { handleWhatsAppIncoming } from "@/lib/whatsapp-launch-bundle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hasValidSignature(rawBody: string, request: NextRequest): boolean {
  const secret = (process.env.META_APP_SECRET ?? "").trim();
  const header = request.headers.get("x-hub-signature-256") ?? "";
  if (!secret || !header.startsWith("sha256=")) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const supplied = header.slice("sha256=".length).trim().toLowerCase();
  if (supplied.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(supplied, "utf8"), Buffer.from(expected, "utf8"));
}

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge") ?? "";
  const verifyToken = (process.env.WHATSAPP_VERIFY_TOKEN ?? "").trim();
  if (mode === "subscribe" && token && verifyToken && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("forbidden", { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    if (!hasValidSignature(rawBody, request)) {
      return NextResponse.json({ error: "invalid_signature" }, { status: 403 });
    }

    const payload = JSON.parse(rawBody) as Parameters<typeof handleWhatsAppIncoming>[0];
    await handleWhatsAppIncoming(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown WhatsApp webhook error" },
      { status: 500 },
    );
  }
}
