import { SEO_NODE_PATH, validSeoNodeRequest } from "../../lib/seo-node-auth";
import { normalizeAuditUrl } from "../../lib/seo-audit";

export async function scannerGateway(request: Request, secret: string,
  forward: (request: Request) => Promise<Response>): Promise<Response> {
  const fail = (status: number, error: string) => Response.json({ error }, {
    status, headers: { "cache-control": "no-store, private" },
  });
  const url = new URL(request.url);
  if (url.pathname !== SEO_NODE_PATH || url.search) return fail(404, "Not found");
  if (request.method !== "POST") return fail(405, "Method not allowed");
  if (secret.length < 32) return fail(503, "Scanner is not configured");
  if (Number(request.headers.get("content-length") || 0) > 2048) return fail(413, "Request too large");
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    if (reader) for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2048) {
        await reader.cancel();
        return fail(413, "Request too large");
      }
      chunks.push(value);
    }
  } catch { return fail(400, "Invalid request body"); }
  finally { reader?.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  const body = new TextDecoder().decode(bytes);
  if (!validSeoNodeRequest(request.headers, body, secret)) return fail(401, "Unauthorized");
  try {
    const data = JSON.parse(body);
    if (!data || Array.isArray(data) || Object.keys(data).length !== 1 ||
        typeof data.websiteUrl !== "string" || data.websiteUrl.length > 1800)
      return fail(400, "Invalid website address");
    normalizeAuditUrl(data.websiteUrl);
  } catch { return fail(400, "Invalid website address"); }
  // Do not forward cookies, Vercel bypass credentials or unrelated user headers.
  const headers = new Headers({ "content-type": "application/json" });
  for (const name of ["x-seo-signature", "x-seo-timestamp"])
    headers.set(name, request.headers.get(name)!);
  try {
    return await forward(new Request("http://container" + SEO_NODE_PATH, {
      method: "POST", headers, body, signal: request.signal,
    }));
  } catch { return fail(502, "The scanner could not be reached"); }
}
