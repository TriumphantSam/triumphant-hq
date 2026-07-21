import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CTABand from "@/components/marketing/CTABand";
import FaqSection from "@/components/marketing/FaqSection";
import NextStepPanel from "@/components/marketing/NextStepPanel";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { discoveryCallUrl } from "@/lib/services";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Ongoing Support & Retainers | Triumphant HQ Ibadan",
  description:
    "Monthly website care, SEO execution and automation support from Triumphant HQ in Ibadan—scoped after discovery for teams across Nigeria.",
  path: "/ongoing-support",
  keywords: [
    "website retainer Ibadan",
    "SEO support Nigeria",
    "ongoing digital support Oyo State",
  ],
});

const tracks = [
  {
    number: "01",
    title: "Website care",
    promise: "Keep the site fast, secure and current after launch.",
    includes: [
      "Performance and uptime checks",
      "Content and layout updates within agreed scope",
      "Dependency and security hygiene",
      "Priority support when something breaks",
    ],
    ideal: "Teams that launched a site and need a reliable owner for maintenance—not ad-hoc freelancers.",
  },
  {
    number: "02",
    title: "SEO growth",
    promise: "Compound visibility with disciplined monthly execution.",
    includes: [
      "Technical health monitoring",
      "On-page and content priorities",
      "Search opportunity follow-through",
      "Clear reporting on what moved and what is next",
    ],
    ideal: "Businesses with a proven offer that need steady organic progress, not a one-off audit PDF.",
  },
  {
    number: "03",
    title: "Automation & systems",
    promise: "Keep workflows reliable as tools and processes change.",
    includes: [
      "Monitoring for failed runs and brittle handoffs",
      "Small improvements to live automations",
      "Integration adjustments when your stack changes",
      "Documentation updates for the team",
    ],
    ideal: "Operators who already automated something important and cannot afford silent failure.",
  },
];

const rhythm = [
  {
    title: "Monthly priorities",
    copy: "We agree what matters this cycle—based on your goals, not a generic task list.",
  },
  {
    title: "Visible progress",
    copy: "You see what shipped, what is blocked and what we recommend next—without chasing updates.",
  },
  {
    title: "Flexible intensity",
    copy: "Capacity is scoped to your needs. Expand when growth accelerates; stay lean when it should.",
  },
  {
    title: "Clean exit",
    copy: "Documentation and handover stay current, so you are never trapped if priorities change.",
  },
];

const faqs = [
  {
    question: "Is this a fixed package with public pricing?",
    answer:
      "No. Ongoing support is scoped after a short discovery conversation. We confirm the track, capacity and deliverables in writing before any retainer begins—so you know exactly what you are buying.",
  },
  {
    question: "Can we combine website care and SEO?",
    answer:
      "Yes. Many clients run a connected programme. We keep the scope explicit so website maintenance and search execution do not blur into an undefined “bits and pieces” retainer.",
  },
  {
    question: "How is this different from hiring a freelancer on standby?",
    answer:
      "You get structured priorities, reporting and continuity across disciplines—not only reactive tickets when something breaks. We also stay close to the commercial goal behind the work.",
  },
  {
    question: "What is the minimum commitment?",
    answer:
      "We recommend a clear initial period so foundations can compound, then continue month-to-month once the rhythm is working. Exact terms are confirmed in the proposal.",
  },
  {
    question: "Do you only support sites you built?",
    answer:
      "Preferentially yes—because we know the stack. We can also take over carefully documented third-party builds after a technical review.",
  },
  {
    question: "How do we get started?",
    answer:
      "Book a discovery call or send a project enquiry. Share what is live today, what is breaking and what “better” should look like in 90 days.",
  },
];

export default function OngoingSupportPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Ongoing Support", path: "/ongoing-support" },
        ]}
      />
      <header className="page-hero !pt-8">
        <p className="eyebrow">Ongoing support</p>
        <h1>A clear monthly partner for what must keep working—and keep improving.</h1>
        <p>
          Launch is not the finish line. Ongoing support covers website care, SEO execution and automation
          reliability—scoped to your priorities, without public price theatre.
        </p>
        <div className="button-row mt-8">
          <a className="button button-primary" href={discoveryCallUrl} target="_blank" rel="noreferrer">
            Book a discovery call
          </a>
          <Link className="button button-secondary" href="/contact">
            Send a project brief
          </Link>
        </div>
      </header>

      <div className="relative h-[38vw] min-h-[220px] max-h-[420px] w-full overflow-hidden">
        <Image
          src="/images/home-outcomes.png"
          alt="Workspace representing ongoing digital systems and maintenance"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(247,248,251,0.55) 0%, transparent 28%, transparent 72%, rgba(247,248,251,0.7) 100%)",
          }}
        />
      </div>

      <section className="section-shell">
        <div className="max-w-2xl">
          <p className="eyebrow">Three tracks</p>
          <h2 className="font-display mt-5 text-[clamp(1.85rem,3.2vw,2.7rem)] font-bold tracking-[-0.04em] text-slate-950">
            Choose the ongoing work that matches the risk you cannot ignore.
          </h2>
        </div>

        <div className="mt-14 grid gap-0 border-y border-slate-200">
          {tracks.map((track, index) => (
            <article
              key={track.number}
              className={`grid gap-8 border-b border-slate-200 py-12 last:border-b-0 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 ${index === 0 ? "pt-10" : ""}`}
            >
              <div>
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.14em] text-blue-600">{track.number}</span>
                <h3 className="font-display mt-3 text-[clamp(1.5rem,2.6vw,2rem)] font-bold tracking-[-0.035em] text-slate-950">
                  {track.title}
                </h3>
                <p className="mt-3 text-[1.05rem] leading-8 text-slate-600">{track.promise}</p>
                <p className="mt-5 text-sm leading-7 text-slate-500">
                  <span className="font-semibold text-slate-700">Best for: </span>
                  {track.ideal}
                </p>
              </div>
              <div className="border-l border-blue-200/80 pl-6 sm:pl-8">
                <p className="font-mono text-[0.7rem] font-bold tracking-[0.14em] text-blue-600">Typically includes</p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {track.includes.map((item) => (
                    <li key={item} className="text-[0.98rem] leading-7 text-slate-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">How retainers work here</p>
            <h2 className="font-display mt-5 text-[clamp(1.85rem,3vw,2.6rem)] font-bold tracking-[-0.04em] text-slate-950">
              Structure without bureaucracy.
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {rhythm.map((item) => (
              <div key={item.title} className="border-l border-blue-200/80 pl-5">
                <h3 className="font-display text-[1.15rem] font-bold tracking-[-0.02em] text-slate-950">{item.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-7 text-slate-600">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow">Investment</p>
            <h2 className="font-display mt-5 text-[clamp(1.85rem,3.2vw,2.7rem)] font-bold tracking-[-0.04em] text-slate-950">
              Scope first. Numbers second.
            </h2>
            <p className="mt-5 max-w-lg text-[1.05rem] leading-8 text-slate-600">
              We do not publish one-size retainers. Capacity, stack complexity and reporting depth change the right
              investment. After discovery you receive a written proposal with inclusions, response expectations and
              what sits outside scope.
            </p>
          </div>
          <NextStepPanel
            eyebrow="Start ongoing support"
            title="Tell us what must stay healthy every month."
            description="Share the live systems, the pain points and the outcome you want in the next quarter. We will recommend the right track—or tell you a project is enough."
          />
        </div>
      </section>

      <div className="section-muted">
        <FaqSection
          title="Questions about monthly partnerships."
          description="Commitment, combining tracks and what happens if priorities change."
          items={faqs}
        />
      </div>

      <CTABand
        eyebrow="Ongoing support"
        title="Ready for a partner who stays after launch?"
        description="Book a discovery call. We will map the lightest retainer that still protects what matters."
      />
    </div>
  );
}
