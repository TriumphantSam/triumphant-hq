import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { resolveCheckoutOffer } from "@/lib/digital-forge-offers";
import { sendDigitalForgeDeliveryEmail } from "@/lib/digital-forge-delivery";

const FLUTTERWAVE_SECRET_KEY = (process.env.FLUTTERWAVE_SECRET_KEY ?? "").trim();
const FLUTTERWAVE_WEBHOOK_SECRET = (process.env.FLUTTERWAVE_WEBHOOK_SECRET ?? "").trim();
const ELGCC_FORWARD_URL = process.env.ELGCC_FORWARD_URL ?? "";
const ELGCC_FORWARD_SECRET = process.env.ELGCC_FORWARD_SECRET ?? "";

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

async function resolveDelivery(meta: Record<string, string>) {
  return resolveCheckoutOffer({
    offerKind: meta.offer_kind,
    offerKey: meta.offer_key,
    slug: meta.product_slug || meta.offer_key,
  });
}

function isElgccTosPayment(verified: VerifiedTransaction, meta: Record<string, string>) {
  return (
    verified.tx_ref?.startsWith("TOS26-") ||
    meta.source === "elgcc_tos2026" ||
    meta.registrationId?.startsWith("TOS26-")
  );
}

async function forwardElgccWebhook(rawBody: string) {
  if (!ELGCC_FORWARD_URL || !ELGCC_FORWARD_SECRET) {
    throw new Error("ELGCC webhook forwarding env is not configured.");
  }

  const response = await fetch(ELGCC_FORWARD_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-elgcc-webhook-secret": ELGCC_FORWARD_SECRET,
    },
    body: rawBody,
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`ELGCC webhook forwarding failed: ${response.status} ${detail}`);
  }
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
    const meta = normalizeMeta(verified.meta);

    if (isElgccTosPayment(verified, meta)) {
      await forwardElgccWebhook(rawBody);
      return NextResponse.json({ ok: true, forwarded: "elgcc_tos2026" });
    }

    if (verified.status !== "successful") {
      return NextResponse.json({ ok: true, ignored: true, status: verified.status });
    }

    const offer = await resolveDelivery(meta);
    const deliveryUrl = meta.delivery_url || offer?.deliveryUrl || "";
    const customerEmail = verified.customer?.email?.trim() ?? "";
    const customerName = verified.customer?.name?.trim() ?? "there";

    if (!customerEmail || !deliveryUrl) {
      throw new Error("Verified transaction is missing a customer email or delivery URL.");
    }

    const productTitle = meta.product_title || offer?.title || "Digital Forge purchase";
    const amount = Number(verified.charged_amount ?? verified.amount ?? 0);

    await sendDigitalForgeDeliveryEmail({
      name: customerName,
      email: customerEmail,
      productTitle,
      deliveryUrl,
      amount,
      currency: verified.currency,
      txRef: verified.tx_ref,
      offerKey: meta.offer_key || offer?.key,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown webhook error" },
      { status: 500 },
    );
  }
}
