import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialState, advance, acknowledged, notify, emailFor} from './incident-state.mjs';
const at = '2026-10-27T20:00:00.000Z';
const failed = ['Public website'];
function incident() { return advance(advance(initialState(), failed, at), failed, at, 'synthetic'); }

test('two failed checks open once, ongoing failures suppress duplicates, two healthy checks recover', () => {
  const first = advance(initialState(), failed, at);
  assert.equal(first.pending, null);
  let state = incident();
  assert.equal(state.pending.kind, 'incident');
  state = acknowledged(state);
  for (let n = 0; n < 10; n++) state = advance(state, failed, at);
  assert.equal(state.pending, null);
  state = advance(state, [], at);
  assert.equal(state.pending, null);
  state = advance(state, [], at);
  assert.equal(state.pending.kind, 'recovery');
  state = acknowledged(state);
  assert.equal(state.active, null);
  assert.equal(advance(advance(state, [], at), [], at).pending, null);
});
test('flapping resets confirmation counts and input is restricted to safe check names', () => {
  let state = advance(initialState(), failed, at);
  state = advance(state, [], at);
  assert.equal(advance(state, failed, at).pending, null);
  assert.throws(() => advance(state, ['customer@example.com'], at));
  assert.throws(() => advance({}, failed, at));
});
test('pending event and payload remain stable across retries and failed state writes', async () => {
  const state = incident();
  assert.deepEqual(advance(state, [], at), state);
  const ids = [];
  await assert.rejects(notify(state, {now: at, send: async pending => ids.push(pending.id), save: async () => {throw Error('storage unavailable');}}));
  const recovered = await notify(state, {now: at, send: async pending => ids.push(pending.id), save: async () => {}});
  assert.deepEqual(ids, ['incident-synthetic', 'incident-synthetic']);
  assert.equal(recovered.pending, null);
  assert.deepEqual(emailFor(state.pending), emailFor(state.pending));
});
test('unknown outcomes stop retrying before provider idempotency expires', async () => {
  let sends = 0;
  await assert.rejects(notify(incident(), {now: '2026-10-28T19:00:00.000Z', save: async () => {}, send: async () => sends++}));
  assert.equal(sends, 0);
});
test('provider failure leaves durable pending state available for retry', async () => {
  let saves = 0;
  await assert.rejects(notify(incident(), {now: at, send: async () => {throw Error('timeout');}, save: async () => saves++}));
  assert.equal(saves, 0);
});
