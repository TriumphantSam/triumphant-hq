import {randomUUID} from 'node:crypto';

export const checkNames = ['Public website', 'Production automation heartbeat', 'Verified production backup age'];
export function initialState() {
  return {version: 1, failures: 0, successes: 0, active: null, pending: null};
}
export function advance(state, failures, now, id = randomUUID()) {
  if (state?.version !== 1 || !Number.isSafeInteger(state.failures) || state.failures < 0 || !Number.isSafeInteger(state.successes) || state.successes < 0 || !Object.hasOwn(state, 'pending') || !Object.hasOwn(state, 'active')) throw new Error('Invalid incident state.');
  if (state.pending && (!['incident', 'recovery'].includes(state.pending.kind) || typeof state.pending.id !== 'string' || !/^[a-zA-Z0-9-]{1,200}$/.test(state.pending.id) || !Number.isFinite(Date.parse(state.pending.at)) || !Array.isArray(state.pending.checks) || state.pending.checks.some(name => !checkNames.includes(name)))) throw new Error('Invalid pending notification.');
  if (state.active && (typeof state.active.id !== 'string' || !/^[a-zA-Z0-9-]{1,150}$/.test(state.active.id))) throw new Error('Invalid active incident.');
  if (failures.some(name => !checkNames.includes(name))) throw new Error('Unknown health check.');
  const next = structuredClone(state);
  if (next.pending) return next;
  next.failures = failures.length ? next.failures + 1 : 0;
  next.successes = failures.length ? 0 : next.successes + 1;
  if (next.failures >= 2 && !next.active) {
    next.active = {id, openedAt: now, checks: [...failures]};
    next.pending = {id: `incident-${id}`, kind: 'incident', at: now, checks: [...failures]};
  } else if (next.successes >= 2 && next.active) {
    next.pending = {id: `recovery-${next.active.id}`, kind: 'recovery', at: now, checks: []};
  }
  return next;
}
export function acknowledged(state) {
  const next = structuredClone(state);
  if (!next.pending) throw new Error('No pending notification.');
  if (next.pending.kind === 'recovery') next.active = null;
  next.pending = null;
  next.failures = 0;
  next.successes = 0;
  return next;
}
export function emailFor(pending, drill = false) {
  const prefix = drill ? '[TEST — no live incident] ' : '';
  const title = pending.kind === 'incident' ? 'TriumphantTech operations need attention' : 'TriumphantTech monitored services recovered';
  return {
    from: 'TriumphantTech <hello@notify.triumphantech.com>',
    to: ['admin@triumphantech.com'],
    subject: prefix + title,
    text: `${prefix}${title}\n\nObserved at: ${pending.at}\n${pending.kind === 'incident' ? 'Checks requiring attention:\n' + pending.checks.join('\n') : 'The website, automation heartbeat and verified backup age passed two consecutive checks.'}\n\nOpen GitHub Actions → Operations monitor for details. These checks do not prove customer message delivery. No customer records or messages are included.`,
  };
}

export async function notify(state, {now, save, send}) {
  if (!state.pending) return state;
  // Provider idempotency expires after 24h. Stop before that boundary instead of
  // risking a duplicate after an unknown outcome or a failed state write.
  const age = Date.parse(now) - Date.parse(state.pending.at);
  if (!Number.isFinite(age) || age < 0 || age >= 23 * 3600000) throw new Error('Notification outcome requires manual review.');
  await send(state.pending);
  const next = acknowledged(state);
  await save(next);
  return next;
}
