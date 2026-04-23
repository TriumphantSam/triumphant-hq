import Link from "next/link";
import { formatOfferPrice, resolveSystemOffer } from "@/lib/digital-forge-offers";

export const metadata = {
  title: "Digital Forge Side Hustle Starter System — Build and Sell Your First AI Product | Digital Forge",
  description:
    "Get the Digital Forge Side Hustle Starter System: the complete practical toolkit with guide, prompts, templates, launch assets, and operating documents to build and sell your first AI-powered digital product.",
};

const DELIVERABLES = [
  "Core implementation guide — the complete method in one place",
  "Starter prompt pack — AI prompts tuned for product creation and packaging",
  "Offer and packaging templates — position and present your product clearly",
  "Launch checklist — know exactly what to do and in what order",
  "Sales copy framework — write copy that converts, even if you hate writing",
  "Funnel planning worksheet — map out a simple path from attention to sale",
  "Distribution plan — get your product in front of buyers quickly",
];

const OUTCOMES = [
  "One clear offer with a promise people can instantly understand",
  "One digital product bundled and packaged to sell",
  "One product page or sales path with stronger messaging",
  "One simple promotion and launch workflow you can use again",
];

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

  return (
    <div className="min-h-screen pb-24">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 20%, rgba(0,102,255,0.24), transparent 34%), radial-gradient(circle at 80% 16%, rgba(0,204,255,0.16), transparent 26%), linear-gradient(180deg, rgba(4,9,24,0.96), rgba(5,5,16,1))",
          }}
        />
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16 relative">
          <Link
            href="/digital-forge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              color: "rgba(255,255,255,0.5)",
              textDecoration: "none",
              fontSize: "0.84rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              marginBottom: "1.6rem",
            }}
          >
            ← Back to Digital Forge
          </Link>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.55rem",
              padding: "0.42rem 1rem",
              borderRadius: 999,
              border: "1px solid rgba(0,102,255,0.38)",
              background: "rgba(0,102,255,0.1)",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0066FF", display: "inline-block" }} />
            <span style={{ color: "#60A5FA", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em" }}>
              Flagship System — Most Popular
            </span>
          </div>

          <div
            className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]"
            style={{ alignItems: "start" }}
          >
            <div>
              <h1
                style={{
                  fontSize: "clamp(2.6rem, 6vw, 4.9rem)",
                  fontWeight: 900,
                  lineHeight: 1.03,
                  letterSpacing: "-0.03em",
                  color: "#fff",
                  maxWidth: 860,
                  marginBottom: "1.3rem",
                }}
              >
                The complete toolkit to build, package, and sell your first AI-powered digital product
              </h1>
              <p
                style={{
                  fontSize: "1.15rem",
                  color: "rgba(255,255,255,0.74)",
                  lineHeight: 1.9,
                  maxWidth: 740,
                  marginBottom: "1rem",
                }}
              >
                The Digital Forge Side Hustle Starter System is not just a PDF. It is the guide, the prompts, the templates, the launch assets, and the operating documents that turn scattered AI curiosity into one sellable product with a real path to income.
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.52)",
                  lineHeight: 1.85,
                  maxWidth: 740,
                  fontSize: "0.97rem",
                  marginBottom: "2.2rem",
                }}
              >
                Built for professionals, creators, and anyone who has been circling the idea of an AI-powered side hustle — and needs a system that actually moves them into action.
              </p>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                <Link
                  href="/digital-forge/checkout?offer=system"
                  id="system-buy-cta"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "1rem 2rem",
                    borderRadius: 10,
                    textDecoration: "none",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontSize: "0.86rem",
                    color: "#fff",
                    background: "linear-gradient(135deg, #0066FF, #0044CC)",
                    boxShadow: "0 0 36px rgba(0,102,255,0.42)",
                  }}
                >
                  Get the Starter System — From {systemPrice}
                </Link>
                <Link
                  href="/digital-forge/training"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "1rem 2rem",
                    borderRadius: 10,
                    textDecoration: "none",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontSize: "0.86rem",
                    color: "rgba(255,255,255,0.82)",
                    border: "1px solid rgba(255,255,255,0.16)",
                  }}
                >
                  Watch the Free Training First
                </Link>
              </div>

              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.83rem" }}>
                Secure checkout via Flutterwave. Delivery arrives automatically by email after payment is verified.
              </p>
            </div>

            {/* Outcome summary */}
            <div
              style={{
                background: "rgba(9,14,32,0.92)",
                border: "1px solid rgba(0,102,255,0.26)",
                borderRadius: 24,
                padding: "1.6rem",
                boxShadow: "0 20px 80px rgba(0,0,0,0.4)",
              }}
            >
              <p
                style={{
                  color: "#00CCFF",
                  fontSize: "0.73rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  fontWeight: 700,
                  marginBottom: "0.8rem",
                }}
              >
                What You Walk Away With
              </p>
              <div style={{ display: "grid", gap: "1rem" }}>
                {OUTCOMES.map((item) => (
                  <div key={item} style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "rgba(0,102,255,0.2)",
                        border: "1px solid rgba(0,102,255,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <span style={{ color: "#60A5FA", fontSize: "0.72rem", fontWeight: 900 }}>✓</span>
                    </span>
                    <p style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.7, fontSize: "0.94rem" }}>{item}</p>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: "1.4rem",
                  paddingTop: "1.2rem",
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.35rem" }}>
                  Price
                </p>
                <p style={{ color: "#fff", fontWeight: 800, fontSize: "1.4rem" }}>From {systemPrice}</p>
                <p style={{ color: "rgba(255,255,255,0.44)", fontSize: "0.84rem", marginTop: "0.3rem" }}>
                  The most practical first investment in your digital product business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div style={{ marginBottom: "1.8rem" }}>
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
              Who This Is For
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.1, maxWidth: 600 }}>
              Built for real people with real goals
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1rem",
            }}
          >
            {FOR_WHO.map((item) => (
              <div
                key={item.title}
                style={{
                  background: "rgba(0,102,255,0.05)",
                  border: "1px solid rgba(0,102,255,0.18)",
                  borderRadius: 20,
                  padding: "1.4rem",
                }}
              >
                <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "1rem", marginBottom: "0.7rem" }}>{item.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.8, fontSize: "0.92rem" }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET + MODULES ── */}
      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 24,
                padding: "1.8rem",
              }}
            >
              <p style={{ color: "#00CCFF", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.8rem" }}>
                Everything Included
              </p>
              <h2 style={{ color: "#fff", fontSize: "1.8rem", fontWeight: 900, lineHeight: 1.15, marginBottom: "1.2rem" }}>
                A complete business toolkit, not loose files
              </h2>
              <div style={{ display: "grid", gap: "0.9rem" }}>
                {DELIVERABLES.map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      gap: "0.9rem",
                      alignItems: "flex-start",
                      paddingBottom: "0.9rem",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span style={{ color: "#00CCFF", fontWeight: 900, flexShrink: 0 }}>→</span>
                    <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7, fontSize: "0.93rem" }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "linear-gradient(180deg, rgba(7,13,34,0.95), rgba(5,8,20,0.92))",
                border: "1px solid rgba(0,102,255,0.2)",
                borderRadius: 24,
                padding: "1.8rem",
              }}
            >
              <p style={{ color: "#00CCFF", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.8rem" }}>
                How It Works
              </p>
              <h2 style={{ color: "#fff", fontSize: "1.8rem", fontWeight: 900, lineHeight: 1.15, marginBottom: "1.2rem" }}>
                A guided build path, not a pile of random files
              </h2>
              <div style={{ display: "grid", gap: "1.2rem" }}>
                {MODULES.map((item) => (
                  <div
                    key={item.title}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "48px minmax(0, 1fr)",
                      gap: "1rem",
                      alignItems: "start",
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: "rgba(0,102,255,0.16)",
                        border: "1px solid rgba(0,102,255,0.3)",
                        color: "#60A5FA",
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.88rem",
                      }}
                    >
                      {item.num}
                    </div>
                    <div>
                      <h3 style={{ color: "#fff", fontWeight: 800, marginBottom: "0.35rem", fontSize: "1rem" }}>{item.title}</h3>
                      <p style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.8, fontSize: "0.92rem" }}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div style={{ marginBottom: "1.8rem" }}>
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
              Common Questions
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.9rem, 4vw, 2.8rem)", fontWeight: 900, lineHeight: 1.1, maxWidth: 600 }}>
              Everything you need to know before buying
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            {FAQ.map((item) => (
              <div
                key={item.q}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20,
                  padding: "1.4rem",
                }}
              >
                <h3 style={{ color: "#fff", fontWeight: 800, marginBottom: "0.7rem", fontSize: "1rem" }}>{item.q}</h3>
                <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.8, fontSize: "0.92rem" }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPGRADE PATH ── */}
      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div style={{ marginBottom: "1.8rem" }}>
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
              What Comes Next
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.9rem, 4vw, 2.7rem)", fontWeight: 900, lineHeight: 1.1, maxWidth: 640 }}>
              The Starter System is the beginning, not the ceiling
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            <div
              style={{
                borderRadius: 22,
                border: "1px solid rgba(0,204,255,0.2)",
                background: "rgba(0,204,255,0.04)",
                padding: "1.5rem",
              }}
            >
              <p style={{ color: "#00CCFF", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: "0.7rem" }}>
                Before the System
              </p>
              <h3 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.6rem" }}>Free Training</h3>
              <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: "1rem", fontSize: "0.92rem" }}>
                Watch the training first if you want to see the full framework before buying. It is 100% free and takes 25–45 minutes.
              </p>
              <Link href="/digital-forge/training" style={{ color: "#00CCFF", fontWeight: 700, fontSize: "0.84rem", textDecoration: "none" }}>
                Watch Free Training →
              </Link>
            </div>
            <div
              style={{
                borderRadius: 22,
                border: "1px solid rgba(0,102,255,0.35)",
                background: "rgba(0,102,255,0.12)",
                padding: "1.5rem",
              }}
            >
              <p style={{ color: "#60A5FA", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: "0.7rem" }}>
                You Are Here — Start Here
              </p>
              <h3 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.6rem" }}>Starter System</h3>
              <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: "1rem", fontSize: "0.92rem" }}>
                The core paid toolkit. Everything you need to build, package, and sell your first AI-powered digital product.
              </p>
              <Link href="/digital-forge/checkout?offer=system" style={{ color: "#60A5FA", fontWeight: 700, fontSize: "0.84rem", textDecoration: "none" }}>
                Get the System — From {systemPrice} →
              </Link>
            </div>
            <div
              style={{
                borderRadius: 22,
                border: "1px solid rgba(139,92,246,0.22)",
                background: "rgba(139,92,246,0.06)",
                padding: "1.5rem",
              }}
            >
              <p style={{ color: "#A78BFA", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: "0.7rem" }}>
                The Next Level
              </p>
              <h3 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.6rem" }}>Digital Forge Course</h3>
              <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: "1rem", fontSize: "0.92rem" }}>
                The full guided curriculum for a deeper, more supported build-package-launch-grow journey. Takes you further than the system alone.
              </p>
              <Link href="/digital-forge/course" style={{ color: "#A78BFA", fontWeight: 700, fontSize: "0.84rem", textDecoration: "none" }}>
                Explore the Course →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingBottom: "6rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              background: "linear-gradient(135deg, rgba(0,66,204,0.28), rgba(0,204,255,0.12))",
              border: "1px solid rgba(0,102,255,0.32)",
              borderRadius: 28,
              padding: "clamp(2rem, 5vw, 4.5rem)",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "1rem" }}>
              Stop Dabbling. Start Building.
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.08, marginBottom: "1.2rem" }}>
              This is the fastest path from
              <br />
              AI curiosity to your first sale.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.68)", maxWidth: 720, margin: "0 auto 2rem", lineHeight: 1.9, fontSize: "1.01rem" }}>
              The Starter System gives you every asset, every template, every prompt, and every workflow you need to build one clear digital product and take it to market. No more guessing. No more getting stuck. Just a complete, actionable system designed to produce results.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/digital-forge/checkout?offer=system"
                id="system-buy-cta-bottom"
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
                  boxShadow: "0 0 36px rgba(0,102,255,0.45)",
                }}
              >
                Get the Starter System — From {systemPrice}
              </Link>
              <Link
                href="/digital-forge/training"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1rem 2rem",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: "rgba(255,255,255,0.82)",
                  textDecoration: "none",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.86rem",
                }}
              >
                Watch the Free Training First
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
