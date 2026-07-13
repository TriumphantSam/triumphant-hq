import { NextRequest, NextResponse } from "next/server";

const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY ?? "";
const LEMON_SQUEEZY_STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID ?? "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "https://triumphanthq.com";
const SUPPORT_EMAIL = process.env.DIGITAL_FORGE_SUPPORT_EMAIL ?? "support@triumphanthq.com";

const PLAN_VARIANTS: Record<string, number> = {
  starter: Number(process.env.LEMON_SQUEEZY_SEO_STARTER_VARIANT_ID ?? ""),
  growth: Number(process.env.LEMON_SQUEEZY_SEO_GROWTH_VARIANT_ID ?? ""),
};

const PLAN_LABELS: Record<string, string> = {
  starter: "SEO Starter Retainer",
  growth: "SEO Growth Retainer",
};

export async function GET(request: NextRequest) {
  try {
    if (!LEMON_SQUEEZY_API_KEY || !LEMON_SQUEEZY_STORE_ID) {
      return NextResponse.json({ error: "Lemon Squeezy environment is not configured." }, { status: 500 });
    }

    const plan = request.nextUrl.searchParams.get("plan")?.trim().toLowerCase() ?? "";
    const variantId = PLAN_VARIANTS[plan];
    if (!variantId || !Number.isFinite(variantId)) {
      return NextResponse.json({ error: "Invalid or unavailable subscription plan." }, { status: 400 });
    }

    const redirectUrl = new URL("/services", SITE_URL);
    redirectUrl.searchParams.set("subscription", plan);
    redirectUrl.searchParams.set("provider", "lemonsqueezy");

    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
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
            checkout_options: {
              embed: false,
              media: false,
              logo: true,
            },
            checkout_data: {
              custom: {
                plan_key: plan,
                plan_title: PLAN_LABELS[plan],
                support_email: SUPPORT_EMAIL,
              },
            },
            product_options: {
              enabled_variants: [variantId],
              redirect_url: redirectUrl.toString(),
              receipt_button_text: "Return to Triumphant HQ",
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

    const payload = (await response.json()) as {
      data?: { attributes?: { url?: string } };
      errors?: Array<{ detail?: string }>;
    };

    const checkoutUrl = payload.data?.attributes?.url;
    if (!response.ok || !checkoutUrl) {
      return NextResponse.json(
        { error: payload.errors?.[0]?.detail || "Unable to create subscription checkout." },
        { status: 502 },
      );
    }

    return NextResponse.redirect(checkoutUrl);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown subscription checkout error" },
      { status: 500 },
    );
  }
}

