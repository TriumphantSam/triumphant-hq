import Link from "next/link";
import { getForgeProducts } from "@/lib/digital-forge";

export const metadata = {
  title: "Digital Forge Products — AI Playbooks & Systems | Triumphant HQ",
  description:
    "Explore the Digital Forge product library. Premium ebooks, AI prompt packs, business playbooks, and implementation systems for serious operators.",
};

const CATEGORY_COLORS: Record<string, string> = {
  "AI Systems": "#0066FF",
  "Workflow Design": "#7c3aed",
  "Digital Products": "#00CCFF",
  "Social Media Growth & Monetization": "#f59e0b",
  "agentic AI solutions": "#10b981",
  "audiobooks and audio products": "#ec4899",
  "Creator Content Systems": "#f97316",
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "#0066FF";
}

export default async function DigitalForgeProductsPage() {
  const forgeProducts = await getForgeProducts();

  return (
    <div className="min-h-screen pb-24">
      {/* ─── HEADER ─── */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-5%",
            right: "5%",
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(0,102,255,0.15) 0%, transparent 70%)",
            filter: "blur(70px)",
            pointerEvents: "none",
          }}
        />

        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16 relative">
          <Link
            href="/digital-forge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "rgba(255,255,255,0.5)",
              textDecoration: "none",
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              marginBottom: "1.75rem",
              transition: "color 0.2s",
            }}
          >
            ← Digital Forge
          </Link>

          <p
            style={{
              color: "#00CCFF",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: "0.85rem",
            }}
          >
            Product Library
          </p>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.08,
              maxWidth: 760,
              marginBottom: "1.25rem",
              letterSpacing: "-0.02em",
            }}
          >
            Every product is a system.
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #0066FF, #00CCFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Not just a download.
            </span>
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.58)",
              maxWidth: 640,
              lineHeight: 1.85,
              fontSize: "1rem",
            }}
          >
            Each Digital Forge product ships with a core guide, prompt pack,
            checklist, and bonus stack — packaged so you can implement on day
            one, not someday.
          </p>
        </div>
      </section>

      {/* ─── PRODUCT GRID ─── */}
      <section>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          {/* Bundle Includes Banner */}
          <div
            style={{
              background: "rgba(0,102,255,0.06)",
              border: "1px solid rgba(0,102,255,0.2)",
              borderRadius: "12px",
              padding: "1.25rem 1.75rem",
              marginBottom: "2.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                color: "#00CCFF",
                fontWeight: 700,
                fontSize: "0.82rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Every Bundle Includes:
            </span>
            {[
              "📘 Core Ebook",
              "🤖 Prompt Pack",
              "✅ Implementation Checklist",
              "📋 Template Assets",
              "🎁 Bonus Stack",
            ].map((item) => (
              <span
                key={item}
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                {item}
              </span>
            ))}
          </div>

          {/* Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {forgeProducts.map((product, idx) => {
              const accentColor = getCategoryColor(product.category);
              const isFeatured = product.featured || idx === 0;

              return (
                <Link
                  key={product.slug}
                  href={`/digital-forge/products/${product.slug}`}
                  id={`product-card-${product.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      position: "relative",
                      background: "rgba(5, 8, 20, 0.8)",
                      border: `1px solid ${accentColor}30`,
                      borderTop: `3px solid ${accentColor}`,
                      borderRadius: "16px",
                      padding: "1.85rem",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.22s ease, box-shadow 0.22s ease",
                      cursor: "pointer",
                    }}
                    className="glass-hover"
                  >
                    {isFeatured && (
                      <div
                        style={{
                          position: "absolute",
                          top: "1.1rem",
                          right: "1.1rem",
                          background: `${accentColor}22`,
                          border: `1px solid ${accentColor}55`,
                          borderRadius: "100px",
                          padding: "0.2rem 0.65rem",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: accentColor,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                        }}
                      >
                        Featured
                      </div>
                    )}

                    {/* Category */}
                    <p
                      style={{
                        color: accentColor,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        marginBottom: "0.9rem",
                      }}
                    >
                      {product.category}
                    </p>

                    {/* Title */}
                    <h2
                      style={{
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        lineHeight: 1.35,
                        marginBottom: "0.85rem",
                        flex: 1,
                      }}
                    >
                      {product.title}
                    </h2>

                    {/* Promise */}
                    <p
                      style={{
                        color: "rgba(255,255,255,0.58)",
                        fontSize: "0.88rem",
                        lineHeight: 1.75,
                        marginBottom: "1.4rem",
                      }}
                    >
                      {product.promise}
                    </p>

                    {/* Includes micro-list */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      {product.includes.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "6px",
                            padding: "0.25rem 0.6rem",
                            fontSize: "0.7rem",
                            color: "rgba(255,255,255,0.55)",
                            fontWeight: 500,
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* CTA Row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "auto",
                        paddingTop: "1.25rem",
                        borderTop: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <span
                        style={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                        }}
                      >
                        {product.format}
                      </span>
                      <span
                        style={{
                          color: accentColor,
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        Get Access →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM GUARANTEE STRIP ─── */}
      <section style={{ paddingTop: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              background: "rgba(0,102,255,0.05)",
              border: "1px solid rgba(0,102,255,0.2)",
              borderRadius: "20px",
              padding: "clamp(2rem, 4vw, 3.5rem)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            {[
              {
                icon: "🔐",
                title: "Instant Access",
                desc: "Get your files immediately after request — no waiting.",
              },
              {
                icon: "📦",
                title: "Full Bundle",
                desc: "Ebook + prompt pack + checklist + template in every order.",
              },
              {
                icon: "🤖",
                title: "AI-Powered Research",
                desc: "Every product is backed by live market research, not guesses.",
              },
              {
                icon: "💬",
                title: "Direct Support",
                desc: "Questions? Reach us and get a real answer from the team.",
              },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", gap: "1rem" }}>
                <div style={{ fontSize: "1.75rem", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <p
                    style={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      marginBottom: "0.35rem",
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "0.83rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
