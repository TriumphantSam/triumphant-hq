import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CTABand from "@/components/marketing/CTABand";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildPageMetadata,
  getLocationPage,
  locationPages,
  serviceJsonLd,
} from "@/lib/seo";
import { whatsappNumber } from "@/lib/services";

export function generateStaticParams() {
  return locationPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLocationPage(slug);
  if (!page) return {};
  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: `/locations/${page.slug}`,
    keywords: [
      `${page.name} NIN`,
      `${page.name} BVN`,
      `website design ${page.name}`,
      `SEO ${page.name}`,
      `digital support ${page.name}`,
      page.region,
    ],
  });
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getLocationPage(slug);
  if (!page) notFound();

  const nearby = page.nearby
    .map((nearSlug) => locationPages.find((item) => item.slug === nearSlug))
    .filter(Boolean);

  return (
    <div>
      <JsonLd
        data={serviceJsonLd({
          name: `Digital services in ${page.name}`,
          description: page.description,
          path: `/locations/${page.slug}`,
          serviceType: "Technology and local digital support",
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
          { name: page.name, path: `/locations/${page.slug}` },
        ]}
      />

      <header className="page-hero !pt-8">
        <p className="eyebrow">{page.region}</p>
        <h1>{page.h1}</h1>
        <p>{page.intro[0]}</p>
        <div className="button-row mt-8">
          <a
            className="button button-primary"
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello Triumphant HQ — I need support in ${page.name}.`)}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp for {page.name}
          </a>
          <Link className="button button-secondary" href="/contact">
            Agency project enquiry
          </Link>
        </div>
      </header>

      <section className="section-shell">
        <div className="max-w-3xl space-y-5 text-[1.05rem] leading-8 text-slate-600">
          {page.intro.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div className="border-l border-blue-200/80 pl-6 sm:pl-8">
            <p className="eyebrow">Local support in {page.name}</p>
            <h2 className="font-display mt-4 text-[1.6rem] font-bold tracking-[-0.03em] text-slate-950">
              NIN, BVN and everyday digital help
            </h2>
            <ul className="mt-6 space-y-3">
              {page.localFocus.map((item) => (
                <li key={item} className="text-[1.02rem] leading-7 text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
            <Link className="text-link mt-8 inline-flex" href="/local-support">
              Open Local Support desk <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="border-l border-blue-200/80 pl-6 sm:pl-8">
            <p className="eyebrow">Agency services for {page.name}</p>
            <h2 className="font-display mt-4 text-[1.6rem] font-bold tracking-[-0.03em] text-slate-950">
              Websites, SEO, apps and automation
            </h2>
            <ul className="mt-6 space-y-3">
              {page.agencyFocus.map((item) => (
                <li key={item} className="text-[1.02rem] leading-7 text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-blue-600">
              <Link href="/services/websites">Websites</Link>
              <Link href="/services/seo">SEO</Link>
              <Link href="/services/app-development">Apps</Link>
              <Link href="/services/automation">Automation</Link>
            </div>
          </div>
        </div>
      </section>

      {nearby.length > 0 ? (
        <section className="section-muted">
          <div className="section-shell">
            <p className="eyebrow">Nearby areas</p>
            <h2 className="font-display mt-4 text-[1.6rem] font-bold text-slate-950">Also serving around {page.name}</h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {nearby.map((item) =>
                item ? (
                  <Link
                    key={item.slug}
                    href={`/locations/${item.slug}`}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                  >
                    {item.name}
                  </Link>
                ) : null,
              )}
            </div>
          </div>
        </section>
      ) : null}

      <CTABand
        eyebrow={page.name}
        title={`Ready to talk about your next step in ${page.name}?`}
        description="Message us on WhatsApp for local support, or send a project enquiry for agency work."
      />
    </div>
  );
}
