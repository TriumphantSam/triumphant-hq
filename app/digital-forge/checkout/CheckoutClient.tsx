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
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <label htmlFor="checkout-name" className="text-white/80 text-sm font-bold tracking-wide">
          Full name
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-500" />
          <input
            id="checkout-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            autoComplete="name"
            className="relative w-full rounded-xl border border-white/10 bg-white/5 text-white px-4 py-3.5 outline-none transition-all duration-300 focus:border-blue-400/50 focus:bg-white/[0.08] placeholder:text-white/20 font-medium"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="checkout-email" className="text-white/80 text-sm font-bold tracking-wide">
          Email address
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-500" />
          <input
            id="checkout-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="relative w-full rounded-xl border border-white/10 bg-white/5 text-white px-4 py-3.5 outline-none transition-all duration-300 focus:border-blue-400/50 focus:bg-white/[0.08] placeholder:text-white/20 font-medium"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="checkout-phone" className="text-white/80 text-sm font-bold tracking-wide flex items-center justify-between">
          <span>Phone number</span>
          <span className="text-white/30 text-xs font-medium uppercase tracking-wider">Optional</span>
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-500" />
          <input
            id="checkout-phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+234..."
            autoComplete="tel"
            className="relative w-full rounded-xl border border-white/10 bg-white/5 text-white px-4 py-3.5 outline-none transition-all duration-300 focus:border-blue-400/50 focus:bg-white/[0.08] placeholder:text-white/20 font-medium"
          />
        </div>
      </div>

      <div className="grid gap-4 mt-4">
        <div className="flex items-center gap-4">
          <div className="h-px bg-white/10 flex-1" />
          <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] m-0">
            Choose payment method
          </p>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {[
            ...(hasInternationalCheckout ? [{
              id: "lemonsqueezy",
              label: "Global Cards & Apple Pay",
              desc: "International checkout in USD and other supported currencies",
              icon: "🌍",
              activeColor: "bg-yellow-500/10",
              activeBorder: "border-yellow-500/50",
              activeText: "text-yellow-400",
              hoverBorder: "hover:border-yellow-500/30",
              shadow: "shadow-[0_0_20px_rgba(234,179,8,0.15)]",
            }] : []),
            {
              id: "flutterwave", 
              label: "Local Payment", 
              desc: "Pay securely in Naira (Cards, USSD, Bank Transfer)", 
              icon: "🇳🇬",
              activeColor: "bg-orange-500/10",
              activeBorder: "border-orange-500/50",
              activeText: "text-orange-400",
              hoverBorder: "hover:border-orange-500/30",
              shadow: "shadow-[0_0_20px_rgba(249,115,22,0.15)]",
            },
          ].map((item) => {
            const isActive = provider === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setProvider(item.id as "flutterwave" | "lemonsqueezy")}
                className={`flex items-center gap-4 rounded-xl p-4 cursor-pointer text-left transition-all duration-300 ${
                  isActive 
                    ? `border ${item.activeBorder} ${item.activeColor} ${item.shadow} scale-[1.02]` 
                    : `border border-white/10 bg-white/5 ${item.hoverBorder} hover:bg-white/10 hover:scale-[1.01]`
                }`}
              >
                <div className="text-3xl filter drop-shadow-md">{item.icon}</div>
                <div>
                  <div className={`font-black text-base mb-1 ${isActive ? item.activeText : "text-white/90"}`}>
                    {item.label}
                  </div>
                  <div className={`text-xs font-medium leading-relaxed ${isActive ? "text-white/80" : "text-white/40"}`}>
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 p-4 text-sm font-medium leading-relaxed flex items-start gap-3">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className={`relative mt-2 w-full rounded-xl p-4 font-black text-sm uppercase tracking-widest transition-all duration-300 overflow-hidden ${
          submitting ? "cursor-wait opacity-80" : "hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        }`}
      >
        <span className={`absolute inset-0 w-full h-full transition-all duration-300 ${
          provider === "lemonsqueezy" 
            ? "bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-amber-400 hover:to-yellow-500" 
            : "bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400"
        }`} />
        <span className="relative z-10 flex items-center justify-center gap-2 text-black">
          {submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Opening Secure Checkout...
            </>
          ) : (
            <>
              {provider === "lemonsqueezy" ? `Pay ${usdPriceLabel || "$10.00"} via international checkout` : `Pay ${priceLabel} via secure local checkout`}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </>
          )}
        </span>
      </button>

      <div className="text-center mt-2">
        <p className="text-white/40 text-xs font-medium leading-relaxed m-0 inline-flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Processed via PCI-DSS compliant secure checkout.
        </p>
      </div>
    </form>
  );
}
