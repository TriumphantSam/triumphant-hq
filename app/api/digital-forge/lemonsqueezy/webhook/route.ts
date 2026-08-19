import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { resolveCheckoutOffer } from "@/lib/digital-forge-offers";
import { sendDigitalForgeDeliveryEmail } from "@/lib/digital-forge-delivery";

const LEMON_SQUEEZY_WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET ?? "";

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

    await sendDigitalForgeDeliveryEmail({
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
