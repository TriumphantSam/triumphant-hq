export const automationDemos = [
  {
    slug: "whatsapp",
    number: "01",
    title: "A conversation that keeps moving.",
    name: "WhatsApp automation",
    description:
      "Welcome a prospect, answer product questions and offer a clear next step inside WhatsApp.",
    audience: "Shops · farms · service businesses",
    status: "Number connection pending",
    action: "Explore the WhatsApp flow",
    steps: [
      "Send LAB to open the service menu.",
      "Try SERVICES, PRICES, ORDER or BOOK.",
      "Send HUMAN for our team, or STOP to stop bot replies.",
    ],
    note: "Our dedicated business WhatsApp number is +234 909 009 0910. Automated replies are awaiting its Meta API connection. Once activated, LAB opens the service menu; HUMAN requests our team, STOP stops replies and RESUME restarts them. Proactive follow-ups are not enabled.",
  },
  {
    slug: "booking",
    number: "02",
    title: "Less scheduling. More showing up.",
    name: "Booking & reminders",
    description:
      "Let customers choose a time, confirm the appointment and receive timely reminders.",
    audience: "Clinics · salons · schools · gyms",
    status: "Booking & email reminders",
    action: "Explore booking",
    steps: [
      "Choose a free 30-minute automation consultation in Lagos time.",
      "Choose an available time.",
      "Receive email confirmation and reminders; manage or cancel your appointment.",
    ],
    note: "Real consultation bookings: weekdays 10am–4pm WAT, 15-minute buffer, 24 hours’ notice. Email reminders run 24 hours and 2 hours before the call. SMS and WhatsApp reminders are awaiting connection. SEO audit calls keep their existing calendar.",
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
    status: "Interactive sample dashboard",
    action: "Try the reporting demo",
    steps: [
      "Review a clearly labelled sample report.",
      "Record sample sales to trigger a stock alert.",
      "Download the report and try draft approval without publishing.",
    ],
    note: "This public dashboard uses fictional sample data. A private report endpoint reads real leads and bookings; automated owner delivery and a signed-in admin workspace are not enabled yet. Payment and stock reporting await those integrations. Draft approval in this demo publishes nothing.",
  },
] as const;
export type DemoSlug = (typeof automationDemos)[number]["slug"];
