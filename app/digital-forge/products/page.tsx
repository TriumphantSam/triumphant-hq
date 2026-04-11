import Link from "next/link";
import { getForgeProducts } from "@/lib/digital-forge";
import ProductCatalogClient from "./ProductCatalogClient";

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
        <ProductCatalogClient products={forgeProducts} />
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
        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.28)" }}>
          By purchasing, you agree to our{" "}
          <Link href="/terms" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "underline" }}>Terms of Service</Link>
          {" "}and{" "}
          <Link href="/refund-policy" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "underline" }}>Refund Policy</Link>.
        </p>
      </section>
    </div>
  );
}
