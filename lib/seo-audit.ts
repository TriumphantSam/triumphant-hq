import { lookup } from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import { isIP } from "node:net";
import ipaddr from "ipaddr.js";
import { parse, type DefaultTreeAdapterMap } from "parse5";
import type { SeoQuickAuditResponse } from "./seo-backend";

const MAX_BYTES = 2 * 1024 * 1024;
export class AuditTargetError extends Error {}

export function isPublicAddress(address: string): boolean {
  try {
    const ip = ipaddr.parse(address);
    if (ip.range() !== "unicast") return false;
    // Exclude IPv6 transition mechanisms and non-global address space.
    if (ip.kind() === "ipv6") {
      const v6 = ip as ipaddr.IPv6;
      return (
        v6.match(ipaddr.parse("2000::") as ipaddr.IPv6, 3) &&
        !v6.match(ipaddr.parse("2001::") as ipaddr.IPv6, 23) &&
        !v6.match(ipaddr.parse("2002::") as ipaddr.IPv6, 16)
      );
    }
    return true;
  } catch {
    return false;
  }
}

export function normalizeAuditUrl(input: string): URL {
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
  } catch {
    throw new AuditTargetError("Enter a valid public website address.");
  }
  const host = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    (url.port && !["80", "443"].includes(url.port)) ||
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    (!isIP(host) && !host.includes(".")) ||
    (isIP(host) && !isPublicAddress(host))
  ) {
    throw new AuditTargetError(
      "Only public HTTP or HTTPS websites on standard ports can be checked.",
    );
  }
  url.hash = "";
  return url;
}

export type PageFetch = {
  url: URL;
  status: number;
  body: string;
  bytes: number;
  elapsedMs: number;
  contentType: string;
};

export function pinnedLookup(selected: { address: string; family: number }): NonNullable<http.RequestOptions['lookup']> {
  return (_hostname, options, callback) => {
    if (options.all) {
      const allCallback = callback as unknown as (error: Error | null, records: {address:string;family:number}[]) => void;
      allCallback(null, [selected]);
    } else callback(null, selected.address, selected.family);
  };
}

// Resolve, validate ALL answers, then pin the socket to a validated address. A
// separate preflight DNS check followed by fetch() would allow DNS rebinding.
async function fetchOnce(
  url: URL,
  signal: AbortSignal,
): Promise<Omit<PageFetch, "elapsedMs">> {
  signal.throwIfAborted();
  const host = url.hostname.replace(/^\[|\]$/g, "");
  const records = isIP(host)
    ? [{ address: host, family: isIP(host) }]
    : await Promise.race([
        lookup(host, { all: true }),
        new Promise<never>((_, reject) => {
          signal.addEventListener(
            "abort",
            () =>
              reject(
                new AuditTargetError("The website took too long to respond."),
              ),
            { once: true },
          );
        }),
      ]);
  signal.throwIfAborted();
  if (!records.length || records.some((r) => !isPublicAddress(r.address))) {
    throw new AuditTargetError(
      "This address does not resolve exclusively to public servers.",
    );
  }
  const selected = records.find((r) => r.family === 4) ?? records[0];
  return new Promise((resolve, reject) => {
    const transport = url.protocol === "https:" ? https : http;
    const req = transport.get(
      url,
      {
        signal,
        agent: false,
        headers: {
          "User-Agent": "TriumphantTech-SEO-Snapshot/1.0",
          Accept: "text/html,text/plain,application/xml",
          "Accept-Encoding": "identity",
        },
        lookup: pinnedLookup(selected),
      },
      (res) => {
        const status = res.statusCode ?? 0;
        const location = res.headers.location;
        if ([301, 302, 303, 307, 308].includes(status) && location) {
          res.destroy();
          resolve({
            url: new URL(location, url),
            status,
            body: "",
            bytes: 0,
            contentType: "redirect",
          });
          return;
        }
        if (
          res.headers["content-encoding"] &&
          res.headers["content-encoding"] !== "identity"
        ) {
          res.destroy();
          reject(
            new AuditTargetError(
              "This server requires compressed responses; please request a manual audit.",
            ),
          );
          return;
        }
        const length = Number(res.headers["content-length"] ?? 0);
        if (length > MAX_BYTES) {
          res.destroy();
          reject(
            new AuditTargetError(
              "This page is larger than the 2 MB snapshot limit.",
            ),
          );
          return;
        }
        const chunks: Buffer[] = [];
        let bytes = 0;
        res.on("data", (chunk: Buffer) => {
          bytes += chunk.length;
          if (bytes > MAX_BYTES) {
            res.destroy();
            reject(
              new AuditTargetError(
                "This page is larger than the 2 MB snapshot limit.",
              ),
            );
          } else chunks.push(chunk);
        });
        res.on("error", reject);
        res.on("end", () =>
          resolve({
            url,
            status,
            body: Buffer.concat(chunks).toString("utf8"),
            bytes,
            contentType: String(res.headers["content-type"] ?? ""),
          }),
        );
      },
    );
    req.on("error", reject);
  });
}

export async function fetchPublicPage(
  input: string,
  timeoutMs = 9000,
): Promise<PageFetch> {
  const started = Date.now();
  const signal = AbortSignal.timeout(timeoutMs);
  let url = normalizeAuditUrl(input);
  for (let redirects = 0; redirects <= 5; redirects++) {
    const page = await fetchOnce(url, signal);
    if (page.contentType !== "redirect")
      return { ...page, elapsedMs: Date.now() - started };
    if (redirects === 5)
      throw new AuditTargetError("This website redirects too many times.");
    url = normalizeAuditUrl(page.url.href);
  }
  throw new AuditTargetError("Unable to check this website.");
}

type Node = DefaultTreeAdapterMap["node"];
type Element = DefaultTreeAdapterMap["element"];
export type SeoCheck = { id: string; passed: boolean | null; detail: string };
function textContent(node: Node): string {
  if (node.nodeName === "#text")
    return (node as DefaultTreeAdapterMap["textNode"]).value;
  if (
    "tagName" in node &&
    ["script", "style", "noscript", "template"].includes(node.tagName)
  )
    return "";
  return "childNodes" in node ? node.childNodes.map(textContent).join(" ") : "";
}

export function inspectHtml(
  html: string,
  url: URL,
  bytes: number,
  elapsedMs: number,
): SeoCheck[] {
  const document = parse(html);
  const elements: Element[] = [];
  const visit = (node: Node) => {
    if ("tagName" in node) elements.push(node);
    if ("childNodes" in node) node.childNodes.forEach(visit);
  };
  visit(document);
  const attr = (el: Element, name: string) =>
    el.attrs.find((a) => a.name === name)?.value ?? "";
  const tags = (name: string) => elements.filter((e) => e.tagName === name);
  const meta = (key: string) =>
    tags("meta").find(
      (e) => (attr(e, "name") || attr(e, "property")).toLowerCase() === key,
    );
  const content = (key: string) => {
    const el = meta(key);
    return el ? attr(el, "content").trim() : "";
  };
  const title = tags("title").map(textContent).join(" ").trim();
  const description = content("description");
  const images = tags("img");
  const withAlt = images.filter((e) =>
    e.attrs.some((a) => a.name === "alt"),
  ).length;
  const links = tags("a").flatMap((e) => {
    try {
      const link = new URL(attr(e, "href"), url);
      return ["http:", "https:"].includes(link.protocol) && attr(e, "href")
        ? [link]
        : [];
    } catch {
      return [];
    }
  });
  const internal = links.filter((l) => l.origin === url.origin).length;
  const external = links.length - internal;
  const words = textContent(tags("body")[0] ?? document)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const canonical = tags("link").find((e) =>
    attr(e, "rel").toLowerCase().split(/\s+/).includes("canonical"),
  );
  let canonicalValid = false;
  try {
    canonicalValid = Boolean(
      canonical &&
      ["http:", "https:"].includes(
        new URL(attr(canonical, "href"), url).protocol,
      ),
    );
  } catch {
    /* invalid canonical */
  }
  const hasLocalBusiness = (value: unknown): boolean => {
    if (Array.isArray(value)) return value.some(hasLocalBusiness);
    if (!value || typeof value !== "object") return false;
    const object = value as Record<string, unknown>;
    return (
      [object["@type"]].flat().includes("LocalBusiness") ||
      Object.values(object).some(hasLocalBusiness)
    );
  };
  const structured = tags("script").some((e) => {
    if (attr(e, "type").toLowerCase() !== "application/ld+json") return false;
    try {
      return hasLocalBusiness(
        JSON.parse(
          e.childNodes
            .map((n) =>
              n.nodeName === "#text"
                ? (n as DefaultTreeAdapterMap["textNode"]).value
                : "",
            )
            .join(""),
        ),
      );
    } catch {
      return false;
    }
  });
  return [
    {
      id: "https",
      passed: url.protocol === "https:",
      detail:
        url.protocol === "https:"
          ? "The final page uses HTTPS."
          : "The final page does not use HTTPS.",
    },
    {
      id: "title",
      passed: title.length >= 20 && title.length <= 65,
      detail: `Page title: ${title.length} characters; aim for a descriptive 20–65 character title.`,
    },
    {
      id: "description",
      passed: description.length >= 70 && description.length <= 170,
      detail: `Meta description: ${description.length} characters; aim for 70–170 useful characters.`,
    },
    {
      id: "h1",
      passed: tags("h1").length === 1,
      detail: `Found ${tags("h1").length} H1 headings; use one clear main heading.`,
    },
    {
      id: "canonical",
      passed: canonicalValid,
      detail: canonicalValid
        ? "A canonical URL is present."
        : "Add a valid canonical URL to identify the preferred page.",
    },
    {
      id: "robots",
      passed: !/\b(noindex|none)\b/i.test(
        content("robots") + " " + content("googlebot"),
      ),
      detail: /\b(noindex|none)\b/i.test(
        content("robots") + " " + content("googlebot"),
      )
        ? "A robots meta directive prevents indexing."
        : "No noindex directive found in page meta tags (HTTP headers and crawl access are separate).",
    },
    {
      id: "viewport",
      passed: Boolean(content("viewport")),
      detail: content("viewport")
        ? "A mobile viewport declaration is present."
        : "Add a viewport declaration for mobile visitors.",
    },
    {
      id: "open_graph",
      passed: ["og:title", "og:description", "og:image"].every((k) =>
        content(k),
      ),
      detail: "Social sharing needs og:title, og:description and og:image.",
    },
    {
      id: "image_alt",
      passed: images.length ? withAlt === images.length : null,
      detail: `${withAlt}/${images.length} images have alt attributes. Empty alt is appropriate for decorative images.`,
    },
    {
      id: "content",
      passed: words >= 150,
      detail: `Found approximately ${words} visible HTML words. JavaScript-rendered content is not included.`,
    },
    {
      id: "links",
      passed: internal > 0,
      detail: `${internal} internal and ${external} external HTTP links found.`,
    },
    {
      id: "local_business",
      passed: structured ? true : null,
      detail: structured
        ? "Valid LocalBusiness JSON-LD found."
        : "No LocalBusiness JSON-LD found; relevant only for local businesses.",
    },
    {
      id: "response_time",
      passed: elapsedMs < 2000,
      detail: `HTML response took ${elapsedMs} ms from this server; this is not a Core Web Vitals measurement.`,
    },
    {
      id: "page_weight",
      passed: bytes < 500 * 1024,
      detail: `HTML weight: ${Math.round(bytes / 1024)} KB; images, scripts and stylesheets are not included.`,
    },
  ];
}

export async function runSeoAudit(
  websiteUrl: string,
): Promise<SeoQuickAuditResponse & { checks: SeoCheck[] }> {
  const page = await fetchPublicPage(websiteUrl);
  if (page.status < 200 || page.status >= 300)
    throw new AuditTargetError(
      `The website returned HTTP ${page.status}. Check that it is publicly accessible.`,
    );
  if (!/text\/html|application\/xhtml\+xml/i.test(page.contentType))
    throw new AuditTargetError(
      "The address did not return an HTML page. Enter your website homepage.",
    );
  const checks = inspectHtml(page.body, page.url, page.bytes, page.elapsedMs);
  checks.push({
    id: "status",
    passed: true,
    detail: `The page returned HTTP ${page.status}.`,
  });
  const auxiliary = await Promise.allSettled(
    ["robots.txt", "sitemap.xml"].map(async (path) => {
      const file = await fetchPublicPage(
        new URL(`/${path}`, page.url).href,
        2000,
      );
      const present =
        file.status === 200 &&
        (path === "robots.txt"
          ? /^\s*(user-agent|sitemap)\s*:/im.test(file.body)
          : /<(urlset|sitemapindex)\b/i.test(file.body));
      return {
        id: path,
        passed: present,
        detail: present
          ? `${path} is available.`
          : `${path} was not found at the standard root location; it may live elsewhere.`,
      };
    }),
  );
  auxiliary.forEach((result, i) =>
    checks.push(
      result.status === "fulfilled"
        ? result.value
        : {
            id: i ? "sitemap.xml" : "robots.txt",
            passed: null,
            detail: "This optional crawl-file check could not be completed.",
          },
    ),
  );
  const measured = checks.filter((c) => c.passed !== null);
  const quickScore = Math.round(
    (100 * measured.filter((c) => c.passed).length) / measured.length,
  );
  return {
    ok: true,
    leadId: "",
    domain: page.url.hostname,
    rootUrl: page.url.href,
    quickScore,
    statusLabel:
      quickScore >= 75
        ? "Solid foundation"
        : quickScore >= 45
          ? "Needs attention"
          : "Several checks need work",
    summary: `A technical snapshot of ${page.url.hostname}: ${measured.filter((c) => c.passed).length} of ${measured.length} measured checks passed. This checklist score does not predict rankings or AI citations.`,
    visibleIssues: checks
      .filter((c) => c.passed === false)
      .slice(0, 3)
      .map((c) => c.detail),
    opportunities: [
      "Review the homepage title and description against what your customers search for.",
      "Make service and contact pages easy to reach from the homepage.",
      "Use Search Console and a performance audit to validate indexing and real visitor experience.",
    ],
    checks,
  };
}
