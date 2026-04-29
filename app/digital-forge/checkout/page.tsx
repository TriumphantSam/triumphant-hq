import Link from "next/link";
import { notFound } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import { formatOfferPrice, resolveProductOffer, resolveSystemOffer, resolveUsdPriceLabel } from "@/lib/digital-forge-offers";

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
  description: "Complete your Digital Forge purchase securely via Lemon Squeezy or local naira checkout.",
};

export default async function DigitalForgeCheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const offer = params.offer === "system"
    ? resolveSystemOffer()
    : params.offer
      ? await resolveProductOffer(params.offer)
      : params.slug
        ? await resolveProductOffer(params.slug)
        : null;

  if (!offer) notFound();

  const localPriceLabel = formatOfferPrice(offer.amount, offer.currency);
  const usdPriceLabel = resolveUsdPriceLabel(offer.key, offer.kind);
  const lsVariantMap = parseLsVariantMap(process.env.DIGITAL_FORGE_LS_VARIANT_MAP_JSON ?? "");
  const hasInternationalCheckout = Boolean(lsVariantMap[offer.key]);
  const primaryPriceLabel = hasInternationalCheckout ? usdPriceLabel : localPriceLabel;

  return (
    <div style={{ background: "#050510", minHeight: "100vh", color: "#fff", fontFamily: "sans-serif", overflow: "hidden" }}>
      <section style={{ position: "relative", paddingTop: "clamp(6rem, 15vw, 8rem)", paddingBottom: "clamp(4rem, 10vw, 6rem)" }}>
        {/* Dynamic Background */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 15% 20%, rgba(0,102,255,0.24), transparent 32%), radial-gradient(circle at 85% 15%, rgba(0,204,255,0.16), transparent 26%), linear-gradient(180deg, rgba(6,11,29,0.97), rgba(5,5,16,1))",
          }}
        />

        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16 relative">
          <Link
            href={offer.kind === "system" ? "/digital-forge/system" : `/digital-forge/products/${offer.slug}`}
            style={{
              display: "inline-block",
              color: "rgba(255,255,255,0.5)",
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
                  background: "rgba(0,102,255,0.1)",
                  border: "1px solid rgba(0,102,255,0.35)",
                  borderRadius: "999px",
                  padding: "0.42rem 1rem",
                  marginBottom: "1.6rem",
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00CCFF", display: "inline-block", boxShadow: "0 0 10px rgba(0,204,255,0.8)" }} />
                <span style={{ color: "#00CCFF", fontSize: "clamp(0.75rem, 2vw, 0.85rem)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  Secure Checkout
                </span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
                  fontWeight: 900,
                  lineHeight: 1.05,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  maxWidth: 800,
                  marginBottom: "1.8rem",
                }}
              >
                Complete your payment for <span style={{ background: "linear-gradient(90deg, #0066FF, #00CCFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{offer.title}</span>
              </h1>

              <p
                style={{
                  color: "rgba(255,255,255,0.78)",
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
                  <div key={item} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1.2rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16 }}>
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
                      <span style={{ color: "#00CCFF", fontSize: "0.7rem", fontWeight: 900 }}>✓</span>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "clamp(0.95rem, 2vw, 1.05rem)", lineHeight: 1.6, margin: 0 }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "rgba(9,14,32,0.92)",
                border: "1px solid rgba(0,102,255,0.22)",
                borderRadius: 32,
                padding: "clamp(1.5rem, 5vw, 2.5rem)",
                boxShadow: "0 20px 80px rgba(0,0,0,0.4)",
              }}
            >
              <p
                style={{
                  color: "#00CCFF",
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
                <p style={{ background: "linear-gradient(90deg, #0066FF, #00CCFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontSize: "2.5rem", fontWeight: 900, margin: "0 0 0.5rem 0" }}>
                  {primaryPriceLabel}
                </p>
                {hasInternationalCheckout ? (
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(0.85rem, 2vw, 0.95rem)", margin: 0 }}>
                    Local Nigerian checkout is also available at {localPriceLabel}.
                  </p>
                ) : null}
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2rem" }}>
                <CheckoutClient
                  offerKey={offer.key}
                  offerKind={offer.kind}
                  slug={offer.slug}
                  title={offer.title}
                  priceLabel={localPriceLabel}
                  usdPriceLabel={usdPriceLabel}
                  hasInternationalCheckout={hasInternationalCheckout}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
