export type ComparisonRow = {
  dimension: string;
  freelancer: string;
  agency: string;
  triumphanthq: string;
};

export type ComparisonPage = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string[];
  columns: [string, string, string];
  rows: ComparisonRow[];
  whenFreelancer: string[];
  whenAgency: string[];
  whenUs: string[];
  whenLabels: [string, string, string];
  ctaTitle: string;
  ctaDescription: string;
};

export const comparisons: ComparisonPage[] = [
  {
    slug: "agency-vs-freelancer",
    eyebrow: "Decision guide",
    title: "Agency vs freelancer: which model fits the work?",
    description:
      "A practical comparison of delivery models for websites, SEO, software and automation—without naming competitors.",
    intro: [
      "The right partner depends less on labels and more on risk, coordination and what must still work after launch.",
      "Use this guide to choose a model that matches the complexity of your problem—not the loudest pitch.",
    ],
    columns: ["Freelancer", "Typical agency", "Triumphant HQ"],
    whenLabels: [
      "When a freelancer fits",
      "When an agency model fits",
      "When Triumphant HQ is a strong fit",
    ],
    rows: [
      {
        dimension: "Best for",
        freelancer: "Narrow, well-defined tasks with a clear brief",
        agency: "Multi-discipline programmes with shared accountability",
        triumphanthq: "Focused business outcomes across design, build, SEO and systems",
      },
      {
        dimension: "Coordination",
        freelancer: "You often become the project manager between specialists",
        agency: "One team owns handoffs between strategy, design and delivery",
        triumphanthq: "One partner keeps strategy and execution in the same conversation",
      },
      {
        dimension: "Coverage",
        freelancer: "Strong in one craft; adjacent work may need extra vendors",
        agency: "Broader bench, but quality varies by how work is staffed",
        triumphanthq: "Four connected disciplines with a clear starting engagement",
      },
      {
        dimension: "Speed to clarity",
        freelancer: "Fast when the brief is already sharp",
        agency: "Strong when discovery and scoping are structured",
        triumphanthq: "Discovery first, written proposal before commitment",
      },
      {
        dimension: "After launch",
        freelancer: "Depends on availability and retainer habits",
        agency: "Often stronger for ongoing programmes and reporting",
        triumphanthq: "Handover, improvement loops and optional ongoing execution",
      },
      {
        dimension: "Risk profile",
        freelancer: "Lower cost entry; higher bus-factor and coordination risk",
        agency: "Higher structure; watch for bloated process and junior dilution",
        triumphanthq: "Senior-led clarity without theatre—scope confirmed in writing",
      },
    ],
    whenFreelancer: [
      "You already know exactly what to build and how success will be judged",
      "The work sits inside one craft (for example, a single landing page design)",
      "You have time to brief, review and integrate outputs yourself",
    ],
    whenAgency: [
      "The problem spans brand, product, search and operations",
      "You need continuity if one specialist is unavailable",
      "Stakeholders expect documented process, proposals and accountable delivery",
    ],
    whenUs: [
      "You want practical execution, not a slide deck that never ships",
      "You need websites, apps, SEO or automation connected to a business outcome",
      "You value honest fit guidance before a proposal",
    ],
    ctaTitle: "Still unsure which model you need?",
    ctaDescription:
      "Tell us the challenge. We will help you decide whether a focused engagement—or a simpler path—is the right next move.",
  },
  {
    slug: "in-house-vs-partner",
    eyebrow: "Decision guide",
    title: "In-house team vs external partner",
    description:
      "When to hire, when to outsource and when a specialist partner is the clearer path for digital delivery.",
    intro: [
      "Hiring is a long-term operating decision. Partnering is a way to buy focused capability without carrying full-time overhead on day one.",
      "Neither option is universally better. The mistake is choosing based on habit instead of workload, urgency and institutional knowledge.",
    ],
    columns: ["In-house hire", "External partner", "Triumphant HQ"],
    whenLabels: [
      "When hiring in-house fits",
      "When an external partner fits",
      "When Triumphant HQ is a strong fit",
    ],
    rows: [
      {
        dimension: "Best for",
        freelancer: "Recurring work that must live inside your culture daily",
        agency: "Bursts of specialised delivery and cross-functional builds",
        triumphanthq: "Outcome-led projects and programmes without building a full digital department first",
      },
      {
        dimension: "Cost shape",
        freelancer: "Salary, benefits, tools and management overhead",
        agency: "Project or retainer fees tied to scoped delivery",
        triumphanthq: "Scoped proposals with clear deliverables before work begins",
      },
      {
        dimension: "Time to impact",
        freelancer: "Slower if recruiting and onboarding are still ahead",
        agency: "Faster when the partner already has process and specialists",
        triumphanthq: "Discovery quickly clarifies priorities, then delivery starts with a plan",
      },
      {
        dimension: "Knowledge retention",
        freelancer: "Strong if documentation and ownership are intentional",
        agency: "Risk of dependency if handover is weak",
        triumphanthq: "Documentation, training and systems designed to remain usable after launch",
      },
      {
        dimension: "Flexibility",
        freelancer: "Capacity is fixed to headcount",
        agency: "Capacity can expand or contract with demand",
        triumphanthq: "Engage for the problem in front of you; expand only when justified",
      },
      {
        dimension: "Best next step",
        freelancer: "Hire when the role will stay full for 12+ months",
        agency: "Partner when speed and specialised craft matter now",
        triumphanthq: "Start with a short discovery if the problem is clear but the path is not",
      },
    ],
    whenFreelancer: [
      "You have steady, year-round digital workload",
      "You can manage and develop the role properly",
      "Institutional knowledge must sit permanently inside the company",
    ],
    whenAgency: [
      "You need specialised delivery sooner than hiring allows",
      "The initiative is project-shaped rather than a permanent department",
      "Leadership wants outside perspective plus execution",
    ],
    whenUs: [
      "You need a partner who can diagnose and deliver across web, SEO, apps and automation",
      "You want written scope before spend",
      "You still want a clean handover to your team afterwards",
    ],
    ctaTitle: "Need help choosing hire vs partner?",
    ctaDescription:
      "Share the workload and timeline. We will recommend the model that protects momentum—not the one that sounds impressive.",
  },
];

export function getComparison(slug: string) {
  return comparisons.find((page) => page.slug === slug);
}

export type IndustryPage = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  audience: string;
  challenges: Array<{ title: string; copy: string }>;
  approach: Array<{ title: string; copy: string }>;
  services: Array<{ title: string; href: string; copy: string }>;
  proofNote: string;
  ctaTitle: string;
};

export const industries: IndustryPage[] = [
  {
    slug: "professional-firms",
    eyebrow: "For professional firms",
    title: "Digital systems that match the standard of your advice.",
    description:
      "Law, accounting, consulting and advisory firms need credibility, clarity and enquiry pathways—not generic templates.",
    audience: "Partners and practice leaders who want a sharper web presence, stronger local/organic visibility and fewer manual admin loops.",
    challenges: [
      {
        title: "Credibility gaps",
        copy: "Outdated sites quietly undermine trust before a prospect ever books a consultation.",
      },
      {
        title: "Invisible expertise",
        copy: "Strong practitioners stay hard to find when service pages and search foundations are thin.",
      },
      {
        title: "Admin friction",
        copy: "Intake, follow-up and document handoffs still live in inboxes and spreadsheets.",
      },
    ],
    approach: [
      {
        title: "Position the practice clearly",
        copy: "We clarify who you serve, what issues you own and why a serious client should enquire.",
      },
      {
        title: "Build conversion-ready pages",
        copy: "Service pages, proof and contact paths designed for high-consideration buyers.",
      },
      {
        title: "Strengthen discoverability",
        copy: "Technical SEO and content structure so expertise becomes findable, not assumed.",
      },
    ],
    services: [
      { title: "Website Design", href: "/services/websites", copy: "Credible, fast sites for professional positioning." },
      { title: "SEO Growth", href: "/services/seo", copy: "Visibility for high-intent service searches." },
      { title: "AI Automation", href: "/services/automation", copy: "Smoother enquiry and follow-up workflows." },
    ],
    proofNote: "We work with organisations that need trust and clarity—healthcare, advisory and specialist practices included.",
    ctaTitle: "Ready to modernise how your firm is found and chosen?",
  },
  {
    slug: "saas",
    eyebrow: "For SaaS and product teams",
    title: "Web, SEO and systems that support product-led growth.",
    description:
      "SaaS teams need sites and search that explain value quickly, convert trials and keep operational workflows from slowing the go-to-market motion.",
    audience: "Founders and marketing/product leads shipping B2B or B2C software who need sharper acquisition infrastructure.",
    challenges: [
      {
        title: "Fuzzy positioning",
        copy: "Feature lists replace clear outcomes, so visitors bounce before they activate.",
      },
      {
        title: "Thin organic engine",
        copy: "Content and technical SEO never compound, so paid channels carry too much weight.",
      },
      {
        title: "Manual GTM ops",
        copy: "Lead routing, onboarding notes and reporting still depend on brittle human glue.",
      },
    ],
    approach: [
      {
        title: "Clarify the product story",
        copy: "Homepage and product pages that communicate problem, mechanism and proof.",
      },
      {
        title: "Build durable acquisition assets",
        copy: "Technical foundations and content systems that earn qualified traffic over time.",
      },
      {
        title: "Automate the handoffs",
        copy: "Connect forms, CRM and internal alerts so momentum survives after the click.",
      },
    ],
    services: [
      { title: "Website Design", href: "/services/websites", copy: "Product marketing sites built to convert." },
      { title: "Custom Applications", href: "/services/app-development", copy: "Portals and internal tools around your workflow." },
      { title: "SEO Growth", href: "/services/seo", copy: "Organic demand capture for product categories." },
      { title: "AI Automation", href: "/services/automation", copy: "GTM and operations workflows that scale." },
    ],
    proofNote: "Engagements stay scoped to commercial outcomes—activation, visibility and operational speed—not vanity redesigns.",
    ctaTitle: "Want a clearer path from visitor to activated customer?",
  },
  {
    slug: "local-service-businesses",
    eyebrow: "For local service businesses",
    title: "Get found locally, look credible online and respond faster.",
    description:
      "Clinics, field services and community organisations win when their digital presence is clear, findable and easy to contact.",
    audience: "Owners of local and multi-location service businesses who need stronger visibility and fewer missed enquiries.",
    challenges: [
      {
        title: "Low local visibility",
        copy: "High-intent searchers cannot find the right pages—or trust what they see.",
      },
      {
        title: "Weak first impression",
        copy: "Slow or unclear websites lose bookings to competitors who simply look more organised.",
      },
      {
        title: "Missed follow-up",
        copy: "Leads arrive into busy days and stall without a reliable response path.",
      },
    ],
    approach: [
      {
        title: "Fix the public face",
        copy: "A fast, clear website that states services, areas served and how to enquire.",
      },
      {
        title: "Improve search visibility",
        copy: "Technical and on-page SEO aimed at the searches your buyers already make.",
      },
      {
        title: "Close the response loop",
        copy: "Simple automation so enquiries get acknowledged and routed quickly.",
      },
    ],
    services: [
      { title: "Website Design", href: "/services/websites", copy: "Local-ready sites that convert browsers into calls." },
      { title: "SEO Growth", href: "/services/seo", copy: "Visibility for service + location demand." },
      { title: "AI Automation", href: "/services/automation", copy: "Faster lead response and follow-up." },
      { title: "Local Support desk", href: "/local-support", copy: "On-the-ground help for essential digital tasks in Nigeria." },
    ],
    proofNote: "For everyday NIN, school portal and document help, use our Local Support desk. For growth systems, use agency services.",
    ctaTitle: "Ready to turn local demand into consistent enquiries?",
  },
];

export function getIndustry(slug: string) {
  return industries.find((page) => page.slug === slug);
}
