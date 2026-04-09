"use client";

import { FormEvent, useState } from "react";

type CheckoutClientProps = {
  offerKey: string;
  offerKind: "product" | "system";
  slug?: string;
  title: string;
  priceLabel: string;
};

export default function CheckoutClient({
  offerKey,
  offerKind,
  slug,
  title,
  priceLabel,
}: CheckoutClientProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Your name and email are required before checkout.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/digital-forge/flutterwave/checkout", {
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
          }}
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
          }}
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
          }}
        />
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
          border: "none",
          borderRadius: 14,
          padding: "1rem 1.1rem",
          background: "linear-gradient(135deg, #0066FF, #00CCFF)",
          color: "#fff",
          fontWeight: 800,
          fontSize: "0.92rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: submitting ? "wait" : "pointer",
          opacity: submitting ? 0.75 : 1,
          boxShadow: "0 0 34px rgba(0,102,255,0.38)",
        }}
      >
        {submitting ? "Opening Secure Checkout..." : `Continue to pay ${priceLabel}`}
      </button>

      <p
        style={{
          color: "rgba(255,255,255,0.42)",
          fontSize: "0.78rem",
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        Your payment is processed on Flutterwave. After successful verification, we automatically email your access details for <strong style={{ color: "rgba(255,255,255,0.74)" }}>{title}</strong>.
      </p>
    </form>
  );
}
