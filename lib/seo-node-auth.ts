import { createHmac, timingSafeEqual } from "node:crypto";

export const SEO_NODE_PATH = "/api/internal/seo-snapshot";
const MAX_SKEW_MS = 60_000;

export function seoNodeHeaders(body: string, secret: string, now = Date.now()): Record<string, string> {
  const timestamp = String(now);
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}\nPOST\n${SEO_NODE_PATH}\n${body}`).digest("hex");
  return { "content-type": "application/json", "x-seo-timestamp": timestamp, "x-seo-signature": signature };
}

export function validSeoNodeRequest(headers: Headers, body: string, secret: string, now = Date.now()): boolean {
  if (secret.length < 32) return false;
  const timestamp = headers.get("x-seo-timestamp") || "";
  const signature = headers.get("x-seo-signature") || "";
  if (!/^\d{13}$/.test(timestamp) || !/^[a-f0-9]{64}$/.test(signature)) return false;
  if (Math.abs(now - Number(timestamp)) > MAX_SKEW_MS) return false;
  const expected = seoNodeHeaders(body, secret, Number(timestamp))["x-seo-signature"];
  return timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
}
