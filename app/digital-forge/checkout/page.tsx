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
    <div className="min-h-screen pb-24 bg-[#030614] text-white font-sans selection:bg-blue-500/30">
      <section className="relative overflow-hidden pt-28 pb-20">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-[10%] w-[50%] h-[60%] bg-blue-600/15 rounded-full blur-[140px] mix-blend-screen" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030614]/80 to-[#030614]" />
        </div>

        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <Link
            href={offer.kind === "system" ? "/digital-forge/system" : `/digital-forge/products/${offer.slug}`}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/90 transition-colors text-sm font-semibold tracking-wider mb-10 uppercase"
          >
            ← Back to offer
          </Link>

          <div className="grid gap-12 grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(37,99,235,0.15)]">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                <span className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em]">
                  Secure Checkout
                </span>
              </span>

              <h1 className="text-white text-[clamp(2.2rem,5vw,3.5rem)] font-black leading-[1.05] tracking-tight mb-6 max-w-[800px] drop-shadow-lg">
                Complete your payment for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{offer.title}</span>
              </h1>

              <p className="text-white/70 text-lg leading-relaxed max-w-[760px] mb-10 font-medium">
                {offer.description}
              </p>

              <div className="grid gap-5 max-w-[560px]">
                {[
                  hasInternationalCheckout
                    ? "International checkout is handled securely by Lemon Squeezy."
                    : "Payment is handled securely on Flutterwave.",
                  "Your purchase is verified before delivery is sent.",
                  "Access is delivered automatically to your email after successful payment.",
                ].map((item) => (
                  <div key={item} className="flex gap-4 items-start p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center mt-0.5 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                      <span className="text-blue-400 text-xs font-black">✓</span>
                    </span>
                    <span className="text-white/80 leading-relaxed font-medium text-[0.95rem]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-[2.5rem] blur-xl transition-all duration-500 group-hover:blur-2xl opacity-70" />
              <div className="relative bg-[#0A0F24]/95 backdrop-blur-2xl border border-blue-500/20 rounded-[2rem] p-8 md:p-10 shadow-2xl transition-transform duration-500 hover:-translate-y-1">
                <p className="text-cyan-400 text-xs uppercase tracking-[0.2em] font-bold mb-3 flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-cyan-400/50" />
                  Order summary
                </p>
                <h2 className="text-white font-black text-2xl leading-tight mb-3 pr-8">
                  {offer.title}
                </h2>
                <div className="mb-8">
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 font-black text-4xl mb-2">
                    {primaryPriceLabel}
                  </p>
                  {hasInternationalCheckout ? (
                    <p className="text-white/50 text-sm font-medium">
                      Local Nigerian checkout is also available at {localPriceLabel}.
                    </p>
                  ) : null}
                </div>

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
