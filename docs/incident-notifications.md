# Operations incident notifications

The independent GitHub monitor checks website availability, production automation
heartbeat and verified backup freshness approximately every fifteen minutes.
Two consecutive failed runs open one incident email to admin@triumphantech.com;
two healthy runs then send one recovery email. Continued failures produce no
reminders. Changes within an already-open incident do not generate extra emails.
Expect roughly 15–30 minutes for confirmation plus GitHub scheduling delays.

The private R2 object `alerts/production-state.json` is initialized once and stores
confirmation counters, the open incident and a pending notification. No customer
records or provider error bodies are included. Alert state has no daily backup
expiry rule. Never delete/reset it to clear a send error: that risks a duplicate.
Only the serialized `operations-monitor` workflow writes this state.

Pending event and payload are saved before sending. Resend receives a stable
idempotency key; provider acceptance is followed by a durable state update. An
unknown outcome or failed state save retries the same event, never a new key.
Automatic retries stop after 23 hours, before Resend's documented 24-hour
idempotency expiry, and require manual outcome reconciliation. See
[Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys).

## Release and delivery test

1. Store the existing production Resend sending key privately as Actions secret
   `OPERATIONS_RESEND_API_KEY`. Runtime keys and the customer platform are unchanged.
2. Initialize the R2 state from `initialState()` only while emails are disabled.
   If state already exists, preserve it. Storage failures must not be treated as
   empty state.
3. Merge verified code. Run the normal monitor with `OPERATIONS_EMAIL_ENABLED`
   unset/false first; it must not mutate alert state or send emails.
4. Obtain approval for exactly two clearly labelled synthetic emails (incident
   and recovery) to the fixed owner address. Temporarily set
   `OPERATIONS_EMAIL_TEST_APPROVED=true`, dispatch `Operations monitor` with
   `notification_test=true`, and promptly disable the test approval afterward.
   This drill does not simulate an actual outage or alter production alert state.
5. Confirm both messages arrived. Provider acceptance alone is not inbox proof.
   Set `OPERATIONS_EMAIL_ENABLED=true` for real incident/recovery sends, then run
   one healthy monitor and check that no email was needed.

To pause email, set `OPERATIONS_EMAIL_ENABLED=false`; health checks still run.
Paused runs do not advance notification state. Pending unknown events retain
their original timestamp and may require manual reconciliation after a long pause.
Do not replay them with a new key without checking the original provider outcome.

## Limits

These are infrastructure checks, not proof of successful customer conversations,
payment completion or inbox delivery. Total Cloudflare/R2-account failure prevents
durable incident state access, so email fails closed and the GitHub run fails.
GitHub or Resend outages can also stop notification delivery. Keep native GitHub
Actions failure notifications enabled as a separate signal; their inbox delivery
needs its own confirmation. No customer messages are replayed automatically.
