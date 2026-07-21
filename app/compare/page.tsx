import type { Metadata } from "next";
import Link from "next/link";
import CTABand from "@/components/marketing/CTABand";
import { comparisons } from "@/lib/compare-industries";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Agency vs Freelancer Guides | Triumphant HQ",
  description:
    "Practical decision guides for choosing between freelancers, agencies and specialist partners—written from an Ibadan-based delivery perspective.",
  path: "/compare",
  keywords: ["agency vs freelancer Nigeria", "hire agency Ibadan"],
});

export default function CompareIndexPage() {
  return (
    <div>
      <header className="page-hero">
        <p className="eyebrow">Comparison guides</p>
        <h1>Choose a delivery model with clear eyes.</h1>
        <p>
          High-intent decisions deserve frameworks—not rival bashing. These guides help you match the work to the right
          operating model.
        </p>
      </header>

      <section className="section-shell">
        <div className="grid gap-0 border-y border-slate-200">
          {comparisons.map((page) => (
            <Link
              key={page.slug}
              href={`/compare/${page.slug}`}
              className="grid gap-3 border-b border-slate-200 py-8 transition hover:bg-slate-50/80 last:border-b-0 lg:grid-cols-[1.2fr_1fr_auto] lg:items-center"
            >
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-blue-600">{page.eyebrow}</p>
                <h2 className="font-display mt-3 text-[1.45rem] font-bold tracking-[-0.03em] text-slate-950">
                  {page.title}
                </h2>
              </div>
              <p className="text-[0.98rem] leading-7 text-slate-600">{page.description}</p>
              <span className="text-sm font-semibold text-blue-600">Read guide →</span>
            </Link>
          ))}
        </div>
      </section>

      <CTABand
        eyebrow="Still deciding?"
        title="Tell us the challenge. We will help you pick the right model."
      />
    </div>
  );
}
