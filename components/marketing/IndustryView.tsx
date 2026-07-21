import Link from "next/link";
import CTABand from "@/components/marketing/CTABand";
import type { IndustryPage } from "@/lib/compare-industries";

export default function IndustryView({ page }: { page: IndustryPage }) {
  return (
    <div>
      <header className="page-hero">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </header>

      <section className="section-shell">
        <p className="max-w-2xl text-[1.05rem] leading-8 text-slate-600">{page.audience}</p>

        <div className="mt-14 grid gap-8 border-t border-slate-200 pt-12 md:grid-cols-3">
          {page.challenges.map((item, index) => (
            <div key={item.title}>
              <span className="font-mono text-[0.7rem] font-bold tracking-[0.14em] text-blue-600">
                0{index + 1}
              </span>
              <h2 className="font-display mt-3 text-[1.25rem] font-bold tracking-[-0.025em] text-slate-950">
                {item.title}
              </h2>
              <p className="mt-3 text-[0.98rem] leading-7 text-slate-600">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <p className="eyebrow">How we help</p>
          <h2 className="font-display mt-5 max-w-2xl text-[clamp(1.85rem,3vw,2.6rem)] font-bold tracking-[-0.04em] text-slate-950">
            A focused path from commercial problem to working system.
          </h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {page.approach.map((item) => (
              <div key={item.title} className="border-l border-blue-200/80 pl-6">
                <h3 className="font-display text-[1.15rem] font-bold tracking-[-0.02em] text-slate-950">{item.title}</h3>
                <p className="mt-3 text-[0.98rem] leading-7 text-slate-600">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <p className="eyebrow">Relevant services</p>
        <div className="mt-8 grid gap-0 border-y border-slate-200 md:grid-cols-2">
          {page.services.map((service, index) => (
            <Link
              key={service.href}
              href={service.href}
              className={`block px-0 py-7 transition hover:bg-white/70 md:px-6 ${index % 2 === 1 ? "md:border-l md:border-slate-200" : ""} ${index > 1 ? "border-t border-slate-200" : ""}`}
            >
              <h3 className="font-display text-[1.2rem] font-bold text-slate-950">{service.title}</h3>
              <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">{service.copy}</p>
              <span className="mt-4 inline-flex text-sm font-semibold text-blue-600">Learn more →</span>
            </Link>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm leading-7 text-slate-500">{page.proofNote}</p>
        <Link className="text-link mt-6 inline-flex" href="/industries">
          ← All industries
        </Link>
      </section>

      <CTABand eyebrow={page.eyebrow} title={page.ctaTitle} />
    </div>
  );
}
