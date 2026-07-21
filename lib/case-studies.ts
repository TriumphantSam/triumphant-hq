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
    sector: "Healthcare",
    logo: "/images/clients/metropolitan-family-hospital.png",
  },
  {
    name: "Mercy Medical Clinic",
    sector: "Healthcare",
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
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "integrated-aerial-precision",
    client: "Integrated Aerial Precision",
    sector: "Agricultural drone technology",
    service: "Website redesign & technical SEO foundations",
    title: "Moving from legacy hosting to a modern Jamstack architecture",
    summary:
      "A full rebuild that replaced a rigid cPanel setup with a fast, crawlable edge-hosted site built for search and performance.",
    problem:
      "The legacy IAPrecision website sat on a rigid Namecheap cPanel setup. Heavy server-side rendering, single-page limitations and plugin bloat made the site virtually un-optimizable for search engines, slow to load and weak on Core Web Vitals.",
    solution:
      "We rebuilt the site from the ground up, decoupled the architecture and migrated deployment from cPanel to Vercel for edge delivery, cleaner execution and proper search-engine crawlability.",
    outcome:
      "Rendering bottlenecks were resolved, site speed improved, full mobile responsiveness was delivered, and proper SEO indexing was unlocked to support sustainable organic traffic for an agricultural drone company.",
    logo: "/images/clients/integrated-aerial-precision.png",
  },
  {
    slug: "dr-seyi-absolute-wellness",
    client: "Dr Seyi Absolute Wellness Ltd",
    sector: "Wellness services",
    service: "Technical SEO & local visibility",
    title: "Fixing local search visibility and technical SEO",
    summary:
      "A focused technical SEO programme that helped high-intent local searchers find the right wellness pages—and move toward enquiry.",
    problem:
      "Despite high-value wellness services, the brand had low digital visibility. High-intent local searchers could not reliably find landing pages when looking for wellness solutions.",
    solution:
      "We ran a deep technical SEO audit, restructured the site hierarchy, optimized metadata, fixed indexing errors and aligned page content with the language wellness clients were actually searching.",
    outcome:
      "A more consistent digital presence, stronger organic visibility and a clearer path from search results to bookings and enquiries.",
    logo: "/images/clients/dr-seyi-absolute-wellness.png",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
