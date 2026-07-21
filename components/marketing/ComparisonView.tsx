import Link from "next/link";
import CTABand from "@/components/marketing/CTABand";
import type { ComparisonPage } from "@/lib/compare-industries";

export default function ComparisonView({ page }: { page: ComparisonPage }) {
  return (
    <div>
      <header className="page-hero">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </header>

      <section className="section-shell">
        <div className="max-w-3xl space-y-5 text-[1.05rem] leading-8 text-slate-600">
          {page.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-14 overflow-x-auto border-y border-slate-200">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-5 pr-4 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-slate-500">Dimension</th>
                <th className="py-5 pr-4 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-slate-500">{page.columns[0]}</th>
                <th className="py-5 pr-4 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-slate-500">{page.columns[1]}</th>
                <th className="py-5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-blue-600">{page.columns[2]}</th>
              </tr>
            </thead>
            <tbody>
              {page.rows.map((row) => (
                <tr key={row.dimension} className="border-b border-slate-200 align-top">
                  <th className="py-5 pr-4 font-display text-[0.98rem] font-bold text-slate-950">{row.dimension}</th>
                  <td className="py-5 pr-4 text-[0.95rem] leading-7 text-slate-600">{row.freelancer}</td>
                  <td className="py-5 pr-4 text-[0.95rem] leading-7 text-slate-600">{row.agency}</td>
                  <td className="py-5 text-[0.95rem] leading-7 font-medium text-slate-800">{row.triumphanthq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell grid gap-10 lg:grid-cols-3">
          {[
            [page.whenLabels[0], page.whenFreelancer],
            [page.whenLabels[1], page.whenAgency],
            [page.whenLabels[2], page.whenUs],
          ].map(([title, items]) => (
            <div key={title as string} className="border-l border-blue-200/80 pl-6">
              <h2 className="font-display text-[1.2rem] font-bold tracking-[-0.025em] text-slate-950">{title as string}</h2>
              <ul className="mt-5 space-y-3">
                {(items as string[]).map((item) => (
                  <li key={item} className="text-[0.95rem] leading-7 text-slate-600">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <Link className="text-link" href="/compare">
          ← All comparison guides
        </Link>
      </section>

      <CTABand eyebrow="Choose with clarity" title={page.ctaTitle} description={page.ctaDescription} />
    </div>
  );
}
