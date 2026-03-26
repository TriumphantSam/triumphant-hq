export type ForgeFaq = {
  question: string;
  answer: string;
};

export type ForgeProduct = {
  slug: string;
  title: string;
  category: string;
  promise: string;
  format: string;
  cta: string;
  featured?: boolean;
  audience: string;
  outcome: string;
  includes: string[];
  pricing: string;
  headline: string;
  subheadline: string;
  problem: string;
  approach: string;
  idealFor: string[];
  deliverables: string[];
  bonuses: string[];
  proofPoints: string[];
  faq: ForgeFaq[];
  primaryAction: string;
  secondaryAction: string;
};

export const forgeProducts: ForgeProduct[] = [
  {
    slug: 'ai-automation-playbooks',
    title: 'AI & Automation Playbooks',
    category: 'AI Systems',
    promise: 'Actionable guides, prompts, checklists, and implementation assets for operators who want systems, not hype.',
    format: 'Ebook bundles, prompt packs, workflows',
    cta: 'Explore the library',
    featured: true,
    audience: 'Creators, freelancers, and operators trying to turn AI into repeatable business systems.',
    outcome: 'A practical path from scattered tools to one usable operating workflow.',
    includes: ['Core ebook', 'Prompt pack', 'Checklist', 'Template support assets'],
    pricing: 'Flagship bundle',
    headline: 'Build an AI operating system that actually reduces chaos.',
    subheadline: 'This product line is designed for people who are tired of collecting tools and want one practical workflow they can implement, reuse, and scale.',
    problem: 'Most AI content stops at prompts. Buyers are left with a long list of tools, no operating system, and no clear path from interest to implementation.',
    approach: 'Digital Forge packages each offer as a usable system: a core guide, execution assets, support templates, and launch-ready language that turns theory into an operating workflow.',
    idealFor: [
      'Operators who need a repeatable AI workflow instead of random experiments.',
      'Freelancers building faster delivery systems for client work.',
      'Small teams trying to document and automate recurring tasks.'
    ],
    deliverables: [
      'A premium ebook that explains the operating model clearly.',
      'A prompt pack that supports implementation, not curiosity.',
      'Checklists and companion assets that reduce friction during setup.',
      'Structured positioning language for promotion and internal rollout.'
    ],
    bonuses: [
      'Quick-start checklist for the first system build.',
      'Template support asset for documenting the workflow.',
      'Offer-ready messaging blocks for distribution and promotion.'
    ],
    proofPoints: [
      'Built from the same research, offer, and packaging system used across Digital Forge.',
      'Structured around practical implementation for non-technical users.',
      'Designed to sit inside a wider product, launch, and distribution workflow.'
    ],
    faq: [
      {
        question: 'Is this for complete beginners?',
        answer: 'Yes, but it assumes the buyer wants implementation help, not just AI news or theory. The assets are designed to reduce setup friction.'
      },
      {
        question: 'Is it just an ebook?',
        answer: 'No. The delivery model is a bundle: the core guide, companion assets, and support materials that help the buyer apply the system.'
      },
      {
        question: 'Who gets the most value from this?',
        answer: 'People who already know AI matters but need a cleaner way to use it inside day-to-day operations.'
      }
    ],
    primaryAction: 'Browse product details',
    secondaryAction: 'View free resources'
  },
  {
    slug: 'productivity-operating-systems',
    title: 'Productivity Operating Systems',
    category: 'Workflow Design',
    promise: 'Templates, playbooks, and execution systems designed to reduce chaos and turn busy work into repeatable operations.',
    format: 'Templates, worksheets, Notion companions',
    cta: 'Browse systems',
    audience: 'Founders, operators, and teams who need clearer execution systems.',
    outcome: 'A calmer, more structured workflow with fewer dropped tasks and less tool chaos.',
    includes: ['Templates', 'Worksheets', 'Planning systems', 'Companion guides'],
    pricing: 'System bundle',
    headline: 'Replace scattered productivity advice with one structured operating rhythm.',
    subheadline: 'These products focus on workflow design, execution clarity, and reusable systems for people whose real problem is operational clutter.',
    problem: 'Most productivity content adds more tools, more dashboards, and more friction. The result is busier-looking systems that still depend on memory and manual cleanup.',
    approach: 'This line turns planning and execution into concrete systems with worksheets, templates, and step-by-step operating assets that are built to be reused.',
    idealFor: [
      'Founders trying to simplify weekly execution.',
      'Teams that need cleaner handoffs and fewer dropped responsibilities.',
      'Operators rebuilding their workflow after tool overload.'
    ],
    deliverables: [
      'Templates for weekly and project-level execution.',
      'Worksheets that help clarify system gaps and bottlenecks.',
      'Notion-style companion structures for repeatable use.',
      'Planning guides that make the workflow easier to maintain.'
    ],
    bonuses: [
      'Quick audit prompts for identifying workflow drag.',
      'Companion setup guide for adapting the system to a team or solo workflow.',
      'Messaging angles for packaging the system as an internal ops asset.'
    ],
    proofPoints: [
      'Focused on fewer moving parts, not more apps.',
      'Useful both for solo operators and small teams.',
      'Pairs naturally with the Digital Forge AI and offer systems.'
    ],
    faq: [
      {
        question: 'Do I need Notion for this?',
        answer: 'No. The thinking works even without it. The assets are meant to be adaptable, not locked into one tool.'
      },
      {
        question: 'Is this only for businesses?',
        answer: 'The strongest fit is operational work, but the same systems can help advanced personal workflows too.'
      },
      {
        question: 'Will this help if my problem is inconsistency?',
        answer: 'Yes. The whole point is to reduce reliance on memory, improvisation, and last-minute recovery.'
      }
    ],
    primaryAction: 'See workflow systems',
    secondaryAction: 'Explore Digital Forge'
  },
  {
    slug: 'creator-business-assets',
    title: 'Creator Business Assets',
    category: 'Digital Products',
    promise: 'Sales assets, offer stacks, launch plans, and product kits built for creators who want faster execution and better packaging.',
    format: 'Sales packs, launch plans, lead magnets',
    cta: 'See business assets',
    audience: 'Digital product creators who want stronger packaging and faster launches.',
    outcome: 'A cleaner offer, sharper positioning, and launch-ready assets without rebuilding from scratch.',
    includes: ['Sales page copy', 'Launch plan', 'Lead magnet ideas', 'Offer stack assets'],
    pricing: 'Business asset pack',
    headline: 'Turn a rough digital product idea into a stronger commercial offer.',
    subheadline: 'This category is for creators who need help with positioning, packaging, launch structure, and the assets that actually move a product into the market.',
    problem: 'A lot of creators can make the product, but they stall when the work shifts to offers, bundles, sales pages, lead magnets, and launch planning.',
    approach: 'Digital Forge fills that gap with prebuilt business assets: offer stacks, launch plans, sales copy, and distribution-ready material that make the selling side far less chaotic.',
    idealFor: [
      'Creators packaging their first serious digital offer.',
      'Operators turning expertise into a commercial product line.',
      'Founders who want cleaner launch and promotion assets.'
    ],
    deliverables: [
      'Offer-stack planning and bundle guidance.',
      'Sales-page structure and reusable messaging blocks.',
      'Launch plan assets for content, traffic, and conversion.',
      'Lead magnet and upsell ideas for a wider product ladder.'
    ],
    bonuses: [
      'Positioning prompts for finding a stronger angle.',
      'Distribution copy for multiple sales channels.',
      'Expansion ideas for future workshops, templates, and premium offers.'
    ],
    proofPoints: [
      'Designed to support both first launches and better relaunches.',
      'Built around the exact asset types that usually delay digital product businesses.',
      'Strong fit for creators who want sharper packaging without hiring a full launch team.'
    ],
    faq: [
      {
        question: 'Can this help if I already have a product?',
        answer: 'Yes. It is just as useful for repackaging weak offers and improving an underperforming launch as it is for building a new one.'
      },
      {
        question: 'Is this only for large audiences?',
        answer: 'No. The materials are especially useful for smaller operators who need better packaging because they do not have audience size to hide weak positioning.'
      },
      {
        question: 'What makes this different from a generic marketing guide?',
        answer: 'It focuses on the exact assets a creator actually needs to launch: the offer, page copy, bonus stack, CTA logic, and distribution plan.'
      }
    ],
    primaryAction: 'Review asset bundle',
    secondaryAction: 'View free resources'
  },
];

export const forgePillars = [
  {
    title: 'Product Library',
    description: 'Premium digital products packaged with prompts, worksheets, resource sheets, and implementation support assets.',
  },
  {
    title: 'Free Resources',
    description: 'Lead magnets, quick-start checklists, and practical learning assets that feed the wider offer ladder.',
  },
  {
    title: 'Digital Product OS',
    description: 'A business system that turns research, packaging, sales copy, launch strategy, and distribution into a repeatable workflow.',
  },
];

export const forgeWorkflow = [
  'Research the niche and identify real pain points.',
  'Build the product and the supporting implementation assets.',
  'Generate the offer, sales page, launch plan, and distribution copy.',
  'Package everything into a structured bundle and export it for review.',
];

export const forgeResources = [
  {
    title: 'Quick-Start Guides',
    description: 'Short practical assets that help visitors get an immediate win and move naturally into the paid product ladder.',
  },
  {
    title: 'Prompt & Template Packs',
    description: 'Reusable business tools for creators, freelancers, and operators who want clearer systems and faster output.',
  },
  {
    title: 'Launch & Offer Frameworks',
    description: 'Sales-page structures, bonus stacks, positioning ideas, and distribution plans built from live product research.',
  },
];

export function getForgeProduct(slug: string) {
  return forgeProducts.find((product) => product.slug === slug);
}

export function getForgeProductSlugs() {
  return forgeProducts.map((product) => product.slug);
}
