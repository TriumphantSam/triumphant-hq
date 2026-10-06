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
      question: "Do you offer website design in Ibadan?",
      answer:
        "Yes. Triumphant HQ is based on Basorun Rd, Ibadan, and website design is a core service. We build conversion-focused Next.js sites for Oyo State businesses—not template packs with a city name swapped in.",
    },
    {
      question: "How is this different from other Ibadan web design agencies?",
      answer:
        "You get one accountable partner for structure, design and production-grade development, plus optional SEO and ongoing care. We will not invent client counts or rankings. Review live work, then book discovery if the fit is real.",
    },
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
      question: "How much does SEO cost in Nigeria?",
      answer:
        "We do not publish a price list. An audit, a site migration and a monthly programme are different pieces of work, and the proposal depends on the number of pages, the cities you need to be found in, and how much technical repair the site needs first. Send a brief or run the free snapshot and we will tell you what the first stage should cover.",
    },
    {
      question: "How long does SEO take to work in Nigeria?",
      answer:
        "Technical repairs and clearer pages can be finished in weeks. Competitive national phrases usually take months of steady work. We do not name a ranking or a date. The monthly report shows what was shipped and what Search Console records.",
    },
    {
      question: "Do you work with businesses in Lagos and Abuja?",
      answer:
        "Yes, remotely. The office is in Ibadan. Lagos, Abuja, Port Harcourt and other cities are delivered by call, shared documents and WhatsApp. We do not pretend to have an office in those cities.",
    },
    {
      question: "Can you rank us on Google Maps in several cities?",
      answer:
        "A Google Business Profile is tied to a real location. We will not build a stack of city pages or profiles for places you do not operate. If you have genuine branches, each profile should match that branch. One Ibadan office cannot honestly occupy the map pack in every Nigerian city.",
    },
    {
      question: "Can you migrate a WordPress site without losing rankings?",
      answer:
        "We plan redirects, keep the URLs that already earn visits, and check Search Console after launch. No migration is risk-free. We would rather keep a healthy WordPress site than rebuild it for the sake of a new stack.",
    },
    {
      question: "Do you optimise for Google AI Overviews and ChatGPT?",
      answer:
        "We make the business easy to quote: one clear name, service pages that answer real questions, FAQs that match the page, and schema that repeats facts already visible on the page. We do not promise a citation in an AI answer.",
    },
    {
      question: "What is included in a monthly SEO programme?",
      answer:
        "A written list of what will be done that month, the technical and on-page work itself, and a short report. The mix depends on the audit. It is not a fixed bundle of blog posts.",
    },
    {
      question: "What do you report each month?",
      answer:
        "What changed on the site, which queries and pages Search Console is showing, and what we recommend next. If you use GA4, we can include organic landing pages. We do not send a ranking screenshot with no context.",
    },
    {
      question: "Do you guarantee number one on Google?",
      answer:
        "No. Search results depend on competition, the usefulness of the page, and work that happens off the site, including reviews and links. We commit to the diagnosis, the agreed work, and an honest report.",
    },
    {
      question: "Who owns the content and the accounts?",
      answer:
        "You do. Search Console, analytics, the domain, the hosting account and the Google Business Profile stay in your name. We ask for access, not ownership.",
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

export const ibadanSeoFaqs: FaqItem[] = [
  {
    question: "How much does SEO cost in Ibadan?",
    answer:
      "We do not publish a price. A one-off audit, a page-and-content project and a monthly programme are different jobs. What we propose depends on how many pages you have, how crowded the searches are, and whether the site needs technical repair before anyone writes a new paragraph. Start with the free snapshot or a short brief. We will say what the first stage should be, and we will not invent a starting fee.",
  },
  {
    question: "How long does SEO take to work for an Ibadan business?",
    answer:
      "Technical fixes and clearer service pages can be done in weeks. Phrases with real competition usually take months of consistent work. We will not promise a position or a date. You should see, in Search Console, which queries and pages are being shown — that is the progress we report, not a guarantee.",
  },
  {
    question: "Can you get my business on Google Maps in Ibadan?",
    answer:
      "We can set up or tidy a Google Business Profile: the right category, services, photos, posts, and a name, address and phone that match the website. Whether you appear in the map pack also depends on reviews, how close the searcher is, and who else is listed. We will not guarantee a map-pack place.",
  },
  {
    question: "What is the difference between local SEO and regular SEO?",
    answer:
      "Local SEO helps nearby people find one business: Google Maps, the Business Profile, consistent contact details, and pages that match Ibadan searches. The rest of SEO is the site itself — technical health, service pages and content for searches that are not tied to one neighbourhood. Most Ibadan firms need both, in that order.",
  },
  {
    question: "Do you guarantee first position on Google?",
    answer:
      "No. A promise of number one is a promise about a result we do not control. We commit to a clear audit, the work we agreed, and a report of what changed. Competition, reviews and links all sit outside a single page edit.",
  },
  {
    question: "Do you work with businesses outside Ibadan, including Oyo, Osun and Lagos?",
    answer:
      "Yes. The office is in Ibadan and day-to-day local work is for Ibadan and Oyo State. Osun, Lagos and other cities are remote engagements. If you want a national programme rather than Ibadan local SEO, use the SEO company in Nigeria page.",
  },
  {
    question: "Can I visit your office? Where are you on Basorun Rd?",
    answer:
      "We are on Basorun Rd, Ibadan 211107, Oyo State, in the Bashorun area. This site does not publish a street number. Message us on WhatsApp before you come so we can confirm we are in. Agency conversations are often a call. The NIN and BVN desk is the separate walk-in service.",
  },
  {
    question: "Do you do SEO for WordPress, Wix and Shopify sites?",
    answer:
      "Yes. We audit and improve WordPress, Wix, Shopify and custom sites, including Next.js. If the platform is blocking crawling, we will say so and scope a repair or a move. We do not push a rebuild when the current site can be fixed.",
  },
  {
    question: "What do you need from me to start?",
    answer:
      "Access to Google Search Console and, if you already have it, analytics. Someone who can approve changes. A plain description of what you sell and where the customers are. For Maps work, access to the Google Business Profile. You do not need a finished brief.",
  },
];

export const localSupportFaqs: FaqItem[] = [
  {
    question: "Can I get NIN enrolment in Ibadan at Triumphant HQ?",
    answer:
      "Yes. Our Local Support desk on Basorun Rd, Ibadan 211107, Oyo assists with NIN enrolment, modifications and slip printing. WhatsApp first so we confirm documents and timing before you visit.",
  },
  {
    question: "Do you also help with BVN in Ibadan?",
    answer:
        "Yes. We support BVN enrolment, consultation, recovery and card printing guidance. This desk is separate from website and SEO projects so identity visits stay focused.",
  },
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
