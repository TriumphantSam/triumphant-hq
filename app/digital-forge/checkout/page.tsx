import Link from "next/link";
import { notFound } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import { formatOfferPrice, resolveProductOffer, resolveSystemOffer, resolveUsdPriceLabel } from "@/lib/digital-forge-offers";

type CheckoutPageProps = {
  searchParams: Promise<{
    slug?: string;
    offer?: string;
  }>;
};

export const metadata = {
  title: "Secure Checkout | Digital Forge",
  description: "Complete your Digital Forge purchase securely via Flutterwave.",
};

export default async function DigitalForgeCheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const offer = params.offer === "system"
    ? resolveSystemOffer()
    : params.slug
      ? await resolveProductOffer(params.slug)
      : null;

  if (!offer) notFound();

  const priceLabel = formatOfferPrice(offer.amount, offer.currency);
  const usdPriceLabel = resolveUsdPriceLabel(offer.key, offer.kind);

  return (
    <div className="min-h-screen pb-24">
      <section className="relative overflow-hidden pt-28 pb-20">
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 15% 20%, rgba(0,102,255,0.22), transparent 30%), radial-gradient(circle at 80% 18%, rgba(0,204,255,0.18), transparent 24%), linear-gradient(180deg, rgba(4,9,24,0.98), rgba(5,5,16,1))",
          }}
        />

        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16 relative">
          <Link
            href={offer.kind === "system" ? "/digital-forge/system" : `/digital-forge/products/${offer.slug}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              color: "rgba(255,255,255,0.48)",
              textDecoration: "none",
              fontSize: "0.84rem",
              fontWeight: 600,
              marginBottom: "1.5rem",
            }}
          >
            ← Back to offer
          </Link>

          <div
            style={{
              display: "grid",
              gap: "2rem",
              gridTemplateColumns: "minmax(0, 1.05fr) minmax(320px, 0.95fr)",
              alignItems: "start",
            }}
          >
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  borderRadius: 999,
                  padding: "0.45rem 0.9rem",
                  border: "1px solid rgba(0,102,255,0.32)",
                  background: "rgba(0,102,255,0.12)",
                  color: "#60A5FA",
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  marginBottom: "1.2rem",
                }}
              >
                Secure Checkout
              </span>

              <h1
                style={{
                  color: "#fff",
                  fontSize: "clamp(2.2rem, 5vw, 4rem)",
                  fontWeight: 900,
                  lineHeight: 1.04,
                  letterSpacing: "-0.03em",
                  marginBottom: "1.1rem",
                  maxWidth: 800,
                }}
              >
                Complete your payment for {offer.title}
              </h1>

              <p
                style={{
                  color: "rgba(255,255,255,0.72)",
                  fontSize: "1.05rem",
                  lineHeight: 1.85,
                  maxWidth: 760,
                  marginBottom: "1.3rem",
                }}
              >
                {offer.description}
              </p>

              <div
                style={{
                  display: "grid",
                  gap: "0.85rem",
                  maxWidth: 560,
                }}
              >
                {[
                  "Payment is handled securely on Flutterwave.",
                  "Your purchase is verified before delivery is sent.",
                  "Access is delivered automatically to your email after successful payment.",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      gap: "0.65rem",
                      alignItems: "flex-start",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <span style={{ color: "#00CCFF", fontWeight: 900 }}>✓</span>
                    <span style={{ lineHeight: 1.7 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "rgba(9,14,32,0.92)",
                border: "1px solid rgba(0,102,255,0.26)",
                borderRadius: 24,
                padding: "1.65rem",
                boxShadow: "0 20px 80px rgba(0,0,0,0.4)",
              }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginBottom: "0.6rem",
                }}
              >
                Order summary
              </p>
              <h2
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "1.3rem",
                  lineHeight: 1.35,
                  marginBottom: "0.6rem",
                }}
              >
                {offer.title}
              </h2>
              <p
                style={{
                  color: "#60A5FA",
                  fontWeight: 900,
                  fontSize: "2rem",
                  marginBottom: "1.2rem",
                }}
              >
                {priceLabel}
              </p>

              <CheckoutClient
                offerKey={offer.key}
                offerKind={offer.kind}
                slug={offer.slug}
                title={offer.title}
                priceLabel={priceLabel}
                usdPriceLabel={usdPriceLabel}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
