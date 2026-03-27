import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { forgeProducts, getForgeProduct } from "@/lib/digital-forge";

type PageProps = {
  params: Promise<{ slug: string }>;
};

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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (product.seo?.schemaFaq || product.faq || []).map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      {faqSchema.mainEntity.length > 0 ? (
        <Script id={`faq-schema-${product.slug}`} type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </Script>
      ) : null}

      <section className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
        <div className="glass rounded-3xl" style={{ padding: "clamp(2rem, 5vw, 4rem)" }}>
          <p
            className="uppercase tracking-widest text-sm font-semibold mb-3"
            style={{ color: "var(--secondary-color)", letterSpacing: "0.25em" }}
          >
            {product.category}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)", maxWidth: 860 }}>
            {product.headline || product.title}
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: 760, lineHeight: 1.8, marginBottom: "1.25rem" }}>
            {product.subheadline || product.promise}
          </p>
          {product.seo?.websiteIntroKeywordParagraph ? (
            <p style={{ color: "var(--text-secondary)", maxWidth: 760, lineHeight: 1.8, marginBottom: "1.5rem" }}>
              {product.seo.websiteIntroKeywordParagraph}
            </p>
          ) : null}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <span className="glass rounded-xl" style={{ padding: "0.8rem 1rem", color: "var(--text-primary)", fontWeight: 600 }}>
              {product.format}
            </span>
            <span className="glass rounded-xl" style={{ padding: "0.8rem 1rem", color: "var(--secondary-color)", fontWeight: 700 }}>
              {product.pricing}
            </span>
            {product.seo?.primaryKeyword ? (
              <span className="glass rounded-xl" style={{ padding: "0.8rem 1rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                SEO: {product.seo.primaryKeyword}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="max-w-screen-xl px-6 sm:px-10 lg:px-16" style={{ paddingTop: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "1.25rem" }}>
          <div className="glass rounded-3xl" style={{ padding: "2rem" }}>
            <h2 style={{ color: "var(--secondary-color)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
              What This Is For
            </h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>{product.audience}</p>
            <h3 style={{ color: "var(--text-primary)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Outcome
            </h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>{product.outcome}</p>
            <h3 style={{ color: "var(--text-primary)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Problem
            </h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{product.problem}</p>
          </div>
          <div className="glass rounded-3xl" style={{ padding: "2rem" }}>
            <h2 style={{ color: "var(--secondary-color)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
              What It Includes
            </h2>
            <ul style={{ display: "grid", gap: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7, paddingLeft: "1rem" }}>
              {product.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-screen-xl px-6 sm:px-10 lg:px-16" style={{ paddingTop: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          <div className="glass rounded-3xl" style={{ padding: "2rem" }}>
            <h2 style={{ color: "var(--secondary-color)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
              Ideal For
            </h2>
            <ul style={{ display: "grid", gap: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7, paddingLeft: "1rem" }}>
              {product.idealFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-3xl" style={{ padding: "2rem" }}>
            <h2 style={{ color: "var(--secondary-color)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
              Bonuses & Deliverables
            </h2>
            <ul style={{ display: "grid", gap: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7, paddingLeft: "1rem" }}>
              {[...product.deliverables, ...product.bonuses].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {product.faq.length > 0 ? (
        <section className="max-w-screen-xl px-6 sm:px-10 lg:px-16" style={{ paddingTop: "2rem" }}>
          <div className="glass rounded-3xl" style={{ padding: "2rem" }}>
            <h2 style={{ color: "var(--secondary-color)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: "grid", gap: "1.25rem" }}>
              {product.faq.map((item) => (
                <div key={item.question}>
                  <h3 style={{ color: "var(--text-primary)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                    {item.question}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="max-w-screen-xl px-6 sm:px-10 lg:px-16" style={{ paddingTop: "2rem" }}>
        <div className="glass rounded-3xl" style={{ padding: "2rem", textAlign: "center" }}>
          <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Product page template ready for automatic sync
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 700, margin: "0 auto 1.5rem", lineHeight: 1.8 }}>
            This page now reads generated Digital Forge product data, including SEO metadata, FAQ content, and product packaging details.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/digital-forge/products"
              style={{
                display: "inline-block",
                padding: "0.9rem 2.1rem",
                background: "var(--accent-color)",
                color: "#fff",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
                borderRadius: "2px",
              }}
            >
              Back to Library
            </Link>
            <Link
              href="/digital-forge/resources"
              style={{
                display: "inline-block",
                padding: "0.9rem 2.1rem",
                border: "1px solid var(--glass-border)",
                color: "var(--text-primary)",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
                borderRadius: "2px",
              }}
            >
              View Resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
