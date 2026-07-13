import type { Metadata } from "next";
import CTABand from "@/components/marketing/CTABand";
import SectionHeader from "@/components/marketing/SectionHeader";
import ServiceIcon from "@/components/marketing/ServiceIcon";
import { agencyServices } from "@/lib/services";

export const metadata: Metadata = {
  title: "About Triumphant HQ | Technology and Growth Agency",
  description: "Meet the multidisciplinary technology partner behind websites, custom applications, SEO and automation systems.",
};

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
      <header className="page-hero">
        <p className="eyebrow">About Triumphant HQ</p>
        <h1>Practical technology, delivered with ambition and accountability.</h1>
        <p>
          We are a multidisciplinary technology and growth agency for organisations that need more than disconnected
          freelancers, generic templates or strategy that never becomes implementation.
        </p>
      </header>

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
                Triumphant HQ started in 2017 with a simple operating principle: make technology useful, understandable and
                dependable for the person relying on it.
              </p>
              <p>
                As our clients&apos; needs evolved, so did our capabilities. Essential digital support led to websites.
                Websites led to search growth. Repetitive operational challenges led to custom software and automation.
              </p>
              <p>
                Today, we apply that same service mindset to higher-value digital work—helping ambitious teams present
                themselves credibly, create better customer experiences, build efficient operations and become easier to find.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <SectionHeader
          eyebrow="Capabilities"
          title="Specialists where it matters. Connected where it counts."
          description="Our four disciplines share one strategy, one standard and one understanding of the result the business needs."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {agencyServices.map((service) => (
            <div className="agency-card" key={service.slug}>
              <div className="service-icon"><ServiceIcon name={service.icon} /></div>
              <h3 className="font-bold text-slate-950">{service.shortTitle}</h3>
              <p className="card-copy text-sm">{service.promise}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell">
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
        </div>
      </section>

      <section className="section-shell">
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
      </section>

      <CTABand
        eyebrow="Work with Triumphant HQ"
        title="Bring us the challenge. We will help define the clearest way forward."
      />
    </div>
  );
}
