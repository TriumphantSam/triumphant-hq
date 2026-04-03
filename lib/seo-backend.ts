const TRIU_BACKEND_URL = process.env.TRIUM_SEO_BACKEND_URL ?? 'http://127.0.0.1:8787';

export type SeoQuickAuditRequest = {
  websiteUrl: string;
  name: string;
  email: string;
  businessType?: string;
  notes?: string;
};

export type SeoQuickAuditResponse = {
  ok: boolean;
  leadId: string;
  domain: string;
  rootUrl?: string;
  quickScore: number;
  statusLabel: string;
  summary: string;
  visibleIssues: string[];
  opportunities: string[];
  cta?: {
    headline: string;
    description: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
  error?: string;
};

export async function proxySeoBackend<T>(path: string, payload?: unknown, method: 'GET' | 'POST' = 'POST'): Promise<T> {
  const response = await fetch(`${TRIU_BACKEND_URL}${path}`, {
    method,
    headers: payload ? { 'Content-Type': 'application/json' } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
    cache: 'no-store',
  });

  const text = await response.text();
  let data: T | { ok?: boolean; error?: string };
  try {
    data = text ? JSON.parse(text) : ({} as T);
  } catch {
    throw new Error(`Backend returned non-JSON response (${response.status})`);
  }

  if (!response.ok) {
    const message = (data as { error?: string }).error || `Backend request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export function normalizeQuickAuditResponse(data: SeoQuickAuditResponse): SeoQuickAuditResponse {
  return {
    ok: Boolean(data.ok),
    leadId: data.leadId,
    domain: data.domain,
    rootUrl: data.rootUrl,
    quickScore: Number(data.quickScore ?? 0),
    statusLabel: data.statusLabel || 'Needs Attention',
    summary: data.summary || 'We found visibility issues that need attention.',
    visibleIssues: Array.isArray(data.visibleIssues) ? data.visibleIssues.slice(0, 3) : [],
    opportunities: Array.isArray(data.opportunities) ? data.opportunities.slice(0, 3) : [],
    cta: data.cta,
  };
}
