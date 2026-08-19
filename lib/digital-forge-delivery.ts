import { isLaunchBundleOffer } from "@/lib/digital-forge-offers";

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID ?? "";
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY ?? "";
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY ?? "";
const EMAILJS_FROM_NAME = process.env.EMAILJS_FROM_NAME ?? "TriumphantHQ";
const EMAILJS_TEMPLATE_ID_DIGITAL_FORGE_DELIVERY = process.env.EMAILJS_TEMPLATE_ID_DIGITAL_FORGE_DELIVERY ?? "";
const SUPPORT_EMAIL = process.env.DIGITAL_FORGE_SUPPORT_EMAIL ?? "support@triumphanthq.com";
const STARTER_USAGE_INSTRUCTION =
  "Start with 01 Start Here.pdf, then complete the Offer Selection Worksheet before opening the other templates.";
const LAUNCH_BUNDLE_USAGE_INSTRUCTION =
  "Start with the Start Here file, then use the WhatsApp Launch Kit first. Copy, edit, and send.";
const BUYER_REPLY_PROMPT =
  "Reply to this email with the product idea you plan to build first. We use those replies to help improve the system and collect real buyer proof with permission.";

export async function sendDigitalForgeDeliveryEmail(payload: {
  name: string;
  email: string;
  productTitle: string;
  deliveryUrl: string;
  amount: number;
  currency: string;
  txRef: string;
  offerKey?: string;
}) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_TEMPLATE_ID_DIGITAL_FORGE_DELIVERY) {
    throw new Error("EmailJS digital product delivery template is not configured.");
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID_DIGITAL_FORGE_DELIVERY,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PRIVATE_KEY || undefined,
      template_params: {
        name: payload.name,
        email: payload.email,
        to_email: payload.email,
        reply_to: payload.email,
        product_title: payload.productTitle,
        delivery_url: payload.deliveryUrl,
        amount: payload.amount,
        currency: payload.currency,
        tx_ref: payload.txRef,
        support_email: SUPPORT_EMAIL,
        from_name: EMAILJS_FROM_NAME,
        usage_start_instruction: isLaunchBundleOffer(payload.offerKey)
          ? LAUNCH_BUNDLE_USAGE_INSTRUCTION
          : STARTER_USAGE_INSTRUCTION,
        buyer_reply_prompt: BUYER_REPLY_PROMPT,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`EmailJS delivery send failed: ${response.status} ${detail}`);
  }
}
