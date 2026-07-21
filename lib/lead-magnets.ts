export type ChecklistQuestion = {
  id: string;
  prompt: string;
  weight?: number;
};

export type ChecklistBand = {
  min: number;
  max: number;
  label: string;
  summary: string;
  nextStep: string;
};

export type ChecklistMagnet = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  relatedService: string;
  relatedServiceHref: string;
  questions: ChecklistQuestion[];
  bands: ChecklistBand[];
};

export const websiteScorecard: ChecklistMagnet = {
  slug: "website-scorecard",
  eyebrow: "Free website scorecard",
  title: "Score your website the way a serious buyer experiences it.",
  description:
    "Answer ten questions honestly. You will get a clarity score and the few priorities that usually unlock better trust and enquiries.",
  relatedService: "Website Design",
  relatedServiceHref: "/services/websites",
  questions: [
    {
      id: "offer",
      prompt: "Can a first-time visitor understand what you offer within five seconds on the homepage?",
    },
    {
      id: "audience",
      prompt: "Is it obvious who the site is for—and who it is not for?",
    },
    {
      id: "proof",
      prompt: "Do you show credible proof (work, logos, outcomes or testimonials) near key decision points?",
    },
    {
      id: "cta",
      prompt: "Is there one clear primary action on every important page?",
    },
    {
      id: "mobile",
      prompt: "Does the site feel fast and easy to use on a phone?",
    },
    {
      id: "nav",
      prompt: "Can someone find services, proof and contact without hunting through menus?",
    },
    {
      id: "trust",
      prompt: "Do contact details, professionalism and content quality match the price point of your offer?",
    },
    {
      id: "seo-basics",
      prompt: "Do key pages have clear titles, headings and unique content that match what buyers search for?",
    },
    {
      id: "forms",
      prompt: "Are enquiry forms short, working and followed by a clear confirmation of what happens next?",
    },
    {
      id: "maintain",
      prompt: "Can your team update content without breaking layout or waiting weeks for a developer?",
    },
  ],
  bands: [
    {
      min: 0,
      max: 39,
      label: "Foundation gaps",
      summary:
        "Visitors are likely confused or unconvinced before they ever reach your offer. Clarity, trust and conversion basics need attention before traffic spend or cosmetic redesigns will help.",
      nextStep:
        "Prioritise message clarity, proof and a single strong call to action—then address speed and structure.",
    },
    {
      min: 40,
      max: 69,
      label: "Mixed signals",
      summary:
        "Parts of the site work, but inconsistency is costing you enquiries. Buyers may understand you eventually—yet friction, weak proof or muddy CTAs still leak demand.",
      nextStep:
        "Tighten homepage narrative, strengthen proof near CTAs and remove anything that competes with the primary action.",
    },
    {
      min: 70,
      max: 100,
      label: "Strong base",
      summary:
        "You have a credible foundation. The opportunity is usually refinement: sharper positioning, faster performance, better SEO structure or converting more of the traffic you already earn.",
      nextStep:
        "Focus on conversion polish, technical performance and content that captures high-intent search demand.",
    },
  ],
};

export const automationChecklist: ChecklistMagnet = {
  slug: "automation-checklist",
  eyebrow: "Free automation readiness checklist",
  title: "Find out if your workflow is ready to automate.",
  description:
    "Great automations start with clear processes. Score your readiness before you invest in integrations that fail quietly.",
  relatedService: "AI Automation",
  relatedServiceHref: "/services/automation",
  questions: [
    {
      id: "repeat",
      prompt: "Does this process happen at least several times a week in a similar way?",
    },
    {
      id: "rules",
      prompt: "Can you describe the happy path in clear steps without relying on one person’s memory?",
    },
    {
      id: "exceptions",
      prompt: "Do you know which exceptions should stay human (approvals, edge cases, sensitive judgement)?",
    },
    {
      id: "tools",
      prompt: "Do the tools involved already hold the data you need—or is information trapped in chat and inboxes?",
    },
    {
      id: "source",
      prompt: "Is there a reliable trigger (form submit, status change, email, schedule) that can start the workflow?",
    },
    {
      id: "owner",
      prompt: "Is there a named owner who will maintain the process after automation goes live?",
    },
    {
      id: "quality",
      prompt: "Would a wrong or delayed step create meaningful cost, lost leads or team frustration?",
    },
    {
      id: "access",
      prompt: "Can you grant API or account access to the systems that need to connect?",
    },
    {
      id: "measure",
      prompt: "Do you know what “success” looks like (time saved, faster response, fewer missed follow-ups)?",
    },
    {
      id: "stable",
      prompt: "Is the underlying process stable enough that you are not redesigning it every week?",
    },
  ],
  bands: [
    {
      min: 0,
      max: 39,
      label: "Not ready yet",
      summary:
        "Automation would likely amplify confusion. Document the process, clean the handoffs and decide ownership before connecting tools.",
      nextStep:
        "Map the workflow on paper first. Automate only after the path is clear and exceptions are defined.",
    },
    {
      min: 40,
      max: 69,
      label: "Partially ready",
      summary:
        "You have a real opportunity, but gaps in data, ownership or exception handling will cause fragile automations.",
      nextStep:
        "Pick one high-volume path, tighten the trigger and data quality, then automate that slice before expanding.",
    },
    {
      min: 70,
      max: 100,
      label: "Ready to build",
      summary:
        "Your process is clear enough to justify focused automation. The risk now is over-scoping—start with the workflow that returns time every week.",
      nextStep:
        "Prioritise one revenue or operations workflow, define success metrics and build with monitoring from day one.",
    },
  ],
};

export const appReadiness: ChecklistMagnet = {
  slug: "app-readiness",
  eyebrow: "Free build readiness check",
  title: "Check whether custom software is the right next move.",
  description:
    "Custom apps succeed when the problem, users and first release are clear. These questions surface gaps before you spend on the wrong build.",
  relatedService: "Custom Applications",
  relatedServiceHref: "/services/app-development",
  questions: [
    {
      id: "problem",
      prompt: "Can you describe the operational problem in one sentence without naming a specific technology?",
    },
    {
      id: "users",
      prompt: "Do you know exactly who will use the system and how often?",
    },
    {
      id: "today",
      prompt: "Is the current workaround (spreadsheets, chat, email, tools) clearly failing in cost, speed or errors?",
    },
    {
      id: "off-shelf",
      prompt: "Have you checked whether an existing SaaS tool could cover 80% of the need with configuration?",
    },
    {
      id: "mvp",
      prompt: "Can you define a first release that is useful even if it does not include every feature idea?",
    },
    {
      id: "data",
      prompt: "Do you know what data must be stored, who can see it and where it lives today?",
    },
    {
      id: "decision",
      prompt: "Is there a decision-maker who can prioritise scope without weeks of internal delay?",
    },
    {
      id: "integrate",
      prompt: "Does the app need to connect to existing systems—and do you control access to those systems?",
    },
    {
      id: "success",
      prompt: "Will you know within 30–60 days of launch whether the first version is working?",
    },
    {
      id: "operate",
      prompt: "Is someone prepared to own day-to-day use, feedback and iteration after launch?",
    },
  ],
  bands: [
    {
      min: 0,
      max: 39,
      label: "Discovery first",
      summary:
        "A custom build would be premature. You still need sharper problem definition, user clarity or proof that simpler tools will not suffice.",
      nextStep:
        "Run a product discovery workshop before engineering. Clarify the workflow and the smallest useful release.",
    },
    {
      min: 40,
      max: 69,
      label: "Almost ready",
      summary:
        "There is a real software opportunity, but scope risk is high. Tighten the MVP, data model and ownership before full build.",
      nextStep:
        "Write a one-page brief: users, must-have flows, integrations and success criteria—then validate it in discovery.",
    },
    {
      min: 70,
      max: 100,
      label: "Ready to scope",
      summary:
        "You have enough clarity to brief a serious build. The next step is a structured technical plan and phased delivery—not a feature free-for-all.",
      nextStep:
        "Book discovery to confirm architecture, timeline and the first release that creates measurable operational value.",
    },
  ],
};

export const checklistMagnets = [websiteScorecard, automationChecklist, appReadiness];

export function getChecklistMagnet(slug: string) {
  return checklistMagnets.find((magnet) => magnet.slug === slug);
}

export function scoreChecklist(answers: Record<string, boolean | null>, questions: ChecklistQuestion[]) {
  const answered = questions.filter((q) => answers[q.id] === true || answers[q.id] === false);
  if (answered.length === 0) return { score: 0, answered: 0, total: questions.length };
  const yesCount = answered.filter((q) => answers[q.id] === true).length;
  const score = Math.round((yesCount / answered.length) * 100);
  return { score, answered: answered.length, total: questions.length };
}

export function bandForScore(score: number, bands: ChecklistBand[]) {
  return bands.find((band) => score >= band.min && score <= band.max) ?? bands[bands.length - 1];
}
