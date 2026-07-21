import type { Metadata } from "next";
import Link from "next/link";
import CTABand from "@/components/marketing/CTABand";
import { discoveryCallUrl, whatsappNumber } from "@/lib/services";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Enquiry received | Triumphant HQ",
  description:
    "Your project enquiry is with us. Book a discovery call or message us on WhatsApp while we review the details.",
  path: "/contact/thank-you",
  noIndex: true,
});

const nextSteps = [
  {
    number: "01",
    title: "We review your enquiry",
    copy: "Within one business day we assess fit, priorities and the clearest next conversation.",
  },
  {
    number: "02",
    title: "Book a time that works",
    copy: "Skip the wait—reserve a 30-minute discovery call now. Come with the problem, not a perfect brief.",
  },
  {
    number: "03",
    title: "Or message us directly",
    copy: "Prefer WhatsApp for a faster back-and-forth? Send context and we will respond as soon as we can.",
  },
];

export default function ContactThankYouPage() {
  return (
    <div>
      <header className="page-hero">
        <p className="eyebrow">Enquiry received</p>
        <h1>Thank you—your project details are with us.</h1>
        <p>
          We will review what you shared and reply within one business day. If you want to move faster, book a discovery
          call or message us on WhatsApp below.
        </p>
      </header>

      <section className="section-shell">
        <div className="grid gap-10 border-l border-blue-200/80 pl-6 sm:pl-8 lg:grid-cols-3 lg:border-l-0 lg:pl-0 lg:gap-8">
          {nextSteps.map((step) => (
            <div key={step.number} className="lg:border-l lg:border-blue-200/80 lg:pl-6">
              <span className="font-mono text-[0.7rem] font-bold tracking-[0.14em] text-blue-600">{step.number}</span>
              <h2 className="font-display mt-3 text-[1.2rem] font-bold tracking-[-0.025em] text-slate-950">
                {step.title}
              </h2>
              <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">{step.copy}</p>
            </div>
          ))}
        </div>

        <div className="button-row mt-12">
          <a className="button button-primary" href={discoveryCallUrl} target="_blank" rel="noreferrer">
            Book a discovery call
          </a>
          <a
            className="button button-secondary"
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Triumphant HQ — I just sent a project enquiry and would like to follow up.")}`}
            target="_blank"
            rel="noreferrer"
          >
            Message on WhatsApp
          </a>
          <Link className="button button-secondary" href="/work">
            Browse case studies
          </Link>
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <div className="mb-8 max-w-2xl">
            <p className="eyebrow">Pick a time</p>
            <h2 className="font-display mt-5 text-[clamp(1.7rem,3vw,2.4rem)] font-bold tracking-[-0.04em] text-slate-950">
              Schedule your discovery call now.
            </h2>
            <p className="mt-4 text-[1.02rem] leading-8 text-slate-600">
              Thirty minutes. No pressure. We clarify fit, priorities and the practical next step.
            </p>
          </div>
          <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white">
            <iframe
              title="Book a discovery call with Triumphant HQ"
              src={`${discoveryCallUrl}?embed=true`}
              className="h-[720px] w-full border-0"
              loading="lazy"
            />
          </div>
          <p className="mt-5 text-sm text-slate-500">
            Calendar not loading?{" "}
            <a className="font-semibold text-blue-600 hover:text-blue-800" href={discoveryCallUrl} target="_blank" rel="noreferrer">
              Open booking in a new tab
            </a>
            .
          </p>
        </div>
      </section>

      <CTABand
        eyebrow="While you wait"
        title="Explore how we approach websites, SEO, apps and automation."
        description="Or revisit your enquiry details anytime from Work With Us."
      />
    </div>
  );
}
