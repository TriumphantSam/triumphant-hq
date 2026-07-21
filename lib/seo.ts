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
    longitude: 3.9470,
  },
  foundingYear: 2017,
  sameAs: [] as string[],
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
      "Triumphant HQ is based in Ibadan, Oyo State. We help businesses grow with websites, SEO, applications and automation—and we run a dedicated local desk for NIN, BVN and essential digital services.",
      "Whether you are in Bodija, Akobo, Bashorun, Challenge, Ojoo or elsewhere in the city, you can reach us for practical support and professional delivery.",
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
    ],
    localFocus: ["NIN and BVN assistance", "School portal support", "Document and form help"],
    agencyFocus: ["Website design", "SEO growth", "Business automation"],
    nearby: ["ibadan", "akobo", "bashorun", "challenge"],
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
    ],
    localFocus: ["NIN enrolment and corrections", "BVN enrolment and recovery", "Online applications"],
    agencyFocus: ["Websites", "SEO", "Automation"],
    nearby: ["ibadan", "bashorun", "ojoo"],
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
    ],
    localFocus: ["NIN support", "BVN support", "Portal and document help"],
    agencyFocus: ["Websites and SEO for Ojoo-area businesses", "Automation for busy operators"],
    nearby: ["ibadan", "akobo", "oyo"],
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
    ],
    localFocus: ["WhatsApp-first coordination for digital tasks", "Referrals to local support when identity services are needed"],
    agencyFocus: ["Websites", "SEO", "Custom applications", "Automation"],
    nearby: ["osogbo", "oyo", "ibadan"],
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
  },
];

export function getLocationPage(slug: string) {
  return locationPages.find((page) => page.slug === slug);
}

export const defaultKeywords = [
  "Triumphant HQ",
  "technology agency Ibadan",
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
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
    logo: `${SITE_URL}/icon.svg`,
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
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${SITE_URL}/#localbusiness`,
    name: siteIdentity.brandName,
    image: `${SITE_URL}/images/agency-hero-cinematic.png`,
    url: SITE_URL,
    telephone: siteIdentity.phoneE164,
    email: siteIdentity.email,
    priceRange: "$$",
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
    ],
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };
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
        url: `${SITE_URL}/icon.svg`,
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
].filter(Boolean).join(", ");
