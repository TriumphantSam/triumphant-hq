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

export default async function DigitalForgeCheckoutConfirmedPage({ searchParams }: ConfirmedPageProps) {
  const params = await searchParams;
  const status = (params.status ?? "").toLowerCase();
  const isSuccess = !status || status === "successful" || status === "completed";

  return (
    <div className="min-h-screen pb-24">
      {isSuccess && (
        <Script id="meta-pixel-purchase">
          {`if (typeof fbq !== 'undefined') fbq('track', 'Purchase');`}
        </Script>
      )}
      <section className="relative overflow-hidden pt-28 pb-20">
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 18%, rgba(16,185,129,0.2), transparent 28%), radial-gradient(circle at 78% 16%, rgba(0,102,255,0.18), transparent 24%), linear-gradient(180deg, rgba(4,9,24,0.98), rgba(5,5,16,1))",
          }}
        />

        <div className="max-w-screen-md px-6 sm:px-10 lg:px-16 relative">
          <div
            style={{
              background: "rgba(9,14,32,0.92)",
              border: "1px solid rgba(16,185,129,0.22)",
              borderRadius: 24,
              padding: "2rem",
              boxShadow: "0 20px 80px rgba(0,0,0,0.4)",
            }}
          >
            <p
              style={{
                color: isSuccess ? "#34D399" : "#FBBF24",
                fontSize: "0.76rem",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: "0.9rem",
              }}
            >
              {isSuccess ? "Payment received" : "Payment update"}
            </p>

            <h1
              style={{
                color: "#fff",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 900,
                lineHeight: 1.08,
                marginBottom: "1rem",
              }}
            >
              {isSuccess ? "Check your email for your Digital Forge access." : "Your payment status still needs attention."}
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.85,
                fontSize: "1rem",
                marginBottom: "1rem",
              }}
            >
              {isSuccess
                ? "Once the payment provider confirms the order on our side, we automatically send your delivery email. If you do not see it within a few minutes, check spam or contact support with your payment email."
                : "We did not get a clean success signal yet. If the payment provider charged you, keep your transaction reference and contact support so we can verify and deliver manually if needed."}
            </p>

            {isSuccess ? (
              <div
                style={{
                  border: "1px solid rgba(0,204,255,0.22)",
                  background: "rgba(0,102,255,0.08)",
                  borderRadius: 18,
                  padding: "1rem",
                  marginBottom: "1.4rem",
                }}
              >
                <p style={{ color: "#00CCFF", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.55rem" }}>
                  Start here after delivery
                </p>
                <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7, fontSize: "0.92rem", marginBottom: "0.7rem" }}>
                  Open <strong style={{ color: "#fff" }}>01 Start Here.pdf</strong> first, then complete the Offer Selection Worksheet before opening the other templates.
                </p>
                <p style={{ color: "rgba(255,255,255,0.58)", lineHeight: 1.7, fontSize: "0.88rem" }}>
                  Reply to the delivery email with the product idea you plan to build first. That reply helps us support you and collect real buyer proof only with permission.
                </p>
              </div>
            ) : null}

            {params.tx_ref ? (
              <p
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "0.85rem",
                  marginBottom: "1.4rem",
                }}
              >
                Transaction reference: <strong style={{ color: "rgba(255,255,255,0.78)" }}>{params.tx_ref}</strong>
              </p>
            ) : null}

            <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap" }}>
              <Link
                href="/digital-forge/system"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.95rem 1.4rem",
                  borderRadius: 12,
                  textDecoration: "none",
                  color: "#fff",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #0066FF, #00CCFF)",
                }}
              >
                Back to Starter System
              </Link>
              <Link
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.95rem 1.4rem",
                  borderRadius: 12,
                  textDecoration: "none",
                  color: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  fontWeight: 700,
                }}
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
