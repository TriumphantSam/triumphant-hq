"use client";
import {useState} from 'react';
import type {WorkspaceSetup,SetupChoices,LaunchCheck} from '@/lib/platform-setup';
type SetupTab='Setup'|'Business'|'Answers'|'Appointments'|'Autoresponders'|'Conversations'|'Website'|'Team'|'Launch'|'Plans';
type Props={workspaceId:string;setup:WorkspaceSetup;onNavigate:(tab:SetupTab)=>void;onChanged:()=>void};
const examples={
 services:{label:'Service business',question:'What do you need to prepare my quote?',answer:'Tell us which service you need, your location and your preferred date. Our team will review your request and confirm the price.'},
 appointments:{label:'Appointment business',question:'How do I book an appointment?',answer:'Choose an available time on our booking page. Check the confirmation details before making travel plans. Contact our team if you need help changing your booking.'},
 shop:{label:'Shop or product business',question:'Is this item available?',answer:'Tell us the product name, size or variant and quantity. Our team will confirm current availability and the total before you pay.'},
};
const stateLabel:Record<LaunchCheck['state'],string>={ready:'Ready',pending:'Needs setup',configured:'Configured · test still required',blocked:'Blocked', 'not-required':'Not selected'};
export function LaunchReadiness({setup,onNavigate}:{setup:WorkspaceSetup;onNavigate:(tab:SetupTab)=>void}){
 return <div className="setup-launch-checks">{setup.launchChecks.map(check=><div className="setup-launch-check" key={check.id}><div><h3>{check.label}</h3><small className={`setup-state setup-state-${check.state}`}>{stateLabel[check.state]}</small><p>{check.detail}</p></div>{check.state!=='not-required'&&<button className="platform-secondary" onClick={()=>onNavigate(check.tab)}>Review {check.label.toLowerCase()}</button>}</div>)}</div>;
}
async function request(workspaceId:string,action:string,choices?:SetupChoices):Promise<WorkspaceSetup>{
 const response=await fetch('/api/platform',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,payload:{workspaceId,...choices}}),cache:'no-store'});
 const data=await response.json();if(!response.ok)throw new Error(data.error||'Setup progress could not be loaded.');return data;
}
export default function SetupGuide({workspaceId,setup,onNavigate,onChanged}:Props){
 const [data,setData]=useState(setup),[draft,setDraft]=useState(setup.choices),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const next=data.steps.find(step=>step.required&&!step.done),dirty=JSON.stringify(draft)!==JSON.stringify(data.choices),example=examples[draft.businessType];
 async function run(save:boolean){
  if(busy)return;setBusy(true);setError('');setNotice('');
  try {const result=await request(workspaceId,save?'setup.save':'setup.read',save?draft:undefined);setData(result);setDraft(result.choices);setNotice(save?'Your setup choices are saved.':'Progress refreshed from your saved workspace.');if(save)onChanged();}
  catch(e){setError(e instanceof Error?e.message:'Please reload setup.');}finally{setBusy(false);}
 }
 return <section className="platform-card setup-guide">
  <p className="platform-eyebrow">YOUR SETUP PATH</p><h2>Make this workspace ready for your business.</h2>
  <p>Work through the steps that apply to you. Progress comes from saved settings and recorded practice, rather than boxes marked complete.</p>
  <progress max={data.required} value={data.completed} aria-label="Business preparation progress"/><p><strong>{data.completed} of {data.required}</strong> required preparation steps complete.</p>
  <div className="setup-next"><strong>{next?'Your next step':'Preparation complete · review your channels'}</strong><p>{next?next.detail:'Your required preparation is saved. Subscription, channel delivery tests and production release are separate checks below.'}</p>{next?.tab==='Setup'?<a className="platform-primary" href="#setup-choices">Choose my setup path</a>:<button className="platform-primary" onClick={()=>onNavigate(next?.tab||'Launch')}>{next?`Continue to ${next.tab}`:'Review launch checks'}</button>}</div>
  <form id="setup-choices" className="platform-form setup-choices" onSubmit={e=>{e.preventDefault();void run(true);}}>
   <h3>Tailor your checklist</h3><p>These choices select the preparation you want to do. They do not connect channels, publish your website or change staff access.</p>
   <label>Business type<select value={draft.businessType} disabled={busy} onChange={e=>setDraft({...draft,businessType:e.target.value as SetupChoices['businessType']})}>{Object.entries(examples).map(([key,value])=><option key={key} value={key}>{value.label}</option>)}</select></label>
   <label>Channels to prepare<select value={draft.channel} disabled={busy} onChange={e=>setDraft({...draft,channel:e.target.value as SetupChoices['channel']})}><option value="both">WhatsApp and website</option><option value="whatsapp">WhatsApp</option><option value="website">Website</option></select></label>
   <label className="public-consent"><input type="checkbox" checked={draft.appointments} disabled={busy} onChange={e=>setDraft({...draft,appointments:e.target.checked})}/>Include appointment setup in my checklist</label>
   <label className="public-consent"><input type="checkbox" checked={draft.team} disabled={busy} onChange={e=>setDraft({...draft,team:e.target.checked})}/>Include bringing colleagues into my workspace</label>
   {dirty&&<p className="platform-muted">Your changed choices have not been saved yet.</p>}
   <button className="platform-primary" disabled={busy}>{busy?'Saving…':'Save setup choices'}</button>
  </form>
  {error&&<p className="platform-error" role="alert">{error}</p>}{notice&&<p role="status">{notice}</p>}
  <div className="setup-steps">{data.steps.map((step,index)=><div className="setup-step" key={step.id}><span className={step.required&&step.done?'setup-complete':''}>{!step.required?'—':step.done?'✓':index+1}</span><div><h3>{step.title}</h3><p>{step.detail}</p><small>{!step.required?'Not required for your selected setup':step.done?'Saved evidence found':'To do'}</small></div>{step.tab!=='Setup'&&<button className="platform-secondary" onClick={()=>onNavigate(step.tab)}>{step.done?'Review':'Open'}</button>}</div>)}</div>
  <button className="platform-secondary" disabled={busy||dirty} onClick={()=>void run(false)}>Refresh saved progress</button>
  <details className="setup-help"><summary>Have these details ready</summary><ul><li>Your business description and customer contact link.</li><li>Accurate answers to common questions, with prices or stock confirmed by your team when necessary.</li><li>For appointments: Lagos opening hours, duration, buffer and minimum notice.</li><li>For a team: a colleague who can accept the invitation and practise a reply.</li></ul><p>Use invented customer details in rehearsal. Keep passwords, API keys and card details out of answers and notes.</p></details>
  <details className="setup-help"><summary>Starter example for a {example.label.toLowerCase()}</summary><p>This is a draft to adapt; it is not saved to your approved answers.</p><h3>Example question</h3><p>{example.question}</p><h3>Example answer</h3><p>{example.answer}</p><button className="platform-secondary" onClick={()=>onNavigate('Answers')}>Write my business answers</button></details>
  <div className="setup-followup"><h3>What still prevents launch?</h3><p>Saved preparation is not proof of installation, WhatsApp delivery or a live subscription. Review each selected channel before release.</p><LaunchReadiness setup={data} onNavigate={onNavigate}/></div>
 </section>;
}
