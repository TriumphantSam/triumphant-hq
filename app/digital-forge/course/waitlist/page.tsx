import Link from "next/link";

export const metadata = {
  title: "Digital Forge Course Waitlist | Digital Forge",
  description:
    "Join the Digital Forge Course waitlist for early access updates, launch notifications, and the clearest next step into the full guided curriculum.",
};

const WAITLIST_BENEFITS = [
  "Be first to know when hosted course access or storefront checkout opens",
  "Get early visibility into the launch path and access options",
  "Stay connected to the Digital Forge Course without losing momentum",
  "Know whether the Starter System or full Course is the better next step for you",
];

const NEXT_STEPS = [
  {
    title: "Join the Waitlist",
    description:
      "Use the contact flow for now as the waitlist inbox, so you are tagged for first access when the course opens.",
    href: "/contact?topic=digital-forge-course&intent=waitlist",
    cta: "Join the Waitlist",
  },
  {
    title: "Start with the Starter System",
    description:
      "If you want to begin building immediately, the Starter System is the strongest practical next step while the full guided course access opens.",
    href: "/digital-forge/system",
    cta: "Explore the Starter System",
  },
  {
    title: "Use the Free Training First",
    description:
      "If you still need clarity, the free training will help you understand the framework and decide where to enter the offer ladder.",
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
              "radial-gradient(circle at 18% 18%, rgba(124,58,237,0.18), transparent 30%), radial-gradient(circle at 82% 16%, rgba(0,102,255,0.14), transparent 22%), linear-gradient(180deg, rgba(6,10,26,0.97), rgba(5,5,16,1))",
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
              border: "1px solid rgba(139,92,246,0.35)",
              background: "rgba(139,92,246,0.1)",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#8B5CF6", display: "inline-block" }} />
            <span style={{ color: "#C4B5FD", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em" }}>
              Course Waitlist
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
                background: "linear-gradient(90deg, #8B5CF6, #00CCFF)",
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
            The Digital Forge Course already exists as a full curriculum with modules, workbook, and support assets. This waitlist is the cleanest way to raise your hand before hosted access and checkout paths are fully opened.
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
            If you know you want the guided build-package-launch-growth path, join the waitlist now. If you need to move faster immediately, the Starter System is available now.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/contact?topic=digital-forge-course&intent=waitlist"
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
                background: "linear-gradient(135deg, #7C3AED, #4C1D95)",
                boxShadow: "0 0 36px rgba(124,58,237,0.42)",
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

      <section style={{ paddingBottom: "4.5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: "1.8rem",
            }}
          >
            <p style={{ color: "#8B5CF6", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.9rem" }}>
              Why Join
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 900, lineHeight: 1.12, marginBottom: "1.4rem" }}>
              Stay connected to the strongest next step.
            </h2>
            <div style={{ display: "grid", gap: "0.8rem" }}>
              {WAITLIST_BENEFITS.map((item) => (
                <div key={item} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
                  <span style={{ color: "#C4B5FD", fontWeight: 900, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>{item}</p>
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
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {NEXT_STEPS.map((item) => (
              <div
                key={item.title}
                style={{
                  background: "rgba(124,58,237,0.07)",
                  border: "1px solid rgba(124,58,237,0.24)",
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
                    color: "#fff",
                    background: "linear-gradient(135deg, #7C3AED, #4C1D95)",
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
