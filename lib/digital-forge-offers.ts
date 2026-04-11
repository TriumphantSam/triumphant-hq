import { getForgeProduct } from "@/lib/digital-forge";

export type CheckoutOffer = {
  kind: "product" | "system";
  key: string;
  slug?: string;
  title: string;
  description: string;
  amount: number;
  currency: "NGN" | "USD";
  deliveryUrl?: string;
};

const DEFAULT_PRODUCT_PRICE_NGN = Number(process.env.DIGITAL_FORGE_PRODUCT_PRICE_NGN ?? "3000");
const FIXED_SYSTEM_PRICE_NGN = 15000;
const DEFAULT_CURRENCY = (process.env.DIGITAL_FORGE_CHECKOUT_CURRENCY ?? "NGN").toUpperCase() as "NGN" | "USD";
const SYSTEM_DELIVERY_URL = process.env.DIGITAL_FORGE_SYSTEM_DELIVERY_URL ?? "";
const PRICE_OVERRIDES = parsePriceOverrides(process.env.DIGITAL_FORGE_PRICE_OVERRIDES_JSON ?? "");
const DELIVERY_URL_OVERRIDES = parseStringOverrides(process.env.DIGITAL_FORGE_DELIVERY_URL_OVERRIDES_JSON ?? "");
const LEGACY_SLUG_PRICE_HINTS: Record<string, number> = {
  // Legacy live slug still used in blog/product links.
  "beyond-listening-how-to-co-create-your-favorite-au": 3000,
};

function parseStringOverrides(raw: string): Record<string, string> {
  if (!raw.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.entries(parsed).reduce<Record<string, string>>((accumulator, [key, value]) => {
      if (typeof value === "string" && value.length > 5) accumulator[key] = value;
      return accumulator;
    }, {});
  } catch {
    return {};
  }
}

function parsePriceOverrides(raw: string): Record<string, number> {
  if (!raw.trim()) return {};

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.entries(parsed).reduce<Record<string, number>>((accumulator, [key, value]) => {
      const amount = Number(value);
      if (Number.isFinite(amount) && amount > 0) {
        accumulator[key] = amount;
      }
      return accumulator;
    }, {});
  } catch {
    return {};
  }
}

export function formatOfferPrice(amount: number, currency: "NGN" | "USD"): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function parsePriceFromText(value?: string): number | null {
  if (!value) return null;
  const numeric = value.replace(/[^\d.]/g, "");
  const amount = Number(numeric);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount);
}

export async function resolveProductOffer(slug: string): Promise<CheckoutOffer | null> {
  const product = await getForgeProduct(slug);
  if (!product) return null;
  const productCurrency = product.currency === "USD" ? "USD" : DEFAULT_CURRENCY;
  const productAmount = Number(product.priceNgn);
  const pricingTextAmount = parsePriceFromText(product.pricing);
  const legacyHintAmount = LEGACY_SLUG_PRICE_HINTS[slug];
  const resolvedAmount =
    PRICE_OVERRIDES[slug] ??
    (Number.isFinite(productAmount) && productAmount > 0 ? productAmount : null) ??
    pricingTextAmount ??
    legacyHintAmount ??
    DEFAULT_PRODUCT_PRICE_NGN;

  return {
    kind: "product",
    key: slug,
    slug: product.slug,
    title: product.title,
    description: product.promise || product.subheadline || "Instant-access Digital Forge bundle",
    amount: resolvedAmount,
    currency: productCurrency,
    deliveryUrl: DELIVERY_URL_OVERRIDES[slug] ?? product.driveFolderLink,
  };
}

export function resolveSystemOffer(): CheckoutOffer {
  return {
    kind: "system",
    key: "starter-system",
    title: "Digital Forge Side Hustle Starter System",
    description:
      "The complete practical toolkit with guide, prompts, templates, launch assets, and operating documents to build and sell your first AI-powered digital product.",
    amount: FIXED_SYSTEM_PRICE_NGN,
    currency: DEFAULT_CURRENCY,
    deliveryUrl: SYSTEM_DELIVERY_URL,
  };
}
