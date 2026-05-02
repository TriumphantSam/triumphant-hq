import Link from "next/link";
import CurrencyPrice from "@/components/CurrencyPrice";
import { getForgeProducts } from "@/lib/digital-forge";

export const metadata = {
  title: "Digital Forge — Build, Package, and Sell AI-Powered Digital Products | Triumphant HQ",
  description:
    "Digital Forge is the practical system for creators, professionals, and operators worldwide who want to build and sell AI-powered digital products with better structure, stronger offers, and a real path to income.",
};

const WHY_DIGITAL_FORGE = [
  {
    title: "Built for Real Operators",
    description:
      "Not theory. Not fantasy. Every resource, template, and training in Digital Forge is built for people who have real jobs, real constraints, and real goals — and need a system that works anyway.",
  },
  {
    title: "One Clear Path, Not Overwhelm",
    description:
      "Start with the free training to build confidence. Get the Starter System to take action. Level up with the Course for deeper results. Every step is designed to move you forward, not confuse you.",
  },
  {
    title: "Implementation-First Assets",
    description:
      "Prompts, templates, checklists, launch assets, and operating documents built so you can act immediately — not just feel inspired after reading.",
  },
  {
    title: "AI That Works for You, Not Against You",
    description:
      "Digital Forge shows you how to use AI as an execution accelerator, not a distraction. Simple tools, clear processes, and a method that creates real sellable products.",
  },
];

const OFFER_STEPS = [
  {
    step: "01",
    href: "/blog",
    eyebrow: "Start Here",
    title: "Read the Blog",
    description: "Practical articles on digital products, AI tools, and offer building. Find your direction before spending a single naira.",
    price: "Free",
    accent: "rgba(255,255,255,0.5)",
    accentBg: "rgba(255,255,255,0.03)",
    accentBorder: "rgba(255,255,255,0.1)",
  },
  {
    step: "02",
    href: "/digital-forge/training",
    eyebrow: "Build Belief",
    title: "Watch the Free Training",
    description: "A focused class that shows you the exact framework, the mistakes to avoid, and why this opportunity is still wide open for you.",
    price: "Free",
    accent: "#00CCFF",
    accentBg: "rgba(0,204,255,0.05)",
    accentBorder: "rgba(0,204,255,0.2)",
  },
  {
    step: "03",
    href: "/digital-forge/system",
    eyebrow: "Core Offer — Most Popular",
    title: "Get the Starter System",
    description: "The complete business toolkit: guide, prompts, templates, launch assets, and operating documents to turn your idea into an offer.",
    price: "From ₦15,000",
    priceUsd: "From $30",
    accent: "#0066FF",
    accentBg: "rgba(0,102,255,0.08)",
    accentBorder: "rgba(0,102,255,0.3)",
  },
  {
    step: "04",
    href: "/digital-forge/course",
    eyebrow: "Go Deeper",
    title: "Enroll in the Course",
    description: "The guided build-package-launch-grow curriculum for people who want step-by-step instruction and a complete implementation path.",
    price: "From ₦35,000",
    priceUsd: "From $70",
    accent: "#8B5CF6",
    accentBg: "rgba(139,92,246,0.06)",
    accentBorder: "rgba(139,92,246,0.24)",
  },
];

const WHAT_YOU_GET = [
  "A clear, proven business-building method",
  "Practical implementation systems that reduce guesswork",
  "Ready-to-use prompts, templates, and checklists",
  "Launch assets and operating documents",
  "Training that moves you from idea to income",
  "A framework built for real market conditions",
];

export default async function DigitalForgePage() {
  const forgeProducts = await getForgeProducts();
  const featured = forgeProducts.slice(0, 3);

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-28">
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 15% 20%, rgba(0,102,255,0.24), transparent 32%), radial-gradient(circle at 85% 15%, rgba(0,204,255,0.16), transparent 26%), linear-gradient(180deg, rgba(6,11,29,0.97), rgba(5,5,16,1))",
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
              marginBottom: "1.6rem",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00CCFF", display: "inline-block" }} />
            <span style={{ color: "#00CCFF", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Digital Forge by Triumphant HQ
            </span>
          </div>

          <div
            className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]"
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
                  marginBottom: "1.4rem",
                }}
              >
                Stop dabbling.
                <br />
                Start building a product
                <br />
                <span
                  style={{
                    background: "linear-gradient(90deg, #0066FF, #00CCFF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  that actually sells.
                </span>
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.78)",
                  maxWidth: 700,
                  lineHeight: 1.9,
                  fontSize: "1.12rem",
                  marginBottom: "1rem",
                }}
              >
                Digital Forge is the practical system for creators, professionals, and operators who are done consuming AI content and ready to build a real digital product business with structure, clarity, and tools that make execution simple.
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.52)",
                  maxWidth: 700,
                  lineHeight: 1.85,
                  fontSize: "0.97rem",
                  marginBottom: "2.2rem",
                }}
              >
                Whether you are starting from scratch or stuck with an idea you cannot turn into income — there is a clear entry point for you here.
              </p>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.8rem" }}>
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
                    boxShadow: "0 0 32px rgba(0,102,255,0.38)",
                  }}
                >
                  Watch the Free Training
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
                  Get the Starter System
                </Link>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {[
                  "Works for global markets",
                  "No tech background needed",
                  "Clear path from idea to income",
                ].map((item) => (
                  <span
                    key={item}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      padding: "0.5rem 0.85rem",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "999px",
                      color: "rgba(255,255,255,0.72)",
                      fontSize: "0.82rem",
                    }}
                  >
                    <span style={{ color: "#00CCFF", fontWeight: 900 }}>✓</span>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Side card — the offer ladder */}
            <div
              style={{
                background: "rgba(9,14,32,0.92)",
                border: "1px solid rgba(0,102,255,0.22)",
                borderRadius: 24,
                padding: "1.6rem",
                boxShadow: "0 20px 80px rgba(0,0,0,0.4)",
              }}
            >
              <p style={{ color: "#00CCFF", fontSize: "0.73rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "1rem" }}>
                Your Journey Starts Here
              </p>
              <div style={{ display: "grid", gap: "0.85rem" }}>
                {OFFER_STEPS.map((item) => (
                  <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                    <div
                      className="glass-hover"
                      style={{
                        background: item.accentBg,
                        border: `1px solid ${item.accentBorder}`,
                        borderRadius: 16,
                        padding: "1rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.4rem" }}>
                        <div>
                          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.2rem" }}>
                            {item.eyebrow}
                          </p>
                          <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "0.97rem", lineHeight: 1.3 }}>{item.title}</h2>
                        </div>
                        <span style={{ color: item.accent, fontWeight: 800, fontSize: "0.78rem", whiteSpace: "nowrap" }}>{item.priceUsd ? <CurrencyPrice ngnLabel={item.price} usdLabel={item.priceUsd} /> : item.price}</span>
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.58)", lineHeight: 1.65, fontSize: "0.84rem" }}>{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY DIGITAL FORGE ── */}
      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
              Why Digital Forge Works
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.1, maxWidth: 640 }}>
              The difference between staying stuck and getting your first sale
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1rem",
            }}
          >
            {WHY_DIGITAL_FORGE.map((item) => (
              <div
                key={item.title}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20,
                  padding: "1.5rem",
                }}
              >
                <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "1.05rem", marginBottom: "0.65rem" }}>{item.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: "0.92rem" }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div
              style={{
                background: "linear-gradient(180deg, rgba(7,13,34,0.95), rgba(5,8,20,0.92))",
                border: "1px solid rgba(0,102,255,0.2)",
                borderRadius: 24,
                padding: "2rem",
              }}
            >
              <p style={{ color: "#00CCFF", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.9rem" }}>
                What You Get
              </p>
              <h2 style={{ color: "#fff", fontSize: "clamp(1.9rem, 4vw, 2.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.2rem" }}>
                Everything you need to go from idea to your first digital product sale
              </h2>
              <div style={{ display: "grid", gap: "0.85rem", marginBottom: "1.5rem" }}>
                {WHAT_YOU_GET.map((item) => (
                  <div key={item} style={{ display: "flex", gap: "0.9rem", alignItems: "flex-start" }}>
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "rgba(0,204,255,0.15)",
                        border: "1px solid rgba(0,204,255,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <span style={{ color: "#00CCFF", fontSize: "0.7rem", fontWeight: 900 }}>✓</span>
                    </span>
                    <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.75 }}>{item}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/digital-forge/system"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.9rem 1.6rem",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #0066FF, #0044CC)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: "0.84rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                See the Starter System →
              </Link>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
              <div
                style={{
                  background: "rgba(0,204,255,0.06)",
                  border: "1px solid rgba(0,204,255,0.2)",
                  borderRadius: 20,
                  padding: "1.6rem",
                }}
              >
                <p style={{ color: "#00CCFF", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "0.7rem" }}>
                  Who This Is For
                </p>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {[
                    "Professionals who want a side hustle built around AI",
                    "Creators with knowledge but no packaged offer yet",
                    "Operators who understand AI matters but need a commercial path",
                    "Anyone who has tried and gotten stuck — and is ready to try smart",
                  ].map((item) => (
                    <p key={item} style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7, fontSize: "0.93rem" }}>
                      → {item}
                    </p>
                  ))}
                </div>
              </div>
              <div
                style={{
                  background: "rgba(139,92,246,0.07)",
                  border: "1px solid rgba(139,92,246,0.22)",
                  borderRadius: 20,
                  padding: "1.6rem",
                }}
              >
                <p style={{ color: "#A78BFA", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "0.7rem" }}>
                  What You Will Build
                </p>
                <div style={{ display: "grid", gap: "0.6rem" }}>
                  {[
                    "One clear digital product offer",
                    "A sales page or product page that converts",
                    "Content and promotion systems that drive revenue",
                    "A foundation you can repeat, scale, or expand",
                  ].map((item) => (
                    <p key={item} style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7, fontSize: "0.93rem" }}>
                      → {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      {featured.length > 0 ? (
        <section style={{ paddingBottom: "5rem" }}>
          <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
            <div style={{ marginBottom: "1.8rem" }}>
              <p style={{ color: "#00CCFF", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
                Digital Products
              </p>
              <h2 style={{ color: "#fff", fontSize: "clamp(1.9rem, 4vw, 2.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "0.8rem" }}>
                Real products you can buy and use today
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 700, lineHeight: 1.85 }}>
                Practical, implementation-ready resources built by Digital Forge. Each product is designed to help you move faster, get clearer, and execute with more confidence.
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
                      padding: "1.5rem",
                    }}
                  >
                    <p style={{ color: "#00CCFF", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "0.7rem" }}>
                      {product.category}
                    </p>
                    <h3 style={{ color: "#fff", fontWeight: 900, fontSize: "1.12rem", lineHeight: 1.3, marginBottom: "0.7rem" }}>
                      {product.title}
                    </h3>
                    <p style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.75, marginBottom: "1rem" }}>
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

      {/* ── OFFER BLOCKS ── */}
      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
              Everything Available
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.1, maxWidth: 600 }}>
              Pick where you are. Start from there.
            </h2>
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
                eyebrow: "Free Training",
                title: "How To Build and Sell Your First AI Product Online",
                description: "Learn the framework, see the mistakes to avoid, and walk away with a concrete next step — free, no strings.",
                accent: "#00CCFF",
                cta: "Watch the Training →",
              },
              {
                href: "/digital-forge/products",
                eyebrow: "Product Library",
                title: "Browse Ready-to-Use AI Playbooks & Systems",
                description: "Buy and implement today. Every product ships with a core guide, prompt pack, checklist, and bonus stack.",
                accent: "#f59e0b",
                cta: "Browse Products →",
              },
              {
                href: "/digital-forge/system",
                eyebrow: "Flagship System",
                title: "Digital Forge Side Hustle Starter System",
                description: "The complete implementation toolkit: guide, prompts, templates, launch assets, and the operating logic to sell your first digital product.",
                accent: "#0066FF",
                cta: "Explore the System →",
              },
              {
                href: "/digital-forge/course",
                eyebrow: "Full Course",
                title: "Digital Forge Course",
                description: "A step-by-step guided curriculum that takes you through choosing, building, packaging, launching, and growing an AI-powered digital product business.",
                accent: "#8B5CF6",
                cta: "See the Course →",
              },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                <div
                  className="glass-hover"
                  style={{
                    height: "100%",
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${item.accent}28`,
                    borderTop: `3px solid ${item.accent}`,
                    borderRadius: 20,
                    padding: "1.6rem",
                  }}
                >
                  <p style={{ color: item.accent, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "0.7rem" }}>
                    {item.eyebrow}
                  </p>
                  <h3 style={{ color: "#fff", fontWeight: 900, fontSize: "1.18rem", lineHeight: 1.25, marginBottom: "0.75rem" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.8, marginBottom: "1.2rem" }}>{item.description}</p>
                  <span style={{ color: item.accent, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.8rem" }}>
                    {item.cta}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingBottom: "6rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              background: "linear-gradient(135deg, rgba(0,66,204,0.28), rgba(124,58,237,0.16))",
              border: "1px solid rgba(0,102,255,0.3)",
              borderRadius: 28,
              padding: "clamp(2rem, 5vw, 4.5rem)",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Ready to Start?
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.08, marginBottom: "1.2rem" }}>
              The fastest path is free.
              <br />
              The training is your first move.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.68)", maxWidth: 720, margin: "0 auto 2rem", lineHeight: 1.85, fontSize: "1.02rem" }}>
              Start with the free training — no credit card, no hype, no pressure. Get the framework, see the path, and then decide what fits you best. Everything is designed to move you forward, not trap you.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/digital-forge/training"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1rem 2rem",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #0066FF, #0044CC)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.86rem",
                  boxShadow: "0 0 32px rgba(0,102,255,0.4)",
                }}
              >
                Watch the Free Training
              </Link>
              <Link
                href="/digital-forge/products"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1rem 2rem",
                  borderRadius: 10,
                  background: "rgba(245,158,11,0.15)",
                  border: "1px solid rgba(245,158,11,0.35)",
                  color: "#f59e0b",
                  textDecoration: "none",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.86rem",
                }}
              >
                Browse Products
              </Link>
              <Link
                href="/digital-forge/system"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1rem 2rem",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: "rgba(255,255,255,0.84)",
                  textDecoration: "none",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.86rem",
                }}
              >
                Get the Starter System
              </Link>
              <Link
                href="/blog"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1rem 2rem",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.86rem",
                }}
              >
                Read the Blog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
