export const CANONICAL_HOST = "triumphantech.com";
export const CANONICAL_ORIGIN = "https://triumphantech.com";

export const LEGACY_HOSTS = [
  "www.triumphantech.com",
  "triumphanthq.com",
  "www.triumphanthq.com",
] as const;

const LEGACY_HOST_SET = new Set<string>(LEGACY_HOSTS);

export function normalizeHostname(hostHeader: string | null | undefined): string {
  if (!hostHeader) return "";
  return hostHeader.split(",")[0].trim().toLowerCase().replace(/:\d+$/, "");
}

export function isLegacyHost(hostname: string): boolean {
  return LEGACY_HOST_SET.has(hostname);
}

/** Absolute apex URL. Homepage has no trailing slash; other paths keep a leading slash and no trailing slash. */
export function absoluteCanonicalUrl(path: string, search = ""): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return `${path}${search}`;
  }
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  const normalizedPath = withSlash === "/" ? "" : withSlash.replace(/\/+$/, "");
  return `${CANONICAL_ORIGIN}${normalizedPath}${search}`;
}

/**
 * If the request Host is a leftover/www host, return the matching apex URL.
 * Preview hosts (*.vercel.app) and localhost are left alone.
 */
export function canonicalRedirectUrl(
  hostHeader: string | null | undefined,
  pathname: string,
  search = "",
): string | null {
  const hostname = normalizeHostname(hostHeader);
  if (!hostname || hostname === CANONICAL_HOST || !isLegacyHost(hostname)) {
    return null;
  }
  return absoluteCanonicalUrl(pathname, search);
}
