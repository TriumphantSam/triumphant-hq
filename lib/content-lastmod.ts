import dates from "@/lib/sitemap-lastmod.json";

const map = dates as Record<string, string>;

/** YYYY-MM-DD from a CMS timestamp, or undefined when the value is missing or not a date. */
export function isoDay(value?: string | null): string | undefined {
  if (!value) return undefined;
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1];
}

export function contentLastModified(path: string): string | undefined {
  const value = map[path];
  if (typeof value !== "string") return undefined;
  const day = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : undefined;
}

function dayOf(value?: string) {
  if (!value) return undefined;
  const day = String(value).slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : undefined;
}

/** Latest real edit date that is not earlier than the published date. */
export function articleDateModified(published: string, updated?: string, fromGit?: string) {
  const publishedDay = dayOf(published) ?? String(published);
  const candidates = [updated?.slice(0, 10), fromGit?.slice(0, 10)].filter(
    (value): value is string => Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value)),
  );
  const newest = candidates.sort().at(-1);
  if (!newest || newest < publishedDay) return published;
  return newest;
}
