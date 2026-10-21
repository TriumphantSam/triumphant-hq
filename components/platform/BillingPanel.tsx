"use client";
import { useEffect, useRef, useState } from "react";
type Status = {
  available:boolean; state:string; planId:string|null; paidThrough:string|null;
  cancelRequested:boolean; testAccessActive:boolean; checkoutUrl:string|null;
};
type Plan = {id:string;name:string;monthlyKobo:number};
async function request(workspaceId:string,action:string,payload:Record<string,unknown>={}) {
  const response=await fetch("/api/platform",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,payload:{workspaceId,...payload}}),cache:"no-store"});
  const data=await response.json();if(!response.ok)throw new Error(data.error||"Billing could not be loaded.");return data as Status;
}
export default function BillingPanel({workspaceId,plans}:{workspaceId:string;plans:Plan[]}) {
  const [status,setStatus]=useState<Status|null>(null),[error,setError]=useState(""),[busy,setBusy]=useState(false),[planId,setPlanId]=useState(plans[0]?.id||"starter"),[consent,setConsent]=useState(false);
  const attempt=useRef<{planId:string;id:string}|null>(null);
  useEffect(()=>{let active=true;request(workspaceId,"billing.read").then(data=>{if(active)setStatus(data);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[workspaceId]);
  async function run(action:string,payload?:Record<string,unknown>) {
    if(busy)return;setBusy(true);setError("");
    try {setStatus(await request(workspaceId,action,payload));} catch(e){setError(e instanceof Error?e.message:"Please reload billing.");} finally {setBusy(false);}
  }
  return <section className="platform-card platform-form"><p className="platform-eyebrow">Subscription rehearsal</p><h2>Test billing before going live.</h2><p>This is Paystack test mode. It cannot charge real money, activate WhatsApp or open the production platform. Test subscription access is tracked separately from your draft workspace plan and sandbox allowances.</p>
    {error&&<p role="alert" className="platform-error">{error}</p>}
    {!status&&!error&&<p role="status">Loading billing…</p>}
    {status&&<><p><strong>Billing status:</strong> {status.state}. {status.testAccessActive?"A verified test payment covers the current period.":"No current paid test period."}</p>
    {status.paidThrough&&<p>Paid test period ends: {new Intl.DateTimeFormat("en-NG",{dateStyle:"medium",timeStyle:"short",timeZone:"Africa/Lagos"}).format(new Date(status.paidThrough))} WAT.</p>}
    {status.cancelRequested&&<p>Your cancellation request is saved. Refresh to reconcile the provider status. Already-paid test time is preserved.</p>}
    {!status.available?<p className="platform-muted">Test subscription checkout is not enabled yet. Provider test plans and launch controls must be configured first. Live billing remains unavailable.</p>:status.state==="none"?<form onSubmit={e=>{e.preventDefault();if(!attempt.current||attempt.current.planId!==planId)attempt.current={planId,id:crypto.randomUUID()};void run("billing.checkout",{planId,requestId:attempt.current.id,recurringConsent:consent});}}>
      <label>Monthly test plan<select value={planId} onChange={e=>{setPlanId(e.target.value);setConsent(false);}}>{plans.map(p=><option key={p.id} value={p.id}>{p.name} — {new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(p.monthlyKobo/100)} / month</option>)}</select></label>
      <label className="public-consent"><input type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)}/>I understand this creates a recurring monthly test subscription at the displayed price. It continues in test mode until cancelled.</label>
      <button disabled={busy||!consent} className="platform-primary">{busy?"Preparing…":"Prepare test checkout"}</button>
    </form>:<>{status.checkoutUrl&&<a className="platform-primary" href={status.checkoutUrl} target="_blank" rel="noopener noreferrer">Open Paystack test checkout</a>}<p className="platform-muted">Returning from checkout does not activate access. Refresh below to verify the payment. Do not start a second subscription if verification is delayed.</p><button className="platform-secondary" disabled={busy} onClick={()=>void run("billing.refresh")}>Verify payment and refresh status</button>{status.state!=="initializing"&&status.state!=="checkout"&&<button className="platform-secondary" disabled={busy} onClick={()=>void run("billing.cancel")}>Stop test renewal</button>}</>}
    </>}
    <button className="platform-secondary" disabled={busy} onClick={()=>void run("billing.read")}>Reload saved billing</button>
  </section>;
}
