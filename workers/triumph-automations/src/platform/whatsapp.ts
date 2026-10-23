import type { Env } from "../types";
import { hmac } from "../security";
import {
  PlatformError,
  matchFaq,
  requireWorkspace,
  validId,
  type Faq,
} from "./core";
import { tenantAnswer } from "./tenant-ai";
import { responderDefaults } from "./conversations";
import {threadSignals} from './collaboration';

export const PROTECTED_PHONE_NUMBER_IDS = new Set(["1092109073976406"]);
export const PROTECTED_DISPLAY_PHONES = new Set(["447478036301"]);
const GRAPH_HOST = "https://graph.facebook.com/";
const DEFAULT_GRAPH = "v26.0";
const TEXT_LIMIT = 1000;
const EVENT_LIMIT = 200;
type Connection = {
  workspace_id: string;
  phone_number_id: string;
  messaging_account_id: string;
  display_phone: string | null;
  is_on_biz_app: number;
  token_ciphertext: string;
  token_iv: string;
  state: string;
};
type Thread = {
  id: string;
  workspace_id: string;
  wa_id: string;
  label: string;
  paused: number;
  version: number;
  updated_at: string;
};
type Settings = {
  welcome: string;
  away: string;
  fallback: string;
  enabled: boolean | number;
  ai_enabled: boolean | number;
};
class GraphFailure extends Error {
  constructor(public status: number) {
    super("graph_request_failed");
  }
}
export function graphVersion(env: Env) {
  return /^v\d+\.0$/.test(env.PLATFORM_WA_GRAPH_VERSION || "")
    ? env.PLATFORM_WA_GRAPH_VERSION!
    : DEFAULT_GRAPH;
}
export function whatsappConfigured(env: Env) {
  return Boolean(
    env.META_APP_ID &&
      /^\d{5,32}$/.test(env.META_APP_ID) &&
      env.META_APP_SECRET &&
      env.PLATFORM_WA_VERIFY_TOKEN &&
      webhookUrl(env) &&
      /^[0-9a-f]{64}$/i.test(env.PLATFORM_WA_TOKEN_KEY || ""),
  );
}
export function whatsappReady(env: Env) {
  return (
    env.ENVIRONMENT !== "production" &&
    env.PLATFORM_WHATSAPP_ENABLED === "true" &&
    whatsappConfigured(env)
  );
}
function webhookUrl(env: Env) {
  try {
    const url = new URL(env.PLATFORM_WA_WEBHOOK_URL || "");
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.hash ||
      url.pathname !== "/webhooks/whatsapp"
    )
      return "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}
function digits(value: unknown, min = 5, max = 32) {
  return typeof value === "string" && new RegExp(`^\\d{${min},${max}}$`).test(value)
    ? value
    : "";
}
function compactPhone(value: string) {
  return value.replace(/[^\d]/g, "");
}
function isProtectedNumber(phoneNumberId: string, displayPhone = "") {
  return (
    PROTECTED_PHONE_NUMBER_IDS.has(phoneNumberId) ||
    PROTECTED_DISPLAY_PHONES.has(compactPhone(displayPhone))
  );
}
function pauseCommand(text: string) {
  return /^(stop|human|agent|help|speak to (a person|the team))\b/i.test(text);
}
function extractInboundText(message: Record<string, unknown>) {
  const type = String(message.type || "");
  if (type === "text") {
    const text = message.text as { body?: string } | undefined;
    return (text?.body || "").trim().slice(0, TEXT_LIMIT);
  }
  if (type === "interactive") {
    const interactive = message.interactive as {
      type?: string;
      button_reply?: { id?: string; title?: string };
      list_reply?: { id?: string; title?: string };
    };
    if (interactive?.type === "button_reply")
      return String(
        interactive.button_reply?.id || interactive.button_reply?.title || "",
      )
        .trim()
        .slice(0, TEXT_LIMIT);
    if (interactive?.type === "list_reply")
      return String(
        interactive.list_reply?.id || interactive.list_reply?.title || "",
      )
        .trim()
        .slice(0, TEXT_LIMIT);
  }
  if (type === "button") {
    const button = message.button as { payload?: string; text?: string };
    return String(button?.payload || button?.text || "")
      .trim()
      .slice(0, TEXT_LIMIT);
  }
  return "";
}
async function importTokenKey(env: Env) {
  const hex = env.PLATFORM_WA_TOKEN_KEY || "";
  if (!/^[0-9a-f]{64}$/i.test(hex))
    throw new PlatformError("WhatsApp credential storage is not configured.", 503);
  const bytes = Uint8Array.from(
    hex.match(/.{2}/g)!.map((part) => Number.parseInt(part, 16)),
  );
  return crypto.subtle.importKey("raw", bytes, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}
function hex(bytes: Uint8Array) {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function fromHex(value: string) {
  return Uint8Array.from(
    value.match(/.{2}/g)!.map((part) => Number.parseInt(part, 16)),
  );
}
async function encryptSecret(env: Env, plaintext: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const sealed = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      await importTokenKey(env),
      new TextEncoder().encode(plaintext),
    ),
  );
  return { iv: hex(iv), ciphertext: hex(sealed) };
}
async function decryptSecret(env: Env, iv: string, ciphertext: string) {
  if (!/^[0-9a-f]+$/i.test(iv) || !/^[0-9a-f]+$/i.test(ciphertext))
    throw new PlatformError("WhatsApp credentials need to be connected again.", 503);
  const bytes = new Uint8Array(
    await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromHex(iv) },
      await importTokenKey(env),
      fromHex(ciphertext),
    ),
  );
  return new TextDecoder().decode(bytes);
}
async function connectionToken(env: Env, row: Connection) {
  return decryptSecret(env, row.token_iv, row.token_ciphertext);
}
async function compareHex(expected: string, supplied: string) {
  if (expected.length !== supplied.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++)
    diff |= expected.charCodeAt(i) ^ supplied.charCodeAt(i);
  return diff === 0;
}
export async function validWhatsAppSignature(
  secret: string,
  body: string,
  header: string,
) {
  if (!secret || !header.startsWith("sha256=")) return false;
  const expected = await hmac(secret, body);
  return compareHex(expected, header.slice("sha256=".length).trim().toLowerCase());
}
async function graph(
  env: Env,
  token: string,
  method: "GET" | "POST",
  path: string,
  body?: Record<string, unknown>,
) {
  const url = path.startsWith("https://")
    ? path
    : `${GRAPH_HOST}${graphVersion(env)}${path}`;
  const headers = new Headers({ "Content-Type": "application/json" });
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(8000),
    redirect: "manual",
  });
  if (!response.ok) throw new GraphFailure(response.status);
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { access_token: text.trim() };
  }
}
async function exchangeCode(env: Env, code: string) {
  const url = new URL(`${GRAPH_HOST}${graphVersion(env)}/oauth/access_token`);
  url.searchParams.set("client_id", env.META_APP_ID!);
  url.searchParams.set("client_secret", env.META_APP_SECRET!);
  url.searchParams.set("code", code);
  const result = await graph(env, "", "GET", url.toString());
  const token = String(result.access_token || "").trim();
  if (!token) throw new GraphFailure(400);
  return token;
}
function publicConnection(row: Connection | null) {
  return {
    available: true,
    testerOnly: true,
    connected: row?.state === "connected",
    displayPhone: row?.display_phone || null,
    isOnBizApp: Boolean(row?.is_on_biz_app),
    sandbox: true,
  };
}
async function loadConnection(env: Env, workspaceId: string) {
  return env.DB.prepare(
    "SELECT workspace_id,phone_number_id,messaging_account_id,display_phone,is_on_biz_app,token_ciphertext,token_iv,state FROM platform_whatsapp_connections WHERE workspace_id=?",
  )
    .bind(workspaceId)
    .first<Connection>();
}
async function loadConnectedPhone(env: Env, phoneNumberId: string) {
  return env.DB.prepare(
    "SELECT workspace_id,phone_number_id,messaging_account_id,display_phone,is_on_biz_app,token_ciphertext,token_iv,state FROM platform_whatsapp_connections WHERE phone_number_id=? AND state='connected'",
  )
    .bind(phoneNumberId)
    .first<Connection>();
}
function sessionAssets(session: Record<string, unknown>) {
  const data =
    session.data && typeof session.data === "object" && !Array.isArray(session.data)
      ? (session.data as Record<string, unknown>)
      : session;
  const accounts = Array.isArray(data.messaging_account_ids)
    ? data.messaging_account_ids
    : [];
  const phoneNumberId = digits(data.phone_number_id, 5, 32);
  if (isProtectedNumber(phoneNumberId))
    throw new PlatformError(
      "This number belongs to the existing agency campaign and cannot be connected here.",
    );
  const messagingAccountId =
    digits(accounts[0], 5, 32) || digits(data.waba_id, 5, 32);
  const businessId = digits(data.business_id, 5, 32);
  const event = String(session.event || "");
  if (!phoneNumberId || !messagingAccountId)
    throw new PlatformError(
      "Embedded Signup did not return the WhatsApp account details. Complete the flow again.",
    );
  return {
    phoneNumberId,
    messagingAccountId,
    businessId,
    isOnBizApp:
      data.is_on_biz_app === true ||
      event === "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING",
  };
}
async function sendTenantText(
  env: Env,
  token: string,
  phoneNumberId: string,
  to: string,
  text: string,
) {
  const result = await graph(
    env,
    token,
    "POST",
    `/${phoneNumberId}/messages`,
    {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body: text.slice(0, 4096) },
    },
  );
  const messages = result.messages as Array<{ id?: string }> | undefined;
  const id = String(messages?.[0]?.id || "");
  if (!/^[A-Za-z0-9._=+/-]{8,256}$/.test(id)) throw new GraphFailure(502);
  return id;
}
async function recordUsage(env: Env, workspaceId: string, requestId: string, now: number) {
  const period = new Date(now + 3600000).toISOString().slice(0, 7);
  const date = new Date(now).toISOString();
  const claimId = crypto.randomUUID();
  const digest = await hmac(env.AUTOMATION_HMAC_SECRET, requestId);
  const result = await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO platform_reply_requests(workspace_id,request_id,payload_digest,reply,claim_id,created_at) SELECT ?,?,?,?,?,? WHERE COALESCE((SELECT count FROM platform_usage WHERE workspace_id=? AND period=? AND kind='assistant_replies'),0)<100 ON CONFLICT DO NOTHING RETURNING request_id",
    ).bind(
      workspaceId,
      requestId,
      digest,
      JSON.stringify({ channel: "whatsapp" }),
      claimId,
      date,
      workspaceId,
      period,
    ),
    env.DB.prepare(
      "INSERT INTO platform_usage(workspace_id,period,kind,count) SELECT ?,?,'assistant_replies',1 WHERE EXISTS(SELECT 1 FROM platform_reply_requests WHERE workspace_id=? AND request_id=? AND claim_id=?) ON CONFLICT(workspace_id,period,kind) DO UPDATE SET count=count+1",
    ).bind(workspaceId, period, workspaceId, requestId, claimId),
  ]);
  return Boolean(result[0].results.length);
}
async function connectWorkspace(
  env: Env,
  userId: string,
  input: Record<string, unknown>,
) {
  if (!whatsappReady(env))
    throw new PlatformError(
      "WhatsApp onboarding is available in staging after Meta app settings are configured. App Review is not submitted, so only testers on the app can complete this flow.",
      503,
    );
  const w = await requireWorkspace(env, userId, input.workspaceId, true);
  if (typeof input.code !== "string" || input.code.length < 8 || input.code.length > 4096)
    throw new PlatformError("The connection code is missing. Start Embedded Signup again.");
  if (!input.session || typeof input.session !== "object" || Array.isArray(input.session))
    throw new PlatformError("Embedded Signup did not return session details.");
  const assets = sessionAssets(input.session as Record<string, unknown>);
  if (isProtectedNumber(assets.phoneNumberId))
    throw new PlatformError(
      "This number belongs to the existing agency campaign and cannot be connected here.",
    );
  let token: string;
  try {
    token = await exchangeCode(env, input.code);
  } catch (error) {
    if (error instanceof GraphFailure && error.status < 500)
      throw new PlatformError(
        "The connection code expired. Start Embedded Signup again.",
      );
    throw new PlatformError("Meta could not exchange the connection code.", 503);
  }
  let phone: {
    display_phone_number?: string;
    is_on_biz_app?: boolean;
    platform_type?: string;
  };
  try {
    phone = (await graph(
      env,
      token,
      "GET",
      `/${assets.phoneNumberId}?fields=display_phone_number,is_on_biz_app,platform_type`,
    )) as typeof phone;
  } catch {
    throw new PlatformError("Meta could not read the selected WhatsApp number.", 503);
  }
  const display = String(phone.display_phone_number || "").trim();
  if (isProtectedNumber(assets.phoneNumberId, display))
    throw new PlatformError(
      "This number belongs to the existing agency campaign and cannot be connected here.",
    );
  const isOnBizApp = Boolean(phone.is_on_biz_app) || assets.isOnBizApp;
  const taken = await env.DB.prepare(
    "SELECT workspace_id FROM platform_whatsapp_connections WHERE phone_number_id=? AND workspace_id<>? AND state='connected'",
  )
    .bind(assets.phoneNumberId, w.id)
    .first<{ workspace_id: string }>();
  if (taken)
    throw new PlatformError("This WhatsApp number is already connected to another business.");
  let pinCipher: string | null = null,
    pinIv: string | null = null;
  try {
    await graph(env, token, "POST", `/${assets.messagingAccountId}/subscribed_apps`, {
      override_callback_uri: webhookUrl(env),
      verify_token: env.PLATFORM_WA_VERIFY_TOKEN,
    });
    if (!isOnBizApp) {
      const pin = (crypto.getRandomValues(new Uint32Array(1))[0] % 1000000)
        .toString()
        .padStart(6, "0");
      await graph(env, token, "POST", `/${assets.phoneNumberId}/register`, {
        messaging_product: "whatsapp",
        pin,
      });
      const sealedPin = await encryptSecret(env, pin);
      pinCipher = sealedPin.ciphertext;
      pinIv = sealedPin.iv;
    }
  } catch (error) {
    if (error instanceof GraphFailure && error.status < 500)
      throw new PlatformError(
        "Meta did not accept the webhook override. Confirm the staging callback URL can verify subscriptions.",
      );
    throw new PlatformError("Meta could not finish WhatsApp onboarding.", 503);
  }
  const sealed = await encryptSecret(env, token);
  const now = new Date().toISOString();
  await env.DB.prepare(
    "INSERT INTO platform_whatsapp_connections(workspace_id,phone_number_id,messaging_account_id,business_id,display_phone,is_on_biz_app,token_ciphertext,token_iv,pin_ciphertext,pin_iv,state,connected_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?, 'connected',?,?) ON CONFLICT(workspace_id) DO UPDATE SET phone_number_id=excluded.phone_number_id,messaging_account_id=excluded.messaging_account_id,business_id=excluded.business_id,display_phone=excluded.display_phone,is_on_biz_app=excluded.is_on_biz_app,token_ciphertext=excluded.token_ciphertext,token_iv=excluded.token_iv,pin_ciphertext=excluded.pin_ciphertext,pin_iv=excluded.pin_iv,state='connected',connected_at=excluded.connected_at,updated_at=excluded.updated_at",
  )
    .bind(
      w.id,
      assets.phoneNumberId,
      assets.messagingAccountId,
      assets.businessId || null,
      display || null,
      Number(isOnBizApp),
      sealed.ciphertext,
      sealed.iv,
      pinCipher,
      pinIv,
      now,
      now,
    )
    .run();
  return publicConnection(await loadConnection(env, w.id));
}
async function disconnectWorkspace(env: Env, userId: string, workspaceId: unknown) {
  if (!whatsappReady(env))
    throw new PlatformError("WhatsApp onboarding is not available in this environment.", 503);
  const w = await requireWorkspace(env, userId, workspaceId, true);
  await env.DB.prepare(
    "DELETE FROM platform_whatsapp_connections WHERE workspace_id=?",
  )
    .bind(w.id)
    .run();
  return publicConnection(null);
}
function eventView(row: {
  wamid: string;
  role: string;
  text: string;
  created_at: string;
}) {
  return { id: row.wamid, role: row.role, text: row.text, at: row.created_at };
}
async function listThreads(env: Env, userId: string, workspaceId: unknown) {
  const w = await requireWorkspace(env, userId, workspaceId);
  const rows = await env.DB.prepare(
    "SELECT id,label,wa_id,paused,version,updated_at FROM platform_whatsapp_threads WHERE workspace_id=? ORDER BY updated_at DESC,id LIMIT 50",
  )
    .bind(w.id)
    .all<Thread>();
  const signals=await threadSignals(env,w.id,userId,'whatsapp');
  return {
    threads: rows.results.map((row) => ({
      ...row,
      ...signals.get(row.id),
      paused: Boolean(row.paused),
      wa_id: row.wa_id.slice(-4),
    })),
    sandbox: true,
  };
}
async function readThread(env: Env, userId: string, input: Record<string, unknown>) {
  const w = await requireWorkspace(env, userId, input.workspaceId);
  if (!validId(input.id)) throw new PlatformError("Conversation not found.", 404);
  const row = await env.DB.prepare(
    "SELECT id,label,wa_id,paused,version,updated_at FROM platform_whatsapp_threads WHERE workspace_id=? AND id=?",
  )
    .bind(w.id, input.id)
    .first<Thread>();
  if (!row) throw new PlatformError("Conversation not found.", 404);
  const events = await env.DB.prepare(
    "SELECT rowid AS read_cursor,wamid,role,text,created_at FROM platform_whatsapp_events WHERE workspace_id=? AND thread_id=? ORDER BY rowid DESC LIMIT ?",
  )
    .bind(w.id, row.id, EVENT_LIMIT)
    .all<{ read_cursor:number;wamid: string; role: string; text: string; created_at: string }>();
  return {
    ...row,
    paused: Boolean(row.paused),
    wa_id: row.wa_id.slice(-4),
    readCursor:events.results[0]?.read_cursor||0,
    messages: [...events.results].reverse().map(eventView),
    sandbox: true,
    live: true,
  };
}
async function pauseThread(env: Env, userId: string, input: Record<string, unknown>) {
  const w = await requireWorkspace(env, userId, input.workspaceId);
  if (!validId(input.id) || typeof input.paused !== "boolean" || !Number.isSafeInteger(input.version))
    throw new PlatformError("Reload this conversation.", 409);
  const updated = await env.DB.prepare(
    "UPDATE platform_whatsapp_threads SET paused=?,version=version+1,updated_at=? WHERE workspace_id=? AND id=? AND version=? RETURNING id,label,wa_id,paused,version,updated_at",
  )
    .bind(Number(input.paused), new Date().toISOString(), w.id, input.id, input.version)
    .first<Thread>();
  if (!updated)
    throw new PlatformError("Another reply changed this conversation. Reload before continuing.", 409);
  return readThread(env, userId, input);
}
async function teamReply(env: Env, userId: string, input: Record<string, unknown>, now = Date.now()) {
  if (!whatsappReady(env))
    throw new PlatformError("WhatsApp sending is not available in this environment.", 503);
  const w = await requireWorkspace(env, userId, input.workspaceId);
  if (!validId(input.id) || !Number.isSafeInteger(input.version))
    throw new PlatformError("Reload this conversation.", 409);
  const text = typeof input.text === "string" ? input.text.trim() : "";
  if (!text || text.length > TEXT_LIMIT)
    throw new PlatformError(`Enter text between 1 and ${TEXT_LIMIT} characters.`);
  const thread = await env.DB.prepare(
    "SELECT id,wa_id,version FROM platform_whatsapp_threads WHERE workspace_id=? AND id=?",
  )
    .bind(w.id, input.id)
    .first<{ id: string; wa_id: string; version: number }>();
  if (!thread) throw new PlatformError("Conversation not found.", 404);
  if (thread.version !== input.version)
    throw new PlatformError("Another reply changed this conversation. Reload before continuing.", 409);
  const connection = await loadConnection(env, w.id);
  if (connection?.state !== "connected")
    throw new PlatformError("Connect a WhatsApp number before sending a reply.");
  const token = await connectionToken(env, connection);
  let wamid: string;
  try {
    wamid = await sendTenantText(env, token, connection.phone_number_id, thread.wa_id, text);
  } catch {
    throw new PlatformError("WhatsApp did not accept that reply. Try again.", 503);
  }
  const date = new Date(now).toISOString();
  const updated = await env.DB.prepare(
    "UPDATE platform_whatsapp_threads SET paused=1,version=version+1,updated_at=? WHERE workspace_id=? AND id=? AND version=? RETURNING id",
  )
    .bind(date, w.id, thread.id, thread.version)
    .first();
  if (!updated)
    throw new PlatformError("Another reply changed this conversation. Reload before continuing.", 409);
  await env.DB.prepare(
    "INSERT INTO platform_whatsapp_events(wamid,workspace_id,thread_id,direction,role,text,created_at) VALUES(?,?,?,'out','team',?,?) ON CONFLICT DO NOTHING",
  )
    .bind(wamid, w.id, thread.id, text, date)
    .run();
  return readThread(env, userId, input);
}
export async function whatsappAction(
  env: Env,
  userId: string,
  action: string,
  input: Record<string, unknown>,
  now = Date.now(),
) {
  if (action === "whatsapp.read") {
    const w = await requireWorkspace(env, userId, input.workspaceId);
    if (!whatsappReady(env))
      return {
        available: false,
        testerOnly: true,
        connected: false,
        displayPhone: null,
        isOnBizApp: false,
        sandbox: true,
      };
    return publicConnection(await loadConnection(env, w.id));
  }
  if (action === "whatsapp.connect") return connectWorkspace(env, userId, input);
  if (action === "whatsapp.disconnect")
    return disconnectWorkspace(env, userId, input.workspaceId);
  if (action === "whatsapp.inbox") return listThreads(env, userId, input.workspaceId);
  if (action === "whatsapp.thread") return readThread(env, userId, input);
  if (action === "whatsapp.pause") return pauseThread(env, userId, input);
  if (action === "whatsapp.reply") return teamReply(env, userId, input, now);
  throw new PlatformError("This platform action is not available.", 404);
}
async function upsertThread(
  env: Env,
  workspaceId: string,
  waId: string,
  label: string,
  now: string,
) {
  const existing = await env.DB.prepare(
    "SELECT id,paused,version FROM platform_whatsapp_threads WHERE workspace_id=? AND wa_id=?",
  )
    .bind(workspaceId, waId)
    .first<{ id: string; paused: number; version: number }>();
  if (existing) return { ...existing, created: false };
  const id = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT OR IGNORE INTO platform_whatsapp_threads(id,workspace_id,wa_id,label,created_at,updated_at) VALUES(?,?,?,?,?,?)",
  )
    .bind(id, workspaceId, waId, label.slice(0, 80), now, now)
    .run();
  const row = await env.DB.prepare(
    "SELECT id,paused,version FROM platform_whatsapp_threads WHERE workspace_id=? AND wa_id=?",
  )
    .bind(workspaceId, waId)
    .first<{ id: string; paused: number; version: number }>();
  return { ...(row || existing)!, created: !existing };
}
async function replyToInbound(
  env: Env,
  connection: Connection,
  thread: { id: string; paused: number; created: boolean },
  waId: string,
  wamid: string,
  text: string,
  now: number,
) {
  if (thread.paused || pauseCommand(text)) {
    if (!thread.paused)
      await env.DB.prepare(
        "UPDATE platform_whatsapp_threads SET paused=1,version=version+1,updated_at=? WHERE id=? AND workspace_id=?",
      )
        .bind(new Date(now).toISOString(), thread.id, connection.workspace_id)
        .run();
    return;
  }
  const config =
    (await env.DB.prepare(
      "SELECT welcome,away,fallback,enabled,ai_enabled FROM platform_responder_settings WHERE workspace_id=?",
    )
      .bind(connection.workspace_id)
      .first<Settings>()) || responderDefaults;
  if (!config.enabled) return;
  const faqs = await env.DB.prepare(
    "SELECT id,question,answer FROM platform_faqs WHERE workspace_id=? ORDER BY id",
  )
    .bind(connection.workspace_id)
    .all<Faq>();
  const policy = await env.DB.prepare(
    "SELECT days,start_hour,end_hour FROM platform_booking_policy WHERE workspace_id=?",
  )
    .bind(connection.workspace_id)
    .first<{ days: string; start_hour: number; end_hour: number }>();
  const local = new Date(now + 3600000);
  const open =
    policy &&
    JSON.parse(policy.days).includes(local.getUTCDay()) &&
    local.getUTCHours() >= policy.start_hour &&
    local.getUTCHours() < policy.end_hour;
  const requestId = crypto.randomUUID();
  const resolved =
    open && config.ai_enabled
      ? await tenantAnswer(
          env,
          connection.workspace_id,
          requestId,
          text,
          faqs.results,
          config.fallback,
          now,
        )
      : {
          answer: !open ? config.away : matchFaq(text, faqs.results)?.answer || config.fallback,
          method: !open ? "away" : "approved",
          handoff: open ? !matchFaq(text, faqs.results) : false,
        };
  if (resolved.handoff)
    await env.DB.prepare(
      "UPDATE platform_whatsapp_threads SET paused=1,version=version+1,updated_at=? WHERE id=? AND workspace_id=?",
    )
      .bind(new Date(now).toISOString(), thread.id, connection.workspace_id)
      .run();
  if (!(await recordUsage(env, connection.workspace_id, wamid, now))) return;
  const token = await connectionToken(env, connection);
  const outgoing: string[] = [];
  if (thread.created) outgoing.push(config.welcome);
  outgoing.push(resolved.answer);
  for (const body of outgoing) {
    try {
      const sentId = await sendTenantText(
        env,
        token,
        connection.phone_number_id,
        waId,
        body,
      );
      await env.DB.prepare(
        "INSERT INTO platform_whatsapp_events(wamid,workspace_id,thread_id,direction,role,text,created_at) VALUES(?,?,?,'out','automation',?,?) ON CONFLICT DO NOTHING",
      )
        .bind(sentId, connection.workspace_id, thread.id, body, new Date(now).toISOString())
        .run();
    } catch {
      return;
    }
  }
}
export async function processWhatsAppPayload(
  env: Env,
  payload: {
    object?: string;
    entry?: Array<{
      changes?: Array<{
        value?: {
          metadata?: { phone_number_id?: string };
          contacts?: Array<{ profile?: { name?: string } }>;
          messages?: Array<Record<string, unknown>>;
        };
      }>;
    }>;
  },
  now = Date.now(),
) {
  if (payload.object !== "whatsapp_business_account" || !whatsappReady(env)) return;
  for (const entry of payload.entry || []) {
    for (const change of entry.changes || []) {
      const value = change.value || {};
      const phoneNumberId = digits(value.metadata?.phone_number_id, 5, 32);
      if (!phoneNumberId || isProtectedNumber(phoneNumberId)) continue;
      const connection = await loadConnectedPhone(env, phoneNumberId);
      if (!connection) continue;
      const label = String(value.contacts?.[0]?.profile?.name || "").trim() || "WhatsApp customer";
      for (const message of value.messages || []) {
        const waId = digits(message.from, 7, 15);
        const wamid = typeof message.id === "string" ? message.id : "";
        const text = extractInboundText(message);
        if (!waId || !/^[A-Za-z0-9._=+/-]{8,256}$/.test(wamid) || !text) continue;
        const date = new Date(now).toISOString();
        const thread = await upsertThread(env, connection.workspace_id, waId, label, date);
        const stored = await env.DB.prepare(
          "INSERT INTO platform_whatsapp_events(wamid,workspace_id,thread_id,direction,role,text,created_at) VALUES(?,?,?,'in','customer',?,?) ON CONFLICT DO NOTHING RETURNING wamid",
        )
          .bind(wamid, connection.workspace_id, thread.id, text, date)
          .first();
        if (!stored) continue;
        await env.DB.prepare(
          "UPDATE platform_whatsapp_threads SET updated_at=? WHERE id=? AND workspace_id=?",
        )
          .bind(date, thread.id, connection.workspace_id)
          .run();
        await replyToInbound(env, connection, thread, waId, wamid, text, now);
      }
    }
  }
}
async function readWebhookBody(request: Request) {
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  if (reader) {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.length;
        if (bytes > 262144) {
          await reader.cancel();
          return null;
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
  }
  const buffer = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(buffer);
}
export async function verifyWhatsAppSubscription(request: Request, env: Env) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge") || "";
  if (
    mode === "subscribe" &&
    token &&
    env.PLATFORM_WA_VERIFY_TOKEN &&
    token === env.PLATFORM_WA_VERIFY_TOKEN &&
    challenge.length <= 256
  )
    return new Response(challenge, { status: 200, headers: { "Content-Type": "text/plain" } });
  return new Response("forbidden", { status: 403 });
}
export async function handleWhatsAppWebhook(request: Request, env: Env) {
  const body = await readWebhookBody(request);
  if (body === null) return new Response("ignored", { status: 200 });
  if (
    !(await validWhatsAppSignature(
      env.META_APP_SECRET || "",
      body,
      request.headers.get("x-hub-signature-256") || "",
    ))
  )
    return new Response("invalid_signature", { status: 403 });
  try {
    await processWhatsAppPayload(env, JSON.parse(body));
    return new Response("ok", { status: 200 });
  } catch {
    return new Response("unavailable", { status: 503 });
  }
}
