import Link from "next/link";

export const metadata = {
  title: "Free Training — How To Build and Sell Your First AI Product From Nigeria | Digital Forge",
  description:
    "Watch the free Digital Forge training and learn how to build and sell your first AI-powered digital product from Nigeria. See the exact framework, the mistakes to avoid, and your clear next step.",
};

const CURRICULUM = [
  {
    title: "Why Most People Stay Stuck",
    description:
      "Too many tools, no clear offer, no packaging discipline, and content that never leads anywhere. You will see exactly where the gaps are — and why fixing them is simpler than you think.",
  },
  {
    title: "Why The Opportunity Is Still Wide Open",
    description:
      "Digital products still sell. AI has made building them faster and cheaper. Practical offers still beat noise when the positioning is sharp. This section shows you why it is not too late.",
  },
  {
    title: "The 3-Step Digital Forge Framework",
    description:
      "Choose one clear angle. Build one practical product. Promote it with a simple, repeatable rhythm. This is the entire framework — and it works with very few tools and very little budget.",
  },
  {
    title: "What the Full System Gives You",
    description:
      "After the training, you will know exactly what is inside the Starter System and the Course — and which one is right for where you are now. No pressure. Just clarity.",
  },
];

const TAKEAWAYS = [
  "A clear 3-step framework you can start with today",
  "A sharper picture of what to sell first — and why",
  "The most common mistakes that kill momentum before it starts",
  "Practical next steps based on where you are right now",
];

const FOR_WHO = [
  "Nigerian professionals exploring a side hustle that fits their lifestyle and local realities",
  "African creators who have expertise but have never packaged it into something that sells",
  "Global operators who want simple execution systems, not AI hype or theory",
  "Anyone who has tried building an AI product once, got stuck, and is ready to try smarter",
];

export default function DigitalForgeTrainingPage() {
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
              "radial-gradient(circle at 18% 20%, rgba(0,204,255,0.22), transparent 32%), radial-gradient(circle at 82% 16%, rgba(0,102,255,0.14), transparent 24%), linear-gradient(180deg, rgba(5,10,24,0.96), rgba(5,5,16,1))",
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
              background: "rgba(0,204,255,0.1)",
              border: "1px solid rgba(0,204,255,0.3)",
              borderRadius: "999px",
              padding: "0.4rem 1rem",
              marginBottom: "1.4rem",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00CCFF", display: "inline-block" }} />
            <span style={{ color: "#00CCFF", fontSize: "0.73rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Free Training • No Registration Required
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.8rem)",
              fontWeight: 900,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
              color: "#fff",
              maxWidth: 920,
              marginBottom: "1.2rem",
            }}
          >
            How To Build and Sell Your
            <br />
            First AI-Powered Digital Product
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #00CCFF, #0066FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              From Nigeria
            </span>
          </h1>
          <p
            style={{
              fontSize: "1.12rem",
              color: "rgba(255,255,255,0.74)",
              lineHeight: 1.9,
              maxWidth: 740,
              marginBottom: "1rem",
            }}
          >
            In this free training, you will see the exact Digital Forge framework — why most people stay stuck, why the opportunity is still real, and the simplest path from AI curiosity to a product that earns.
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
            This is a 25–45 minute class built for practical people. No hype, no fluff, no selling you something you do not need. Just the clearest breakdown of what it actually takes to build and sell a digital product with AI tools — starting from Nigeria.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/contact"
              id="training-register-cta"
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
                boxShadow: "0 0 32px rgba(0,102,255,0.38)",
              }}
            >
              Register for the Training
            </Link>
            <Link
              href="/digital-forge/system"
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
              Skip to the Starter System
            </Link>
          </div>
        </div>
      </section>

      {/* ── QUICK FACTS ── */}
      <section style={{ paddingBottom: "4.5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              { label: "Format", value: "Video class — slides, screen, and voice" },
              { label: "Length", value: "25 to 45 minutes" },
              { label: "Price", value: "Completely free" },
              { label: "After the Training", value: "Clear path into the Starter System or Course" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "rgba(0,102,255,0.05)",
                  border: "1px solid rgba(0,102,255,0.18)",
                  borderRadius: 18,
                  padding: "1.2rem",
                }}
              >
                <p style={{ color: "rgba(255,255,255,0.40)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.4rem" }}>
                  {item.label}
                </p>
                <p style={{ color: "#fff", fontWeight: 700, lineHeight: 1.6 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU WILL LEARN + FOR WHO ── */}
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
                What You Will Learn
              </p>
              <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 900, lineHeight: 1.12, marginBottom: "1.4rem" }}>
                The clearest class on building
                a digital product with AI — from Africa
              </h2>
              <div style={{ display: "grid", gap: "1.2rem" }}>
                {CURRICULUM.map((item, index) => (
                  <div
                    key={item.title}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "44px minmax(0, 1fr)",
                      gap: "1rem",
                      alignItems: "start",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        background: "rgba(0,204,255,0.12)",
                        border: "1px solid rgba(0,204,255,0.28)",
                        color: "#00CCFF",
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.9rem",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h3 style={{ color: "#fff", fontWeight: 800, marginBottom: "0.35rem", fontSize: "1rem" }}>{item.title}</h3>
                      <p style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.8, fontSize: "0.92rem" }}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 22,
                  padding: "1.5rem",
                }}
              >
                <p style={{ color: "#00CCFF", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: "0.8rem" }}>
                  Who This Is For
                </p>
                <div style={{ display: "grid", gap: "0.8rem" }}>
                  {FOR_WHO.map((item) => (
                    <p key={item} style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.75, fontSize: "0.92rem" }}>
                      → {item}
                    </p>
                  ))}
                </div>
              </div>
              <div
                style={{
                  background: "rgba(0,102,255,0.06)",
                  border: "1px solid rgba(0,102,255,0.2)",
                  borderRadius: 22,
                  padding: "1.5rem",
                }}
              >
                <p style={{ color: "#00CCFF", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: "0.8rem" }}>
                  What You Leave With
                </p>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {TAKEAWAYS.map((item) => (
                    <div key={item} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
                      <span style={{ color: "#00CCFF", fontWeight: 900, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7, fontSize: "0.92rem" }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE JOURNEY ── */}
      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 24,
              padding: "2rem",
            }}
          >
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.9rem" }}>
              Your Full Journey
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1rem", maxWidth: 700 }}>
              The training is where browsing ends and belief begins
            </h2>
            <p style={{ color: "rgba(255,255,255,0.58)", lineHeight: 1.85, maxWidth: 820, marginBottom: "1.6rem" }}>
              Most people find Digital Forge through the blog or a recommendation. They land on the training to understand if this is real. They leave convinced — and ready to buy the Starter System or enroll in the Course. That is the journey, and the training is the most important step in it.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              {[
                { step: "01", label: "Blog", detail: "Discover the opportunity through real use cases and practical articles", current: false },
                { step: "02", label: "Free Training", detail: "Watch the framework, get clarity, decide what fits you", current: true },
                { step: "03", label: "Starter System", detail: "Buy the complete toolkit and start building your first product", current: false },
                { step: "04", label: "Course", detail: "Deepen your implementation with a full guided curriculum", current: false },
              ].map((item) => (
                <div
                  key={item.step}
                  style={{
                    background: item.current ? "rgba(0,102,255,0.1)" : "rgba(255,255,255,0.02)",
                    border: item.current ? "1px solid rgba(0,102,255,0.32)" : "1px solid rgba(255,255,255,0.07)",
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
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingBottom: "6rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              background: "linear-gradient(135deg, rgba(0,66,204,0.26), rgba(0,204,255,0.12))",
              border: "1px solid rgba(0,102,255,0.3)",
              borderRadius: 28,
              padding: "clamp(2rem, 5vw, 4.5rem)",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "1rem" }}>
              It Is Free. Start Now.
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3.3rem)", fontWeight: 900, lineHeight: 1.08, marginBottom: "1.2rem" }}>
              Watch the training.
              <br />
              Walk away with a plan.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.68)", maxWidth: 700, margin: "0 auto 2rem", lineHeight: 1.9, fontSize: "1.01rem" }}>
              The training gives you clarity. The Starter System gives you the toolkit. The Course gives you the full guided path. You can start with any of them — but the training is the smartest first move if you are not yet sure where to begin.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/contact"
                id="training-register-cta-bottom"
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
                Register for the Training
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
                See the Starter System
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
