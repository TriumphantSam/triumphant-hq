import Link from "next/link";
import { getForgeProducts } from "@/lib/digital-forge";

export const metadata = {
  title: "Digital Forge Products — AI Playbooks & Systems | Triumphant HQ",
  description:
    "Buy AI playbooks, prompt packs, workflow systems, and business toolkits from the Digital Forge store. Instant delivery. Built for serious operators.",
};

const PRICE_NGN = 5000;

const CATEGORY_COLOR: Record<string, string> = {
  "AI Systems": "#0066FF",
  "Workflow Design": "#7c3aed",
  "Digital Products": "#00CCFF",
  "Social Media Growth & Monetization": "#f59e0b",
  "agentic AI solutions": "#10b981",
  "audiobooks and audio products": "#ec4899",
  "Creator Content Systems": "#f97316",
  "AI skills courses for non-technical professionals": "#0066FF",
  "creator content systems": "#f97316",
  "Notion templates": "#7c3aed",
  "AI workflow playbooks": "#0066FF",
  "AI skills courses": "#0066FF",
  "AI productivity tools": "#10b981",
  "workflow automations": "#7c3aed",
  "AI Tools and Prompts": "#10b981",
  "AI tools and prompts": "#10b981",
  "audiobook content": "#ec4899",
};

function getColor(category: string): string {
  return CATEGORY_COLOR[category] ?? "#0066FF";
}

/** Returns first 3 meaningful words of a title for the cover tile */
function getCoverWords(title: string): string {
  return title
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(" ")
    .filter(Boolean)
    .slice(0, 3)
    .join(" ");
}

/** Large emoji icon for the cover tile */
function getCoverEmoji(category: string): string {
  const cat = category.toLowerCase();
  if (cat.includes("audio") || cat.includes("book")) return "🎧";
  if (cat.includes("notion") || cat.includes("template")) return "🗂";
  if (cat.includes("social") || cat.includes("faceless")) return "📈";
  if (cat.includes("creator") || cat.includes("content")) return "🎬";
  if (cat.includes("workflow") || cat.includes("automat")) return "⚡";
  if (cat.includes("agent") || cat.includes("agentic")) return "🔮";
  if (cat.includes("prompt") || cat.includes("tool")) return "🤖";
  return "🧠";
}

/** Short product type label for the cover tile */
function getCoverLabel(category: string): string {
  const cat = category.toLowerCase();
  if (cat.includes("audio") || cat.includes("book")) return "Audio Guide";
  if (cat.includes("notion") || cat.includes("template")) return "Template OS";
  if (cat.includes("social") || cat.includes("faceless")) return "Growth System";
  if (cat.includes("creator") || cat.includes("content")) return "Creator Toolkit";
  if (cat.includes("workflow") || cat.includes("automat")) return "Workflow OS";
  if (cat.includes("agent") || cat.includes("agentic")) return "AI Agent System";
  if (cat.includes("prompt") || cat.includes("tool")) return "AI Toolkit";
  if (cat.includes("course")) return "Skills Course";
  return "AI Playbook";
}

function formatPrice(priceNgn?: number): string {
  const price = priceNgn ?? PRICE_NGN;
  return `₦${price.toLocaleString("en-NG")}`;
}

function checkoutUrl(slug: string): string {
  return `/digital-forge/checkout?offer=${slug}`;
}


export default async function DigitalForgeProductsPage() {
  const forgeProducts = await getForgeProducts();

  return (
    <div className="min-h-screen pb-24">

      {/* ─── HEADER ─── */}
      <section
        style={{
          paddingTop: "7rem",
          paddingBottom: "2.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Breadcrumb */}
          <div style={{ marginBottom: "1.25rem" }}>
            <Link
              href="/digital-forge"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.82rem",
                fontWeight: 600,
                textDecoration: "none",
                letterSpacing: "0.04em",
              }}
            >
              ← Digital Forge
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <p
                style={{
                  color: "#00CCFF",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                Digital Forge Store
              </p>
              <h1
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                Product Library
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  marginTop: "0.6rem",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  maxWidth: 520,
                }}
              >
                AI playbooks, workflow systems, and creator tools. Every bundle ships with a guide, prompt pack, checklist, and bonus stack — ready to use on day one.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.5rem 1rem",
                background: "rgba(0,204,255,0.08)",
                border: "1px solid rgba(0,204,255,0.2)",
                borderRadius: "999px",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#00CCFF",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: "#00CCFF",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                }}
              >
                {forgeProducts.length} Products Available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT'S INCLUDED BANNER ─── */}
      <section style={{ paddingTop: "1.5rem", paddingBottom: "0.5rem" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Every bundle includes:
            </span>
            {["📘 Core Guide", "🤖 Prompt Pack", "✅ Checklist", "📋 Templates", "🎁 Bonus Stack"].map(
              (item) => (
                <span
                  key={item}
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.82rem",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "999px",
                    padding: "0.25rem 0.75rem",
                  }}
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ─── PRODUCT GRID ─── */}
      <section style={{ paddingTop: "2rem" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16">
          {forgeProducts.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: "5rem", color: "rgba(255,255,255,0.4)" }}>
              <p style={{ fontSize: "1.1rem" }}>Products are being prepared. Check back soon.</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {forgeProducts.map((product) => {
                const color = getColor(product.category);
                const coverEmoji = getCoverEmoji(product.category);
                const coverLabel = getCoverLabel(product.category);

                return (
                  <div
                    key={product.slug}
                    style={{
                      background: "rgba(8, 12, 28, 0.9)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "16px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                    }}
                    className="product-card"
                  >
                    {/* ── Dynamic CSS Cover (works for every product automatically) ── */}
                    <Link
                      href={`/digital-forge/products/${product.slug}`}
                      style={{ textDecoration: "none", display: "block", flexShrink: 0 }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "5/3",
                          overflow: "hidden",
                          background: `linear-gradient(135deg, #06091a 0%, ${color}1a 60%, ${color}33 100%)`,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          justifyContent: "flex-end",
                          padding: "1rem",
                        }}
                      >
                        {/* Glow orb */}
                        <div style={{
                          position: "absolute", top: "-20%", right: "-10%",
                          width: "70%", height: "130%",
                          background: `radial-gradient(circle, ${color}2a 0%, transparent 65%)`,
                          pointerEvents: "none",
                        }} />
                        {/* DIGITAL FORGE label top-left */}
                        <div style={{
                          position: "absolute", top: "0.65rem", left: "0.65rem",
                          fontSize: "0.52rem", fontWeight: 800,
                          color: `${color}BB`, letterSpacing: "0.22em",
                          textTransform: "uppercase",
                        }}>Digital Forge</div>
                        {/* Centre: big emoji + label */}
                        <div style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.4rem",
                          pointerEvents: "none",
                        }}>
                          <span style={{ fontSize: "2.4rem", lineHeight: 1 }}>{coverEmoji}</span>
                          <span style={{
                            color: `${color}EE`,
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            textShadow: "0 1px 8px rgba(0,0,0,0.8)",
                          }}>{coverLabel}</span>
                        </div>
                        {/* Accent line */}
                        <div style={{
                          position: "absolute", bottom: 0, left: 0, right: 0,
                          height: "3px",
                          background: `linear-gradient(90deg, ${color}, transparent)`,
                        }} />
                        {/* ── Full title reveal on hover (Netflix-style) ── */}
                        <div className="title-overlay" style={{
                          position: "absolute",
                          bottom: 0, left: 0, right: 0,
                          background: `linear-gradient(to top, rgba(4,6,18,0.97) 0%, rgba(4,6,18,0.75) 70%, transparent 100%)`,
                          padding: "1.25rem 0.9rem 0.85rem",
                          pointerEvents: "none",
                        }}>
                          <p style={{
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: "0.82rem",
                            lineHeight: 1.35,
                            letterSpacing: "-0.01em",
                            textShadow: "0 1px 6px rgba(0,0,0,0.8)",
                          }}>{product.title}</p>
                        </div>
                        {/* Featured badge */}
                        {product.featured && (
                          <div style={{
                            position: "absolute", top: "0.65rem", right: "0.65rem",
                            background: "rgba(255,204,0,0.92)", borderRadius: "6px",
                            padding: "0.2rem 0.55rem", fontSize: "0.62rem", fontWeight: 800,
                            color: "#000", letterSpacing: "0.1em", textTransform: "uppercase",
                          }}>★ Featured</div>
                        )}
                      </div>
                    </Link>

                    {/* Card body */}
                    <div
                      style={{
                        padding: "1rem 1.1rem 1.1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        flex: 1,
                      }}
                    >
                      {/* Title */}
                      <Link
                        href={`/digital-forge/products/${product.slug}`}
                        style={{ textDecoration: "none" }}
                      >
                        <h2
                          style={{
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: "0.97rem",
                            lineHeight: 1.4,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {product.title}
                        </h2>
                      </Link>

                      {/* Promise — 2 lines max */}
                      <p
                        style={{
                          color: "rgba(255,255,255,0.5)",
                          fontSize: "0.82rem",
                          lineHeight: 1.6,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          flex: 1,
                        }}
                      >
                        {product.promise}
                      </p>

                      {/* Format tag */}
                      <p
                        style={{
                          color: "rgba(255,255,255,0.28)",
                          fontSize: "0.72rem",
                          fontWeight: 500,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {product.format}
                      </p>

                      {/* CTA row — no price, full-width Get Access */}
                      <div style={{
                        marginTop: "0.25rem",
                        paddingTop: "0.75rem",
                        borderTop: "1px solid rgba(255,255,255,0.07)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}>
                        <Link
                          href={checkoutUrl(product.slug)}
                          id={`buy-${product.slug}`}
                          style={{
                            display: "block",
                            textAlign: "center",
                            padding: "0.6rem 1rem",
                            background: `linear-gradient(135deg, ${color}, ${color}bb)`,
                            color: "#fff",
                            textDecoration: "none",
                            fontWeight: 800,
                            fontSize: "0.82rem",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            borderRadius: "8px",
                            boxShadow: `0 0 16px ${color}33`,
                          }}
                        >
                          Get Access →
                        </Link>
                        <Link
                          href={`/digital-forge/products/${product.slug}`}
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontSize: "0.73rem",
                            textDecoration: "none",
                            textAlign: "center",
                          }}
                        >
                          View full details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── TRUST STRIP ─── */}
      <section style={{ paddingTop: "4rem" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
              background: "rgba(0,102,255,0.04)",
              border: "1px solid rgba(0,102,255,0.15)",
              borderRadius: "16px",
              padding: "1.5rem 2rem",
            }}
          >
            {[
              { icon: "⚡", title: "Instant Delivery", desc: "Files sent by email right after payment." },
              { icon: "🔐", title: "Secure Checkout", desc: "Powered by Flutterwave — safe and fast." },
              { icon: "📦", title: "Full Bundle", desc: "Guide + Prompts + Checklist + Bonuses." },
              { icon: "💬", title: "Direct Support", desc: "Questions? We reply — real humans." },
            ].map((item) => (
              <div
                key={item.title}
                style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}
              >
                <span style={{ fontSize: "1.35rem", flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p
                    style={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: "0.78rem",
                      lineHeight: 1.55,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            By purchasing, you agree to our{" "}
            <Link
              href="/terms"
              style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/refund-policy"
              style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}
            >
              Refund Policy
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ─── STYLES ─── */}
      <style>{`
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.4);
          border-color: rgba(255,255,255,0.16);
        }
        .title-overlay {
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.28s ease, transform 0.28s ease;
        }
        .product-card:hover .title-overlay {
          opacity: 1;
          transform: translateY(0);
        }
        @media (hover: none) {
          .title-overlay { display: none; }
        }
      `}</style>
    </div>
  );
}
