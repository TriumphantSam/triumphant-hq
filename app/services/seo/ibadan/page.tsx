import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CTABand from "@/components/marketing/CTABand";
import FaqSection from "@/components/marketing/FaqSection";
import LeadMagnetBand from "@/components/marketing/LeadMagnetBand";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { ibadanSeoFaqs, serviceLeadMagnets } from "@/lib/faqs";
import { buildPageMetadata, serviceJsonLd, webPageJsonLd } from "@/lib/seo";
import { projectEnquiryUrl, whatsappNumber } from "@/lib/services";

const path = "/services/seo/ibadan";
const title = "SEO in Ibadan | SEO Company & Local Experts · Triumphant";
const description =
  "SEO company in Ibadan on Basorun Rd since 2017: technical SEO, Google Business Profile, local pages and content for Oyo State businesses. Free snapshot.";

const offers = [
  "Local SEO and Google Business Profile optimisation",
  "Technical SEO audits and fixes",
  "On-page SEO, service pages and location pages",
  "Content and blog strategy",
  "Local citations and link building",
  "SEO-safe website redesigns and migrations",
  "AI-search readiness",
];

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path,
  keywords: [
    "SEO in Ibadan",
    "SEO Ibadan",
    "SEO company in Ibadan",
    "SEO expert Ibadan",
    "SEO services Ibadan",
    "SEO agency in Ibadan",
    "local SEO Ibadan",
  ],
});

const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Hello Triumphant HQ — I would like to talk about SEO for my Ibadan business.",
)}`;

export default function IbadanSeoPage() {
  return (
    <div>
      <JsonLd
        data={[
          webPageJsonLd({ name: title, description, path }),
          serviceJsonLd({
            name: "SEO in Ibadan",
            description,
            path,
            serviceType: "Search engine optimization",
            areaServed: [
              { "@type": "City", name: "Ibadan" },
              { "@type": "AdministrativeArea", name: "Oyo State" },
            ],
            offerNames: offers,
          }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "SEO", path: "/services/seo" },
          { name: "Ibadan", path },
        ]}
      />

      <header className="page-hero !pt-8">
        <p className="eyebrow">Ibadan · Oyo State</p>
        <h1>SEO company in Ibadan for businesses that want to be found on Google</h1>
        <p>
          Triumphant HQ is an Ibadan SEO company on Basorun Rd. Triumphant Technological Services has operated from
          here since 2017. We help Ibadan and Oyo State businesses fix the technical problems that keep a site out of
          Google, tidy the Google Business Profile so it matches the website, and publish pages that answer the
          searches their customers actually type.
        </p>
        <p className="mt-4 max-w-3xl text-[1.02rem] leading-8 text-slate-600">
          This is the Ibadan page. A programme for several Nigerian cities lives on{" "}
          <Link href="/services/seo" className="font-semibold text-blue-700 hover:text-blue-800">
            SEO company in Nigeria
          </Link>
          . The two pages are different jobs, and we keep them on different URLs so they do not compete with each
          other.
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
          src="/images/service-seo.png"
          alt="Laptop on a desk showing abstract search analytics in soft blue light"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>

      <section className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">What the work covers</p>
          <h2 className="font-display mt-4 text-[clamp(1.8rem,3vw,2.5rem)] font-bold tracking-[-0.04em] text-slate-950">
            SEO services we offer in Ibadan
          </h2>
          <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
            Most Ibadan sites we see are not short of slogans. They are short of a crawlable structure, a profile that
            matches the footer, and a page for each service people search for. The list below is the work we actually
            scope. We do not sell a package of guaranteed positions.
          </p>
        </div>

        <div className="mt-12 grid gap-10">
          <article>
            <h3 className="font-display text-xl font-bold text-slate-950">
              Local SEO and Google Business Profile optimisation
            </h3>
            <p className="mt-3 max-w-3xl text-[1.05rem] leading-8 text-slate-600">
              For a clinic, a school, a firm or a shop, the map result often matters more than a blue link. We align
              the profile name, category, services, photos and posts with the website, and we keep the name, address
              and phone identical to the site. The office address we publish is Basorun Rd, Ibadan 211107. We will not
              stuff “SEO Ibadan” into a business name, and we will not promise a place in the map pack. Reviews,
              proximity and the category Google already trusts all sit outside a single edit.
            </p>
          </article>
          <article>
            <h3 className="font-display text-xl font-bold text-slate-950">
              Technical SEO audits and fixes
            </h3>
            <p className="mt-3 max-w-3xl text-[1.05rem] leading-8 text-slate-600">
              We read the site the way a crawler does: which URLs are in the sitemap, which hosts answer, whether each
              page has one title, one description and one H1, and whether the important pages are linked from somewhere
              a person can click. The same pass covers WordPress, Wix, Shopify and Next.js. Findings are ranked so the
              first week is spent on what blocks indexing, not on a long list of preferences. You can see the shape of
              that work in the{" "}
              <Link href="/work/integrated-aerial-precision" className="font-semibold text-blue-700">
                Integrated Aerial Precision audit
              </Link>
              .
            </p>
          </article>
          <article>
            <h3 className="font-display text-xl font-bold text-slate-950">
              On-page SEO, service pages and location pages
            </h3>
            <p className="mt-3 max-w-3xl text-[1.05rem] leading-8 text-slate-600">
              A useful page names the service, says who it is for, explains the process, and answers the questions
              people ask before they call. We write that for your real services. We do not publish a doorway page for
              every Ibadan neighbourhood with the same paragraph and a swapped name. Neighbourhood pages on this site
              exist only where we actually do local-desk or agency work, and each of them points here rather than
              competing with this page.
            </p>
          </article>
          <article>
            <h3 className="font-display text-xl font-bold text-slate-950">Content and blog strategy</h3>
            <p className="mt-3 max-w-3xl text-[1.05rem] leading-8 text-slate-600">
              Articles should help the service page, not replace it. A checklist or a Maps guide can rank for an
              informational search and send the reader to the commercial page with a normal sentence. We plan a few
              pieces you can stand behind, then interlink them. The{" "}
              <Link href="/blog/seo-for-ibadan-local-businesses" className="font-semibold text-blue-700">
                local SEO checklist for Ibadan businesses
              </Link>{" "}
              and the{" "}
              <Link href="/blog/rank-google-maps-ibadan" className="font-semibold text-blue-700">
                Google Maps guide
              </Link>{" "}
              are the pattern: practical, and clearly not a second sales page.
            </p>
          </article>
          <article>
            <h3 className="font-display text-xl font-bold text-slate-950">
              Local citations and link building
            </h3>
            <p className="mt-3 max-w-3xl text-[1.05rem] leading-8 text-slate-600">
              Directories and local mentions matter when the name, address and phone match, and when the site being
              linked is the canonical one — https://triumphantech.com, not an old www or a forgotten domain. We will
              recommend listings that are relevant. We will not buy a package of links, and we will not ask you to
              drop the URL under other people’s posts. A credit on a client site, with their permission, is worth more
              than a dozen unrelated mentions.
            </p>
          </article>
          <article>
            <h3 className="font-display text-xl font-bold text-slate-950">
              SEO-safe website redesigns and migrations
            </h3>
            <p className="mt-3 max-w-3xl text-[1.05rem] leading-8 text-slate-600">
              A new site can wipe out the few URLs that were already being crawled. Before a redesign we list the URLs
              that should survive, map the redirects, and check Search Console after launch. If the current site is
              healthy, we say so. Rebuilding is a project, not a default.
            </p>
          </article>
          <article>
            <h3 className="font-display text-xl font-bold text-slate-950">
              AI-search readiness
            </h3>
            <p className="mt-3 max-w-3xl text-[1.05rem] leading-8 text-slate-600">
              Google’s AI Overviews and chat tools quote pages that state facts plainly: who you are, where you are,
              what you do, and what you will not claim. We use the same FAQs on the page and in the structured data,
              and we do not mark up reviews we do not have. Being easy to cite is a writing and structure job. It is
              not a switch we can flip.
            </p>
          </article>
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Fit</p>
            <h2 className="font-display mt-4 text-[clamp(1.8rem,3vw,2.5rem)] font-bold tracking-[-0.04em] text-slate-950">
              Who we help in Ibadan
            </h2>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              The work is built for organisations whose customers search before they visit or call: clinics and
              hospitals, schools, professional firms, estate agents, logistics operators, churches and NGOs, and
              technical businesses such as agritech and engineering teams. If your buyers never use Google, we will
              say that SEO is the wrong spend.
            </p>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              Day to day we work with people in Akobo, Bashorun, Bodija, Challenge, Ojoo and the rest of Ibadan, and
              with businesses elsewhere in Oyo State who are happy to deal with an Ibadan team. Those neighbourhoods
              already have their own pages for local support and agency contact. We are not opening a new URL for every
              estate in the city.
            </p>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              You can also reach the neighbouring notes for{" "}
              <Link href="/locations/bashorun" className="font-semibold text-blue-700">
                Bashorun
              </Link>
              ,{" "}
              <Link href="/locations/bodija" className="font-semibold text-blue-700">
                Bodija
              </Link>
              ,{" "}
              <Link href="/locations/akobo" className="font-semibold text-blue-700">
                Akobo
              </Link>{" "}
              and{" "}
              <Link href="/locations/oyo" className="font-semibold text-blue-700">
                Oyo State
              </Link>
              . Each of them links back here for search work.
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">Proof</p>
          <h2 className="font-display mt-4 text-[clamp(1.8rem,3vw,2.5rem)] font-bold tracking-[-0.04em] text-slate-950">
            Recent SEO work
          </h2>
          <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
            The example we can describe in detail is Integrated Aerial Precision, iaprecision.com. Triumphant HQ has
            managed the company’s website and SEO since July 2024. IAP is an agricultural drone business serving
            Nigeria, not an Ibadan high-street shop, so we are not going to pretend this case study is a map-pack win
            on Basorun Rd. It is the audit practice we use, delivered from this office.
          </p>
          <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
            On 9 September 2026 we produced a full SEO audit of the live site. The sitemap held 134 URLs. We logged 25
            findings, ranked by severity, each with evidence and a fix. The document also listed quick wins, a 30-day
            roadmap and Nigeria keyword clusters to aim content at. It did not claim rankings, traffic or revenue, and
            neither does this page.
          </p>
          {/* TODO(owner): add a verified result for iaprecision.com here only when you have a Search Console, index-coverage or Core Web Vitals figure you are willing to publish. Do not add estimates. */}
          <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
            The write-up, including what the crawl actually found, is on the{" "}
            <Link href="/work/integrated-aerial-precision" className="font-semibold text-blue-700">
              Integrated Aerial Precision case study
            </Link>
            . A separate published note covers technical SEO for{" "}
            <Link href="/work/dr-seyi-absolute-wellness" className="font-semibold text-blue-700">
              Dr Seyi Absolute Wellness
            </Link>
            . We have not added further client stories on this page.
          </p>
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">How the work runs</p>
            <h2 className="font-display mt-4 text-[clamp(1.8rem,3vw,2.5rem)] font-bold tracking-[-0.04em] text-slate-950">
              How our Ibadan SEO process works
            </h2>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              The sequence is ordinary on purpose. Week one is the free snapshot, then a fuller audit if the fit is
              real: indexation, titles, internal links, the Business Profile, and the few pages that should be earning
              the enquiry. Weeks two to four are the technical and on-page fixes, plus a clean-up of the profile so the
              name, address and phone agree with the site.
            </p>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              Months two and three are for the pages and articles that the audit showed were missing, and for
              citations that match the same address. After that, the monthly rhythm is a Search Console report: queries,
              pages, what we changed, and what we recommend next. If analytics is connected, we include the organic
              landing pages. We do not send a screenshot of a rank tracker and call it the work.
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-[clamp(1.6rem,2.6vw,2.1rem)] font-bold tracking-[-0.03em] text-slate-950">
              How much does SEO cost in Ibadan?
            </h2>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              We do not publish fees. The cost moves with the shape of the job: a one-off audit is not a redesign, and
              a redesign is not a monthly programme. It also moves with the number of pages, the state of the current
              site, and how contested the searches are. Two Ibadan clinics in the same specialty can need completely
              different first months.
            </p>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              After the snapshot we say which of those jobs you actually need, and we put the scope in writing before
              any work starts. If a directory or another agency publishes a naira range, that is their price, not ours.
            </p>
          </div>
          <div>
            <h2 className="font-display text-[clamp(1.6rem,2.6vw,2.1rem)] font-bold tracking-[-0.03em] text-slate-950">
              How long does SEO take?
            </h2>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              Technical wins — pages that can be crawled, titles that match the page, a profile that is no longer
              contradicting the footer — show up in weeks. Competitive phrases take months, and some never move if the
              page is weaker than what already ranks. We will not promise first position for “SEO in Ibadan” or for
              your own service terms.
            </p>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              What we will do is show the work and the Search Console record on a monthly call. If nothing is moving,
              the report should say so.
            </p>
          </div>
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <div className="max-w-3xl">
            <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] font-bold tracking-[-0.04em] text-slate-950">
              Why work with an SEO team based in Ibadan
            </h2>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              You can visit the office on Basorun Rd, in Bashorun, Ibadan. Message us before you come — we do not
              publish a street number, and a wasted trip helps no one. Most of the coordination is WhatsApp and a
              scheduled call, which is how Oyo State clients outside the city centre already work with us.
            </p>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              The same team builds websites. When a search problem is really a site problem — a platform that will not
              set a canonical, a sitemap that forgets the blog, a homepage that talks about a different business — we
              can fix it in the build instead of writing a recommendation and leaving. SEO is part of the site, not a
              report that sits beside it.
            </p>
            <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
              If your market is national rather than Ibadan, start at{" "}
              <Link href="/services/seo" className="font-semibold text-blue-700">
                SEO agency in Nigeria
              </Link>
              . For a first look without a call, use the{" "}
              <Link href="/seo-snapshot" className="font-semibold text-blue-700">
                free SEO snapshot
              </Link>{" "}
              or go straight to{" "}
              <Link href="/contact" className="font-semibold text-blue-700">
                contact
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="max-w-3xl">
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] font-bold tracking-[-0.04em] text-slate-950">
            What the free snapshot actually checks
          </h2>
          <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
            The snapshot is a first read, not a hundred-page deck. We look at whether the preferred host is the one
            that answers, whether the sitemap includes the pages you care about, whether those pages are linked from
            somewhere a person can click, and whether each of them has its own title. We also look at the Google
            Business Profile long enough to see if the name, category and phone agree with the site.
          </p>
          <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
            You get a short note of what is blocking visibility and what can wait. If the blocker is “this business
            does not get customers from Google”, we will say that. The snapshot does not start a retainer, and it
            does not come with a rank you can screenshot. From there you can stop, book a fuller audit, or send a
            brief for a defined project.
          </p>
          <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">
            Oyo State clients outside the city — Oyo town, and teams who only come into Ibadan for meetings — use the
            same sequence. The office is here. The calls are wherever you are. What changes is whether the Google
            Business Profile should talk about Ibadan specifically or about a wider service area you can justify.
          </p>
        </div>
      </section>

      <LeadMagnetBand magnet={serviceLeadMagnets.seo} />

      <FaqSection
        title="SEO in Ibadan: frequently asked questions"
        description="Cost, timing, Maps, visits and what we need from you — answered without a ranking promise."
        items={ibadanSeoFaqs}
      />

      <CTABand
        eyebrow="Ibadan SEO"
        title="Tell us which searches should be bringing in the work."
        description="A free snapshot, a WhatsApp message or a short brief is enough to start. We will say whether the next step is an audit, a fix, or not SEO at all."
      />
    </div>
  );
}
