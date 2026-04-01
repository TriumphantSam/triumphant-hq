import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { getForgeProduct, getForgeProductSlugs } from "@/lib/digital-forge";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

function buildInquiryHref(slug: string, product_title: string) {
  return `/contact?topic=digital-forge&product=${encodeURIComponent(slug)}&title=${encodeURIComponent(product_title)}`;
}

function parseBonusItem(raw: string): { asset: string; role: string; perceived_value: string } | null {
  // Handle Python-style dict strings: {'asset': 'x', 'role': 'y', 'perceived_value': '$z'}
  try {
    // Try to parse as JSON first
    const json = JSON.parse(raw);
    if (json.asset) return json;
  } catch {
    // Fall back to regex extraction for Python-style dict strings
    const assetMatch = raw.match(/['"]asset['"]\s*:\s*['"]([^'"]+)['"]/);
    const roleMatch = raw.match(/['"]role['"]\s*:\s*['"]([^'"]+)['"]/);
    const valueMatch = raw.match(/['"]perceived_value['"]\s*:\s*['"]([^'"]+)['"]/);
    if (assetMatch) {
      return {
        asset: assetMatch[1] ?? raw,
        role: roleMatch?.[1] ?? "",
        perceived_value: valueMatch?.[1] ?? "",
      };
    }
  }
  // Plain string bonus
  if (raw && raw.trim()) {
    return { asset: raw.trim(), role: "", perceived_value: "" };
  }
  return null;
}

function dedupe(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}

export async function generateStaticParams() {
  const slugs = await getForgeProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getForgeProduct(slug);
  if (!product) return {};
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
  const product = await getForgeProduct(slug);

  if (!product) notFound();

  const faqItems = product.seo?.schemaFaq?.length ? product.seo.schemaFaq : product.faq;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const primaryHref = buildInquiryHref(product.slug, product.title);
  const parsedBonuses = product.bonuses
    .map(parseBonusItem)
    .filter(Boolean) as { asset: string; role: string; perceived_value: string }[];
  const keyBenefits = dedupe(product.includes).slice(0, 6);
  const idealFor = dedupe(product.idealFor).filter((s) => !s.includes("Digital Forge readers"));

  // Try to determine a "category color"
  const CATEGORY_ACCENT: Record<string, string> = {
    "AI Systems": "#0066FF",
    "Workflow Design": "#7c3aed",
    "Digital Products": "#00CCFF",
    "Social Media Growth & Monetization": "#f59e0b",
    "agentic AI solutions": "#10b981",
    "audiobooks and audio products": "#ec4899",
    "Creator Content Systems": "#f97316",
  };
  const accent = CATEGORY_ACCENT[product.category] ?? "#0066FF";

  return (
    <div className="min-h-screen pb-24">
      {faqSchema.mainEntity.length > 0 ? (
        <Script id={`faq-schema-${product.slug}`} type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </Script>
      ) : null}

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-10%",
            left: "30%",
            width: 800,
            height: 800,
            background: `radial-gradient(circle, ${accent}22 0%, transparent 65%)`,
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />

        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16 relative">
          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              marginBottom: "2rem",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/digital-forge/products"
              style={{
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              ← Product Library
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.8rem" }}>/</span>
            <span style={{ color: accent, fontSize: "0.8rem", fontWeight: 600 }}>
              {product.category}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 0.85fr",
              gap: "3rem",
              alignItems: "start",
            }}
            className="lg:grid-cols-[1.15fr_0.85fr]"
          >
            {/* LEFT ─ Copy */}
            <div>
              {/* Category + format badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "1.5rem" }}>
                <span
                  style={{
                    background: `${accent}20`,
                    border: `1px solid ${accent}50`,
                    borderRadius: "100px",
                    padding: "0.35rem 1rem",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: accent,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {product.category}
                </span>
                <span
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "100px",
                    padding: "0.35rem 1rem",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.6)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  {product.format}
                </span>
              </div>

              {/* Headline */}
              <h1
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 900,
                  lineHeight: 1.06,
                  color: "#fff",
                  marginBottom: "1.35rem",
                  letterSpacing: "-0.02em",
                  maxWidth: 780,
                }}
              >
                {product.headline || product.title}
              </h1>

              {/* Subheadline */}
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                  maxWidth: 660,
                  marginBottom: "1.25rem",
                }}
              >
                {product.subheadline || product.promise}
              </p>

              {/* SEO intro paragraph */}
              {product.seo?.websiteIntroKeywordParagraph && (
                <p
                  style={{
                    color: "rgba(255,255,255,0.52)",
                    fontSize: "0.92rem",
                    lineHeight: 1.85,
                    maxWidth: 640,
                    marginBottom: "2rem",
                  }}
                >
                  {product.seo.websiteIntroKeywordParagraph}
                </p>
              )}

              {/* CTA Buttons */}
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", marginBottom: "2rem" }}
              >
                <Link
                  href={primaryHref}
                  id={`product-primary-cta-${slug}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "1.05rem 2.4rem",
                    background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    borderRadius: "8px",
                    boxShadow: `0 0 35px ${accent}55`,
                    transition: "opacity 0.2s",
                  }}
                >
                  Get Instant Access →
                </Link>
                <Link
                  href="/digital-forge/products"
                  id={`product-browse-library-${slug}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "1.05rem 2.2rem",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.75)",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    letterSpacing: "0.09em",
                    textTransform: "uppercase",
                    borderRadius: "8px",
                  }}
                >
                  Browse Library
                </Link>
              </div>

              {/* Quick-win bullets */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "0.65rem",
                }}
              >
                {keyBenefits.map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.6rem",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "10px",
                      padding: "0.7rem 0.9rem",
                    }}
                  >
                    <span style={{ color: accent, fontWeight: 900, marginTop: "0.1rem" }}>✓</span>
                    <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.82rem", lineHeight: 1.55 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT ─ Product Card Visual */}
            <div style={{ position: "sticky", top: "7rem" }}>
              <div
                style={{
                  position: "relative",
                  background: "linear-gradient(165deg, rgba(7,14,40,0.97), rgba(5,8,20,0.99))",
                  border: `1px solid ${accent}40`,
                  borderTop: `4px solid ${accent}`,
                  borderRadius: "20px",
                  padding: "2rem",
                  boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px ${accent}15`,
                }}
              >
                {/* Glow blob */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "80%",
                    height: 120,
                    background: `radial-gradient(ellipse, ${accent}25 0%, transparent 70%)`,
                    filter: "blur(20px)",
                    pointerEvents: "none",
                  }}
                />

                <div style={{ position: "relative" }}>
                  <p
                    style={{
                      color: accent,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Digital Forge
                  </p>
                  <h2
                    style={{
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: "1.3rem",
                      lineHeight: 1.3,
                      marginBottom: "1.25rem",
                    }}
                  >
                    {product.title}
                  </h2>

                  {/* What's in the box */}
                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      padding: "1.25rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <p
                      style={{
                        color: "rgba(255,255,255,0.45)",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        marginBottom: "0.85rem",
                      }}
                    >
                      Everything Inside
                    </p>
                    {product.deliverables.slice(0, 5).map((d, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.6rem",
                          paddingBottom: "0.55rem",
                          borderBottom:
                            i < product.deliverables.slice(0, 5).length - 1
                              ? "1px solid rgba(255,255,255,0.05)"
                              : "none",
                          marginBottom: "0.55rem",
                        }}
                      >
                        <span
                          style={{
                            color: accent,
                            fontWeight: 800,
                            fontSize: "0.75rem",
                            marginTop: "0.1rem",
                          }}
                        >
                          ✓
                        </span>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.72)",
                            fontSize: "0.84rem",
                            lineHeight: 1.55,
                          }}
                        >
                          {d}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bonus count */}
                  {parsedBonuses.length > 0 && (
                    <div
                      style={{
                        background: `${accent}12`,
                        border: `1px solid ${accent}30`,
                        borderRadius: "10px",
                        padding: "0.85rem 1.1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.65rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>🎁</span>
                      <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.84rem" }}>
                        <strong style={{ color: "#fff" }}>
                          {parsedBonuses.length} Bonus
                          {parsedBonuses.length > 1 ? "es" : ""}
                        </strong>{" "}
                        included — extra implementation tools
                      </span>
                    </div>
                  )}

                  {/* CTA */}
                  <Link
                    href={primaryHref}
                    id={`product-sidebar-cta-${slug}`}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "center",
                      padding: "1rem",
                      background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: "0.88rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      borderRadius: "10px",
                      boxShadow: `0 0 25px ${accent}44`,
                    }}
                  >
                    Get Instant Access →
                  </Link>

                  <p
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontSize: "0.72rem",
                      textAlign: "center",
                      marginTop: "0.75rem",
                    }}
                  >
                    Reply to our message or contact us directly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM + OUTCOME + AUDIENCE ─── */}
      <section style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {/* Who It's For */}
            {idealFor.length > 0 && (
              <div
                style={{
                  background: "rgba(5,8,20,0.8)",
                  border: "1px solid rgba(0,102,255,0.2)",
                  borderRadius: "16px",
                  padding: "2rem",
                }}
              >
                <p
                  style={{
                    color: accent,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    marginBottom: "1rem",
                  }}
                >
                  Who This Is For
                </p>
                <ul style={{ display: "grid", gap: "0.75rem" }}>
                  {idealFor.slice(0, 4).map((item) => (
                    <li
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.6rem",
                        color: "rgba(255,255,255,0.68)",
                        fontSize: "0.92rem",
                        lineHeight: 1.65,
                      }}
                    >
                      <span style={{ color: accent, fontWeight: 800, marginTop: "0.1rem" }}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* The Outcome */}
            <div
              style={{
                background: "rgba(5,8,20,0.8)",
                border: "1px solid rgba(0,102,255,0.2)",
                borderRadius: "16px",
                padding: "2rem",
              }}
            >
              <p
                style={{
                  color: accent,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                What You Walk Away With
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.68)",
                  lineHeight: 1.8,
                  fontSize: "0.95rem",
                }}
              >
                {product.outcome}
              </p>
            </div>

            {/* Audience */}
            {product.audience && !product.audience.includes("Digital Forge readers") && (
              <div
                style={{
                  background: "rgba(5,8,20,0.8)",
                  border: "1px solid rgba(0,102,255,0.2)",
                  borderRadius: "16px",
                  padding: "2rem",
                }}
              >
                <p
                  style={{
                    color: accent,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    marginBottom: "1rem",
                  }}
                >
                  Built For
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.68)",
                    lineHeight: 1.8,
                    fontSize: "0.95rem",
                  }}
                >
                  {product.audience}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── BONUS STACK ─── */}
      {parsedBonuses.length > 0 && (
        <section style={{ paddingTop: "2rem" }}>
          <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
            <div
              style={{
                background: `linear-gradient(145deg, ${accent}10, rgba(5,8,20,0.95) 60%)`,
                border: `1px solid ${accent}30`,
                borderRadius: "20px",
                padding: "clamp(2rem, 4vw, 3.5rem)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: "1.75rem" }}>🎁</span>
                <div>
                  <p
                    style={{
                      color: accent,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                    }}
                  >
                    Included Free — Bonus Stack
                  </p>
                  <h2
                    style={{
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: "1.6rem",
                      lineHeight: 1.2,
                    }}
                  >
                    You Also Get These Bonuses
                  </h2>
                </div>
              </div>

              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.9rem",
                  marginBottom: "2rem",
                  marginLeft: "2.75rem",
                }}
              >
                Every product ships with a curated bonus stack to accelerate your implementation.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                {parsedBonuses.map((bonus, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "14px",
                      padding: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <p
                        style={{
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "0.92rem",
                          lineHeight: 1.4,
                          flex: 1,
                        }}
                      >
                        {bonus.asset}
                      </p>
                      {bonus.perceived_value && (
                        <span
                          style={{
                            background: `${accent}20`,
                            border: `1px solid ${accent}40`,
                            borderRadius: "8px",
                            padding: "0.2rem 0.5rem",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: accent,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Value: {bonus.perceived_value}
                        </span>
                      )}
                    </div>
                    {bonus.role && (
                      <p
                        style={{
                          color: "rgba(255,255,255,0.52)",
                          fontSize: "0.83rem",
                          lineHeight: 1.65,
                        }}
                      >
                        {bonus.role}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── FAQ ─── */}
      {product.faq.length > 0 && (
        <section style={{ paddingTop: "3rem" }}>
          <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
            <div
              style={{
                background: "rgba(5,8,20,0.8)",
                border: "1px solid rgba(0,102,255,0.2)",
                borderRadius: "20px",
                padding: "clamp(2rem, 4vw, 3.5rem)",
              }}
            >
              <p
                style={{
                  color: accent,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                Got Questions?
              </p>
              <h2
                style={{
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  marginBottom: "2rem",
                  letterSpacing: "-0.01em",
                }}
              >
                Frequently Asked Questions
              </h2>

              <div style={{ display: "grid", gap: "1rem" }}>
                {product.faq.map((item) => (
                  <div
                    key={item.question}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderLeft: `3px solid ${accent}`,
                      borderRadius: "12px",
                      padding: "1.4rem 1.6rem",
                    }}
                  >
                    <h3
                      style={{
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "1rem",
                        marginBottom: "0.65rem",
                      }}
                    >
                      {item.question}
                    </h3>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.62)",
                        lineHeight: 1.8,
                        fontSize: "0.92rem",
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── BOTTOM CTA ─── */}
      <section style={{ paddingTop: "4rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              position: "relative",
              background: `linear-gradient(135deg, ${accent}28, rgba(7,18,50,0.95) 55%)`,
              border: `1px solid ${accent}40`,
              borderRadius: "24px",
              padding: "clamp(3rem, 5vw, 5rem)",
              textAlign: "center",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 600,
                height: 250,
                background: `radial-gradient(ellipse, ${accent}22 0%, transparent 70%)`,
                filter: "blur(50px)",
                pointerEvents: "none",
              }}
            />

            <p
              style={{
                color: accent,
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginBottom: "1rem",
                position: "relative",
              }}
            >
              Ready To Move?
            </p>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.1,
                maxWidth: 640,
                margin: "0 auto 1.25rem",
                position: "relative",
                letterSpacing: "-0.01em",
              }}
            >
              {product.primaryAction || "Get The Full Bundle Today"}
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.58)",
                fontSize: "1rem",
                lineHeight: 1.8,
                maxWidth: 520,
                margin: "0 auto 2.5rem",
                position: "relative",
              }}
            >
              {product.cta || "Take the next step — get instant access to this bundle."}
            </p>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
                position: "relative",
              }}
            >
              <Link
                href={primaryHref}
                id={`product-bottom-cta-${slug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1.1rem 2.8rem",
                  background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: "0.92rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  borderRadius: "10px",
                  boxShadow: `0 0 40px ${accent}55`,
                }}
              >
                Request This Product →
              </Link>
              <Link
                href="/digital-forge/resources"
                id={`product-bottom-resources-${slug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1.1rem 2.4rem",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.72)",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  borderRadius: "10px",
                }}
              >
                View Free Resources
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
