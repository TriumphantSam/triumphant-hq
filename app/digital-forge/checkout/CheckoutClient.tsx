"use client";

import { FormEvent, useState, useEffect } from "react";

type CheckoutClientProps = {
  offerKey: string;
  offerKind: "product" | "system";
  slug?: string;
  title: string;
  priceLabel: string;
  usdPriceLabel?: string;
  hasInternationalCheckout?: boolean;
};

type MetaPixelWindow = Window & {
  fbq?: (eventType: "track", eventName: string) => void;
};

export default function CheckoutClient({
  offerKey,
  offerKind,
  slug,
  priceLabel,
  usdPriceLabel,
  hasInternationalCheckout = false,
}: CheckoutClientProps) {
  useEffect(() => {
    const pixel = (window as MetaPixelWindow).fbq;
    pixel?.("track", "InitiateCheckout");
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [provider, setProvider] = useState<"flutterwave" | "lemonsqueezy">(
    hasInternationalCheckout ? "lemonsqueezy" : "flutterwave",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Your name and email are required before checkout.");
      return;
    }

    setSubmitting(true);
    try {
      const checkoutRoute =
        provider === "lemonsqueezy"
          ? "/api/digital-forge/lemonsqueezy/checkout"
          : "/api/digital-forge/flutterwave/checkout";

      const response = await fetch(checkoutRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerKind,
          offerKey,
          slug,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        }),
      });

      const payload = (await response.json()) as { paymentLink?: string; error?: string };
      if (!response.ok || !payload.paymentLink) {
        throw new Error(payload.error || "Unable to start checkout right now.");
      }

      window.location.href = payload.paymentLink;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start checkout right now.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "0.45rem",
        }}
      >
        <label htmlFor="checkout-name" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", fontWeight: 600 }}>
          Full name
        </label>
        <input
          id="checkout-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          autoComplete="name"
          style={{
            width: "100%",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.04)",
            color: "#fff",
            padding: "0.9rem 1rem",
            outline: "none",
            transition: "border-color 0.2s ease",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(0,204,255,0.5)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.14)")}
        />
      </div>

      <div
        style={{
          display: "grid",
          gap: "0.45rem",
        }}
      >
        <label htmlFor="checkout-email" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", fontWeight: 600 }}>
          Email address
        </label>
        <input
          id="checkout-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          style={{
            width: "100%",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.04)",
            color: "#fff",
            padding: "0.9rem 1rem",
            outline: "none",
            transition: "border-color 0.2s ease",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(0,204,255,0.5)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.14)")}
        />
      </div>

      <div
        style={{
          display: "grid",
          gap: "0.45rem",
        }}
      >
        <label htmlFor="checkout-phone" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", fontWeight: 600 }}>
          Phone number <span style={{ color: "rgba(255,255,255,0.35)" }}>(optional)</span>
        </label>
        <input
          id="checkout-phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+234..."
          autoComplete="tel"
          style={{
            width: "100%",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.04)",
            color: "#fff",
            padding: "0.9rem 1rem",
            outline: "none",
            transition: "border-color 0.2s ease",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(0,204,255,0.5)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.14)")}
        />
      </div>

      <div
        style={{
          display: "grid",
          gap: "0.8rem",
          marginTop: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", flex: 1 }} />
          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: "0.84rem",
              fontWeight: 700,
              margin: 0,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Choose payment method
          </p>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", flex: 1 }} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "0.6rem",
          }}
        >
          {[
            ...(hasInternationalCheckout ? [{
              id: "lemonsqueezy",
              label: "Global Cards & Apple Pay",
              desc: "International checkout in USD and other supported currencies",
              icon: "🌍",
              activeColor: "rgba(255, 194, 51, 0.12)",
              activeBorder: "rgba(255, 194, 51, 0.7)",
              activeText: "#FFD055"
            }] : []),
            {
              id: "flutterwave", 
              label: "Local Payment", 
              desc: "Pay securely in Naira (Cards, USSD, Bank Transfer)", 
              icon: "🇳🇬",
              activeColor: "rgba(255, 120, 0, 0.14)",
              activeBorder: "rgba(255, 120, 0, 0.7)",
              activeText: "#FF9944"
            },
          ].map((item) => {
            const isActive = provider === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setProvider(item.id as "flutterwave" | "lemonsqueezy")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  borderRadius: 14,
                  border: isActive ? `1px solid ${item.activeBorder}` : "1px solid rgba(255,255,255,0.14)",
                  background: isActive ? item.activeColor : "rgba(255,255,255,0.03)",
                  padding: "1rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.25s ease-in-out",
                  transform: isActive ? "translateY(-2px)" : "translateY(0)",
                  boxShadow: isActive ? `0 6px 20px ${item.activeColor}` : "none",
                }}
              >
                <div style={{ fontSize: "1.6rem" }}>{item.icon}</div>
                <div>
                  <div style={{ 
                    color: isActive ? item.activeText : "rgba(255,255,255,0.9)", 
                    fontSize: "0.96rem", 
                    fontWeight: 800,
                    marginBottom: "0.15rem"
                  }}>
                    {item.label}
                  </div>
                  <div style={{ 
                    color: isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)", 
                    fontSize: "0.8rem", 
                    fontWeight: 500 
                  }}>
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <div
          style={{
            borderRadius: 12,
            border: "1px solid rgba(239,68,68,0.35)",
            background: "rgba(127,29,29,0.2)",
            color: "#fecaca",
            padding: "0.85rem 1rem",
            fontSize: "0.88rem",
            lineHeight: 1.6,
          }}
        >
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        style={{
          marginTop: "0.5rem",
          border: "none",
          borderRadius: 14,
          padding: "1.1rem 1.1rem",
          background: provider === "lemonsqueezy" 
            ? "linear-gradient(135deg, #E69B00, #FFC233)" 
            : "linear-gradient(135deg, #D45000, #FF6B00)",
          color: provider === "lemonsqueezy" ? "#000" : "#fff",
          fontWeight: 900,
          fontSize: "0.95rem",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          cursor: submitting ? "wait" : "pointer",
          opacity: submitting ? 0.75 : 1,
          boxShadow: provider === "lemonsqueezy" 
            ? "0 0 34px rgba(255, 194, 51, 0.3)" 
            : "0 0 34px rgba(255, 107, 0, 0.38)",
          transition: "all 0.3s ease",
        }}
      >
        {submitting ? "Opening Secure Checkout..." : 
          provider === "lemonsqueezy" ? `Pay ${usdPriceLabel || "$10.00"} via international checkout` : `Pay ${priceLabel} via secure local checkout`
        }
      </button>

      <div style={{ textAlign: "center", marginTop: "0.2rem" }}>
        <p
          style={{
            color: "rgba(255,255,255,0.42)",
            fontSize: "0.8rem",
            lineHeight: 1.6,
            margin: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem"
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Processed via PCI-DSS compliant secure checkout.
        </p>
      </div>
    </form>
  );
}
