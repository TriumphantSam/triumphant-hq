"use client";
import { useEffect, useRef, useState } from "react";
import ConversationTeam from "./ConversationTeam";

type Settings = { welcome:string; away:string; fallback:string; enabled:boolean|number; ai_enabled:boolean|number; version:number };
type Summary = { id:string; label:string; paused:boolean|number; version:number; updated_at:string; message_count:number };
type Thread = Summary & { messages:{id:string;role:"customer"|"automation"|"team";text:string;at:string;method?:string}[] };
async function call<T>(action:string,payload:unknown):Promise<T> {
  const response=await fetch("/api/platform",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,payload}),cache:"no-store"});
  const data=await response.json();
  if(!response.ok) throw new Error(data.error || "Please try again.");
  return data;
}
export default function ConversationStudio({workspaceId,mode,onSaved}:{workspaceId:string;mode:"responders"|"conversations";onSaved:()=>void}) {
  const [settings,setSettings]=useState<Settings|null>(null),[threads,setThreads]=useState<Summary[]>([]),[thread,setThread]=useState<Thread|null>(null);
  const [loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState("");
  const [label,setLabel]=useState("Practice customer"),[message,setMessage]=useState(""),[role,setRole]=useState<"customer"|"team">("customer");
  const pending=useRef<{fingerprint:string;id:string}|null>(null),createId=useRef<string|null>(null);
  useEffect(()=>{
    let active=true;
    Promise.all([call<Settings>("responder.read",{workspaceId}),call<{conversations:Summary[]}>("conversation.list",{workspaceId})])
      .then(([config,list])=>{if(active){setSettings(config);setThreads(list.conversations);}})
      .catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[workspaceId]);
  async function run(work:()=>Promise<void>) {
    if(busy)return;setBusy(true);setError("");setNotice("");
    try{await work();}catch(e){setError(e instanceof Error?e.message:"Please try again.");}finally{setBusy(false);}
  }
  async function refresh(){const data=await call<{conversations:Summary[]}>("conversation.list",{workspaceId});setThreads(data.conversations);}
  async function open(id:string){setThread(await call<Thread>("conversation.read",{workspaceId,id}));setMessage("");pending.current=null;}
  async function send(){
    if(!thread)return;
    const fingerprint=JSON.stringify([thread.id,role,message]);
    if(pending.current?.fingerprint!==fingerprint)pending.current={fingerprint,id:crypto.randomUUID()};
    setThread(await call<Thread>("conversation.message",{workspaceId,id:thread.id,version:thread.version,role,text:message,requestId:pending.current.id}));
    setMessage("");pending.current=null;await refresh();onSaved();
  }
  if(loading)return <p role="status">Opening your conversation studio…</p>;
  return <div className="platform-studio">
    <div className="platform-sandbox"><strong>Private rehearsal</strong> · Simulated customers only. No number is connected and no messages leave this workspace.</div>
    {error&&<p role="alert" className="platform-error">{error} {thread&&<button disabled={busy} onClick={()=>void run(()=>open(thread.id))}>Reload conversation</button>} {mode==="responders"&&<button disabled={busy} onClick={()=>void run(async()=>setSettings(await call<Settings>("responder.read",{workspaceId})))}>Reload saved settings</button>}</p>}
    {notice&&<p role="status" className="platform-success">{notice}</p>}
    {mode==="responders"&&settings&&<form className="platform-card platform-form" onSubmit={e=>{e.preventDefault();void run(async()=>{setSettings(await call<Settings>("responder.save",{workspaceId,...settings,enabled:Boolean(settings.enabled),ai_enabled:Boolean(settings.ai_enabled)}));setNotice("Autoresponders saved. Practise them in Conversations.");onSaved();});}}>
      <h2>Your voice, even when you’re away.</h2><p>These messages currently run in your private conversation rehearsal. Approved FAQ answers are used during your saved business hours; unknown questions receive your fallback.</p>
      <label className="public-consent"><input type="checkbox" checked={Boolean(settings.enabled)} onChange={e=>setSettings({...settings,enabled:e.target.checked})}/>Enable automatic replies in rehearsal</label>
      <label className="public-consent"><input type="checkbox" checked={Boolean(settings.ai_enabled)} onChange={e=>setSettings({...settings,ai_enabled:e.target.checked})}/>Use AI to match differently worded questions to my approved answers</label>
      <p className="platform-muted">Applies to private rehearsal and the published sandbox website assistant. When enabled, the latest test question and this business’s approved FAQs may be processed by Cloudflare Workers AI. No customer list or conversation history is sent. Sandbox limit: 100 AI attempts per Lagos month, shared with a platform daily safety cap. Unknown answers and provider failures refer visitors to the team; private rehearsal pauses for takeover.</p>
      {([ ["welcome","Welcome message"],["away","Outside business hours"],["fallback","When an answer is unavailable"] ] as const).map(([key,title])=><label key={key}>{title}<textarea required maxLength={1000} rows={3} value={settings[key]} onChange={e=>setSettings({...settings,[key]:e.target.value})}/></label>)}
      <p className="platform-muted">A team reply pauses automation. “STOP”, “human”, “agent” or “speak to the team” also pause it. Only a workspace member can resume. AI-assisted matching is optional; every answer still uses approved text.</p>
      <button disabled={busy} className="platform-primary">{busy?"Saving…":"Save autoresponders"}</button>
    </form>}
    {mode==="conversations"&&<div className="conversation-layout">
      <aside className="platform-card conversation-list">
        <h2>Conversations <span className="platform-status">Test</span></h2>
        <button className="platform-secondary" disabled={busy} onClick={()=>void run(refresh)}>Refresh conversation list</button>
        <form onSubmit={e=>{e.preventDefault();void run(async()=>{createId.current??=crypto.randomUUID();const created=await call<Thread>("conversation.create",{workspaceId,id:createId.current,label});setThread(created);createId.current=null;await refresh();});}}>
          <label>Test customer name<input required maxLength={80} value={label} onChange={e=>{setLabel(e.target.value);createId.current=null;}}/></label>
          <button className="platform-secondary" disabled={busy}>Start test conversation</button>
        </form>
        <p className="platform-muted">Up to 100 practice conversations. Use invented customer details.</p>
        <nav aria-label="Test conversations">{threads.map(t=><button key={t.id} disabled={busy} aria-current={thread?.id===t.id?"page":undefined} onClick={()=>void run(()=>open(t.id))}><strong>{t.label}</strong><small>{t.paused?"With team":settings?.enabled?"Automation on":"Auto replies disabled"} · {t.message_count} messages</small></button>)}</nav>
        {!threads.length&&<p>No conversations yet. Start one to try your settings.</p>}
      </aside>
      <section className="platform-card conversation-chat" aria-label="Conversation rehearsal">
        {!thread?<div className="conversation-empty"><h2>See the customer experience.</h2><p>Start a test conversation, ask a saved FAQ and practise taking over. Nothing is sent to WhatsApp.</p></div>:<>
          <header className="conversation-heading"><div><h2>{thread.label}</h2><small>{thread.paused?"Automation paused · team in control":settings?.enabled?"Automation available":"Auto replies disabled in settings"}</small></div><button className="platform-secondary" disabled={busy} onClick={()=>void run(async()=>{setThread(await call<Thread>("conversation.pause",{workspaceId,id:thread.id,version:thread.version,paused:!thread.paused}));await refresh();})}>{thread.paused?"Resume automation":"Pause automation"}</button></header>
          <ConversationTeam key={`${workspaceId}:${thread.id}`} workspaceId={workspaceId} threadId={thread.id} channel="rehearsal"/>
          <div className="conversation-messages" role="log" aria-live="polite" aria-label="Test messages">{thread.messages.map(m=><article className={`conversation-bubble conversation-${m.role}`} key={m.id}><small>{m.role==="customer"?"Test customer":m.role==="team"?"Your team":m.method==="ai"?"AI-selected approved answer":"Autoresponder"}</small><p>{m.text}</p><time dateTime={m.at}>{new Intl.DateTimeFormat("en-NG",{timeZone:"Africa/Lagos",hour:"2-digit",minute:"2-digit"}).format(new Date(m.at))} WAT</time></article>)}{!thread.messages.length&&<p className="platform-muted">Send a test message below to begin.</p>}</div>
          <form className="conversation-composer" onSubmit={e=>{e.preventDefault();void run(send);}}>
            <label>Send as<select value={role} disabled={busy} onChange={e=>setRole(e.target.value as "customer"|"team")}><option value="customer">Test customer</option><option value="team">Your team (pauses automation)</option></select></label>
            <label>Test message<textarea required rows={3} maxLength={1000} value={message} onChange={e=>setMessage(e.target.value)}/></label>
            <button className="platform-primary" disabled={busy||!message.trim()}>{busy?"Saving…":"Add test message"}</button>
          </form>
        </>}
      </section>
    </div>}
  </div>;
}
