import Link from "next/link";

export const metadata = {
  title: "Free Training — Coming Soon | Digital Forge",
  description:
    "The Digital Forge free training is launching alongside the full course. Join the waitlist to be first in when it goes live.",
};

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
              "radial-gradient(circle at 15% 20%, rgba(0,204,255,0.18), transparent 32%), radial-gradient(circle at 85% 15%, rgba(0,102,255,0.14), transparent 26%), linear-gradient(180deg, rgba(6,11,29,0.97), rgba(5,5,16,1))",
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

          {/* Coming soon badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.55rem",
              padding: "0.42rem 1rem",
              borderRadius: 999,
              border: "1px solid rgba(0,204,255,0.38)",
              background: "rgba(0,204,255,0.08)",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00CCFF", display: "inline-block" }} />
            <span style={{ color: "#00CCFF", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em" }}>
              Free Training — Coming Soon
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.9rem)",
              fontWeight: 900,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
              color: "#fff",
              maxWidth: 860,
              marginBottom: "1.3rem",
            }}
          >
            How To Build and Sell Your{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #00CCFF, #0066FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              First AI Product
            </span>
            <br />
            From Nigeria
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
            This free training — the complete Digital Forge framework in one focused class — launches alongside the full Course. It is currently in production.
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.85,
              maxWidth: 760,
              fontSize: "0.97rem",
              marginBottom: "2.2rem",
            }}
          >
            Join the waitlist below and you will be the first to know the moment it goes live. Waitlist members also get early access to the Course at the founder price.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/digital-forge/course/waitlist"
              id="training-waitlist-cta"
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
              Get the Starter System Instead
            </Link>
          </div>

          <p style={{ marginTop: "1.2rem", color: "rgba(255,255,255,0.32)", fontSize: "0.83rem" }}>
            Already have what you need? The Starter System is available right now at ₦15,000.
          </p>
        </div>
      </section>

      {/* ── WHAT THE TRAINING COVERS ── */}
      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              background: "linear-gradient(180deg, rgba(7,13,34,0.95), rgba(5,8,20,0.92))",
              border: "1px solid rgba(0,204,255,0.2)",
              borderRadius: 24,
              padding: "2rem",
            }}
          >
            <p style={{ color: "#00CCFF", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.9rem" }}>
              What the Training Will Cover
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 900, lineHeight: 1.12, marginBottom: "1.4rem" }}>
              The complete Digital Forge framework — free, in one class.
            </h2>
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              {[
                { num: "01", title: "Why This Opportunity Is Still Wide Open", body: "Understand why now is the right time to build AI-powered digital products — and what most people are getting wrong." },
                { num: "02", title: "The Exact Framework", body: "Choose an audience, package an offer, use AI correctly, and launch without getting stuck. The full method in one sitting." },
                { num: "03", title: "The Mistakes That Kill Launches", body: "The 4 patterns that cause smart people to fail before they start — and how to avoid every single one." },
                { num: "04", title: "Your Clear Next Step", body: "Walk away knowing exactly what to do next: which product to build, how to start, and what path fits your situation." },
              ].map((item) => (
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
                      background: "rgba(0,204,255,0.12)",
                      border: "1px solid rgba(0,204,255,0.28)",
                      color: "#00CCFF",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.88rem",
                      flexShrink: 0,
                    }}
                  >
                    {item.num}
                  </div>
                  <div>
                    <h3 style={{ color: "#fff", fontWeight: 800, marginBottom: "0.35rem", fontSize: "1rem" }}>{item.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.8, fontSize: "0.92rem" }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHERE IT FITS ── */}
      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div style={{ marginBottom: "1.8rem" }}>
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
              Where It Fits
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.9rem, 4vw, 2.7rem)", fontWeight: 900, lineHeight: 1.1, maxWidth: 640 }}>
              The training is Step 2 — it bridges the blog and the Starter System
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            {[
              { step: "01", label: "Blog", detail: "Discover the opportunity. Find your direction.", current: false, accent: "rgba(255,255,255,0.5)" },
              { step: "02", label: "Free Training", detail: "See the framework. Build conviction. Decide your next step.", current: true, accent: "#00CCFF" },
              { step: "03", label: "Starter System", detail: "Get the complete toolkit. Build your first product.", current: false, accent: "#0066FF" },
              { step: "04", label: "Course", detail: "Follow the full guided curriculum. Own a reusable business system.", current: false, accent: "#8B5CF6" },
            ].map((item) => (
              <div
                key={item.step}
                style={{
                  background: item.current ? "rgba(0,204,255,0.08)" : "rgba(255,255,255,0.02)",
                  border: item.current ? "1px solid rgba(0,204,255,0.32)" : "1px solid rgba(255,255,255,0.07)",
                  borderTop: item.current ? "3px solid #00CCFF" : undefined,
                  borderRadius: 18,
                  padding: "1.1rem",
                }}
              >
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.35rem" }}>
                  Step {item.step}
                </p>
                <h3 style={{ color: item.current ? "#00CCFF" : "#fff", fontWeight: 800, marginBottom: "0.4rem" }}>{item.label}</h3>
                <p style={{ color: "rgba(255,255,255,0.58)", lineHeight: 1.7, fontSize: "0.88rem" }}>{item.detail}</p>
                {item.current && (
                  <span style={{ display: "inline-block", marginTop: "0.7rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#00CCFF", background: "rgba(0,204,255,0.1)", border: "1px solid rgba(0,204,255,0.25)", borderRadius: 999, padding: "0.25rem 0.7rem" }}>
                    Coming Soon
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ paddingBottom: "6rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              background: "linear-gradient(135deg, rgba(0,204,255,0.12), rgba(0,66,204,0.24))",
              border: "1px solid rgba(0,204,255,0.28)",
              borderRadius: 28,
              padding: "clamp(2rem, 5vw, 4.5rem)",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "1rem" }}>
              Do Not Wait for the Training
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.08, marginBottom: "1.2rem" }}>
              The Starter System is available right now.
              <br />
              Everything you need — no training required.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.68)", maxWidth: 720, margin: "0 auto 2rem", lineHeight: 1.9, fontSize: "1.01rem" }}>
              The Starter System already contains the guide, prompts, templates, and launch assets to take action today. The free training will give you the &ldquo;why&rdquo; — the System gives you the &ldquo;how.&rdquo;
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/digital-forge/system"
                id="training-starter-cta"
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
                Get the Starter System — From ₦15,000
              </Link>
              <Link
                href="/digital-forge/course/waitlist"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1rem 2rem",
                  borderRadius: 10,
                  border: "1px solid rgba(0,204,255,0.3)",
                  color: "#00CCFF",
                  textDecoration: "none",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.86rem",
                }}
              >
                Join the Waitlist Instead
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
