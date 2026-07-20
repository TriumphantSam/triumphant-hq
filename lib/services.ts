export type ServiceIcon = "web" | "app" | "seo" | "automation";

export type AgencyService = {
  slug: "websites" | "app-development" | "seo" | "automation";
  icon: ServiceIcon;
  eyebrow: string;
  title: string;
  shortTitle: string;
  promise: string;
  description: string;
  idealFor: string;
  startingPrice: string;
  image: string;
  imageAlt: string;
  outcomes: string[];
  deliverables: string[];
  process: string[];
};

export const agencyServices: AgencyService[] = [
  {
    slug: "websites",
    icon: "web",
    eyebrow: "Web design and development",
    title: "Websites engineered to earn attention and enquiries",
    shortTitle: "Website Design",
    promise: "Turn your website into a credible, fast and conversion-focused growth asset.",
    description:
      "We combine positioning, interface design and production-grade Next.js development to create websites that communicate value clearly and move visitors toward action.",
    idealFor: "Growing companies, professional firms and founders replacing an outdated or underperforming website.",
    startingPrice: "From ₦350,000 / $1,200",
    image: "/images/service-websites.png",
    imageAlt: "Modern website design workspace with a large display and soft daylight",
    outcomes: ["Sharper market positioning", "More qualified enquiries", "Faster mobile performance", "A scalable content foundation"],
    deliverables: ["Discovery and content architecture", "Custom responsive interface design", "Next.js development", "Technical SEO foundation", "Analytics and launch support"],
    process: ["Discovery", "Strategy and UX", "Design and build", "Quality assurance", "Launch and support"],
  },
  {
    slug: "app-development",
    icon: "app",
    eyebrow: "Custom product engineering",
    title: "Custom applications built around your operations",
    shortTitle: "Custom Applications",
    promise: "Replace fragmented tools and manual work with software designed for your business.",
    description:
      "From client portals and internal dashboards to mobile-ready platforms, we design and engineer secure applications that simplify complex workflows.",
    idealFor: "Teams with a validated workflow, product concept or operational bottleneck that off-the-shelf software cannot solve.",
    startingPrice: "From ₦1,000,000 / $2,000",
    image: "/images/service-apps.png",
    imageAlt: "Software engineering workspace with dual monitors and cool ambient light",
    outcomes: ["Streamlined operations", "Better customer experiences", "Reliable business data", "Software that can evolve"],
    deliverables: ["Product discovery and specification", "UX and interface design", "Web or hybrid app development", "API and database architecture", "Deployment and documentation"],
    process: ["Product workshop", "Technical planning", "Prototype", "Iterative development", "Launch and improvement"],
  },
  {
    slug: "seo",
    icon: "seo",
    eyebrow: "Organic and AI-search growth",
    title: "SEO execution that makes your expertise discoverable",
    shortTitle: "SEO Growth",
    promise: "Build durable visibility across Google and the emerging AI-powered search landscape.",
    description:
      "We diagnose technical blockers, map search demand and implement the pages, content and authority signals required for sustainable organic growth.",
    idealFor: "Businesses with a proven offer that need stronger discoverability, qualified organic traffic and a disciplined execution partner.",
    startingPrice: "From ₦100,000/mo / $300/mo",
    image: "/images/service-seo.png",
    imageAlt: "Laptop on a desk showing abstract search analytics in soft blue light",
    outcomes: ["Stronger search visibility", "Higher-intent organic traffic", "Improved technical health", "AI citation readiness"],
    deliverables: ["Technical and content audit", "Search opportunity map", "On-page and technical implementation", "Content briefs and optimization", "Reporting and growth roadmap"],
    process: ["Snapshot", "Opportunity mapping", "Technical fixes", "Content execution", "Measure and compound"],
  },
  {
    slug: "automation",
    icon: "automation",
    eyebrow: "AI and workflow automation",
    title: "Automation systems that give your team time back",
    shortTitle: "AI Automation",
    promise: "Connect tools, remove repetitive work and turn manual processes into reliable systems.",
    description:
      "We map operational friction, integrate your software and build focused AI-assisted workflows that improve speed without sacrificing oversight.",
    idealFor: "Service businesses and lean teams losing hours to repetitive handoffs, data entry, follow-up or reporting.",
    startingPrice: "From ₦150,000 / $500",
    image: "/images/service-automation.png",
    imageAlt: "Operations desk with devices showing connected workflow diagrams",
    outcomes: ["Less repetitive work", "Faster lead response", "Cleaner operational data", "More consistent delivery"],
    deliverables: ["Workflow and data audit", "Automation architecture", "API and webhook integrations", "AI-assisted processing", "Monitoring and team handover"],
    process: ["Workflow audit", "Prioritization", "Build and integrate", "Test with real cases", "Train and optimize"],
  },
];

export const discoveryCallUrl = "https://cal.com/adeyemi-olayemi-vqvyj4/30-min-seo-strategy-call";
export const whatsappNumber = "2348107711190";

export function getAgencyService(slug: string) {
  return agencyServices.find((service) => service.slug === slug);
}
