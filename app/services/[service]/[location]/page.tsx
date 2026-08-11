import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CTABand from "@/components/marketing/CTABand";
import FaqSection from "@/components/marketing/FaqSection";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildPageMetadata,
  getServiceLocationPage,
  serviceJsonLd,
  serviceLocationPages,
} from "@/lib/seo";
import { discoveryCallUrl } from "@/lib/services";

type Params = { service: string; location: string };

export function generateStaticParams() {
  return serviceLocationPages.map((page) => ({
    service: page.serviceSlug,
    location: page.locationSlug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { service, location } = await params;
  const page = getServiceLocationPage(service, location);
  if (!page) return {};
  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: `/services/${page.serviceSlug}/${page.locationSlug}`,
    keywords: page.keywords,
  });
}

export default async function ServiceLocationPage({ params }: { params: Promise<Params> }) {
  const { service, location } = await params;
  const page = getServiceLocationPage(service, location);
  if (!page) notFound();

  const parentHref = `/services/${page.serviceSlug}`;
  const parentLabel = page.serviceSlug === "seo" ? "SEO" : "Websites";

  return (
    <div>
      <JsonLd
        data={serviceJsonLd({
          name: page.h1,
          description: page.description,
          path: `/services/${page.serviceSlug}/${page.locationSlug}`,
          serviceType: parentLabel,
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: parentLabel, path: parentHref },
          { name: "Ibadan", path: `/services/${page.serviceSlug}/${page.locationSlug}` },
        ]}
      />

      <header className="page-hero !pt-8">
        <p className="eyebrow">Ibadan · Oyo State</p>
        <h1>{page.h1}</h1>
        <p>{page.intro[0]}</p>
        <div className="button-row mt-8">
          <a className="button button-primary" href={discoveryCallUrl} target="_blank" rel="noreferrer">
            Book a discovery call
            <span className="button-arrow" aria-hidden="true">
              →
            </span>
          </a>
          <Link className="button button-secondary" href={parentHref}>
            Full {parentLabel.toLowerCase()} service
          </Link>
        </div>
      </header>

      <section className="section-shell">
        <div className="max-w-3xl space-y-5 text-[1.05rem] leading-8 text-slate-600">
          {page.intro.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <ul className="mt-12 grid gap-0 border-y border-slate-200 sm:grid-cols-2">
          {page.bullets.map((item, index) => (
            <li
              key={item}
              className={`border-slate-200 p-6 text-[1.02rem] leading-7 text-slate-700 ${index % 2 === 0 ? "sm:border-r" : ""} ${index > 1 ? "border-t" : ""}`}
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap gap-4 text-sm font-semibold text-blue-600">
          <Link href="/ibadan-tech-agency">How to choose a tech partner in Ibadan</Link>
          <Link href="/locations/ibadan">Ibadan service area</Link>
          <Link href="/local-support">Local NIN/BVN support</Link>
          <Link href="/seo-snapshot">Free SEO snapshot</Link>
        </div>
      </section>

      <FaqSection
        title={`Questions about ${parentLabel.toLowerCase()} in Ibadan`}
        description="Scope, fit and next steps—answered before you book a call."
        items={page.faqs}
      />

      <CTABand
        eyebrow={`${parentLabel} · Ibadan`}
        title={`Ready to improve your ${parentLabel.toLowerCase()} outcomes in Ibadan?`}
        description="Tell us what you need. We will recommend a clear next step—project, retainer or a free diagnostic where relevant."
      />
    </div>
  );
}
