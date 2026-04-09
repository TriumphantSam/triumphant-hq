import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { resolveProductOffer, resolveSystemOffer } from "@/lib/digital-forge-offers";

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY ?? "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "https://triumphanthq.com";
const SUPPORT_EMAIL = process.env.DIGITAL_FORGE_SUPPORT_EMAIL ?? "support@triumphanthq.com";

type CheckoutBody = {
  offerKind?: "product" | "system";
  offerKey?: string;
  slug?: string;
  name?: string;
  email?: string;
  phone?: string;
};

function buildTxRef(offerKey: string): string {
  const safeKey = offerKey.replace(/[^a-z0-9-]/gi, "-").slice(0, 48);
  const nonce = crypto.randomBytes(4).toString("hex");
  return `dg-${safeKey}-${Date.now()}-${nonce}`;
}

async function resolveOffer(body: CheckoutBody) {
  if (body.offerKind === "system" || body.offerKey === "starter-system") {
    return resolveSystemOffer();
  }

  const slug = body.slug?.trim() || body.offerKey?.trim();
  if (!slug) return null;
  return resolveProductOffer(slug);
}

export async function POST(request: NextRequest) {
  try {
    if (!FLUTTERWAVE_SECRET_KEY) {
      return NextResponse.json({ error: "Flutterwave secret key is not configured." }, { status: 500 });
    }

    const body = (await request.json()) as CheckoutBody;
    const customerName = body.name?.trim() ?? "";
    const customerEmail = body.email?.trim() ?? "";
    const customerPhone = body.phone?.trim() ?? "";

    if (!customerName || !customerEmail) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const offer = await resolveOffer(body);
    if (!offer) {
      return NextResponse.json({ error: "Offer not found." }, { status: 404 });
    }

    const txRef = buildTxRef(offer.key);
    const redirectUrl = new URL("/digital-forge/checkout/confirmed", SITE_URL);
    redirectUrl.searchParams.set("offer", offer.key);
    redirectUrl.searchParams.set("tx_ref", txRef);

    const flutterwaveResponse = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: offer.amount,
        currency: offer.currency,
        redirect_url: redirectUrl.toString(),
        customer: {
          email: customerEmail,
          name: customerName,
          phonenumber: customerPhone || undefined,
        },
        customizations: {
          title: offer.title,
          description: offer.description,
        },
        meta: {
          offer_key: offer.key,
          offer_kind: offer.kind,
          product_slug: offer.slug ?? "",
          product_title: offer.title,
          delivery_url: offer.deliveryUrl ?? "",
          support_email: SUPPORT_EMAIL,
        },
      }),
      cache: "no-store",
    });

    const payload = (await flutterwaveResponse.json()) as {
      status?: string;
      message?: string;
      data?: { link?: string };
    };

    if (!flutterwaveResponse.ok || !payload.data?.link) {
      return NextResponse.json(
        { error: payload.message || "Flutterwave could not create the payment session." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      paymentLink: payload.data.link,
      txRef,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown checkout error" },
      { status: 500 },
    );
  }
}
