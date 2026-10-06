import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CTABand from "@/components/marketing/CTABand";
import FaqSection from "@/components/marketing/FaqSection";
import LeadMagnetBand from "@/components/marketing/LeadMagnetBand";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { serviceFaqs, serviceLeadMagnets } from "@/lib/faqs";
import { buildPageMetadata, serviceJsonLd, webPageJsonLd } from "@/lib/seo";
import { getAgencyService, projectEnquiryUrl, whatsappNumber } from "@/lib/services";

const service = getAgencyService("seo")!;
const path = "/services/seo";
const title = "SEO Company in Nigeria | SEO Agency Services · Triumphant HQ";
const description =
  "Nigerian SEO agency serving Lagos, Abuja, Ibadan and nationwide: technical SEO, migrations, content, local SEO and AI-search visibility. Free SEO snapshot.";

const offers = [
  "Technical SEO and site migrations",
  "Multi-city local SEO without doorway pages",
  "Content strategy and topical authority",
  "Digital PR and Nigerian link building",
  "E-commerce and B2B SEO",
  "SEO for new website builds",
  "AI search visibility",
];

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path,
  keywords: [
    "SEO company in Nigeria",
    "SEO agency Nigeria",
    "SEO services Nigeria",
    "SEO in Nigeria",
  ],
});

const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Hello Triumphant HQ — I would like to talk about SEO for my business in Nigeria.",
)}`;

export default function NigeriaSeoPage() {
  const faqs = serviceFaqs.seo ?? [];

  return (
    <div>
      <JsonLd
        data={[
          webPageJsonLd({ name: title, description, path }),
          serviceJsonLd({
            name: "SEO company in Nigeria",
            description,
            path,
            serviceType: "Search engine optimization",
            areaServed: [{ "@type": "Country", name: "Nigeria" }],
            offerNames: offers,
          }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "SEO", path },
        ]}
      />

      <header className="page-hero !pt-8">
        <p className="eyebrow">{service.eyebrow}</p>
        <h1>SEO agency in Nigeria for businesses that need search to bring in leads</h1>
        <p>
          Triumphant HQ is a Nigerian SEO agency based in Ibadan since 2017, delivering search work for businesses
          across the country. The headquarters is on Basorun Rd. The clients are not all in Ibadan, and this page is
          not an Ibadan page with the city name swapped out.
        </p>
        <p className="mt-4 max-w-3xl text-[1.02rem] leading-8 text-slate-600">
          Looking for SEO in Ibadan?{" "}
          <Link href="/services/seo/ibadan" className="font-semibold text-blue-700 hover:text-blue-800">
            Go to the Ibadan SEO company page
          </Link>
          . Use this page if you sell in more than one city, or if the search you care about is national.
        </p>
        <div className="button-row mt-8">
          <Link className="button button-primary" href="/seo-snapshot">
            Free SEO snapshot
            <span className="button-arrow" aria-hidden="true">
              →
            </span>
          </Link>
          <a className="button button-secondary" href={whatsappHref} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <Link className="button button-secondary" href={projectEnquiryUrl}>
            Send a brief
          </Link>
        </div>
      </header>

      <div className="relative h-[42vw] min-h-[240px] max-h-[420px] w-full overflow-hidden">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>

      <section className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">The market</p>
          <h2 className="font-display mt-4 text-[clamp(1.8rem,3vw,2.5rem)] font-bold tracking-[-0.04em] text-slate-950">
            What makes SEO in Nigeria different
          </h2>
          <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
            A lot of the people who will buy from you are on a phone, often on a connection that punishes a heavy page.
            Speed is not a score to boast about. It is whether the page opens before they give up and go back to
            WhatsApp. We treat mobile performance as part of the SEO job, and we do not recommend a design that only
            looks finished on a laptop.
          </p>
          <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
            Google is the search engine that matters for almost every brief we take. The intent is not the same in
            every city. A Lagos query, an Abuja query and an Ibadan query can share a service word and still mean a
            different kind of provider, a different budget and a different reason to trust you. One national page can
            explain the offer. It cannot pretend you have an office you do not have.
          </p>
          <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
            The enquiry usually lands on WhatsApp, not in a long form. Pages should make that next step obvious, and
            the form you do use should only ask for what you will actually read. Naira budgets are real constraints:
            we scope a first stage you can judge, instead of a retainer that assumes a foreign cost structure.
          </p>
          <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
            AI Overviews now show on some Nigerian queries. The practical response is the same as good on-page work:
            say who you are, where you work, and what the service includes, in sentences a person can check. We do not
            promise that a chat tool will cite you.
          </p>
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Services</p>
            <h2 className="font-display mt-4 text-[clamp(1.8rem,3vw,2.5rem)] font-bold tracking-[-0.04em] text-slate-950">
              Our SEO services for Nigerian businesses
            </h2>
          </div>
          <div className="mt-12 grid gap-10">
            <article>
              <h3 className="font-display text-xl font-bold text-slate-950">
                Technical SEO and site migrations
              </h3>
              <p className="mt-3 max-w-3xl text-[1.05rem] leading-8 text-slate-600">
                National sites collect years of URLs, hosts and half-finished redesigns. We start with what is
                indexable: the sitemap, the canonical host, titles, and internal links to the pages that should earn
                the enquiry. When a move is justified — WordPress to a modern build, or a host change — we map the
                redirects first. The Integrated Aerial Precision audit shows the level of evidence we write down
                before anyone calls a finding “fixed”.
              </p>
            </article>
            <article>
              <h3 className="font-display text-xl font-bold text-slate-950">
                Multi-city and multi-branch local SEO
              </h3>
              <p className="mt-3 max-w-3xl text-[1.05rem] leading-8 text-slate-600">
                If you genuinely operate in more than one city, each Google Business Profile should belong to that
                place, with its own photos and its own reviews. If you have one office, we will not manufacture city
                pages that repeat the same paragraph for Lagos, Abuja, Kano and Port Harcourt. That pattern looks like
                coverage and reads as a doorway site. Ibadan local SEO, for businesses whose customers are here, is
                handled on the{" "}
                <Link href="/services/seo/ibadan" className="font-semibold text-blue-700">
                  Ibadan page
                </Link>
                .
              </p>
            </article>
            <article>
              <h3 className="font-display text-xl font-bold text-slate-950">
                Content strategy and topical authority
              </h3>
              <p className="mt-3 max-w-3xl text-[1.05rem] leading-8 text-slate-600">
                A national site earns trust by covering the questions buyers ask — how long the work takes, what a
                migration involves, how Maps works in a specific city — and by linking those articles to one service
                page. We would rather publish fewer pieces that a specialist could sign than a blog that changes
                subject every week. Guides on this site, including the{" "}
                <Link href="/blog/rank-google-maps-ibadan" className="font-semibold text-blue-700">
                  Ibadan Maps guide
                </Link>
                , are written to support a service URL, not to replace it.
              </p>
            </article>
            <article>
              <h3 className="font-display text-xl font-bold text-slate-950">
                Digital PR and Nigerian link building
              </h3>
              <p className="mt-3 max-w-3xl text-[1.05rem] leading-8 text-slate-600">
                Links that help are the ones a real publisher or a real client chooses to add. With permission, a
                credit in a website footer is a straightforward one. A pitch to a Nigerian newsroom is slower and only
                worth it when there is a story. We do not sell link packages, and we do not recommend the directory
                listings that exist only to rent a ranking.
              </p>
            </article>
            <article>
              <h3 className="font-display text-xl font-bold text-slate-950">E-commerce and B2B SEO</h3>
              <p className="mt-3 max-w-3xl text-[1.05rem] leading-8 text-slate-600">
                A shop needs category pages that can be crawled and product URLs that do not multiply by accident. A
                B2B firm usually needs fewer pages and clearer ones: the service, the sector, and proof of the work.
                We will not paste the same description across a catalogue, and we will not hide thin products behind a
                blog.
              </p>
            </article>
            <article>
              <h3 className="font-display text-xl font-bold text-slate-950">SEO for new website builds</h3>
              <p className="mt-3 max-w-3xl text-[1.05rem] leading-8 text-slate-600">
                Search is cheaper to build in than to bolt on. Information architecture, titles, the sitemap and the
                contact path are part of the website project, not a second invoice that starts after launch. When we
                design the site, those pieces are in the scope from discovery.
              </p>
            </article>
            <article>
              <h3 className="font-display text-xl font-bold text-slate-950">AI search visibility</h3>
              <p className="mt-3 max-w-3xl text-[1.05rem] leading-8 text-slate-600">
                Assistants repeat what they can verify. Consistent naming — Triumphant Technological Services,
                Triumphant HQ, the city, the services — and FAQs that match the visible page give them less to invent.
                Structured data should confirm the page, not add a rating or a price the page does not show.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">Proof</p>
          <h2 className="font-display mt-4 text-[clamp(1.8rem,3vw,2.5rem)] font-bold tracking-[-0.04em] text-slate-950">
            The SEO case study we can account for
          </h2>
          <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
            Integrated Aerial Precision (iaprecision.com) is the engagement we use as the main proof. Triumphant HQ
            has managed the website and the SEO since July 2024. IAP sells agricultural drone services and equipment
            to a Nigerian market, with a large content and product site rather than a single local landing page.
          </p>
          <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
            The document we can stand behind is the 9 September 2026 SEO audit. It covered a 134-URL sitemap, recorded
            25 findings in severity order, and set out the evidence, the fix, a list of quick wins, a 30-day roadmap
            and keyword clusters for Nigerian drone searches. Those clusters were targets for content, not positions
            we claimed to hold. The audit also refused to invent traffic or Core Web Vitals numbers when the data was
            not there.
          </p>
          {/* TODO(owner): publish a result for Integrated Aerial Precision only after you have a figure from Search Console or a signed client note. Leave this comment until then. */}
          <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
            Read the{" "}
            <Link href="/work/integrated-aerial-precision" className="font-semibold text-blue-700">
              Integrated Aerial Precision case study
            </Link>{" "}
            for the findings in plain language. Other work sits on the{" "}
            <Link href="/work" className="font-semibold text-blue-700">
              work
            </Link>{" "}
            index, including the existing note on Dr Seyi Absolute Wellness. We are not adding client names here that
            we cannot describe.
          </p>
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <div className="max-w-3xl">
            <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] font-bold tracking-[-0.04em] text-slate-950">
              Engagement options
            </h2>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              Three shapes cover almost every brief. A one-off SEO audit is a written set of findings, ranked, with
              the evidence and the fix — the same structure as the IAP audit. A migration or rebuild project is a
              fixed scope: URLs, redirects, templates, and a check in Search Console after launch. A monthly programme
              is the ongoing list of technical work, pages and reporting.
            </p>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              We do not print a fee on this page. The proposal comes after we know which of the three you need. You
              can compare that with a{" "}
              <Link href="/ongoing-support" className="font-semibold text-blue-700">
                support retainer
              </Link>{" "}
              if the need is care and small improvements rather than a search programme.
            </p>
            <h2 className="font-display mt-12 text-[clamp(1.8rem,3vw,2.5rem)] font-bold tracking-[-0.04em] text-slate-950">
              How we report
            </h2>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              Once a month we walk through Search Console: queries, pages, and coverage issues that are still open.
              Where the client uses GA4, we add organic landing-page sessions. The call is short. The shared list of
              next actions is the part that matters — what is in progress, what is blocked on access, and what we are
              not doing.
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="max-w-3xl">
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] font-bold tracking-[-0.04em] text-slate-950">
            Where we work
          </h2>
          <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
            The office is in Ibadan, Oyo State. Lagos, Abuja and Port Harcourt engagements are remote. So is work for
            businesses in{" "}
            <Link href="/locations/osogbo" className="font-semibold text-blue-700">
              Osogbo
            </Link>{" "}
            and{" "}
            <Link href="/locations/ife" className="font-semibold text-blue-700">
              Ile-Ife
            </Link>
            . We are glad to say that plainly: a national SEO company with one headquarters is a normal Nigerian
            firm, not a network of empty city pages.
          </p>
          <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
            Ibadan and Oyo State search programmes start at{" "}
            <Link href="/services/seo/ibadan" className="font-semibold text-blue-700">
              SEO in Ibadan
            </Link>
            . The{" "}
            <Link href="/locations/nigeria" className="font-semibold text-blue-700">
              Nigeria location page
            </Link>{" "}
            covers the wider technology practice — websites, applications and automation — and does not compete with
            this URL for search terms.
          </p>
          <ul className="check-list mt-8">
            {service.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <div className="max-w-3xl">
            <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] font-bold tracking-[-0.04em] text-slate-950">
              What a first audit contains
            </h2>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              A national site usually fails in a few repeatable ways: more than one host answering, a sitemap that
              omits the pages that earn the enquiry, titles copied from a template, and internal links that never
              reach the service. The audit we write lists those findings with the evidence — what the crawler
              returned — and a fix. Severity is the order, so the first week is not spent on a typo while the
              canonical host is still split.
            </p>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              The Integrated Aerial Precision audit is the pattern: an inventory of the sitemap, findings ranked from
              the ones that block indexing down to the ones that can wait, a short list of quick wins, and a 30-day
              order of work. Keyword groups, when we include them, are labelled as targets for pages. They are not
              presented as rankings. If a measurement tool fails, the audit says the figure is unverified.
            </p>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              After that document, the project is whichever piece you choose to fund. Some clients stop at the audit
              and implement it themselves. Some want the redirects and the template fixes done. Some want a monthly
              list. We do not treat the audit as a down payment you did not agree to.
            </p>
            <h2 className="font-display mt-12 text-[clamp(1.8rem,3vw,2.5rem)] font-bold tracking-[-0.04em] text-slate-950">
              Industries, only where we can point at the work
            </h2>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              The engagement we can describe is agritech: Integrated Aerial Precision, a Nigerian drone business whose
              site carries products, reports and a large blog. The published wellness note is Dr Seyi Absolute
              Wellness, a technical SEO pass on an existing site. Both are linked from the work index. We also build
              for professional firms, schools, clinics and operators when the brief is real — that is who the service
              is for, not a list of logos we are willing to narrate without a page behind them.
            </p>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              If your buyers are in Ibadan and the map pack matters more than a national phrase, do not start here.
              Start on the Ibadan page, where the address, the neighbourhoods and the Business Profile work are the
              point. This page stays national so the two URLs are not the same article with a different city in the
              title.
            </p>
          </div>
        </div>
      </section>

      <LeadMagnetBand magnet={serviceLeadMagnets.seo} />

      <FaqSection
        title="SEO in Nigeria: frequently asked questions"
        description="Scope, cities, migrations, reporting and ownership — before you book a call."
        items={faqs}
      />

      <CTABand
        eyebrow="SEO in Nigeria"
        title="Bring the searches you want the business to be found for."
        description="We will tell you whether the next step is a snapshot, an audit, a migration, or a monthly programme — and whether Ibadan or a national scope fits."
      />
    </div>
  );
}
