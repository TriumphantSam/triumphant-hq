# Selected-contact WhatsApp testing

17 November 2026. Backend deployed to staging; matching website preview pending.
Payments remain deferred. No real WhatsApp message is authorised by this file.

All 132 backend tests passed, including seven targeted WhatsApp cases. Worker
and website type-checks and targeted React lint passed. Local Wrangler still
resolves to the unrelated IAPrecision account after the login attempt. The
staging-only repository workflow instead used the existing scoped Cloudflare
deployment and D1 credentials without extracting their values.

Backend workflow [44065976158](https://github.com/TriumphantSam/triumphant-hq/actions/runs/44065976158)
passed for `d0d04c9`, including 132 backend tests and five release-check tests.
Migration 0028 applied to staging, and Worker version
`4f5e7bb7-01a1-4886-8d51-f5f3443918e0` deployed. Direct database post-checks
confirmed the company stays connected, automatic/AI replies are off and
selected-contact testing is off. Signed operations returned 200, unsigned 401,
and heartbeat was healthy. Overall operations still reports an unrelated
existing delivery-queue warning; no retry or message send was initiated.
Production and live billing were untouched. No real WhatsApp test was run.

## Behaviour

The connected WhatsApp Business app stays connected. Testing defaults to off,
including existing workspaces with no settings row. An owner can save up to five
international test numbers and explicitly confirm that they control the numbers
or have agreement for the test. Saving the list sends nothing and does not turn
on the separate automatic-replies switch or resume any thread.
If automatic replies are already on and the chat is unpaused, subsequent incoming
messages from a newly enabled selected contact can receive a reply immediately.

With testing off, the platform ignores new incoming chat messages and blocks team
sends. With testing enabled, it accepts messages only from the selected numbers.
It checks the sender before storing a thread/message or invoking AI/quota logic.
Messages from other contacts remain outside this workspace's new ingestion;
previously stored records are not deleted. The incoming HTTP webhook is still
acknowledged normally after signature verification.

Before an automated send, the guard rechecks the selected recipient, settings
version and global responder switch. It rechecks before each outgoing message,
so revoking access stops subsequent sends. An already accepted or in-flight Meta
API request cannot be recalled. Team sends also check contact permission. Existing
STOP, team takeover, opening hours, subscription limits and global off controls
continue to apply to the selected contacts.

Reconnect and disconnect reset test access to off and clear selected contacts.
Only owners can read/edit the full test-number list. Staff see aggregate status
and whether an existing thread is eligible for sending. The protected legacy
campaign number/Worker and phone-app greeting/away settings are unchanged.
Other connected services are outside this guard.

## Setup when ready for a separately authorised test

1. Leave Autoresponders off during setup.
2. Inbox → Selected WhatsApp test contacts: enter the other test account's number
   using country code (for example +234…), not the connected business number.
3. Confirm test permission, choose selected-contact testing and save.
4. Check the saved scope and count. A per-chat Resume button is not the global
   reply switch or the selected-contact switch.
5. Enable automatic replies and resume only the intended test chat when an
   actual delivery test has been authorised. Verify normal contacts remain
   outside ingestion and receive no platform response.
6. After the exercise, switch off automatic replies and testing. Reload to
   confirm both saved states. Do not change payment or phone-app settings.

## Deployment and rollback

Apply additive migration `0028_whatsapp_test_contacts.sql` before deploying the
backend. Missing settings rows are off; no test contacts are prefilled. Deploy
the backend before the owner UI so protection is enforced by the server. UI
errors or a missing summary are not proof that this guard is active.

Do not roll back to a pre-guard backend while automatic replies are on: that code
does not enforce the selected list. First verify the global responder switch is
off for connected workspaces, then roll back if needed. Keep the additive table;
do not delete old chats as part of rollback. No production activation is part of
this staging increment.

Validation covers default-off, unrelated sender exclusion, owner/staff/business
isolation, international-number validation, consent, stale saves, reconnect reset,
global-off preservation, blocked team sends and revocation between sends. Mocked
provider calls do not prove live delivery; no real delivery test has been run.
