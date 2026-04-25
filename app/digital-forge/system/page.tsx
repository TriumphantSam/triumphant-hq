import Link from "next/link";
import { formatOfferPrice, resolveSystemOffer, resolveUsdPriceLabel } from "@/lib/digital-forge-offers";

export const metadata = {
  title: "Digital Forge Side Hustle Starter System — Build and Sell Your First AI Product | Digital Forge",
  description:
    "Get the Digital Forge Side Hustle Starter System: the complete practical toolkit with guide, prompts, templates, launch assets, and operating documents to build and sell your first AI-powered digital product.",
};

const DELIVERABLES = [
  "01 Start Here.pdf — the first-step guide so you know exactly where to begin",
  "02 Main Guide.pdf — the complete build, package, and launch method in one place",
  "03 Prompt Pack — AI prompts tuned for offer clarity, product creation, copy, and launch support",
  "04 Launch Checklist.pdf — the practical sequence for moving from finished product to market",
  "05 Product Build Checklist.pdf — quality checks before you ask anyone to buy",
  "06 Content Planner.pdf — a simple promotion rhythm for getting the offer in front of people",
  "Editable worksheets and templates — offer selection, product packaging, messaging, and launch planning",
];

const OUTCOMES = [
  "One clear offer with a promise people can instantly understand",
  "One digital product bundled and packaged to sell",
  "One product page or sales path with stronger messaging",
  "One simple promotion and launch workflow you can use again",
];

const PROOF_ASSETS = [
  {
    title: "Built from the same workflow",
    body: "The Starter System was created with the same choose-build-package-launch method it teaches, so the product itself is proof of the operating path.",
  },
  {
    title: "Real implementation files",
    body: "You get the guide, prompt pack, worksheets, checklists, content planner, and launch templates in a clear order, not a loose folder of random downloads.",
  },
  {
    title: "No income fantasy",
    body: "The promise is practical: clarify one offer, create one useful product, package it properly, and give yourself a real route to a first sale.",
  },
];

const STARTER_STEPS = [
  "Open 01 Start Here.pdf",
  "Complete the Offer Selection Worksheet",
  "Use the Product Packaging Template to make the bundle feel sellable",
  "Run the Launch Checklist and Content Planner before publishing",
];

const whatsappHref =
  "https://wa.me/2348107711190?text=Hi%20Adeyemi%2C%20I%20am%20interested%20in%20the%20Digital%20Forge%20Starter%20System.%20I%20want%20to%20know%20if%20it%20fits%20me.";

const FOR_WHO = [
  { title: "Professionals", body: "Ready for a side hustle that actually fits your schedule constraints — no fantasy income claims, just a real operating method." },
  { title: "Creators With Expertise", body: "You know your subject but cannot figure out how to package it into something people will pay for. This fixes that." },
  { title: "AI-Curious Operators", body: "You follow the AI space closely, but have not turned that curiosity into a product that earns. This is the activation layer." },
  { title: "Stalled Founders", body: "You started once and got stuck. The Starter System gives you the structure to restart and finish without the confusion." },
];

const MODULES = [
  {
    num: "01",
    title: "Choose The Angle",
    description:
      "Pick one audience, one problem, one promise, and one realistic first offer instead of trying to build something for everyone and ending up with something for no one.",
  },
  {
    num: "02",
    title: "Build The Product",
    description:
      "Create your guide, prompt pack, checklist, template, and supporting assets so the bundle feels implementation-ready — not just a PDF people download and forget.",
  },
  {
    num: "03",
    title: "Package The Offer",
    description:
      "Strengthen your naming, messaging, headline, and promise clarity. Add the bonus logic that tips buyers from maybe to yes. Make them feel they would be leaving money on the table by not buying.",
  },
  {
    num: "04",
    title: "Launch Simply",
    description:
      "Use blog content, the free training, direct-response posts, and message-based selling to move from attention to your first sales. No paid ads required to start.",
  },
];

const FAQ = [
  {
    q: "Is this just an ebook?",
    a: "No. The Starter System is a practical toolkit: guide, prompts, templates, checklists, launch assets, and workflow documents. It is built to help you act immediately, not just feel informed.",
  },
  {
    q: "What if I have no product idea yet?",
    a: "The first section of the system is specifically about choosing a direction — one audience, one problem, one promise. You will leave that section with clarity, not confusion.",
  },
  {
    q: "Is this right for me if I already have an idea?",
    a: "Yes. If you have an idea but have not packaged, priced, or launched it yet, this system gives you everything you need to go from concept to sale.",
  },
  {
    q: "How is this different from the Course?",
    a: "The Starter System is the business toolkit — everything you need to act. The Course is the guided teaching layer that walks you through the full build-package-launch journey in more depth. Many people get the system first, then the course.",
  },
];

export default function DigitalForgeSystemPage() {
  const systemOffer = resolveSystemOffer();
  const systemPrice = formatOfferPrice(systemOffer.amount, systemOffer.currency);
  const usdPriceLabel = resolveUsdPriceLabel(systemOffer.key, systemOffer.kind);

  return (
    <div className="min-h-screen pb-24 bg-[#030614] text-white selection:bg-blue-500/30 font-sans">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-24">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-[10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[140px] mix-blend-screen" />
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-cyan-500/15 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-0 left-[20%] w-[60%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030614]/80 to-[#030614]" />
        </div>

        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <Link
            href="/digital-forge"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/90 transition-colors text-sm font-semibold tracking-wider mb-8 uppercase"
          >
            ← Back to Digital Forge
          </Link>

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(37,99,235,0.15)] animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.9)]" />
            <span className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em]">
              Flagship System — Most Popular
            </span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-start">
            <div>
              <h1 className="text-[clamp(2.6rem,6vw,4.8rem)] font-black leading-[1.05] tracking-tight text-white max-w-[860px] mb-6 drop-shadow-xl">
                You have AI tools. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">
                  Now ship a product people can actually buy.
                </span>
              </h1>
              <p className="text-[1.15rem] text-white/80 leading-relaxed max-w-[740px] mb-4 font-medium">
                Digital Forge gives you the practical system to build, package, and launch your first AI-powered digital product. No fake income claims, no prompt dump, no theory that leaves you stuck.
              </p>
              <p className="text-white/50 leading-relaxed max-w-[740px] text-[1rem] mb-10">
                Built for professionals, creators, and operators who consume AI content but still do not have one clear offer, one useful product, and one simple sales path.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link
                  href="/digital-forge/checkout?offer=system"
                  id="system-buy-cta"
                  className="group relative inline-flex items-center justify-center px-8 py-4 rounded-2xl text-white font-extrabold text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] active:scale-[0.98]"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:via-cyan-500 group-hover:to-blue-600" />
                  <span className="relative z-10 flex items-center gap-2">
                    Get the Starter System — {usdPriceLabel}
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                </Link>
                <Link
                  href={whatsappHref}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-white/80 font-bold text-sm uppercase tracking-widest border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white hover:border-white/20 active:scale-[0.98]"
                >
                  Need help deciding? Message on WhatsApp
                </Link>
              </div>

              <div className="flex items-center gap-3 text-white/40 text-xs font-medium">
                <svg className="w-5 h-5 flex-shrink-0 text-blue-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <p>
                  International checkout is available via Lemon Squeezy. Local naira checkout remains available for Nigerian buyers.
                </p>
              </div>
            </div>

            {/* Outcome summary card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/30 to-cyan-500/20 rounded-[2rem] blur-xl opacity-70 transition-all duration-500 group-hover:blur-2xl group-hover:opacity-100" />
              <div className="relative bg-[#0A0F24]/95 backdrop-blur-2xl border border-blue-500/20 rounded-[2rem] p-8 shadow-2xl transition-transform duration-500 hover:-translate-y-1">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                  <svg className="w-32 h-32 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                
                <p className="text-cyan-400 text-xs uppercase tracking-[0.2em] font-bold mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  What You Walk Away With
                </p>
                
                <div className="grid gap-4 relative z-10">
                  {OUTCOMES.map((item) => (
                    <div key={item} className="flex gap-4 items-start p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center mt-0.5 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                        <span className="text-blue-400 text-xs font-black">✓</span>
                      </span>
                      <p className="text-white/80 leading-relaxed text-[0.95rem] font-medium">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                  <p className="text-white/40 text-xs uppercase tracking-[0.15em] mb-1 font-semibold">
                    Instant Access Price
                  </p>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 font-black text-[2rem] mb-1">
                    {usdPriceLabel}
                  </p>
                  <p className="text-white/50 text-sm font-medium">
                    Also available locally from {systemPrice} through Flutterwave.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- FOUNDER PROOF -- */}
      <section className="py-24 relative border-t border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <div className="mb-12 max-w-3xl">
            <p className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-cyan-400/50" /> Founder Proof
            </p>
            <h2 className="text-white text-[clamp(2rem,4vw,3rem)] font-black leading-tight mb-5 tracking-tight">
              Built from the same system <br className="hidden md:block"/> used to create this offer
            </h2>
            <p className="text-white/60 leading-relaxed text-[1.05rem]">
              Before there are testimonials, there is build proof: the product shows its own method. The Starter System turns the messy middle of AI product creation into a clear sequence: choose the offer, build the asset, package the bundle, and launch with a simple sales path.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {PROOF_ASSETS.map((item) => (
              <div
                key={item.title}
                className="group bg-white/[0.02] border border-white/5 rounded-[1.5rem] p-8 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-3">
                  <span className="w-1.5 h-6 rounded-full bg-blue-500 group-hover:bg-cyan-400 transition-colors" />
                  {item.title}
                </h3>
                <p className="text-white/60 leading-relaxed text-[0.95rem]">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-blue-500/5 border border-blue-500/20 rounded-[1.5rem] p-6 backdrop-blur-sm">
            {STARTER_STEPS.map((item, index) => (
              <div key={item} className="flex gap-4 items-start p-4 rounded-xl hover:bg-blue-500/10 transition-colors">
                <span className="text-blue-400 font-black text-xl opacity-60">{String(index + 1).padStart(2, "0")}</span>
                <p className="text-white/80 leading-snug text-[0.9rem] font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section className="py-24">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <p className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase mb-4 justify-center flex items-center gap-3">
              <span className="w-8 h-[1px] bg-cyan-400/50" /> Who This Is For <span className="w-8 h-[1px] bg-cyan-400/50" />
            </p>
            <h2 className="text-white text-[clamp(2rem,4vw,3rem)] font-black leading-tight tracking-tight">
              Built for real people with real goals
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FOR_WHO.map((item) => (
              <div
                key={item.title}
                className="relative overflow-hidden group bg-gradient-to-br from-blue-900/10 to-transparent border border-blue-500/10 rounded-[1.5rem] p-8 hover:border-blue-400/40 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-blue-400/20" />
                <h3 className="text-white font-bold text-xl mb-3 relative z-10 flex items-center gap-3">
                  <span className="w-1.5 h-6 rounded-full bg-cyan-500" />
                  {item.title}
                </h3>
                <p className="text-white/60 leading-relaxed text-[0.95rem] relative z-10 ml-4">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET + MODULES ── */}
      <section className="py-24 relative">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            {/* Left Column: Everything Included */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-10 relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <p className="text-cyan-400 text-xs uppercase tracking-[0.2em] font-bold mb-4 flex items-center gap-2">
                  <span className="w-6 h-[1px] bg-cyan-400/50" /> Everything Included
                </p>
                <h2 className="text-white text-[1.8rem] font-black leading-tight mb-8">
                  A complete business toolkit,<br/> not loose files
                </h2>
                <div className="grid gap-5">
                  {DELIVERABLES.map((item) => (
                    <div key={item} className="flex gap-4 items-start group/item">
                      <span className="text-cyan-400 font-bold mt-1 group-hover/item:translate-x-1 transition-transform">→</span>
                      <p className="text-white/70 leading-relaxed text-[0.95rem]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: How It Works */}
            <div className="bg-gradient-to-b from-[#0B1026] to-[#050814] border border-blue-500/20 rounded-[2rem] p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
              <div className="relative z-10">
                <p className="text-cyan-400 text-xs uppercase tracking-[0.2em] font-bold mb-4 flex items-center gap-2">
                  <span className="w-6 h-[1px] bg-cyan-400/50" /> How It Works
                </p>
                <h2 className="text-white text-[1.8rem] font-black leading-tight mb-10">
                  A guided build path,<br/> not a pile of random files
                </h2>
                <div className="grid gap-8">
                  {MODULES.map((item) => (
                    <div key={item.title} className="flex gap-6 items-start group">
                      <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-black text-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                        {item.num}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                        <p className="text-white/60 leading-relaxed text-[0.95rem]">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── UPGRADE PATH ── */}
      <section className="py-24">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <p className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase mb-4 justify-center flex items-center gap-3">
              <span className="w-8 h-[1px] bg-cyan-400/50" /> What Comes Next <span className="w-8 h-[1px] bg-cyan-400/50" />
            </p>
            <h2 className="text-white text-[clamp(2rem,4vw,3rem)] font-black leading-tight tracking-tight">
              The Starter System is the beginning, not the ceiling
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Before */}
            <div className="rounded-[1.5rem] border border-cyan-500/20 bg-cyan-500/5 p-8 flex flex-col hover:bg-cyan-500/10 transition-colors">
              <p className="text-cyan-400 text-xs uppercase tracking-[0.2em] font-bold mb-4">Before the System</p>
              <h3 className="text-white text-xl font-bold mb-3">Free Training</h3>
              <p className="text-white/60 leading-relaxed text-sm mb-8 flex-grow">
                Watch the training first if you want to see the full framework before buying. If you are ready to build now, the Starter System is the direct path.
              </p>
              <Link href="/digital-forge/training" className="text-cyan-400 font-bold text-sm hover:text-cyan-300 flex items-center gap-2 w-fit group">
                Watch Free Training <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            
            {/* Current */}
            <div className="rounded-[1.5rem] border-2 border-blue-500/50 bg-blue-500/10 p-8 flex flex-col relative overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.15)] transform md:-translate-y-4">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-400" />
              <p className="text-blue-400 text-xs uppercase tracking-[0.2em] font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> You Are Here
              </p>
              <h3 className="text-white text-xl font-bold mb-3">Starter System</h3>
              <p className="text-white/70 leading-relaxed text-sm mb-8 flex-grow">
                The core paid toolkit. Everything you need to build, package, and sell your first AI-powered digital product.
              </p>
              <Link href="/digital-forge/checkout?offer=system" className="inline-flex items-center justify-center px-6 py-4 rounded-xl bg-blue-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-400 transition-colors w-full text-center">
                Get the System — {usdPriceLabel}
              </Link>
            </div>
            
            {/* Next */}
            <div className="rounded-[1.5rem] border border-purple-500/20 bg-purple-500/5 p-8 flex flex-col hover:bg-purple-500/10 transition-colors">
              <p className="text-purple-400 text-xs uppercase tracking-[0.2em] font-bold mb-4">The Next Level</p>
              <h3 className="text-white text-xl font-bold mb-3">Digital Forge Course</h3>
              <p className="text-white/60 leading-relaxed text-sm mb-8 flex-grow">
                The full guided curriculum for a deeper, more supported build-package-launch-grow journey. Takes you further than the system alone.
              </p>
              <Link href="/digital-forge/course" className="text-purple-400 font-bold text-sm hover:text-purple-300 flex items-center gap-2 w-fit group">
                Explore the Course <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <p className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase mb-4 justify-center flex items-center gap-3">
              <span className="w-8 h-[1px] bg-cyan-400/50" /> Common Questions <span className="w-8 h-[1px] bg-cyan-400/50" />
            </p>
            <h2 className="text-white text-[clamp(2rem,4vw,3rem)] font-black leading-tight tracking-tight">
              Everything you need to know before buying
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {FAQ.map((item) => (
              <div key={item.q} className="bg-[#0A0F24] border border-white/10 rounded-[1.5rem] p-8 hover:border-blue-500/30 transition-colors">
                <h3 className="text-white font-bold text-lg mb-3">{item.q}</h3>
                <p className="text-white/60 leading-relaxed text-[0.95rem]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 relative">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <div className="relative overflow-hidden rounded-[3rem] p-[clamp(3rem,8vw,6rem)] text-center shadow-[0_0_100px_rgba(0,102,255,0.1)] border border-blue-500/20 bg-[#0A0F24]">
            {/* CTA Background Gradients */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute -top-[50%] -left-[20%] w-[100%] h-[150%] bg-blue-600/10 rounded-full blur-[100px]" />
              <div className="absolute top-[20%] -right-[20%] w-[80%] h-[100%] bg-cyan-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <p className="text-cyan-400 text-sm font-bold tracking-[0.2em] uppercase mb-6 flex justify-center items-center gap-3">
                <span className="w-10 h-[1px] bg-cyan-400/50" />
                Stop Dabbling. Start Building.
                <span className="w-10 h-[1px] bg-cyan-400/50" />
              </p>
              
              <h2 className="text-white text-[clamp(2.5rem,5vw,4rem)] font-black leading-[1.05] mb-8 tracking-tight drop-shadow-lg">
                This is the fastest path from AI curiosity to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">one product you can sell.</span>
              </h2>
              
              <p className="text-white/70 text-lg leading-relaxed mb-12 max-w-2xl mx-auto font-medium">
                The Starter System gives you the guide, prompts, worksheets, checklists, and launch assets to build one clear digital product and take it to market. No hype, no income guarantee, just a serious system for doing the work.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/digital-forge/checkout?offer=system"
                  id="system-buy-cta-bottom"
                  className="group relative inline-flex items-center justify-center px-10 py-5 rounded-2xl text-white font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] active:scale-[0.98]"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:via-cyan-500 group-hover:to-blue-600" />
                  <span className="relative z-10 flex items-center gap-3">
                    Get the Starter System — {usdPriceLabel}
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                </Link>
                <Link
                  href={whatsappHref}
                  className="inline-flex items-center justify-center px-8 py-5 rounded-2xl text-white/90 font-bold text-sm uppercase tracking-widest border border-white/20 bg-white/5 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/40 hover:text-white active:scale-[0.98]"
                >
                  Message on WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

