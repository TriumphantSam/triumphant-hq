import { resolveCheckoutOffer } from "@/lib/digital-forge-offers";
import { sendDigitalForgeDeliveryEmail } from "@/lib/digital-forge-delivery";

const FLUTTERWAVE_SECRET_KEY = (process.env.FLUTTERWAVE_SECRET_KEY ?? "").trim();

type VerifiedTransaction = {
  id: number;
  tx_ref: string;
  status: string;
  amount: number;
  charged_amount?: number;
  currency: string;
  customer?: {
    name?: string;
    email?: string;
  };
  meta?: Record<string, unknown> | Array<{ metaname?: string; metavalue?: string }>;
};

export type FulfillmentResult = {
  verified: boolean;
  emailSent: boolean;
  deliveryUrl: string;
  productTitle: string;
  error?: string;
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

async function verifyById(transactionId: number): Promise<VerifiedTransaction> {
  const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
    headers: {
      Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  const payload = (await response.json()) as { data?: VerifiedTransaction; message?: string };
  if (!response.ok || !payload.data) {
    throw new Error(payload.message || "Transaction verification failed.");
  }
  return payload.data;
}

async function verifyByTxRef(txRef: string): Promise<VerifiedTransaction> {
  const endpoint = new URL("https://api.flutterwave.com/v3/transactions/verify_by_reference");
  endpoint.searchParams.set("tx_ref", txRef);
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  const payload = (await response.json()) as { data?: VerifiedTransaction; message?: string };
  if (!response.ok || !payload.data) {
    throw new Error(payload.message || "Transaction verification failed.");
  }
  return payload.data;
}

export async function fulfillFlutterwavePurchase(params: {
  txRef?: string;
  transactionId?: string;
}): Promise<FulfillmentResult> {
  if (!FLUTTERWAVE_SECRET_KEY) {
    return { verified: false, emailSent: false, deliveryUrl: "", productTitle: "", error: "missing_secret" };
  }

  const numericId = Number(params.transactionId);
  let verified: VerifiedTransaction;
  try {
    verified =
      Number.isFinite(numericId) && numericId > 0
        ? await verifyById(numericId)
        : params.txRef
          ? await verifyByTxRef(params.txRef)
          : (() => {
              throw new Error("missing_reference");
            })();
  } catch (error) {
    return {
      verified: false,
      emailSent: false,
      deliveryUrl: "",
      productTitle: "",
      error: error instanceof Error ? error.message : "verify_failed",
    };
  }

  if (verified.status !== "successful") {
    return { verified: false, emailSent: false, deliveryUrl: "", productTitle: "", error: verified.status };
  }

  const meta = normalizeMeta(verified.meta);
  const offer = await resolveCheckoutOffer({
    offerKind: meta.offer_kind,
    offerKey: meta.offer_key,
    slug: meta.product_slug || meta.offer_key,
  });
  const deliveryUrl = meta.delivery_url || offer?.deliveryUrl || "";
  const productTitle = meta.product_title || offer?.title || "Digital Forge purchase";
  const customerEmail = verified.customer?.email?.trim() ?? "";
  const customerName = verified.customer?.name?.trim() ?? "there";

  if (!customerEmail || !deliveryUrl) {
    return {
      verified: true,
      emailSent: false,
      deliveryUrl,
      productTitle,
      error: "missing_email_or_delivery_url",
    };
  }

  try {
    await sendDigitalForgeDeliveryEmail({
      name: customerName,
      email: customerEmail,
      productTitle,
      deliveryUrl,
      amount: Number(verified.charged_amount ?? verified.amount ?? 0),
      currency: verified.currency,
      txRef: verified.tx_ref,
      offerKey: meta.offer_key || offer?.key,
    });
    return { verified: true, emailSent: true, deliveryUrl, productTitle };
  } catch (error) {
    return {
      verified: true,
      emailSent: false,
      deliveryUrl,
      productTitle,
      error: error instanceof Error ? error.message : "email_failed",
    };
  }
}
