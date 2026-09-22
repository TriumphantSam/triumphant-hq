const PRODUCT_NAME = "Digital Product Seller Launch Bundle";
const PRICE_LABEL = "₦3,000";
const CHECKOUT_URL =
  process.env.DIGITAL_PRODUCT_BUNDLE_CHECKOUT_URL?.trim() ||
  "https://triumphantech.com/digital-forge/checkout?offer=digital-product-seller-launch-bundle";
const GRAPH_VERSION = "v22.0";

const MENU_ALIASES = new Set(["hi", "hello", "hey", "start", "menu", "digital product", "launch bundle", "bundle"]);
const INSIDE_ALIASES = new Set(["inside", "see inside", "what is inside", "what do i get", "details", "content", "packs", "4 packs"]);
const SAMPLE_ALIASES = new Set(["sample", "samples", "preview", "free sample", "example", "examples", "script", "scripts"]);
const BUY_ALIASES = new Set([
  "buy",
  "buy now",
  "checkout",
  "pay",
  "payment",
  "get access",
  "get access now",
  "open checkout",
  "link",
  "send link",
  "how to pay",
  "i want it",
  "i need it",
  "3",
]);
const PRICE_ALIASES = new Set(["price", "cost", "how much", "amount", "3000", "n3000", "n3 000"]);
const OBJECTION_ALIASES = new Set([
  "expensive",
  "too expensive",
  "costly",
  "later",
  "not now",
  "will think",
  "think about it",
  "is it worth it",
  "why should i buy",
]);
const DELIVERY_ALIASES = new Set(["delivery", "delivered", "files", "download", "access", "paid", "payment sent", "sent payment"]);
const HUMAN_ALIASES = new Set(["human", "help", "support", "agent", "person", "talk to someone", "4"]);
const END_ALIASES = new Set(["end", "close", "stop", "done", "finish", "cancel", "reset"]);

type ReplyButtons = Array<{ id: string; title: string }>;
type RouteResult = {
  text: string;
  buttons?: ReplyButtons;
  cta?: { buttonText: string; url: string };
};

function normalizeKeyword(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasAlias(normalized: string, aliases: Set<string>): boolean {
  if (!normalized) return false;
  const words = new Set(normalized.split(" "));
  for (const alias of aliases) {
    const clean = normalizeKeyword(alias);
    if (!clean) continue;
    if (clean.includes(" ")) {
      if (normalized.includes(clean)) return true;
    } else if (words.has(clean)) {
      return true;
    }
  }
  return false;
}

function welcome(): RouteResult {
  return {
    text:
      `Hi 👋\n\nThis is the *${PRODUCT_NAME}*.\n\n` +
      "Your digital product is not the problem. Your messages are.\n\n" +
      "This bundle gives you copy-paste scripts to launch, handle *too expensive*, move TikTok comments into WhatsApp, and get paid.\n\n" +
      "Inside, you get 4 packs:\n" +
      "• WhatsApp Launch Kit\n" +
      "• Price Objection Replies\n" +
      "• TikTok-to-WhatsApp Scripts\n" +
      "• Daily Sales Post Templates\n\n" +
      `Launch price: *${PRICE_LABEL}*. After this window it returns to ₦10,000.\n\n` +
      "Choose one:",
    buttons: [
      { id: "INSIDE", title: "See Inside" },
      { id: "SAMPLE", title: "Free Sample" },
      { id: "BUY", title: "Buy Now" },
    ],
  };
}

export function routeLaunchBundleMessage(text: string): RouteResult {
  const normalized = normalizeKeyword(text);

  if (normalized === "1") {
    return {
      text:
        `Here is what is inside the *${PRODUCT_NAME}*:\n\n` +
        "1. *WhatsApp Launch Kit* — teaser, offer, checkout, and delivery messages.\n" +
        "2. *Price Objection Replies* — too expensive, last price, I will get back to you.\n" +
        "3. *TikTok-to-WhatsApp Scripts* — comment replies and DM handoff.\n" +
        "4. *Daily Sales Post Templates* — 50 post angles, CTAs, and a 7-day plan.\n\n" +
        "Bought one-by-one this is ₦13,000.\n" +
        `Today the bundle is *${PRICE_LABEL}*.\n\n` +
        "You can see a sample first or go straight to checkout.",
      buttons: [
        { id: "SAMPLE", title: "Free Sample" },
        { id: "BUY", title: "Buy Now" },
      ],
    };
  }

  if (normalized === "2") {
    return {
      text:
        "Here is a sample from the bundle:\n\n" +
        "*Buyer:* How much is the guide?\n" +
        `*You:* It is ${PRICE_LABEL}. Instant access after payment.\n` +
        "*Buyer:* Okay send the link.\n\n" +
        "That is the point. The pack gives you the launch, objection, TikTok, and follow-up versions so you are not guessing.\n\n" +
        `Price today: *${PRICE_LABEL}*.`,
      buttons: [
        { id: "BUY", title: "Buy Now" },
        { id: "SAMPLE", title: "Free Sample" },
        { id: "HUMAN", title: "Human Help" },
      ],
    };
  }

  if (normalized === "3") {
    return {
      text:
        `Perfect. The *${PRODUCT_NAME}* is *${PRICE_LABEL}*.\n\n` +
        "Tap the checkout button below to pay securely.\n\n" +
        "Nigeria: Flutterwave (card, USSD, bank transfer).\n" +
        "Outside Nigeria: international card checkout.\n\n" +
        "After payment, we email the files automatically. Check inbox and spam.\n\n" +
        "If access delays, reply *PAID* and send your payment email.",
      cta: { buttonText: "Open Checkout", url: CHECKOUT_URL },
    };
  }

  if (hasAlias(normalized, END_ALIASES)) {
    return { text: "No problem. Reply *HI* whenever you want the Digital Product Seller Launch Bundle again." };
  }

  if (hasAlias(normalized, DELIVERY_ALIASES)) {
    return {
      text:
        "If you have paid, check your email and spam folder for the download.\n\n" +
        "The email comes from Triumphant HQ after Flutterwave or Lemon Squeezy confirms payment.\n\n" +
        "If it is not there yet, reply *PAID* with:\n" +
        "1. the email you used at checkout\n" +
        "2. payment screenshot\n" +
        `3. the product name: ${PRODUCT_NAME}`,
      buttons: [
        { id: "BUY", title: "Buy Now" },
        { id: "HUMAN", title: "Human Help" },
      ],
    };
  }

  if (hasAlias(normalized, HUMAN_ALIASES)) {
    return {
      text:
        "A human can help with payment or access questions.\n\n" +
        "Reply here with the email you used at checkout and any payment screenshot. Someone will pick this up.",
    };
  }

  if (hasAlias(normalized, PRICE_ALIASES)) {
    return {
      text:
        `The *${PRODUCT_NAME}* is *${PRICE_LABEL}* today.\n\n` +
        "After this launch window, the price returns to ₦10,000.\n\n" +
        "This is not a course. It is copy-paste scripts you can use on your phone the same day.\n\n" +
        "Tap checkout when you are ready. After payment, the files are emailed to you.",
      cta: { buttonText: "Open Checkout", url: CHECKOUT_URL },
    };
  }

  if (hasAlias(normalized, BUY_ALIASES)) {
    return {
      text:
        `Perfect. The *${PRODUCT_NAME}* is *${PRICE_LABEL}*.\n\n` +
        "Tap the checkout button below to pay securely.\n\n" +
        "Nigeria: Flutterwave (card, USSD, bank transfer).\n" +
        "Outside Nigeria: international card checkout.\n\n" +
        "After payment, we email the files automatically. Check inbox and spam.\n\n" +
        "If access delays, reply *PAID* and send your payment email.",
      cta: { buttonText: "Open Checkout", url: CHECKOUT_URL },
    };
  }

  if (hasAlias(normalized, SAMPLE_ALIASES)) {
    return {
      text:
        "Here is a sample from the bundle:\n\n" +
        "*Buyer:* How much is the guide?\n" +
        `*You:* It is ${PRICE_LABEL}. Instant access after payment.\n` +
        "*Buyer:* Okay send the link.\n\n" +
        "That is the point. The pack gives you the launch, objection, TikTok, and follow-up versions so you are not guessing.\n\n" +
        `Price today: *${PRICE_LABEL}*.`,
      buttons: [
        { id: "BUY", title: "Buy Now" },
        { id: "SAMPLE", title: "Free Sample" },
        { id: "HUMAN", title: "Human Help" },
      ],
    };
  }

  if (hasAlias(normalized, INSIDE_ALIASES)) {
    return {
      text:
        `Here is what is inside the *${PRODUCT_NAME}*:\n\n` +
        "1. *WhatsApp Launch Kit* — teaser, offer, checkout, and delivery messages.\n" +
        "2. *Price Objection Replies* — too expensive, last price, I will get back to you.\n" +
        "3. *TikTok-to-WhatsApp Scripts* — comment replies and DM handoff.\n" +
        "4. *Daily Sales Post Templates* — 50 post angles, CTAs, and a 7-day plan.\n\n" +
        "Bought one-by-one this is ₦13,000.\n" +
        `Today the bundle is *${PRICE_LABEL}*.\n\n` +
        "You can see a sample first or go straight to checkout.",
      buttons: [
        { id: "SAMPLE", title: "Free Sample" },
        { id: "BUY", title: "Buy Now" },
      ],
    };
  }

  if (hasAlias(normalized, OBJECTION_ALIASES)) {
    return {
      text:
        "I understand.\n\n" +
        "This is not a promise of sales. It is the messages: launch, price replies, TikTok-to-WhatsApp, and daily posts.\n\n" +
        "If you already have a file to sell, these are the words.\n\n" +
        `Launch price: *${PRICE_LABEL}*.\n\n` +
        "Tap checkout if you want it today.",
      buttons: [
        { id: "BUY", title: "Buy Now" },
        { id: "SAMPLE", title: "Free Sample" },
        { id: "HUMAN", title: "Human Help" },
      ],
    };
  }

  if (!normalized || hasAlias(normalized, MENU_ALIASES)) {
    return welcome();
  }

  return welcome();
}

function extractInboundText(message: Record<string, unknown>): string {
  const type = String(message.type || "");
  if (type === "text") {
    const text = message.text as { body?: string } | undefined;
    return text?.body?.trim() ?? "";
  }
  if (type === "interactive") {
    const interactive = message.interactive as {
      type?: string;
      button_reply?: { id?: string; title?: string };
      list_reply?: { id?: string; title?: string };
    };
    if (interactive?.type === "button_reply") {
      return String(interactive.button_reply?.id || interactive.button_reply?.title || "").trim();
    }
    if (interactive?.type === "list_reply") {
      return String(interactive.list_reply?.id || interactive.list_reply?.title || "").trim();
    }
  }
  if (type === "button") {
    const button = message.button as { payload?: string; text?: string } | undefined;
    return String(button?.payload || button?.text || "").trim();
  }
  return "";
}

async function graphSend(payload: Record<string, unknown>) {
  const token = (process.env.WHATSAPP_ACCESS_TOKEN ?? "").trim();
  const phoneId = (process.env.WHATSAPP_PHONE_NUMBER_ID ?? "").trim();
  if (!token || !phoneId) {
    throw new Error("WhatsApp Cloud API is not configured.");
  }
  const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`WhatsApp send failed: ${response.status} ${detail.slice(0, 240)}`);
  }
}

async function sendReply(to: string, result: RouteResult) {
  if (result.cta?.url) {
    try {
      await graphSend({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "interactive",
        interactive: {
          type: "cta_url",
          body: { text: result.text.slice(0, 1024) },
          action: {
            name: "cta_url",
            parameters: {
              display_text: result.cta.buttonText.slice(0, 20),
              url: result.cta.url,
            },
          },
        },
      });
      return;
    } catch {
      await graphSend({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { preview_url: true, body: `${result.text}\n\n${result.cta.url}` },
      });
      return;
    }
  }

  if (result.buttons?.length) {
    try {
      await graphSend({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "interactive",
        interactive: {
          type: "button",
          body: { text: result.text.slice(0, 1024) },
          action: {
            buttons: result.buttons.slice(0, 3).map((button) => ({
              type: "reply",
              reply: { id: button.id.slice(0, 256), title: button.title.slice(0, 20) },
            })),
          },
        },
      });
      return;
    } catch {
      const fallback = [result.text, "", "Reply with:", ...result.buttons.map((button) => `- ${button.id}: ${button.title}`)].join(
        "\n",
      );
      await graphSend({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { preview_url: true, body: fallback },
      });
      return;
    }
  }

  await graphSend({
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { preview_url: true, body: result.text },
  });
}

async function notifyTelegram(phone: string, textIn: string, replyText: string) {
  const notify = (process.env.WHATSAPP_NOTIFY_TELEGRAM ?? "true").trim().toLowerCase() === "true";
  const token = (process.env.TELEGRAM_BOT_TOKEN ?? "").trim();
  const chatId = (process.env.TELEGRAM_CHAT_ID ?? "").trim();
  if (!notify || !token || !chatId) return;

  const lines = [
    "WhatsApp update",
    `Phone: +${phone}`,
    "",
    `Customer: ${textIn.slice(0, 900)}`,
    "",
    `Bot: ${replyText.slice(0, 900)}`,
    "",
    `Reply from Telegram: /wa ${phone} your message`,
  ];

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join("\n"),
      disable_web_page_preview: true,
    }),
    cache: "no-store",
  }).catch(() => undefined);
}

export function parseTelegramWaCommand(text: string): { phone: string; message: string } | null {
  const match = text.trim().match(/^\/wa(?:@\w+)?\s+(\+?[0-9][0-9().-]{6,24})\s+([\s\S]+)$/i);
  if (!match) return null;
  const phone = match[1].replace(/[^0-9]/g, "");
  const message = match[2].trim();
  if (phone.length < 8 || !message) return null;
  return { phone, message };
}

export async function sendWhatsAppText(to: string, text: string) {
  await graphSend({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: { preview_url: true, body: text },
  });
}

export async function handleWhatsAppIncoming(payload: {
  object?: string;
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<Record<string, unknown>>;
      };
    }>;
  }>;
}) {
  if (payload.object !== "whatsapp_business_account") return;
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      for (const message of change.value?.messages ?? []) {
        const phone = String(message.from || "");
        const text = extractInboundText(message);
        if (!phone || !text) continue;
        const routed = routeLaunchBundleMessage(text);
        try {
          await sendReply(phone, routed);
        } catch {
          await notifyTelegram(phone, text, `Bot failed to send. Intended reply:\n${routed.text}`);
          continue;
        }
        await notifyTelegram(phone, text, routed.text);
      }
    }
  }
}

