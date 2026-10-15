import { createHash, createHmac } from "node:crypto";
import { isIP } from "node:net";
import { automationConfigured, automationRequest } from "./automation-api";
const windows = new Map<string, { count: number; until: number }>();
export class FormError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export async function readBoundedBody(
  request: Request,
  maxBytes = 16384,
): Promise<string> {
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > maxBytes) {
        await reader.cancel();
        throw new FormError("Please shorten your submission.", 413);
      }
      chunks.push(value);
    }
    return Buffer.concat(chunks).toString("utf8");
  } finally {
    reader.releaseLock();
  }
}
export async function readPublicForm(
  request: Request,
): Promise<Record<string, unknown>> {
  const raw = await readBoundedBody(request);
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    throw new FormError("Please submit valid JSON.");
  }
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new FormError("Invalid submission.");
  if (body.companyWebsite) throw new FormError("Submission rejected.");
  const ip =
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const key = createHash("sha256")
      .update(`${ip}\n${new URL(request.url).pathname}`)
      .digest("hex"),
    now = Date.now();
  for (const [id, window] of windows)
    if (window.until <= now) windows.delete(id);
  const window = windows.get(key) ?? { count: 0, until: now + 3600000 };
  if (window.count >= 5 || (windows.size >= 10000 && !windows.has(key)))
    throw new FormError(
      "You have reached the hourly limit. Please try again later.",
      429,
    );
  window.count++;
  windows.set(key, window);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    secret = process.env.TURNSTILE_SECRET_KEY;
  if (siteKey || secret) {
    if (!siteKey || !secret)
      throw new FormError(
        "The verification service is not configured correctly.",
        503,
      );
    if (typeof body.turnstileToken !== "string" || !body.turnstileToken || body.turnstileToken.length > 2048)
      throw new FormError("Please complete the security check.");
    const result = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        signal: AbortSignal.timeout(5000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, response: body.turnstileToken }),
      },
    );
    const check = (await result.json()) as {
      success?: boolean;
      hostname?: string;
      action?: string;
    };
    const allowed = (
      process.env.TURNSTILE_ALLOWED_HOSTNAMES ||
      "triumphantech.com,www.triumphantech.com"
    )
      .split(",")
      .map((h) => h.trim());
    if (
      !check.success || check.action !== "lead_enquiry" ||
      (process.env.NODE_ENV === "production" &&
        !allowed.includes(check.hostname || ""))
    )
      throw new FormError("The security check expired. Please try again.");
  }
  if (automationConfigured()) {
    if (process.env.VERCEL && !isIP(ip))
      throw new FormError("Unable to verify this request. Please try again.", 503);
    const ipKey = createHmac("sha256", process.env.AUTOMATION_HMAC_SECRET!)
      .update(ip)
      .digest("hex");
    let admission: { allowed: boolean };
    try {
      admission = await automationRequest("/v1/form-admission", { ipKey });
    } catch {
      throw new FormError("Enquiries are temporarily unavailable. Please try again.", 503);
    }
    if (!admission.allowed)
      throw new FormError("You have reached the hourly limit. Please try again later.", 429);
  }
  return body;
}
export const field = (
  body: Record<string, unknown>,
  name: string,
  max = 2000,
) =>
  typeof body[name] === "string"
    ? (body[name] as string).trim().slice(0, max)
    : "";
export function validateLead(name: string, email: string) {
  if (
    !name ||
    name.length > 120 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254
  )
    throw new FormError("Please provide your name and a valid email address.");
}
