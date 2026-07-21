"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { whatsappNumber } from "@/lib/services";
import { formattedNapAddress, siteIdentity } from "@/lib/seo";

const ninServices = [
  "New NIN enrolment",
  "Data modification and corrections",
  "NIN slip printing",
  "Portal troubleshooting",
  "Consultation before you visit an enrolment centre",
];

const bvnServices = [
  { title: "BVN enrolment", copy: "Guided support for new Bank Verification Number registration." },
  { title: "BVN consultation", copy: "Clear advice on requirements, common errors and next steps." },
  { title: "BVN recovery", copy: "Help retrieving or resolving issues with an existing BVN record." },
  { title: "BVN card printing", copy: "Practical assistance with BVN card print requests where available." },
];

const schools = [
  "Government College, Ibadan (GCI)",
  "Queen's School, Ibadan",
  "Our Lady of Apostles Secondary Grammar School, Maryway, Odo-Ona, Ibadan",
];

const otherSupport = [
  {
    id: "education",
    title: "School and examination portals",
    summary: "JAMB, WAEC, NECO and related education services with patient, accurate assistance.",
    items: ["Profile and portal setup", "Registration support", "Result checking guidance", "Application troubleshooting"],
    message: "Hello Triumphant HQ — I need help with a school or exam portal.",
  },
  {
    id: "documents",
    title: "Documents and online applications",
    summary: "Everyday digital tasks where accuracy, speed and a clear outcome matter.",
    items: ["Typing and document formatting", "Printing and scanning", "Online form completion", "Email and account assistance"],
    message: "Hello Triumphant HQ — I need document or online application support.",
  },
];

const steps = [
  { number: "01", title: "Message us first", copy: "Tell us whether you need NIN, BVN or another service. We confirm requirements and timing." },
  { number: "02", title: "Prepare the essentials", copy: "Gather IDs, existing numbers, portal details or documents so the session is not delayed." },
  { number: "03", title: "Get guided support", copy: "We walk the process carefully—explaining each step instead of rushing blindly." },
  { number: "04", title: "Leave with clarity", copy: "You know what was completed, what is pending and any follow-up required." },
];

export default function LocalSupportExperience() {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const wa = (text: string) =>
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

  return (
    <div className="pb-24 lg:pb-0">
      <header className="page-hero !pb-10 !pt-8">
        <p className="eyebrow">Local support desk · Ibadan</p>
        <h1>NIN and BVN help you can trust—plus careful support for everyday digital tasks.</h1>
        <p>
          Certified ID Ecosystem training. Thousands of successful enrolments. WhatsApp-first assistance for Ibadan,
          Akobo, Bashorun and Oyo State—so you know what to bring before you arrive.
        </p>
        <div className="button-row mt-8">
          <a
            className="button button-primary"
            href={wa("Hello Triumphant HQ — I need NIN support.")}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp for NIN
          </a>
          <a
            className="button button-secondary"
            href={wa("Hello Triumphant HQ — I need BVN support.")}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp for BVN
          </a>
        </div>
      </header>

      <section className="section-shell !pt-0">
        <div className="grid gap-px overflow-hidden border border-slate-200 bg-slate-200 sm:grid-cols-3">
          {[
            ["3,000+", "People enrolled for NIN to date"],
            ["Hundreds", "Helped with modifications and corrections"],
            ["Certified", "NIMC ID Ecosystem Enrolment Process Training"],
          ].map(([title, copy]) => (
            <div key={title} className="bg-white px-6 py-8">
              <p className="font-display text-[clamp(1.8rem,3vw,2.4rem)] font-bold tracking-[-0.04em] text-slate-950">
                {title}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell !pt-0 !pb-0">
        <div className="grid gap-8 border-y border-slate-200 py-10 sm:grid-cols-3">
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-blue-600">Visit us</p>
            <p className="mt-3 text-[1.02rem] leading-7 text-slate-700">{formattedNapAddress}</p>
            <Link href="/locations" className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-800">
              Service areas →
            </Link>
          </div>
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-blue-600">WhatsApp first</p>
            <p className="mt-3 text-[1.02rem] leading-7 text-slate-700">
              Message before you visit so we confirm documents, timing and the right service path.
            </p>
            <a
              href={wa("Hello Triumphant HQ — I need local support in Ibadan.")}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {siteIdentity.phoneDisplay} →
            </a>
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
        </div>
      </section>

      {/* Primary NIN block */}
      <section id="nin" className="section-muted">
        <div className="section-shell">
          <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <p className="eyebrow">Primary service</p>
              <h2 className="font-display mt-5 text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold leading-[1.05] tracking-[-0.045em] text-slate-950">
                NIN enrolment and NIMC support
              </h2>
              <p className="mt-6 max-w-xl text-[1.08rem] leading-8 text-slate-600">
                This is our flagship local service. From first-time enrolment to modifications, corrections, slip
                printing and portal issues—we guide people carefully through the process.
              </p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {ninServices.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border-l border-blue-200/80 pl-4 text-[1.02rem] leading-7 text-slate-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-[1.25rem] border border-blue-200 bg-blue-50/70 p-6 sm:p-8">
                <p className="font-mono text-[0.7rem] font-bold tracking-[0.14em] text-blue-700">Track record</p>
                <p className="mt-3 text-[1.05rem] leading-8 text-slate-700">
                  More than <strong className="text-slate-950">3,000 people</strong> enrolled to date, plus consultation
                  and support for <strong className="text-slate-950">hundreds of modifications and corrections</strong>.
                </p>
                <a
                  className="button button-primary mt-7"
                  href={wa("Hello Triumphant HQ — I need NIN enrolment or modification support.")}
                  target="_blank"
                  rel="noreferrer"
                >
                  Message on WhatsApp about NIN
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-50">
                  <Image
                    src="/images/nimc-certificate.png"
                    alt="NIMC Certificate of Completion for Olayemi Adeyemi Samuel — ID Ecosystem Enrolment Process Training"
                    fill
                    className="object-contain object-center p-2"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                </div>
                <p className="mt-3 px-2 pb-1 text-center text-xs leading-5 text-slate-500">
                  Certificate of Completion — ID Ecosystem Enrolment Process Training (NIMC / ID4D), Nov 2024
                </p>
              </div>

              <div className="rounded-[1.25rem] border border-slate-200 bg-white p-6">
                <p className="font-mono text-[0.7rem] font-bold tracking-[0.14em] text-blue-600">Schools we have supported</p>
                <ul className="mt-4 space-y-3">
                  {schools.map((school) => (
                    <li key={school} className="text-[0.95rem] leading-7 text-slate-700">
                      {school}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BVN — editorial full-bleed */}
      <section id="bvn" className="relative overflow-hidden">
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
                "linear-gradient(105deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.92) 38%, rgba(255,255,255,0.55) 68%, rgba(255,255,255,0.28) 100%)",
            }}
          />
        </div>

        <div className="section-shell relative py-16 lg:py-20">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
            <div>
              <p className="eyebrow">Bank Verification Number</p>
              <h2 className="font-display mt-6 max-w-xl text-[clamp(2.1rem,4.2vw,3.4rem)] font-bold leading-[1.06] tracking-[-0.045em] text-slate-950">
                BVN help—enrolment to recovery—guided on WhatsApp.
              </h2>
              <p className="mt-6 max-w-lg text-[1.08rem] leading-8 text-slate-600">
                Tell us what you need. We will confirm requirements and walk you through the next step without the
                usual confusion.
              </p>
              <a
                className="button button-primary mt-10"
                href={wa("Hello Triumphant HQ — I need BVN enrolment, recovery or card printing support.")}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp for BVN support
              </a>
            </div>

            <div className="grid gap-8 border-l border-blue-300/70 pl-6 sm:pl-8">
              {bvnServices.map((item, index) => (
                <div key={item.title}>
                  <span className="font-mono text-[0.7rem] font-bold tracking-[0.14em] text-blue-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display mt-2 text-[1.2rem] font-bold tracking-[-0.025em] text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-[0.98rem] leading-7 text-slate-600">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">Additional local help</p>
            <h2 className="font-display mt-5 text-[clamp(1.7rem,3vw,2.4rem)] font-bold tracking-[-0.04em] text-slate-950">
              School portals and document support
            </h2>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {otherSupport.map((service) => (
              <article key={service.id} className="rounded-[1.25rem] border border-slate-200 bg-white p-6 sm:p-8">
                <h3 className="font-display text-[1.35rem] font-bold tracking-[-0.03em] text-slate-950">
                  {service.title}
                </h3>
                <p className="mt-3 text-[1.02rem] leading-7 text-slate-600">{service.summary}</p>
                <ul className="mt-5 space-y-2">
                  {service.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a className="button button-secondary mt-7" href={wa(service.message)} target="_blank" rel="noreferrer">
                  WhatsApp about this
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="font-display mt-5 text-[clamp(1.85rem,3.2vw,2.6rem)] font-bold tracking-[-0.04em] text-slate-950">
            A calm process for tasks that feel stressful.
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="border-l border-blue-200/80 pl-5">
              <span className="font-mono text-[0.7rem] font-bold tracking-[0.14em] text-blue-600">{step.number}</span>
              <h3 className="font-display mt-3 text-[1.15rem] font-bold tracking-[-0.02em] text-slate-950">{step.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-7 text-slate-600">{step.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow">Agency work is separate</p>
            <h2 className="font-display mt-4 text-[clamp(1.6rem,2.8vw,2.2rem)] font-bold tracking-[-0.035em] text-slate-950">
              Need a website, SEO or automation for your business?
            </h2>
            <p className="mt-3 max-w-xl text-[1.02rem] leading-8 text-slate-600">
              Local Support is our community desk for NIN, BVN and essential digital tasks. Growth systems live on the
              agency side.
            </p>
          </div>
          <Link className="button button-secondary" href="/services">
            Explore agency services
          </Link>
        </div>
      </section>

      <section className="section-shell">
        <div className="cta-band">
          <div>
            <p className="eyebrow">Check availability</p>
            <h2>Tell us if you need NIN or BVN help.</h2>
            <p>Send a short WhatsApp message. We will confirm the next step, documents and timing.</p>
          </div>
          <div className="button-row">
            <a className="button button-primary" href={wa("Hello Triumphant HQ — I need NIN support.")} target="_blank" rel="noreferrer">
              WhatsApp NIN
            </a>
            <a
              className="button button-secondary"
              href={wa("Hello Triumphant HQ — I need BVN support.")}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp BVN
            </a>
          </div>
        </div>
      </section>

      {showSticky ? (
        <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-xl lg:hidden">
          <a className="button button-primary !min-h-12 !px-3 !text-[0.68rem]" href={wa("Hello Triumphant HQ — I need NIN support.")} target="_blank" rel="noreferrer">
            WhatsApp NIN
          </a>
          <a className="button button-secondary !min-h-12 !px-3 !text-[0.68rem]" href={wa("Hello Triumphant HQ — I need BVN support.")} target="_blank" rel="noreferrer">
            WhatsApp BVN
          </a>
        </div>
      ) : null}
    </div>
  );
}
