"use client";
import { useEffect, useRef, useState } from "react";
type Status = {
  agreementAmount:number|null; available:boolean; state:string; planId:string|null; paidThrough:string|null;
  cancelRequested:boolean; testAccessActive:boolean; checkoutUrl:string|null;
  testMode:boolean;accessActive:boolean;manageUrl?:string;
  expired:boolean;paymentAttention:boolean;lastVerifiedAt:string|null;reconciliation:string;
  entitlement:{active:boolean;planId:string|null;replies:number;faqs:number|null};
  payments:{reference:string;amount:number;paidAt:string;periodEnd:string}[];
};
type Plan = {id:string;name:string;monthlyKobo:number};
async function request(workspaceId:string,action:string,payload:Record<string,unknown>={}) {
  const response=await fetch("/api/platform",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,payload:{workspaceId,...payload}}),cache:"no-store"});
  const data=await response.json();if(!response.ok)throw new Error(data.error||"Billing could not be loaded.");return data as Status;
}
export default function BillingPanel({workspaceId,plans,onChanged}:{workspaceId:string;plans:Plan[];onChanged?:()=>void}) {
  const [status,setStatus]=useState<Status|null>(null),[error,setError]=useState(""),[busy,setBusy]=useState(false),[planId,setPlanId]=useState(plans[0]?.id||"starter"),[consent,setConsent]=useState(false);
  const attempt=useRef<{planId:string;id:string}|null>(null);
  useEffect(()=>{let active=true;request(workspaceId,"billing.read").then(data=>{if(active)setStatus(data);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[workspaceId]);
  async function run(action:string,payload?:Record<string,unknown>) {
    if(busy)return;setBusy(true);setError("");
    try {setStatus(await request(workspaceId,action,payload));setConsent(false);if(!['billing.read','billing.manage'].includes(action))onChanged?.();} catch(e){setError(e instanceof Error?e.message:"Please reload billing.");} finally {setBusy(false);}
  }
  const money=(amount:number)=>new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(amount/100);
  const stamp=(value:string)=>new Intl.DateTimeFormat('en-NG',{dateStyle:'medium',timeStyle:'short',timeZone:'Africa/Lagos'}).format(new Date(value));
  const isTest=status?.testMode!==false, qualifier=isTest?'test ':'';
  const labels:Record<string,string>={none:'No subscription',initializing:'Checkout needs verification',checkout:'Awaiting payment',active:'Renewal enabled',attention:'Payment needs attention','cancel-pending':'Stopping renewal','non-renewing':'Renewal stopped',cancelled:'Subscription cancelled',completed:'Subscription completed'};
  return <section className="platform-card platform-form"><p className="platform-eyebrow">{isTest?'Subscription rehearsal':'Your subscription'}</p><h2>{isTest?'Test billing before going live.':'Manage your business plan.'}</h2><p>{isTest?'This is Paystack test mode. It cannot charge real money, activate WhatsApp or open the production platform.':'Paystack securely handles your recurring monthly payment.'} A verified payment applies the subscribed plan’s answer and FAQ limits for its paid period. Draft plan selection does not activate these allowances.</p>
    {error&&<p role="alert" className="platform-error">{error}</p>}
    {!status&&!error&&<p role="status">Loading billing…</p>}
    {status&&<><p><strong>Billing status:</strong> {labels[status.state]||'Needs review'}. {status.accessActive?'A verified payment covers the current period.':'No current paid period.'}</p>
    {status.entitlement.active&&<p><strong>{plans.find(p=>p.id===status.entitlement.planId)?.name||'Subscribed plan'} {qualifier}allowance:</strong> {status.entitlement.replies.toLocaleString()} answers per Lagos calendar month and {status.entitlement.faqs} approved FAQs. Enquiries and bookings retain their separate limits.</p>}
    {status.expired&&<p role="status">Your paid period has ended. Paid allowances have stopped. {isTest?'The sandbox allowance remains available.':'Customer automation is paused until a new payment is verified.'} Existing records are preserved.</p>}
    {status.paymentAttention&&<p role="status">The provider reports a payment problem. A failed renewal does not extend your paid period. Any already-paid time remains available; refresh after resolving the payment with Paystack. Do not create a second subscription.</p>}
    {status.reconciliation==='needs-review'&&<p role="status">Automatic payment verification needs attention. Refresh below or contact support; do not pay again while the outcome is uncertain.</p>}
    {status.lastVerifiedAt&&<p className="platform-muted">Last provider verification: {stamp(status.lastVerifiedAt)} WAT. Missed callbacks are also checked automatically.</p>}
    {status.paidThrough&&<p>Paid {qualifier}period ends: {stamp(status.paidThrough)} WAT.</p>}
    {status.cancelRequested&&<p>{status.state==='cancel-pending'?'Your cancellation request is saved, but the provider has not confirmed it yet. Retry stopping renewal; already-paid time is preserved.':'Renewal is stopped. Your already-paid period is preserved.'}</p>}
    {!status.available?<p className="platform-muted">Subscription checkout is not enabled yet. Provider plans and release controls must be configured first.</p>:status.state==='none'?<form onSubmit={e=>{e.preventDefault();if(!attempt.current||attempt.current.planId!==planId)attempt.current={planId,id:crypto.randomUUID()};void run('billing.checkout',{planId,requestId:attempt.current.id,recurringConsent:consent});}}>
      <label>Monthly {qualifier}plan<select value={planId} onChange={e=>{setPlanId(e.target.value);setConsent(false);}}>{plans.map(p=><option key={p.id} value={p.id}>{p.name} — {money(p.monthlyKobo)} / month</option>)}</select></label>
      <label className="public-consent"><input type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)}/>I agree to a recurring monthly {qualifier}subscription at the displayed price, continuing until cancelled.</label>
      <button disabled={busy||!consent} className="platform-primary">{busy?'Preparing…':`Prepare ${qualifier}checkout`}</button>
    </form>:<>{status.checkoutUrl&&<a className="platform-primary" href={status.checkoutUrl} target="_blank" rel="noopener noreferrer">Open Paystack {qualifier}checkout</a>}<p className="platform-muted">Returning from checkout does not activate access. Refresh below to verify the payment. Do not start a second subscription if verification is delayed.</p><button className="platform-secondary" disabled={busy} onClick={()=>void run('billing.refresh')}>Verify payment and refresh status</button>{['active','attention','cancel-pending'].includes(status.state)&&<button className="platform-secondary" disabled={busy} onClick={()=>void run('billing.cancel')}>{status.state==='cancel-pending'?'Retry stopping renewal':'Stop renewal'}</button>}<button className="platform-secondary" disabled={busy} onClick={()=>void run('billing.manage')}>Prepare secure card-update link</button>{status.manageUrl&&<a href={status.manageUrl} target="_blank" rel="noopener noreferrer" className="platform-secondary">Update payment card on Paystack</a>}</>}
    </>}
    {status?.available&&status.cancelRequested&&['non-renewing','cancelled'].includes(status.state)&&<form onSubmit={e=>{e.preventDefault();void run('billing.resume',{recurringConsent:consent});}}><label className="public-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} required/>I agree to resume the existing recurring monthly {qualifier}subscription at {money(status.agreementAmount||0)}. No second subscription will be created.</label><button className="platform-secondary" disabled={busy||!consent}>Resume {qualifier}renewal</button></form>}
    {status&&<section aria-label="Verified payment history"><h3>Verified {qualifier}payments</h3>{status.payments.length?<ul>{status.payments.map(payment=><li key={payment.reference}><strong>{money(payment.amount)}</strong> · {stamp(payment.paidAt)} WAT · period ends {stamp(payment.periodEnd)} WAT<br/><small>Reference: {payment.reference}</small></li>)}</ul>:<p>No verified payments yet.</p>}<p className="platform-muted">The latest 24 verified payments are shown. {isTest?'Test records are not live receipts or tax invoices.':'These records are not tax invoices.'}</p></section>}
    <button className="platform-secondary" disabled={busy} onClick={()=>void run("billing.read")}>Reload saved billing</button>
  </section>;
}
