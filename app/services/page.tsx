import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CTABand from "@/components/marketing/CTABand";
import NextStepPanel from "@/components/marketing/NextStepPanel";
import ProcessSteps from "@/components/marketing/ProcessSteps";
import SectionHeader from "@/components/marketing/SectionHeader";
import ServiceCard from "@/components/marketing/ServiceCard";
import Testimonials from "@/components/Testimonials";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { agencyServices } from "@/lib/services";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Technology & Growth Services in Ibadan | Triumphant HQ",
  description:
    "Website design, custom apps, SEO and AI automation from Triumphant HQ in Ibadan—serving Oyo State, Osun and businesses across Nigeria.",
  path: "/services",
  keywords: [
    "technology services Ibadan",
    "digital agency Oyo State",
    "web SEO automation Nigeria",
  ],
});

export default function ServicesPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
      />
      <header className="page-hero !pt-8">
        <p className="eyebrow">Agency services</p>
        <h1>Focused digital expertise, connected around your business.</h1>
        <p>
          Bring us the growth challenge, the operational friction or the idea that needs to become real. Based in
          Ibadan, we combine strategy and hands-on delivery across four core disciplines.
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
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-end lg:gap-16">
            <div>
              <p className="eyebrow">How we engage</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-950">Scope before certainty.</h2>
              <p className="mt-4 max-w-md leading-7 text-slate-600">
                Every engagement starts with a short discovery conversation. We clarify goals, constraints and priorities,
                then share a written proposal with timeline and deliverables before work begins.
              </p>
              <Link className="text-link mt-6 inline-flex" href="/ongoing-support">
                Looking for monthly ongoing support? <span aria-hidden="true">→</span>
              </Link>
            </div>
            <NextStepPanel
              title="Ready to talk through a project?"
              description="Bring the growth challenge, the operational friction or the idea that needs to become real. We will help you identify the clearest next move."
            />
          </div>
        </div>
      </section>

      <Testimonials />
      <CTABand />
    </div>
  );
}
