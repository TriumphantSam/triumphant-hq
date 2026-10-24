"use client";
import {useState} from 'react';
function todayInLagos(){
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Lagos',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const part=(type:string)=>parts.find(item=>item.type===type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
export default function RecordExport({workspaceId}:{workspaceId:string}){
  const [today]=useState(todayInLagos),[from,setFrom]=useState(()=>today.slice(0,8)+'01'),[to,setTo]=useState(today),[kind,setKind]=useState('enquiries'),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
  async function download(){
    if(busy)return;setBusy(true);setError('');setNotice('');
    try{
      const response=await fetch('/api/platform',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'records.export',payload:{workspaceId,kind,from,to}}),cache:'no-store'});
      const result=await response.json();if(!response.ok)throw new Error(result.error||'The export could not be prepared.');
      const url=URL.createObjectURL(new Blob([result.csv],{type:'text/csv;charset=utf-8'}));
      const link=document.createElement('a');link.href=url;link.download=result.filename;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
      setNotice(`Download prepared: ${result.count} ${kind}. Check your browser’s downloads. No messages were sent.`);
    }catch(e){setError(e instanceof Error?e.message:'The export could not be prepared.');}finally{setBusy(false);}
  }
  return <section className="platform-card platform-form" aria-labelledby="record-export-heading">
    <p className="platform-eyebrow">OWNER TOOLS</p><h2 id="record-export-heading">Download your business records</h2>
    <p>Export stored enquiries or appointments as CSV. Choose up to 31 days by the date each record was created in Lagos, including both dates. Appointment times in the file use UTC.</p>
    <p className="platform-muted">Up to 500 records and 2 MB per file. Larger results require a shorter date range; files are never silently cut off. This excludes WhatsApp conversations, internal notes, staff details and cancellation links. Downloads contain customer contact details; store and share them carefully.</p>
    <form onSubmit={event=>{event.preventDefault();void download();}}>
      <label>Records<select value={kind} disabled={busy} onChange={event=>setKind(event.target.value)}><option value="enquiries">Enquiries</option><option value="bookings">Appointments</option></select></label>
      <label>Created from (Lagos)<input type="date" required value={from} disabled={busy} onChange={event=>setFrom(event.target.value)}/></label>
      <label>Created through (Lagos)<input type="date" required min={from} value={to} disabled={busy} onChange={event=>setTo(event.target.value)}/></label>
      <button className="platform-primary" disabled={busy}>{busy?'Preparing CSV…':'Download CSV'}</button>
    </form>
    {error&&<p role="alert" className="platform-error">{error}</p>}{notice&&<p role="status" className="platform-success">{notice}</p>}
  </section>;
}
