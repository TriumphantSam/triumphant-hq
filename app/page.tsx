import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import CaseStudies from "@/components/marketing/CaseStudies";
import ClientLogos from "@/components/marketing/ClientLogos";
import CTABand from "@/components/marketing/CTABand";
import ProcessSteps from "@/components/marketing/ProcessSteps";
import SectionHeader from "@/components/marketing/SectionHeader";
import ServiceCard from "@/components/marketing/ServiceCard";
import { agencyServices, whatsappNumber } from "@/lib/services";
import { buildPageMetadata, locationPages } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Technology Agency in Ibadan, Nigeria | Triumphant HQ",
  description:
    "Ibadan-based technology and growth agency for website design, SEO, custom applications and automation—plus certified NIN and BVN support across Oyo State and Nigeria.",
  path: "/",
  keywords: [
    "Triumphant HQ Ibadan",
    "technology agency Ibadan",
    "website design Oyo State",
    "SEO Nigeria",
    "NIN enrolment Ibadan",
  ],
});

const outcomes = [
  ["Credibility", "A sharper digital presence that reflects the quality of your work."],
  ["Efficiency", "Purpose-built systems that reduce friction for customers and teams."],
  ["Visibility", "Technical and content foundations that make demand easier to capture."],
];

const featuredLocations = locationPages.filter((page) =>
  ["ibadan", "akobo", "bashorun", "oyo", "osogbo", "nigeria"].includes(page.slug)
);

const localWa = (text: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />

      <section className="section-shell">
        <div className="proof-strip mb-16">
          {[
            ["Since 2017", "Continuous digital delivery"],
            ["Four disciplines", "One accountable partner"],
            ["Global standard", "Local responsiveness"],
          ].map(([title, copy]) => (
            <div className="proof-cell" key={title}>
              <strong>{title}</strong>
              <span>{copy}</span>
            </div>
          ))}
        </div>

        <SectionHeader
          eyebrow="What we do"
          title="One partner across the systems that power modern growth."
          description="Strategy only matters when customers can feel it and teams can run it. We connect design, engineering, visibility and automation into focused delivery."
        />
        <div className="agency-grid">
          {agencyServices.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/local-bvn-atmosphere.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.93) 40%, rgba(255,255,255,0.58) 72%, rgba(255,255,255,0.32) 100%)",
            }}
          />
        </div>
        <div className="section-shell relative">
          <div className="grid gap-12 py-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow">Local support desk</p>
              <h2 className="font-display mt-6 max-w-xl text-[clamp(2rem,3.8vw,3.1rem)] font-bold leading-[1.08] tracking-[-0.045em] text-slate-950">
                Need NIN or BVN help today?
              </h2>
              <p className="mt-5 max-w-lg text-[1.05rem] leading-8 text-slate-600">
                Our local desk supports NIN enrolment and modifications, BVN services, school portals and documents—
                separate from agency projects, WhatsApp-first, and backed by certified NIMC training.
              </p>
              <div className="button-row mt-9">
                <a
                  className="button button-primary"
                  href={localWa("Hello Triumphant HQ — I need NIN or BVN support.")}
                  target="_blank"
                  rel="noreferrer"
                >
                  Message on WhatsApp
                </a>
                <Link className="button button-secondary" href="/local-support">
                  Explore Local Support
                </Link>
              </div>
            </div>

            <div className="grid gap-7 border-l border-blue-200/80 pl-6 sm:pl-8">
              {[
                ["3,000+", "People enrolled for NIN to date"],
                ["NIN + BVN", "Enrolment, modifications, recovery and card printing"],
                ["Certified", "NIMC ID Ecosystem Enrolment Process Training"],
              ].map(([title, copy]) => (
                <div key={title}>
                  <p className="font-display text-[1.35rem] font-bold tracking-[-0.03em] text-slate-950">{title}</p>
                  <p className="mt-1.5 text-[0.95rem] leading-7 text-slate-500">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-muted">
        <ClientLogos />
      </div>

      <CaseStudies limit={2} teaser />

      <section className="section-muted">
        <div className="section-shell">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
            <div>
              <SectionHeader
                align="left"
                eyebrow="Built around outcomes"
                title="Technology should improve how your business is understood, found and run."
                description="We begin with the commercial problem, then choose the right combination of creative and technical work to solve it."
              />
              <div className="outcome-row mt-10">
                {outcomes.map(([title, copy], index) => (
                  <div className="outcome-item" key={title}>
                    <span>0{index + 1}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5] lg:min-h-[520px]">
              <Image
                src="/images/home-outcomes.png"
                alt="Modern workspace with a laptop open to a clean digital dashboard"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 48vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <SectionHeader
          eyebrow="How we work"
          title="A clear path from challenge to working solution."
          description="You stay close to the decisions that matter, without managing every technical detail."
        />
        <ProcessSteps />
      </section>

      <div className="section-muted">
        <Testimonials />
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/seo-snapshot.png"
            alt="Desk setup with search analytics visible on a laptop screen"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.9) 42%, rgba(255,255,255,0.55) 70%, rgba(255,255,255,0.35) 100%)",
            }}
          />
        </div>
        <div className="section-shell relative">
          <div className="grid gap-12 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow">Free SEO visibility snapshot</p>
              <h2 className="font-display mt-7 max-w-xl text-[clamp(2.1rem,4vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.045em] text-slate-950">
                Find the gaps limiting your search visibility.
              </h2>
              <p className="mt-6 max-w-lg text-[1.05rem] leading-8 text-slate-600">
                A practical first view of technical health, search signals and priority opportunities—without a retainer
                commitment.
              </p>
              <div className="mt-10">
                <Link className="button button-primary" href="/seo-snapshot">
                  Run my free snapshot
                </Link>
              </div>
            </div>

            <div className="grid gap-8 border-l border-blue-200/80 pl-6 sm:pl-8">
              {[
                {
                  number: "01",
                  title: "Technical health",
                  copy: "A clear read on crawlability, structure and foundational issues.",
                },
                {
                  number: "02",
                  title: "Visibility signals",
                  copy: "On-page cues that help search engines understand your offer.",
                },
                {
                  number: "03",
                  title: "Priority actions",
                  copy: "The few moves that matter first—not a wall of recommendations.",
                },
              ].map((item) => (
                <div key={item.number} className="relative">
                  <span className="font-mono text-[0.7rem] font-bold tracking-[0.14em] text-blue-600">
                    {item.number}
                  </span>
                  <h3 className="font-display mt-2 text-[1.15rem] font-bold tracking-[-0.025em] text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-[0.95rem] leading-7 text-slate-500">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="flex flex-col gap-8 border-y border-slate-200 py-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">Where we serve</p>
            <h2 className="font-display mt-4 text-[clamp(1.6rem,2.8vw,2.2rem)] font-bold tracking-[-0.035em] text-slate-950">
              Ibadan first. Southwestern Nigeria covered.
            </h2>
            <p className="mt-3 text-[1.02rem] leading-8 text-slate-600">
              Local support and agency delivery for neighbourhoods across the city, Oyo State, Osun State and remote
              clients nationwide.
            </p>
          </div>
          <Link className="text-link !mt-0 !pt-0 shrink-0" href="/locations">
            All service areas <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 pt-8">
          {featuredLocations.map((location) => (
            <Link
              key={location.slug}
              href={`/locations/${location.slug}`}
              className="text-[0.95rem] font-medium text-slate-600 transition hover:text-blue-700"
            >
              {location.name}
            </Link>
          ))}
        </div>
      </section>

      <CTABand />

      <section className="section-shell !pt-0">
        <div className="flex flex-col items-start justify-between gap-5 border-t border-slate-200 pt-10 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Learning and products</p>
            <p className="mt-2 text-[0.95rem] text-slate-600">
              Looking for Digital Forge, practical training or ready-to-use systems?
            </p>
          </div>
          <Link className="text-link !mt-0 !pt-0" href="/resources">
            Visit Resources <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
