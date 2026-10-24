"use client";
import {useEffect,useState} from "react";

type Event={sequence:number;action:'invited'|'joined'|'withdrawn'|'removed';subjectEmail:string;createdAt:string;actor:string};
type History={events:Event[];nextCursor:number|null};
const descriptions={invited:'Created a staff invitation for',joined:'Accepted staff access for',withdrawn:'Withdrew the invitation for',removed:'Removed staff access for'};
async function readHistory(workspaceId:string,cursor?:number):Promise<History>{
  const response=await fetch('/api/platform',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'team.history',payload:{workspaceId,...(cursor===undefined?{}:{cursor})}}),cache:'no-store'});
  const result=await response.json();
  if(!response.ok)throw new Error(result.error||'Activity could not be loaded.');
  return result;
}
export default function TeamHistory({workspaceId}:{workspaceId:string}){
  const [data,setData]=useState<History|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState(true),[refresh,setRefresh]=useState(0);
  useEffect(()=>{let active=true;readHistory(workspaceId).then(result=>{if(active){setData(result);setError('');}}).catch(e=>{if(active)setError(e instanceof Error?e.message:'Activity could not be loaded.');}).finally(()=>{if(active)setBusy(false);});return()=>{active=false;};},[workspaceId,refresh]);
  async function older(){
    if(busy||!data?.nextCursor)return;
    setBusy(true);setError('');
    try{const page=await readHistory(workspaceId,data.nextCursor);setData(current=>current?{events:[...current.events,...page.events],nextCursor:page.nextCursor}:page);}catch(e){setError(e instanceof Error?e.message:'Activity could not be loaded.');}finally{setBusy(false);}
  }
  return <section aria-labelledby="team-history-heading">
    <h3 id="team-history-heading">Team access history</h3>
    <p className="platform-muted">Owner-only history of staff invitations, acceptances, withdrawals and removals recorded from this update onward. This does not track message delivery or other workspace changes. Times are in Lagos (WAT).</p>
    {error&&<p role="alert" className="platform-error">{error}</p>}
    {!data&&!error&&<p role="status">Loading team activity…</p>}
    {data&&!data.events.length&&<p>No team access changes recorded yet.</p>}
    {data&&<ol>{data.events.map(event=><li key={event.sequence} className="team-person"><div><strong>{descriptions[event.action]} {event.subjectEmail}</strong><p>By {event.actor}</p><time dateTime={event.createdAt}>{new Intl.DateTimeFormat('en-NG',{timeZone:'Africa/Lagos',dateStyle:'medium',timeStyle:'short'}).format(new Date(event.createdAt))} WAT</time></div></li>)}</ol>}
    <button type="button" disabled={busy} className="platform-secondary" onClick={()=>{setBusy(true);setRefresh(value=>value+1);}}>Refresh activity</button>
    {data?.nextCursor&&<button type="button" disabled={busy} className="platform-secondary" onClick={()=>void older()}>Load older activity</button>}
  </section>;
}
