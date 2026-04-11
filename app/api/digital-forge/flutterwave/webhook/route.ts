import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { resolveProductOffer, resolveSystemOffer } from "@/lib/digital-forge-offers";

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY ?? "";
const FLUTTERWAVE_WEBHOOK_SECRET = process.env.FLUTTERWAVE_WEBHOOK_SECRET ?? "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const AIRTABLE_DIGITAL_FORGE_ORDERS_TABLE = process.env.AIRTABLE_DIGITAL_FORGE_ORDERS_TABLE ?? "Digital Forge Orders";
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID ?? "";
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY ?? "";
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY ?? "";
const EMAILJS_FROM_NAME = process.env.EMAILJS_FROM_NAME ?? "TriumphantHQ";
const EMAILJS_TEMPLATE_ID_DIGITAL_FORGE_DELIVERY = process.env.EMAILJS_TEMPLATE_ID_DIGITAL_FORGE_DELIVERY ?? "";
const SUPPORT_EMAIL = process.env.DIGITAL_FORGE_SUPPORT_EMAIL ?? "support@triumphanthq.com";

type VerifiedTransaction = {
  id: number;
  tx_ref: string;
  status: string;
  amount: number;
  charged_amount?: number;
  currency: "NGN" | "USD";
  customer?: {
    name?: string;
    email?: string;
  };
  meta?: Record<string, unknown> | Array<{ metaname?: string; metavalue?: string }>;
};

function safeFormulaValue(value: string): string {
  return value.replace(/'/g, "\\'");
}

function normalizeMeta(meta: VerifiedTransaction["meta"]): Record<string, string> {
  if (!meta) return {};
  if (Array.isArray(meta)) {
    return meta.reduce<Record<string, string>>((accumulator, entry) => {
      if (entry.metaname && entry.metavalue) {
        accumulator[entry.metaname] = entry.metavalue;
      }
      return accumulator;
    }, {});
  }

  return Object.entries(meta).reduce<Record<string, string>>((accumulator, [key, value]) => {
    if (typeof value === "string") accumulator[key] = value;
    return accumulator;
  }, {});
}

function hasValidSignature(rawBody: string, request: NextRequest): boolean {
  if (!FLUTTERWAVE_WEBHOOK_SECRET) return false;

  const modernSignature = request.headers.get("flutterwave-signature");
  if (modernSignature) {
    const digest = crypto
      .createHmac("sha256", FLUTTERWAVE_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("base64");
    if (digest === modernSignature) return true;
  }

  const legacySignature = request.headers.get("verif-hash");
  if (legacySignature && legacySignature === FLUTTERWAVE_WEBHOOK_SECRET) {
    return true;
  }

  return false;
}

async function verifyTransaction(transactionId: number): Promise<VerifiedTransaction> {
  const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
    headers: {
      Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const payload = (await response.json()) as {
    status?: string;
    message?: string;
    data?: VerifiedTransaction;
  };

  if (!response.ok || !payload.data) {
    throw new Error(payload.message || "Transaction verification failed.");
  }

  return payload.data;
}

async function findExistingOrder(transactionId: number): Promise<{ id: string; deliverySent: boolean } | null> {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) return null;

  const params = new URLSearchParams();
  params.set("maxRecords", "1");
  params.set("filterByFormula", `{Transaction ID}='${safeFormulaValue(String(transactionId))}'`);
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
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`EmailJS delivery send failed: ${response.status} ${detail}`);
  }
}

async function resolveDelivery(meta: Record<string, string>) {
  if (meta.offer_kind === "system" || meta.offer_key === "starter-system") {
    return resolveSystemOffer();
  }

  const slug = meta.product_slug || meta.offer_key;
  if (!slug) return null;
  return resolveProductOffer(slug);
}

export async function POST(request: NextRequest) {
  try {
    if (!FLUTTERWAVE_SECRET_KEY || !FLUTTERWAVE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Flutterwave webhook env is not configured." }, { status: 500 });
    }

    const rawBody = await request.text();
    if (!hasValidSignature(rawBody, request)) {
      return NextResponse.json({ error: "Invalid Flutterwave signature." }, { status: 401 });
    }

    const webhookPayload = JSON.parse(rawBody) as {
      event?: string;
      data?: {
        id?: number;
        status?: string;
      };
    };

    const transactionId = webhookPayload.data?.id;
    if (!transactionId) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const verified = await verifyTransaction(transactionId);
    if (verified.status !== "successful") {
      return NextResponse.json({ ok: true, ignored: true, status: verified.status });
    }

    const meta = normalizeMeta(verified.meta);
    const offer = await resolveDelivery(meta);
    const deliveryUrl = meta.delivery_url || offer?.deliveryUrl || "";
    const customerEmail = verified.customer?.email?.trim() ?? "";
    const customerName = verified.customer?.name?.trim() ?? "there";

    if (!customerEmail || !deliveryUrl) {
      throw new Error("Verified transaction is missing a customer email or delivery URL.");
    }

    const existingOrder = await findExistingOrder(transactionId);
    if (existingOrder?.deliverySent) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    const productTitle = meta.product_title || offer?.title || "Digital Forge purchase";
    const amount = Number(verified.charged_amount ?? verified.amount ?? 0);

    await sendDeliveryEmail({
      name: customerName,
      email: customerEmail,
      productTitle,
      deliveryUrl,
      amount,
      currency: verified.currency,
      txRef: verified.tx_ref,
    });

    await upsertOrder(
      {
        "Transaction ID": String(transactionId),
        "Tx Ref": verified.tx_ref,
        "Offer Key": meta.offer_key || offer?.key || "",
        "Offer Kind": meta.offer_kind || offer?.kind || "",
        "Product Slug": meta.product_slug || offer?.slug || "",
        "Product Title": productTitle,
        "Customer Name": customerName,
        "Customer Email": customerEmail,
        Amount: amount,
        Currency: verified.currency,
        Status: verified.status,
        "Delivery URL": deliveryUrl,
        "Delivery Sent": true,
        "Delivery Sent At": new Date().toISOString(),
        Source: "flutterwave_webhook",
      },
      existingOrder?.id,
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown webhook error" },
      { status: 500 },
    );
  }
}
