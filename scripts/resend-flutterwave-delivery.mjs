import fs from "node:fs";

const env = fs.readFileSync(".env.local", "utf8");
function get(name) {
  const match = env.match(new RegExp(`^${name}=(.*)$`, "m"));
  if (!match) return "";
  let value = match[1].trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  return value;
}

function metaValue(meta, key) {
  if (!meta) return "";
  if (Array.isArray(meta)) {
    return meta.find((entry) => entry.metaname === key)?.metavalue || "";
  }
  return typeof meta[key] === "string" ? meta[key] : "";
}

const secret = get("FLUTTERWAVE_SECRET_KEY");
const txId = "2081785078";
const verifyResponse = await fetch(`https://api.flutterwave.com/v3/transactions/${txId}/verify`, {
  headers: { Authorization: `Bearer ${secret}` },
});
const verifiedPayload = await verifyResponse.json();
const data = verifiedPayload.data;
if (!data || data.status !== "successful") {
  console.log(JSON.stringify({ ok: false, reason: "transaction_not_successful", status: data?.status ?? null }));
  process.exit(1);
}

const email = data.customer?.email?.trim();
const name = data.customer?.name?.trim() || "there";
const deliveryUrl = metaValue(data.meta, "delivery_url");
const productTitle = metaValue(data.meta, "product_title") || "Digital Product Seller Launch Bundle";
if (!email || !deliveryUrl) {
  console.log(JSON.stringify({ ok: false, reason: "missing_email_or_delivery_url" }));
  process.exit(1);
}

const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    service_id: get("EMAILJS_SERVICE_ID"),
    template_id: get("EMAILJS_TEMPLATE_ID_DIGITAL_FORGE_DELIVERY"),
    user_id: get("EMAILJS_PUBLIC_KEY"),
    accessToken: get("EMAILJS_PRIVATE_KEY") || undefined,
    template_params: {
      name,
      email,
      product_title: productTitle,
      delivery_url: deliveryUrl,
      amount: data.charged_amount ?? data.amount,
      currency: data.currency,
      tx_ref: data.tx_ref,
      support_email: get("DIGITAL_FORGE_SUPPORT_EMAIL") || "support@triumphanthq.com",
      from_name: get("EMAILJS_FROM_NAME") || "TriumphantHQ",
      usage_start_instruction:
        "Start with the Start Here file, then use the WhatsApp Launch Kit first. Copy, edit, and send.",
      buyer_reply_prompt: "Reply to this email if the download link does not open.",
    },
  }),
});

const detail = await emailResponse.text();
console.log(
  JSON.stringify({
    ok: emailResponse.ok,
    emailStatus: emailResponse.status,
    emailDomain: email.includes("@") ? email.split("@")[1] : "unknown",
    detail: emailResponse.ok ? "sent" : detail.slice(0, 200),
  }),
);
