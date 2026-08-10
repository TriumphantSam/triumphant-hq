import type { InvoiceSessionPayload, InvoiceUser } from "./types";

export const INVOICE_SESSION_COOKIE = "thq_invoice_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days

function getSessionSecret(): string {
  return process.env.INVOICE_SESSION_SECRET || "dev-invoice-secret-change-me";
}

export function parseInvoiceUsers(): InvoiceUser[] {
  const raw = process.env.INVOICE_USERS?.trim();
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Array<{
        id?: string;
        username: string;
        password: string;
        name?: string;
      }>;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((u, index) => ({
          id: u.id || `user-${index + 1}`,
          username: u.username,
          password: u.password,
          name: u.name || u.username,
        }));
      }
    } catch {
      // fall through to default
    }
  }

  return [
    {
      id: "user-1",
      username: process.env.INVOICE_ADMIN_USER || "admin",
      password: process.env.INVOICE_ADMIN_PASSWORD || "triumphant",
      name: process.env.INVOICE_ADMIN_NAME || "Adeyemi Olayemi",
    },
  ];
}

export function findUser(username: string, password: string): InvoiceUser | null {
  const users = parseInvoiceUsers();
  const match = users.find(
    (u) =>
      u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
  );
  return match ?? null;
}

function utf8ToBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  const b64 =
    typeof btoa === "function"
      ? btoa(bin)
      : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToUtf8(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const b64 = padded + pad;
  const bin =
    typeof atob === "function"
      ? atob(b64)
      : Buffer.from(value, "base64url").toString("binary");
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function encodePayload(payload: unknown): string {
  return utf8ToBase64Url(JSON.stringify(payload));
}

function decodePayload<T>(encoded: string): T | null {
  try {
    return JSON.parse(base64UrlToUtf8(encoded)) as T;
  } catch {
    return null;
  }
}

async function getHmacKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function bytesToBase64Url(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  let bin = "";
  arr.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  const b64 =
    typeof btoa === "function"
      ? btoa(bin)
      : Buffer.from(arr).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const b64 = padded + pad;
  const bin =
    typeof atob === "function"
      ? atob(b64)
      : Buffer.from(value, "base64url").toString("binary");
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function sign(value: string): Promise<string> {
  const key = await getHmacKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return bytesToBase64Url(sig);
}

async function signaturesMatch(a: string, b: string): Promise<boolean> {
  const aBytes = base64UrlToBytes(a);
  const bBytes = base64UrlToBytes(b);
  if (aBytes.length !== bBytes.length) return false;
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) diff |= aBytes[i] ^ bBytes[i];
  return diff === 0;
}

export async function createSessionToken(user: InvoiceUser): Promise<string> {
  const payload: InvoiceSessionPayload = {
    userId: user.id,
    username: user.username,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = encodePayload(payload);
  const signature = await sign(body);
  return `${body}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<InvoiceSessionPayload | null> {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = await sign(body);
  if (!(await signaturesMatch(signature, expected))) return null;
  const payload = decodePayload<InvoiceSessionPayload>(body);
  if (!payload || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

export function sessionCookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function createPrintToken(invoiceId: string): Promise<string> {
  const nonceBytes = new Uint8Array(8);
  crypto.getRandomValues(nonceBytes);
  const nonce = Array.from(nonceBytes, (b) => b.toString(16).padStart(2, "0")).join("");
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
  const body = encodePayload({ invoiceId, exp, nonce });
  const signature = await sign(body);
  return `${body}.${signature}`;
}

export async function verifyPrintToken(
  token: string | undefined | null
): Promise<{ invoiceId: string } | null> {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = await sign(body);
  if (!(await signaturesMatch(signature, expected))) return null;
  const payload = decodePayload<{ invoiceId: string; exp: number }>(body);
  if (!payload?.invoiceId || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return { invoiceId: payload.invoiceId };
}
