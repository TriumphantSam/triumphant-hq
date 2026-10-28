"use client";
import {useState} from 'react';
import type {WorkTarget,FollowUpView} from '@/lib/platform-work';
const localDate=(value:string)=>new Date(Date.parse(value)+3600000).toISOString().slice(0,16);
const stamp=(value:string)=>new Intl.DateTimeFormat('en-NG',{timeZone:'Africa/Lagos',dateStyle:'medium',timeStyle:'short'}).format(new Date(value));
async function request(workspaceId:string,target:WorkTarget,action:string,values:Record<string,unknown>={}):Promise<FollowUpView>{
 const response=await fetch('/api/platform',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,payload:{workspaceId,...target,...values}}),cache:'no-store'});
 const data=await response.json();if(!response.ok)throw new Error(data.error||'Unable to load follow-up.');return data;
}
export default function FollowUpPanel({workspaceId,target,onChanged}:{workspaceId:string;target:WorkTarget;onChanged?:()=>void}){
 const [data,setData]=useState<FollowUpView|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[due,setDue]=useState(''),[note,setNote]=useState(''),[assignee,setAssignee]=useState('');
 function adopt(next:FollowUpView){setData(next);setDue(localDate(next.task?.dueAt||new Date(Date.now()+86400000).toISOString()));setNote(next.task?.note||'');setAssignee(next.members.some(m=>m.id===next.task?.assigneeId)?next.task!.assigneeId||'':'');}
 async function run(action='followup.read'){
  if(busy)return;setBusy(true);setError('');setNotice('');
  try{
   const values=action==='followup.save'?{dueAt:new Date(due+':00+01:00').toISOString(),note,assigneeId:assignee||null,version:data?.task?.version||0}:action==='followup.complete'?{version:data?.task?.version}:{};
   adopt(await request(workspaceId,target,action,values));
   if(action!=='followup.read'){setNotice(action==='followup.complete'?'Follow-up completed. The original record and automation state are unchanged.':'Follow-up saved. No customer message or reminder email was sent.');onChanged?.();}
  }catch(e){setError(e instanceof Error?e.message:'Please reload the follow-up.');}finally{setBusy(false);}
 }
 return <details className="work-followup" onToggle={e=>{if(e.currentTarget.open&&!data&&!busy)void run();}}><summary>Internal follow-up{data?.task?data.task.done?' · completed':` · ${stamp(data.task.dueAt)} WAT`:''}</summary><div className="platform-form">
  <p className="platform-muted">For your team only. This schedules internal work, not a customer message or calendar reservation.</p>
  {error&&<p className="platform-error" role="alert">{error}</p>}{notice&&<p role="status">{notice}</p>}{busy&&!data&&<p role="status">Loading follow-up…</p>}
  {data&&<><div><strong>{data.source.label}</strong><p>{data.source.start&&data.source.end?`${stamp(data.source.start)} to ${stamp(data.source.end)} WAT`:data.source.detail}</p><small>{data.source.state} · {target.kind} · {target.id}</small></div>
   {data.task&&<p>{data.task.done?'Completed':'Open'} follow-up · due {stamp(data.task.dueAt)} WAT</p>}
   <form onSubmit={e=>{e.preventDefault();void run('followup.save');}}>
    <label>Follow-up date and time (Lagos)<input type="datetime-local" required value={due} disabled={busy} onChange={e=>setDue(e.target.value)}/></label>
    <label>Responsible team member<select value={assignee} disabled={busy} onChange={e=>setAssignee(e.target.value)}><option value="">Unassigned</option>{data.members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></label>
    <label>Internal follow-up note<textarea rows={2} maxLength={1000} value={note} disabled={busy} onChange={e=>setNote(e.target.value)}/></label>
    <button className="platform-secondary" disabled={busy}>{data.task?.done?'Reopen follow-up':'Save follow-up'}</button>
   </form>
   {data.task&&!data.task.done&&<button className="platform-secondary" disabled={busy} onClick={()=>void run('followup.complete')}>Mark follow-up done</button>}
  </>}
  <button className="platform-secondary" disabled={busy} onClick={()=>void run()}>Reload follow-up</button>
 </div></details>;
}
