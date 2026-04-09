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

const DEFAULT_PRODUCT_PRICE_NGN = Number(process.env.DIGITAL_FORGE_PRODUCT_PRICE_NGN ?? "25000");
const DEFAULT_SYSTEM_PRICE_NGN = Number(process.env.DIGITAL_FORGE_SYSTEM_PRICE_NGN ?? "25000");
const DEFAULT_CURRENCY = (process.env.DIGITAL_FORGE_CHECKOUT_CURRENCY ?? "NGN").toUpperCase() as "NGN" | "USD";
const SYSTEM_DELIVERY_URL = process.env.DIGITAL_FORGE_SYSTEM_DELIVERY_URL ?? "";
const PRICE_OVERRIDES = parsePriceOverrides(process.env.DIGITAL_FORGE_PRICE_OVERRIDES_JSON ?? "");

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

export async function resolveProductOffer(slug: string): Promise<CheckoutOffer | null> {
  const product = await getForgeProduct(slug);
  if (!product) return null;

  return {
    kind: "product",
    key: slug,
    slug: product.slug,
    title: product.title,
    description: product.promise || product.subheadline || "Instant-access Digital Forge bundle",
    amount: PRICE_OVERRIDES[slug] ?? DEFAULT_PRODUCT_PRICE_NGN,
    currency: DEFAULT_CURRENCY,
    deliveryUrl: product.driveFolderLink,
  };
}

export function resolveSystemOffer(): CheckoutOffer {
  return {
    kind: "system",
    key: "starter-system",
    title: "Digital Forge Side Hustle Starter System",
    description:
      "The complete practical toolkit with guide, prompts, templates, launch assets, and operating documents to build and sell your first AI-powered digital product.",
    amount: PRICE_OVERRIDES["starter-system"] ?? DEFAULT_SYSTEM_PRICE_NGN,
    currency: DEFAULT_CURRENCY,
    deliveryUrl: SYSTEM_DELIVERY_URL,
  };
}
