import type { Env } from "../types";

export const plans = [
  {
    id: "starter",
    name: "Starter",
    monthlyKobo: 1500000,
    replies: 500,
    faqs: 20,
  },
  {
    id: "growth",
    name: "Growth",
    monthlyKobo: 3500000,
    replies: 2000,
    faqs: 60,
  },
  {
    id: "business",
    name: "Business",
    monthlyKobo: 7500000,
    replies: 5000,
    faqs: 150,
  },
] as const;
export class PlatformError extends Error {
  constructor(
    message: string,
    public status: 400 | 401 | 403 | 404 | 409 | 429 | 503 = 400,
  ) {
    super(message);
  }
}
export type Workspace = {
  id: string;
  owner_user_id: string;
  name: string;
  description: string;
  timezone: string;
  contact_url: string;
  plan_id: string;
  state: "draft" | "testing" | "published" | "suspended";
  version: number;
  created_at: string;
  updated_at: string;
};
export type Faq = { id: string; question: string; answer: string };
const stopwords = new Set([
  "what",
  "when",
  "where",
  "which",
  "how",
  "are",
  "your",
  "you",
  "the",
  "does",
  "have",
  "can",
  "please",
  "tell",
  "about",
  "with",
  "for",
  "and",
  "that",
  "this",
]);
export function matchFaq(question: string, faqs: Faq[]) {
  const words = (value: string) =>
    value.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
  const normalized = words(question).join(" ");
  const exact = faqs.find((f) => words(f.question).join(" ") === normalized);
  if (exact) return exact;
  const keywords = new Set(
    words(question).filter((w) => w.length > 2 && !stopwords.has(w)),
  );
  const ranked = faqs
    .map((f) => ({
      f,
      score: new Set(words(f.question).filter((w) => keywords.has(w))).size,
    }))
    .sort((a, b) => b.score - a.score);
  // Generic phrasing and repeated words cannot turn an unknown topic into a fact.
  return ranked[0]?.score >= 2 && ranked[0].score > (ranked[1]?.score || 0)
    ? ranked[0].f
    : null;
}
export const validId = (value: unknown): value is string =>
  typeof value === "string" && /^[a-f0-9-]{36}$/.test(value);
const string = (value: unknown, min: number, max: number) => {
  if (
    typeof value !== "string" ||
    value.trim().length < min ||
    value.trim().length > max
  )
    throw new PlatformError(
      "Please check the business details and field lengths.",
    );
  return value.trim();
};
export async function admit(
  env: Env,
  key: string,
  limit: number,
  windowMs = 3600000,
) {
  const now = Date.now();
  const row = await env.DB.prepare(
    "INSERT INTO rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires_at<=? THEN 1 ELSE count+1 END,expires_at=CASE WHEN expires_at<=? THEN excluded.expires_at ELSE expires_at END RETURNING count",
  )
    .bind("platform:" + key, now + windowMs, now, now)
    .first<{ count: number }>();
  if (!row || row.count > limit)
    throw new PlatformError("Too many requests. Please try later.", 429);
}
export async function requireWorkspace(
  env: Env,
  userId: string,
  workspaceId: unknown,
  owner = false,
) {
  if (!validId(workspaceId))
    throw new PlatformError("Workspace not found.", 404);
  const workspace = await env.DB.prepare(
    "SELECT w.*,m.role FROM platform_workspaces w JOIN platform_memberships m ON m.workspace_id=w.id WHERE w.id=? AND m.user_id=?",
  )
    .bind(workspaceId, userId)
    .first<Workspace & { role: string }>();
  if (!workspace) throw new PlatformError("Workspace not found.", 404);
  if (owner && workspace.role !== "owner")
    throw new PlatformError(
      "Only the business owner can change these settings.",
      403,
    );
  return workspace;
}
export async function createWorkspace(env: Env, userId: string, name: unknown) {
  const businessName = string(name, 2, 100),
    id = crypto.randomUUID(),
    now = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO platform_workspaces(id,owner_user_id,name,created_at,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(owner_user_id) DO NOTHING",
    ).bind(id, userId, businessName, now, now),
    env.DB.prepare(
      "INSERT INTO platform_memberships(workspace_id,user_id,role) SELECT id,?,'owner' FROM platform_workspaces WHERE owner_user_id=? ON CONFLICT DO NOTHING",
    ).bind(userId, userId),
    env.DB.prepare(
      "INSERT INTO platform_booking_policy(workspace_id) SELECT id FROM platform_workspaces WHERE owner_user_id=? ON CONFLICT DO NOTHING",
    ).bind(userId),
  ]);
  return env.DB.prepare(
    "SELECT * FROM platform_workspaces WHERE owner_user_id=?",
  )
    .bind(userId)
    .first<Workspace>();
}
export function profileInput(input: Record<string, unknown>) {
  const name = string(input.name, 2, 100),
    description = string(input.description, 0, 1500),
    contactUrl = string(input.contactUrl, 0, 400);
  if (contactUrl) {
    let url: URL;
    try {
      url = new URL(contactUrl);
    } catch {
      throw new PlatformError("Use a full HTTPS contact link.");
    }
    if (url.protocol !== "https:" || url.username || url.password)
      throw new PlatformError("Use a full HTTPS contact link.");
  }
  if (!Number.isSafeInteger(input.version) || Number(input.version) < 0)
    throw new PlatformError("Reload your business settings.");
  return { name, description, contactUrl, version: Number(input.version) };
}
export async function saveProfile(
  env: Env,
  userId: string,
  workspaceId: unknown,
  input: Record<string, unknown>,
) {
  const workspace = await requireWorkspace(env, userId, workspaceId, true),
    data = profileInput(input);
  const changed = await env.DB.prepare(
    "UPDATE platform_workspaces SET name=?,description=?,contact_url=?,version=version+1,updated_at=? WHERE id=? AND version=? RETURNING id",
  )
    .bind(
      data.name,
      data.description,
      data.contactUrl,
      new Date().toISOString(),
      workspace.id,
      data.version,
    )
    .first();
  if (!changed)
    throw new PlatformError(
      "These settings changed in another tab. Reload before saving.",
      409,
    );
  return requireWorkspace(env, userId, workspace.id);
}
export async function saveFaqs(
  env: Env,
  userId: string,
  workspaceId: unknown,
  input: Record<string, unknown>,
) {
  const w = await requireWorkspace(env, userId, workspaceId, true);
  const plan = plans.find((p) => p.id === w.plan_id) || plans[0];
  if (
    !Array.isArray(input.faqs) ||
    input.faqs.length > plan.faqs ||
    !Number.isSafeInteger(input.version)
  )
    throw new PlatformError(
      `This plan allows up to ${plan.faqs} approved answers.`,
    );
  const faqs = input.faqs.map((entry: Record<string, unknown>) => {
    if (!entry || typeof entry !== "object")
      throw new PlatformError("Invalid approved answer.");
    return {
      id: validId(entry.id) ? entry.id : crypto.randomUUID(),
      question: string(entry.question, 3, 200),
      answer: string(entry.answer, 1, 1500),
    };
  });
  if (new Set(faqs.map((f) => f.id)).size !== faqs.length)
    throw new PlatformError("Duplicate answer identifiers.");
  // The conditional lock gates every statement in this atomic batch. A stale
  // editor must not delete answers written by a more recent editor.
  const lock = crypto.randomUUID();
  const results = await env.DB.batch([
    env.DB.prepare(
      "UPDATE platform_workspaces SET version=version+1,updated_at=? WHERE id=? AND version=? RETURNING id",
    ).bind(lock, w.id, input.version),
    env.DB.prepare(
      "DELETE FROM platform_faqs WHERE workspace_id=? AND EXISTS(SELECT 1 FROM platform_workspaces WHERE id=? AND updated_at=?)",
    ).bind(w.id, w.id, lock),
    env.DB.prepare(
      "INSERT INTO platform_faqs(workspace_id,id,question,answer) SELECT ?,json_extract(value,'$.id'),json_extract(value,'$.question'),json_extract(value,'$.answer') FROM json_each(?) WHERE EXISTS(SELECT 1 FROM platform_workspaces WHERE id=? AND updated_at=?)",
    ).bind(w.id, JSON.stringify(faqs), w.id, lock),
    env.DB.prepare(
      "UPDATE platform_workspaces SET updated_at=? WHERE id=? AND updated_at=?",
    ).bind(new Date().toISOString(), w.id, lock),
  ]);
  if (!results[0].results.length)
    throw new PlatformError(
      "These answers changed in another tab. Reload before saving.",
      409,
    );
  return requireWorkspace(env, userId, w.id);
}
export async function workspaceView(
  env: Env,
  userId: string,
  workspaceId: unknown,
) {
  const workspace = await requireWorkspace(env, userId, workspaceId);
  const faqs = await env.DB.prepare(
    "SELECT id,question,answer FROM platform_faqs WHERE workspace_id=? ORDER BY id",
  )
    .bind(workspace.id)
    .all<Faq>();
  const policy = await env.DB.prepare(
    "SELECT days,start_hour,end_hour,duration,buffer,notice_hours FROM platform_booking_policy WHERE workspace_id=?",
  )
    .bind(workspace.id)
    .first();
  const usage = await env.DB.prepare(
    "SELECT kind,count FROM platform_usage WHERE workspace_id=? AND period=?",
  )
    .bind(workspace.id, new Date(Date.now() + 3600000).toISOString().slice(0, 7))
    .all();
  const [responder, rehearsal, whatsapp] = await Promise.all([
    env.DB.prepare("SELECT version FROM platform_responder_settings WHERE workspace_id=?").bind(workspace.id).first<{version:number}>(),
    env.DB.prepare("SELECT id FROM platform_conversations WHERE workspace_id=? AND json_array_length(messages)>0 LIMIT 1").bind(workspace.id).first(),
    env.DB.prepare("SELECT 1 AS ok FROM platform_whatsapp_connections WHERE workspace_id=? AND state='connected'").bind(workspace.id).first(),
  ]);
  return {
    workspace,
    faqs: faqs.results,
    policy,
    usage: usage.results,
    plans,
    readiness: {
      account: true,
      profile: Boolean(workspace.description),
      answers: faqs.results.length > 0,
      respondersConfigured: Boolean(responder && responder.version > 0),
      conversationTested: Boolean(rehearsal),
      websitePublished: workspace.state === "published",
      whatsappConnected: Boolean(whatsapp),
      billingActive: false,
    },
  };
}
