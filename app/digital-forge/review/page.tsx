import Link from "next/link";
import type { Metadata } from "next";
import CurrencyPrice from "@/components/CurrencyPrice";

export const metadata: Metadata = {
  title: "Free Product Idea Review — Digital Forge | Triumphant HQ",
  description: "Have an idea, skill, or AI workflow you think could become a digital product? Send it in for a free product idea review and get practical offer clarity.",
};

const whatsappHref =
  "https://wa.me/2348107711190?text=Hi%20Adeyemi%2C%20I%20have%20a%20product%20idea%20I%20want%20reviewed.%20Here%20it%20is%3A%20";

const PAIN_POINTS = [
  "The buyer is unclear",
  "The pain point is vague",
  "The promise is too broad",
  "The product format is confusing",
  "The launch path is missing",
];

const REVIEW_CHECKS = [
  { icon: "👤", label: "Who the product is for" },
  { icon: "🎯", label: "What problem it solves" },
  { icon: "✅", label: "Whether the promise is believable" },
  { icon: "📦", label: "What the first paid version could be" },
  { icon: "🔧", label: "What to fix before launching" },
];

const TOOLKIT_ITEMS = [
  "Start Here Guide",
  "Main Guide",
  "Prompt Pack",
  "Launch Checklist",
  "Product Build Checklist",
  "Content Planner",
  "Offer Selection Worksheet",
  "Product Packaging Template",
  "Implementation Templates",
];

const FAQ = [
  { q: "Is this really free?", a: "Yes. The review is completely free. I will look at your idea and give you honest, practical feedback on WhatsApp. No strings attached." },
  { q: "What should I send?", a: "A short message describing your idea, skill, or AI workflow. Tell me who it is for, what problem it solves, and what you have built so far (if anything). Even a rough paragraph works." },
  { q: "How long does the review take?", a: "Most reviews are returned within 24–48 hours. If your idea needs a deeper look, I will let you know." },
  { q: "Do I need to buy anything?", a: "No. The review is free. The Starter System is available if you want the full toolkit to build, package, and launch — but that is your choice after the review." },
  { q: "What if my idea is bad?", a: "There are no bad ideas — just unclear packaging. The review helps you see whether the idea is ready to sell, or what needs to change first." },
];

export default function ReviewPage() {
  return (
    <div style={{ background: "#050510", minHeight: "100vh", color: "#fff", fontFamily: "sans-serif", overflow: "hidden" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", paddingTop: "clamp(6rem,15vw,9rem)", paddingBottom: "clamp(4rem,10vw,6rem)" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 25%,rgba(0,102,255,0.22),transparent 34%),radial-gradient(circle at 80% 10%,rgba(0,204,255,0.14),transparent 28%),linear-gradient(180deg,rgba(6,11,29,0.97),rgba(5,5,16,1))" }} />
        <div className="max-w-screen-lg mx-auto px-6 sm:px-10 lg:px-16 relative" style={{ textAlign: "center" }}>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", background: "rgba(0,102,255,0.1)", border: "1px solid rgba(0,102,255,0.35)", borderRadius: 999, padding: "0.42rem 1rem", marginBottom: "1.8rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00CCFF", display: "inline-block", boxShadow: "0 0 10px rgba(0,204,255,0.8)" }} />
            <span style={{ color: "#00CCFF", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>Free — No Obligation</span>
          </div>

          <h1 style={{ fontSize: "clamp(2.4rem,5.5vw,4.4rem)", fontWeight: 900, lineHeight: 1.06, letterSpacing: "-0.03em", maxWidth: 820, margin: "0 auto 1.6rem" }}>
            Have an idea, skill, or AI workflow you think could become{" "}
            <span style={{ background: "linear-gradient(90deg,#0066FF,#00CCFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>a digital product?</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.76)", maxWidth: 640, margin: "0 auto 1rem", lineHeight: 1.85, fontSize: "clamp(1.05rem,2.5vw,1.18rem)" }}>
            Send it in and I'll help you see if it is clear enough to package, sell, and launch.
          </p>
          <p style={{ color: "rgba(255,255,255,0.42)", maxWidth: 520, margin: "0 auto 2.6rem", lineHeight: 1.7, fontSize: "0.92rem" }}>
            No hype. No income guarantee. Just a practical offer clarity review.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "1.1rem 2.2rem", background: "linear-gradient(135deg,#25D366,#128C7E)", color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 12, boxShadow: "0 0 30px rgba(37,211,102,0.35)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.704-1.353A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.137 0-4.163-.641-5.875-1.853l-.413-.292-2.85.82.765-2.79-.321-.447A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
              Send My Idea on WhatsApp
            </a>
            <a href="/digital-forge/checkout?offer=system" style={{ display: "inline-flex", alignItems: "center", padding: "1.1rem 2.2rem", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.84)", textDecoration: "none", fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 12, background: "rgba(255,255,255,0.03)" }}>
              Get the Starter System — <CurrencyPrice ngnLabel="₦15,000" usdLabel="$30.00" />
            </a>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ paddingBottom: "clamp(4rem,10vw,6rem)" }}>
        <div className="max-w-screen-lg mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]" style={{ alignItems: "center" }}>
            <div>
              <p style={{ color: "#00CCFF", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ width: 28, height: 1, background: "rgba(0,204,255,0.5)" }} /> The Real Problem
              </p>
              <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.4rem" }}>
                Most people are not stuck because they lack ideas.
              </h2>
              <p style={{ color: "rgba(255,255,255,0.68)", fontSize: "clamp(1.02rem,2.5vw,1.12rem)", lineHeight: 1.85 }}>
                They are stuck because the idea is not packaged into a clear offer. The skill is real, the knowledge is real — but the product path is missing.
              </p>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "clamp(1.4rem,4vw,2.2rem)" }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "1.2rem" }}>Where most ideas get stuck</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                {PAIN_POINTS.map((item) => (
                  <div key={item} style={{ display: "flex", gap: "0.85rem", alignItems: "center" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(239,68,68,0.6)", flexShrink: 0 }} />
                    <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "1rem", lineHeight: 1.6, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT I WILL CHECK ── */}
      <section style={{ paddingBottom: "clamp(4rem,10vw,6rem)" }}>
        <div className="max-w-screen-lg mx-auto px-6 sm:px-10 lg:px-16">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 3rem" }}>
            <p style={{ color: "#00CCFF", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>What I Will Check</p>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, lineHeight: 1.1 }}>
              A practical clarity review for your product idea
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1rem" }}>
            {REVIEW_CHECKS.map((item) => (
              <div key={item.label} style={{ background: "rgba(0,102,255,0.05)", border: "1px solid rgba(0,102,255,0.15)", borderRadius: 20, padding: "1.5rem", textAlign: "center" }}>
                <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.8rem" }}>{item.icon}</span>
                <p style={{ color: "rgba(255,255,255,0.82)", fontWeight: 600, fontSize: "1rem", lineHeight: 1.5, margin: 0 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STARTER SYSTEM TOOLKIT ── */}
      <section style={{ paddingBottom: "clamp(4rem,10vw,6rem)" }}>
        <div className="max-w-screen-lg mx-auto px-6 sm:px-10 lg:px-16">
          <div style={{ background: "linear-gradient(180deg,rgba(11,16,38,1),rgba(5,8,20,1))", border: "1px solid rgba(0,102,255,0.2)", borderRadius: 32, padding: "clamp(2rem,6vw,3.5rem)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
            <p style={{ color: "#00CCFF", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ width: 28, height: 1, background: "rgba(0,204,255,0.5)" }} /> After the Review
            </p>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 900, lineHeight: 1.12, marginBottom: "0.8rem" }}>
              Want the full toolkit?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.62)", maxWidth: 600, lineHeight: 1.8, fontSize: "1.05rem", marginBottom: "2rem" }}>
              After the review, use the Digital Forge Starter System to build the full offer. Everything you need in one bundle:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "0.7rem", marginBottom: "2.5rem" }}>
              {TOOLKIT_ITEMS.map((item) => (
                <div key={item} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <span style={{ color: "#00CCFF", fontWeight: 900, fontSize: "0.85rem" }}>→</span>
                  <p style={{ color: "rgba(255,255,255,0.74)", fontSize: "0.95rem", lineHeight: 1.5, margin: 0 }}>{item}</p>
                </div>
              ))}
            </div>
            <a href="/digital-forge/checkout?offer=system" style={{ display: "inline-flex", alignItems: "center", padding: "1rem 2rem", background: "linear-gradient(135deg,#0066FF,#0044CC)", color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: "0.84rem", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 12, boxShadow: "0 0 32px rgba(0,102,255,0.38)" }}>
              Get the Starter System — <CurrencyPrice ngnLabel="₦15,000" usdLabel="$30.00" />
            </a>
          </div>
        </div>
      </section>

      {/* ── LAUNCH BONUS ── */}
      <section style={{ paddingBottom: "clamp(4rem,10vw,6rem)" }}>
        <div className="max-w-screen-lg mx-auto px-6 sm:px-10 lg:px-16">
          <div style={{ background: "linear-gradient(135deg,rgba(0,66,204,0.18),rgba(124,58,237,0.1))", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 28, padding: "clamp(2rem,6vw,3rem)", textAlign: "center" }}>
            <span style={{ display: "inline-block", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.35)", borderRadius: 999, padding: "0.4rem 1rem", color: "#A78BFA", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "1.4rem" }}>Launch Bonus</span>
            <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 900, lineHeight: 1.12, marginBottom: "1.2rem", maxWidth: 600, margin: "0 auto 1.2rem" }}>
              Buy during this launch and send me your completed worksheet.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", maxWidth: 560, margin: "0 auto", lineHeight: 1.85, fontSize: "1.05rem" }}>
              I'll review your first offer direction personally. That bonus is the bridge between unknown brand and first sales.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOUNDER NOTE ── */}
      <section style={{ paddingBottom: "clamp(4rem,10vw,6rem)" }}>
        <div className="max-w-screen-lg mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[auto_1fr]" style={{ alignItems: "start" }}>
            {/* Founder Photo */}
            <div style={{ flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/adeyemi-founder.jpg"
                alt="Adeyemi — Founder, Triumphant HQ"
                width={160}
                height={160}
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid rgba(0,102,255,0.3)",
                  boxShadow: "0 0 30px rgba(0,102,255,0.15)",
                }}
              />
            </div>

            <div style={{ maxWidth: 680 }}>
              <p style={{ color: "#00CCFF", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ width: 28, height: 1, background: "rgba(0,204,255,0.5)" }} /> A Note from the Founder
              </p>
              <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.2rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "1.4rem" }}>
                I built this review because I know the feeling.
              </h2>
              <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.9, fontSize: "1.05rem", marginBottom: "1rem" }}>
                You have skills. You know AI matters. You have ideas — maybe too many. But none of them have turned into a product someone has actually paid for yet.
              </p>
              <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.9, fontSize: "1.05rem", marginBottom: "1rem" }}>
                The gap is not intelligence. It is offer clarity. Most people skip the step where they turn a skill into a clear, packaged, sellable product — and then wonder why no one buys.
              </p>
              <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.9, fontSize: "1.05rem" }}>
                This review exists to close that gap for you — for free. And if you want the full system to build it out, the Starter System is there.
              </p>
              <p style={{ color: "rgba(255,255,255,0.45)", marginTop: "2rem", fontWeight: 600, fontSize: "0.95rem" }}>— Adeyemi, Triumphant HQ</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ paddingBottom: "clamp(4rem,10vw,6rem)", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "clamp(4rem,10vw,6rem)" }}>
        <div className="max-w-screen-lg mx-auto px-6 sm:px-10 lg:px-16">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 3rem" }}>
            <p style={{ color: "#00CCFF", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>Common Questions</p>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 900, lineHeight: 1.1 }}>Before you send your idea</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {FAQ.map((item) => (
              <div key={item.q} style={{ background: "rgba(9,14,32,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, padding: "clamp(1.2rem,4vw,1.8rem)" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.8rem" }}>{item.q}</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.97rem", lineHeight: 1.7, margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ paddingBottom: "6rem" }}>
        <div className="max-w-screen-lg mx-auto px-6 sm:px-10 lg:px-16">
          <div style={{ background: "rgba(9,14,32,1)", border: "1px solid rgba(0,102,255,0.2)", borderRadius: 40, padding: "clamp(3rem,8vw,5rem) 2rem", textAlign: "center", boxShadow: "0 0 80px rgba(0,102,255,0.08)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              <div style={{ position: "absolute", top: "-40%", left: "-15%", width: "90%", height: "140%", background: "rgba(0,102,255,0.08)", borderRadius: "50%", filter: "blur(90px)" }} />
              <div style={{ position: "absolute", top: "25%", right: "-15%", width: "70%", height: "90%", background: "rgba(0,204,255,0.06)", borderRadius: "50%", filter: "blur(90px)" }} />
            </div>
            <div style={{ position: "relative", zIndex: 10, maxWidth: 680, margin: "0 auto" }}>
              <p style={{ color: "#00CCFF", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.4rem" }}>Your Move</p>
              <h2 style={{ fontSize: "clamp(2rem,5vw,3.4rem)", fontWeight: 900, lineHeight: 1.08, marginBottom: "1.4rem" }}>
                Send your idea.{" "}
                <span style={{ background: "linear-gradient(90deg,#0066FF,#00CCFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Get clarity.</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.62)", maxWidth: 540, margin: "0 auto 2.5rem", lineHeight: 1.8, fontSize: "1.05rem" }}>
                No sales pitch. No funnel trap. Just a real review of your product idea so you know what to build, fix, or launch next.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "1.15rem 2.4rem", background: "linear-gradient(135deg,#25D366,#128C7E)", color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 14, boxShadow: "0 0 35px rgba(37,211,102,0.3)" }}>
                  Send My Idea on WhatsApp
                </a>
                <a href="/digital-forge/checkout?offer=system" style={{ display: "inline-flex", alignItems: "center", padding: "1.15rem 2.4rem", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.84)", textDecoration: "none", fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 14, background: "rgba(255,255,255,0.03)" }}>
                  Get the Starter System — <CurrencyPrice ngnLabel="₦15,000" usdLabel="$30.00" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
