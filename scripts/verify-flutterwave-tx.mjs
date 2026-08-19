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

const secret = get("FLUTTERWAVE_SECRET_KEY");
const txId = "2081785078";

const response = await fetch(`https://api.flutterwave.com/v3/transactions/${txId}/verify`, {
  headers: { Authorization: `Bearer ${secret}` },
});
const payload = await response.json();
const data = payload.data || {};
const meta = data.meta || {};
const metaKeys = Array.isArray(meta)
  ? meta.map((entry) => entry.metaname)
  : Object.keys(meta);
const delivery = Array.isArray(meta)
  ? meta.find((entry) => entry.metaname === "delivery_url")?.metavalue
  : meta.delivery_url;
const offerKey = Array.isArray(meta)
  ? meta.find((entry) => entry.metaname === "offer_key")?.metavalue
  : meta.offer_key;

console.log(
  JSON.stringify(
    {
      http: response.status,
      status: data.status,
      amount: data.amount,
      currency: data.currency,
      tx_ref: data.tx_ref,
      email: data.customer?.email ? "present" : "missing",
      metaKeys,
      offerKey: offerKey || null,
      hasDeliveryUrl: Boolean(delivery && String(delivery).length > 8),
      deliveryHost: delivery ? new URL(delivery).host : null,
    },
    null,
    2,
  ),
);
