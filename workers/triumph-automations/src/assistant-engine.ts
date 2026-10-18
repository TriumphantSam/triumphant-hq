import facts from "../../../content/kb/business.json";

export type Scope = "customer" | "owner";
export type Slot = { start: string; end: string };
export type Intent =
  | "facts"
  | "booking"
  | "human"
  | "payment"
  | "owner_leads"
  | "owner_schedule"
  | "owner_summary"
  | "unsupported";
export type Selection = {
  intent: Intent;
  ids: string[];
  date: string | null;
  period: "any" | "morning" | "afternoon";
};
export type Pending = {
  id: string;
  kind: "booking" | "human";
  detail: string;
  start?: string;
  expires: number;
};
export type State = {
  slots?: Slot[];
  pending?: Pending;
  topic?: string[];
  paused?: boolean;
};
export type Reply = {
  answer: string;
  choices?: { label: string; message: string }[];
  sources?: { id: string; href: string }[];
  pending?: Pending;
  next?: { kind: "booking"; start: string } | { kind: "human" };
  links?: { label: string; href: string }[];
};
export class AssistantError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export type Dependencies = {
  select: (message: string, topic: string[]) => Promise<Selection>;
  slots: () => Promise<Slot[]>;
  owner: (intent: Intent) => Promise<string>;
};
export const lagosDate = (time = Date.now()) =>
  new Date(time + 3600000).toISOString().slice(0, 10);
export const slotLabel = (start: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(start)) + " WAT";
export function validDate(date: string | null) {
  if (date === null) return true;
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    Number.isFinite(Date.parse(date)) &&
    new Date(date).toISOString().slice(0, 10) === date
  );
}
// An allowlist of read operations and reviewed navigation steps, never model-generated code or URLs.
export async function assistantTurn(
  scope: Scope,
  current: State,
  input: {
    message?: string;
    decision?: "confirm" | "cancel";
    pendingId?: string;
  },
  deps: Dependencies,
  now = Date.now(),
): Promise<{ state: State; reply: Reply }> {
  const state: State = { ...current };
  if (input.decision) {
    const pending = state.pending;
    if (!pending || pending.id !== input.pendingId || pending.expires <= now)
      throw new AssistantError(
        "That preview has expired or changed. Ask again before continuing.",
        409,
      );
    delete state.pending;
    if (input.decision === "cancel")
      return {
        state,
        reply: {
          answer: "Preview cancelled. No booking, enquiry or message was sent.",
        },
      };
    if (pending.kind === "booking") {
      const available = await deps.slots();
      if (!available.some((s) => s.start === pending.start))
        return {
          state: {},
          reply: {
            answer:
              "That time is no longer available. Ask for consultation times again; no appointment was reserved.",
          },
        };
      return {
        state: {},
        reply: {
          answer: `Your selected time is ${slotLabel(pending.start!)}. Complete the booking form below to reserve it. Continuing here has not made a reservation or sent an email.`,
          next: { kind: "booking", start: pending.start! },
        },
      };
    }
    return {
      state: { paused: true },
      reply: {
        answer:
          "The enquiry form is ready below. Submitting it stores your enquiry and queues a confirmation and owner alert. No staff member has been notified yet. Automated conversation is paused until you resume.",
        next: { kind: "human" },
      },
    };
  }
  const message = input.message!.trim();
  if (/^(stop|pause)$/i.test(message))
    return {
      state: { paused: true },
      reply: {
        answer:
          "This simulator conversation is paused. No external messaging subscription was changed. Type RESUME when you want to continue.",
      },
    };
  if (/^resume$/i.test(message))
    return {
      state: {},
      reply: {
        answer:
          "Conversation resumed. Ask about services, consultation times or speaking to our team.",
      },
    };
  if (state.paused)
    return {
      state,
      reply: {
        answer:
          "The conversation is paused. Use the enquiry form or type RESUME to continue. No WhatsApp message is sent from this simulator.",
      },
    };
  const match = /^(?:choose\s+|option\s+)?([1-9]|1[0-2])$/i.exec(message);
  if (match && state.slots) {
    const slot = state.slots[Number(match[1]) - 1];
    if (!slot) throw new AssistantError("Choose one of the displayed times.");
    const pending: Pending = {
      id: crypto.randomUUID(),
      kind: "booking",
      detail: `Free 30-minute automation consultation · ${slotLabel(slot.start)}. Next you enter your contact details and explicitly confirm the real booking.`,
      start: slot.start,
      expires: now + 300000,
    };
    return {
      state: { ...state, pending },
      reply: {
        answer:
          "Review this time before opening the booking form. No slot is reserved yet.",
        pending,
      },
    };
  }
  if (/^(yes|confirm|go ahead|okay|ok)$/i.test(message))
    return {
      state,
      reply: {
        answer: state.pending
          ? "Use the review buttons for the specific preview. A message saying yes does not authorise a different action."
          : "There is no current action to confirm. Ask for consultation times or a team handoff first.",
      },
    };
  // New questions replace stale choices and previews. A previous Confirm button cannot act on the new state.
  delete state.pending;
  delete state.slots;
  const selection = await deps.select(message, state.topic || []);
  if (selection.intent.startsWith("owner_")) {
    if (scope !== "owner")
      return {
        state: {},
        reply: {
          answer:
            "Business records and owner commands require the separate signed-in owner workspace. Customer chat cannot grant owner access.",
          links: [{ label: "Owner sign-in", href: "/admin" }],
        },
      };
    return { state: {}, reply: { answer: await deps.owner(selection.intent) } };
  }
  if (selection.intent === "booking") {
    if (!validDate(selection.date))
      throw new AssistantError("Please provide a valid consultation date.");
    const slots = (await deps.slots())
      .filter((s) => {
        const local = new Date(Date.parse(s.start) + 3600000);
        return (
          (!selection.date ||
            lagosDate(Date.parse(s.start)) === selection.date) &&
          (selection.period === "any" ||
            (selection.period === "morning"
              ? local.getUTCHours() < 12
              : local.getUTCHours() >= 12))
        );
      })
      .slice(0, 12);
    return {
      state: { slots, topic: ["booking"] },
      reply: {
        answer: slots.length
          ? "These are currently available free 30-minute consultation times in Lagos. Choose one to review. Availability is checked again before the final booking."
          : "No available times match that request in the next 14 days. Try another weekday or open the booking page. Nothing has been reserved.",
        choices: slots.map((s, i) => ({
          label: `${i + 1}. ${slotLabel(s.start)}`,
          message: String(i + 1),
        })),
        links: [
          { label: "Open availability", href: "/automation-lab/booking" },
        ],
      },
    };
  }
  if (selection.intent === "human") {
    const pending: Pending = {
      id: crypto.randomUUID(),
      kind: "human",
      detail:
        "Open a real enquiry form. You decide what to share and explicitly submit it. Confirmation and owner email are queued only after that submission.",
      expires: now + 300000,
    };
    return {
      state: { pending },
      reply: {
        answer:
          "I can prepare a handoff to the team. Review what happens before continuing.",
        pending,
      },
    };
  }
  if (selection.intent === "payment")
    return {
      state: {},
      reply: {
        answer:
          "The public payment demonstration is a clearly labelled NGN 100 Paystack test checkout. No real money is collected. This conversation cannot verify a payment screenshot, initiate a bank transfer or claim a payment succeeded.",
        links: [
          { label: "Explore test checkout", href: "/automation-lab/payments" },
        ],
      },
    };
  const selected = facts
    .filter((f) => selection.ids.includes(f.id))
    .slice(0, 3);
  if (selection.intent !== "facts" || !selected.length)
    return {
      state: {},
      reply: {
        answer:
          "I cannot verify that from our approved business information. Ask about services, consultation availability or a team handoff. Orders, live invoices, voice notes and bank transfers are not available in this simulator.",
      },
    };
  return {
    state: { topic: selected.map((f) => f.id) },
    reply: {
      answer: selected.map((f) => f.text).join("\n\n"),
      sources: selected.map(({ id, href }) => ({ id, href })),
    },
  };
}
