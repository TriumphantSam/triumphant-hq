export type OfferTier = {
  slug: string;
  label: string;
  href: string;
  eyebrow: string;
  price: string;
  outcome: string;
  description: string;
  includes: string[];
  cta: string;
};

export type OfferModule = {
  title: string;
  description: string;
};

export type OfferFaq = {
  question: string;
  answer: string;
};

export const digitalForgeOfferLadder: OfferTier[] = [
  {
    slug: "blog",
    label: "Blog + Free Resources",
    href: "/blog",
    eyebrow: "Discovery Layer",
    price: "Free",
    outcome: "Build belief, discover practical use cases, and find your first direction.",
    description:
      "Articles, practical breakdowns, and entry resources that help people stop consuming random AI noise and start thinking like operators.",
    includes: [
      "SEO articles built from real product topics",
      "Nigerian, African, and international use-case examples",
      "Internal links into the right product or training path",
    ],
    cta: "Start with the blog",
  },
  {
    slug: "training",
    label: "Free Training",
    href: "/digital-forge/training",
    eyebrow: "Belief Layer",
    price: "Free",
    outcome: "See the framework, the mistakes to avoid, and the real path from idea to income.",
    description:
      "A focused training that explains why most people stay stuck, what actually works now, and how to build a simple AI-powered digital product from Nigeria.",
    includes: [
      "The 3-step Digital Forge framework",
      "Offer and positioning mistakes to avoid",
      "A direct bridge into the flagship starter system",
    ],
    cta: "Watch the training",
  },
  {
    slug: "system",
    label: "Flagship Starter System",
    href: "/digital-forge/system",
    eyebrow: "Core Offer",
    price: "From ₦25,000",
    outcome: "Launch one clear offer with the assets, structure, and operating system to sell it properly.",
    description:
      "The practical implementation pack for creators and operators who want more than inspiration. It turns scattered AI curiosity into one usable product business system.",
    includes: [
      "Core implementation guide",
      "Prompt pack and launch templates",
      "Sales copy frameworks, worksheets, and checklists",
    ],
    cta: "Explore the system",
  },
  {
    slug: "course",
    label: "Digital Forge Course",
    href: "/digital-forge/course",
    eyebrow: "Guided Build Layer",
    price: "From ₦35,000",
    outcome: "Get step-by-step teaching, implementation support assets, and a reusable way to build more products.",
    description:
      "The deeper teaching layer for people who want structure, confidence, and a guided path to packaging, launching, and growing an AI-assisted digital product business.",
    includes: [
      "Recorded modules with implementation flow",
      "Worksheets, prompts, and launch assets",
      "A complete build-package-launch-growth curriculum",
    ],
    cta: "See the course",
  },
];

export const digitalForgeCoreClarification = {
  statement:
    "Digital Forge is a customer-facing education and implementation brand powered by a private internal production machine.",
  customersBuy: [
    "A clear business-building method",
    "Practical implementation systems",
    "Prompts, templates, and checklists",
    "Launch assets and operating documents",
    "Training that helps them build and sell practical digital products",
  ],
  notIncludedByDefault: [
    "Raw access to the private AgentPrinter backend",
    "Raw access to the Airtable control plane",
    "Direct access to the website publishing machine",
    "Private automation credentials or internal orchestration flows",
  ],
};

export const flagshipSystem = {
  name: "Digital Forge Side Hustle Starter System",
  eyebrow: "Flagship System",
  price: "₦25,000 starter positioning",
  promise:
    "Build, package, and sell a practical AI-powered digital product with simple systems, stronger positioning, and launch-ready assets.",
  summary:
    "This is the core paid implementation pack. It is not just a PDF and it is not raw software access. It is the business toolkit that gives a buyer the guide, prompts, assets, and structure to move from idea to sale with less confusion.",
  forWho: [
    "Professionals in Nigeria who want a side hustle that fits real local constraints",
    "Creators with expertise but no clear offer packaging",
    "Operators who know AI matters but need a commercial execution path",
    "Founders who want one first product before building a bigger ecosystem",
  ],
  outcomes: [
    "One clear offer with a believable promise",
    "One digital product bundle with better packaging",
    "One product page or sales path with stronger messaging",
    "One simple promotion and launch workflow",
  ],
  deliverables: [
    "Core implementation guide",
    "Starter prompt pack",
    "Offer and packaging templates",
    "Launch checklist",
    "Sales copy framework",
    "Funnel planning worksheet",
    "Distribution plan",
    "Optional audio companion and mini onboarding layer",
  ],
  modules: [
    {
      title: "Choose The Angle",
      description:
        "Narrow down one audience, one problem, one promise, and one realistic first offer instead of trying to sell to everyone.",
    },
    {
      title: "Build The Product",
      description:
        "Create the guide, prompt pack, checklist, template, and supporting assets that make the bundle feel implementation-ready.",
    },
    {
      title: "Package The Offer",
      description:
        "Strengthen naming, messaging, headline, promise clarity, bonus logic, and why someone should buy now.",
    },
    {
      title: "Launch Simply",
      description:
        "Use blog content, free training, direct-response content, and message-based selling to move from attention to conversion.",
    },
  ] satisfies OfferModule[],
  bonuses: [
    "Execution worksheet for 7-day, 14-day, and 30-day rollout planning",
    "CTA and content hook ideas for WhatsApp, Telegram, and social channels",
    "Implementation-first templates designed to reduce tool chaos",
  ],
  faq: [
    {
      question: "Is this just an ebook?",
      answer:
        "No. The system is the practical toolkit layer: guide, prompts, templates, checklists, launch assets, and workflow support documents.",
    },
    {
      question: "Do I get the private internal software itself?",
      answer:
        "Not by default. Buyers get the method, the assets, and the operating logic, not raw access to the private production backend.",
    },
    {
      question: "Who should buy this instead of the course?",
      answer:
        "People who want the practical business toolkit and a faster path to action without needing the full deeper teaching layer yet.",
    },
  ] satisfies OfferFaq[],
};

export const trainingOffer = {
  name: "How To Build and Sell Your First AI-Powered Digital Product From Nigeria",
  eyebrow: "Webinar / Free Training",
  duration: "25 to 45 minutes",
  format: "Slide + screen + voice",
  promise:
    "See the Digital Forge method, understand why most people stay stuck, and learn the clearest path from AI curiosity to a product that can actually sell.",
  whyItExists:
    "The training is the trust-building bridge between free discovery content and the starter system. It creates clarity, belief, and a natural reason to buy the next step.",
  audience: [
    "Nigerian professionals exploring a realistic AI side hustle",
    "African creators trying to package expertise into offers",
    "Global operators who want simple systems over hype",
  ],
  curriculum: [
    {
      title: "Why Most People Stay Stuck",
      description:
        "Too many tools, weak packaging, no system, and content that never leads to a clear offer.",
    },
    {
      title: "Why The Opportunity Is Still Real",
      description:
        "Digital products still work, AI lowers creation friction, and practical offers still beat noise when the packaging is strong.",
    },
    {
      title: "The Digital Forge Framework",
      description:
        "Choose the angle, build the product, and promote the offer with a simple execution rhythm.",
    },
    {
      title: "What The Full System Gives You",
      description:
        "The complete guide, prompts, templates, launch logic, and implementation support assets needed to move faster.",
    },
  ] satisfies OfferModule[],
  takeaways: [
    "A clear 3-step framework",
    "A better sense of what to sell first",
    "Real mistakes to avoid before wasting time",
    "A direct next step into the flagship starter system or course",
  ],
  faq: [
    {
      question: "Is this free or paid?",
      answer:
        "The core version is positioned as free evergreen training for list building and trust. A paid workshop layer can be added later.",
    },
    {
      question: "Is this hype-heavy?",
      answer:
        "No. The training is direct, practical, and structured to sound like a serious operator teaching a usable framework.",
    },
  ] satisfies OfferFaq[],
};

export const courseOffer = {
  name: "Digital Forge Course",
  eyebrow: "Guided Course",
  price: "₦35,000 to ₦60,000 recommended launch band",
  promise:
    "Build, package, launch, and grow a practical AI-assisted digital product business using simple systems, local-reality-aware execution, and reusable assets.",
  summary:
    "The course is the guided teaching layer above the starter system. The ebook gives the map. The training gives belief. The system gives the toolkit. The course walks the student through the full build-package-launch-growth path.",
  outcome:
    "By the end of the course, the student should have one clear offer, one finished or near-finished product, one product page, one content plan, one simple funnel path, and one repeatable operating method.",
  assets: [
    "Recorded modules",
    "Workbook",
    "Templates and prompt packs",
    "SOPs and launch checklists",
    "Naming, CTA, and content planning worksheets",
    "Optional bonus live Q&A layer",
  ],
  modules: [
    {
      title: "The Opportunity and Positioning",
      description:
        "Choose the right audience, pain point, and promise so the offer feels believable and commercially useful.",
    },
    {
      title: "Offer Design",
      description:
        "Pick the right product form, bundle correctly, and build a ladder that can support future products.",
    },
    {
      title: "Product Creation",
      description:
        "Structure the guide, prompt pack, checklists, and templates so the product feels implementation-first.",
    },
    {
      title: "AI Workflow Use",
      description:
        "Use AI without sounding robotic, choose a small tool stack, and keep the process simple enough to sustain.",
    },
    {
      title: "Packaging and Messaging",
      description:
        "Strengthen titles, headlines, positioning, CTA logic, and proof framing for better conversion.",
    },
    {
      title: "Funnel and Launch",
      description:
        "Use lead magnets, free training, product pages, and follow-up logic to move people toward the offer.",
    },
    {
      title: "Promotion",
      description:
        "Build content pillars, short-form prompts, and direct-response messaging that lead to sales instead of vanity activity.",
    },
    {
      title: "Fulfillment and Operations",
      description:
        "Set up delivery, support, file structure, updates, and a repeatable workflow that reduces operational drag.",
    },
    {
      title: "Scaling",
      description:
        "Turn one product into a wider ecosystem with second products, upsells, automation, and a content-to-offer flywheel.",
    },
  ] satisfies OfferModule[],
  faq: [
    {
      question: "How is the course different from the starter system?",
      answer:
        "The system is the toolkit. The course is the guided teaching layer that walks students through the toolkit and the full execution path in more depth.",
    },
    {
      question: "Can this be hosted on Expernaire or your own platform?",
      answer:
        "Yes. The course structure is designed to work as recorded modules plus worksheets and assets, so it can live on Expernaire now and later on your own learning platform too.",
    },
  ] satisfies OfferFaq[],
};

export const premiumOffersNow = [
  {
    name: "Templates Pack",
    price: "₦5,000 to ₦15,000",
    readiness: "Can sell now",
    description:
      "Planning sheets, launch templates, prompt worksheets, and reusable assets for low-friction implementation.",
  },
  {
    name: "SOP Bundle",
    price: "₦15,000 to ₦40,000",
    readiness: "Can sell now",
    description:
      "Operational documents for product creation, packaging, launch, fulfillment, and repeatable execution.",
  },
  {
    name: "Automation Blueprint",
    price: "₦25,000 to ₦75,000",
    readiness: "Can sell now",
    description:
      "Architecture, flows, diagrams, stack recommendations, and rebuild logic without giving away the machine itself.",
  },
  {
    name: "Cloneable Dashboard",
    price: "₦20,000 to ₦60,000",
    readiness: "Soon, after cleanup",
    description:
      "A customer-safe operating dashboard version for tracking launches, products, and workflow states.",
  },
  {
    name: "Cloneable Airtable Base",
    price: "₦30,000 to ₦100,000",
    readiness: "Soon, after simplification",
    description:
      "A sanitized Airtable system with documentation, starter records, and safe field structure for customers.",
  },
  {
    name: "Licensed / Operator Version",
    price: "₦150,000 to ₦500,000+",
    readiness: "Later",
    description:
      "A heavily productized premium version with setup guidance, support boundaries, and internal business use logic.",
  },
];
