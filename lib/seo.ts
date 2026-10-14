import type { Metadata } from "next";
import { absoluteCanonicalUrl } from "@/lib/canonical-host";

export const SITE_URL = "https://triumphantech.com";

export function publicSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
  if (fromEnv && fromEnv.trim()) return fromEnv.replace(/\/+$/, "");
  return SITE_URL;
}

export const siteIdentity = {
  brandName: "Triumphant HQ",
  legalName: "Triumphant Technological Services",
  email: "admin@triumphantech.com",
  phoneDisplay: "+234 810 771 1190",
  phoneE164: "+2348107711190",
  whatsapp: "2348107711190",
  streetAddress: "Basorun Rd",
  addressLocality: "Ibadan",
  addressRegion: "Oyo State",
  addressCountry: "NG",
  postalCode: "211107",
  geo: {
    latitude: 7.3775,
    longitude: 3.947,
  },
  foundingYear: 2017,
  /**
   * Public profiles supplied by the owner and linked from the footer and contact page.
   * LinkedIn, YouTube and Crunchbase stay off until a real URL is supplied.
   */
  profiles: [
    { label: "X", href: "https://x.com/Triumphanttech" },
    { label: "Instagram", href: "https://www.instagram.com/triumphant_tech/" },
    { label: "Facebook", href: "https://www.facebook.com/triumphanttech" },
    { label: "Google Maps", href: "https://maps.app.goo.gl/jaoU53B394QCti8q9" },
  ],
  mapsUrl: "https://maps.app.goo.gl/jaoU53B394QCti8q9",
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
    {
      days: ["Saturday"],
      opens: "10:00",
      closes: "14:00",
    },
  ],
  /**
   * Only set when a real public aggregate exists (e.g. GBP).
   * Leave null — never invent ratings.
   */
  aggregateRating: null as null | {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  },
};

export const serviceAreas = [
  { slug: "ibadan", name: "Ibadan", region: "Oyo State", type: "city" as const },
  { slug: "akobo", name: "Akobo", region: "Ibadan, Oyo State", type: "area" as const },
  { slug: "bashorun", name: "Bashorun", region: "Ibadan, Oyo State", type: "area" as const },
  { slug: "bodija", name: "Bodija", region: "Ibadan, Oyo State", type: "area" as const },
  { slug: "challenge", name: "Challenge", region: "Ibadan, Oyo State", type: "area" as const },
  { slug: "ojoo", name: "Ojoo", region: "Ibadan, Oyo State", type: "area" as const },
  { slug: "oyo", name: "Oyo", region: "Oyo State", type: "city" as const },
  { slug: "osogbo", name: "Osogbo", region: "Osun State", type: "city" as const },
  { slug: "ife", name: "Ile-Ife", region: "Osun State", type: "city" as const },
  { slug: "nigeria", name: "Nigeria", region: "Nationwide & remote", type: "country" as const },
];

export type LocationFaq = { question: string; answer: string };

export type LocationPage = {
  slug: string;
  name: string;
  region: string;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  localFocus: string[];
  agencyFocus: string[];
  nearby: string[];
  faqs: LocationFaq[];
};

export const locationPages: LocationPage[] = [
  {
    slug: "ibadan",
    name: "Ibadan",
    region: "Oyo State, Nigeria",
    title: "Technology Agency in Ibadan | NIN & BVN Support · Triumphant HQ",
    description:
      "Triumphant HQ in Ibadan offers website design, SEO, custom apps, automation, plus certified NIN enrolment and BVN support across Oyo State.",
    h1: "Technology agency in Ibadan—plus NIN and BVN support on Basorun Rd",
    intro: [
      "Triumphant HQ is an Ibadan-based technology and growth agency. We help businesses grow with websites, SEO, applications and automation—and we run a dedicated local desk for NIN, BVN and essential digital services.",
      "Whether you are in Bodija, Akobo, Bashorun, Challenge, Ojoo or elsewhere in the city, you can reach us for practical support and professional delivery.",
      "Since 2017 we have combined global-standard digital delivery with local responsiveness—serving organisations across Oyo State, Osun State and clients nationwide from our Basorun Rd base.",
    ],
    localFocus: [
      "NIN enrolment, modifications and slip printing in Ibadan",
      "BVN enrolment, consultation, recovery and card printing",
      "School and examination portal assistance for Ibadan families and schools",
    ],
    agencyFocus: [
      "Website design for Ibadan and Oyo State businesses",
      "SEO that helps local and national customers find you",
      "Custom applications and automation for growing teams",
    ],
    nearby: ["akobo", "bashorun", "bodija", "challenge", "ojoo", "oyo", "osogbo"],
    faqs: [
      {
        question: "Is Triumphant HQ a technology company in Ibadan?",
        answer:
          "Yes. Triumphant HQ (Triumphant Technological Services) is based on Basorun Rd, Ibadan, Oyo State. We deliver websites, SEO, custom applications and automation, plus a separate Local Support desk for NIN and BVN.",
      },
      {
        question: "Do you only serve Ibadan?",
        answer:
          "Our headquarters is in Ibadan. We serve neighbourhoods across the city, Oyo State, Osun State, and remote clients across Nigeria.",
      },
    ],
  },
  {
    slug: "akobo",
    name: "Akobo",
    region: "Ibadan, Oyo State",
    title: "NIN, BVN & Digital Support in Akobo, Ibadan | Triumphant HQ",
    description:
      "Need NIN enrolment or BVN help in Akobo, Ibadan? Triumphant HQ provides certified local digital support plus websites, SEO and automation for nearby businesses.",
    h1: "NIN, BVN and digital help for Akobo and nearby Ibadan",
    intro: [
      "Residents and businesses around Akobo can get careful guidance for NIN and BVN services, plus access to our full agency capabilities when growth systems are needed.",
      "Message us on WhatsApp before you visit so we confirm requirements, documents and timing.",
      "Akobo is one of our strongest neighbourhood corridors for Local Support—alongside Bashorun, Bodija and greater East Ibadan.",
    ],
    localFocus: [
      "NIN enrolment and data correction support for Akobo residents",
      "BVN enrolment, recovery and card printing guidance",
      "School portal and document assistance",
    ],
    agencyFocus: [
      "Websites and SEO for businesses serving Akobo and East Ibadan",
      "Automation for clinics, schools and service firms in the area",
    ],
    nearby: ["ibadan", "bashorun", "bodija", "ojoo"],
    faqs: [
      {
        question: "Can I get NIN enrolment help from Akobo?",
        answer:
          "Yes. Contact our Local Support desk on WhatsApp. We confirm documents and timing before you come in so the visit is efficient.",
      },
    ],
  },
  {
    slug: "bashorun",
    name: "Bashorun",
    region: "Ibadan, Oyo State",
    title: "NIN Enrolment & Tech Support in Bashorun, Ibadan | Triumphant HQ",
    description:
      "Certified NIN and BVN support for Bashorun, Ibadan, plus website design, SEO and automation for local businesses across Oyo State.",
    h1: "Local digital support serving Bashorun, Ibadan",
    intro: [
      "From Bashorun and surrounding neighbourhoods, people come to us for NIN enrolment, modifications and BVN help—with clear WhatsApp-first guidance.",
      "Our office is on Basorun Rd, Ibadan 211107, Oyo—practical for Bashorun-area residents and businesses.",
      "Businesses in and around Bashorun also engage Triumphant HQ for websites, search visibility and practical automation.",
    ],
    localFocus: [
      "NIN enrolment and NIMC-related support near Bashorun",
      "BVN consultation, recovery and card printing",
      "Document and online application assistance",
    ],
    agencyFocus: [
      "Conversion-focused websites for Bashorun-area brands",
      "Local SEO and ongoing visibility programmes",
    ],
    nearby: ["ibadan", "akobo", "bodija", "challenge"],
    faqs: [
      {
        question: "Where is Triumphant HQ relative to Bashorun?",
        answer:
          "We are on Basorun Rd, Ibadan 211107, Oyo. Message WhatsApp first for Local Support so we confirm documents and availability.",
      },
    ],
  },
  {
    slug: "bodija",
    name: "Bodija",
    region: "Ibadan, Oyo State",
    title: "Website, SEO & NIN Support near Bodija, Ibadan | Triumphant HQ",
    description:
      "Triumphant HQ serves Bodija and greater Ibadan with professional websites, SEO, automation and certified NIN/BVN local support.",
    h1: "Technology and identity support near Bodija",
    intro: [
      "Bodija and central Ibadan clients use Triumphant HQ for both growth systems and essential digital services like NIN and BVN.",
      "Whether you need a credible website for a professional firm or careful NIN enrolment help, start on WhatsApp or book a discovery call for agency work.",
    ],
    localFocus: ["NIN and BVN assistance", "School portal support", "Document and form help"],
    agencyFocus: ["Website design", "SEO growth", "Business automation"],
    nearby: ["ibadan", "akobo", "bashorun", "challenge"],
    faqs: [
      {
        question: "Do you serve Bodija businesses?",
        answer:
          "Yes. We deliver websites, SEO, apps and automation for Bodija-area organisations, and Local Support for NIN/BVN when needed.",
      },
    ],
  },
  {
    slug: "challenge",
    name: "Challenge",
    region: "Ibadan, Oyo State",
    title: "NIN, BVN & Digital Services in Challenge, Ibadan | Triumphant HQ",
    description:
      "Get NIN enrolment help, BVN support and digital services for Challenge, Ibadan—plus agency websites and SEO for local businesses.",
    h1: "Digital support for Challenge and South Ibadan",
    intro: [
      "We support individuals and organisations around Challenge with identity services and modern digital systems.",
      "WhatsApp-first coordination keeps NIN/BVN visits efficient; agency projects run through discovery and scoped delivery.",
    ],
    localFocus: ["NIN enrolment and corrections", "BVN enrolment and recovery", "Online applications"],
    agencyFocus: ["Websites", "SEO", "Automation"],
    nearby: ["ibadan", "bashorun", "ojoo"],
    faqs: [
      {
        question: "Can Challenge residents get BVN help?",
        answer:
          "Yes. Our Local Support desk assists with BVN enrolment, recovery and card printing guidance. Message WhatsApp before visiting.",
      },
    ],
  },
  {
    slug: "ojoo",
    name: "Ojoo",
    region: "Ibadan, Oyo State",
    title: "NIN Enrolment & Tech Agency Services in Ojoo, Ibadan | Triumphant HQ",
    description:
      "NIN and BVN support for Ojoo, Ibadan, with website design, SEO and automation for businesses across northern Ibadan corridors.",
    h1: "Serving Ojoo with local support and growth systems",
    intro: [
      "From Ojoo and nearby routes into Ibadan, clients reach Triumphant HQ for certified local identity support and professional digital delivery.",
      "We combine neighbourhood accessibility with agency-grade websites, SEO and automation for operators along the northern corridor.",
    ],
    localFocus: ["NIN support", "BVN support", "Portal and document help"],
    agencyFocus: ["Websites and SEO for Ojoo-area businesses", "Automation for busy operators"],
    nearby: ["ibadan", "akobo", "oyo"],
    faqs: [
      {
        question: "Do you work with Ojoo businesses remotely?",
        answer:
          "Yes. Agency work can be delivered remotely with clear milestones. Local Support for NIN/BVN is coordinated via WhatsApp for in-person visits when required.",
      },
    ],
  },
  {
    slug: "oyo",
    name: "Oyo",
    region: "Oyo State, Nigeria",
    title: "Website Design, SEO & NIN Support in Oyo State | Triumphant HQ",
    description:
      "Triumphant HQ supports Oyo town and Oyo State with websites, SEO, automation and local NIN/BVN digital services from our Ibadan base.",
    h1: "Digital services across Oyo State",
    intro: [
      "Based in Ibadan, we serve clients across Oyo State—including Oyo town—with agency delivery and local digital support.",
      "Remote collaboration and WhatsApp coordination make it practical even when you are outside the city centre.",
    ],
    localFocus: ["NIN and BVN guidance for Oyo State residents", "School and document support"],
    agencyFocus: ["Websites and SEO for Oyo State organisations", "Custom apps and automation"],
    nearby: ["ibadan", "osogbo", "ojoo"],
    faqs: [
      {
        question: "Can Oyo town businesses hire Triumphant HQ?",
        answer:
          "Yes. We deliver websites, SEO, apps and automation across Oyo State from Ibadan, with remote-friendly project management.",
      },
    ],
  },
  {
    slug: "osogbo",
    name: "Osogbo",
    region: "Osun State, Nigeria",
    title: "SEO, Websites & Digital Support for Osogbo & Osun | Triumphant HQ",
    description:
      "Work with an Ibadan-based technology partner serving Osogbo and Osun State—websites, SEO, automation and practical digital support.",
    h1: "Technology partnership for Osogbo and Osun State",
    intro: [
      "Organisations in Osogbo and across Osun State engage Triumphant HQ for credible websites, search visibility and operational systems.",
      "We combine remote delivery with regional understanding of Southwestern Nigeria markets.",
    ],
    localFocus: ["Practical digital support coordinated via WhatsApp", "Identity and portal guidance when needed"],
    agencyFocus: ["Website design for Osun brands", "SEO and automation programmes"],
    nearby: ["ife", "oyo", "ibadan", "nigeria"],
    faqs: [
      {
        question: "Do you serve Osogbo remotely?",
        answer:
          "Yes. Most agency engagements for Osogbo and Osun State run remotely with scheduled reviews. Local Support remains Ibadan-based for in-person NIN/BVN.",
      },
    ],
  },
  {
    slug: "ife",
    name: "Ile-Ife",
    region: "Osun State, Nigeria",
    title: "Web Design & SEO for Ile-Ife, Osun State | Triumphant HQ",
    description:
      "Triumphant HQ helps Ile-Ife and Osun State businesses with websites, SEO growth, applications and automation—delivered from Ibadan.",
    h1: "Digital growth systems for Ile-Ife",
    intro: [
      "From Ile-Ife, partner with Triumphant HQ for professional websites, SEO and systems that help customers find and trust you.",
      "Discovery calls and WhatsApp keep collaboration clear whether your team is campus-adjacent or city-based.",
    ],
    localFocus: ["WhatsApp-first coordination for digital tasks", "Referrals to local support when identity services are needed"],
    agencyFocus: ["Websites", "SEO", "Custom applications", "Automation"],
    nearby: ["osogbo", "oyo", "ibadan"],
    faqs: [
      {
        question: "Can Ile-Ife startups get website design from Triumphant HQ?",
        answer:
          "Yes. We design and build websites for Ile-Ife and Osun State organisations, with SEO and automation available as the next stage.",
      },
    ],
  },
  {
    slug: "nigeria",
    name: "Nigeria",
    region: "Nationwide",
    title: "Technology Agency in Nigeria | Web, Apps & AI | Triumphant",
    description:
      "Nigerian technology agency based in Ibadan: websites, custom apps, SEO and AI automation for businesses nationwide, plus a NIN/BVN desk.",
    h1: "A Nigerian technology partner for ambitious businesses",
    intro: [
      "Triumphant HQ (Triumphant Technological Services) is a technology agency headquartered on Basorun Rd, Ibadan. We have worked with organisations since 2017. This page is about that national technology practice: websites, custom applications and automation for teams anywhere in Nigeria. Search programmes have their own page, so this one does not try to rank as an SEO company.",
      "The office is in Ibadan, in the Bashorun area of Oyo State. We do not run branch offices in Lagos, Abuja or Port Harcourt. When a client is outside Ibadan, delivery is remote: a discovery call, a written scope, and WhatsApp for the questions that should not wait for a meeting. Osun State clients in Osogbo and Ile-Ife use the same remote path.",
      "Website work is usually a Next.js build with a clear structure, fast mobile pages and the technical basics search engines need. Application work is for a workflow that spreadsheets and off-the-shelf tools keep breaking. Automation is for repetitive follow-up, handoffs and reporting. We will say when a smaller job is the right one.",
      "Local Support — NIN enrolment, modifications and BVN help — is a separate desk at the same Ibadan address. It is WhatsApp-first and it is not bundled into a software project. Nationwide clients who only need a website, an application or an automation stay on the agency path.",
      "If the job is search visibility, start with the national SEO page or the Ibadan SEO page, not this location note. We keep those URLs distinct so Google is not asked to choose between three versions of the same promise.",
      "A typical remote engagement still has a named person on our side, a written scope, and a shared place to see what is done. We do not disappear behind a ticket queue. If the work needs a visit, Ibadan is where that happens. If it does not, we will not ask you to travel for a conversation that a call can finish.",
    ],
    localFocus: ["Ibadan-based NIN and BVN desk for Southwestern Nigeria", "Practical WhatsApp support"],
    agencyFocus: ["Nationwide website, SEO, app and automation delivery", "Ongoing support retainers"],
    nearby: ["ibadan", "oyo", "osogbo"],
    faqs: [
      {
        question: "Does Triumphant HQ work nationwide?",
        answer:
          "Yes. Website, application and automation work is delivered nationwide from our Ibadan headquarters. The NIN and BVN desk is in Ibadan and is coordinated on WhatsApp.",
      },
      {
        question: "Where should I go for SEO?",
        answer:
          "Use the SEO company in Nigeria page for a national search programme, or the SEO in Ibadan page if the customers you want are in Ibadan and Oyo State. This location page is not an SEO offer.",
      },
    ],
  },
];

export function getLocationPage(slug: string) {
  return locationPages.find((page) => page.slug === slug);
}

/** High-value service × location landings (quality-gated; not every combo) */
export type ServiceLocationPage = {
  serviceSlug: "websites" | "seo" | "app-development" | "automation";
  locationSlug: string;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  bullets: string[];
  faqs: LocationFaq[];
  keywords: string[];
};

export const serviceLocationPages: ServiceLocationPage[] = [
  {
    serviceSlug: "websites",
    locationSlug: "ibadan",
    title: "Website Design Company in Ibadan | Triumphant HQ",
    description:
      "Professional website design and development in Ibadan, Oyo State—conversion-focused sites for businesses across Southwestern Nigeria.",
    h1: "Website design and development in Ibadan",
    intro: [
      "If you are searching for a website design company in Ibadan, Triumphant HQ builds credible, fast sites that help customers understand and trust your offer.",
      "We work with professional firms, clinics, schools, SaaS teams and local service businesses—from first structure through launch and ongoing care.",
      "Based on Basorun Rd, we serve Ibadan neighbourhoods and deliver remotely across Oyo State, Osun State and Nigeria.",
    ],
    bullets: [
      "Clear information architecture and conversion-minded layouts",
      "Technical foundations that support SEO and performance",
      "WhatsApp and discovery-call onboarding for Ibadan clients",
      "Optional ongoing website care after launch",
    ],
    faqs: [
      {
        question: "How much does website design cost in Ibadan?",
        answer:
          "Scope drives investment. We do not publish one-size prices; a short discovery call clarifies pages, integrations and timeline so you get a clear proposal.",
      },
      {
        question: "Do you redesign existing Ibadan business websites?",
        answer:
          "Yes. Many engagements start with an audit of structure, speed and conversion gaps, then a focused rebuild or redesign.",
      },
      {
        question: "Where is your website design studio?",
        answer:
          "Triumphant HQ works from Basorun Rd, Ibadan 211107, Oyo. Discovery can be a call or WhatsApp; delivery is remote-friendly across Oyo State and Nigeria.",
      },
    ],
    keywords: [
      "website design Ibadan",
      "web design company Ibadan",
      "website design company Oyo",
      "best website design Ibadan",
    ],
  },
];

export function getServiceLocationPage(serviceSlug: string, locationSlug: string) {
  return serviceLocationPages.find(
    (page) => page.serviceSlug === serviceSlug && page.locationSlug === locationSlug,
  );
}

export const defaultKeywords = [
  "Triumphant HQ",
  "technology agency Ibadan",
  "technology company Ibadan",
  "best tech company Ibadan",
  "website design Ibadan",
  "SEO in Ibadan",
  "SEO company in Nigeria",
  "NIN enrolment Ibadan",
  "BVN support Ibadan",
  "NIN Akobo",
  "NIN Bashorun",
  "web development Nigeria",
  "AI automation Nigeria",
  "digital support Ibadan",
];

/** Share crop of the cinematic hero. 1200×630 matches the usual social card ratio. */
const DEFAULT_OG_IMAGE = "/images/og-agency-hero-cinematic.jpg";
const DEFAULT_OG_WIDTH = 1200;
const DEFAULT_OG_HEIGHT = 630;

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageWidth,
  ogImageHeight,
}: BuildMetadataInput): Metadata {
  const url = absoluteCanonicalUrl(path);
  const mergedKeywords = [
    ...new Set([...keywords, siteIdentity.brandName, siteIdentity.legalName]),
  ];

  return {
    title: { absolute: title },
    description,
    keywords: mergedKeywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteIdentity.brandName,
      locale: "en_NG",
      type: "website",
      images: [
        ogImage === DEFAULT_OG_IMAGE
          ? { url: ogImage, width: DEFAULT_OG_WIDTH, height: DEFAULT_OG_HEIGHT, alt: title }
          : ogImageWidth && ogImageHeight
            ? { url: ogImage, width: ogImageWidth, height: ogImageHeight, alt: title }
            : { url: ogImage, alt: title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: siteIdentity.brandName,
    legalName: siteIdentity.legalName,
    alternateName: [siteIdentity.legalName, "Triumphant Tech"],
    url: SITE_URL,
    email: siteIdentity.email,
    telephone: siteIdentity.phoneE164,
    foundingDate: String(siteIdentity.foundingYear),
    logo: `${SITE_URL}/brand-logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteIdentity.streetAddress,
      addressLocality: siteIdentity.addressLocality,
      addressRegion: siteIdentity.addressRegion,
      postalCode: siteIdentity.postalCode,
      addressCountry: siteIdentity.addressCountry,
    },
    areaServed: serviceAreas.map((area) => area.name),
    sameAs: siteIdentity.profiles.map((profile) => profile.href),
  };
}

export function localBusinessJsonLd() {
  const openingHoursSpecification = siteIdentity.openingHours.flatMap((block) =>
    block.days.map((day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: day,
      opens: block.opens,
      closes: block.closes,
    })),
  );

  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${SITE_URL}/#localbusiness`,
    name: siteIdentity.legalName,
    legalName: siteIdentity.legalName,
    alternateName: [siteIdentity.brandName, "Triumphant Tech"],
    image: `${SITE_URL}/images/agency-hero-cinematic.png`,
    url: SITE_URL,
    telephone: siteIdentity.phoneE164,
    email: siteIdentity.email,
    foundingDate: String(siteIdentity.foundingYear),
    founder: {
      "@type": "Person",
      "@id": `${SITE_URL}/#founder`,
      name: "Adeyemi Olayemi",
      jobTitle: "Founder",
      url: `${SITE_URL}/about`,
    },
    hasMap: siteIdentity.mapsUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteIdentity.streetAddress,
      addressLocality: siteIdentity.addressLocality,
      addressRegion: siteIdentity.addressRegion,
      postalCode: siteIdentity.postalCode,
      addressCountry: siteIdentity.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteIdentity.geo.latitude,
      longitude: siteIdentity.geo.longitude,
    },
    openingHoursSpecification,
    areaServed: serviceAreas.map((area) => ({
      "@type": area.type === "country" ? "Country" : "City",
      name: `${area.name}${area.region ? `, ${area.region}` : ""}`,
    })),
    knowsAbout: [
      "Website design",
      "Search engine optimization",
      "Local SEO",
      "Technical SEO",
      "Custom application development",
      "Business automation",
      "NIN enrolment support",
      "BVN support",
    ],
    sameAs: siteIdentity.profiles.map((profile) => profile.href),
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };

  if (siteIdentity.aggregateRating) {
    base.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: siteIdentity.aggregateRating.ratingValue,
      reviewCount: siteIdentity.aggregateRating.reviewCount,
      bestRating: siteIdentity.aggregateRating.bestRating ?? 5,
      worstRating: siteIdentity.aggregateRating.worstRating ?? 1,
    };
  }

  return base;
}

export function websiteJsonLd() {
  // No SearchAction: the site has no search results URL. Category filters are not search.
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: siteIdentity.brandName,
    alternateName: siteIdentity.legalName,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-NG",
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteCanonicalUrl(item.path),
    })),
  };
}

export type SchemaArea =
  | string
  | {
      "@type": "City" | "AdministrativeArea" | "Country" | "State";
      name: string;
    };

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  areaServed?: SchemaArea[];
  offerNames?: string[];
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    provider: { "@id": `${SITE_URL}/#localbusiness` },
    areaServed: input.areaServed ?? serviceAreas.map((area) => area.name),
    url: absoluteCanonicalUrl(input.path),
  };

  if (input.offerNames && input.offerNames.length > 0) {
    data.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: input.name,
      itemListElement: input.offerNames.map((name) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name,
        },
      })),
    };
  }

  return data;
}

export function webPageJsonLd(input: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: absoluteCanonicalUrl(input.path),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#localbusiness` },
    inLanguage: "en-NG",
  };
}

export function faqJsonLd(faqs: LocationFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#founder`,
      name: "Adeyemi Olayemi",
      jobTitle: "Founder",
      url: `${SITE_URL}/about`,
      worksFor: { "@id": `${SITE_URL}/#organization` },
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: siteIdentity.brandName,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/brand-logo.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteCanonicalUrl(input.path),
    },
    inLanguage: "en-NG",
  };
}

/** Pixel sizes measured from the files. Omit width/height when a file is not in this map. */
const CONTENT_IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/images/adeyemi-olayemi.png": { width: 1024, height: 763 },
  "/images/services-studio.png": { width: 1536, height: 1024 },
  "/images/service-websites.png": { width: 1536, height: 1024 },
  "/images/service-apps.png": { width: 1536, height: 1024 },
  "/images/service-seo.png": { width: 1536, height: 1024 },
  "/images/service-automation.png": { width: 1536, height: 1024 },
  "/images/clients/integrated-aerial-precision.png": { width: 1024, height: 614 },
  "/images/clients/dr-seyi-absolute-wellness.png": { width: 200, height: 200 },
  "/brand-logo.png": { width: 512, height: 512 },
};

export function imageObjectJsonLd(input: { src: string; caption: string; id?: string }) {
  const src = input.src.startsWith("http") ? input.src : input.src.startsWith("/") ? input.src : `/${input.src}`;
  const data: Record<string, unknown> = {
    "@type": "ImageObject",
    url: src.startsWith("http") ? src : `${SITE_URL}${src}`,
    caption: input.caption,
  };
  if (input.id) data["@id"] = input.id;
  const dimensions = CONTENT_IMAGE_DIMENSIONS[src];
  if (dimensions) {
    data.width = dimensions.width;
    data.height = dimensions.height;
  }
  return data;
}

function graphNode(node: Record<string, unknown>) {
  const rest = { ...node };
  delete rest["@context"];
  return rest;
}

export function collectionPageJsonLd(input: {
  path: string;
  name: string;
  description: string;
  listName: string;
  items: Array<{ name: string; path: string }>;
  pageType?: string | string[];
  breadcrumbs?: Array<{ name: string; path: string }>;
}) {
  const url = absoluteCanonicalUrl(input.path);
  const graph: Record<string, unknown>[] = [
    {
      "@type": input.pageType ?? "CollectionPage",
      "@id": `${url}#webpage`,
      name: input.name,
      description: input.description,
      url,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      inLanguage: "en-NG",
      mainEntity: { "@id": `${url}#list` },
    },
    {
      "@type": "ItemList",
      "@id": `${url}#list`,
      name: input.listName,
      itemListElement: input.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteCanonicalUrl(item.path),
      })),
    },
  ];

  if (input.breadcrumbs && input.breadcrumbs.length > 0) {
    graph.push({
      ...graphNode(breadcrumbJsonLd(input.breadcrumbs)),
      "@id": `${url}#breadcrumb`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function aboutPageJsonLd() {
  const url = absoluteCanonicalUrl("/about");
  const imageId = `${url}#founder-image`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${url}#webpage`,
        name: "About Triumphant HQ",
        url,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#founder` },
        mainEntity: { "@id": `${SITE_URL}/#founder` },
        primaryImageOfPage: { "@id": imageId },
        inLanguage: "en-NG",
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#founder`,
        name: "Adeyemi Olayemi",
        jobTitle: "Founder",
        url,
        image: { "@id": imageId },
        worksFor: { "@id": `${SITE_URL}/#organization` },
      },
      {
        ...imageObjectJsonLd({
          src: "/images/adeyemi-olayemi.png",
          caption: "Adeyemi Olayemi, founder of Triumphant HQ",
          id: imageId,
        }),
      },
    ],
  };
}

export function founderPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/founder#person`,
    name: "Adeyemi Olayemi",
    jobTitle: "Founder",
    url: `${SITE_URL}/founder`,
    image: `${SITE_URL}/images/founder/adeyemi-olayemi.jpg`,
    description:
      "Founder of Triumphant Technological Services (TriumphantTech), an Ibadan studio for websites, custom applications, SEO and AI automation.",
    worksFor: { "@id": `${SITE_URL}/#organization` },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ibadan",
      addressRegion: "Oyo",
      addressCountry: "NG",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Federal University of Agriculture, Abeokuta",
    },
    knowsAbout: [
      "Technical SEO",
      "Web development",
      "Next.js",
      "AI automation",
      "WhatsApp automation",
      "Digital marketing",
      "AI model evaluation",
      "IT support",
    ],
    sameAs: [
      "https://www.linkedin.com/in/adeyemi-olayemi-73a7b1158/",
      "https://github.com/TriumphantSam",
    ],
  };
}

export function contactPageJsonLd() {
  const url = absoluteCanonicalUrl("/contact");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${url}#webpage`,
        name: "Tell us what the business needs to achieve.",
        url,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#localbusiness` },
        mainEntity: { "@id": `${url}#contactpoint` },
        inLanguage: "en-NG",
      },
      {
        "@type": "ContactPoint",
        "@id": `${url}#contactpoint`,
        telephone: siteIdentity.phoneE164,
        email: siteIdentity.email,
        contactType: "customer service",
        areaServed: siteIdentity.addressCountry,
        availableLanguage: ["en"],
        url,
      },
    ],
  };
}

export function productOfferJsonLd(input: {
  slug: string;
  name: string;
  description: string;
  priceNgn: number;
  breadcrumbs: Array<{ name: string; path: string }>;
}) {
  const url = absoluteCanonicalUrl(`/digital-forge/products/${input.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: input.name,
        description: input.description,
        brand: { "@id": `${SITE_URL}/#organization` },
        offers: {
          "@type": "Offer",
          price: String(input.priceNgn),
          priceCurrency: "NGN",
          availability: "https://schema.org/InStock",
          url,
          seller: { "@id": `${SITE_URL}/#organization` },
        },
      },
      {
        ...graphNode(breadcrumbJsonLd(input.breadcrumbs)),
        "@id": `${url}#breadcrumb`,
      },
    ],
  };
}

export function caseStudyJsonLd(input: {
  slug: string;
  name: string;
  client: string;
  description: string;
  imageSrc: string;
  imageCaption: string;
  dateModified?: string;
  clientUrl?: string;
}) {
  const url = absoluteCanonicalUrl(`/work/${input.slug}`);
  const about: Record<string, unknown> = {
    "@type": "Organization",
    name: input.client,
  };
  if (input.clientUrl) about.url = input.clientUrl;

  const work: Record<string, unknown> = {
    "@type": "CreativeWork",
    "@id": `${url}#work`,
    name: input.name,
    description: input.description,
    url,
    creator: { "@id": `${SITE_URL}/#organization` },
    about,
    image: imageObjectJsonLd({
      src: input.imageSrc,
      caption: input.imageCaption,
    }),
    inLanguage: "en-NG",
  };
  if (input.dateModified) work.dateModified = input.dateModified;

  return {
    "@context": "https://schema.org",
    "@graph": [
      work,
      {
        ...graphNode(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: input.client, path: `/work/${input.slug}` },
          ]),
        ),
        "@id": `${url}#breadcrumb`,
      },
    ],
  };
}

/** First absolute http(s) URL with a real hostname, if the visible copy contains exactly one. */
export function soleVisibleHttpUrl(texts: Array<string | undefined>) {
  const found = new Set<string>();
  const pattern = /https?:\/\/[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s)]*)?/gi;
  for (const text of texts) {
    if (!text) continue;
    for (const match of text.match(pattern) ?? []) {
      found.add(match.replace(/[.,;:]+$/, ""));
    }
  }
  if (found.size !== 1) return undefined;
  return [...found][0];
}

export const formattedNapAddress = [
  siteIdentity.streetAddress,
  [siteIdentity.addressLocality, siteIdentity.postalCode].filter(Boolean).join(" "),
  siteIdentity.addressRegion,
]
  .filter(Boolean)
  .join(", ");

export const entityDefinition =
  "Triumphant HQ is an Ibadan-based technology and growth agency (Triumphant Technological Services) offering website design, SEO, custom applications and business automation, plus a certified Local Support desk for NIN and BVN services across Oyo State and Nigeria.";
