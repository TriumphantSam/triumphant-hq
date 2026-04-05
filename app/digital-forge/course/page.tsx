import Link from "next/link";
import { courseOffer, digitalForgeOfferLadder } from "@/lib/digital-forge-offers";

export const metadata = {
  title: "Digital Forge Course — Guided AI Product Business Training | Triumphant HQ",
  description:
    "Explore the Digital Forge Course: a guided build-package-launch curriculum for creating a practical AI-assisted digital product business with prompts, templates, and reusable systems.",
};

export default function DigitalForgeCoursePage() {
  const systemOffer = digitalForgeOfferLadder.find((item) => item.slug === "system");
  const trainingOffer = digitalForgeOfferLadder.find((item) => item.slug === "training");

  return (
    <div className="min-h-screen pb-24">
      <section className="relative overflow-hidden pt-32 pb-20">
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 18%, rgba(124,58,237,0.18), transparent 28%), radial-gradient(circle at 82% 18%, rgba(0,102,255,0.16), transparent 22%), linear-gradient(180deg, rgba(6,10,26,0.95), rgba(5,5,16,1))",
          }}
        />
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16 relative">
          <Link
            href="/digital-forge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              color: "rgba(255,255,255,0.55)",
              textDecoration: "none",
              fontSize: "0.84rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              marginBottom: "1.4rem",
            }}
          >
            ← Back to Digital Forge
          </Link>

          <p style={{ color: "#8B5CF6", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.8rem" }}>
            {courseOffer.eyebrow}
          </p>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.8rem)",
              fontWeight: 900,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
              color: "#fff",
              maxWidth: 900,
              marginBottom: "1rem",
            }}
          >
            Build the business.
            <br />
            Teach the method.
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #8B5CF6, #00CCFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Reuse the system.
            </span>
          </h1>
          <p
            style={{
              fontSize: "1.12rem",
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.85,
              maxWidth: 780,
              marginBottom: "1.1rem",
            }}
          >
            {courseOffer.promise}
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.58)",
              lineHeight: 1.85,
              maxWidth: 780,
              fontSize: "0.98rem",
              marginBottom: "2rem",
            }}
          >
            {courseOffer.summary}
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "1rem 1.8rem",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: "0.84rem",
                color: "#fff",
                background: "linear-gradient(135deg, #7C3AED, #4C1D95)",
                boxShadow: "0 0 32px rgba(124,58,237,0.35)",
              }}
            >
              Join The Course
            </Link>
            {trainingOffer ? (
              <Link
                href={trainingOffer.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1rem 1.8rem",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.84rem",
                  color: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(255,255,255,0.16)",
                }}
              >
                Start With Free Training
              </Link>
            ) : null}
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
            {[
              { label: "Recommended Price", value: courseOffer.price },
              { label: "Best Format", value: "Recorded modules + worksheets + assets" },
              { label: "Outcome", value: "One offer, one product, one launch path" },
              { label: "Host Options", value: "Expernaire now, own platform later" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(124,58,237,0.24)",
                  borderRadius: 18,
                  padding: "1.15rem",
                }}
              >
                <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.35rem" }}>
                  {item.label}
                </p>
                <p style={{ color: "#fff", fontWeight: 700, lineHeight: 1.6 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
            <div
              style={{
                background: "linear-gradient(180deg, rgba(18,10,39,0.95), rgba(7,9,24,0.92))",
                border: "1px solid rgba(124,58,237,0.22)",
                borderRadius: 22,
                padding: "1.6rem",
              }}
            >
              <p style={{ color: "#8B5CF6", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.8rem" }}>
                Course Modules
              </p>
              <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1rem" }}>
                A full build-package-launch curriculum
              </h2>
              <div style={{ display: "grid", gap: "1rem" }}>
                {courseOffer.modules.map((item, index) => (
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
                        background: "rgba(124,58,237,0.16)",
                        border: "1px solid rgba(124,58,237,0.32)",
                        color: "#C4B5FD",
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h3 style={{ color: "#fff", fontWeight: 800, marginBottom: "0.3rem" }}>{item.title}</h3>
                      <p style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.75 }}>{item.description}</p>
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
                  padding: "1.4rem",
                }}
              >
                <p style={{ color: "#8B5CF6", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: "0.7rem" }}>
                  Student Assets
                </p>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {courseOffer.assets.map((item) => (
                    <p key={item} style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
                      • {item}
                    </p>
                  ))}
                </div>
              </div>
              <div
                style={{
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(124,58,237,0.24)",
                  borderRadius: 22,
                  padding: "1.4rem",
                }}
              >
                <p style={{ color: "#8B5CF6", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: "0.7rem" }}>
                  Student Outcome
                </p>
                <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8 }}>
                  {courseOffer.outcome}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 22,
              padding: "1.6rem",
            }}
          >
            <p style={{ color: "#8B5CF6", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.8rem" }}>
              Offer Fit
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 4vw, 2.7rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "0.9rem" }}>
              What the course is for, and what it is not
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(124,58,237,0.24)",
                  borderRadius: 18,
                  padding: "1.2rem",
                }}
              >
                <h3 style={{ color: "#fff", fontWeight: 800, marginBottom: "0.6rem" }}>Best For</h3>
                <p style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.8 }}>
                  Buyers who want guidance, depth, structure, and a more complete implementation journey than an ebook or toolkit alone can provide.
                </p>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 18,
                  padding: "1.2rem",
                }}
              >
                <h3 style={{ color: "#fff", fontWeight: 800, marginBottom: "0.6rem" }}>Not Position It As</h3>
                <p style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.8 }}>
                  Raw access to your private software stack. The course should sell guided implementation, not private backend credentials or unfinished internal tooling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div style={{ marginBottom: "1.4rem" }}>
            <p style={{ color: "#8B5CF6", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.8rem" }}>
              Where It Sits
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 4vw, 2.7rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "0.9rem" }}>
              The course sits above the starter system, not beside it
            </h2>
            <p style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.85, maxWidth: 820 }}>
              This is the recommended order: let visitors discover the blog, enter through the training, buy the starter system, then upgrade into the course for deeper implementation support.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {digitalForgeOfferLadder.map((item, index) => (
              <div
                key={item.slug}
                style={{
                  background: item.slug === "course" ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.02)",
                  border: item.slug === "course" ? "1px solid rgba(124,58,237,0.28)" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 18,
                  padding: "1rem",
                }}
              >
                <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.35rem" }}>
                  Step {index + 1}
                </p>
                <h3 style={{ color: "#fff", fontWeight: 800, marginBottom: "0.4rem" }}>{item.label}</h3>
                <p style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.7 }}>{item.outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: "6rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(0,102,255,0.12))",
              border: "1px solid rgba(124,58,237,0.28)",
              borderRadius: 24,
              padding: "clamp(2rem, 5vw, 4rem)",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#8B5CF6", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.9rem" }}>
              Delivery
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3.1rem)", fontWeight: 900, lineHeight: 1.08, marginBottom: "1rem" }}>
              Ready for Expernaire now, ready for your own platform later
            </h2>
            <p style={{ color: "rgba(255,255,255,0.68)", maxWidth: 780, margin: "0 auto 1.8rem", lineHeight: 1.85 }}>
              The course structure is already suitable for marketplace-style course hosting today. Later, the same curriculum can be expanded into your own branded course platform without changing the core offer logic.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1rem 1.8rem",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #7C3AED, #4C1D95)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.84rem",
                }}
              >
                Enroll In The Course
              </Link>
              {systemOffer ? (
                <Link
                  href={systemOffer.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "1rem 1.8rem",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.16)",
                    color: "rgba(255,255,255,0.82)",
                    textDecoration: "none",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontSize: "0.84rem",
                  }}
                >
                  See The Starter System
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
