import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CTABand from "@/components/marketing/CTABand";
import ClientLogos from "@/components/marketing/ClientLogos";
import SectionHeader from "@/components/marketing/SectionHeader";
import ServiceIcon from "@/components/marketing/ServiceIcon";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { discoveryCallUrl, agencyServices } from "@/lib/services";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About Triumphant HQ | Technology Agency in Ibadan",
  description:
    "Meet Adeyemi Olayemi and Triumphant HQ—an Ibadan-based technology and growth agency for websites, SEO, custom apps and automation across Nigeria.",
  path: "/about",
  keywords: [
    "about Triumphant HQ",
    "technology agency Ibadan",
    "Adeyemi Olayemi",
    "web agency Nigeria",
  ],
});

const principles = [
  ["Clarity before complexity", "We define the real business problem before recommending technology or adding scope."],
  ["Execution over theatre", "Our work is judged by what launches, improves and remains useful after handover."],
  ["Close collaboration", "Clients stay informed through clear decisions, visible progress and direct communication."],
  ["Durable foundations", "We build with maintainability, performance and the next stage of growth in mind."],
];

const timeline = [
  ["2017", "Service roots", "Triumphant HQ began by helping people and local organisations navigate everyday digital services with care and reliability."],
  ["2021", "Growth capability", "Our work expanded into websites, search optimization and the systems businesses need to compete online."],
  ["2024", "Connected delivery", "Software engineering and automation became core capabilities, allowing us to solve operational as well as marketing challenges."],
  ["Today", "One agency partner", "We bring design, development, SEO and automation together around focused business outcomes."],
];

export default function AboutPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />
      <header className="page-hero !pt-8">
        <p className="eyebrow">About Triumphant HQ</p>
        <h1>Practical technology, delivered with ambition and accountability.</h1>
        <p>
          We are a multidisciplinary technology and growth agency based in Ibadan for organisations that need more than
          disconnected freelancers, generic templates or strategy that never becomes implementation.
        </p>
      </header>

      <section className="section-shell">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 sm:max-w-md lg:max-w-none">
            <Image
              src="/images/adeyemi-olayemi.png"
              alt="Adeyemi Olayemi, founder of Triumphant HQ"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
          </div>

          <div>
            <p className="eyebrow">About me</p>
            <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3.1rem)] font-bold leading-[1.08] tracking-[-0.045em] text-slate-950">
              Hi, I&apos;m Adeyemi Olayemi.
            </h2>
            <div className="mt-7 space-y-5 text-[1.05rem] leading-8 text-slate-600">
              <p>
                I spend my days at the intersection of technical website management, search engine optimization and
                building clean digital systems.
              </p>
              <p>
                For years, I&apos;ve watched businesses lose momentum not because their product was bad, but because their
                digital infrastructure was broken. Slow hosting, un-optimizable architectures, messy navigation and zero
                visibility on search engines turn high-intent clients away before they ever see the value on offer.
              </p>
              <p>
                That&apos;s why my approach is built on clarity, performance and execution. Whether it is migrating a legacy
                cPanel site to a modern edge-hosted framework like Vercel, structuring technical SEO campaigns for
                companies like Integrated Aerial Precision, or resolving visibility bottlenecks for wellness brands like
                Dr Seyi Absolute Wellness, I focus on what actually works.
              </p>
              <p>
                I don&apos;t just build websites or run campaigns; I build functional digital systems designed to make your
                business easier to find, easier to trust and easier to buy from.
              </p>
            </div>

            <div className="button-row mt-10">
              <a className="button button-primary" href={discoveryCallUrl} target="_blank" rel="noreferrer">
                Book a discovery call
              </a>
              <Link className="button button-secondary" href="/contact">
                Send a project brief
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow">Our story</p>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.05em] text-slate-950">
                Built from service, shaped by constant evolution.
              </h2>
            </div>
            <div className="space-y-5 text-[1.02rem] leading-8 text-slate-600">
              <p>
                Triumphant HQ started in 2017 with a simple operating principle: make technology useful, understandable
                and dependable for the person relying on it.
              </p>
              <p>
                As our clients&apos; needs evolved, so did our capabilities. Essential digital support led to websites.
                Websites led to search growth. Repetitive operational challenges led to custom software and automation.
              </p>
              <p>
                Today, we apply that same service mindset to higher-value digital work—helping ambitious teams present
                themselves credibly, create better customer experiences, build efficient operations and become easier to
                find.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-muted">
        <ClientLogos title="Organisations we have supported across healthcare, faith, AgTech and professional services." />
      </div>

      <section className="section-muted">
        <div className="section-shell">
          <SectionHeader
            eyebrow="Capabilities"
            title="Specialists where it matters. Connected where it counts."
            description="Our four disciplines share one strategy, one standard and one understanding of the result the business needs."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {agencyServices.map((service) => (
              <div className="agency-card" key={service.slug}>
                <div className="service-icon">
                  <ServiceIcon name={service.icon} />
                </div>
                <h3 className="font-bold text-slate-950">{service.shortTitle}</h3>
                <p className="card-copy text-sm">{service.promise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <SectionHeader eyebrow="How we operate" title="Principles that keep the work focused." />
        <div className="agency-grid">
          {principles.map(([title, copy], index) => (
            <article className="agency-card" key={title}>
              <span className="font-mono text-xs font-bold text-blue-600">0{index + 1}</span>
              <h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3>
              <p className="card-copy">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <SectionHeader eyebrow="2017 to present" title="A steady expansion of what we can solve." />
          <div className="grid gap-0 border-y border-slate-200 md:grid-cols-4">
            {timeline.map(([year, title, copy]) => (
              <article className="p-6 first:pl-0 last:pr-0 [&+&]:border-l [&+&]:border-slate-200" key={year}>
                <p className="text-sm font-extrabold text-blue-600">{year}</p>
                <h3 className="mt-4 font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        eyebrow="Work with Triumphant HQ"
        title="Want to talk about how we can fix your digital path?"
      />
    </div>
  );
}
