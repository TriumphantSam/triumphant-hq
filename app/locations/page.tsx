import type { Metadata } from "next";
import Link from "next/link";
import CTABand from "@/components/marketing/CTABand";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { buildPageMetadata, locationPages, siteIdentity } from "@/lib/seo";
import { whatsappNumber } from "@/lib/services";

export const metadata: Metadata = buildPageMetadata({
  title: "Service Areas | Ibadan, Oyo, Osun & Nigeria | Triumphant HQ",
  description:
    "Triumphant HQ serves Ibadan neighbourhoods including Akobo and Bashorun, Oyo State, Osun State and clients across Nigeria with tech agency services and local NIN/BVN support.",
  path: "/locations",
  keywords: [
    "technology agency Ibadan",
    "NIN enrolment Akobo",
    "NIN Bashorun",
    "SEO Oyo State",
    "web design Osogbo",
    "digital support Nigeria",
  ],
});

export default function LocationsHubPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
        ]}
      />
      <header className="page-hero !pt-8">
        <p className="eyebrow">Service areas</p>
        <h1>Ibadan first. Southwestern Nigeria covered. Nationwide delivery.</h1>
        <p>
          Based at {siteIdentity.streetAddress}, {siteIdentity.addressLocality}, we serve neighbourhoods across the city,
          Oyo State, Osun State and remote clients throughout Nigeria.
        </p>
      </header>

      <section className="section-shell">
        <div className="grid gap-0 border-y border-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          {locationPages.map((location) => (
            <Link
              key={location.slug}
              href={`/locations/${location.slug}`}
              className="border-b border-slate-200 p-7 transition hover:bg-white sm:odd:border-r lg:[&:nth-child(3n)]:border-r-0 lg:border-r"
            >
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-blue-600">{location.region}</p>
              <h2 className="font-display mt-3 text-[1.4rem] font-bold tracking-[-0.03em] text-slate-950">
                {location.name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">{location.description}</p>
              <span className="mt-4 inline-flex text-sm font-semibold text-blue-600">View area →</span>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-l border-blue-200/80 pl-6 sm:flex-row sm:items-center sm:justify-between sm:pl-8">
          <div>
            <p className="font-display text-xl font-bold text-slate-950">Need NIN or BVN help locally?</p>
            <p className="mt-2 text-slate-600">Start on our Local Support desk—WhatsApp first.</p>
          </div>
          <div className="button-row">
            <Link className="button button-primary" href="/local-support">
              Local Support
            </Link>
            <a
              className="button button-secondary"
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Triumphant HQ — I need local support in my area.")}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <CTABand
        eyebrow="Not sure which page fits?"
        title="Tell us your location and what you need."
        description="We will route you to local support or the right agency service."
      />
    </div>
  );
}
