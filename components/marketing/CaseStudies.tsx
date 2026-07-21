import Image from "next/image";
import Link from "next/link";
import { caseStudies, type CaseStudy } from "@/lib/case-studies";

function CaseStudyTeaser({ study }: { study: CaseStudy }) {
  return (
    <Link
      href={`/work/${study.slug}`}
      className="group grid gap-5 border-t border-slate-200 py-8 transition first:border-t-0 first:pt-0 hover:opacity-95 sm:grid-cols-[140px_1fr] sm:items-center sm:gap-8"
    >
      <div className="relative flex h-16 items-center sm:h-20">
        <Image
          src={study.logo}
          alt={`${study.client} logo`}
          width={160}
          height={56}
          className="max-h-12 w-auto object-contain object-left sm:max-h-14"
        />
      </div>
      <div>
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-blue-600">{study.service}</p>
        <h3 className="font-display mt-2 text-[clamp(1.2rem,2vw,1.55rem)] font-bold tracking-[-0.03em] text-slate-950 group-hover:text-blue-700">
          {study.client}
        </h3>
        <p className="mt-2 max-w-2xl text-[0.98rem] leading-7 text-slate-600">{study.summary}</p>
        <span className="mt-4 inline-flex text-sm font-semibold text-blue-600">
          View case study <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}

function CaseStudyFull({ study, index }: { study: CaseStudy; index: number }) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col justify-between border-b border-slate-200 bg-[#f7f8fb] p-7 sm:p-9 lg:border-b-0 lg:border-r">
          <div>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.14em] text-blue-600">
              Case study {String(index + 1).padStart(2, "0")}
            </span>
            <div className="relative mt-8 flex h-14 items-center">
              <Image
                src={study.logo}
                alt={`${study.client} logo`}
                width={200}
                height={56}
                className="max-h-14 w-auto object-contain object-left"
              />
            </div>
            <p className="mt-8 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-slate-500">{study.service}</p>
            <h2 className="font-display mt-3 text-[clamp(1.55rem,2.8vw,2.1rem)] font-bold tracking-[-0.035em] text-slate-950">
              {study.title}
            </h2>
            <p className="mt-3 text-sm font-medium text-slate-500">
              {study.client} · {study.sector}
            </p>
            <p className="mt-5 text-[1.02rem] leading-8 text-slate-600">{study.summary}</p>
          </div>
          <Link className="button button-primary mt-8 self-start" href={`/work/${study.slug}`}>
            Read full case study
          </Link>
        </div>

        <div className="grid gap-0 p-7 sm:p-9">
          {[
            ["Problem", study.problem],
            ["Solution", study.solution],
            ["Outcome", study.outcome],
          ].map(([label, copy], i) => (
            <div
              key={label}
              className={`border-l border-blue-200/80 py-5 pl-5 ${i > 0 ? "border-t border-slate-100" : "pt-0"} ${i === 2 ? "pb-0" : ""}`}
            >
              <p className="font-mono text-[0.7rem] font-bold tracking-[0.14em] text-blue-600">{label}</p>
              <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function CaseStudies({
  limit,
  showHeader = true,
  teaser = false,
}: {
  limit?: number;
  showHeader?: boolean;
  teaser?: boolean;
}) {
  const studies = typeof limit === "number" ? caseStudies.slice(0, limit) : caseStudies;

  if (teaser) {
    return (
      <section className="section-shell">
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">Selected work</p>
            <h2 className="font-display mt-5 text-[clamp(1.7rem,3vw,2.4rem)] font-bold tracking-[-0.04em] text-slate-950">
              Recent outcomes for ambitious brands.
            </h2>
          </div>
          <Link className="text-link !mt-0 !pt-0 shrink-0" href="/work">
            See all case studies <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="border-y border-slate-200">
          {studies.map((study) => (
            <CaseStudyTeaser key={study.slug} study={study} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="section-shell">
      {showHeader ? (
        <div className="mb-10 max-w-2xl sm:mb-12">
          <p className="eyebrow">Selected work</p>
          <h2 className="font-display mt-5 text-[clamp(1.85rem,3.4vw,2.75rem)] font-bold tracking-[-0.04em] text-slate-950">
            Real projects. Clear problem, focused work, useful outcome.
          </h2>
        </div>
      ) : null}

      <div className="grid gap-8">
        {studies.map((study, index) => (
          <CaseStudyFull key={study.slug} study={study} index={index} />
        ))}
      </div>
    </section>
  );
}
