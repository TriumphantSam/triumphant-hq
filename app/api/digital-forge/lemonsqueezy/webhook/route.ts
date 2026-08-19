import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { isLaunchBundleOffer, resolveCheckoutOffer } from "@/lib/digital-forge-offers";

const LEMON_SQUEEZY_WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET ?? "";
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID ?? "";
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY ?? "";
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY ?? "";
const EMAILJS_FROM_NAME = process.env.EMAILJS_FROM_NAME ?? "TriumphantHQ";
const EMAILJS_TEMPLATE_ID_DIGITAL_FORGE_DELIVERY = process.env.EMAILJS_TEMPLATE_ID_DIGITAL_FORGE_DELIVERY ?? "";
const SUPPORT_EMAIL = process.env.DIGITAL_FORGE_SUPPORT_EMAIL ?? "support@triumphanthq.com";
const STARTER_USAGE_INSTRUCTION =
  "Start with 01 Start Here.pdf, then complete the Offer Selection Worksheet before opening the other templates.";
const LAUNCH_BUNDLE_USAGE_INSTRUCTION =
  "Start with the Start Here file, then use the WhatsApp Launch Kit first. Copy, edit, and send.";
const BUYER_REPLY_PROMPT =
  "Reply to this email with the product idea you plan to build first. We use those replies to help improve the system and collect real buyer proof with permission.";

function hasValidSignature(rawBody: string, request: NextRequest): boolean {
  if (!LEMON_SQUEEZY_WEBHOOK_SECRET) return false;

  const signature = request.headers.get("x-signature");
  if (!signature) return false;

  const digest = crypto
    .createHmac("sha256", LEMON_SQUEEZY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  // Prevent timing attacks by comparing buffers
  try {
    const signatureBuffer = Buffer.from(signature, 'hex');
    const digestBuffer = Buffer.from(digest, 'hex');
    if (signatureBuffer.length !== digestBuffer.length) return false;
    return crypto.timingSafeEqual(signatureBuffer, digestBuffer);
  } catch {
    return digest === signature;
  }
}

async function sendDeliveryEmail(payload: {
  name: string;
  email: string;
  productTitle: string;
  deliveryUrl: string;
  amount: number;
  currency: string;
  txRef: string;
  offerKey?: string;
}) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_TEMPLATE_ID_DIGITAL_FORGE_DELIVERY) {
    throw new Error("EmailJS digital product delivery template is not configured.");
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID_DIGITAL_FORGE_DELIVERY,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PRIVATE_KEY || undefined,
      template_params: {
        name: payload.name,
        email: payload.email,
        product_title: payload.productTitle,
        delivery_url: payload.deliveryUrl,
        amount: payload.amount,
        currency: payload.currency,
        tx_ref: payload.txRef,
        support_email: SUPPORT_EMAIL,
        from_name: EMAILJS_FROM_NAME,
        usage_start_instruction: isLaunchBundleOffer(payload.offerKey)
          ? LAUNCH_BUNDLE_USAGE_INSTRUCTION
          : STARTER_USAGE_INSTRUCTION,
        buyer_reply_prompt: BUYER_REPLY_PROMPT,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`EmailJS delivery send failed: ${response.status} ${detail}`);
  }
}

async function resolveDelivery(customData: Record<string, string>) {
  return resolveCheckoutOffer({
    offerKind: customData.offer_kind,
    offerKey: customData.offer_key,
    slug: customData.product_slug || customData.offer_key,
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!LEMON_SQUEEZY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Lemon Squeezy webhook env is not configured." }, { status: 500 });
    }

    const rawBody = await request.text();
    if (!hasValidSignature(rawBody, request)) {
      return NextResponse.json({ error: "Invalid Lemon Squeezy signature." }, { status: 401 });
    }

    const webhookPayload = JSON.parse(rawBody) as {
      meta?: {
        event_name?: string;
        custom_data?: Record<string, string>;
      };
      data?: {
        id?: string;
        attributes?: {
          status?: string;
          identifier?: string;
          user_name?: string;
          user_email?: string;
          total?: number;
          currency?: string;
        };
      };
    };

    // We only care about order_created events for delivery fulfillment
    if (webhookPayload.meta?.event_name !== "order_created") {
      return NextResponse.json({ ok: true, ignored: true, reason: "not_order_created" });
    }

    const transactionId = webhookPayload.data?.id;
    if (!transactionId || !webhookPayload.data?.attributes) {
      return NextResponse.json({ ok: true, ignored: true, reason: "missing_data" });
    }

    const attributes = webhookPayload.data.attributes;
    
    // Status should be paid (or pending if async maybe, but LS 'order_created' is usually paid)
    if (attributes.status !== "paid") {
      // In LS, an order is usually created when paid. If status is different, we can still log or ignore.
      // But we proceed for now to avoid dropping if status mapping differs slightly.
    }

    const customData = webhookPayload.meta.custom_data || {};
    const offer = await resolveDelivery(customData);
    const deliveryUrl = customData.delivery_url || offer?.deliveryUrl || "";
    const customerEmail = attributes.user_email?.trim() ?? "";
    const customerName = attributes.user_name?.trim() ?? "there";

    if (!customerEmail || !deliveryUrl) {
      throw new Error("Lemon Squeezy webhook is missing a customer email or delivery URL.");
    }

    const txRef = attributes.identifier || `LS_${transactionId}`;
    const productTitle = customData.product_title || offer?.title || "Digital Forge purchase";
    // LS 'total' is usually strictly in cents for USD. So $15.00 is 1500. 
    // We format it back to the true float amount by dividing by 100.
    const rawTotal = attributes.total || 0;
    const amount = Number(rawTotal) / 100;
    const currency = (attributes.currency || "USD").toUpperCase();

    await sendDeliveryEmail({
      name: customerName,
      email: customerEmail,
      productTitle,
      deliveryUrl,
      amount,
      currency,
      txRef,
      offerKey: customData.offer_key || offer?.key,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown Lemon Squeezy webhook error" },
      { status: 500 },
    );
  }
}
