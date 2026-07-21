import type { Metadata } from "next";
import ContactForm from "@/components/marketing/ContactForm";
import FaqSection from "@/components/marketing/FaqSection";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { contactFaqs } from "@/lib/faqs";
import { buildPageMetadata, formattedNapAddress, siteIdentity } from "@/lib/seo";
import { whatsappNumber } from "@/lib/services";

export const metadata: Metadata = buildPageMetadata({
  title: "Work With Us | Project Enquiry in Ibadan & Nigeria",
  description:
    "Contact Triumphant HQ in Ibadan for websites, SEO, apps and automation. Share your project context—we respond within one business day.",
  path: "/contact",
  keywords: [
    "contact Triumphant HQ",
    "website agency Ibadan contact",
    "SEO agency Oyo State",
    "project enquiry Nigeria",
  ],
});

export default function ContactPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Work With Us", path: "/contact" },
        ]}
      />

      <header className="page-hero !pt-8">
        <p className="eyebrow">Work with us</p>
        <h1 className="font-display">Tell us what the business needs to achieve.</h1>
        <p>
          Share the context, the challenge and where you want to get to. We will review your enquiry and respond with a
          practical next step within one business day.
        </p>
      </header>

      <section className="section-shell !pt-0">
        <div className="grid gap-8 border-y border-slate-200 py-10 sm:grid-cols-3">
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-blue-600">Visit</p>
            <p className="mt-3 text-[1.02rem] leading-7 text-slate-700">{formattedNapAddress}</p>
          </div>
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-blue-600">Email</p>
            <a
              href={`mailto:${siteIdentity.email}`}
              className="mt-3 block text-[1.02rem] font-medium text-slate-950 transition hover:text-blue-700"
            >
              {siteIdentity.email}
            </a>
          </div>
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-blue-600">Phone / WhatsApp</p>
            <a
              href={`tel:${siteIdentity.phoneE164}`}
              className="mt-3 block text-[1.02rem] font-medium text-slate-950 transition hover:text-blue-700"
            >
              {siteIdentity.phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Triumphant HQ — I have a project enquiry.")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block text-[0.95rem] font-medium text-blue-600 transition hover:text-blue-800"
            >
              Message on WhatsApp →
            </a>
          </div>
        </div>
      </section>

      <ContactForm />

      <div className="section-muted">
        <FaqSection
          title="Before you enquire—answers to common questions."
          description="Response time, briefing, remote delivery and what we need from your side."
          items={contactFaqs}
        />
      </div>
    </div>
  );
}
