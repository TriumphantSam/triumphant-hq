import Link from "next/link";
import { formatOfferPrice, resolveSystemOffer, resolveUsdPriceLabel } from "@/lib/digital-forge-offers";

export const metadata = {
  title: "Digital Forge Side Hustle Starter System — Build and Sell Your First AI Product | Digital Forge",
  description:
    "Get the Digital Forge Side Hustle Starter System: the complete practical toolkit with guide, prompts, templates, launch assets, and operating documents to build and sell your first AI-powered digital product.",
};

const DELIVERABLES = [
  "01 Start Here.pdf — the first-step guide so you know exactly where to begin",
  "02 Main Guide.pdf — the complete build, package, and launch method in one place",
  "03 Prompt Pack — AI prompts tuned for offer clarity, product creation, copy, and launch support",
  "04 Launch Checklist.pdf — the practical sequence for moving from finished product to market",
  "05 Product Build Checklist.pdf — quality checks before you ask anyone to buy",
  "06 Content Planner.pdf — a simple promotion rhythm for getting the offer in front of people",
  "Editable worksheets and templates — offer selection, product packaging, messaging, and launch planning",
];

const OUTCOMES = [
  "One clear offer with a promise people can instantly understand",
  "One digital product bundled and packaged to sell",
  "One product page or sales path with stronger messaging",
  "One simple promotion and launch workflow you can use again",
];

const PROOF_ASSETS = [
  {
    title: "Built from the same workflow",
    body: "The Starter System was created with the same choose-build-package-launch method it teaches, so the product itself is proof of the operating path.",
  },
  {
    title: "Real implementation files",
    body: "You get the guide, prompt pack, worksheets, checklists, content planner, and launch templates in a clear order, not a loose folder of random downloads.",
  },
  {
    title: "No income fantasy",
    body: "The promise is practical: clarify one offer, create one useful product, package it properly, and give yourself a real route to a first sale.",
  },
];

const STARTER_STEPS = [
  "Open 01 Start Here.pdf",
  "Complete the Offer Selection Worksheet",
  "Use the Product Packaging Template to make the bundle feel sellable",
  "Run the Launch Checklist and Content Planner before publishing",
];

const whatsappHref =
  "https://wa.me/2348107711190?text=Hi%20Adeyemi%2C%20I%20am%20interested%20in%20the%20Digital%20Forge%20Starter%20System.%20I%20want%20to%20know%20if%20it%20fits%20me.";

const FOR_WHO = [
  { title: "Professionals", body: "Ready for a side hustle that actually fits your schedule constraints — no fantasy income claims, just a real operating method." },
  { title: "Creators With Expertise", body: "You know your subject but cannot figure out how to package it into something people will pay for. This fixes that." },
  { title: "AI-Curious Operators", body: "You follow the AI space closely, but have not turned that curiosity into a product that earns. This is the activation layer." },
  { title: "Stalled Founders", body: "You started once and got stuck. The Starter System gives you the structure to restart and finish without the confusion." },
];

const MODULES = [
  {
    num: "01",
    title: "Choose The Angle",
    description:
      "Pick one audience, one problem, one promise, and one realistic first offer instead of trying to build something for everyone and ending up with something for no one.",
  },
  {
    num: "02",
    title: "Build The Product",
    description:
      "Create your guide, prompt pack, checklist, template, and supporting assets so the bundle feels implementation-ready — not just a PDF people download and forget.",
  },
  {
    num: "03",
    title: "Package The Offer",
    description:
      "Strengthen your naming, messaging, headline, and promise clarity. Add the bonus logic that tips buyers from maybe to yes. Make them feel they would be leaving money on the table by not buying.",
  },
  {
    num: "04",
    title: "Launch Simply",
    description:
      "Use blog content, the free training, direct-response posts, and message-based selling to move from attention to your first sales. No paid ads required to start.",
  },
];

const FAQ = [
  {
    q: "Is this just an ebook?",
    a: "No. The Starter System is a practical toolkit: guide, prompts, templates, checklists, launch assets, and workflow documents. It is built to help you act immediately, not just feel informed.",
  },
  {
    q: "What if I have no product idea yet?",
    a: "The first section of the system is specifically about choosing a direction — one audience, one problem, one promise. You will leave that section with clarity, not confusion.",
  },
  {
    q: "Is this right for me if I already have an idea?",
    a: "Yes. If you have an idea but have not packaged, priced, or launched it yet, this system gives you everything you need to go from concept to sale.",
  },
  {
    q: "How is this different from the Course?",
    a: "The Starter System is the business toolkit — everything you need to act. The Course is the guided teaching layer that walks you through the full build-package-launch journey in more depth. Many people get the system first, then the course.",
  },
];

export default function DigitalForgeSystemPage() {
  const systemOffer = resolveSystemOffer();
  const systemPrice = formatOfferPrice(systemOffer.amount, systemOffer.currency);
  const usdPriceLabel = resolveUsdPriceLabel(systemOffer.key, systemOffer.kind);

  return (
    <div style={{ background: "#050510", minHeight: "100vh", color: "#fff", fontFamily: "sans-serif", overflow: "hidden" }}>
      
      {/* ── HERO ── */}
      <section style={{ position: "relative", paddingTop: "clamp(6rem, 15vw, 8rem)", paddingBottom: "clamp(4rem, 10vw, 6rem)" }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 15% 20%, rgba(0,102,255,0.24), transparent 32%), radial-gradient(circle at 85% 15%, rgba(0,204,255,0.16), transparent 26%), linear-gradient(180deg, rgba(6,11,29,0.97), rgba(5,5,16,1))",
          }}
        />
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16 relative">
          
          <Link
            href="/digital-forge"
            style={{
              display: "inline-block",
              color: "rgba(255,255,255,0.5)",
              textDecoration: "none",
              fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "clamp(1.5rem, 5vw, 3rem)",
            }}
          >
            ← Back to Digital Forge
          </Link>

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
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00CCFF", display: "inline-block", boxShadow: "0 0 10px rgba(0,204,255,0.8)" }} />
            <span style={{ color: "#00CCFF", fontSize: "clamp(0.75rem, 2vw, 0.85rem)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Flagship System — Most Popular
            </span>
          </div>

          <div
            className="grid gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]"
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
                  marginBottom: "1.8rem",
                }}
              >
                You have AI tools.
                <br />
                <span
                  style={{
                    background: "linear-gradient(90deg, #0066FF, #00CCFF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Now ship a product people can actually buy.
                </span>
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.78)",
                  maxWidth: 700,
                  lineHeight: 1.9,
                  fontSize: "clamp(1.05rem, 2.5vw, 1.15rem)",
                  marginBottom: "1.2rem",
                }}
              >
                Digital Forge gives you the practical system to build, package, and launch your first AI-powered digital product. No fake income claims, no prompt dump, no theory that leaves you stuck.
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.52)",
                  maxWidth: 700,
                  lineHeight: 1.85,
                  fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
                  marginBottom: "2.5rem",
                }}
              >
                Built for professionals, creators, and operators who consume AI content but still do not have one clear offer, one useful product, and one simple sales path.
              </p>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                <Link
                  href="/digital-forge/checkout?offer=system"
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
                  Get the Starter System — {usdPriceLabel}
                </Link>
                <Link
                  href={whatsappHref}
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
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  Message on WhatsApp
                </Link>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {[
                  "Secure checkout",
                  "Instant email delivery",
                  "International & local payments",
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

            {/* Outcome summary card */}
            <div
              style={{
                background: "rgba(9,14,32,0.92)",
                border: "1px solid rgba(0,102,255,0.22)",
                borderRadius: 24,
                padding: "clamp(1.2rem, 4vw, 2rem)",
                boxShadow: "0 20px 80px rgba(0,0,0,0.4)",
              }}
            >
              <p
                style={{
                  color: "#00CCFF",
                  fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00CCFF" }} />
                What You Walk Away With
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                {OUTCOMES.map((item) => (
                  <div key={item} style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "rgba(0,102,255,0.15)",
                        border: "1px solid rgba(0,102,255,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <span style={{ color: "#00CCFF", fontSize: "clamp(0.75rem, 1.5vw, 0.8rem)", fontWeight: 900 }}>✓</span>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "clamp(0.95rem, 2vw, 1.05rem)", lineHeight: 1.6, margin: 0 }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem" }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.75rem, 1.5vw, 0.8rem)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.4rem", fontWeight: 600 }}>
                  Instant Access Price
                </p>
                <p style={{ color: "#fff", fontSize: "2.2rem", fontWeight: 900, marginBottom: "0.4rem", margin: 0 }}>
                  {usdPriceLabel}
                </p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(0.85rem, 2vw, 0.95rem)", margin: 0 }}>
                  Also available locally from {systemPrice} through Flutterwave.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MID-PAGE CONVERSION STRIP ── */}
      <section style={{ padding: "1.5rem 0", background: "rgba(0,102,255,0.05)", borderTop: "1px solid rgba(0,102,255,0.1)", borderBottom: "1px solid rgba(0,102,255,0.1)" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(1rem, 3vw, 1.5rem)", color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", fontWeight: 500 }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <strong style={{ color: "#00CCFF", fontSize: "1.2rem", fontWeight: 900 }}>{usdPriceLabel}</strong> one-time payment
              </span>
              <span style={{ width: 1, height: 20, background: "rgba(255,255,255,0.2)" }} className="hidden sm:block" />
              <span>✦ Instant delivery</span>
              <span style={{ width: 1, height: 20, background: "rgba(255,255,255,0.2)" }} className="hidden sm:block" />
              <span>✦ Full toolkit included</span>
            </div>
            <Link
              href="/digital-forge/checkout?offer=system"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.75rem 1.5rem",
                background: "#0066FF",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderRadius: "8px",
              }}
            >
              Get the System →
            </Link>
          </div>
        </div>
      </section>

      {/* -- FOUNDER PROOF -- */}
      <section style={{ padding: "clamp(4rem, 10vw, 6rem) 0", position: "relative" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16">
          <div style={{ maxWidth: 800, marginBottom: "clamp(2rem, 6vw, 4rem)" }}>
            <p style={{ color: "#00CCFF", fontSize: "clamp(0.75rem, 2vw, 0.85rem)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ width: 30, height: 1, background: "rgba(0,204,255,0.5)" }} /> Founder Proof
            </p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.5rem" }}>
              Built from the same system <br className="hidden md:block"/> used to create this offer
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(1rem, 2.5vw, 1.1rem)", lineHeight: 1.8 }}>
              Before there are testimonials, there is build proof: the product shows its own method. The Starter System turns the messy middle of AI product creation into a clear sequence: choose the offer, build the asset, package the bundle, and launch with a simple sales path.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: "2rem" }}>
            {PROOF_ASSETS.map((item) => (
              <div
                key={item.title}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 24,
                  padding: "clamp(1.2rem, 4vw, 2rem)",
                }}
              >
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ width: 4, height: 20, borderRadius: 4, background: "#0066FF" }} />
                  {item.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "clamp(0.95rem, 2vw, 1.05rem)", lineHeight: 1.7, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ background: "rgba(0,102,255,0.05)", border: "1px solid rgba(0,102,255,0.15)", borderRadius: 24, padding: "1.5rem" }}>
            {STARTER_STEPS.map((item, index) => (
              <div key={item} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: 16 }}>
                <span style={{ color: "#0066FF", fontWeight: 900, fontSize: "1.2rem", opacity: 0.8 }}>{String(index + 1).padStart(2, "0")}</span>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", lineHeight: 1.5, margin: 0, fontWeight: 500 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET + MODULES ── */}
      <section style={{ padding: "clamp(4rem, 10vw, 6rem) 0", position: "relative" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            {/* Left Column: Everything Included */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 32, padding: "clamp(1.5rem, 5vw, 3rem)" }}>
              <p style={{ color: "#00CCFF", fontSize: "clamp(0.75rem, 2vw, 0.85rem)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ width: 24, height: 1, background: "rgba(0,204,255,0.5)" }} /> Everything Included
              </p>
              <h2 style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1.1, marginBottom: "2.5rem" }}>
                A complete business toolkit,<br/> not loose files
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {DELIVERABLES.map((item) => (
                  <div key={item} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <span style={{ color: "#00CCFF", fontWeight: 900, marginTop: 2 }}>→</span>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "clamp(0.95rem, 2vw, 1.05rem)", lineHeight: 1.6, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: How It Works */}
            <div style={{ background: "linear-gradient(180deg, rgba(11,16,38,1) 0%, rgba(5,8,20,1) 100%)", border: "1px solid rgba(0,102,255,0.2)", borderRadius: 32, padding: "clamp(1.5rem, 5vw, 3rem)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
              <p style={{ color: "#00CCFF", fontSize: "clamp(0.75rem, 2vw, 0.85rem)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ width: 24, height: 1, background: "rgba(0,204,255,0.5)" }} /> How It Works
              </p>
              <h2 style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1.1, marginBottom: "clamp(1.5rem, 5vw, 3rem)" }}>
                A guided build path,<br/> not a pile of random files
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "clamp(1.2rem, 4vw, 2rem)" }}>
                {MODULES.map((item) => (
                  <div key={item.title} style={{ display: "flex", gap: "clamp(1rem, 3vw, 1.5rem)", alignItems: "flex-start" }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(0,102,255,0.1)", border: "1px solid rgba(0,102,255,0.3)", color: "#00CCFF", fontWeight: 900, fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 15px rgba(0,102,255,0.15)" }}>
                      {item.num}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{item.title}</h3>
                      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(0.95rem, 2vw, 1.05rem)", lineHeight: 1.6, margin: 0 }}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section style={{ padding: "clamp(4rem, 10vw, 6rem) 0" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16">
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 4rem auto" }}>
            <p style={{ color: "#00CCFF", fontSize: "clamp(0.75rem, 2vw, 0.85rem)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
              <span style={{ width: 30, height: 1, background: "rgba(0,204,255,0.5)" }} /> Who This Is For <span style={{ width: 30, height: 1, background: "rgba(0,204,255,0.5)" }} />
            </p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.1 }}>
              Built for real people with real goals
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FOR_WHO.map((item) => (
              <div
                key={item.title}
                style={{
                  background: "linear-gradient(135deg, rgba(0,102,255,0.05), transparent)",
                  border: "1px solid rgba(0,102,255,0.1)",
                  borderRadius: 24,
                  padding: "clamp(1.5rem, 5vw, 2.5rem)",
                }}
              >
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ width: 6, height: 24, borderRadius: 4, background: "#00CCFF" }} />
                  {item.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(0.95rem, 2vw, 1.05rem)", lineHeight: 1.7, margin: "0 0 0 1.2rem" }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPGRADE PATH ── */}
      <section style={{ padding: "clamp(4rem, 10vw, 6rem) 0" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16">
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 4rem auto" }}>
            <p style={{ color: "#00CCFF", fontSize: "clamp(0.75rem, 2vw, 0.85rem)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
              <span style={{ width: 30, height: 1, background: "rgba(0,204,255,0.5)" }} /> What Comes Next <span style={{ width: 30, height: 1, background: "rgba(0,204,255,0.5)" }} />
            </p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.1 }}>
              The Starter System is the beginning, not the ceiling
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Before */}
            <div style={{ borderRadius: 24, border: "1px solid rgba(0,204,255,0.2)", background: "rgba(0,204,255,0.03)", padding: "clamp(1.5rem, 5vw, 2.5rem)", display: "flex", flexDirection: "column" }}>
              <p style={{ color: "#00CCFF", fontSize: "clamp(0.75rem, 1.5vw, 0.8rem)", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, marginBottom: "1rem" }}>Before the System</p>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1rem" }}>Free Training</h3>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.7, flexGrow: 1, marginBottom: "2rem" }}>
                Watch the training first if you want to see the full framework before buying. If you are ready to build now, the Starter System is the direct path.
              </p>
              <Link href="/digital-forge/training" style={{ color: "#00CCFF", fontWeight: 700, fontSize: "clamp(0.85rem, 2vw, 0.95rem)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                Watch Free Training →
              </Link>
            </div>
            
            {/* Current */}
            <div style={{ borderRadius: 24, border: "2px solid rgba(0,102,255,0.5)", background: "rgba(0,102,255,0.08)", padding: "clamp(1.5rem, 5vw, 2.5rem)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", boxShadow: "0 0 40px rgba(0,102,255,0.15)", transform: "translateY(-1rem)" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #0066FF, #00CCFF)" }} />
              <p style={{ color: "#0066FF", fontSize: "clamp(0.75rem, 1.5vw, 0.8rem)", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 800, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0066FF" }} /> You Are Here
              </p>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1rem" }}>Starter System</h3>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", lineHeight: 1.7, flexGrow: 1, marginBottom: "2rem" }}>
                The core paid toolkit. Everything you need to build, package, and sell your first AI-powered digital product.
              </p>
              <Link href="/digital-forge/checkout?offer=system" style={{ background: "#0066FF", color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "1rem", borderRadius: 12, textAlign: "center" }}>
                Get the System — {usdPriceLabel}
              </Link>
            </div>
            
            {/* Next */}
            <div style={{ borderRadius: 24, border: "1px solid rgba(168,85,247,0.2)", background: "rgba(168,85,247,0.03)", padding: "clamp(1.5rem, 5vw, 2.5rem)", display: "flex", flexDirection: "column" }}>
              <p style={{ color: "#A855F7", fontSize: "clamp(0.75rem, 1.5vw, 0.8rem)", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, marginBottom: "1rem" }}>The Next Level</p>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1rem" }}>Digital Forge Course</h3>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.7, flexGrow: 1, marginBottom: "2rem" }}>
                The full guided curriculum for a deeper, more supported build-package-launch-grow journey. Takes you further than the system alone.
              </p>
              <Link href="/digital-forge/course" style={{ color: "#A855F7", fontWeight: 700, fontSize: "clamp(0.85rem, 2vw, 0.95rem)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                Explore the Course →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "clamp(4rem, 10vw, 6rem) 0", background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16">
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 4rem auto" }}>
            <p style={{ color: "#00CCFF", fontSize: "clamp(0.75rem, 2vw, 0.85rem)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
              <span style={{ width: 30, height: 1, background: "rgba(0,204,255,0.5)" }} /> Common Questions <span style={{ width: 30, height: 1, background: "rgba(0,204,255,0.5)" }} />
            </p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.1 }}>
              Everything you need to know before buying
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {FAQ.map((item) => (
              <div key={item.q} style={{ background: "rgba(9,14,32,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "clamp(1.2rem, 4vw, 2rem)" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>{item.q}</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(0.95rem, 2vw, 1.05rem)", lineHeight: 1.7, margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "8rem 0", position: "relative" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <div style={{ background: "rgba(9,14,32,1)", border: "1px solid rgba(0,102,255,0.2)", borderRadius: 48, padding: "clamp(4rem, 8vw, 6rem) 2rem", textAlign: "center", boxShadow: "0 0 100px rgba(0,102,255,0.1)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              <div style={{ position: "absolute", top: "-50%", left: "-20%", width: "100%", height: "150%", background: "rgba(0,102,255,0.1)", borderRadius: "50%", filter: "blur(100px)" }} />
              <div style={{ position: "absolute", top: "20%", right: "-20%", width: "80%", height: "100%", background: "rgba(0,204,255,0.1)", borderRadius: "50%", filter: "blur(100px)" }} />
            </div>

            <div style={{ position: "relative", zIndex: 10, maxWidth: 800, margin: "0 auto" }}>
              <p style={{ color: "#00CCFF", fontSize: "clamp(0.75rem, 2vw, 0.85rem)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                <span style={{ width: 40, height: 1, background: "rgba(0,204,255,0.5)" }} />
                Stop Dabbling. Start Building.
                <span style={{ width: 40, height: 1, background: "rgba(0,204,255,0.5)" }} />
              </p>
              
              <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, lineHeight: 1.05, marginBottom: "2rem", textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                This is the fastest path from AI curiosity to <span style={{ background: "linear-gradient(90deg, #0066FF, #00CCFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>one product you can sell.</span>
              </h2>
              
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1rem", lineHeight: 1.8, marginBottom: "clamp(1.5rem, 5vw, 3rem)", maxWidth: 650, margin: "0 auto 3rem auto" }}>
                The Starter System gives you the guide, prompts, worksheets, checklists, and launch assets to build one clear digital product and take it to market. No hype, no income guarantee, just a serious system for doing the work.
              </p>
              
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Link
                  href="/digital-forge/checkout?offer=system"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "1.25rem 2.5rem",
                    background: "linear-gradient(135deg, #0066FF, #0044CC)",
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 800,
                    fontSize: "0.86rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    borderRadius: "16px",
                    boxShadow: "0 0 40px rgba(0,102,255,0.4)",
                  }}
                >
                  Get the Starter System — {usdPriceLabel}
                </Link>
                <Link
                  href={whatsappHref}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "1.25rem 2.5rem",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.05)",
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "0.86rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    borderRadius: "16px",
                  }}
                >
                  Message on WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


