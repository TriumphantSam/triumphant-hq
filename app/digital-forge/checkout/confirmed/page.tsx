import Link from "next/link";
import Script from "next/script";

type ConfirmedPageProps = {
  searchParams: Promise<{
    status?: string;
    tx_ref?: string;
  }>;
};

export const metadata = {
  title: "Payment Received | Digital Forge",
  description: "Your Digital Forge payment is being verified for delivery.",
};

const START_STEPS = [
  { num: "01", text: 'Open "01 Start Here.pdf" — your first-step orientation guide.' },
  { num: "02", text: "Complete the Offer Selection Worksheet to lock in your product idea." },
  { num: "03", text: "Use the Product Packaging Template to shape a bundle people want to buy." },
  { num: "04", text: "Run the Launch Checklist and Content Planner before publishing." },
];

export default async function DigitalForgeCheckoutConfirmedPage({ searchParams }: ConfirmedPageProps) {
  const params = await searchParams;
  const status = (params.status ?? "").toLowerCase();
  const isSuccess = !status || status === "successful" || status === "completed";

  return (
    <div style={{ background: "#050510", minHeight: "100vh", color: "#fff", fontFamily: "sans-serif", overflow: "hidden" }}>
      {isSuccess && (
        <Script id="meta-pixel-purchase">
          {`if (typeof fbq !== 'undefined') fbq('track', 'Purchase');`}
        </Script>
      )}
      <section style={{ position: "relative", paddingTop: "clamp(6rem, 15vw, 8rem)", paddingBottom: "clamp(4rem, 10vw, 6rem)" }}>
        {/* Dynamic Background */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              isSuccess 
                ? "radial-gradient(circle at 15% 20%, rgba(16,185,129,0.24), transparent 32%), radial-gradient(circle at 85% 15%, rgba(0,204,255,0.16), transparent 26%), linear-gradient(180deg, rgba(6,11,29,0.97), rgba(5,5,16,1))"
                : "radial-gradient(circle at 15% 20%, rgba(245,158,11,0.24), transparent 32%), radial-gradient(circle at 85% 15%, rgba(249,115,22,0.16), transparent 26%), linear-gradient(180deg, rgba(6,11,29,0.97), rgba(5,5,16,1))",
          }}
        />

        <div className="max-w-screen-md mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <div className="relative group">
            <div 
              style={{
                position: "absolute",
                inset: "-0.25rem",
                background: isSuccess ? "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(59,130,246,0.15))" : "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(249,115,22,0.1))",
                borderRadius: "2.5rem",
                filter: "blur(20px)",
                opacity: 0.7,
                transition: "all 0.5s",
              }} 
            />
            <div 
              style={{
                position: "relative",
                background: "rgba(9,14,32,0.92)",
                border: isSuccess ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(245,158,11,0.3)",
                borderRadius: "2rem",
                padding: "clamp(2rem, 6vw, 3.5rem)",
                boxShadow: "0 20px 80px rgba(0,0,0,0.4)",
              }}
            >
              
              {/* Icon */}
              <div 
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "5rem",
                  height: "5rem",
                  borderRadius: "50%",
                  margin: "0 auto 2rem auto",
                  background: isSuccess ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                  border: isSuccess ? "2px solid rgba(16,185,129,0.3)" : "2px solid rgba(245,158,11,0.3)",
                  boxShadow: isSuccess ? "0 0 30px rgba(16,185,129,0.2)" : "none",
                }}
              >
                {isSuccess ? (
                  <svg style={{ width: "2.5rem", height: "2.5rem", color: "#34D399" }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg style={{ width: "2.5rem", height: "2.5rem", color: "#FBBF24" }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                )}
              </div>

              <p 
                style={{
                  textAlign: "center",
                  fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                  color: isSuccess ? "#34D399" : "#FBBF24",
                }}
              >
                {isSuccess ? "Payment received — you\u2019re in" : "Payment update"}
              </p>

              <h1 
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 900,
                  lineHeight: 1.1,
                  marginBottom: "1.5rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {isSuccess ? "Check your email for your Digital Forge access." : "Your payment status still needs attention."}
              </h1>

              <p 
                style={{
                  color: "rgba(255,255,255,0.7)",
                  textAlign: "center",
                  lineHeight: 1.8,
                  fontSize: "clamp(1.05rem, 2.5vw, 1.15rem)",
                  marginBottom: "2.5rem",
                  maxWidth: "36rem",
                  margin: "0 auto 2.5rem auto",
                  fontWeight: 500,
                }}
              >
                {isSuccess
                  ? "Once the payment provider confirms the order on our side, we automatically send your delivery email. If you do not see it within a few minutes, check spam or contact support with your payment email."
                  : "We did not get a clean success signal yet. If the payment provider charged you, keep your transaction reference and contact support so we can verify and deliver manually if needed."}
              </p>

              {isSuccess ? (
                <div 
                  style={{
                    background: "linear-gradient(180deg, rgba(59,130,246,0.05), transparent)",
                    border: "1px solid rgba(59,130,246,0.2)",
                    borderRadius: "1.5rem",
                    padding: "clamp(1.5rem, 5vw, 2rem)",
                    marginBottom: "2.5rem",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <p 
                    style={{
                      color: "#00CCFF",
                      fontWeight: 800,
                      fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      marginBottom: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00CCFF" }} /> Your first 4 steps after delivery
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {START_STEPS.map((step) => (
                      <div key={step.num} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "0.75rem", background: "rgba(255,255,255,0.02)", borderRadius: "0.75rem" }}>
                        <span style={{ flexShrink: 0, width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60A5FA", fontWeight: 900, fontSize: "0.75rem", boxShadow: "0 0 10px rgba(59,130,246,0.15)" }}>{step.num}</span>
                        <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.6, fontSize: "clamp(0.95rem, 2vw, 1.05rem)", fontWeight: 500, margin: 0 }}>{step.text}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ height: 1, width: "100%", background: "rgba(255,255,255,0.1)", margin: "1.5rem 0" }} />
                  <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6, fontSize: "clamp(0.85rem, 2vw, 0.95rem)", display: "flex", alignItems: "flex-start", gap: "0.75rem", margin: 0 }}>
                    <svg style={{ width: "1.25rem", height: "1.25rem", flexShrink: 0, color: "rgba(0,204,255,0.5)", marginTop: 2 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Reply to the delivery email with the product idea you plan to build first. That reply helps us support you and collect real buyer proof — only with your permission.
                  </p>
                </div>
              ) : null}

              {params.tx_ref ? (
                <div style={{ textAlign: "center", marginBottom: "2.5rem", padding: "1rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(0.85rem, 2vw, 0.95rem)", fontWeight: 500, margin: 0 }}>
                    Transaction reference:<br/>
                    <strong style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.125rem", marginTop: "0.25rem", display: "block", letterSpacing: "0.05em", fontFamily: "monospace" }}>{params.tx_ref}</strong>
                  </p>
                </div>
              ) : null}

              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
                <Link
                  href="/digital-forge/system"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem 2rem",
                    borderRadius: "0.75rem",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    background: "linear-gradient(135deg, #2563EB, #06B6D4)",
                    textDecoration: "none",
                    boxShadow: "0 0 30px rgba(37,99,235,0.4)",
                    minWidth: "160px",
                  }}
                >
                  Back to Starter System
                </Link>
                <Link
                  href="/contact"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem 2rem",
                    borderRadius: "0.75rem",
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: 700,
                    fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    border: "2px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)",
                    textDecoration: "none",
                    minWidth: "160px",
                  }}
                >
                  Contact support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

