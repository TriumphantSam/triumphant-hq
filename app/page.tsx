import Link from "next/link";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import CTABand from "@/components/marketing/CTABand";
import ProcessSteps from "@/components/marketing/ProcessSteps";
import SectionHeader from "@/components/marketing/SectionHeader";
import ServiceCard from "@/components/marketing/ServiceCard";
import { agencyServices } from "@/lib/services";

const outcomes = [
  ["Credibility", "A sharper digital presence that reflects the quality of your work."],
  ["Efficiency", "Purpose-built systems that reduce friction for customers and teams."],
  ["Visibility", "Technical and content foundations that make demand easier to capture."],
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />

      <section className="section-shell">
        <SectionHeader
          eyebrow="What we do"
          title="One partner across the systems that power modern growth."
          description="Strategy is only useful when it becomes something customers can experience and teams can operate. We connect design, engineering, visibility and automation into focused delivery."
        />
        <div className="agency-grid">
          {agencyServices.map((service) => <ServiceCard key={service.slug} service={service} />)}
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <SectionHeader
              align="left"
              eyebrow="Built around outcomes"
              title="Technology should improve how your business is understood, found and run."
              description="We begin with the commercial problem, then choose the right combination of creative and technical work to solve it."
            />
            <div className="grid gap-3">
              {outcomes.map(([title, copy], index) => (
                <div className="group grid grid-cols-[48px_1fr] gap-4 rounded-[1.35rem] border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]" key={title}>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 font-mono text-xs font-bold text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">0{index + 1}</span>
                  <div>
                    <h3 className="font-bold text-slate-950">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <SectionHeader
          eyebrow="How we work"
          title="A clear path from challenge to working solution."
          description="You stay close to the decisions that matter, without having to manage every technical detail."
        />
        <ProcessSteps />
      </section>

      <div className="section-muted">
        <Testimonials />
      </div>

      <section className="section-shell">
        <div className="grid overflow-hidden rounded-[2.2rem] border border-slate-200/80 bg-[linear-gradient(135deg,#f8faff,#f1f6ff)] shadow-[0_24px_70px_rgba(7,94,229,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 flex flex-col justify-center">
            <p className="eyebrow">Free SEO visibility snapshot</p>
            <h2 className="mt-5 max-w-xl text-[clamp(2.1rem,4.5vw,3.2rem)] font-extrabold leading-[1.08] tracking-[-0.05em] text-slate-950">
              Find the gaps limiting your search visibility.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 font-medium">
              Get a practical first view of your technical health, search signals and priority opportunities—without committing to a retainer.
            </p>
            <div className="mt-8">
              <Link className="button button-primary" href="/seo-snapshot">Run my free snapshot</Link>
            </div>
          </div>
          <div className="grid content-center gap-4 border-t border-slate-200/60 bg-white/70 px-8 py-12 backdrop-blur-md lg:border-l lg:border-t-0 sm:px-12 sm:py-16">
            {["Technical health overview", "On-page visibility signals", "Priority action recommendations"].map((item) => (
              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4.5 text-[0.92rem] font-bold text-slate-800 shadow-[0_4px_20px_rgba(15,23,42,0.02)]" key={item}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-blue-600 text-xs text-white shadow-[0_4px_12px_rgba(7,94,229,0.22)] font-bold">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand />

      <section className="section-shell !pt-0">
        <div className="flex flex-col items-start justify-between gap-5 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Learning and products</p>
            <p className="mt-2 text-sm text-slate-600">Looking for Digital Forge, practical training or ready-to-use systems?</p>
          </div>
          <Link className="button button-secondary shrink-0" href="/resources">Visit Resources <span className="ml-2">→</span></Link>
        </div>
      </section>
    </div>
  );
}
