import Link from "next/link";
import { digitalForgeCoreClarification, digitalForgeOfferLadder, flagshipSystem, premiumOffersNow } from "@/lib/digital-forge-offers";

export const metadata = {
  title: "Digital Forge System — Build and Sell an AI Product | Triumphant HQ",
  description:
    "Explore the Digital Forge Side Hustle Starter System: the practical guide, templates, prompts, launch assets, and workflows for building and selling an AI-powered digital product.",
};

export default function DigitalForgeSystemPage() {
  const surroundingOffers = digitalForgeOfferLadder.filter((item) => item.slug !== "system");

  return (
    <div className="min-h-screen pb-24">
      <section className="relative overflow-hidden pt-32 pb-20">
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(0,102,255,0.22), transparent 34%), radial-gradient(circle at 78% 18%, rgba(0,204,255,0.16), transparent 26%), linear-gradient(180deg, rgba(4,9,24,0.92), rgba(5,5,16,1))",
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

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.55rem",
              padding: "0.4rem 0.95rem",
              borderRadius: 999,
              border: "1px solid rgba(0,204,255,0.35)",
              background: "rgba(0,204,255,0.08)",
              marginBottom: "1.5rem",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#00CCFF",
                display: "inline-block",
              }}
            />
            <span
              style={{
                color: "#00CCFF",
                fontWeight: 700,
                fontSize: "0.76rem",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
              }}
            >
              {flagshipSystem.eyebrow}
            </span>
          </div>

          <div
            className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]"
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
                  marginBottom: "1.2rem",
                }}
              >
                {flagshipSystem.name}
              </h1>
              <p
                style={{
                  fontSize: "1.15rem",
                  color: "rgba(255,255,255,0.72)",
                  lineHeight: 1.85,
                  maxWidth: 740,
                  marginBottom: "1.5rem",
                }}
              >
                {flagshipSystem.promise}
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.58)",
                  lineHeight: 1.85,
                  maxWidth: 760,
                  fontSize: "0.98rem",
                  marginBottom: "2rem",
                }}
              >
                {flagshipSystem.summary}
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
                  Get The Starter System
                </Link>
                <Link
                  href="/digital-forge/training"
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
                    color: "rgba(255,255,255,0.84)",
                    border: "1px solid rgba(255,255,255,0.16)",
                  }}
                >
                  Watch The Free Training
                </Link>
              </div>
            </div>

            <div
              style={{
                background: "rgba(9,14,32,0.9)",
                border: "1px solid rgba(0,102,255,0.25)",
                borderRadius: 24,
                padding: "1.5rem",
                boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
              }}
            >
              <p
                style={{
                  color: "#00CCFF",
                  fontSize: "0.74rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  fontWeight: 700,
                  marginBottom: "0.7rem",
                }}
              >
                Positioning Snapshot
              </p>
              <h2
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "1.3rem",
                  lineHeight: 1.2,
                  marginBottom: "0.8rem",
                }}
              >
                The core paid implementation layer
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.58)",
                  lineHeight: 1.8,
                  fontSize: "0.92rem",
                  marginBottom: "1.4rem",
                }}
              >
                Best positioned around <strong style={{ color: "#fff" }}>{flagshipSystem.price}</strong> with a strong bridge from free training and blog content into a practical, action-ready bundle.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "0.9rem",
                }}
              >
                {[
                  { label: "Format", value: "Guide + assets + launch toolkit" },
                  { label: "Buyer", value: "Operators, creators, professionals" },
                  { label: "Promise", value: "Build one sellable product system" },
                  { label: "Upgrade Path", value: "Course, SOPs, blueprint" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 14,
                      padding: "0.9rem",
                    }}
                  >
                    <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.35rem" }}>
                      {item.label}
                    </p>
                    <p style={{ color: "#fff", fontWeight: 700, lineHeight: 1.45, fontSize: "0.84rem" }}>{item.value}</p>
                  </div>
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
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1rem",
            }}
          >
            {flagshipSystem.outcomes.map((item) => (
              <div
                key={item}
                style={{
                  background: "rgba(0,102,255,0.05)",
                  border: "1px solid rgba(0,102,255,0.18)",
                  borderRadius: 18,
                  padding: "1.2rem",
                }}
              >
                <p style={{ color: "#fff", fontWeight: 700, lineHeight: 1.7 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 22,
                padding: "1.6rem",
              }}
            >
              <p style={{ color: "#00CCFF", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.7rem" }}>
                What You Get
              </p>
              <h2 style={{ color: "#fff", fontSize: "1.8rem", fontWeight: 900, lineHeight: 1.15, marginBottom: "1rem" }}>
                Assets serious buyers can actually use
              </h2>
              <div style={{ display: "grid", gap: "0.8rem" }}>
                {flagshipSystem.deliverables.map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      gap: "0.8rem",
                      alignItems: "flex-start",
                      paddingBottom: "0.8rem",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span style={{ color: "#00CCFF", fontWeight: 900 }}>•</span>
                    <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "linear-gradient(180deg, rgba(7,13,34,0.95), rgba(5,8,20,0.92))",
                border: "1px solid rgba(0,102,255,0.2)",
                borderRadius: 22,
                padding: "1.6rem",
              }}
            >
              <p style={{ color: "#00CCFF", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.7rem" }}>
                What Happens Inside
              </p>
              <h2 style={{ color: "#fff", fontSize: "1.8rem", fontWeight: 900, lineHeight: 1.15, marginBottom: "1rem" }}>
                A guided build path, not random files
              </h2>
              <div style={{ display: "grid", gap: "1rem" }}>
                {flagshipSystem.modules.map((item, index) => (
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
                        background: "rgba(0,102,255,0.16)",
                        border: "1px solid rgba(0,102,255,0.28)",
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
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.2rem",
            }}
          >
            <div
              style={{
                borderRadius: 22,
                border: "1px solid rgba(0,102,255,0.18)",
                background: "rgba(0,102,255,0.04)",
                padding: "1.5rem",
              }}
            >
              <p style={{ color: "#00CCFF", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.8rem" }}>
                Buyers Get
              </p>
              <h2 style={{ color: "#fff", fontSize: "1.35rem", fontWeight: 900, marginBottom: "1rem" }}>
                The method, assets, and operating logic
              </h2>
              <div style={{ display: "grid", gap: "0.7rem" }}>
                {digitalForgeCoreClarification.customersBuy.map((item) => (
                  <p key={item} style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                    • {item}
                  </p>
                ))}
              </div>
            </div>

            <div
              style={{
                borderRadius: 22,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
                padding: "1.5rem",
              }}
            >
              <p style={{ color: "#F59E0B", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.8rem" }}>
                Not Included By Default
              </p>
              <h2 style={{ color: "#fff", fontSize: "1.35rem", fontWeight: 900, marginBottom: "1rem" }}>
                Your private machine stays private
              </h2>
              <div style={{ display: "grid", gap: "0.7rem" }}>
                {digitalForgeCoreClarification.notIncludedByDefault.map((item) => (
                  <p key={item} style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                    • {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.7rem" }}>
              Upgrade Path
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "0.8rem" }}>
              Where this system leads next
            </h2>
            <p style={{ color: "rgba(255,255,255,0.58)", maxWidth: 760, lineHeight: 1.85 }}>
              The starter system is the commercial center of the ladder. Around it sit the free training, deeper course, and premium operator assets for people who want more implementation depth.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {surroundingOffers.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="glass-hover"
                  style={{
                    height: "100%",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 18,
                    padding: "1.4rem",
                  }}
                >
                  <p style={{ color: "#00CCFF", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "0.6rem" }}>
                    {item.eyebrow}
                  </p>
                  <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "1.08rem", marginBottom: "0.55rem" }}>{item.label}</h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontWeight: 700, marginBottom: "0.7rem" }}>{item.price}</p>
                  <p style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.75 }}>{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: "5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              background: "linear-gradient(180deg, rgba(6,11,29,0.95), rgba(5,8,20,0.92))",
              border: "1px solid rgba(0,102,255,0.2)",
              borderRadius: 24,
              padding: "1.7rem",
            }}
          >
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.8rem" }}>
              Premium Layers
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 4vw, 2.7rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1rem" }}>
              The sellable add-ons around the system
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1rem",
              }}
            >
              {premiumOffersNow.map((item) => (
                <div
                  key={item.name}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: "1rem",
                  }}
                >
                  <p style={{ color: "#00CCFF", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginBottom: "0.45rem" }}>
                    {item.readiness}
                  </p>
                  <h3 style={{ color: "#fff", fontWeight: 800, marginBottom: "0.35rem" }}>{item.name}</h3>
                  <p style={{ color: "rgba(255,255,255,0.52)", marginBottom: "0.55rem", fontWeight: 700 }}>{item.price}</p>
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
              background: "linear-gradient(135deg, rgba(0,66,204,0.26), rgba(0,204,255,0.12))",
              border: "1px solid rgba(0,102,255,0.3)",
              borderRadius: 24,
              padding: "clamp(2rem, 5vw, 4rem)",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.9rem" }}>
              Start Here
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3.3rem)", fontWeight: 900, lineHeight: 1.08, marginBottom: "1rem" }}>
              The fastest way to stop dabbling and start building
            </h2>
            <p style={{ color: "rgba(255,255,255,0.68)", maxWidth: 760, margin: "0 auto 1.8rem", lineHeight: 1.85, fontSize: "1rem" }}>
              If you want the best conversion path, send visitors to the free training first, then move them into the Digital Forge Side Hustle Starter System, then upsell the course and premium implementation layers.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
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
                Enter Through The Training
              </Link>
              <Link
                href="/contact"
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
                Buy The System
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
