"use client";
import {useEffect,useState} from "react";
type Config={origin:string;enabled:number|boolean;version:number};
async function rpc(action:string,payload:unknown):Promise<Config>{
 const response=await fetch("/api/platform",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,payload}),cache:"no-store"});
 const data=await response.json();if(!response.ok)throw new Error(data.error||"Please try again.");return data;
}
export default function WebsiteWidgetPanel({workspaceId}:{workspaceId:string}){
 const [config,setConfig]=useState<Config|null>(null),[savedEnabled,setSavedEnabled]=useState(false),[host,setHost]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState("");
 useEffect(()=>{let active=true;rpc("widget.read",{workspaceId}).then(data=>{if(active){setConfig(data);setSavedEnabled(Boolean(data.enabled));setHost(window.location.origin);}}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[workspaceId]);
 const snippet=`<iframe src="${host}/business/${workspaceId}/widget" title="Business assistant" width="100%" height="680" style="border:0;border-radius:16px" loading="lazy" referrerpolicy="no-referrer" sandbox="allow-scripts allow-forms allow-same-origin allow-popups"></iframe>`;
 return <section className="platform-card platform-form"><div className="platform-sandbox"><strong>Sandbox website assistant</strong> · Test records only. No messages or payments are sent.</div><h2>Bring your assistant to your website.</h2><p>Publish your sandbox page under Launch first. Then allow one HTTPS website origin to frame it. This does not verify domain ownership or connect WhatsApp.</p>
 {error&&<p role="alert" className="platform-error">{error}</p>}{notice&&<p role="status" className="platform-success">{notice}</p>}
 {config?<form onSubmit={e=>{e.preventDefault();setBusy(true);setError("");setNotice("");rpc("widget.save",{workspaceId,...config,enabled:Boolean(config.enabled)}).then(data=>{setConfig(data);setSavedEnabled(Boolean(data.enabled));setNotice("Website settings saved.");}).catch(e=>setError(e.message)).finally(()=>setBusy(false));}}>
 <label>Allowed website origin<input type="url" required maxLength={250} placeholder="https://yourbusiness.com" value={config.origin} onChange={e=>setConfig({...config,origin:e.target.value})}/></label><p className="platform-muted">Include https:// and the hostname only. If your site uses www, enter that exact origin.</p>
 <label className="public-consent"><input type="checkbox" checked={Boolean(config.enabled)} onChange={e=>setConfig({...config,enabled:e.target.checked})}/>Allow this website to embed the sandbox assistant</label><button className="platform-primary" disabled={busy}>{busy?"Saving…":"Save website settings"}</button>
 <button type="button" className="platform-secondary" disabled={busy} onClick={()=>{setBusy(true);setError("");setNotice("");rpc("widget.read",{workspaceId}).then(data=>{setConfig(data);setSavedEnabled(Boolean(data.enabled));}).catch(e=>setError(e.message)).finally(()=>setBusy(false));}}>Reload saved settings</button>
 </form>:!error&&<p role="status">Loading website settings…</p>}
 {savedEnabled&&host&&<><label>Copy into your website’s HTML<textarea readOnly rows={7} value={snippet} onFocus={e=>e.target.select()}/></label><p className="platform-muted">This code uses your saved configuration. Preview deployments may require Vercel sign-in and can prevent cross-site embedding. Installation on an unrelated website must be verified before this is sold as live. Pausing the business page blocks new submissions.</p></>}
 </section>;
}
