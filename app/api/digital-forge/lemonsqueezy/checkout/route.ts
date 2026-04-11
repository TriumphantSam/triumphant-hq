import { NextRequest, NextResponse } from "next/server";
import { resolveProductOffer, resolveSystemOffer } from "@/lib/digital-forge-offers";

const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY ?? "";
const LEMON_SQUEEZY_STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID ?? "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "https://triumphanthq.com";
const LS_VARIANT_MAP = parseVariantMap(process.env.DIGITAL_FORGE_LS_VARIANT_MAP_JSON ?? "");

type CheckoutBody = {
  offerKind?: "product" | "system";
  offerKey?: string;
  slug?: string;
  name?: string;
  email?: string;
  phone?: string;
};

function parseVariantMap(raw: string): Record<string, number> {
  if (!raw.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.entries(parsed).reduce<Record<string, number>>((acc, [key, value]) => {
      const maybe = Number(value);
      if (Number.isFinite(maybe) && maybe > 0) acc[key] = maybe;
      return acc;
    }, {});
  } catch {
    return {};
  }
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
    if (!LEMON_SQUEEZY_API_KEY || !LEMON_SQUEEZY_STORE_ID) {
      return NextResponse.json({ error: "Lemon Squeezy environment is not configured." }, { status: 500 });
    }

    const body = (await request.json()) as CheckoutBody;
    const customerName = body.name?.trim() ?? "";
    const customerEmail = body.email?.trim() ?? "";
    if (!customerName || !customerEmail) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const offer = await resolveOffer(body);
    if (!offer) {
      return NextResponse.json({ error: "Offer not found." }, { status: 404 });
    }

    const variantId = LS_VARIANT_MAP[offer.key];
    if (!variantId) {
      return NextResponse.json(
        { error: `No Lemon Squeezy variant mapped for offer key: ${offer.key}` },
        { status: 400 },
      );
    }

    const redirectUrl = new URL("/digital-forge/checkout/confirmed", SITE_URL);
    redirectUrl.searchParams.set("offer", offer.key);
    redirectUrl.searchParams.set("provider", "lemonsqueezy");

    const lemonResponse = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LEMON_SQUEEZY_API_KEY}`,
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: customerEmail,
              name: customerName,
              custom: {
                offer_key: offer.key,
                offer_kind: offer.kind,
                product_slug: offer.slug ?? "",
                product_title: offer.title,
                delivery_url: offer.deliveryUrl ?? "",
              },
            },
            product_options: {
              redirect_url: redirectUrl.toString(),
              receipt_button_text: "Return to Digital Forge",
              receipt_link_url: redirectUrl.toString(),
            },
          },
          relationships: {
            store: { data: { type: "stores", id: String(LEMON_SQUEEZY_STORE_ID) } },
            variant: { data: { type: "variants", id: String(variantId) } },
          },
        },
      }),
      cache: "no-store",
    });

    const payload = (await lemonResponse.json()) as {
      errors?: Array<{ detail?: string }>;
      data?: { attributes?: { url?: string } };
    };

    const paymentLink = payload.data?.attributes?.url;
    if (!lemonResponse.ok || !paymentLink) {
      return NextResponse.json(
        { error: payload.errors?.[0]?.detail || "Lemon Squeezy could not create checkout." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      paymentLink,
      provider: "lemonsqueezy",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown Lemon Squeezy checkout error" },
      { status: 500 },
    );
  }
}
