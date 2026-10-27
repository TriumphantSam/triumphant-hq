import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sendNotification, incidentNotifications, notificationDrill} from './incident-notifications.mjs';

test('delivery uses fixed owner, stable idempotency and accepts only confirmed provider responses', async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.OPERATIONS_RESEND_API_KEY;
  process.env.OPERATIONS_RESEND_API_KEY = 'synthetic-not-a-real-key';
  const pending = {id: 'incident-synthetic', kind: 'incident', at: '2026-10-27T20:00:00.000Z', checks: ['Public website']};
  try {
    globalThis.fetch = async (url, request) => {
      assert.equal(url, 'https://api.resend.com/emails');
      assert.equal(request.headers['Idempotency-Key'], pending.id);
      const body = JSON.parse(request.body);
      assert.deepEqual(body.to, ['admin@triumphantech.com']);
      assert.match(body.subject, /TEST/);
      return new Response(JSON.stringify({id: 'synthetic-provider-id'}));
    };
    assert.equal(await sendNotification(pending, true), 'synthetic-provider-id');
    globalThis.fetch = async () => new Response('{}', {status: 429});
    await assert.rejects(sendNotification(pending));
    globalThis.fetch = async () => new Response('{}');
    await assert.rejects(sendNotification(pending));
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPERATIONS_RESEND_API_KEY;
    else process.env.OPERATIONS_RESEND_API_KEY = originalKey;
  }
});
test('disabled notification path does not need state storage or send an email; drill requires explicit gate', async () => {
  const enabled = process.env.OPERATIONS_EMAIL_ENABLED;
  const approved = process.env.OPERATIONS_EMAIL_TEST_APPROVED;
  try {
    delete process.env.OPERATIONS_EMAIL_ENABLED;
    delete process.env.OPERATIONS_EMAIL_TEST_APPROVED;
    await incidentNotifications(['Public website']);
    await assert.rejects(notificationDrill(), /approval/);
  } finally {
    if (enabled !== undefined) process.env.OPERATIONS_EMAIL_ENABLED = enabled;
    if (approved !== undefined) process.env.OPERATIONS_EMAIL_TEST_APPROVED = approved;
  }
});
