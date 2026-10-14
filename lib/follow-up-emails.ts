const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID ?? "";
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY ?? "";
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY ?? "";
const EMAILJS_FROM_NAME = process.env.EMAILJS_FROM_NAME ?? "TriumphantHQ";

const TEMPLATE_BY_KEY: Record<string, string> = {
  funnel_day3: process.env.EMAILJS_TEMPLATE_ID_FUNNEL_FOLLOWUP_DAY3 ?? "",
  funnel_day7: process.env.EMAILJS_TEMPLATE_ID_FUNNEL_FOLLOWUP_DAY7 ?? "",
  purchase_day3: process.env.EMAILJS_TEMPLATE_ID_PURCHASE_FOLLOWUP_DAY3 ?? "",
  purchase_day7: process.env.EMAILJS_TEMPLATE_ID_PURCHASE_FOLLOWUP_DAY7 ?? "",
};

export async function sendFollowUpEmail(payload: {
  name: string;
  email: string;
  templateKey: string;
  metadata?: Record<string, string>;
}) {
  const templateId = TEMPLATE_BY_KEY[payload.templateKey];
  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !templateId) return false;

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PRIVATE_KEY || undefined,
      template_params: {
        name: payload.name,
        email: payload.email,
        from_name: EMAILJS_FROM_NAME,
        ...(payload.metadata ?? {}),
      },
    }),
  });

  return response.ok;
}
