import Link from "next/link";
import { digitalForgeOfferLadder, trainingOffer } from "@/lib/digital-forge-offers";

export const metadata = {
  title: "Digital Forge Training — Build and Sell Your First AI Product | Triumphant HQ",
  description:
    "Join the Digital Forge training and learn how to build and sell your first AI-powered digital product from Nigeria with a practical system, better positioning, and launch clarity.",
};

export default function DigitalForgeTrainingPage() {
  const nextStep = digitalForgeOfferLadder.find((item) => item.slug === "system");

  return (
    <div className="min-h-screen pb-24">
      <section className="relative overflow-hidden pt-32 pb-20">
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 20%, rgba(0,204,255,0.2), transparent 30%), radial-gradient(circle at 82% 16%, rgba(0,102,255,0.14), transparent 22%), linear-gradient(180deg, rgba(5,10,24,0.95), rgba(5,5,16,1))",
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

          <p style={{ color: "#00CCFF", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.8rem" }}>
            {trainingOffer.eyebrow}
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
            {trainingOffer.name}
          </h1>
          <p
            style={{
              fontSize: "1.12rem",
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.85,
              maxWidth: 760,
              marginBottom: "1.25rem",
            }}
          >
            {trainingOffer.promise}
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
            {trainingOffer.whyItExists}
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
                background: "linear-gradient(135deg, #0066FF, #0044CC)",
                boxShadow: "0 0 32px rgba(0,102,255,0.35)",
              }}
            >
              Register For The Training
            </Link>
            {nextStep ? (
              <Link
                href={nextStep.href}
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
                See The Paid System
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
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              { label: "Format", value: trainingOffer.format },
              { label: "Duration", value: trainingOffer.duration },
              { label: "Positioning", value: "Free evergreen trust-builder" },
              { label: "Best CTA", value: "Starter system after training" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "rgba(0,102,255,0.05)",
                  border: "1px solid rgba(0,102,255,0.18)",
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
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)]">
            <div
              style={{
                background: "linear-gradient(180deg, rgba(7,13,34,0.95), rgba(5,8,20,0.92))",
                border: "1px solid rgba(0,102,255,0.2)",
                borderRadius: 22,
                padding: "1.6rem",
              }}
            >
              <p style={{ color: "#00CCFF", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.8rem" }}>
                What The Training Covers
              </p>
              <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1rem" }}>
                A short class that builds conviction the right way
              </h2>
              <div style={{ display: "grid", gap: "1rem" }}>
                {trainingOffer.curriculum.map((item, index) => (
                  <div
                    key={item.title}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "42px minmax(0, 1fr)",
                      gap: "1rem",
                      alignItems: "start",
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 14,
                        background: "rgba(0,204,255,0.14)",
                        border: "1px solid rgba(0,204,255,0.32)",
                        color: "#00CCFF",
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

            <div
              style={{
                display: "grid",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 22,
                  padding: "1.4rem",
                }}
              >
                <p style={{ color: "#00CCFF", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: "0.7rem" }}>
                  This Is For
                </p>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {trainingOffer.audience.map((item) => (
                    <p key={item} style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
                      • {item}
                    </p>
                  ))}
                </div>
              </div>
              <div
                style={{
                  background: "rgba(0,102,255,0.05)",
                  border: "1px solid rgba(0,102,255,0.18)",
                  borderRadius: 22,
                  padding: "1.4rem",
                }}
              >
                <p style={{ color: "#00CCFF", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: "0.7rem" }}>
                  What They Leave With
                </p>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {trainingOffer.takeaways.map((item) => (
                    <p key={item} style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
                      • {item}
                    </p>
                  ))}
                </div>
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
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.8rem" }}>
              Natural Funnel Role
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 4vw, 2.7rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "0.9rem" }}>
              Training is where visitors stop browsing and start believing
            </h2>
            <p style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.85, maxWidth: 860, marginBottom: "1.2rem" }}>
              On the website, this page should sit between blog discovery and the flagship starter system. A first-time visitor can read the blog, understand the use cases, watch the training, and then move into the paid system with stronger intent.
            </p>
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
                    background: item.slug === "training" ? "rgba(0,102,255,0.08)" : "rgba(255,255,255,0.02)",
                    border: item.slug === "training" ? "1px solid rgba(0,102,255,0.28)" : "1px solid rgba(255,255,255,0.08)",
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
        </div>
      </section>

      <section style={{ paddingBottom: "6rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              background: "linear-gradient(135deg, rgba(0,66,204,0.24), rgba(0,204,255,0.12))",
              border: "1px solid rgba(0,102,255,0.28)",
              borderRadius: 24,
              padding: "clamp(2rem, 5vw, 4rem)",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.9rem" }}>
              Next Step
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3.1rem)", fontWeight: 900, lineHeight: 1.08, marginBottom: "1rem" }}>
              Teach the framework free, sell the implementation pack next
            </h2>
            <p style={{ color: "rgba(255,255,255,0.68)", maxWidth: 760, margin: "0 auto 1.8rem", lineHeight: 1.85 }}>
              This page should make the visitor hungry for structure, not confused. The training gives them clarity, then the starter system gives them the complete toolkit, then the course gives them the deeper build-and-launch path.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/contact"
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
                Register For Training
              </Link>
              <Link
                href="/digital-forge/system"
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
