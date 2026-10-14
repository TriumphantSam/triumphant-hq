export const automationDemos = [
  {
    slug: "whatsapp",
    number: "01",
    title: "A conversation that keeps moving.",
    name: "WhatsApp automation",
    description:
      "Welcome a prospect, answer product questions and offer a clear next step inside WhatsApp.",
    audience: "Shops · farms · service businesses",
    status: "Existing product bot",
    action: "Explore the WhatsApp flow",
    steps: [
      "Open the business WhatsApp conversation.",
      "Ask about the current product offer.",
      "See the reply and the next step.",
    ],
    note: "The existing WhatsApp bot serves the GIS Field Handbook offer. The new service menu, catalogue, booking and consent-based follow-ups are pending integration.",
  },
  {
    slug: "booking",
    number: "02",
    title: "Less scheduling. More showing up.",
    name: "Booking & reminders",
    description:
      "Let customers choose a time, confirm the appointment and receive timely reminders.",
    audience: "Clinics · salons · schools · gyms",
    status: "Existing booking link",
    action: "Explore booking",
    steps: [
      "Open the existing booking calendar.",
      "Choose an available time.",
      "Review the provider’s confirmation.",
    ],
    note: "Audit calls currently use Cal.com. Native appointment capacity, SMS and WhatsApp reminders are not connected yet.",
  },
  {
    slug: "lead-capture",
    number: "03",
    title: "An enquiry becomes a next step.",
    name: "Lead capture",
    description:
      "Save an enquiry, mirror it to a Sheet and queue a reply and an owner alert.",
    audience: "Any business receiving enquiries",
    status:
      process.env.AUTOMATION_API_BASE && process.env.AUTOMATION_HMAC_SECRET
        ? "Connected enquiry form"
        : "Integration required",
    action: "Try the enquiry form",
    steps: [
      "Submit a real enquiry with your email.",
      "See whether it was saved.",
      "Check delivery status when the automation service is connected.",
    ],
    note: "This sends a real enquiry. Storage confirmation is separate from email and Sheet delivery; no contact details are published.",
  },
  {
    slug: "chat",
    number: "04",
    title: "Helpful answers, any time.",
    name: "AI chat assistant",
    description:
      "Answer from approved business information and connect people with a human when needed.",
    audience: "Service teams · schools · online shops",
    status: "Coming next",
    action: "Explore the assistant",
    steps: [
      "Ask a question about a service.",
      "Get an answer grounded in approved information.",
      "Request a human conversation.",
    ],
    note: "The AI assistant needs an approved knowledge base and provider configuration before it can be tried live. Ask us directly on WhatsApp in the meantime.",
  },
  {
    slug: "payments",
    number: "05",
    title: "From payment to proof.",
    name: "Payments & receipts",
    description:
      "Confirm a payment with the provider, issue a receipt and track unpaid invoices.",
    audience: "Shops · schools · professional services",
    status: "Test integration pending",
    action: "Explore payments",
    steps: [
      "Choose the clearly labelled ₦100 test product.",
      "Complete Paystack test checkout.",
      "View a verified receipt.",
    ],
    note: "Paystack test checkout is not connected. This page collects no payment or card details. The test flow must pass webhook replay and payment verification tests before launch.",
  },
  {
    slug: "reviews",
    number: "06",
    title: "Every customer gets a voice.",
    name: "Review requests",
    description:
      "Invite honest reviews after a completed service, with private feedback available to everyone.",
    audience: "Local businesses · clinics · salons",
    status: "Business profile required",
    action: "Explore reviews",
    steps: [
      "Receive a request after a completed service.",
      "Choose a rating and optional feedback.",
      "Access the same Google review option at every rating.",
    ],
    note: "A confirmed Google Business Place ID is required. Low ratings will have the same Google review option as high ratings; private feedback is an additional choice.",
  },
  {
    slug: "admin",
    number: "07",
    title: "See the day before it starts.",
    name: "Reports & admin",
    description:
      "Bring leads, bookings, payments and stock into a daily operational report.",
    audience: "Owners · operators · small teams",
    status: "Sample workflow",
    action: "Explore the reporting flow",
    steps: [
      "Review a daily operational summary.",
      "Check stock alerts that need action.",
      "Approve social drafts before publishing.",
    ],
    note: "Live reports need connected business data. Social drafts always need owner approval. No sample numbers are presented as business results.",
  },
] as const;
export type DemoSlug = (typeof automationDemos)[number]["slug"];
