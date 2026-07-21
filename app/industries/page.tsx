import type { Metadata } from "next";
import Link from "next/link";
import CTABand from "@/components/marketing/CTABand";
import { industries } from "@/lib/compare-industries";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Industries We Serve | Triumphant HQ Ibadan",
  description:
    "Digital systems for professional firms, SaaS teams and local service businesses in Ibadan and across Nigeria—plus a dedicated local support desk.",
  path: "/industries",
  keywords: ["industries Ibadan", "local service business SEO", "SaaS agency Nigeria"],
});

export default function IndustriesPage() {
  return (
    <div>
      <header className="page-hero">
        <p className="eyebrow">Industries</p>
        <h1>Sector-aware delivery for problems that look different on the ground.</h1>
        <p>
          The disciplines stay consistent. The emphasis shifts—credibility for firms, activation for SaaS, visibility and
          response speed for local services.
        </p>
      </header>

      <section className="section-shell">
        <div className="grid gap-0 border-y border-slate-200">
          {industries.map((page) => (
            <Link
              key={page.slug}
              href={`/industries/${page.slug}`}
              className="grid gap-3 border-b border-slate-200 py-8 transition hover:bg-slate-50/80 last:border-b-0 lg:grid-cols-[1.1fr_1fr_auto] lg:items-center"
            >
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-blue-600">{page.eyebrow}</p>
                <h2 className="font-display mt-3 text-[1.45rem] font-bold tracking-[-0.03em] text-slate-950">
                  {page.title}
                </h2>
              </div>
              <p className="text-[0.98rem] leading-7 text-slate-600">{page.description}</p>
              <span className="text-sm font-semibold text-blue-600">View industry →</span>
            </Link>
          ))}
        </div>

        <div className="mt-14 grid gap-6 border-l border-blue-200/80 pl-6 sm:pl-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow">Nigeria local desk</p>
            <h2 className="font-display mt-4 text-[clamp(1.6rem,2.8vw,2.2rem)] font-bold tracking-[-0.035em] text-slate-950">
              Need NIN, school portal or document help today?
            </h2>
            <p className="mt-3 max-w-xl text-[1.02rem] leading-8 text-slate-600">
              Our Local Support desk is built for essential digital tasks—separate from agency projects, optimised for
              WhatsApp-first assistance.
            </p>
          </div>
          <Link className="button button-primary" href="/local-support">
            Open Local Support
          </Link>
        </div>
      </section>

      <CTABand eyebrow="Not sure where you fit?" title="Describe the business problem. We will route you correctly." />
    </div>
  );
}
