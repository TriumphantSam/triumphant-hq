import Link from "next/link";

export const metadata = {
  title: "Digital Forge Course — The Complete AI Product Business Curriculum | Digital Forge",
  description:
    "Join the waitlist for the Digital Forge Course: a step-by-step guided curriculum for building, packaging, launching, and growing a practical AI-assisted digital product business with prompts, templates, and reusable systems.",
};

const MODULES = [
  {
    num: "01",
    title: "The Opportunity and Positioning",
    description:
      "Understand why AI digital products are still a wide-open opportunity, and choose your specific audience, pain point, and promise so your offer stands out from the noise.",
  },
  {
    num: "02",
    title: "Offer Design",
    description:
      "Learn how to build a product that sells: the right format, the right bundle logic, and the right pricing for your market. Avoid the packaging mistakes that kill conversion before it starts.",
  },
  {
    num: "03",
    title: "Product Creation",
    description:
      "Build your guide, prompt pack, checklists, and templates using a structured creation method. No bloated PDFs. No random files. Implementation-first assets people actually use.",
  },
  {
    num: "04",
    title: "AI Workflow Use",
    description:
      "Learn how to use AI tools without sounding robotic, maintain a small clean stack, and keep your creation process simple enough to run in the background of a busy life.",
  },
  {
    num: "05",
    title: "Packaging and Messaging",
    description:
      "Strengthen your product title, headline, promise, and CTA. Master the positioning and proof framing that makes buyers feel your product was made specifically for them.",
  },
  {
    num: "06",
    title: "Funnel and Launch",
    description:
      "Set up a simple, effective path from attention to sale: lead magnets, free training, a product page, and follow-up logic that moves people from curious to converted.",
  },
  {
    num: "07",
    title: "Promotion",
    description:
      "Build a content system that creates revenue-driving momentum — not just views. Short-form strategy, direct-response messaging, and a launch rhythm that works week after week.",
  },
  {
    num: "08",
    title: "Fulfillment and Operations",
    description:
      "Set up delivery, customer experience, file management, and a repeatable workflow that makes running your digital product business feel organized — not chaotic.",
  },
  {
    num: "09",
    title: "Scaling",
    description:
      "Turn one product into a growing ecosystem. Add a second product, create upsells, build simple automation, and establish a content-to-offer flywheel that earns while you sleep.",
  },
];

const ASSETS = [
  "Recorded video modules — clear, direct, implementation-paced",
  "Comprehensive student workbook",
  "Templates, prompt packs, and planning tools",
  "SOPs and launch checklists",
  "Product naming, CTA, and content planning worksheets",
  "Bonus live Q&A layer",
];

const OUTCOMES = [
  "One clear, sellable digital product offer with a promise that converts",
  "One finished or near-finished product ready to go to market",
  "One product page or sales path with messaging that works",
  "One content and promotion plan driving consistent revenue",
  "One simple funnel path from discovery to sale",
  "One repeatable operating method you can use to build the next product",
];

const FOR_WHO = [
  { title: "Deeper Guidance Seekers", body: "You watched the training, you got the Starter System, and now you want a more structured, step-by-step path through the whole journey. The Course is that path." },
  { title: "Confident Beginners", body: "You are new to digital products but serious about building something real. You want teaching, not just tools. The Course gives you both in one guided experience." },
  { title: "Stalled Operators", body: "You started building a product once and got stuck at packaging, messaging, or launch. The Course walks you through every single step — so nothing is left to guesswork." },
  { title: "Ambitious Scalers", body: "You already sold something once, but you want a proven system to repeat and grow it. The Course takes you all the way through the scaling module with a flywheel strategy." },
];

export default function DigitalForgeCoursePage() {
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
              "radial-gradient(circle at 15% 20%, rgba(0,102,255,0.22), transparent 32%), radial-gradient(circle at 85% 15%, rgba(0,204,255,0.14), transparent 26%), linear-gradient(180deg, rgba(6,11,29,0.97), rgba(5,5,16,1))",
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
              border: "1px solid rgba(0,102,255,0.35)",
              background: "rgba(0,102,255,0.1)",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00CCFF", display: "inline-block" }} />
            <span style={{ color: "#00CCFF", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em" }}>
              Guided Course — Full Curriculum
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.9rem)",
              fontWeight: 900,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
              color: "#fff",
              maxWidth: 900,
              marginBottom: "1.3rem",
            }}
          >
            Build the business.
            <br />
            Master the method.
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #0066FF, #00CCFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Own a system you can repeat.
            </span>
          </h1>
          <p
            style={{
              fontSize: "1.12rem",
              color: "rgba(255,255,255,0.74)",
              lineHeight: 1.9,
              maxWidth: 760,
              marginBottom: "1rem",
            }}
          >
            The Digital Forge Course is the full guided curriculum for people who want more than a toolkit — they want step-by-step instruction, structured implementation support, and a complete operating method for building a sustainable AI-powered digital product business.
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.52)",
              lineHeight: 1.85,
              maxWidth: 760,
              fontSize: "0.97rem",
              marginBottom: "2.2rem",
            }}
          >
            This course sits above the Starter System. It teaches the full build-package-launch-grow path from scratch — with 9 deep modules, worksheets, prompt packs, SOPs, and a complete set of implementation assets included.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/digital-forge/course/waitlist"
              id="course-enroll-cta"
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
              Join the Waitlist
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
          <p style={{ marginTop: "1rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.28)" }}>
            By purchasing, you agree to our{" "}
            <Link href="/terms" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "underline" }}>Terms of Service</Link>
            {" "}and{" "}
            <Link href="/refund-policy" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "underline" }}>Refund Policy</Link>.
          </p>
        </div>
      </section>

      {/* ── QUICK FACTS ── */}
      <section style={{ paddingBottom: "4.5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              { label: "Price", value: "₦35,000" },
              { label: "Current Status", value: "Waitlist Open" },
              { label: "Delivery", value: "Hosted course and bundle delivery" },
              { label: "Best Next Step", value: "Join the waitlist or start with the free training" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "rgba(0,102,255,0.07)",
                  border: "1px solid rgba(0,102,255,0.24)",
                  borderRadius: 18,
                  padding: "1.2rem",
                }}
              >
                <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.4rem" }}>
                  {item.label}
                </p>
                <p style={{ color: "#fff", fontWeight: 700, lineHeight: 1.6 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW YOU ACCESS THE COURSE ── */}
      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              background: "linear-gradient(180deg, rgba(7,13,34,0.95), rgba(5,8,20,0.92))",
              border: "1px solid rgba(0,102,255,0.2)",
              borderRadius: 24,
              padding: "1.8rem",
            }}
          >
            <p style={{ color: "#00CCFF", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.9rem" }}>
              How to Get Access
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 900, lineHeight: 1.12, marginBottom: "1rem" }}>
              Join the waitlist. Be first in when the course opens.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.64)", lineHeight: 1.85, maxWidth: 840, marginBottom: "1.5rem" }}>
              The Digital Forge Course curriculum, workbook, prompt packs, and all implementation assets are ready. Enrollment and hosted access are opening shortly. Join the waitlist now to be first in — and to reserve your place at the launch price of ₦35,000.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link
                href="/digital-forge/course/waitlist"
                id="course-access-cta"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1rem 1.6rem",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.82rem",
                  color: "#fff",
                  background: "linear-gradient(135deg, #0066FF, #0044CC)",
                  boxShadow: "0 0 28px rgba(0,102,255,0.36)",
                }}
              >
                Join the Waitlist
              </Link>
              <Link
                href="/digital-forge/training"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1rem 1.6rem",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(255,255,255,0.16)",
                }}
              >
                Watch the Free Training
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODULES + ASSETS ── */}
      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
            <div
              style={{
                background: "linear-gradient(180deg, rgba(7,13,34,0.95), rgba(5,8,20,0.92))",
                border: "1px solid rgba(0,102,255,0.2)",
                borderRadius: 24,
                padding: "1.8rem",
              }}
            >
              <p style={{ color: "#00CCFF", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.9rem" }}>
                The Full Curriculum
              </p>
              <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 900, lineHeight: 1.12, marginBottom: "1.4rem" }}>
                9 modules. One complete system for your digital product business.
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
                        border: "1px solid rgba(0,102,255,0.32)",
                        color: "#00CCFF",
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

            <div style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 22,
                  padding: "1.5rem",
                }}
              >
                <p style={{ color: "#00CCFF", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: "0.8rem" }}>
                  What You Get
                </p>
                <div style={{ display: "grid", gap: "0.8rem" }}>
                  {ASSETS.map((item) => (
                    <div key={item} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
                      <span style={{ color: "#00CCFF", fontWeight: 900, flexShrink: 0 }}>→</span>
                      <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7, fontSize: "0.92rem" }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  background: "rgba(0,204,255,0.06)",
                  border: "1px solid rgba(0,204,255,0.2)",
                  borderRadius: 22,
                  padding: "1.5rem",
                }}
              >
                <p style={{ color: "#00CCFF", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: "0.8rem" }}>
                  What You Walk Away With
                </p>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {OUTCOMES.map((item) => (
                    <div key={item} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
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
                          marginTop: 1,
                        }}
                      >
                        <span style={{ color: "#00CCFF", fontSize: "0.7rem", fontWeight: 900 }}>✓</span>
                      </span>
                      <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7, fontSize: "0.92rem" }}>{item}</p>
                    </div>
                  ))}
                </div>
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
            <h2 style={{ color: "#fff", fontSize: "clamp(1.9rem, 4vw, 2.8rem)", fontWeight: 900, lineHeight: 1.1, maxWidth: 600 }}>
              The Course is for people who want to go all the way
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            {FOR_WHO.map((item) => (
              <div
                key={item.title}
                style={{
                  background: "rgba(0,102,255,0.06)",
                  border: "1px solid rgba(0,102,255,0.2)",
                  borderRadius: 20,
                  padding: "1.5rem",
                }}
              >
                <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "1rem", marginBottom: "0.7rem" }}>{item.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.8, fontSize: "0.92rem" }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHERE THE COURSE FITS ── */}
      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div style={{ marginBottom: "1.8rem" }}>
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
              The Full Journey
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.9rem, 4vw, 2.7rem)", fontWeight: 900, lineHeight: 1.1, maxWidth: 640 }}>
              The Course is the deepest layer — and the most transformative
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            {[
              { step: "01", label: "Blog", detail: "Discover the opportunity. Find your direction.", current: false, accent: "rgba(255,255,255,0.5)" },
              { step: "02", label: "Free Training", detail: "See the framework. Build conviction. Decide your next step.", current: false, accent: "#00CCFF" },
              { step: "03", label: "Starter System", detail: "Get the complete toolkit. Build your first product.", current: false, accent: "#0066FF" },
              { step: "04", label: "Course", detail: "Follow the full guided curriculum. Own a reusable business system.", current: true, accent: "#00CCFF" },
            ].map((item) => (
              <div
                key={item.step}
                style={{
                  background: item.current ? "rgba(0,102,255,0.1)" : "rgba(255,255,255,0.02)",
                  border: item.current ? "1px solid rgba(0,102,255,0.32)" : "1px solid rgba(255,255,255,0.07)",
                  borderTop: item.current ? "3px solid #0066FF" : undefined,
                  borderRadius: 18,
                  padding: "1.1rem",
                }}
              >
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.35rem" }}>
                  Step {item.step}
                </p>
                <h3 style={{ color: item.current ? "#00CCFF" : "#fff", fontWeight: 800, marginBottom: "0.4rem" }}>{item.label}</h3>
                <p style={{ color: "rgba(255,255,255,0.58)", lineHeight: 1.7, fontSize: "0.88rem" }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingBottom: "6rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              background: "linear-gradient(135deg, rgba(0,66,204,0.28), rgba(0,204,255,0.14))",
              border: "1px solid rgba(0,102,255,0.3)",
              borderRadius: 28,
              padding: "clamp(2rem, 5vw, 4.5rem)",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "1rem" }}>
              Ready to Go All the Way?
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.08, marginBottom: "1.2rem" }}>
              Enroll. Build. Launch.
              <br />
              Own a business that works.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.68)", maxWidth: 720, margin: "0 auto 2rem", lineHeight: 1.9, fontSize: "1.01rem" }}>
              The Digital Forge Course gives you 9 structured modules, every implementation asset, and a complete method for building an AI-assisted digital product business — from choosing your first offer to scaling your second and third products.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/digital-forge/course/waitlist"
                id="course-enroll-cta-bottom"
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
                Join the Waitlist
              </Link>
              <Link
                href="/digital-forge/system"
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
                Start with the Starter System
              </Link>
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.84rem", marginTop: "1.4rem" }}>
              Not ready for the course yet? Start with the free training — it is the clearest first step.
            </p>
            <p style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.28)" }}>
              By purchasing, you agree to our{" "}
              <Link href="/terms" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "underline" }}>Terms of Service</Link>
              {" "}and{" "}
              <Link href="/refund-policy" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "underline" }}>Refund Policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
