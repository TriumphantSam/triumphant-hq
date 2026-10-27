import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { AuditTargetError, normalizeAuditUrl, runSeoAudit } from "../../lib/seo-audit";
import { SEO_NODE_PATH, validSeoNodeRequest } from "../../lib/seo-node-auth";

const MAX_BODY = 2048;
class BodyTooLarge extends Error {}

async function readBody(request: IncomingMessage): Promise<string> {
  if (Number(request.headers["content-length"] || 0) > MAX_BODY) throw new BodyTooLarge();
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let bytes = 0;
    const cleanup = () => {
      request.off("data", onData);
      request.off("end", onEnd);
      request.off("error", onError);
      request.off("aborted", onAbort);
    };
    const onData = (chunk: Buffer) => {
      bytes += chunk.length;
      if (bytes > MAX_BODY) {
        request.pause();
        cleanup();
        reject(new BodyTooLarge());
      } else chunks.push(Buffer.from(chunk));
    };
    const onEnd = () => { cleanup(); resolve(Buffer.concat(chunks).toString("utf8")); };
    const onError = (error: Error) => { cleanup(); reject(error); };
    const onAbort = () => { cleanup(); reject(new Error("Request aborted")); };
    request.on("data", onData);
    request.once("end", onEnd);
    request.once("error", onError);
    request.once("aborted", onAbort);
  });
}

function reply(response: ServerResponse, status: number, value: unknown) {
  response.writeHead(status, { "content-type": "application/json", "cache-control": "no-store, private" });
  response.end(JSON.stringify(value));
}

// Reuses the existing Node scanner unchanged: DNS pinning, redirect validation,
// TLS verification, timeouts and response limits remain in lib/seo-audit.ts.
export function createSeoServer(secret: string, audit: typeof runSeoAudit = runSeoAudit) {
  if (secret.length < 32) throw new Error("SEO container secret is missing");
  let active = 0;
  const server = createServer(async (request, response) => {
    if (request.url === "/health" && request.method === "GET") {
      reply(response, 200, { ok: true });
      return;
    }
    if (request.url !== SEO_NODE_PATH) return reply(response, 404, { error: "Not found" });
    if (request.method !== "POST") return reply(response, 405, { error: "Method not allowed" });
    let admitted = false;
    try {
      const body = await readBody(request);
      const headers = new Headers();
      for (const name of ["x-seo-signature", "x-seo-timestamp"])
        if (typeof request.headers[name] === "string") headers.set(name, request.headers[name]);
      if (!validSeoNodeRequest(headers, body, secret)) return reply(response, 401, { error: "Unauthorized" });
      let data;
      try { data = JSON.parse(body); } catch { return reply(response, 400, { error: "Invalid JSON" }); }
      if (!data || Array.isArray(data) || Object.keys(data).length !== 1 ||
          typeof data.websiteUrl !== "string" || data.websiteUrl.length > 1800)
        return reply(response, 400, { error: "Invalid website address" });
      normalizeAuditUrl(data.websiteUrl);
      if (active >= 2) return reply(response, 503, { error: "Scanner busy; please retry" });
      active++;
      admitted = true;
      reply(response, 200, await audit(data.websiteUrl));
    } catch (error) {
      if (error instanceof BodyTooLarge) {
        response.setHeader("connection", "close");
        response.once("finish", () => request.destroy());
        reply(response, 413, { error: "Request too large" });
      } else reply(response, error instanceof AuditTargetError ? 400 : 502, {
        ok: false,
        error: error instanceof AuditTargetError ? error.message : "The scan could not be completed.",
      });
    } finally {
      if (admitted) active--;
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  server.keepAliveTimeout = 1000;
  server.maxRequestsPerSocket = 20;
  return server;
}
