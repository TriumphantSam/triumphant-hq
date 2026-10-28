import type {Env} from '../types';
import {plans} from './plans';
import {billingMode} from './billing-policy';

// Each payment domain supplies only its own explicitly enabled entitlements.
// Draft plan selection is not proof of payment. The period must have a matching
// verified ledger entry, and remains valid after cancellation until it expires.
export async function subscriptionAccess(env: Env, workspaceId: string, now = Date.now()) {
  const sandbox = {active: false, mode: 'sandbox' as const, planId: null as string | null, replies: env.ENVIRONMENT === 'production' ? 0 : 100, faqs: null as number | null, paidThrough: null as string | null};
  const mode = billingMode(env);
  if (!mode) return sandbox;
  const row = await env.DB.prepare("SELECT b.plan_id,b.amount,b.paid_through FROM platform_billing b WHERE b.workspace_id=? AND b.mode=? AND b.state IN ('active','attention','non-renewing','cancelled','completed','cancel-pending') AND b.paid_through>? AND EXISTS(SELECT 1 FROM platform_billing_payments p WHERE p.workspace_id=b.workspace_id AND p.mode=b.mode AND p.amount=b.amount AND p.period_end=b.paid_through)")
    .bind(workspaceId, mode, new Date(now).toISOString()).first<{plan_id: string; amount: number; paid_through: string}>();
  const plan = plans.find(p => p.id === row?.plan_id && p.monthlyKobo === row.amount);
  if (!plan || !row) return sandbox;
  return {active: true, mode: mode === 'test' ? 'paid-test' as const : 'paid-live' as const, planId: plan.id, replies: plan.replies, faqs: plan.faqs, paidThrough: row.paid_through};
}
