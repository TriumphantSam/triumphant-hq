import Link from "next/link";
import { getForgeProducts } from "@/lib/digital-forge";

export const metadata = {
  title: "Digital Forge — Premium AI Digital Products | Triumphant HQ",
  description:
    "Digital Forge is where AI research meets packaged revenue. Premium ebooks, prompt packs, playbooks, and implementation systems built for serious operators.",
};

const PILLARS = [
  {
    icon: "⚡",
    title: "Implementation-First",
    description:
      "Every product ships with a core guide, prompt pack, checklist, and template asset. Not theory — a working system.",
  },
  {
    icon: "🎯",
    title: "Built for Operators",
    description:
      "These aren't generic guides. Each offer is researched, packaged, and positioned for immediate execution.",
  },
  {
    icon: "🔁",
    title: "Reusable Systems",
    description:
      "Products are structured to be reused, adapted, and scaled — not read once and forgotten.",
  },
  {
    icon: "📦",
    title: "Bundle + Bonus Stack",
    description:
      "Every main product includes a curated bonus stack that multiplies the value without bloating the experience.",
  },
];

const STATS = [
  { number: "6+", label: "Products In Library" },
  { number: "4", label: "Category Niches" },
  { number: "100%", label: "AI-Powered Research" },
  { number: "0", label: "Fluff. Zero." },
];

export default async function DigitalForgePage() {
  const forgeProducts = await getForgeProducts();
  const featured = forgeProducts.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-32 pb-24">
        {/* Background glow orbs */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-10%",
            left: "25%",
            width: 700,
            height: 700,
            background:
              "radial-gradient(circle, rgba(0,102,255,0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: "0",
            right: "10%",
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle, rgba(0,204,255,0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />

        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16 relative">
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(0,102,255,0.1)",
              border: "1px solid rgba(0,102,255,0.35)",
              borderRadius: "100px",
              padding: "0.4rem 1.1rem",
              marginBottom: "2rem",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#00CCFF",
                display: "inline-block",
                boxShadow: "0 0 8px #00CCFF",
              }}
            />
            <span
              style={{
                color: "#00CCFF",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Digital Forge — Triumphant HQ
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.6rem, 6vw, 4.8rem)",
              fontWeight: 900,
              lineHeight: 1.04,
              color: "#fff",
              maxWidth: 900,
              marginBottom: "1.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            The AI Product Machine
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, #0066FF 0%, #00CCFF 50%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Packaging Expertise Into Revenue.
            </span>
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.68)",
              maxWidth: 680,
              lineHeight: 1.85,
              fontSize: "1.12rem",
              marginBottom: "2.5rem",
            }}
          >
            Digital Forge is where serious operators find implementation-ready
            AI systems, prompt packs, and business playbooks. Not hype. Not
            fluff. Products that work the moment you open them.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/digital-forge/products"
              id="df-hero-explore-products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "1rem 2.2rem",
                background: "linear-gradient(135deg, #0066FF, #0044CC)",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "0.9rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderRadius: "6px",
                boxShadow: "0 0 30px rgba(0,102,255,0.45)",
                transition: "all 0.2s ease",
              }}
            >
              Browse The Library →
            </Link>
            <Link
              href="/digital-forge/resources"
              id="df-hero-view-resources"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "1rem 2.2rem",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.8)",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderRadius: "6px",
                transition: "all 0.2s ease",
              }}
            >
              Free Resources
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <section
        style={{
          borderTop: "1px solid rgba(0,102,255,0.2)",
          borderBottom: "1px solid rgba(0,102,255,0.2)",
          background: "rgba(0,102,255,0.04)",
        }}
      >
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "0",
              padding: "2rem 0",
            }}
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  textAlign: "center",
                  padding: "1rem",
                  borderRight:
                    i < STATS.length - 1
                      ? "1px solid rgba(0,102,255,0.15)"
                      : "none",
                }}
              >
                <div
                  style={{
                    fontSize: "2.4rem",
                    fontWeight: 900,
                    color: "#00CCFF",
                    lineHeight: 1,
                    marginBottom: "0.4rem",
                  }}
                >
                  {stat.number}
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PILLARS ─── */}
      <section style={{ paddingTop: "5rem", paddingBottom: "2rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div style={{ marginBottom: "3rem" }}>
            <p
              style={{
                color: "#00CCFF",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              Why Digital Forge Works
            </p>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 900,
                color: "#fff",
                maxWidth: 620,
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
              }}
            >
              Products built to be used, not just purchased.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {PILLARS.map((p) => (
              <div
                key={p.title}
                style={{
                  background: "rgba(0,102,255,0.04)",
                  border: "1px solid rgba(0,102,255,0.18)",
                  borderRadius: "16px",
                  padding: "1.75rem",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                className="glass-hover"
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.85rem" }}>
                  {p.icon}
                </div>
                <h3
                  style={{
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "1rem",
                    marginBottom: "0.6rem",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.75,
                    fontSize: "0.92rem",
                  }}
                >
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      {featured.length > 0 && (
        <section style={{ paddingTop: "5rem", paddingBottom: "2rem" }}>
          <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "2.5rem",
              }}
            >
              <div>
                <p
                  style={{
                    color: "#00CCFF",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    marginBottom: "0.75rem",
                  }}
                >
                  In The Library
                </p>
                <h2
                  style={{
                    fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                    fontWeight: 900,
                    color: "#fff",
                    lineHeight: 1.15,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Flagship Products
                </h2>
              </div>
              <Link
                href="/digital-forge/products"
                style={{
                  color: "#0066FF",
                  fontWeight: 700,
                  textDecoration: "none",
                  fontSize: "0.88rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                View All →
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {featured.map((product, idx) => (
                <Link
                  key={product.slug}
                  href={`/digital-forge/products/${product.slug}`}
                  id={`df-featured-${product.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      position: "relative",
                      background:
                        idx === 0
                          ? "linear-gradient(145deg, rgba(0,66,204,0.25), rgba(0,20,60,0.9))"
                          : "rgba(0,102,255,0.04)",
                      border:
                        idx === 0
                          ? "1px solid rgba(0,102,255,0.5)"
                          : "1px solid rgba(0,102,255,0.18)",
                      borderRadius: "20px",
                      padding: "2rem",
                      height: "100%",
                      transition: "transform 0.2s, border-color 0.2s",
                      cursor: "pointer",
                    }}
                    className="glass-hover"
                  >
                    {idx === 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "1.25rem",
                          right: "1.25rem",
                          background: "rgba(0,204,255,0.15)",
                          border: "1px solid rgba(0,204,255,0.4)",
                          borderRadius: "100px",
                          padding: "0.25rem 0.75rem",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: "#00CCFF",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                        }}
                      >
                        Featured
                      </div>
                    )}

                    <p
                      style={{
                        color: "#00CCFF",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        marginBottom: "1rem",
                      }}
                    >
                      {product.category}
                    </p>

                    <h3
                      style={{
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "1.15rem",
                        lineHeight: 1.35,
                        marginBottom: "0.85rem",
                      }}
                    >
                      {product.title}
                    </h3>

                    <p
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "0.9rem",
                        lineHeight: 1.75,
                        marginBottom: "1.5rem",
                      }}
                    >
                      {product.promise}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <span
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: "6px",
                          padding: "0.3rem 0.7rem",
                          fontSize: "0.72rem",
                          color: "rgba(255,255,255,0.6)",
                          fontWeight: 600,
                        }}
                      >
                        {product.format}
                      </span>
                    </div>

                    <span
                      style={{
                        color: "#0066FF",
                        fontWeight: 800,
                        fontSize: "0.82rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      View Product →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(6,11,29,0.98), rgba(7,18,50,0.92))",
              border: "1px solid rgba(0,102,255,0.25)",
              borderRadius: "24px",
              padding: "clamp(2.5rem, 5vw, 4rem)",
              display: "grid",
              gap: "3rem",
              gridTemplateColumns: "1fr 1fr",
            }}
            className="lg:grid-cols-2"
          >
            <div>
              <p
                style={{
                  color: "#00CCFF",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                The Operating System
              </p>
              <h2
                style={{
                  fontSize: "clamp(1.7rem, 3vw, 2.4rem)",
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1.15,
                  marginBottom: "1.25rem",
                  letterSpacing: "-0.01em",
                }}
              >
                How Digital Forge Builds Every Product
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.8,
                  fontSize: "0.95rem",
                }}
              >
                Every Digital Forge product goes through the same research,
                packaging, positioning and distribution pipeline — ensuring each
                release is implementation-ready from day one.
              </p>
            </div>

            <ol style={{ display: "grid", gap: "1rem", paddingLeft: 0, listStyle: "none" }}>
              {[
                {
                  n: "01",
                  step: "Research",
                  desc: "Identify real market pain points using competitor analysis and live audience research.",
                },
                {
                  n: "02",
                  step: "Build",
                  desc: "Create the product, prompt pack, checklist, and companion implementation assets.",
                },
                {
                  n: "03",
                  step: "Package",
                  desc: "Generate sales copy, bonus stack, offer positioning, and launch-ready messaging.",
                },
                {
                  n: "04",
                  step: "Distribute",
                  desc: "Publish to the library and push distribution assets through the automated pipeline.",
                },
              ].map((item) => (
                <li
                  key={item.n}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <span
                    style={{
                      color: "#0066FF",
                      fontWeight: 900,
                      fontSize: "0.82rem",
                      letterSpacing: "0.08em",
                      minWidth: 28,
                      paddingTop: "0.15rem",
                    }}
                  >
                    {item.n}
                  </span>
                  <div>
                    <p
                      style={{
                        color: "#fff",
                        fontWeight: 700,
                        marginBottom: "0.25rem",
                        fontSize: "0.95rem",
                      }}
                    >
                      {item.step}
                    </p>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.55)",
                        fontSize: "0.88rem",
                        lineHeight: 1.7,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section
        style={{
          paddingBottom: "6rem",
        }}
      >
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              position: "relative",
              background:
                "linear-gradient(135deg, rgba(0,66,204,0.35), rgba(124,58,237,0.2))",
              border: "1px solid rgba(0,102,255,0.4)",
              borderRadius: "24px",
              padding: "clamp(3rem, 6vw, 5rem)",
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
                height: 300,
                background:
                  "radial-gradient(ellipse, rgba(0,102,255,0.2) 0%, transparent 70%)",
                filter: "blur(40px)",
                pointerEvents: "none",
              }}
            />

            <p
              style={{
                color: "#00CCFF",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginBottom: "1rem",
                position: "relative",
              }}
            >
              Start Now
            </p>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: "1.25rem",
                maxWidth: 700,
                margin: "0 auto 1.25rem",
                position: "relative",
                letterSpacing: "-0.01em",
              }}
            >
              Your next revenue system is one product away.
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.62)",
                fontSize: "1.05rem",
                lineHeight: 1.8,
                maxWidth: 540,
                margin: "0 auto 2.5rem",
                position: "relative",
              }}
            >
              Browse the full Digital Forge library. Every product is built to
              be opened, implemented, and repeated.
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
                href="/digital-forge/products"
                id="df-bottom-cta-products"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1.1rem 2.5rem",
                  background: "linear-gradient(135deg, #0066FF, #0044CC)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  borderRadius: "8px",
                  boxShadow: "0 0 40px rgba(0,102,255,0.5)",
                }}
              >
                Enter The Library →
              </Link>
              <Link
                href="/contact"
                id="df-bottom-cta-contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1.1rem 2.5rem",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.8)",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  borderRadius: "8px",
                }}
              >
                Talk To Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
