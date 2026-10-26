import { AuditTargetError, normalizeAuditUrl, runSeoAudit } from "../../../lib/seo-audit";
import { SEO_NODE_PATH, validSeoNodeRequest } from "../../../lib/seo-node-auth";
import { FormError, readBoundedBody } from "../../../lib/public-form-guard";

export const config = { path: SEO_NODE_PATH };

export async function handleScan(request: Request, secret: string, audit = runSeoAudit): Promise<Response> {
  const reply = (status: number, value: unknown) => Response.json(value, {
    status, headers: { "cache-control": "no-store, private" },
  });
  if (request.method !== "POST") return reply(405, { error: "Method not allowed" });
  try {
    const body = await readBoundedBody(request, 2048);
    if (!validSeoNodeRequest(request.headers, body, secret)) return reply(401, { error: "Unauthorized" });
    let data;
    try { data = JSON.parse(body); } catch { return reply(400, { error: "Invalid JSON" }); }
    if (!data || Array.isArray(data) || Object.keys(data).length !== 1 ||
        typeof data.websiteUrl !== "string" || data.websiteUrl.length > 1800)
      return reply(400, { error: "Invalid website address" });
    normalizeAuditUrl(data.websiteUrl);
    return reply(200, await audit(data.websiteUrl));
  } catch (error) {
    const status = error instanceof FormError ? error.status : error instanceof AuditTargetError ? 400 : 502;
    return reply(status, { ok: false, error: status < 500 && error instanceof Error ? error.message : "The scan could not be completed." });
  }
}

export default async function handler(request: Request): Promise<Response> {
  return handleScan(request, process.env.SEO_NODE_SHARED_SECRET || "");
}
