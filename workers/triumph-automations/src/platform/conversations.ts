import type { Env } from "../types";
import { PlatformError, requireWorkspace, validId, matchFaq, type Faq } from "./core";
import { tenantAnswer } from "./tenant-ai";
import {threadSignals} from './collaboration';

export const responderDefaults = {
  welcome: "Welcome! How can we help you today?",
  away: "Thanks for your message. Our team is away; we’ll respond during business hours.",
  fallback: "I don’t have an approved answer for that yet. Please ask to speak to the team.",
  enabled: true,
  version: 0,
  ai_enabled: false,
};
type Settings = { welcome: string; away: string; fallback: string; enabled: boolean | number; ai_enabled:boolean|number; version: number };
type Message = { id: string; role: "customer" | "automation" | "team"; text: string; at: string; method?:string };
type Thread = { id: string; label: string; messages: string; paused: number; version: number; updated_at: string };
function text(value: unknown, max: number) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max)
    throw new PlatformError(`Enter text between 1 and ${max} characters.`);
  return value.trim();
}
async function settings(env: Env, id: string): Promise<Settings> {
  return await env.DB.prepare("SELECT welcome,away,fallback,enabled,ai_enabled,version FROM platform_responder_settings WHERE workspace_id=?")
    .bind(id).first<Settings>() || responderDefaults;
}
function result(row: Thread) { const messages=JSON.parse(row.messages) as Message[];return { ...row, messages,readCursor:messages.length, paused: Boolean(row.paused), sandbox: true }; }
export async function conversationAction(env: Env, userId: string, action: string, input: Record<string, unknown>, now = Date.now()) {
  const w = await requireWorkspace(env, userId, input.workspaceId, action === "responder.save");
  if (action === "responder.read") return { ...await settings(env, w.id), sandbox: true };
  if (action === "responder.save") {
    const welcome = text(input.welcome, 1000), away = text(input.away, 1000), fallback = text(input.fallback, 1000);
    if (typeof input.enabled !== "boolean" || (input.ai_enabled!==undefined&&typeof input.ai_enabled!=="boolean") || !Number.isSafeInteger(input.version)) throw new PlatformError("Check responder settings.");
    const aiEnabled=input.ai_enabled===undefined?Boolean((await settings(env,w.id)).ai_enabled):input.ai_enabled;
    const row = await env.DB.prepare("INSERT INTO platform_responder_settings(workspace_id,welcome,away,fallback,enabled,ai_enabled,version,updated_at) SELECT ?,?,?,?,?,?,1,? WHERE ?=0 ON CONFLICT(workspace_id) DO UPDATE SET welcome=excluded.welcome,away=excluded.away,fallback=excluded.fallback,enabled=excluded.enabled,ai_enabled=excluded.ai_enabled,version=platform_responder_settings.version+1,updated_at=excluded.updated_at WHERE platform_responder_settings.version=? RETURNING version")
      .bind(w.id,welcome,away,fallback,Number(input.enabled),Number(aiEnabled),new Date(now).toISOString(),input.version,input.version).first();
    // Existing rows must also be editable after version zero.
    if (!row) {
      const updated = await env.DB.prepare("UPDATE platform_responder_settings SET welcome=?,away=?,fallback=?,enabled=?,ai_enabled=?,version=version+1,updated_at=? WHERE workspace_id=? AND version=? RETURNING version")
        .bind(welcome,away,fallback,Number(input.enabled),Number(aiEnabled),new Date(now).toISOString(),w.id,input.version).first();
      if (!updated) throw new PlatformError("Settings changed. Reload before saving.",409);
    }
    return { ...await settings(env,w.id), sandbox:true };
  }
  if (action === "conversation.list") {
    const rows = await env.DB.prepare("SELECT id,label,paused,version,updated_at,json_array_length(messages) AS message_count FROM platform_conversations WHERE workspace_id=? ORDER BY updated_at DESC,id LIMIT 100").bind(w.id).all();
    const signals=await threadSignals(env,w.id,userId,'rehearsal');
    return { conversations: rows.results.map(row=>({...row,...signals.get(String(row.id))})), sandbox: true };
  }
  // These records are a private rehearsal, never a WhatsApp transport or outbox.
  if (env.ENVIRONMENT === "production") throw new PlatformError("Conversation rehearsal is available in staging only.",503);
  if (action === "conversation.create") {
    const label = text(input.label,80);
    if (!validId(input.id)) throw new PlatformError("Invalid conversation reference.");
    const date = new Date(now).toISOString();
    await env.DB.prepare("INSERT INTO platform_conversations(id,workspace_id,label,messages,created_at,updated_at) SELECT ?,?,?,'[]',?,? WHERE (SELECT count(*) FROM platform_conversations WHERE workspace_id=?)<100 ON CONFLICT DO NOTHING")
      .bind(input.id,w.id,label,date,date,w.id).run();
    const created = await env.DB.prepare("SELECT id,label,messages,paused,version,updated_at FROM platform_conversations WHERE workspace_id=? AND id=?").bind(w.id,input.id).first<Thread>();
    if (!created) throw new PlatformError("The sandbox allows 100 conversations per business.",409);
    if (created.label !== label) throw new PlatformError("This reference is already used.",409);
    return result(created);
  }
  if (!validId(input.id)) throw new PlatformError("Conversation not found.",404);
  const row = await env.DB.prepare("SELECT id,label,messages,paused,version,updated_at FROM platform_conversations WHERE workspace_id=? AND id=?").bind(w.id,input.id).first<Thread>();
  if (!row) throw new PlatformError("Conversation not found.",404);
  if (action === "conversation.read") return result(row);
  if (!["conversation.message","conversation.pause"].includes(action)) throw new PlatformError("Unknown conversation action.");
  let messages = JSON.parse(row.messages) as Message[], paused = row.paused;
  if (action === "conversation.message") {
    const content = text(input.text,1000);
    if (!validId(input.requestId) || !["customer","team"].includes(String(input.role))) throw new PlatformError("Invalid message.");
    const old = messages.find(m=>m.id===input.requestId);
    if (old) {
      if (old.text !== content || old.role !== input.role) throw new PlatformError("This message reference has changed.",409);
      return result(row);
    }
    if(!Number.isSafeInteger(input.version)||input.version!==row.version)throw new PlatformError("Another reply changed this conversation. Reload before continuing.",409);
    if (messages.length >= 38) throw new PlatformError("Start a new test conversation; this one has reached its limit.",409);
    const at = new Date(now).toISOString();
    messages = [...messages,{id:input.requestId,role:input.role as "customer"|"team",text:content,at}];
    if (input.role === "team") paused = 1;
    if (input.role === "customer" && /^(stop|human|agent|speak to (a person|the team))\b/i.test(content)) paused = 1;
    const config = await settings(env,w.id);
    if (input.role === "customer" && config.enabled && !paused) {
      const faqs = await env.DB.prepare("SELECT id,question,answer FROM platform_faqs WHERE workspace_id=? ORDER BY id").bind(w.id).all<Faq>();
      const policy = await env.DB.prepare("SELECT days,start_hour,end_hour FROM platform_booking_policy WHERE workspace_id=?").bind(w.id).first<{days:string;start_hour:number;end_hour:number}>();
      const local = new Date(now + 3600000), open = policy && JSON.parse(policy.days).includes(local.getUTCDay()) && local.getUTCHours() >= policy.start_hour && local.getUTCHours() < policy.end_hour;
      const resolved = open && config.ai_enabled
        ? await tenantAnswer(env,w.id,input.requestId,content,faqs.results,config.fallback,now)
        : {answer:!open?config.away:matchFaq(content,faqs.results)?.answer||config.fallback,method:!open?"away":"approved",handoff:false};
      const answer=resolved.answer;
      if(resolved.handoff)paused=1;
      if (!row.messages || JSON.parse(row.messages).length === 0) messages.push({id:crypto.randomUUID(),role:"automation",text:config.welcome,at});
      messages.push({id:crypto.randomUUID(),role:"automation",text:answer,at,method:resolved.method});
    }
  } else {
    if (typeof input.paused !== "boolean") throw new PlatformError("Choose pause or resume.");
    paused = Number(input.paused);
  }
  if (!Number.isSafeInteger(input.version)) throw new PlatformError("Reload this conversation.",409);
  const updated = await env.DB.prepare("UPDATE platform_conversations SET messages=?,paused=?,version=version+1,updated_at=? WHERE workspace_id=? AND id=? AND version=? RETURNING id,label,messages,paused,version,updated_at")
    .bind(JSON.stringify(messages),paused,new Date(now).toISOString(),w.id,row.id,input.version).first<Thread>();
  if (!updated) throw new PlatformError("Another reply changed this conversation. Reload before continuing.",409);
  return result(updated);
}
