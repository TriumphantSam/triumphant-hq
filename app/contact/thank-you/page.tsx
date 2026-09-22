import type { Metadata } from "next";
import Link from "next/link";
import { whatsappNumber } from "@/lib/services";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Enquiry received | Triumphant HQ",
  description:
    "Your project enquiry is with us. We will reply within one business day; you can also message us on WhatsApp.",
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
    title: "We reply with a next step",
    copy: "We will suggest a conversation or request any details needed to scope the work.",
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
          We will review what you shared and reply within one business day. If you want to add context now, message us on WhatsApp below.
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
          <a
            className="button button-primary"
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

    </div>
  );
}
