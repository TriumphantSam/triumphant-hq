"use client";
import {useEffect,useState} from 'react';
import type {WorkOverview} from '@/lib/platform-work';
import FollowUpPanel from './FollowUpPanel';
type WorkTab='Inbox'|'Conversations'|'Autoresponders';
async function read(workspaceId:string,filter:string):Promise<WorkOverview>{const r=await fetch('/api/platform',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'operations.read',payload:{workspaceId,filter}}),cache:'no-store'});const data=await r.json();if(!r.ok)throw new Error(data.error||'Unable to load today’s work.');return data;}
const stamp=(value:string)=>new Intl.DateTimeFormat('en-NG',{timeZone:'Africa/Lagos',dateStyle:'medium',timeStyle:'short'}).format(new Date(value));
export default function TodayPanel({workspaceId,onNavigate,owner}:{workspaceId:string;onNavigate:(tab:WorkTab)=>void;owner:boolean}){
 const [data,setData]=useState<WorkOverview|null>(null),[filter,setFilter]=useState('mine'),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{let active=true;read(workspaceId,filter).then(next=>{if(active){setData(next);setError('');}}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[workspaceId,filter]);
 async function refresh(){if(busy)return;setBusy(true);setError('');try{setData(await read(workspaceId,filter));}catch(e){setError(e instanceof Error?e.message:'Please refresh your work.');}finally{setBusy(false);}}
 return <section className="platform-card platform-form"><p className="platform-eyebrow">DAILY WORK</p><h2>Know what needs your attention.</h2><p>Review enquiries, upcoming appointments and paused conversations, then work through your internal follow-ups.</p>
  {error&&<p role="alert" className="platform-error">{error}</p>}{!data&&!error&&<p role="status">Loading your work…</p>}
  {data&&<>{data.sandbox&&<p className="platform-sandbox">Staging records and conversation rehearsals are tests. Follow-ups do not send messages, emails or appointment reminders.</p>}
   <div className="work-metrics">
    <article><h3>New enquiries</h3><strong>{data.newEnquiries}</strong><button className="platform-secondary" onClick={()=>onNavigate('Inbox')}>Open inbox</button></article>
    <article><h3>Appointments in the next 24 hours</h3><strong>{data.appointmentsNextDay}</strong><button className="platform-secondary" onClick={()=>onNavigate('Inbox')}>Review appointments</button></article>
    <article><h3>Automation paused</h3><p>{data.pausedRehearsals} rehearsals · {data.pausedWhatsApp} WhatsApp conversations</p><button className="platform-secondary" onClick={()=>onNavigate('Conversations')}>Review conversations</button><small>Paused does not mean unanswered. Read the conversation before resuming automation.</small></article>
   </div>
   <p><strong>Autoresponders:</strong> {!data.responders.configured?'Defaults have not been reviewed':data.responders.enabled?'Saved and enabled':'Saved but disabled'}. A team reply or a handover pauses that conversation until a member resumes it.</p>{owner&&<button className="platform-secondary" onClick={()=>onNavigate('Autoresponders')}>Review autoresponders</button>}
   <label>Follow-ups to show<select value={filter} onChange={e=>setFilter(e.target.value)} disabled={busy}><option value="mine">Assigned to me and unassigned</option><option value="all">All team follow-ups</option></select></label>
   <p>Follow-up times use Lagos time. Create one from an enquiry, booking or conversation. Completing it does not change the original record or resume automation.</p>
   <div className="work-list">{data.tasks.map(task=><article className={`work-item ${task.overdue?'work-overdue':''}`} key={`${task.kind}:${task.id}`}><h3>{task.label}</h3><p><strong>{task.overdue?'Overdue':'Due'}:</strong> {stamp(task.dueAt)} WAT · {task.assigneeName||'Unassigned'}</p>{task.note&&<p>{task.note}</p>}<small>{task.kind} · {task.id}</small><FollowUpPanel workspaceId={workspaceId} target={{kind:task.kind,id:task.id}} onChanged={()=>void refresh()}/></article>)}</div>
   {!data.tasks.length&&<p>No open follow-ups match this view.</p>}{data.truncated&&<p>The first 50 open follow-ups are shown, earliest due first.</p>}
   <small>Updated {stamp(data.asOf)} WAT. Refresh to see new activity.</small>
  </>}
  <button className="platform-secondary" disabled={busy} onClick={()=>void refresh()}>{busy?'Refreshing…':'Refresh daily work'}</button>
 </section>;
}
