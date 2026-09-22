import Link from "next/link";
import { notFound } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import CurrencyPrice from "@/components/CurrencyPrice";
import { formatOfferPrice, isLaunchBundleOffer, resolveCheckoutOffer, resolveUsdPriceLabel } from "@/lib/digital-forge-offers";

function parseLsVariantMap(raw: string): Record<string, number> {
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

type CheckoutPageProps = {
  searchParams: Promise<{
    slug?: string;
    offer?: string;
  }>;
};

export const metadata = {
  title: "Secure Checkout | Digital Forge",
  description: "Complete your Digital Forge purchase securely. Global and local payment options available.",
};

export default async function DigitalForgeCheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const offer = await resolveCheckoutOffer({
    offerKey: params.offer,
    slug: params.slug,
  });

  if (!offer) notFound();

  const localPriceLabel = formatOfferPrice(offer.amount, offer.currency);
  const usdPriceLabel = resolveUsdPriceLabel(offer.key, offer.kind, offer.amount);
  const lsVariantMap = parseLsVariantMap(process.env.DIGITAL_FORGE_LS_VARIANT_MAP_JSON ?? "");
  const defaultLsVariantId = Number(process.env.DIGITAL_FORGE_LS_DEFAULT_VARIANT_ID ?? "");
  const launchBundleVariantId = Number(process.env.DIGITAL_PRODUCT_LAUNCH_BUNDLE_LS_VARIANT_ID ?? "");
  const hasInternationalCheckout = Boolean(
    lsVariantMap[offer.key] ||
    (isLaunchBundleOffer(offer.key) && Number.isFinite(launchBundleVariantId) && launchBundleVariantId > 0) ||
    (Number.isFinite(defaultLsVariantId) && defaultLsVariantId > 0),
  );

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", color: "var(--text-primary)", fontFamily: "sans-serif", overflow: "hidden" }}>
      <section style={{ position: "relative", paddingTop: "clamp(6rem, 15vw, 8rem)", paddingBottom: "clamp(4rem, 10vw, 6rem)" }}>
        {/* Dynamic Background */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 15% 20%, rgba(0,102,255,0.24), transparent 32%), radial-gradient(circle at 85% 15%, rgba(0,204,255,0.16), transparent 26%), linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,250,255,1))",
          }}
        />

        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16 relative">
          <Link
            href={
              offer.kind === "system"
                ? "/digital-forge/system"
                : offer.kind === "course"
                  ? "/digital-forge/course"
                  : isLaunchBundleOffer(offer.key)
                    ? "/digital-product"
                    : `/digital-forge/products/${offer.slug}`
            }
            style={{
              display: "inline-block",
              color: "#64748b",
              textDecoration: "none",
              fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "clamp(2rem, 6vw, 4rem)",
            }}
          >
            ← Back to offer
          </Link>

          <div
            className="grid gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]"
            style={{ alignItems: "start" }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.55rem",
                  background: "rgba(7,94,229,0.08)",
                  border: "1px solid rgba(7,94,229,0.22)",
                  borderRadius: "999px",
                  padding: "0.42rem 1rem",
                  marginBottom: "1.6rem",
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#075ee5", display: "inline-block" }} />
                <span style={{ color: "#075ee5", fontSize: "clamp(0.75rem, 2vw, 0.85rem)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  Secure Checkout
                </span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
                  fontWeight: 900,
                  lineHeight: 1.05,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                  maxWidth: 800,
                  marginBottom: "1.8rem",
                }}
              >
                Complete your payment for <span style={{ color: "#075ee5" }}>{offer.title}</span>
              </h1>

              <p
                style={{
                  color: "#334155",
                  maxWidth: 760,
                  lineHeight: 1.8,
                  fontSize: "clamp(1.05rem, 2.5vw, 1.15rem)",
                  marginBottom: "clamp(1.5rem, 5vw, 3rem)",
                }}
              >
                {offer.description}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", maxWidth: 600 }}>
                {[
                  hasInternationalCheckout
                    ? "International checkout is handled securely by Lemon Squeezy."
                    : "Payment is handled securely on Flutterwave.",
                  "Your purchase is verified before delivery is sent.",
                  "Access is delivered automatically to your email after successful payment.",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1.2rem", background: "#ffffff", border: "1px solid #ffffff", borderRadius: 16 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "rgba(0,102,255,0.15)",
                        border: "1px solid rgba(0,102,255,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <span style={{ color: "#0077b8", fontSize: "0.7rem", fontWeight: 900 }}>✓</span>
                    </div>
                    <p style={{ color: "#334155", fontSize: "clamp(0.95rem, 2vw, 1.05rem)", lineHeight: 1.6, margin: 0 }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0,102,255,0.22)",
                borderRadius: 32,
                padding: "clamp(1.5rem, 5vw, 2.5rem)",
                boxShadow: "0 20px 80px rgba(15,23,42,0.12)",
              }}
            >
              <p
                style={{
                  color: "#0077b8",
                  fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ width: 24, height: 1, background: "rgba(0,204,255,0.5)" }} />
                Order summary
              </p>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 900, lineHeight: 1.1, marginBottom: "1rem" }}>
                {offer.title}
              </h2>
              <div style={{ marginBottom: "2rem" }}>
                <p style={{ color: "#075ee5", fontSize: "2.5rem", fontWeight: 900, margin: "0 0 0.5rem 0", lineHeight: 1.15 }}>
                  {hasInternationalCheckout && usdPriceLabel ? (
                    <>
                      {localPriceLabel}
                      <span style={{ color: "#64748b", fontWeight: 800 }}> / </span>
                      <CurrencyPrice ngnLabel={usdPriceLabel} usdLabel={usdPriceLabel} />
                    </>
                  ) : (
                    <CurrencyPrice ngnLabel={localPriceLabel} usdLabel={usdPriceLabel} />
                  )}
                </p>
                {hasInternationalCheckout ? (
                  <p style={{ color: "#64748b", fontSize: "clamp(0.85rem, 2vw, 0.95rem)", margin: 0, lineHeight: 1.5 }}>
                    Pay in Naira locally, or use international cards at the converted amount.
                  </p>
                ) : null}
              </div>

              <div style={{ borderTop: "1px solid rgba(15,23,42,0.11)", paddingTop: "2rem" }}>
                {offer.deliveryUrl ? (
                  <CheckoutClient
                    offerKey={offer.key}
                    offerKind={offer.kind}
                    slug={offer.slug}
                    title={offer.title}
                    priceLabel={localPriceLabel}
                    usdPriceLabel={usdPriceLabel}
                    hasInternationalCheckout={hasInternationalCheckout}
                  />
                ) : (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-slate-800">
                    <p className="font-bold">This offer is temporarily unavailable.</p>
                    <p className="mt-2 text-sm leading-6">Please contact us before purchasing. We will confirm when delivery is ready.</p>
                    <Link className="mt-4 inline-block font-semibold text-blue-700 underline" href="/contact">
                      Contact Triumphant HQ
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
