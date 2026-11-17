"use client";
import {useEffect,useState} from 'react';

type Settings={enabled:boolean;recipients:string[];version:number;maxRecipients:number};
async function request(workspaceId:string,action:string,payload:Record<string,unknown>={}){
 const r=await fetch('/api/platform',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,payload:{workspaceId,...payload}}),cache:'no-store'});
 const data=await r.json();if(!r.ok)throw Error(data.error||'Test contact settings are unavailable.');return data as Settings;
}
export default function WhatsAppTestControls({workspaceId,onChanged}:{workspaceId:string;onChanged:()=>void}){
 const [saved,setSaved]=useState<Settings|null>(null),[enabled,setEnabled]=useState(false),[numbers,setNumbers]=useState(''),[consent,setConsent]=useState(false);
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 function display(data:Settings){setSaved(data);setEnabled(data.enabled);setNumbers(data.recipients.join('\n'));setConsent(false);}
 useEffect(()=>{let active=true;request(workspaceId,'whatsapp.testing.read').then(data=>{if(active)display(data);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[workspaceId]);
 async function save(){
  if(busy||!saved)return;setBusy(true);setError('');setNotice('');
  try{
   const recipients=numbers.split(/\r?\n/).map(n=>n.trim()).filter(Boolean);
   const data=await request(workspaceId,'whatsapp.testing.save',{enabled,recipients,version:saved.version,testConsent:consent});display(data);
   setNotice(data.enabled?'Saved: only the selected test contacts can enter this workspace’s WhatsApp inbox or receive platform replies. Automatic replies still follow your separate Autoresponders switch and each chat’s pause state.':'Saved: WhatsApp testing is off. This workspace will ignore new incoming WhatsApp chats and cannot send team replies. Your phone app remains connected.');onChanged();
  }catch(e){setError(e instanceof Error?e.message:'Reload before saving.');}finally{setBusy(false);}
 }
 async function reload(){if(busy)return;setBusy(true);setError('');setNotice('');try{display(await request(workspaceId,'whatsapp.testing.read'));}catch(e){setError(e instanceof Error?e.message:'Please reload.');}finally{setBusy(false);}}
 return <section className="platform-card platform-form" aria-label="Selected WhatsApp test contacts">
  <p className="platform-eyebrow">OWNER CONTROLS</p><h2>Test with selected contacts.</h2>
  <p>Keep normal conversations on your phone outside this test. New messages from numbers not on this list are ignored by this workspace. Existing stored records are preserved.</p>
  {error&&<p role="alert" className="platform-error">{error}</p>}
  {!saved&&error&&<p>Keep automatic replies off until the backend protection and saved test settings have been verified.</p>}
  {notice&&<p role="status" className="platform-success">{notice}</p>}
  {!saved&&!error&&<p role="status">Loading saved test settings…</p>}
  {saved&&<><p><strong>Saved test access: {saved.enabled?'Selected contacts only':'Off'}.</strong> {saved.recipients.length} of {saved.maxRecipients} numbers saved. Changes below apply only after saving.</p>
   <form onSubmit={e=>{e.preventDefault();void save();}}>
    <label className="public-consent"><input type="checkbox" checked={enabled} disabled={busy} onChange={e=>{setEnabled(e.target.checked);setConsent(false);}}/>Allow WhatsApp testing with only the numbers below</label>
    <label>Test numbers, one per line<textarea rows={5} maxLength={220} value={numbers} disabled={busy} onChange={e=>{setNumbers(e.target.value);setConsent(false);}} placeholder="+2348012345678"/><small>Use international format with the country code, for example +234… . Maximum five numbers. Use another account, not your connected business number.</small></label>
    {enabled&&<label className="public-consent"><input type="checkbox" checked={consent} disabled={busy} required onChange={e=>setConsent(e.target.checked)}/>These are my test numbers or contacts who have agreed to this test.</label>}
    <p className="platform-muted">Saving this list sends no message and does not change the separate automatic-replies switch. If that switch is already on and the chat is unpaused, enabling testing allows replies to the next messages from these selected numbers. Review Autoresponders first. Phone-app greetings, away messages and other connected services have their own settings.</p>
    <button className="platform-primary" disabled={busy||enabled&&!consent}>{busy?'Saving…':'Save test settings'}</button>
   </form></>}
  <button className="platform-secondary" disabled={busy} onClick={()=>void reload()}>Reload saved test settings</button>
 </section>;
}
