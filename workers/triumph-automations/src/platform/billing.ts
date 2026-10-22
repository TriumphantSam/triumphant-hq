import type { Env } from "../types";
import { admit, plans, PlatformError, requireWorkspace, validId } from "./core";

type Billing = {
  workspace_id: string; request_id: string; reference: string; email: string;
  plan_id: string; plan_code: string; amount: number; state: string;
  checkout_url: string | null; subscription_code: string | null;
  customer_code: string | null; paid_through: string | null;
  cancel_requested: number; created_at: string;
};
type Transaction = {
  id: number; reference: string; status: string; domain: string; currency: string;
  amount: number; paid_at: string; customer: { email: string; customer_code: string; id?:number };
  plan_object?: { plan_code: string }; plan?: string | { plan_code: string };
};
type Subscription = {
  subscription_code: string; email_token: string; domain: string; status: string;
  amount: number; plan: { plan_code: string; currency: string; interval: string };
  customer: { email: string; customer_code: string }; next_payment_date: string;
  most_recent_invoice?: {
    transaction: number; domain: string; amount: number; paid: number | boolean;
    status: string; period_start: string; period_end: string;
  };
};
export const billingReady = (env: Env) => env.ENVIRONMENT === "staging" &&
  env.PLATFORM_BILLING_TEST_ENABLED === "true" && /^sk_test_[A-Za-z0-9]+$/.test(env.PAYSTACK_TEST_SECRET_KEY || "");
function requireReady(env: Env) {
  if (!billingReady(env)) throw new PlatformError("Test subscriptions are not enabled. No payment was started.", 503);
}
async function provider<T>(env: Env, path: string, body?: unknown): Promise<T> {
  requireReady(env);
  let response: Response;
  try {
    response = await fetch("https://api.paystack.co" + path, {
      method: body ? "POST" : "GET", redirect: "manual", signal: AbortSignal.timeout(7000),
      headers: { Authorization: "Bearer " + env.PAYSTACK_TEST_SECRET_KEY, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch { throw new PlatformError("Paystack could not be reached. Reload billing before trying again.", 503); }
  if (!response.ok) throw new PlatformError("Paystack could not complete this request. No access was activated.", 503);
  const result = await response.json() as { status: boolean; data: T };
  if (result.status !== true || !result.data) throw new PlatformError("The billing response could not be verified.", 503);
  return result.data;
}
const code = (value: unknown, prefix: string): value is string => typeof value === "string" && new RegExp(`^${prefix}_[a-zA-Z0-9]+$`).test(value);
const iso = (value: unknown) => typeof value === "string" && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null;
export function nextMonthlyDate(paidAt: string) {
  const date = new Date(paidAt);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth()+1, Math.min(date.getUTCDate(),28),date.getUTCHours(),date.getUTCMinutes(),date.getUTCSeconds(),date.getUTCMilliseconds())).toISOString();
}
function view(row: Billing | null, enabled: boolean) {
  return {
    testMode: true, available: enabled, liveBilling: false,
    state: row?.state || "none", planId: row?.plan_id || null,
    paidThrough: row?.paid_through || null, cancelRequested: Boolean(row?.cancel_requested),
    testAccessActive: Boolean(row?.paid_through && Date.parse(row.paid_through) > Date.now()),
    checkoutUrl: row?.state === "checkout" ? row.checkout_url : null,
    reference: row?.reference || null,
  };
}
async function read(env: Env, id: string) {
  return env.DB.prepare("SELECT * FROM platform_billing WHERE workspace_id=?").bind(id).first<Billing>();
}
function validTransaction(tx: Transaction, row: Billing) {
  return tx.reference && tx.status === "success" && tx.domain === "test" && tx.currency === "NGN" &&
    tx.amount === row.amount && Number.isSafeInteger(tx.id) && tx.id > 0 && iso(tx.paid_at) &&
    Date.parse(tx.paid_at) >= Date.parse(row.created_at)-300000 && Date.parse(tx.paid_at) <= Date.now()+300000 &&
    tx.customer?.email?.toLowerCase() === row.email && code(tx.customer.customer_code,"CUS");
}
async function recordPayment(env: Env, row: Billing, tx: Transaction, periodEnd: string) {
  if (!validTransaction(tx,row)) throw new PlatformError("The payment does not match this subscription.",409);
  // The insert and entitlement update commit together. Replays cannot add time;
  // older successful payments cannot shorten an already-paid period.
  await env.DB.batch([
    env.DB.prepare("INSERT INTO platform_billing_payments(reference,provider_id,workspace_id,amount,paid_at,period_end) VALUES(?,?,?,?,?,?) ON CONFLICT(reference) DO NOTHING")
      .bind(tx.reference,String(tx.id),row.workspace_id,row.amount,iso(tx.paid_at),periodEnd),
    env.DB.prepare("UPDATE platform_billing SET paid_through=CASE WHEN paid_through IS NULL OR paid_through<? THEN ? ELSE paid_through END,customer_code=?,state=CASE WHEN cancel_requested=1 THEN CASE WHEN state IN ('non-renewing','cancelled','completed') THEN state ELSE 'cancel-pending' END WHEN paid_through IS NULL OR paid_through<? THEN 'active' ELSE state END,updated_at=? WHERE workspace_id=? AND EXISTS(SELECT 1 FROM platform_billing_payments WHERE reference=? AND provider_id=? AND workspace_id=? AND period_end=?)")
      .bind(periodEnd,periodEnd,tx.customer.customer_code,periodEnd,new Date().toISOString(),row.workspace_id,tx.reference,String(tx.id),row.workspace_id,periodEnd),
  ]);
}
async function initialPayment(env: Env, row: Billing) {
  const tx = await provider<Transaction>(env,"/transaction/verify/"+encodeURIComponent(row.reference));
  if (tx.status !== "success") return null;
  const planCode = tx.plan_object?.plan_code || (typeof tx.plan === "string" ? tx.plan : tx.plan?.plan_code);
  if (tx.reference !== row.reference || planCode !== row.plan_code || !validTransaction(tx,row))
    throw new PlatformError("The payment does not match this subscription.",409);
  await recordPayment(env,row,tx,nextMonthlyDate(tx.paid_at));
  return tx;
}
async function discoverSubscription(env:Env,row:Billing,tx:Transaction) {
  const customer=await provider<{id:number;customer_code:string;email:string}>(env,"/customer/"+encodeURIComponent(tx.customer.customer_code));
  const plan=await provider<{id:number;plan_code:string}>(env,"/plan/"+encodeURIComponent(row.plan_code));
  if(!Number.isSafeInteger(customer.id)||customer.id<=0||customer.customer_code!==tx.customer.customer_code||customer.email?.toLowerCase()!==row.email||!Number.isSafeInteger(plan.id)||plan.id<=0||plan.plan_code!==row.plan_code)
    throw new PlatformError("The provider billing identity could not be verified.",409);
  const candidates=await provider<Array<Subscription&{createdAt?:string;created_at?:string}>>(env,`/subscription?customer=${customer.id}&plan=${plan.id}&perPage=100`);
  if(!Array.isArray(candidates)||candidates.length>=100)throw new PlatformError("Subscription reconciliation needs operator review.",409);
  const matches=candidates.filter(s=>s.domain==="test"&&s.customer?.customer_code===customer.customer_code&&s.plan?.plan_code===row.plan_code&&s.amount===row.amount&&code(s.subscription_code,"SUB")&&iso(s.createdAt||s.created_at)&&Date.parse(s.createdAt||s.created_at!)>=Date.parse(row.created_at)-300000&&Date.parse(s.createdAt||s.created_at!)<=Date.parse(tx.paid_at)+600000);
  if(matches.length>1)throw new PlatformError("Multiple matching subscriptions need operator review. Do not pay again.",409);
  if(!matches.length)return null;
  const found=await subscription(env,row,matches[0].subscription_code);
  await env.DB.prepare("UPDATE platform_billing SET subscription_code=?,customer_code=?,updated_at=? WHERE workspace_id=? AND subscription_code IS NULL").bind(found.subscription_code,found.customer.customer_code,new Date().toISOString(),row.workspace_id).run();
  const saved=await read(env,row.workspace_id);
  if(saved?.subscription_code!==found.subscription_code)throw new PlatformError("Subscription reconciliation changed. Reload billing.",409);
  return saved;
}
async function subscription(env: Env, row: Billing, subscriptionCode: string) {
  if (!code(subscriptionCode,"SUB")) throw new PlatformError("Subscription not found.",404);
  const sub = await provider<Subscription>(env,"/subscription/"+encodeURIComponent(subscriptionCode));
  if (sub.subscription_code !== subscriptionCode || sub.domain !== "test" || sub.amount !== row.amount ||
    sub.plan?.plan_code !== row.plan_code || sub.plan.currency !== "NGN" || sub.plan.interval !== "monthly" ||
    sub.customer?.email?.toLowerCase() !== row.email || !code(sub.customer.customer_code,"CUS") ||
    (row.customer_code && row.customer_code !== sub.customer.customer_code))
    throw new PlatformError("The subscription could not be matched to this business.",409);
  return sub;
}
async function reconcile(env: Env, row: Billing) {
  if (!row.subscription_code) {
    const tx=await initialPayment(env,row);if(!tx)return;
    const found=await discoverSubscription(env,row,tx);if(!found)return;row=found;
  }
  if(!row.subscription_code)return;
  const sub = await subscription(env,row,row.subscription_code);
  const invoice = sub.most_recent_invoice;
  if (invoice && invoice.domain === "test" && invoice.amount === row.amount &&
    (invoice.paid === true || invoice.paid === 1) && invoice.status === "success") {
    const start=iso(invoice.period_start),end=iso(invoice.period_end);
    if (!start || !end || end <= start || Date.parse(end)-Date.parse(start)>35*86400000 || !Number.isSafeInteger(invoice.transaction) || invoice.transaction<=0)
      throw new PlatformError("The paid billing period could not be verified.",409);
    const found=await provider<Transaction>(env,"/transaction/"+invoice.transaction);
    const tx=await provider<Transaction>(env,"/transaction/verify/"+encodeURIComponent(found.reference));
    if (tx.id !== invoice.transaction || !validTransaction(tx,row) || tx.customer.customer_code !== sub.customer.customer_code || Date.parse(tx.paid_at)<Date.parse(start)-300000 || Date.parse(tx.paid_at)>Date.parse(end)+300000)
      throw new PlatformError("The renewal payment could not be verified.",409);
    await recordPayment(env,row,tx,end);
  }
  // Re-read current provider state rather than applying an out-of-order webhook.
  const states=new Set(["active","attention","non-renewing","cancelled","completed"]);
  if (states.has(sub.status)) await env.DB.prepare("UPDATE platform_billing SET state=CASE WHEN cancel_requested=1 AND ? IN ('active','attention') THEN 'cancel-pending' ELSE ? END,updated_at=? WHERE workspace_id=?")
    .bind(sub.status,sub.status,new Date().toISOString(),row.workspace_id).run();
}
export async function billingAction(env: Env, user: {id:string;email:string}, action: string, input: Record<string,unknown>) {
  const workspace=await requireWorkspace(env,user.id,input.workspaceId,true);
  let row=await read(env,workspace.id);
  const accepted=Boolean(env.PLATFORM_BILLING_TEST_EMAIL && user.email.toLowerCase()===env.PLATFORM_BILLING_TEST_EMAIL.toLowerCase());
  if (action === "billing.read") return view(row,billingReady(env)&&accepted);
  requireReady(env);
  if(!accepted) throw new PlatformError("This account is not enrolled in billing acceptance.",403);
  if (action === "billing.checkout") {
    const plan=plans.find(p=>p.id===input.planId);
    if (!plan || !validId(input.requestId) || input.recurringConsent !== true) throw new PlatformError("Choose a plan and confirm the monthly test subscription.");
    if (row) {
      if (row.request_id !== input.requestId || row.plan_id !== plan.id) throw new PlatformError("This business already has a billing attempt. Reload billing to verify or manage it.",409);
      if (!row.checkout_url) throw new PlatformError("This checkout is being reconciled. Reload billing; do not start another subscription.",409);
      return view(row,true);
    }
    let configured: Record<string,string>;
    try { configured=JSON.parse(env.PLATFORM_PAYSTACK_TEST_PLANS || "{}"); } catch { throw new PlatformError("Test plans are not configured.",503); }
    const catalog=await env.DB.prepare("SELECT plan_code FROM platform_billing_plans WHERE plan_id=? AND amount=? AND state='ready'").bind(plan.id,plan.monthlyKobo).first<{plan_code:string}>();
    const planCode=configured[plan.id] || catalog?.plan_code;
    if (!code(planCode,"PLN")) throw new PlatformError("This test plan is not configured yet.",503);
    const remote=await provider<{plan_code:string;amount:number;currency:string;interval:string;domain:string}>(env,"/plan/"+encodeURIComponent(planCode));
    if (remote.plan_code!==planCode || remote.amount!==plan.monthlyKobo || remote.currency!=="NGN" || remote.interval!=="monthly" || remote.domain!=="test") throw new PlatformError("The provider plan does not match the displayed price.",409);
    await admitCheckout(env,workspace.id);
    const now=new Date().toISOString(),reference="platform_"+crypto.randomUUID();
    const inserted=await env.DB.prepare("INSERT INTO platform_billing(workspace_id,request_id,reference,email,plan_id,plan_code,amount,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(workspace_id) DO NOTHING RETURNING workspace_id")
      .bind(workspace.id,input.requestId,reference,user.email.toLowerCase(),plan.id,planCode,plan.monthlyKobo,now,now).first();
    if (!inserted) throw new PlatformError("Billing changed. Reload before continuing.",409);
    const checkout=await provider<{authorization_url:string;reference:string}>(env,"/transaction/initialize",{email:user.email,amount:plan.monthlyKobo,currency:"NGN",reference,plan:planCode,channels:["card"],metadata:{purpose:"platform_test_subscription"}});
    let url:URL;try{url=new URL(checkout.authorization_url);}catch{throw new PlatformError("The checkout address could not be verified.",503);}
    if (checkout.reference!==reference || url.protocol!=="https:" || url.hostname!=="checkout.paystack.com" || url.username || url.password || url.port) throw new PlatformError("The checkout address could not be verified.",503);
    await env.DB.prepare("UPDATE platform_billing SET checkout_url=?,state='checkout',updated_at=? WHERE workspace_id=? AND state='initializing'").bind(url.href,now,workspace.id).run();
  } else if (action === "billing.refresh") {
    await admit(env,"billing-refresh:"+workspace.id,20);
    if (row) await reconcile(env,row);
  } else if (action === "billing.cancel") {
    if(row&&!row.subscription_code){await reconcile(env,row);row=await read(env,workspace.id);}
    if (!row?.subscription_code) throw new PlatformError("The provider subscription is still being reconciled. Refresh billing or contact support before paying again.",409);
    await env.DB.prepare("UPDATE platform_billing SET cancel_requested=1,state=CASE WHEN state IN ('non-renewing','cancelled','completed') THEN state ELSE 'cancel-pending' END,updated_at=? WHERE workspace_id=?").bind(new Date().toISOString(),workspace.id).run();
    const sub=await subscription(env,row,row.subscription_code);
    if (!["non-renewing","cancelled","completed"].includes(sub.status)) {
      if (!sub.email_token || typeof sub.email_token!=="string") throw new PlatformError("Cancellation needs provider reconciliation. Your request is saved; retry cancellation.",503);
      await provider(env,"/subscription/disable",{code:sub.subscription_code,token:sub.email_token});
    }
    await env.DB.prepare("UPDATE platform_billing SET state='non-renewing',updated_at=? WHERE workspace_id=?").bind(new Date().toISOString(),workspace.id).run();
  } else throw new PlatformError("Unknown billing action.");
  row=await read(env,workspace.id);return view(row,true);
}
async function admitCheckout(env:Env,id:string) {
  await admit(env,"billing:"+id,5);
}
// Operator-only signed endpoint; never exposed by the website RPC allowlist.
export async function provisionTestPlans(env:Env) {
  requireReady(env);
  const result=[];
  for(const plan of plans) {
    const existing=await env.DB.prepare("SELECT plan_code,state,amount FROM platform_billing_plans WHERE plan_id=?").bind(plan.id).first<{plan_code:string|null;state:string;amount:number}>();
    if(existing?.state==="ready" && existing.plan_code && existing.amount===plan.monthlyKobo){result.push({id:plan.id,code:existing.plan_code});continue;}
    const claimed=await env.DB.prepare("INSERT INTO platform_billing_plans(plan_id,amount,created_at) VALUES(?,?,?) ON CONFLICT DO NOTHING RETURNING plan_id").bind(plan.id,plan.monthlyKobo,new Date().toISOString()).first();
    if(!claimed)throw new PlatformError("A test plan needs operator reconciliation before another creation attempt.",409);
    const remote=await provider<{plan_code:string;amount:number;currency:string;interval:string;domain:string}>(env,"/plan",{name:`TriumphantTech ${plan.name} TEST`,amount:plan.monthlyKobo,currency:"NGN",interval:"monthly",send_invoices:false,send_sms:false});
    if(!code(remote.plan_code,"PLN")||remote.amount!==plan.monthlyKobo||remote.currency!=="NGN"||remote.interval!=="monthly"||remote.domain!=="test")throw new PlatformError("The created test plan could not be verified.",503);
    await env.DB.prepare("UPDATE platform_billing_plans SET plan_code=?,state='ready' WHERE plan_id=? AND state='creating'").bind(remote.plan_code,plan.id).run();
    result.push({id:plan.id,code:remote.plan_code});
  }
  return {testMode:true,plans:result};
}
// Called only after the dedicated webhook's raw-body HMAC verification.
export async function billingEvent(env:Env,event:string,data:Record<string,unknown>) {
  requireReady(env);
  const subCode=typeof data.subscription_code==="string"?data.subscription_code:(data.subscription as {subscription_code?:string}|undefined)?.subscription_code;
  if (event === "charge.success") {
    if (typeof data.reference!=="string") return;
    const row=await env.DB.prepare("SELECT * FROM platform_billing WHERE reference=?").bind(data.reference).first<Billing>();
    if (row) await initialPayment(env,row);
    return;
  }
  if (!subCode || !["subscription.create","subscription.not_renew","subscription.disable","invoice.update","invoice.payment_failed"].includes(event)) return;
  let row=await env.DB.prepare("SELECT * FROM platform_billing WHERE subscription_code=?").bind(subCode).first<Billing>();
  if (!row && event === "subscription.create") {
    const customer=data.customer as {email?:string}|undefined,plan=data.plan as {plan_code?:string}|undefined;
    if (!customer?.email || !plan?.plan_code) return;
    const rows=await env.DB.prepare("SELECT * FROM platform_billing WHERE email=? AND plan_code=? AND subscription_code IS NULL").bind(customer.email.toLowerCase(),plan.plan_code).all<Billing>();
    if (rows.results.length!==1) return;
    row=rows.results[0];
    const sub=await subscription(env,row,subCode);
    if (!await initialPayment(env,row)) throw new PlatformError("Initial payment reconciliation pending.",503);
    await env.DB.prepare("UPDATE platform_billing SET subscription_code=?,customer_code=?,updated_at=? WHERE workspace_id=? AND subscription_code IS NULL").bind(subCode,sub.customer.customer_code,new Date().toISOString(),row.workspace_id).run();
    row=await read(env,row.workspace_id);
  }
  if (row) await reconcile(env,row);
}
