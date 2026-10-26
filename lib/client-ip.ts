/** Use only the hosting platform's authoritative client address in production. */
export function clientIp(headers: Headers): string {
  if (process.env.HOSTING_PLATFORM === "cloudflare") {
    return headers.get("cf-connecting-ip")?.trim() || "unknown";
  }
  return headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    || headers.get("x-real-ip")
    || headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
}
