import Link from "next/link";
import { getForgeProducts } from "@/lib/digital-forge";
import {
  courseOffer,
  digitalForgeCoreClarification,
  digitalForgeOfferLadder,
  flagshipSystem,
  premiumOffersNow,
  trainingOffer,
} from "@/lib/digital-forge-offers";

export const metadata = {
  title: "Digital Forge — Build, Package, and Sell AI-Powered Digital Products | Triumphant HQ",
  description:
    "Digital Forge is the practical business system for creators, professionals, and operators who want to build and sell AI-powered digital products with better structure, stronger offers, and cleaner launch execution.",
};

const TRUST_POINTS = [
  {
    title: "Built For Real Execution",
    description:
      "This is designed for people balancing Nigeria, Africa, and global realities, not fantasy business advice that ignores local constraints.",
  },
  {
    title: "A Clear Offer Ladder",
    description:
      "Visitors can start with the blog, build belief through training, buy the flagship system, and go deeper through the course and premium assets.",
  },
  {
    title: "Implementation-First Assets",
    description:
      "Prompts, templates, checklists, launch assets, and operating documents are built to help people act, not just feel informed.",
  },
  {
    title: "Private Machine, Public Method",
    description:
      "The internal production engine stays private. What buyers get is the commercial method, the toolkit, and the operating logic.",
  },
];

export default async function DigitalForgePage() {
  const forgeProducts = await getForgeProducts();
  const featured = forgeProducts.slice(0, 3);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden pt-32 pb-24">
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 18%, rgba(0,102,255,0.22), transparent 30%), radial-gradient(circle at 82% 16%, rgba(0,204,255,0.16), transparent 24%), linear-gradient(180deg, rgba(6,11,29,0.96), rgba(5,5,16,1))",
          }}
        />
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16 relative">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.55rem",
              background: "rgba(0,102,255,0.1)",
              border: "1px solid rgba(0,102,255,0.35)",
              borderRadius: "999px",
              padding: "0.42rem 1rem",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00CCFF", display: "inline-block" }} />
            <span style={{ color: "#00CCFF", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Digital Forge by Triumphant HQ
            </span>
          </div>

          <div
            className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]"
            style={{ alignItems: "start" }}
          >
            <div>
              <h1
                style={{
                  fontSize: "clamp(2.8rem, 6vw, 5.2rem)",
                  fontWeight: 900,
                  lineHeight: 1.02,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                  maxWidth: 880,
                  marginBottom: "1.2rem",
                }}
              >
                From AI curiosity
                <br />
                to a product that sells.
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.72)",
                  maxWidth: 760,
                  lineHeight: 1.85,
                  fontSize: "1.1rem",
                  marginBottom: "1.25rem",
                }}
              >
                Digital Forge teaches people how to choose, build, package, launch, and grow practical AI-powered digital products using simple systems, stronger positioning, and reusable assets.
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.58)",
                  maxWidth: 760,
                  lineHeight: 1.85,
                  fontSize: "0.98rem",
                  marginBottom: "2rem",
                }}
              >
                The public offer is the method, the toolkit, the training, and the operating documents. The private machine behind it stays private. That makes the customer promise clearer, more credible, and easier to scale.
              </p>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                <Link
                  href="/digital-forge/training"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "1rem 2rem",
                    background: "linear-gradient(135deg, #0066FF, #0044CC)",
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 800,
                    fontSize: "0.86rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    borderRadius: "10px",
                    boxShadow: "0 0 32px rgba(0,102,255,0.35)",
                  }}
                >
                  Start With The Free Training
                </Link>
                <Link
                  href="/digital-forge/system"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "1rem 2rem",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "rgba(255,255,255,0.84)",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "0.86rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    borderRadius: "10px",
                  }}
                >
                  Explore The Flagship System
                </Link>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                {[
                  "Made for practical operators",
                  "Works for Nigeria, Africa, and global markets",
                  "Built around offers, not AI hype",
                ].map((item) => (
                  <span
                    key={item}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      padding: "0.55rem 0.85rem",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "999px",
                      color: "rgba(255,255,255,0.74)",
                      fontSize: "0.82rem",
                    }}
                  >
                    <span style={{ color: "#00CCFF", fontWeight: 900 }}>•</span>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "rgba(9,14,32,0.9)",
                border: "1px solid rgba(0,102,255,0.22)",
                borderRadius: 24,
                padding: "1.5rem",
                boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
              }}
            >
              <p style={{ color: "#00CCFF", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: "0.7rem" }}>
                The Offer Ladder
              </p>
              <div style={{ display: "grid", gap: "0.9rem" }}>
                {digitalForgeOfferLadder.map((item, index) => (
                  <Link key={item.slug} href={item.href} style={{ textDecoration: "none" }}>
                    <div
                      className="glass-hover"
                      style={{
                        background: item.slug === "system" ? "rgba(0,102,255,0.08)" : "rgba(255,255,255,0.03)",
                        border: item.slug === "system" ? "1px solid rgba(0,102,255,0.28)" : "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 18,
                        padding: "1rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "0.45rem" }}>
                        <div>
                          <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.25rem" }}>
                            Step {index + 1} • {item.eyebrow}
                          </p>
                          <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "1rem", lineHeight: 1.3 }}>{item.label}</h2>
                        </div>
                        <span style={{ color: "#00CCFF", fontWeight: 800, fontSize: "0.8rem", whiteSpace: "nowrap" }}>{item.price}</span>
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontSize: "0.88rem" }}>{item.outcome}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: "4rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {TRUST_POINTS.map((item) => (
              <div
                key={item.title}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 18,
                  padding: "1.25rem",
                }}
              >
                <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "1rem", marginBottom: "0.5rem" }}>{item.title}</h2>
                <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.75, fontSize: "0.9rem" }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div style={{ marginBottom: "1.6rem" }}>
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
              The Core Offers
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "0.8rem" }}>
              The website now needs to sell the whole journey
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 820, lineHeight: 1.85 }}>
              A first-time visitor should immediately understand where to start, what they are buying, what the free training is for, and why the system and course are different.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              {
                href: "/digital-forge/training",
                eyebrow: trainingOffer.eyebrow,
                title: trainingOffer.name,
                description: trainingOffer.promise,
                accent: "#00CCFF",
              },
              {
                href: "/digital-forge/system",
                eyebrow: flagshipSystem.eyebrow,
                title: flagshipSystem.name,
                description: flagshipSystem.promise,
                accent: "#0066FF",
              },
              {
                href: "/digital-forge/course",
                eyebrow: courseOffer.eyebrow,
                title: courseOffer.name,
                description: courseOffer.promise,
                accent: "#8B5CF6",
              },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                <div
                  className="glass-hover"
                  style={{
                    height: "100%",
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${item.accent}30`,
                    borderTop: `3px solid ${item.accent}`,
                    borderRadius: 20,
                    padding: "1.5rem",
                  }}
                >
                  <p style={{ color: item.accent, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "0.7rem" }}>
                    {item.eyebrow}
                  </p>
                  <h3 style={{ color: "#fff", fontWeight: 900, fontSize: "1.2rem", lineHeight: 1.25, marginBottom: "0.7rem" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.75, marginBottom: "1rem" }}>{item.description}</p>
                  <span style={{ color: item.accent, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.8rem" }}>
                    Open Page →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div
              style={{
                background: "linear-gradient(180deg, rgba(7,13,34,0.95), rgba(5,8,20,0.92))",
                border: "1px solid rgba(0,102,255,0.2)",
                borderRadius: 24,
                padding: "1.6rem",
              }}
            >
              <p style={{ color: "#00CCFF", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
                What Customers Are Actually Buying
              </p>
              <h2 style={{ color: "#fff", fontSize: "clamp(1.9rem, 4vw, 2.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1rem" }}>
                The method, the toolkit, and the operating logic
              </h2>
              <div style={{ display: "grid", gap: "0.8rem", marginBottom: "1.2rem" }}>
                {digitalForgeCoreClarification.customersBuy.map((item) => (
                  <p key={item} style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.75 }}>
                    • {item}
                  </p>
                ))}
              </div>
              <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>
                This keeps the promise clean: Digital Forge teaches people how to build and run a practical AI-assisted digital product business using the same kind of system you use internally.
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 24,
                padding: "1.6rem",
              }}
            >
              <p style={{ color: "#F59E0B", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
                By Default, They Do Not Get
              </p>
              <h2 style={{ color: "#fff", fontSize: "1.7rem", fontWeight: 900, lineHeight: 1.15, marginBottom: "1rem" }}>
                Raw backend access
              </h2>
              <div style={{ display: "grid", gap: "0.8rem", marginBottom: "1.2rem" }}>
                {digitalForgeCoreClarification.notIncludedByDefault.map((item) => (
                  <p key={item} style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.75 }}>
                    • {item}
                  </p>
                ))}
              </div>
              <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>
                That stays private until there is a premium, heavily productized version ready for safe external use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 ? (
        <section style={{ paddingBottom: "5rem" }}>
          <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ color: "#00CCFF", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
                Product Library
              </p>
              <h2 style={{ color: "#fff", fontSize: "clamp(1.9rem, 4vw, 2.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "0.8rem" }}>
                The system produces real products, not vague ideas
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 760, lineHeight: 1.85 }}>
                The library is still part of the story. It proves the system can package expertise into products people can actually buy.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1rem",
              }}
            >
              {featured.map((product) => (
                <Link key={product.slug} href={`/digital-forge/products/${product.slug}`} style={{ textDecoration: "none" }}>
                  <div
                    className="glass-hover"
                    style={{
                      height: "100%",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 20,
                      padding: "1.4rem",
                    }}
                  >
                    <p style={{ color: "#00CCFF", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "0.6rem" }}>
                      {product.category}
                    </p>
                    <h3 style={{ color: "#fff", fontWeight: 900, fontSize: "1.12rem", lineHeight: 1.3, marginBottom: "0.7rem" }}>
                      {product.title}
                    </h3>
                    <p style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.75, marginBottom: "0.8rem" }}>
                      {product.promise}
                    </p>
                    <span style={{ color: "#0066FF", fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      View Product →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              background: "linear-gradient(180deg, rgba(6,11,29,0.95), rgba(5,8,20,0.92))",
              border: "1px solid rgba(0,102,255,0.18)",
              borderRadius: 24,
              padding: "1.7rem",
            }}
          >
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
              Premium Assets Around The Core
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.9rem, 4vw, 2.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1rem" }}>
              What you can sell now, and what comes later
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
              {premiumOffersNow.map((item) => (
                <div
                  key={item.name}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 18,
                    padding: "1rem",
                  }}
                >
                  <p style={{ color: "#00CCFF", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginBottom: "0.35rem" }}>
                    {item.readiness}
                  </p>
                  <h3 style={{ color: "#fff", fontWeight: 800, marginBottom: "0.35rem" }}>{item.name}</h3>
                  <p style={{ color: "rgba(255,255,255,0.52)", fontWeight: 700, marginBottom: "0.55rem" }}>{item.price}</p>
                  <p style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.7 }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: "6rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              background: "linear-gradient(135deg, rgba(0,66,204,0.25), rgba(124,58,237,0.14))",
              border: "1px solid rgba(0,102,255,0.28)",
              borderRadius: 24,
              padding: "clamp(2rem, 5vw, 4rem)",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.9rem" }}>
              Best Path For A New Visitor
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3.3rem)", fontWeight: 900, lineHeight: 1.08, marginBottom: "1rem" }}>
              Read. Believe. Buy. Build. Scale.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.68)", maxWidth: 780, margin: "0 auto 1.8rem", lineHeight: 1.85 }}>
              The cleanest motion is blog to training to flagship system to course. That is the story the website should tell, and every page should support that movement with useful content and sharp CTAs.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/blog"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1rem 1.8rem",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.84rem",
                }}
              >
                Read The Blog
              </Link>
              <Link
                href="/digital-forge/training"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1rem 1.8rem",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #0066FF, #0044CC)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.84rem",
                }}
              >
                Go To The Training
              </Link>
              <Link
                href="/digital-forge/system"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1rem 1.8rem",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: "rgba(255,255,255,0.84)",
                  textDecoration: "none",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.84rem",
                }}
              >
                Explore The System
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
