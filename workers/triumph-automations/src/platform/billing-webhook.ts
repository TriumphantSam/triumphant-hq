import type {Env} from '../types';
import {validPaystackSignature} from '../payments';
import {billingMode,billingKey} from './billing-policy';
import {billingEvent} from './billing';

// Dedicated live endpoint: the existing agency/test webhook remains unchanged.
export async function platformBillingWebhook(request: Request, env: Env) {
  if (billingMode(env) !== 'live') return new Response('Live billing is disabled', {status: 503});
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = []; let size = 0;
  if (reader) for (;;) {
    const next = await reader.read(); if (next.done) break;
    size += next.value.byteLength;
    if (size > 16384) {await reader.cancel(); return new Response('Too large', {status: 413});}
    chunks.push(next.value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) {bytes.set(chunk, offset); offset += chunk.byteLength;}
  const body = new TextDecoder().decode(bytes);
  if (!await validPaystackSignature(billingKey(env) || '', body, request.headers.get('x-paystack-signature') || '', 'live')) return new Response('Unauthorized', {status: 401});
  try {
    const event = JSON.parse(body);
    if (typeof event.event !== 'string' || !event.data || typeof event.data !== 'object' || Array.isArray(event.data)) return new Response('Invalid event', {status: 400});
    await billingEvent(env,event.event,event.data);
    return new Response('OK');
  } catch {return new Response('Verification unavailable', {status: 503});}
}
