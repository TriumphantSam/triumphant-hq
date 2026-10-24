"use client";
import {useState} from 'react';
type SetupTab='Business'|'Answers'|'Appointments'|'Autoresponders'|'Conversations'|'Website'|'Team'|'Launch';
type Props={readiness:Record<string,boolean>;onNavigate:(tab:SetupTab)=>void};
const examples={
 services:{label:'Service business',question:'What do you need to prepare my quote?',answer:'Tell us which service you need, your location and your preferred date. Our team will review your request and confirm the price.',welcome:'Welcome! Tell us which service you need and we will help with the next step.'},
 appointments:{label:'Appointment business',question:'How do I book an appointment?',answer:'Choose an available time on our booking page. Check the confirmation details before making travel plans. Contact our team if you need help changing your booking.',welcome:'Welcome! Would you like to ask a question or arrange an appointment?'},
 shop:{label:'Shop or product business',question:'Is this item available?',answer:'Tell us the product name, size or variant and quantity. Our team will confirm current availability and the total before you pay.',welcome:'Welcome! Which product are you interested in? Please include the name or a short description.'},
};
export default function SetupGuide({readiness,onNavigate}:Props){
 const [kind,setKind]=useState<keyof typeof examples>('services');
 const steps=[
  {tab:'Business',title:'Introduce your business',detail:'Describe what you sell, who you serve and how someone can contact you.',check:'Save your real business description and a working contact link.',done:readiness.profile},
  {tab:'Answers',title:'Add answers you can stand behind',detail:'Start with questions about services, prices, hours, delivery or booking.',check:'Save at least one accurate answer. Never promise stock or a price that needs confirmation.',done:readiness.answers},
  {tab:'Autoresponders',title:'Choose your welcome and handover messages',detail:'Set a welcome, an away reply and a reply for questions your assistant cannot answer.',check:'Save your messages, then review your opening hours in Appointments.',done:readiness.respondersConfigured},
  {tab:'Conversations',title:'Practise the full conversation',detail:'Use an invented customer. Ask a saved question, request a person and practise a team reply.',check:'Finish a rehearsal and check the saved result before connecting a real channel.',done:readiness.conversationTested},
 ] as const;
 const done=steps.filter(s=>s.done).length,next=steps.find(s=>!s.done),example=examples[kind];
 return <section className="platform-card setup-guide">
  <p className="platform-eyebrow">YOUR SETUP PATH</p><h2>From blank workspace to a confident first conversation.</h2>
  <p>Your progress comes from saved settings and rehearsal activity. These steps prepare your business; channel connection and paid activation are separate.</p>
  <progress max={steps.length} value={done} aria-label="Private setup progress"/><p>{done} of {steps.length} preparation steps saved or tested.</p>
  <div className="setup-next"><strong>{next?'Your next step':'Your preparation checklist is complete'}</strong><p>{next?next.detail:'Review the launch checklist for the actual state of your website, WhatsApp connection and subscription. Preparation does not activate them.'}</p><button className="platform-primary" onClick={()=>onNavigate(next?.tab||'Launch')}>{next?`Continue to ${next.tab}`:'Review launch readiness'}</button></div>
  <details className="setup-help"><summary>Have these details ready</summary><ul><li>Your business description and contact link.</li><li>Accurate answers to your most common customer questions.</li><li>Opening hours, appointment length and any notice or buffer you need.</li><li>The person who should handle questions the assistant cannot answer.</li></ul><p>Use invented customer details during practice. Keep passwords, API keys and payment card details out of answers and notes.</p></details>
  {steps.map((step,i)=><div className="setup-step" key={step.tab}><span className={step.done?'setup-complete':''}>{step.done?'✓':i+1}</span><div><h3>{step.title}</h3><p>{step.detail}</p><small>{step.done?'Saved / tested':'To do'}</small><details><summary>What to check</summary><p>{step.check}</p></details></div><button className="platform-secondary" onClick={()=>onNavigate(step.tab)}>{step.done?'Review':'Start'}</button></div>)}
  <details className="setup-help"><summary>See starter examples for your business</summary><label>Business type<select value={kind} onChange={e=>setKind(e.target.value as keyof typeof examples)}>{Object.entries(examples).map(([key,value])=><option key={key} value={key}>{value.label}</option>)}</select></label><p>These are drafts to adapt. Nothing below is saved automatically.</p><h3>Example question</h3><p>{example.question}</p><h3>Example approved answer</h3><p>{example.answer}</p><h3>Example welcome</h3><p>{example.welcome}</p><button className="platform-secondary" onClick={()=>onNavigate('Answers')}>Write my business answers</button></details>
  <div className="setup-followup"><h3>Prepare your team and channels</h3><p>These are separate checks, not additional completed setup steps.</p><div><button className="platform-secondary" onClick={()=>onNavigate('Appointments')}>Review booking hours</button><button className="platform-secondary" onClick={()=>onNavigate('Team')}>Invite your team</button><button className="platform-secondary" onClick={()=>onNavigate('Website')}>Review website installation</button></div></div>
  <div className="platform-sandbox"><strong>WhatsApp approval is pending.</strong> Meta App Review was submitted on 23 October 2026. External business onboarding remains unavailable until the required access is approved and delivery is tested. You can prepare and rehearse now.</div>
 </section>;
}
