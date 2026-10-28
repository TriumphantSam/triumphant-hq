import type {Env} from '../types';
export function billingMode(env: Env): 'test' | 'live' | null {
  if (env.ENVIRONMENT === 'staging' && env.PLATFORM_BILLING_TEST_ENABLED === 'true' && /^sk_test_[A-Za-z0-9]+$/.test(env.PAYSTACK_TEST_SECRET_KEY || '')) return 'test';
  if (env.ENVIRONMENT === 'production' && env.PLATFORM_ENABLED === 'true' && env.PLATFORM_CUSTOMER_RELEASE_ENABLED === 'true' && env.PLATFORM_BILLING_LIVE_ENABLED === 'true' && /^sk_live_[A-Za-z0-9]+$/.test(env.PLATFORM_PAYSTACK_LIVE_SECRET_KEY || '')) return 'live';
  return null;
}
export function billingKey(env: Env) {
  return billingMode(env) === 'live' ? env.PLATFORM_PAYSTACK_LIVE_SECRET_KEY : env.PAYSTACK_TEST_SECRET_KEY;
}
