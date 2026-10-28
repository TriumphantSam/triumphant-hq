"use client";
import {useEffect,useRef,useState} from "react";
import FollowUpPanel from './FollowUpPanel';

type Data={assignment:{assigneeId:string|null;version:number};members:{id:string;name:string;role:string}[];notes:{id:string;body:string;at:string;author:string}[]};
type Props={workspaceId:string;threadId:string;channel:"rehearsal"|"whatsapp"};
async function call(action:string,payload:unknown):Promise<Data>{
 const response=await fetch('/api/platform',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,payload}),cache:'no-store'});
 const data=await response.json();if(!response.ok)throw new Error(data.error||'Unable to load team details.');return data;
}
export default function ConversationTeam({workspaceId,threadId,channel}:Props){
 const [data,setData]=useState<Data|null>(null),[assignee,setAssignee]=useState(''),[note,setNote]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const pending=useRef<{text:string;id:string}|null>(null);
 const target={workspaceId,id:threadId,channel};
 function adopt(next:Data){setData(next);setAssignee(next.assignment.assigneeId||'');}
 useEffect(()=>{let active=true;call('collaboration.read',{workspaceId,id:threadId,channel}).then(next=>{if(active){setData(next);setAssignee(next.assignment.assigneeId||'');}}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[workspaceId,threadId,channel]);
 async function run(work:()=>Promise<void>){if(busy)return;setBusy(true);setError('');setNotice('');try{await work();}catch(e){setError(e instanceof Error?e.message:'Please refresh team details.');}finally{setBusy(false);}}
 return <details className="conversation-team" aria-label="Conversation team collaboration"><summary>Team details · {data?.members.find(m=>m.id===data.assignment.assigneeId)?.name||'Unassigned'}{data?` · ${data.notes.length} internal notes`:''}</summary><div className="platform-form">
  <h3>Team responsibility</h3><p className="platform-muted">Assignment tells your team who is handling this conversation. It does not pause or resume automation.</p>
  {error&&<p role="alert" className="platform-error">{error}</p>}{notice&&<p role="status" className="platform-success">{notice}</p>}
  {!data&&!error&&<p role="status">Loading team details…</p>}
  {data&&<>
   <p>Assigned to: <strong>{data.members.find(m=>m.id===data.assignment.assigneeId)?.name||'Unassigned'}</strong></p>
   <form onSubmit={e=>{e.preventDefault();void run(async()=>{adopt(await call('collaboration.assign',{...target,assigneeId:assignee||null,version:data.assignment.version}));setNotice('Assignment saved.');});}}>
    <label>Assign conversation<select value={assignee} disabled={busy} onChange={e=>setAssignee(e.target.value)}><option value="">Unassigned</option>{data.members.map(m=><option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}</select></label>
    <button className="platform-secondary" disabled={busy||assignee===(data.assignment.assigneeId||'')}>Save assignment</button>
   </form>
   <h3>Internal notes</h3><p className="platform-muted">Visible to this business’s owner and staff only. Notes are never sent to the customer. Up to 200 notes per conversation.</p>
   <div className="team-notes" aria-label="Saved internal notes">{data.notes.map(n=><article className="team-note" key={n.id}><strong>{n.author}</strong><p>{n.body}</p><time dateTime={n.at}>{new Intl.DateTimeFormat('en-NG',{timeZone:'Africa/Lagos',dateStyle:'medium',timeStyle:'short'}).format(new Date(n.at))} WAT</time></article>)}{!data.notes.length&&<p>No internal notes yet.</p>}</div>
   <form onSubmit={e=>{e.preventDefault();void run(async()=>{const text=note.trim();if(pending.current?.text!==text)pending.current={text,id:crypto.randomUUID()};adopt(await call('collaboration.note',{...target,text,requestId:pending.current.id}));pending.current=null;setNote('');setNotice('Internal note saved. No message was sent.');});}}>
    <label>New internal note<textarea required maxLength={2000} rows={3} value={note} disabled={busy} onChange={e=>setNote(e.target.value)}/></label><button className="platform-secondary" disabled={busy||!note.trim()||data.notes.length>=200}>Save internal note</button>
   </form>
  </>}
  <button className="platform-secondary" disabled={busy} onClick={()=>void run(async()=>{adopt(await call('collaboration.read',target));setNotice('Team details refreshed.');})}>Refresh team details</button>
  <FollowUpPanel key={`${workspaceId}:${channel}:${threadId}`} workspaceId={workspaceId} target={{kind:channel,id:threadId}}/>
 </div></details>;
}
