import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { forgeProducts, getForgeProduct } from "@/lib/digital-forge";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function buildInquiryHref(slug: string) {
  return `/contact?topic=digital-forge&product=${encodeURIComponent(slug)}`;
}

function dedupe(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}

export async function generateStaticParams() {
  return forgeProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = getForgeProduct(slug);
  if (!product) {
    return {};
  }
  return {
    title: product.seo?.metaTitle || `${product.title} | Digital Forge`,
    description: product.seo?.metaDescription || product.promise,
    openGraph: {
      title: product.seo?.ogTitle || product.title,
      description: product.seo?.ogDescription || product.promise,
      type: "article",
    },
  };
}

export default async function DigitalForgeProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getForgeProduct(slug);

  if (!product) {
    notFound();
  }

  const faqItems = product.seo?.schemaFaq?.length ? product.seo.schemaFaq : product.faq;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const primaryHref = buildInquiryHref(product.slug);
  const secondaryHref = "/digital-forge/products";
  const socialProof = dedupe(product.proofPoints).slice(0, 4);
  const deliverables = dedupe([...product.deliverables, ...product.bonuses]).slice(0, 8);
  const keyBenefits = dedupe(product.includes).slice(0, 6);

  return (
    <div className="min-h-screen pt-28 pb-20">
      {faqSchema.mainEntity.length > 0 ? (
        <Script id={`faq-schema-${product.slug}`} type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </Script>
      ) : null}

      <section className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
        <div
          className="rounded-[2rem] border border-[#1f4fff]/25 bg-[linear-gradient(135deg,rgba(5,8,20,0.96),rgba(6,18,52,0.9))] shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
          style={{ padding: "clamp(1.5rem, 4vw, 3rem)" }}
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-5 flex flex-wrap gap-3">
                <span className="rounded-full border border-[#2e5bff]/40 bg-[#07122d] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#7bdcff]">
                  {product.category}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                  {product.format}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                  {product.pricing}
                </span>
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                {product.headline || product.title}
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/78">
                {product.subheadline || product.promise}
              </p>

              <p className="mt-5 max-w-3xl text-base leading-8 text-white/65">
                {product.seo?.websiteIntroKeywordParagraph || product.approach || product.promise}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={primaryHref}
                  className="inline-flex items-center justify-center rounded-md bg-[#2f67ff] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-[#4b7cff]"
                >
                  Get Access
                </Link>
                <Link
                  href={secondaryHref}
                  className="inline-flex items-center justify-center rounded-md border border-white/15 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white/85 transition hover:border-[#7bdcff] hover:text-[#7bdcff]"
                >
                  Browse Library
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {keyBenefits.slice(0, 3).map((item) => (
                  <div key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-white/75">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_top,#1d4eff55,transparent_65%)] blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-[#2e5bff]/35 bg-[linear-gradient(180deg,#0b1638,#060b1d)] p-6 shadow-[0_25px_60px_rgba(4,12,40,0.45)]">
                {product.coverImageUrl ? (
                  <img
                    src={product.coverImageUrl}
                    alt={product.title}
                    className="h-full w-full rounded-[1.5rem] object-cover"
                  />
                ) : (
                  <>
                    <div className="mb-8 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.22em] text-[#7bdcff]">
                      <span>Digital Forge</span>
                      <span>{product.category}</span>
                    </div>
                    <div className="space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">Featured Product</p>
                      <h2 className="text-3xl font-black leading-tight text-white">{product.title}</h2>
                      <p className="text-sm leading-7 text-white/70">{product.promise}</p>
                    </div>
                    <div className="mt-10 grid gap-3">
                      {socialProof.slice(0, 3).map((point) => (
                        <div key={point} className="rounded-xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white/78">
                          {point}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-screen-xl px-6 sm:px-10 lg:px-16" style={{ paddingTop: "2rem" }}>
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass rounded-3xl" style={{ padding: "2rem" }}>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#7bdcff]">Who This Is For</p>
            <p className="text-base leading-8 text-white/72">{product.audience}</p>

            <p className="mb-3 mt-8 text-sm font-bold uppercase tracking-[0.18em] text-[#7bdcff]">The Problem</p>
            <p className="text-base leading-8 text-white/72">{product.problem}</p>

            <p className="mb-3 mt-8 text-sm font-bold uppercase tracking-[0.18em] text-[#7bdcff]">What You Walk Away With</p>
            <p className="text-base leading-8 text-white/72">{product.outcome}</p>
          </div>

          <div className="glass rounded-3xl" style={{ padding: "2rem" }}>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#7bdcff]">What You&apos;ll Get</p>
            <ul className="grid gap-3 text-white/75">
              {keyBenefits.map((item) => (
                <li key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 leading-7">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-screen-xl px-6 sm:px-10 lg:px-16" style={{ paddingTop: "2rem" }}>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="glass rounded-3xl" style={{ padding: "2rem" }}>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#7bdcff]">Ideal For</p>
            <ul className="grid gap-3 text-white/75">
              {product.idealFor.map((item) => (
                <li key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 leading-7">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-3xl" style={{ padding: "2rem" }}>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#7bdcff]">Deliverables & Bonuses</p>
            <ul className="grid gap-3 text-white/75">
              {deliverables.map((item) => (
                <li key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 leading-7">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {socialProof.length > 0 ? (
        <section className="max-w-screen-xl px-6 sm:px-10 lg:px-16" style={{ paddingTop: "2rem" }}>
          <div className="glass rounded-3xl" style={{ padding: "2rem" }}>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#7bdcff]">Why This Offer Converts</p>
            <div className="grid gap-3 lg:grid-cols-2">
              {socialProof.map((point) => (
                <div key={point} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-white/75 leading-7">
                  {point}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {product.faq.length > 0 ? (
        <section className="max-w-screen-xl px-6 sm:px-10 lg:px-16" style={{ paddingTop: "2rem" }}>
          <div className="glass rounded-3xl" style={{ padding: "2rem" }}>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#7bdcff]">Frequently Asked Questions</p>
            <div className="grid gap-5">
              {product.faq.map((item) => (
                <div key={item.question} className="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-5">
                  <h3 className="mb-2 text-lg font-bold text-white">{item.question}</h3>
                  <p className="text-white/72 leading-8">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="max-w-screen-xl px-6 sm:px-10 lg:px-16" style={{ paddingTop: "2rem" }}>
        <div className="rounded-[2rem] border border-[#2e5bff]/25 bg-[linear-gradient(135deg,rgba(6,11,29,0.96),rgba(7,18,50,0.88))] px-8 py-10 text-center shadow-[0_25px_70px_rgba(0,0,0,0.28)]">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7bdcff]">Ready To Move?</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl">
            {product.primaryAction || "Get The Bundle"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/72">
            {product.cta || "Take the next step and request the full bundle details."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center rounded-md bg-[#2f67ff] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-[#4b7cff]"
            >
              Request This Product
            </Link>
            <Link
              href="/digital-forge/resources"
              className="inline-flex items-center justify-center rounded-md border border-white/15 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white/85 transition hover:border-[#7bdcff] hover:text-[#7bdcff]"
            >
              View Free Resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

