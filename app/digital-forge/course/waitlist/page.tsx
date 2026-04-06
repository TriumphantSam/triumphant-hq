import Link from "next/link";
import WaitlistForm from "./WaitlistForm";

export const metadata = {
  title: "Digital Forge Course Waitlist | Digital Forge",
  description:
    "Join the Digital Forge Course waitlist for priority access, launch price notification, and the clearest next step into the full guided curriculum.",
};

const WAITLIST_BENEFITS = [
  "Be first to know when hosted course enrollment and access go live",
  "Lock in your place at the launch price of ₦35,000 before it increases",
  "Get early visibility into what you will receive from day one",
  "Stay connected to the course so you do not miss the opening window",
  "Know whether the Starter System or full Course is the better next step for where you are now",
];

const NEXT_STEPS = [
  {
    title: "Start with the Starter System",
    description:
      "If you want to begin building immediately, the Starter System is the strongest practical next step while the full guided course enrollment opens. Full toolkit — available now.",
    href: "/digital-forge/system",
    cta: "Explore the Starter System",
  },
  {
    title: "Watch the Free Training First",
    description:
      "Still deciding? The free training will help you understand the Digital Forge framework and decide exactly where to enter the offer ladder with confidence.",
    href: "/digital-forge/training",
    cta: "Watch the Free Training",
  },
];

export default function DigitalForgeCourseWaitlistPage() {
  return (
    <div className="min-h-screen pb-24">
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
            href="/digital-forge/course"
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
            ← Back to the Course
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
              Course Waitlist — Priority Access
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.4rem, 6vw, 4.7rem)",
              fontWeight: 900,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
              color: "#fff",
              maxWidth: 920,
              marginBottom: "1.3rem",
            }}
          >
            Join early.
            <br />
            Stay close.
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #0066FF, #00CCFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Enter the full course first.
            </span>
          </h1>

          <p
            style={{
              fontSize: "1.08rem",
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.9,
              maxWidth: 760,
              marginBottom: "1rem",
            }}
          >
            The Digital Forge Course already exists as a complete 9-module curriculum with workbook, prompt packs, templates, and implementation assets. Hosted enrollment opens shortly. The waitlist is the clearest way to raise your hand before that window opens.
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
            If you know you want the guided build-package-launch-grow path, join below now. If you need to move faster in the meantime, the Starter System is available today.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="#course-waitlist-form"
              id="course-waitlist-hero-cta"
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
              Start with the Starter System
            </Link>
          </div>
        </div>
      </section>

      {/* ── WAITLIST FORM + BENEFITS ── */}
      <section style={{ paddingBottom: "4.5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            id="course-waitlist-form"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
              alignItems: "start",
            }}
          >
            <WaitlistForm />
            <div
              style={{
                background: "linear-gradient(180deg, rgba(7,13,34,0.95), rgba(5,8,20,0.92))",
                border: "1px solid rgba(0,102,255,0.2)",
                borderRadius: 24,
                padding: "1.8rem",
              }}
            >
              <p style={{ color: "#00CCFF", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.9rem" }}>
                Why Join the Waitlist
              </p>
              <h2 style={{ color: "#fff", fontSize: "clamp(1.5rem, 4vw, 2.1rem)", fontWeight: 900, lineHeight: 1.12, marginBottom: "1.4rem" }}>
                Stay connected to the strongest next step.
              </h2>
              <div style={{ display: "grid", gap: "0.85rem" }}>
                {WAITLIST_BENEFITS.map((item) => (
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
                    <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8 }}>{item}</p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: "1.6rem",
                  padding: "1rem",
                  background: "rgba(0,102,255,0.08)",
                  border: "1px solid rgba(0,102,255,0.22)",
                  borderRadius: 14,
                }}
              >
                <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "0.69rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>
                  Launch Price
                </p>
                <p style={{ color: "#00CCFF", fontWeight: 900, fontSize: "1.5rem" }}>₦35,000</p>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.86rem", marginTop: "0.2rem" }}>
                  Full curriculum + workbook + bundle delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ALTERNATIVE NEXT STEPS ── */}
      <section style={{ paddingBottom: "6rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div style={{ marginBottom: "1.4rem" }}>
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
              Move Now While You Wait
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, lineHeight: 1.1 }}>
              Two strong options open right now.
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {NEXT_STEPS.map((item) => (
              <div
                key={item.title}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 22,
                  padding: "1.4rem",
                }}
              >
                <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "1.05rem", marginBottom: "0.75rem" }}>{item.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.8, fontSize: "0.92rem", marginBottom: "1.2rem" }}>{item.description}</p>
                <Link
                  href={item.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.9rem 1.2rem",
                    borderRadius: 10,
                    textDecoration: "none",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.82)",
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                >
                  {item.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
