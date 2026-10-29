import type {Env} from '../types';
import {plans} from './plans';
import {billingMode} from './billing-policy';

// Each payment domain supplies only its own explicitly enabled entitlements.
// Draft plan selection is not proof of payment. The period must have a matching
// verified ledger entry, and remains valid after cancellation until it expires.
export async function subscriptionAccess(env: Env, workspaceId: string, now = Date.now()) {
  const period=new Date(now+3600000).toISOString().slice(0,7);
  const defaults={period,windowStart:new Date(period+'-01T00:00:00+01:00').toISOString(),enquiries:env.ENVIRONMENT==='production'?0:100,bookings:env.ENVIRONMENT==='production'?0:100,ai:100,trial:false,trialEndsAt:null as string|null};
  const trial=await env.DB.prepare('SELECT started_at,expires_at FROM platform_trials WHERE workspace_id=?').bind(workspaceId).first<{started_at:string;expires_at:string}>();
  const trialUsed=trial?await env.DB.prepare("SELECT count FROM platform_usage WHERE workspace_id=? AND period='trial' AND kind='assistant_replies'").bind(workspaceId).first<{count:number}>():null;
  const trialOpen=Boolean(trial&&Date.parse(trial.expires_at)>now&&Number(trialUsed?.count||0)<50&&env.PLATFORM_TRIAL_ENABLED==='true'&&(env.ENVIRONMENT!=='production'||env.PLATFORM_CUSTOMER_RELEASE_ENABLED==='true'));
  const sandbox = {...defaults,active: false, mode: 'sandbox' as const, planId: null as string | null, replies: env.ENVIRONMENT === 'production' ? 0 : 100, faqs: null as number | null, paidThrough: null as string | null};
  const mode = billingMode(env);
  const unpaid=()=>trial?{...sandbox,period:'trial',windowStart:trial.started_at,replies:trialOpen?50:0,faqs:20,enquiries:trialOpen?10:0,bookings:trialOpen?10:0,ai:trialOpen?50:0,trial:trialOpen,trialEndsAt:trial.expires_at}:sandbox;
  if (!mode) return unpaid();
  const row = await env.DB.prepare("SELECT b.plan_id,b.amount,b.paid_through FROM platform_billing b WHERE b.workspace_id=? AND b.mode=? AND b.state IN ('active','attention','non-renewing','cancelled','completed','cancel-pending') AND b.paid_through>? AND EXISTS(SELECT 1 FROM platform_billing_payments p WHERE p.workspace_id=b.workspace_id AND p.mode=b.mode AND p.amount=b.amount AND p.period_end=b.paid_through)")
    .bind(workspaceId, mode, new Date(now).toISOString()).first<{plan_id: string; amount: number; paid_through: string}>();
  const plan = plans.find(p => p.id === row?.plan_id && (p.monthlyKobo === row.amount || (p.id==='growth'&&row.amount===3500000) || (p.id==='business'&&row.amount===7500000)));
  if (!plan || !row) return unpaid();
  return {...defaults,enquiries:plan.enquiries,bookings:plan.bookings,ai:plan.replies,active: true, mode: mode === 'test' ? 'paid-test' as const : 'paid-live' as const, planId: plan.id, replies: plan.replies, faqs: plan.faqs, paidThrough: row.paid_through};
}
