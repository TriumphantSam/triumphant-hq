import { createHmac, randomUUID } from "node:crypto";

export const automationConfigured = () =>
  Boolean(
    process.env.AUTOMATION_API_BASE && process.env.AUTOMATION_HMAC_SECRET,
  );
export async function automationRequest<T>(
  path: string,
  payload?: unknown,
  method = "POST",
): Promise<T> {
  const base = process.env.AUTOMATION_API_BASE,
    secret = process.env.AUTOMATION_HMAC_SECRET;
  if (!base || !secret)
    throw new Error("Automation service is not configured.");
  const url = new URL(path, base);
  if (url.protocol !== "https:" && process.env.NODE_ENV === "production")
    throw new Error("Automation service requires HTTPS.");
  const body = payload === undefined ? "" : JSON.stringify(payload),
    timestamp = String(Date.now()),
    nonce = randomUUID();
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}\n${nonce}\n${method}\n${url.pathname}\n${body}`)
    .digest("hex");
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-triumph-timestamp": timestamp,
      "x-triumph-nonce": nonce,
      "x-triumph-signature": signature,
    },
    body: body || undefined,
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : "Automation service is temporarily unavailable.",
    );
  return data as T;
}
