import Link from "next/link";

export const metadata = {
  title: "Course Access Paths | Digital Forge",
  description:
    "Choose how you want to access the Digital Forge Course: join the priority list, start with the Starter System, or prepare for hosted course access.",
};

const ACCESS_PATHS = [
  {
    title: "Priority Access",
    status: "Open Now",
    description:
      "Join the first-access list so you can be notified as soon as course checkout and hosted delivery go live.",
    href: "/digital-forge/course/waitlist",
    cta: "Join Priority Access",
  },
  {
    title: "Starter System First",
    status: "Available Now",
    description:
      "If you want the fastest practical next step, start with the flagship system while the full guided course opens.",
    href: "/digital-forge/system",
    cta: "Start with the Starter System",
  },
  {
    title: "Free Training",
    status: "Available Now",
    description:
      "Use the free training to understand the framework first, then decide whether the Starter System or full Course fits you best.",
    href: "/digital-forge/training",
    cta: "Watch the Free Training",
  },
];

const DELIVERY_PLAN = [
  {
    label: "On Your Website",
    detail:
      "Your website owns the sales page, SEO story, brand, and access routing. This is the long-term home base of the course business.",
  },
  {
    label: "Hosted Delivery First",
    detail:
      "The first hosted student experience can live on Expernaire or Podia while the custom website student area is still being built.",
  },
  {
    label: "Storefront Checkout",
    detail:
      "Lemon Squeezy, Paystack, Flutterwave, Payhip, and Shopify can handle payment and product delivery before full native hosting is ready.",
  },
  {
    label: "Custom Student Portal Later",
    detail:
      "After launch, the next layer is a protected course area on your own hosting for modules, downloads, and future member access.",
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
              Course Access Paths
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
            The Course is real.
            <br />
            The student portal is next.
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #8B5CF6, #00CCFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Choose the best path for now.
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
            The Digital Forge Course already has the curriculum, decks, workbook, downloads, and platform packaging. What is opening in stages is the final access and hosting flow.
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
            If you want to move now, join the priority list, start with the Starter System, or use the free training while hosted course access is finalized.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: "4.5rem" }}>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
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
                  background: "rgba(124,58,237,0.07)",
                  border: "1px solid rgba(124,58,237,0.24)",
                  borderRadius: 22,
                  padding: "1.4rem",
                }}
              >
                <p style={{ color: "#8B5CF6", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.4rem", fontWeight: 700 }}>
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

      <section style={{ paddingBottom: "6rem" }}>
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
              Your Hosting Plan
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 900, lineHeight: 1.12, marginBottom: "1.4rem" }}>
              Launch fast now. Move deeper onto your own platform next.
            </h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              {DELIVERY_PLAN.map((item) => (
                <div key={item.label} style={{ display: "grid", gridTemplateColumns: "200px minmax(0, 1fr)", gap: "1rem" }}>
                  <p style={{ color: "#fff", fontWeight: 800 }}>{item.label}</p>
                  <p style={{ color: "rgba(255,255,255,0.64)", lineHeight: 1.8 }}>{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
