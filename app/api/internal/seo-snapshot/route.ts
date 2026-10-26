import { normalizeAuditUrl, runSeoAudit, AuditTargetError } from "@/lib/seo-audit";
import { validSeoNodeRequest } from "@/lib/seo-node-auth";
import { readBoundedBody, FormError } from "@/lib/public-form-guard";

export const runtime = "nodejs";
export const maxDuration = 20;

export async function POST(request: Request) {
  // This route is for the Node deployment only; Workers must never run its scanner.
  if (process.env.HOSTING_PLATFORM === "cloudflare") return Response.json({ error: "Not found" }, { status: 404 });
  try {
    const body = await readBoundedBody(request, 2048);
    if (!validSeoNodeRequest(request.headers, body, process.env.SEO_NODE_SHARED_SECRET || ""))
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    let parsed;
    try { parsed = JSON.parse(body); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
    if (!parsed || typeof parsed.websiteUrl !== "string" || parsed.websiteUrl.length > 1800)
      return Response.json({ error: "Invalid website address" }, { status: 400 });
    normalizeAuditUrl(parsed.websiteUrl);
    const result = await runSeoAudit(parsed.websiteUrl);
    return Response.json(result, { headers: { "Cache-Control": "no-store, private" } });
  } catch (error) {
    const status = error instanceof FormError ? error.status : error instanceof AuditTargetError ? 400 : 502;
    return Response.json({ ok: false, error: status < 500 && error instanceof Error ? error.message : "The scan could not be completed." },
      { status, headers: { "Cache-Control": "no-store, private" } });
  }
}
