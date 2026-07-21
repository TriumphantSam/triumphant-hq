import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CaseStudies from "@/components/marketing/CaseStudies";
import ClientLogos from "@/components/marketing/ClientLogos";
import CTABand from "@/components/marketing/CTABand";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { caseStudies } from "@/lib/case-studies";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Work & Case Studies | Triumphant HQ Ibadan",
  description:
    "Selected website, technical SEO and digital systems projects from Triumphant HQ in Ibadan for brands that needed clearer performance and visibility.",
  path: "/work",
  keywords: ["case studies Ibadan", "website projects Nigeria", "SEO portfolio Oyo State"],
});

export default function WorkPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
        ]}
      />
      <header className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/services-studio.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(247,248,251,0.92) 0%, rgba(247,248,251,0.88) 45%, rgba(247,248,251,0.97) 100%)",
            }}
          />
        </div>
        <div className="page-hero relative">
          <p className="eyebrow">Selected work</p>
          <h1>Projects shaped around a real business problem.</h1>
          <p>
            Each engagement starts with what was broken or missing—then moves through focused delivery to an outcome the
            organisation can feel.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-600">
            <span>
              <strong className="font-display text-2xl font-bold text-slate-950">{caseStudies.length}</strong>
              <span className="ml-2">featured case studies</span>
            </span>
            <span className="hidden h-8 w-px bg-slate-300 sm:block" />
            <span className="max-w-xs leading-6">Website rebuilds, technical SEO and visibility programmes.</span>
          </div>
        </div>
      </header>

      <div className="section-muted">
        <ClientLogos title="Organisations that trusted us with visibility, performance and delivery." />
      </div>

      <CaseStudies showHeader={false} />

      <section className="section-shell !pt-0">
        <div className="grid gap-6 rounded-[1.5rem] border border-slate-200 bg-white p-7 sm:grid-cols-[1fr_auto] sm:items-center sm:p-9">
          <div>
            <p className="eyebrow">Have a similar challenge?</p>
            <h2 className="font-display mt-3 text-[1.45rem] font-bold tracking-[-0.03em] text-slate-950">
              Tell us what is limiting speed, visibility or conversions.
            </h2>
          </div>
          <Link className="button button-primary" href="/contact">
            Start a project enquiry
          </Link>
        </div>
      </section>

      <CTABand
        eyebrow="Start a conversation"
        title="Have a similar challenge in your digital stack?"
        description="Tell us what is slowing growth, delivery or visibility. We will help you identify the clearest next move."
      />
    </div>
  );
}
