import Image from "next/image";
import Link from "next/link";
import type { AgencyService } from "@/lib/services";
import { discoveryCallUrl } from "@/lib/services";
import CTABand from "./CTABand";
import SectionHeader from "./SectionHeader";
import ServiceIcon from "./ServiceIcon";

export default function ServiceLanding({ service }: { service: AgencyService }) {
  return (
    <div>
      <header className="page-hero">
        <div className="service-icon">
          <ServiceIcon name={service.icon} />
        </div>
        <p className="eyebrow">{service.eyebrow}</p>
        <h1>{service.title}</h1>
        <p>{service.description}</p>
        <div className="button-row mt-8">
          <a className="button button-primary" href={discoveryCallUrl} target="_blank" rel="noreferrer">
            Discuss your project
          </a>
          <Link className="button button-secondary" href="/contact">
            Send a project brief
          </Link>
        </div>
      </header>

      <div className="relative h-[42vw] min-h-[240px] max-h-[480px] w-full overflow-hidden">
        <Image
          src={service.image}
          alt={service.imageAlt}
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

      <section className="section-muted">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="agency-card">
              <p className="card-eyebrow">Business outcomes</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-950">What this engagement is designed to improve</h2>
              <ul className="check-list">
                {service.outcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="agency-card">
              <p className="card-eyebrow">Core deliverables</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-950">What the work can include</h2>
              <ul className="check-list">
                {service.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <SectionHeader
          eyebrow="Delivery process"
          title="A focused route from problem to measurable progress."
          description="The exact scope adapts to your needs, but every engagement follows a disciplined sequence."
        />
        <div className="grid gap-3 md:grid-cols-5">
          {service.process.map((step, index) => (
            <div className="rounded-2xl border border-slate-200 bg-white p-5" key={step}>
              <span className="font-mono text-xs font-bold text-blue-600">0{index + 1}</span>
              <h3 className="mt-4 font-bold text-slate-950">{step}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="eyebrow">Best fit</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-950">
                Is this right for your business?
              </h2>
              <p className="mt-4 leading-7 text-slate-600">{service.idealFor}</p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-white p-7">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Typical starting investment</p>
              <p className="mt-3 text-2xl font-extrabold text-blue-700">{service.startingPrice}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Final scope, timeline and investment are confirmed in a written proposal after discovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTABand
        eyebrow={service.shortTitle}
        title={`Let's turn your ${service.shortTitle.toLowerCase()} priority into a clear delivery plan.`}
      />
    </div>
  );
}
