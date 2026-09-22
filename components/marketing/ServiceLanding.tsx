import Image from "next/image";
import Link from "next/link";
import type { AgencyService } from "@/lib/services";
import { projectEnquiryUrl } from "@/lib/services";
import { serviceFaqs, serviceLeadMagnets } from "@/lib/faqs";
import { serviceJsonLd } from "@/lib/seo";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import CTABand from "./CTABand";
import DeliveryProcess from "./DeliveryProcess";
import FaqSection from "./FaqSection";
import LeadMagnetBand from "./LeadMagnetBand";
import NextStepPanel from "./NextStepPanel";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import ServiceIcon from "./ServiceIcon";

export default function ServiceLanding({
  service,
  h1,
  intro,
  localLinks,
}: {
  service: AgencyService;
  h1?: string;
  intro?: string;
  localLinks?: Array<{ href: string; label: string }>;
}) {
  const faqs = serviceFaqs[service.slug] ?? [];
  const magnet = serviceLeadMagnets[service.slug];
  const path = `/services/${service.slug}`;

  return (
    <div>
      <JsonLd
        data={serviceJsonLd({
          name: service.shortTitle,
          description: intro || service.description,
          path,
          serviceType: service.shortTitle,
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.shortTitle, path },
        ]}
      />

      <header className="page-hero !pt-8">
        <div className="service-icon">
          <ServiceIcon name={service.icon} />
        </div>
        <p className="eyebrow">{service.eyebrow}</p>
        <h1>{h1 ?? service.title}</h1>
        <p>{intro ?? service.description}</p>
        <p className="mt-4 max-w-2xl text-[1.02rem] leading-8 text-slate-600">
          Based in Ibadan, Oyo State, we deliver this work for organisations across Southwestern Nigeria and nationwide.
        </p>
        {(service.slug === "websites" || service.slug === "seo") && (
          <p className="mt-3 max-w-2xl text-[0.98rem] leading-7 text-slate-600">
            Looking specifically for Ibadan coverage?{" "}
            <Link
              href={`/services/${service.slug}/ibadan`}
              className="font-semibold text-[var(--accent-color)] hover:text-[var(--accent-hover)]"
            >
              {service.slug === "seo" ? "SEO agency in Ibadan" : "Website design in Ibadan"} →
            </Link>
          </p>
        )}
        <div className="button-row mt-8">
          <Link className="button button-primary" href={projectEnquiryUrl}>
            Discuss your project
            <span className="button-arrow" aria-hidden="true">→</span>
          </Link>
          {magnet ? (
            <Link className="button button-secondary" href={magnet.href}>
              {magnet.cta}
            </Link>
          ) : (
            <Link className="button button-secondary" href="/work">
              See client work
            </Link>
          )}
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

      {localLinks && localLinks.length > 0 ? (
        <section className="section-shell !pb-0">
          <Reveal className="max-w-3xl space-y-4 text-[1.05rem] leading-8 text-slate-600">
            <p>
              Triumphant HQ has operated from Ibadan since 2017. We work from Basorun Rd—not a city name added to a
              remote listing. Neighbourhoods across Oyo State are in reach, and we keep a separate Local Support desk
              for NIN and BVN so agency projects stay focused.
            </p>
            <p className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-blue-600">
              {localLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </p>
          </Reveal>
        </section>
      ) : null}

      <section className="section-muted">
        <div className="section-shell">
          <Reveal className="grid gap-6 lg:grid-cols-2" stagger>
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
          </Reveal>
        </div>
      </section>

      <section className="section-shell">
        <Reveal>
          <SectionHeader
            eyebrow="Delivery process"
            title="A focused route from problem to measurable progress."
            description="The exact scope adapts to your needs, but every engagement follows a disciplined sequence."
          />
        </Reveal>
        <Reveal delayMs={60}>
          <DeliveryProcess steps={service.process} />
        </Reveal>
      </section>

      {magnet ? (
        <div className="section-muted">
          <Reveal>
            <LeadMagnetBand magnet={magnet} />
          </Reveal>
        </div>
      ) : null}

      {faqs.length > 0 ? (
        <div className={magnet ? undefined : "section-muted"}>
          <Reveal>
            <FaqSection
              title="Questions teams usually ask before we start."
              description="Timeline, process, access and fit—answered plainly so you can decide with confidence."
              items={faqs}
            />
          </Reveal>
        </div>
      ) : null}

      <section className="section-muted">
        <div className="section-shell">
          <Reveal className="grid gap-8 lg:grid-cols-2" stagger>
            <div>
              <p className="eyebrow">Best fit</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-950">
                Is this right for your business?
              </h2>
              <p className="mt-4 leading-7 text-slate-600">{service.idealFor}</p>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                Serving Ibadan, Oyo State, Osun State and remote clients across Nigeria.{" "}
                <Link href="/locations" className="font-medium text-blue-600 hover:text-blue-800">
                  See service areas
                </Link>
                .
              </p>
              {localLinks && localLinks.length > 0 ? (
                <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-blue-600">
                  {localLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      {link.label}
                    </Link>
                  ))}
                </p>
              ) : null}
            </div>
            <NextStepPanel
              actions={
                magnet
                  ? [
                      { href: magnet.href, label: magnet.cta, variant: "primary" },
                      { href: "/contact", label: "Send a project brief", variant: "secondary" },
                    ]
                  : undefined
              }
            />
          </Reveal>
        </div>
      </section>

      <Reveal>
        <CTABand
          eyebrow={service.shortTitle}
          title={`Let's turn your ${service.shortTitle.toLowerCase()} priority into a clear delivery plan.`}
        />
      </Reveal>
    </div>
  );
}
