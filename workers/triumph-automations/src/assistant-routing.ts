import { lagosDate, type Selection } from "./assistant-engine";

// High-confidence language patterns take precedence over probabilistic routing.
// Replies and navigation remain server-authored, and ambiguous requests still use AI.
export function conservativeIntent(
  message: string,
  now = Date.now(),
): Selection | null {
  const pick = (
    intent: Selection["intent"],
    ids: string[] = [],
  ): Selection => ({ intent, ids, date: null, period: "any" });
  if (
    /\b(?:transfer|withdraw|payroll)\b|\bsend\s+(?:me\s+)?(?:money|\d[\d,]*\s*(?:naira|ngn))\b/i.test(
      message,
    )
  )
    return pick("unsupported");
  if (
    /\b(?:human|real person|speak to (?:a person|someone|the team)|talk to (?:a person|someone|the team))\b/i.test(
      message,
    )
  )
    return pick("human");
  if (
    /\b(?:new|unanswered|uncontacted)\s+(?:enquiries|inquiries|leads)\b/i.test(
      message,
    )
  )
    return pick("owner_leads");
  if (
    /tomorrow'?s?\s+(?:appointments|bookings|schedule)|(?:appointments|bookings|schedule)\s+(?:for\s+)?tomorrow/i.test(
      message,
    )
  )
    return pick("owner_schedule");
  if (
    /today'?s?\s+(?:summary|report)|(?:summary|report)\s+(?:for\s+)?today/i.test(
      message,
    )
  )
    return pick("owner_summary");
  if (
    /\b(?:test|try|demo)\b.*\b(?:payment|checkout)\b|\b(?:payment|checkout)\b.*\b(?:test|try|demo|link)\b/i.test(
      message,
    )
  )
    return pick("payment");
  if (
    /\b(?:cancel|reschedule)\b.*\b(?:booking|appointment|consultation)\b/i.test(
      message,
    )
  )
    return pick("unsupported");
  if (
    /\b(?:booking|consultation|appointment)\b/i.test(message) &&
    /\b(?:policy|hours|buffer|notice|duration|cost|price)\b|how long|how much/i.test(
      message,
    )
  )
    return pick("facts", ["booking"]);
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const weekday = new RegExp(`\\b(${dayNames.join("|")})\\b`, "i").exec(
    message,
  );
  const book =
    /\b(?:book|booking|reserve|schedule|appointment|consultation)\b/i.test(
      message,
    ) ||
    /\bavailable\b.*\b(?:times|slots)\b/i.test(message) ||
    (Boolean(weekday || /\b(?:tomorrow|today)\b/i.test(message)) &&
      /\b(?:talk|discuss|meet|call|chat)\b/i.test(message));
  if (book) {
    if (/\b(?:month|year|yesterday|last week)\b/i.test(message)) return null;
    const r = pick("booking"),
      local = new Date(lagosDate(now) + "T00:00:00Z");
    if (/\bafternoon\b/i.test(message)) r.period = "afternoon";
    else if (/\bmorning\b/i.test(message)) r.period = "morning";
    const explicit = /\b\d{4}-\d{2}-\d{2}\b/.exec(message);
    if (explicit) r.date = explicit[0];
    else if (/\bday after tomorrow\b/i.test(message))
      r.date = lagosDate(now + 2 * 86400000);
    else if (/\btomorrow\b/i.test(message)) r.date = lagosDate(now + 86400000);
    else if (/\btoday\b/i.test(message)) r.date = lagosDate(now);
    else if (weekday) {
      const delta =
        (dayNames.indexOf(weekday[1].toLowerCase()) - local.getUTCDay() + 7) %
        7;
      r.date = lagosDate(
        now + (delta || (/\bnext\b/i.test(message) ? 7 : 0)) * 86400000,
      );
    }
    return r;
  }
  if (
    /(?:price|cost|charg\w*|budget|quot\w*)[\s\S]*(?:website|seo|automation)|(?:website|seo|automation)[\s\S]*(?:price|cost|charg\w*|budget|quot\w*)/i.test(
      message,
    )
  )
    return pick("facts", ["pricing"]);
  return null;
}
