import type { Metadata } from "next";

export const SITE_URL = "https://triumphantech.com";

export const siteIdentity = {
  brandName: "Triumphant HQ",
  legalName: "Triumphant Technological Services",
  email: "admin@triumphantech.com",
  phoneDisplay: "+234 810 771 1190",
  phoneE164: "+2348107711190",
  whatsapp: "2348107711190",
  streetAddress: "Basorun Rd",
  addressLocality: "Ibadan",
  addressRegion: "Oyo",
  addressCountry: "NG",
  postalCode: "211107",
  geo: {
    latitude: 7.3775,
    longitude: 3.947,
  },
  foundingYear: 2017,
  /** Public profile URLs — add LinkedIn/Instagram/Facebook when live */
  sameAs: [
    "https://share.google/oJQ1piDwZ4dL7Z491",
    "https://triumphantech.com",
  ] as string[],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Basorun+Rd,+Ibadan+211107,+Oyo",
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
    title: "Technology Agency & NIN/BVN Support in Ibadan | Triumphant HQ",
    description:
      "Triumphant HQ in Ibadan offers website design, SEO, custom apps, automation, plus certified NIN enrolment and BVN support across Oyo State.",
    h1: "Digital systems and local identity support in Ibadan",
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
    title: "Nigerian Technology & SEO Agency | Triumphant HQ",
    description:
      "Triumphant HQ is a Nigerian technology and growth agency for websites, SEO, custom applications and automation—serving clients nationwide from Ibadan.",
    h1: "A Nigerian technology partner for ambitious businesses",
    intro: [
      "Triumphant HQ works with organisations across Nigeria. Our headquarters is in Ibadan, Oyo State, with remote-first delivery for teams anywhere in the country.",
      "Local clients also use our NIN and BVN support desk for essential identity services.",
    ],
    localFocus: ["Ibadan-based NIN and BVN desk for Southwestern Nigeria", "Practical WhatsApp support"],
    agencyFocus: ["Nationwide website, SEO, app and automation delivery", "Ongoing support retainers"],
    nearby: ["ibadan", "oyo", "osogbo"],
    faqs: [
      {
        question: "Does Triumphant HQ work nationwide?",
        answer:
          "Yes. Agency delivery is available nationwide from our Ibadan base. The Local Support desk for NIN/BVN is Ibadan-centred with WhatsApp coordination.",
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
    ],
    keywords: [
      "website design Ibadan",
      "web design company Ibadan",
      "website design company Oyo",
      "best website design Ibadan",
    ],
  },
  {
    serviceSlug: "seo",
    locationSlug: "ibadan",
    title: "SEO Agency in Ibadan & Oyo State | Triumphant HQ",
    description:
      "SEO agency in Ibadan for technical health, content and local visibility—helping Oyo State businesses get found on Google and AI search.",
    h1: "SEO services for Ibadan and Oyo State businesses",
    intro: [
      "Triumphant HQ is an SEO agency based in Ibadan. We improve technical foundations, on-page clarity and content systems so the right customers can find you.",
      "Local businesses often need both city-level visibility (Ibadan, Akobo, Bashorun) and service-level pages that match how people search.",
      "Start with a free SEO visibility snapshot, then decide whether a focused project or ongoing growth retainer fits.",
    ],
    bullets: [
      "Technical SEO and crawlability fixes",
      "Local and service-page structure for Ibadan queries",
      "Content guidance tied to real commercial intent",
      "AI-search readiness: clear facts, FAQs and entity consistency",
    ],
    faqs: [
      {
        question: "Do you offer local SEO for Ibadan businesses?",
        answer:
          "Yes. We align site structure, Google Business Profile guidance and location-relevant pages so local searches can convert into enquiries.",
      },
      {
        question: "Is SEO different from running ads?",
        answer:
          "Yes. SEO builds durable organic visibility. Ads can complement it, but our SEO work focuses on technical health, content and local relevance.",
      },
    ],
    keywords: [
      "SEO agency Ibadan",
      "SEO company Oyo State",
      "local SEO Ibadan",
      "search visibility Ibadan",
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
  "SEO agency Ibadan",
  "SEO company Oyo State",
  "NIN enrolment Ibadan",
  "BVN support Ibadan",
  "NIN Akobo",
  "NIN Bashorun",
  "web development Nigeria",
  "AI automation Nigeria",
  "digital support Ibadan",
];

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  ogImage?: string;
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
  ogImage = "/images/agency-hero-cinematic.png",
}: BuildMetadataInput): Metadata {
  const url = path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const mergedKeywords = [...new Set([...keywords, ...defaultKeywords])];

  return {
    title: { absolute: title },
    description,
    keywords: mergedKeywords,
    alternates: { canonical: path.startsWith("/") ? path : `/${path}` },
    openGraph: {
      title,
      description,
      url,
      siteName: siteIdentity.brandName,
      locale: "en_NG",
      type: "website",
      images: [{ url: ogImage, width: 1920, height: 1080, alt: title }],
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
    sameAs: siteIdentity.sameAs,
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
    name: siteIdentity.brandName,
    image: `${SITE_URL}/images/agency-hero-cinematic.png`,
    url: SITE_URL,
    telephone: siteIdentity.phoneE164,
    email: siteIdentity.email,
    priceRange: "$$",
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
      "Custom application development",
      "Business automation",
      "NIN enrolment support",
      "BVN support",
      "Technology company Ibadan",
    ],
    sameAs: siteIdentity.sameAs,
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
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: siteIdentity.brandName,
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
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    provider: { "@id": `${SITE_URL}/#localbusiness` },
    areaServed: serviceAreas.map((area) => area.name),
    url: `${SITE_URL}${input.path}`,
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
      "@type": "Organization",
      name: siteIdentity.brandName,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: siteIdentity.brandName,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/brand-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${input.path}`,
    },
    inLanguage: "en-NG",
  };
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
