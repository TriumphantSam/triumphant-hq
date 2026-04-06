import Link from "next/link";

export const metadata = {
  title: "Get Course Access | Digital Forge",
  description:
    "Join the Digital Forge Course waitlist for priority access when enrollment opens, or start with the Starter System and free training available now.",
};

const ACCESS_PATHS = [
  {
    title: "Join the Waitlist",
    status: "Open Now — Priority Access",
    description:
      "Be first in when enrollment and hosted course access open. Secure your place at the launch price of ₦35,000 and get notified the moment the course is ready to access.",
    href: "/digital-forge/course/waitlist",
    cta: "Join the Waitlist",
    featured: true,
  },
  {
    title: "Start with the Starter System",
    status: "Available Now",
    description:
      "The fastest practical next step. The Starter System gives you the full toolkit — guide, prompts, templates, and launch assets — so you can begin building right now while the course opens.",
    href: "/digital-forge/system",
    cta: "Get the Starter System",
    featured: false,
  },
  {
    title: "Watch the Free Training First",
    status: "Free — Available Now",
    description:
      "Not sure where to start? The free training gives you the full Digital Forge framework and helps you decide whether the Course or Starter System fits you best right now.",
    href: "/digital-forge/training",
    cta: "Watch the Free Training",
    featured: false,
  },
];

const DELIVERY_DETAILS = [
  {
    label: "Hosted Course Access",
    detail:
      "Once enrollment opens, you will get access to all 9 modules in a structured hosted learning environment. Watch at your own pace and revisit any lesson at any time.",
  },
  {
    label: "Bundle Delivery",
    detail:
      "Your workbook, prompt packs, templates, checklists, and all downloadable assets will be delivered as a clean bundle — ready to use from day one.",
  },
  {
    label: "Implementation-First Assets",
    detail:
      "Every asset is built for action, not just reading. Use the worksheets during each module to build your offer in real time as you work through the curriculum.",
  },
  {
    label: "Continuous Access",
    detail:
      "You keep access to everything — including future content updates — so your curriculum and assets stay current as the Digital Forge system grows.",
  },
];

export default function DigitalForgeCourseAccessPage() {
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
              Course Access — Waitlist Open
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
            The course is ready.
            <br />
            Enrollment opens soon.
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #0066FF, #00CCFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Join the waitlist to be first in.
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
            The Digital Forge Course curriculum — all 9 modules, your student workbook, prompt packs, templates, and every implementation asset — is built and ready. Hosted enrollment opens shortly.
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
            Join the waitlist now to get priority access at the launch price of ₦35,000. While you wait, the Starter System and free training are both available right now.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/digital-forge/course/waitlist"
              id="course-access-waitlist-cta"
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
              Join the Waitlist — ₦35,000 at Launch
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
        </div>
      </section>

      {/* ── ACCESS PATHS ── */}
      <section style={{ paddingBottom: "4.5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div style={{ marginBottom: "1.8rem" }}>
            <p style={{ color: "#00CCFF", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
              Your Options Right Now
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.9rem, 4vw, 2.7rem)", fontWeight: 900, lineHeight: 1.1, maxWidth: 640 }}>
              There is a right move for wherever you are.
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {ACCESS_PATHS.map((item) => (
              <div
                key={item.title}
                style={{
                  background: item.featured ? "rgba(0,102,255,0.1)" : "rgba(255,255,255,0.03)",
                  border: item.featured ? "1px solid rgba(0,102,255,0.32)" : "1px solid rgba(255,255,255,0.08)",
                  borderTop: item.featured ? "3px solid #0066FF" : undefined,
                  borderRadius: 22,
                  padding: "1.4rem",
                }}
              >
                <p style={{ color: item.featured ? "#00CCFF" : "rgba(255,255,255,0.45)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.4rem", fontWeight: 700 }}>
                  {item.status}
                </p>
                <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "1.15rem", marginBottom: "0.75rem" }}>{item.title}</h2>
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
                    background: item.featured
                      ? "linear-gradient(135deg, #0066FF, #0044CC)"
                      : "rgba(255,255,255,0.07)",
                    border: item.featured ? "none" : "1px solid rgba(255,255,255,0.14)",
                  }}
                >
                  {item.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU WILL GET WHEN IT OPENS ── */}
      <section style={{ paddingBottom: "6rem" }}>
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
              What You Get When Enrollment Opens
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 900, lineHeight: 1.12, marginBottom: "1.4rem" }}>
              Everything you need, delivered cleanly from day one.
            </h2>
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
              {DELIVERY_DETAILS.map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 16,
                    padding: "1.2rem",
                  }}
                >
                  <h3 style={{ color: "#fff", fontWeight: 800, marginBottom: "0.55rem", fontSize: "1rem" }}>{item.label}</h3>
                  <p style={{ color: "rgba(255,255,255,0.64)", lineHeight: 1.8, fontSize: "0.92rem" }}>{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
