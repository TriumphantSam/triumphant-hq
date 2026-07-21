export type FaqItem = {
  question: string;
  answer: string;
};

export const contactFaqs: FaqItem[] = [
  {
    question: "How quickly will you respond?",
    answer:
      "We review every project enquiry and reply within one business day with a clear next step—usually a short discovery call or clarifying questions so we can scope properly.",
  },
  {
    question: "Do I need a full brief before we talk?",
    answer:
      "No. A clear description of the problem, the outcome you want and your timing is enough. We use discovery to fill in technical detail, constraints and priorities before any proposal.",
  },
  {
    question: "How does pricing work?",
    answer:
      "We confirm scope after discovery and share a written proposal with timeline and deliverables before work begins. You will not be asked to commit to an open-ended engagement without clarity.",
  },
  {
    question: "Do you work remotely or only locally?",
    answer:
      "Most engagements are delivered remotely with clear communication and documented progress. Local support in Nigeria is available for organisations that need on-the-ground digital services—see Local Support for those offerings.",
  },
  {
    question: "What do you need from our side to move fast?",
    answer:
      "Access to the people who own the problem, existing brand or content assets where relevant, and timely decisions on priorities. The better the context, the sharper the proposal and the faster delivery can start.",
  },
  {
    question: "What if we are not sure which service we need?",
    answer:
      "Choose “Not sure yet” on the form or book a discovery call. We will help you decide whether the priority is a website, custom application, SEO, automation—or a connected programme across more than one.",
  },
];

export const serviceFaqs: Record<string, FaqItem[]> = {
  websites: [
    {
      question: "How long does a website project usually take?",
      answer:
        "Most focused marketing sites move from discovery to launch in roughly four to eight weeks, depending on content readiness, design complexity and feedback speed. Larger or content-heavy builds are scoped with a clear phased timeline after discovery.",
    },
    {
      question: "What do you need from us to start?",
      answer:
        "A clear sense of who you serve and what the site must achieve, plus any existing brand assets, copy drafts or competitor references. We handle information architecture, design and development—you stay close to messaging and approvals.",
    },
    {
      question: "Will the site be fast and mobile-ready?",
      answer:
        "Yes. We build production-grade Next.js sites with performance, mobile experience and technical SEO foundations treated as part of delivery—not optional extras.",
    },
    {
      question: "Can you rebuild an outdated or poorly performing site?",
      answer:
        "That is a core engagement type. We often migrate legacy hosting and rigid templates to a modern architecture that is easier to maintain, faster to load and properly crawlable for search.",
    },
    {
      question: "Do you only design, or do you also write content?",
      answer:
        "We shape structure, messaging hierarchy and conversion paths. You can supply copy, collaborate with us on key pages, or we can recommend a content approach during discovery based on what the project needs.",
    },
    {
      question: "How do revisions and launch support work?",
      answer:
        "Feedback rounds are planned into the timeline. Before launch we run quality checks; after launch we help with analytics setup and a practical handover so your team knows how to update and measure the site.",
    },
  ],
  "app-development": [
    {
      question: "When is a custom app the right choice?",
      answer:
        "When off-the-shelf tools force workarounds, fragment your data or cannot support a validated workflow. If a simple website or automation will solve the problem, we will say so—custom software should earn its complexity.",
    },
    {
      question: "How long does an application engagement take?",
      answer:
        "Timelines depend on scope. A focused portal or internal tool may ship in phases over several weeks; larger platforms are planned in iterative releases. Discovery produces a realistic roadmap before development begins.",
    },
    {
      question: "What do you need from our team?",
      answer:
        "Clarity on the users, the workflow that hurts today, and what “done” looks like for the first release. Access to stakeholders who can decide on priorities is more important than a perfect technical specification on day one.",
    },
    {
      question: "Do you build mobile apps, web apps or both?",
      answer:
        "We design around the real usage context—secure web applications, dashboards and hybrid approaches when mobile reach matters. The stack follows the product requirements, not a one-size template.",
    },
    {
      question: "How do you handle security and data?",
      answer:
        "Security, permissions and reliable data models are part of planning—not an afterthought. We document architecture decisions and hand over systems your team can operate with confidence.",
    },
    {
      question: "What happens after launch?",
      answer:
        "We support launch, documentation and a period of stabilisation. Ongoing improvement can continue in focused iterations as usage reveals what to refine next.",
    },
  ],
  seo: [
    {
      question: "How soon can we expect SEO results?",
      answer:
        "Technical fixes and on-page clarity can improve crawlability and relevance relatively quickly. Rankings and compounding traffic typically take sustained execution over months. We set expectations around foundations first, then growth—not overnight promises.",
    },
    {
      question: "What is included in ongoing SEO work?",
      answer:
        "Technical health, search opportunity mapping, on-page and content execution, and accountable reporting. Exact priorities depend on your audit findings and commercial goals.",
    },
    {
      question: "Do you work with Google only, or AI search as well?",
      answer:
        "We build for durable organic visibility across classic search and the emerging AI-powered discovery landscape—technical clarity, useful content and entity signals that help both engines and assistants understand your offer.",
    },
    {
      question: "What do you need access to?",
      answer:
        "Typically Search Console, analytics, CMS or hosting access where required, and a point of contact who can approve content and technical changes. We keep requests proportionate to the work.",
    },
    {
      question: "Can we start with a free snapshot?",
      answer:
        "Yes. Run the free SEO visibility snapshot for a practical first read of technical health and priority gaps—without a retainer commitment. From there we can recommend a focused engagement if it makes sense.",
    },
    {
      question: "Do you guarantee number-one rankings?",
      answer:
        "No responsible partner should. Search rankings depend on competition, demand and consistency. We commit to clear diagnosis, disciplined execution and transparent reporting—not vanity guarantees.",
    },
  ],
  automation: [
    {
      question: "What kinds of processes are good candidates for automation?",
      answer:
        "Repetitive handoffs, lead follow-up, data entry between tools, reporting and status updates. If a process is high-volume, rule-based and painful when skipped, it is usually worth mapping.",
    },
    {
      question: "How long does an automation project take?",
      answer:
        "Focused workflow automations often move from audit to live use within a few weeks. Multi-system programmes are phased so you get useful wins early without boiling the ocean.",
    },
    {
      question: "Will automation replace our team?",
      answer:
        "The goal is to remove repetitive work so people can focus on judgement, relationships and exceptions. We design with oversight—human review where quality or compliance matters.",
    },
    {
      question: "What tools do you integrate with?",
      answer:
        "We connect the stack you already use where possible—CRMs, forms, email, spreadsheets, messaging and internal tools—via APIs and webhooks. Tool choice follows the workflow, not the other way around.",
    },
    {
      question: "What do you need from us to succeed?",
      answer:
        "A walkthrough of the current process, access to the relevant tools and someone who owns the outcome. Cleaner process clarity produces better automation than guessing from screenshots alone.",
    },
    {
      question: "How do you keep automations reliable after launch?",
      answer:
        "We test with real cases, document how the system works and set monitoring where failures would hurt. Handover includes what to watch and how to request changes as the business evolves.",
    },
  ],
};

export type LeadMagnetMeta = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
};

export const localSupportFaqs: FaqItem[] = [
  {
    question: "Where is Triumphant HQ for NIN and BVN support in Ibadan?",
    answer:
      "We are based at Basorun Rd, Ibadan 211107, Oyo. Message us on WhatsApp first so we confirm requirements, documents and timing before you visit.",
  },
  {
    question: "Do you serve Akobo and Bashorun for NIN enrolment?",
    answer:
      "Yes. Residents around Akobo, Bashorun, Bodija, Challenge, Ojoo and other Ibadan neighbourhoods use our local desk for NIN enrolment, modifications and slip printing. WhatsApp us before you come.",
  },
  {
    question: "Can people from Oyo town or elsewhere in Oyo State get help?",
    answer:
      "Yes. We support clients across Oyo State from our Ibadan base. For identity services, message us first so we can confirm what is possible in-person versus guided remotely.",
  },
  {
    question: "Do you help clients in Osogbo, Ile-Ife or Osun State?",
    answer:
      "Agency work—websites, SEO, apps and automation—is delivered for Osun State organisations remotely with clear WhatsApp coordination. Local NIN and BVN support is centred on our Ibadan desk; ask us what is practical for your case.",
  },
  {
    question: "Is Local Support available nationwide across Nigeria?",
    answer:
      "Our growth agency serves clients across Nigeria. The Local Support desk for NIN, BVN and everyday digital tasks is based in Ibadan. Nationwide clients usually engage us for websites, SEO, applications and automation.",
  },
  {
    question: "Should I walk in without messaging first?",
    answer:
      "Please WhatsApp first. We confirm availability, what to bring and the right service path—especially for NIN and BVN—so you do not waste a trip.",
  },
];

export const serviceLeadMagnets: Record<string, LeadMagnetMeta> = {
  websites: {
    href: "/website-scorecard",
    eyebrow: "Free website scorecard",
    title: "See where your site earns trust—and where it leaks enquiries.",
    description:
      "A practical self-assessment across clarity, speed, trust signals and conversion. No login. Instant priorities.",
    cta: "Run my website scorecard",
  },
  "app-development": {
    href: "/app-readiness",
    eyebrow: "Free build readiness check",
    title: "Is your idea ready for custom software—or still a workflow problem?",
    description:
      "Ten questions that reveal whether you need a custom application, a simpler automation, or sharper discovery first.",
    cta: "Check my build readiness",
  },
  seo: {
    href: "/seo-snapshot",
    eyebrow: "Free SEO visibility snapshot",
    title: "Find the gaps limiting your search visibility.",
    description:
      "A fast technical and visibility read—blockers, opportunities and a clear next step without a retainer.",
    cta: "Run my free snapshot",
  },
  automation: {
    href: "/automation-checklist",
    eyebrow: "Free automation readiness checklist",
    title: "Discover which workflows are ready to automate—and which are not.",
    description:
      "Score process clarity, tool fit and repetition so you invest in automations that stick.",
    cta: "Start the checklist",
  },
};
