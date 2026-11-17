"use client";
import { useEffect, useRef, useState } from "react";
import ConversationTeam from "./ConversationTeam";
import InboxFilters,{matchesFilter,type InboxFilter,type Signals} from './InboxFilters';

type Settings = { welcome:string; away:string; fallback:string; enabled:boolean|number; ai_enabled:boolean|number; version:number };
type Summary = Signals & { id:string; label:string; paused:boolean|number; version:number; updated_at:string; message_count:number };
type Thread = Summary & {readCursor:number; messages:{id:string;role:"customer"|"automation"|"team";text:string;at:string;method?:string}[] };
async function call<T>(action:string,payload:unknown):Promise<T> {
  const response=await fetch("/api/platform",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,payload}),cache:"no-store"});
  const data=await response.json();
  if(!response.ok) throw new Error(data.error || "Please try again.");
  return data;
}
export default function ConversationStudio({workspaceId,mode,onSaved,whatsappConnected,onOpenInbox}:{workspaceId:string;mode:"responders"|"conversations";onSaved:()=>void;whatsappConnected:boolean;onOpenInbox:()=>void}) {
  const [settings,setSettings]=useState<Settings|null>(null),[threads,setThreads]=useState<Summary[]>([]),[thread,setThread]=useState<Thread|null>(null);
  const [loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState("");
  const [label,setLabel]=useState("Practice customer"),[message,setMessage]=useState(""),[role,setRole]=useState<"customer"|"team">("customer");
  const pending=useRef<{fingerprint:string;id:string}|null>(null),createId=useRef<string|null>(null);
  const [filter,setFilter]=useState<InboxFilter>('all');
  const [savedEnabled,setSavedEnabled]=useState<boolean|null>(null);
  useEffect(()=>{
    let active=true;
    Promise.all([call<Settings>("responder.read",{workspaceId}),call<{conversations:Summary[]}>("conversation.list",{workspaceId})])
      .then(([config,list])=>{if(active){setSettings(config);setSavedEnabled(Boolean(config.enabled));setThreads(list.conversations);}})
      .catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[workspaceId]);
  async function run(work:()=>Promise<void>) {
    if(busy)return;setBusy(true);setError("");setNotice("");
    try{await work();}catch(e){setError(e instanceof Error?e.message:"Please try again.");}finally{setBusy(false);}
  }
  async function refresh(){const data=await call<{conversations:Summary[]}>("conversation.list",{workspaceId});setThreads(data.conversations);}
  async function open(id:string){const next=await call<Thread>("conversation.read",{workspaceId,id});setThread(next);setMessage("");pending.current=null;await call('collaboration.seen',{workspaceId,id,channel:'rehearsal',cursor:next.readCursor});await refresh();}
  async function send(){
    if(!thread)return;
    const fingerprint=JSON.stringify([thread.id,role,message]);
    if(pending.current?.fingerprint!==fingerprint)pending.current={fingerprint,id:crypto.randomUUID()};
    setThread(await call<Thread>("conversation.message",{workspaceId,id:thread.id,version:thread.version,role,text:message,requestId:pending.current.id}));
    setMessage("");pending.current=null;await refresh();onSaved();
  }
  if(loading)return <p role="status">Opening your conversation studio…</p>;
  return <div className="platform-studio">
    <div className="platform-sandbox">{mode==="conversations"?<><strong>Practice chats only</strong> · Messages entered here are simulated. Pausing or resuming a practice chat does not change any real WhatsApp chat. <button type="button" className="platform-secondary" onClick={onOpenInbox}>Open Inbox · WhatsApp</button></>:<><strong>Shared reply settings</strong> · These settings apply to practice chats and, when connected, your WhatsApp number. The AI option also applies to your published website assistant.</>}</div>
    {error&&<p role="alert" className="platform-error">{error} {thread&&<button disabled={busy} onClick={()=>void run(()=>open(thread.id))}>Reload conversation</button>} {mode==="responders"&&<button disabled={busy} onClick={()=>void run(async()=>{const saved=await call<Settings>("responder.read",{workspaceId});setSettings(saved);setSavedEnabled(Boolean(saved.enabled));})}>Reload saved settings</button>}</p>}
    {notice&&<p role="status" className="platform-success">{notice}</p>}
    {mode==="responders"&&settings&&<form className="platform-card platform-form" onSubmit={e=>{e.preventDefault();void run(async()=>{const saved=await call<Settings>("responder.save",{workspaceId,...settings,enabled:Boolean(settings.enabled),ai_enabled:Boolean(settings.ai_enabled)});setSettings(saved);setSavedEnabled(Boolean(saved.enabled));setNotice(saved.enabled?`Saved: automatic replies are on for practice chats${whatsappConnected?" and your connected WhatsApp number. Individual paused WhatsApp chats stay paused.":". No WhatsApp number is connected to this workspace."}`:`Saved: automatic replies are off for practice chats${whatsappConnected?" and your connected WhatsApp number. Your number remains connected.":"."}`);onSaved();});}}>
      <h2>Choose when your business replies automatically.</h2><p>Approved FAQ answers are used during your saved business hours. Outside those hours, the away message is used.</p>
      <p role="status"><strong>Saved automatic replies: {savedEnabled?"On":"Off"}.</strong> Checkbox changes take effect after you save.</p>
      {whatsappConnected&&<p className="platform-sandbox"><strong>Your WhatsApp number is connected.</strong> Enabling automatic replies applies to incoming chats, including existing contacts and normal conversations. Keep this off when you want to reply personally. You can pause an individual live chat under Inbox · WhatsApp.</p>}
      <label className="public-consent"><input type="checkbox" checked={Boolean(settings.enabled)} onChange={e=>setSettings({...settings,enabled:e.target.checked})}/>Enable automatic replies for practice chats and my connected WhatsApp number</label>
      <label className="public-consent"><input type="checkbox" checked={Boolean(settings.ai_enabled)} onChange={e=>setSettings({...settings,ai_enabled:e.target.checked})}/>Use AI to match differently worded questions to my approved answers</label>
      <p className="platform-muted">AI matching applies to practice chats, the published website assistant and automatic WhatsApp replies. It may send the latest question and this business’s approved FAQs to Cloudflare Workers AI. No customer list or conversation history is sent. Usage limits follow your workspace allowance and the platform safety cap. Turning AI off still allows automatic FAQ and away replies when the automatic-replies switch is on. Unknown questions and AI failures use your fallback; practice and WhatsApp chats pause for the team.</p>
      {([ ["welcome","Welcome message"],["away","Outside business hours"],["fallback","When an answer is unavailable"] ] as const).map(([key,title])=><label key={key}>{title}<textarea required maxLength={1000} rows={3} value={settings[key]} onChange={e=>setSettings({...settings,[key]:e.target.value})}/></label>)}
      <p className="platform-muted">A team reply pauses automation. “STOP”, “human”, “agent” or “speak to the team” also pause it. Only a workspace member can resume. AI-assisted matching is optional; every answer still uses approved text.</p>
      <button disabled={busy} className="platform-primary">{busy?"Saving…":"Save autoresponders"}</button>
    </form>}
    {mode==="conversations"&&<div className="conversation-layout">
      <aside className="platform-card conversation-list">
        <h2>Practice chats <span className="platform-status">Simulated</span></h2>
        <button className="platform-secondary" disabled={busy} onClick={()=>void run(refresh)}>Refresh conversation list</button>
        <InboxFilters value={filter} onChange={setFilter} disabled={busy}/><p className="platform-muted">Unread counts are personal and count customer messages only. Refresh to see new activity.</p>
        <form onSubmit={e=>{e.preventDefault();void run(async()=>{createId.current??=crypto.randomUUID();const created=await call<Thread>("conversation.create",{workspaceId,id:createId.current,label});setThread(created);createId.current=null;await refresh();});}}>
          <label>Test customer name<input required maxLength={80} value={label} onChange={e=>{setLabel(e.target.value);createId.current=null;}}/></label>
          <button className="platform-secondary" disabled={busy}>Start test conversation</button>
        </form>
        <p className="platform-muted">Up to 100 practice conversations. Use invented customer details.</p>
        <nav aria-label="Test conversations">{threads.filter(t=>matchesFilter(t,filter)).map(t=><button key={t.id} disabled={busy} aria-current={thread?.id===t.id?"page":undefined} onClick={()=>void run(()=>open(t.id))}><strong>{t.label}</strong><small>{t.paused?"With team":settings?.enabled?"Automation on":"Auto replies disabled"} · {t.message_count} messages</small><small>{t.assigned?`Assigned to ${t.assigneeName}`:'Unassigned'}{Number(t.unreadCount)>0?` · ${t.unreadCount} unread`:''}</small></button>)}</nav>
        {threads.length>0&&!threads.some(t=>matchesFilter(t,filter))&&<p>No conversations match this filter.</p>}
        {!threads.length&&<p>No conversations yet. Start one to try your settings.</p>}
      </aside>
      <section className="platform-card conversation-chat" aria-label="Conversation rehearsal">
        {!thread?<div className="conversation-empty"><h2>See the customer experience.</h2><p>Start a test conversation, ask a saved FAQ and practise taking over. Nothing is sent to WhatsApp.</p></div>:<>
          <header className="conversation-heading"><div><h2>{thread.label}</h2><small>{thread.paused?"Automation paused · team in control":settings?.enabled?"Automation available":"Auto replies disabled in settings"}</small></div><button className="platform-secondary" disabled={busy} onClick={()=>void run(async()=>{setThread(await call<Thread>("conversation.pause",{workspaceId,id:thread.id,version:thread.version,paused:!thread.paused}));await refresh();})}>{thread.paused?"Resume this practice chat":"Pause this practice chat"}</button></header>
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
