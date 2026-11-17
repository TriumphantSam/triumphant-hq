import type {Env} from '../types';
export function liveAcceptance(env: Env) {
  const email=env.PLATFORM_BILLING_ACCEPTANCE_EMAIL?.trim().toLowerCase();
  const workspaceId=env.PLATFORM_BILLING_ACCEPTANCE_WORKSPACE_ID;
  const expiresAt=env.PLATFORM_BILLING_ACCEPTANCE_EXPIRES_AT;
  if(env.ENVIRONMENT!=='production'||env.PLATFORM_BILLING_ACCEPTANCE_ENABLED!=='true'||!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!workspaceId||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(workspaceId)||!expiresAt||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(expiresAt)||!Number.isFinite(Date.parse(expiresAt)))return null;
  return {email,workspaceId,expiresAt:Date.parse(expiresAt)};
}
// Keep verification, cancellation and refund cleanup available after the
// checkout deadline. Expiry must never strand an existing recurring agreement.
export function billingRecordAllowed(env:Env,workspaceId:string,email:string) {
  if(env.ENVIRONMENT!=='production'||env.PLATFORM_CUSTOMER_RELEASE_ENABLED==='true')return true;
  const acceptance=liveAcceptance(env);
  return Boolean(acceptance&&acceptance.workspaceId===workspaceId&&acceptance.email===email.toLowerCase());
}
export function billingCheckoutAllowed(env:Env,workspaceId:string,email:string,now=Date.now()) {
  if(!billingRecordAllowed(env,workspaceId,email))return false;
  if(env.ENVIRONMENT!=='production'||env.PLATFORM_CUSTOMER_RELEASE_ENABLED==='true')return true;
  return liveAcceptance(env)!.expiresAt>now;
}
export function billingMode(env: Env): 'test' | 'live' | null {
  if (env.ENVIRONMENT === 'staging' && env.PLATFORM_BILLING_TEST_ENABLED === 'true' && /^sk_test_[A-Za-z0-9]+$/.test(env.PAYSTACK_TEST_SECRET_KEY || '')) return 'test';
  if (env.ENVIRONMENT === 'production' && env.PLATFORM_ENABLED === 'true' && (env.PLATFORM_CUSTOMER_RELEASE_ENABLED === 'true'||liveAcceptance(env)) && env.PLATFORM_BILLING_LIVE_ENABLED === 'true' && /^sk_live_[A-Za-z0-9]+$/.test(env.PLATFORM_PAYSTACK_LIVE_SECRET_KEY || '')) return 'live';
  return null;
}
export function billingKey(env: Env) {
  return billingMode(env) === 'live' ? env.PLATFORM_PAYSTACK_LIVE_SECRET_KEY : env.PAYSTACK_TEST_SECRET_KEY;
}
