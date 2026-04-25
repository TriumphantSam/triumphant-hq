import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { resolveProductOffer, resolveSystemOffer } from "@/lib/digital-forge-offers";

const LEMON_SQUEEZY_WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET ?? "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const AIRTABLE_DIGITAL_FORGE_ORDERS_TABLE = process.env.AIRTABLE_DIGITAL_FORGE_ORDERS_TABLE ?? "Digital Forge Orders";
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID ?? "";
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY ?? "";
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY ?? "";
const EMAILJS_FROM_NAME = process.env.EMAILJS_FROM_NAME ?? "TriumphantHQ";
const EMAILJS_TEMPLATE_ID_DIGITAL_FORGE_DELIVERY = process.env.EMAILJS_TEMPLATE_ID_DIGITAL_FORGE_DELIVERY ?? "";
const SUPPORT_EMAIL = process.env.DIGITAL_FORGE_SUPPORT_EMAIL ?? "support@triumphanthq.com";
const STARTER_USAGE_INSTRUCTION =
  "Start with 01 Start Here.pdf, then complete the Offer Selection Worksheet before opening the other templates.";
const BUYER_REPLY_PROMPT =
  "Reply to this email with the product idea you plan to build first. We use those replies to help improve the system and collect real buyer proof with permission.";

function safeFormulaValue(value: string): string {
  return value.replace(/'/g, "\\'");
}

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

async function findExistingOrder(transactionId: string): Promise<{ id: string; deliverySent: boolean } | null> {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) return null;

  const params = new URLSearchParams();
  params.set("maxRecords", "1");
  params.set("filterByFormula", `{Transaction ID}='${safeFormulaValue(transactionId)}'`);
  const endpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_DIGITAL_FORGE_ORDERS_TABLE)}?${params.toString()}`;

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    records?: Array<{ id: string; fields?: Record<string, unknown> }>;
  };

  const record = payload.records?.[0];
  if (!record) return null;

  return {
    id: record.id,
    deliverySent: record.fields?.["Delivery Sent"] === true,
  };
}

function extractUnknownFieldName(detail: string): string | null {
  try {
    const parsed = JSON.parse(detail);
    const message = parsed.error?.message || "";
    const match = message.match(/Unknown field name: "([^"]+)"/i) || message.match(/Unknown field name: '([^']+)'/i);
    return match?.[1] ?? null;
  } catch {
    const backupMatch = detail.match(/Unknown field name: \\?['"]([^\\'"]+)\\?['"]/i);
    return backupMatch?.[1] ?? null;
  }
}

async function upsertOrder(fields: Record<string, unknown>, recordId?: string): Promise<void> {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) return;

  const endpoint = recordId
    ? `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_DIGITAL_FORGE_ORDERS_TABLE)}/${recordId}`
    : `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_DIGITAL_FORGE_ORDERS_TABLE)}`;

  while (true) {
    const response = await fetch(endpoint, {
      method: recordId ? "PATCH" : "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recordId ? { fields } : { records: [{ fields }] }),
    });

    if (response.ok) return;

    const detail = await response.text();
    const missingField = extractUnknownFieldName(detail);
    if (response.status === 422 && missingField && missingField in fields) {
      delete fields[missingField];
      continue;
    }

    throw new Error(`Airtable order write failed: ${response.status} ${detail}`);
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
        usage_start_instruction: STARTER_USAGE_INSTRUCTION,
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
  if (customData.offer_kind === "system" || customData.offer_key === "starter-system") {
    return resolveSystemOffer();
  }

  const slug = customData.product_slug || customData.offer_key;
  if (!slug) return null;
  return resolveProductOffer(slug);
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
    
    const existingOrder = await findExistingOrder(txRef);
    if (existingOrder?.deliverySent) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

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
    });

    await upsertOrder(
      {
        "Transaction ID": txRef,
        "Tx Ref": txRef,
        "Offer Key": customData.offer_key || offer?.key || "",
        "Offer Kind": customData.offer_kind || offer?.kind || "",
        "Product Slug": customData.product_slug || offer?.slug || "",
        "Product Title": productTitle,
        "Customer Name": customerName,
        "Customer Email": customerEmail,
        Amount: amount,
        Currency: currency,
        Status: attributes.status || "paid",
        "Delivery URL": deliveryUrl,
        "Delivery Sent": true,
        "Delivery Sent At": new Date().toISOString(),
        Source: "lemonsqueezy_webhook",
      },
      existingOrder?.id,
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown Lemon Squeezy webhook error" },
      { status: 500 },
    );
  }
}
