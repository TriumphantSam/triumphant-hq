export type ClientLogo = {
  name: string;
  sector: string;
  logo: string;
  invertOnDark?: boolean;
};

export const clientLogos: ClientLogo[] = [
  {
    name: "Integrated Aerial Precision",
    sector: "AgTech / drones",
    logo: "/images/clients/integrated-aerial-precision.png",
  },
  {
    name: "Dr Seyi Absolute Wellness",
    sector: "Wellness",
    logo: "/images/clients/dr-seyi-absolute-wellness.png",
  },
  {
    name: "Eternal Life Global Community Church",
    sector: "Faith / community",
    logo: "/images/clients/eternal-life-church.png",
  },
  {
    name: "Black MD",
    sector: "Healthcare",
    logo: "/images/clients/black-md.png",
  },
  {
    name: "Echitech",
    sector: "Engineering / tech",
    logo: "/images/clients/echitech.png",
  },
  {
    name: "Metropolitan Family Hospital",
    sector: "Hospital",
    logo: "/images/clients/metropolitan-family-hospital.png",
  },
  {
    name: "Mercy Medical Clinic",
    sector: "Clinic",
    logo: "/images/clients/mercy-medical-clinic.png",
  },
  {
    name: "Precision Field Academy",
    sector: "Training / AgTech",
    logo: "/images/clients/precision-field-academy.png",
  },
  {
    name: "Chicago SEO Company",
    sector: "Digital marketing",
    logo: "/images/clients/chicago-seo-company.png",
  },
];

export type CaseStudy = {
  slug: string;
  client: string;
  sector: string;
  service: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  outcome: string;
  logo: string;
  /** ISO date of the last substantive edit. Used as the sitemap lastmod. */
  updated: string;
  narrative?: Array<{ heading: string; paragraphs: string[] }>;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "integrated-aerial-precision",
    client: "Integrated Aerial Precision",
    sector: "Agricultural drone technology",
    service: "SEO audit and website management",
    title: "An SEO audit with evidence, fixes and a 30-day roadmap",
    summary:
      "Website and SEO care for Integrated Aerial Precision since July 2024, including the 9 September 2026 audit of iaprecision.com.",
    problem:
      "By September 2026 the live site was a large Next.js property — blog, products, reports and core pages — and the crawl showed uneven index foundations. The sitemap and the pages Google could already see were not the same set, and several templates had titles, headings and claims that a buyer could not check.",
    solution:
      "On 9 September 2026 TriumphantTech delivered a full SEO audit of https://www.iaprecision.com. It recorded what the crawler returned, ranked 25 findings by severity, and wrote the evidence and the fix for each one. Quick wins and a 30-day roadmap sat at the front so the first month had an order, not a pile.",
    // TODO(owner): add a verified iaprecision.com result (Search Console, index coverage or Core Web Vitals) only when you have the figure. Do not publish an estimate, ranking or testimonial.
    outcome:
      "The deliverable is the audit itself: a sitemap inventory, a severity-ranked finding list, quick wins, a four-week roadmap and Nigeria keyword clusters marked as content targets. This page does not add rankings, traffic, revenue or a client quotation.",
    logo: "/images/clients/integrated-aerial-precision.png",
    updated: "2026-10-06",
    narrative: [
      {
        heading: "What we are responsible for",
        paragraphs: [
          "TriumphantTech has managed the Integrated Aerial Precision website and SEO since July 2024. IAP is an agricultural drone company. The public site, iaprecision.com, sells services and equipment to a Nigerian market and carries a large blog and product catalogue. The work described here is that engagement, not a local-pack result for an Ibadan shop.",
          "Older notes on this site described a move away from a rigid cPanel setup. The 9 September 2026 audit is the document we can cite line by line, so this page follows the audit rather than adding speed or traffic claims the audit did not measure.",
        ],
      },
      {
        heading: "What the 9 September 2026 audit looked at",
        paragraphs: [
          "The audit was technical, on-page, content and light off-page. The stack observed that day was Next.js, served through OpenNext, on Cloudflare, with images on a Sanity CDN. PageSpeed figures were left unverified because the PageSpeed API quota was exhausted. The write-up says so instead of inventing a score.",
          "The sitemap contained 134 URLs: about 106 blog posts, 17 product URLs plus the listing, 3 reports, and the core pages. Home, about, services, products, blog, events, contact, request-demo and resources were in the sitemap and returned HTTP 200. Several live templates were not in the sitemap at all: case studies, portfolio, PAAP, T100, and the privacy and terms pages. Some of those were already visible in Google site: queries, which is how an important URL becomes an orphan if the internal links ever thin out.",
          "Host and protocol were not consolidated. Checks during the audit found http, https://www and the apex https host all returning 200, with no single redirect to the host the canonical tag preferred. That splits signals between copies of the same pages.",
        ],
      },
      {
        heading: "How the 25 findings were organised",
        paragraphs: [
          "Each finding has an ID, a severity, an area, the evidence and a fix. The highest severity group covered the missing host redirects, homepage counters that rendered as “0+”, unsubstantiated percentage claims, and a dealer badge whose wording needed to match the actual agreement. The next group covered multiple H1s, sitemap gaps, broken or dirty blog URLs, title and social-image mismatches, no JSON-LD on the sampled pages, and thin or generic titles on key templates.",
          "Lower severities covered a visible typo, heavy source images, weak logo alt text, footer links that all pointed at one URL, a leaked internal path in robots.txt, and off-page mentions that were listed without pretending we had measured their link value. Backlink counts were marked unverified. That is the standard we want on our own pages as well: if a number was not measured, it is not published.",
        ],
      },
      {
        heading: "Quick wins and the 30-day roadmap",
        paragraphs: [
          "The quick-win list was the first week: force one host and HTTPS, stop the homepage counters rendering as zero, fix the typo, reduce the extra H1s, correct the badge wording, extend the sitemap, ship social images, and qualify claims that had no source. Search Console submission sat on that same list.",
          "The roadmap split the month into four weeks. Week one was trust and crawl hygiene. Week two was a title and description matrix plus Organization, LocalBusiness, Product, Article and breadcrumb structured data. Week three was a claims review and stronger case studies, only where a source existed. Week four was acquisition pages, internal links from the blog to services and products, image weight, and a fresh PageSpeed check with the score written down only after it was actually run.",
          "None of that is a result. It is the order of work the audit recommended. Publishing the plan is not the same as claiming each item is already done, and this page does not say that it is.",
        ],
      },
      {
        heading: "Keyword clusters, as targets",
        paragraphs: [
          "The audit closed with Nigeria keyword clusters for the content team: drone spraying, buying and dealer queries, farm mapping, crop intelligence, broadcasting and seeding, crop-specific problems, education and the PAAP programme, and brand searches around IAPrecision and Integrated Aerial Precision. They are targets for pages and internal links. The audit did not report a ranking for any of them, and we will not add one here.",
        ],
      },
    ],
  },
  {
    slug: "dr-seyi-absolute-wellness",
    client: "Dr Seyi Absolute Wellness Ltd",
    sector: "Wellness services",
    service: "Technical SEO & local visibility",
    title: "Fixing local search visibility and technical SEO",
    summary:
      "Technical SEO for Dr Seyi Absolute Wellness from TriumphantTech in Ibadan: site structure, metadata and pages aligned to local search.",
    problem:
      "Despite high-value wellness services, the brand had low digital visibility. High-intent local searchers could not reliably find landing pages when looking for wellness solutions.",
    solution:
      "We ran a deep technical SEO audit, restructured the site hierarchy, optimized metadata, fixed indexing errors and aligned page content with the language wellness clients were actually searching—the same local-visibility discipline we apply for Oyo State businesses.",
    outcome:
      "The published scope was a technical audit, a clearer hierarchy, metadata and indexing fixes, and pages written for the searches clients use. No traffic or ranking figure is published for this engagement.",
    logo: "/images/clients/dr-seyi-absolute-wellness.png",
    updated: "2026-08-11",
  },
  {
    slug: "ilu",
    client: "Ìlú",
    sector: "Business directory, Ibadan",
    service: "Directory, listing claims and payments",
    title: "A trusted-business directory for Ibadan",
    summary:
      "Ìlú is a trusted-business directory for Ibadan residents and local SMEs, with landmark-based directions, price guides, and pages in English, Yoruba and Pidgin. Live at https://ilu.ng since October 2026.",
    problem:
      "Ibadan residents and local SMEs need a directory they can check before paying a business. A listing has to show what was checked, when it was checked, and where the information came from.",
    solution:
      "TriumphantTech built Ìlú as a static site generated by a Python build script, with Google Places map pins, and published it on Cloudflare Workers. The site includes landmark-based directions, price guides, and pages in English, Yoruba and Pidgin. Business owners can claim a listing and upgrade to Verified or Featured. The build also includes the listing-claim system, Paystack payments, an admin dashboard behind Cloudflare Access, WhatsApp Cloud API automation, and an installable web app with security headers.",
    outcome:
      "Ìlú has been live at https://ilu.ng since October 2026, with 63 listings at launch. This page does not add traffic, revenue or a client quotation.",
    logo: "/images/clients/ilu.png",
    updated: "2026-10-26",
  },
  {
    slug: "chatstack",
    client: "ChatStack",
    sector: "WhatsApp tool comparison, Nigeria",
    service: "Comparison site and price tracker",
    title: "A neutral comparison of WhatsApp automation tools sold in Nigeria",
    summary:
      "ChatStack is an independent comparison and price tracker for WhatsApp automation tools sold in Nigeria, written for SMEs choosing a tool. Live at https://chatstack.pages.dev since October 2026.",
    problem:
      "Nigerian SMEs choosing a WhatsApp automation tool need a neutral list: vendor prices linked to a source, a naira cost, and a plain account of what Meta charges.",
    solution:
      "TriumphantTech built ChatStack as a Python static site on Cloudflare Pages. It lists 21 vendors with source-linked prices, a naira cost calculator that uses the CBN rate, a Meta pricing explainer, a price change log and a newsletter. Prices are rechecked weekly. The comparison is independent and does not recommend a vendor.",
    outcome:
      "ChatStack has been live at https://chatstack.pages.dev since October 2026. This page does not add traffic, revenue or a ranking of the tools.",
    logo: "/images/clients/chatstack.png",
    updated: "2026-10-26",
  },
  {
    slug: "oyo-candidate-tracker",
    client: "Oyo Candidate Tracker",
    sector: "Elections, Oyo State",
    service: "Source-linked candidate tracker",
    title: "A non-partisan tracker of candidates in Oyo State elections",
    summary:
      "The Oyo Candidate Tracker is a neutral, source-linked record of candidates in Oyo State elections, for voters and journalists. Live at https://oyovotes.pages.dev since October 2026.",
    problem:
      "Voters and journalists need the candidate lists for Oyo State elections in one place, each entry linked to its source, with wording that does not take a side.",
    solution:
      "TriumphantTech built the tracker as a Python static site on Cloudflare Pages. It lists 205 candidates from INEC final lists, plus 378 State House of Assembly candidates across 32 constituencies. The pages stay non-partisan: they do not endorse a party or a candidate.",
    outcome:
      "The tracker has been live at https://oyovotes.pages.dev since October 2026. The figures above are the lists published on the site. This page does not add turnout, polling or a party preference.",
    logo: "/images/clients/oyo-candidate-tracker.png",
    updated: "2026-10-26",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
