import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CTABand from "@/components/marketing/CTABand";
import NextStepPanel from "@/components/marketing/NextStepPanel";
import { caseStudies, getCaseStudy } from "@/lib/case-studies";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.client} Case Study | Triumphant HQ`,
    description: study.summary,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <div>
      <header className="page-hero">
        <p className="eyebrow">Case study</p>
        <div className="relative mt-8 flex h-14 items-center">
          <Image
            src={study.logo}
            alt={`${study.client} logo`}
            width={220}
            height={56}
            className="max-h-14 w-auto object-contain object-left"
            priority
          />
        </div>
        <h1 className="mt-8">{study.title}</h1>
        <p>
          {study.client} · {study.sector} · {study.service}
        </p>
      </header>

      <section className="section-shell pb-20">
        <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          <div className="space-y-12">
            {[
              ["The problem", study.problem],
              ["The solution", study.solution],
              ["The outcome", study.outcome],
            ].map(([label, copy]) => (
              <div key={label} className="border-l border-blue-200/80 pl-6 sm:pl-8">
                <p className="font-mono text-[0.7rem] font-bold tracking-[0.14em] text-blue-600">{label}</p>
                <p className="mt-4 text-[1.08rem] leading-8 text-slate-700">{copy}</p>
              </div>
            ))}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <NextStepPanel
              eyebrow="Similar challenge?"
              title="Tell us what is blocking visibility, speed or conversions."
              description="Share the context and we will help you identify the clearest next move—before any commitment to a full engagement."
            />
            <Link className="text-link mt-10 inline-flex" href="/work">
              ← All case studies
            </Link>
          </aside>
        </div>
      </section>

      <CTABand
        eyebrow="Work with us"
        title="Bring us the next digital challenge that needs clear execution."
      />
    </div>
  );
}
