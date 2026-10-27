import {spawnSync} from 'node:child_process';
import {mkdtempSync, readFileSync, writeFileSync, rmSync, rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {advance, initialState, notify, emailFor} from './incident-state.mjs';

const wrangler = process.env.WRANGLER_PATH || fileURLToPath(new URL('../../node_modules/wrangler/bin/wrangler.js', import.meta.url));
export async function sendNotification(pending, drill = false) {
  if (!process.env.OPERATIONS_RESEND_API_KEY) throw new Error('Incident email credential unavailable.');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST', signal: AbortSignal.timeout(20000),
    headers: {Authorization: `Bearer ${process.env.OPERATIONS_RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': pending.id},
    body: JSON.stringify(emailFor(pending, drill)),
  });
  if (!response.ok) throw new Error('Incident email acceptance was not confirmed.');
  const result = await response.json();
  if (typeof result.id !== 'string' || !result.id) throw new Error('Incident email acceptance was not confirmed.');
  return result.id;
}

export async function incidentNotifications(failures) {
  if (process.env.OPERATIONS_EMAIL_ENABLED !== 'true') return;
  const directory = mkdtempSync(join(tmpdir(), 'triumphant-incident-'));
  const path = join(directory, 'state.json');
  const object = 'triumphant-hq-backups/alerts/production-state.json';
  function command(args) {
    const result = spawnSync(process.execPath, [wrangler, ...args], {encoding: 'utf8', timeout: 60000});
    if (result.status !== 0) throw new Error('Incident state storage unavailable; no email attempted without durable state.');
  }
  async function save(state) {
    writeFileSync(path, JSON.stringify(state), {mode: 0o600});
    command(['r2', 'object', 'put', object, '--remote', '--file', path]);
  }
  try {
    // Fail closed on missing or unreadable state. Deployment initializes it once;
    // never silently reset it, which could repeat an already accepted alert.
    command(['r2', 'object', 'get', object, '--remote', '--file', path]);
    const now = new Date().toISOString();
    const state = advance(JSON.parse(readFileSync(path, 'utf8')), failures, now);
    await save(state); // persist stable event/idempotency key before the first send
    const pending = Boolean(state.pending);
    await notify(state, {now, save, send: sendNotification});
    console.log(pending ? 'Incident notification accepted; inbox delivery is not yet confirmed.' : 'Incident state checked; no notification needed.');
  } finally {
    rmSync(path, {force: true}); rmdirSync(directory);
  }
}

// Explicit synthetic delivery drill: no production health state or live incident
// is changed. It sends two clearly labelled emails only after separate approval.
export async function notificationDrill() {
  if (process.env.OPERATIONS_EMAIL_TEST_APPROVED !== 'true') throw new Error('Delivery drill approval is required.');
  const now = new Date().toISOString();
  const id = `drill-${process.env.GITHUB_RUN_ID || crypto.randomUUID()}`;
  let state = advance(advance(initialState(), ['Public website'], now), ['Public website'], now, id);
  const send = pending => sendNotification(pending, true);
  state = await notify(state, {now, save: async () => {}, send});
  state = advance(advance(state, [], now), [], now);
  await notify(state, {now, save: async () => {}, send});
  console.log('Synthetic incident and recovery emails accepted. Confirm inbox receipt separately.');
}
