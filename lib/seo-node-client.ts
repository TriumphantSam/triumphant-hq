import { seoNodeHeaders, SEO_NODE_PATH } from "./seo-node-auth";
import type { SeoQuickAuditResponse } from "./seo-backend";
import type { SeoCheck } from "./seo-audit";

export async function runHostedSeoAudit(websiteUrl: string): Promise<SeoQuickAuditResponse & { checks: SeoCheck[] }> {
  const base = process.env.SEO_NODE_BACKEND_URL;
  const secret = process.env.SEO_NODE_SHARED_SECRET;
  const bypass = process.env.SEO_NODE_VERCEL_BYPASS;
  if (!base || !secret || secret.length < 32 || !bypass) throw new Error("SEO Node backend is not configured");
  const url = new URL(SEO_NODE_PATH, base);
  if (url.protocol !== "https:" || !url.hostname.endsWith(".vercel.app") || url.username || url.password || url.port)
    throw new Error("Invalid SEO Node backend URL");
  // Send only the target URL. Lead details and delivery stay on the main site.
  const body = JSON.stringify({ websiteUrl });
  const response = await fetch(url, {
    method: "POST", redirect: "manual", cache: "no-store",
    headers: { ...seoNodeHeaders(body, secret), "x-vercel-protection-bypass": bypass },
    body, signal: AbortSignal.timeout(14000),
  });
  // Workers does not implement redirect:"error". Never follow a redirect with
  // either backend credential, including redirects to another Vercel hostname.
  if (response.status >= 300 && response.status < 400) {
    await response.body?.cancel();
    throw new Error("SEO Node backend redirect rejected");
  }
  const result = await response.json();
  if (!response.ok || result.ok !== true || !Array.isArray(result.checks) || typeof result.quickScore !== "number")
    throw new Error("SEO Node backend could not complete the scan");
  return result;
}
