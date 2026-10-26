import { seoNodeHeaders, SEO_NODE_PATH } from "./seo-node-auth";
import type { SeoQuickAuditResponse } from "./seo-backend";
import type { SeoCheck } from "./seo-audit";

type AuditResult = SeoQuickAuditResponse & { checks: SeoCheck[] };
type ScannerService = { fetch(request: Request): Promise<Response> };

async function readAuditResult(response: Response): Promise<AuditResult> {
  if (response.status >= 300 && response.status < 400) {
    await response.body?.cancel();
    throw new Error("SEO Node backend redirect rejected");
  }
  const result: unknown = await response.json();
  if (!response.ok || !result || typeof result !== "object" ||
      !("ok" in result) || result.ok !== true ||
      !("checks" in result) || !Array.isArray(result.checks) ||
      !("quickScore" in result) || typeof result.quickScore !== "number")
    throw new Error("SEO Node backend could not complete the scan");
  return result as AuditResult;
}

export async function runContainerSeoAudit(websiteUrl: string, service: ScannerService, secret: string): Promise<AuditResult> {
  if (secret.length < 32) throw new Error("SEO container secret is missing");
  const body = JSON.stringify({ websiteUrl });
  return readAuditResult(await service.fetch(new Request("https://seo-scanner.internal" + SEO_NODE_PATH, {
    method: "POST", redirect: "manual", headers: seoNodeHeaders(body, secret),
    body, signal: AbortSignal.timeout(30000),
  })));
}

export async function runHostedSeoAudit(websiteUrl: string): Promise<SeoQuickAuditResponse & { checks: SeoCheck[] }> {
  // The paid container option remains inactive. Netlify uses the same signed
  // request contract as Vercel without sending Vercel credentials to Netlify.
  if (process.env.SEO_SCANNER_BACKEND === "cloudflare-container") {
    if (process.env.HOSTING_PLATFORM !== "cloudflare") throw new Error("Container scanner requires Cloudflare");
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { SEO_SCANNER } = getCloudflareContext().env as unknown as { SEO_SCANNER?: ScannerService };
    if (!SEO_SCANNER) throw new Error("SEO container service binding is missing");
    return runContainerSeoAudit(websiteUrl, SEO_SCANNER, process.env.SEO_NODE_SHARED_SECRET || "");
  }
  const base = process.env.SEO_NODE_BACKEND_URL;
  const secret = process.env.SEO_NODE_SHARED_SECRET;
  const bypass = process.env.SEO_NODE_VERCEL_BYPASS;
  const netlify = process.env.SEO_SCANNER_BACKEND === "netlify";
  if (!base || !secret || secret.length < 32 || (!netlify && !bypass)) throw new Error("SEO Node backend is not configured");
  const url = new URL(SEO_NODE_PATH, base);
  if (url.protocol !== "https:" || !url.hostname.endsWith(netlify ? ".netlify.app" : ".vercel.app") || url.username || url.password || url.port)
    throw new Error("Invalid SEO Node backend URL");
  // Send only the target URL. Lead details and delivery stay on the main site.
  const body = JSON.stringify({ websiteUrl });
  const response = await fetch(url, {
    method: "POST", redirect: "manual", cache: "no-store",
    headers: { ...seoNodeHeaders(body, secret), ...(!netlify && bypass ? { "x-vercel-protection-bypass": bypass } : {}) },
    body, signal: AbortSignal.timeout(netlify ? 30000 : 14000),
  });
  // Workers does not implement redirect:"error". Never follow a redirect with
  // either backend credential, including redirects to another Vercel hostname.
  return readAuditResult(response);
}
