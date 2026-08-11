import type { Metadata } from "next";
import Link from "next/link";
import CTABand from "@/components/marketing/CTABand";
import FaqSection from "@/components/marketing/FaqSection";
import Reveal from "@/components/marketing/Reveal";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildPageMetadata,
  entityDefinition,
  formattedNapAddress,
  serviceJsonLd,
  siteIdentity,
} from "@/lib/seo";
import { discoveryCallUrl, whatsappNumber } from "@/lib/services";

const faqs = [
  {
    question: "What is the best way to choose a tech company in Ibadan?",
    answer:
      "Look for clear scope, real proof (live work), local responsiveness, and a process you can follow. Ask who will do the work, how decisions are made, and how success is measured—not just a cheap quote.",
  },
  {
    question: "Is Triumphant HQ a technology company in Ibadan?",
    answer:
      "Yes. Triumphant HQ (Triumphant Technological Services) is based on Basorun Rd, Ibadan 211107, Oyo. We deliver websites, SEO, custom applications and automation, with a separate Local Support desk for NIN and BVN.",
  },
  {
    question: "Do you claim to be the number-one tech company in Ibadan?",
    answer:
      "No. “Best” is earned through fit, delivery quality and trust—not a self-awarded ranking. This page explains how to choose well and how we work when we are the right partner.",
  },
  {
    question: "What services do you offer for Ibadan businesses?",
    answer:
      "Website design and development, SEO, custom applications, automation, ongoing support retainers—and Local Support for NIN enrolment, modifications and BVN help.",
  },
  {
    question: "Can remote Nigerian companies work with you?",
    answer:
      "Yes. Agency work is delivered nationwide from Ibadan. Local Support for NIN/BVN is Ibadan-centred and WhatsApp-first.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Technology Company in Ibadan | How to Choose a Partner | Triumphant HQ",
  description:
    "Looking for a technology company or digital agency in Ibadan? Learn how to choose well—and how Triumphant HQ delivers websites, SEO, apps and automation from Oyo State.",
  path: "/ibadan-tech-agency",
  keywords: [
    "technology company in Ibadan",
    "best tech company in Ibadan",
    "digital agency Ibadan",
    "tech company Oyo State",
    "website design company Ibadan",
    "hire tech partner Ibadan",
  ],
});

export default function IbadanTechAgencyPage() {
  return (
    <div>
      <JsonLd
        data={serviceJsonLd({
          name: "Technology and growth services in Ibadan",
          description: entityDefinition,
          path: "/ibadan-tech-agency",
          serviceType: "Technology agency",
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Ibadan technology partner", path: "/ibadan-tech-agency" },
        ]}
      />

      <header className="page-hero !pt-8">
        <p className="eyebrow">Ibadan · Oyo State</p>
        <h1>How to choose a technology partner in Ibadan—and when Triumphant HQ is the right fit</h1>
        <p className="mt-5 max-w-3xl text-[1.08rem] leading-8 text-slate-600">
          {entityDefinition}
        </p>
        <div className="button-row mt-8">
          <a className="button button-primary" href={discoveryCallUrl} target="_blank" rel="noreferrer">
            Book a discovery call
            <span className="button-arrow" aria-hidden="true">
              →
            </span>
          </a>
          <Link className="button button-secondary" href="/work">
            See selected work
          </Link>
        </div>
      </header>

      <section className="section-shell">
        <Reveal className="max-w-3xl space-y-5 text-[1.05rem] leading-8 text-slate-600">
          <p>
            Searches like “best tech company in Ibadan” or “top digital agency Ibadan” usually mean something simpler:
            you need a partner who will ship, stay accountable, and understand local realities—without wasting months on
            vague strategy decks.
          </p>
          <p>
            Triumphant HQ has operated from Ibadan since {siteIdentity.foundingYear}. Our office NAP is{" "}
            <strong className="font-semibold text-slate-900">{formattedNapAddress}</strong>. We serve neighbourhoods
            across the city (including Akobo and Bashorun), Oyo State, Osun State, and remote clients nationwide.
          </p>
        </Reveal>

        <Reveal className="mt-16">
          <p className="eyebrow">Selection checklist</p>
          <h2 className="font-display mt-4 text-[clamp(1.7rem,3vw,2.4rem)] font-bold tracking-[-0.035em] text-slate-950">
            What separates a strong Ibadan tech partner from a risky hire
          </h2>
          <ol className="mt-10 grid gap-0 border-y border-slate-200 md:grid-cols-2">
            {[
              [
                "Proof you can verify",
                "Ask for live sites, case studies and a clear explanation of what changed—not only logos on a slide.",
              ],
              [
                "A real delivery process",
                "Discovery, scoped milestones, reviews and handover beat open-ended “we’ll figure it out” retainers.",
              ],
              [
                "Local responsiveness",
                "Ibadan businesses often need WhatsApp-speed answers and someone who understands Southwestern markets.",
              ],
              [
                "Honest fit",
                "A good agency declines work that is the wrong size or wrong problem. Pressure sales are a warning sign.",
              ],
              [
                "Technical + commercial clarity",
                "You need both: systems that work and messaging that helps customers act.",
              ],
              [
                "Separation of services",
                "NIN/BVN support is not the same as building your product. Keep desks clear so priorities stay clean.",
              ],
            ].map(([title, copy], index) => (
              <li
                key={title}
                className={`border-slate-200 p-6 md:p-8 ${index % 2 === 0 ? "md:border-r" : ""} ${index > 1 ? "border-t" : ""}`}
              >
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.14em] text-blue-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-3 text-xl font-bold text-slate-950">{title}</h3>
                <p className="mt-3 text-[0.98rem] leading-7 text-slate-600">{copy}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <Reveal>
            <p className="eyebrow">Why teams choose Triumphant HQ</p>
            <h2 className="font-display mt-4 max-w-2xl text-[clamp(1.7rem,3vw,2.4rem)] font-bold tracking-[-0.035em] text-slate-950">
              Four disciplines. One accountable partner based in Ibadan.
            </h2>
          </Reveal>
          <Reveal className="mt-10 grid gap-0 border-y border-slate-200 sm:grid-cols-2" stagger>
            {[
              {
                href: "/services/websites/ibadan",
                title: "Website design in Ibadan",
                copy: "Credible, conversion-minded websites for firms that need to look as serious as their work.",
              },
              {
                href: "/services/seo/ibadan",
                title: "SEO agency services",
                copy: "Technical health, local relevance and content systems so customers can find you.",
              },
              {
                href: "/services/app-development",
                title: "Custom applications",
                copy: "Purpose-built software when spreadsheets and generic tools stop scaling.",
              },
              {
                href: "/services/automation",
                title: "Automation",
                copy: "Practical workflows that reduce manual follow-up and operational drag.",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-slate-200 p-7 transition hover:bg-white sm:odd:border-r"
              >
                <h3 className="font-display text-xl font-bold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.copy}</p>
                <span className="mt-4 inline-flex text-sm font-semibold text-blue-600">Explore →</span>
              </Link>
            ))}
          </Reveal>
          <Reveal className="mt-10 flex flex-col gap-4 border-l border-blue-200/80 pl-6 sm:flex-row sm:items-center sm:justify-between sm:pl-8">
            <div>
              <p className="font-display text-xl font-bold text-slate-950">Need NIN or BVN help instead?</p>
              <p className="mt-2 text-slate-600">
                Our Local Support desk is separate from agency projects—WhatsApp-first, certified NIMC training.
              </p>
            </div>
            <div className="button-row">
              <Link className="button button-primary" href="/local-support">
                Local Support
              </Link>
              <a
                className="button button-secondary"
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Triumphant HQ — I need local support in Ibadan.")}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-shell">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Proof</p>
          <h2 className="font-display mt-4 text-[clamp(1.7rem,3vw,2.4rem)] font-bold tracking-[-0.035em] text-slate-950">
            Judge us by delivery, not slogans
          </h2>
          <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
            Review selected case studies, then talk through your situation on a discovery call. If we are not the right
            fit, we will say so early.
          </p>
          <div className="button-row mt-8">
            <Link className="button button-secondary" href="/work">
              Case studies
            </Link>
            <Link className="button button-secondary" href="/locations/ibadan">
              Ibadan service area
            </Link>
            <Link className="button button-secondary" href="/compare">
              Agency comparisons
            </Link>
          </div>
        </Reveal>
      </section>

      <FaqSection
        title="Questions people ask when hiring a tech company in Ibadan"
        description="Plain answers so you can decide with confidence—whether you hire us or someone else."
        items={faqs}
      />

      <CTABand
        eyebrow="Ibadan technology partner"
        title="Ready to talk about the next system your business needs?"
        description="Tell us what is slowing growth, delivery or visibility. We will help you identify the clearest next move."
      />
    </div>
  );
}
