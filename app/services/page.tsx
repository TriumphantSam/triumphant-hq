import type { Metadata } from "next";
import Image from "next/image";
import CTABand from "@/components/marketing/CTABand";
import ProcessSteps from "@/components/marketing/ProcessSteps";
import SectionHeader from "@/components/marketing/SectionHeader";
import ServiceCard from "@/components/marketing/ServiceCard";
import Testimonials from "@/components/Testimonials";
import { agencyServices } from "@/lib/services";

export const metadata: Metadata = {
  title: "Technology and Growth Services | Triumphant HQ",
  description: "Website design, custom application development, SEO growth and AI automation for ambitious businesses.",
};

export default function ServicesPage() {
  return (
    <div>
      <header className="page-hero">
        <p className="eyebrow">Agency services</p>
        <h1>Focused digital expertise, connected around your business.</h1>
        <p>
          Bring us the growth challenge, the operational friction or the idea that needs to become real. We combine
          strategy and hands-on delivery across four core disciplines.
        </p>
      </header>

      <div className="relative h-[42vw] min-h-[240px] max-h-[480px] w-full overflow-hidden">
        <Image
          src="/images/services-studio.png"
          alt="Contemporary agency studio with monitors and soft architectural light"
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
          <SectionHeader
            eyebrow="Core capabilities"
            title="Choose a focused engagement or build a connected programme."
            description="Every service has a clear starting point, while our multidisciplinary model keeps design, engineering, search and operations aligned."
          />
          <div className="agency-grid">
            {agencyServices.map((service) => <ServiceCard detailed key={service.slug} service={service} />)}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <SectionHeader
          eyebrow="Engagement process"
          title="Senior thinking, practical communication and visible progress."
          description="We keep the process clear so you always know what is being solved, what comes next and where decisions are needed."
        />
        <ProcessSteps />
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="eyebrow">Pricing guidance</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-950">Scope before certainty.</h2>
              <p className="mt-4 max-w-md leading-7 text-slate-600">
                The figures shown are practical starting points, not generic packages. We confirm the right scope after a
                short discovery conversation and provide a written proposal before work begins.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {agencyServices.map((service) => (
                <div className="rounded-2xl border border-slate-200 bg-white p-5" key={service.slug}>
                  <p className="text-sm font-bold text-slate-950">{service.shortTitle}</p>
                  <p className="mt-2 text-sm font-semibold text-blue-700">{service.startingPrice}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-8">
            <p className="eyebrow">Ongoing SEO execution</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
              <p className="max-w-2xl leading-7 text-slate-600">
                For businesses ready to compound organic growth, monthly retainers cover technical improvements, content
                execution and accountable reporting.
              </p>
              <a className="button button-secondary" href="/api/services/retainer-subscription/checkout?plan=starter">Starter · ₦50k/mo</a>
              <a className="button button-primary" href="/api/services/retainer-subscription/checkout?plan=growth">Growth · ₦150k/mo</a>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
      <CTABand />
    </div>
  );
}
