# Booking phone notifications

The SMS and WhatsApp adapters are implemented but both production flags remain false. Existing bookings default to no phone consent. Turning on a channel does not enrol old bookings. Email continues independently. No phone message was sent during preparation; provider tests use mocks.

## Termii activation

Create the account when ready, obtain the account's HTTPS API base URL, fund a small test balance, request an approved sender ID (3–11 alphanumeric characters), and have Termii enable the transactional DND route. Generic is promotional and is deliberately not used for appointment messages. Termii documents the [messaging route](https://developers.termii.com/messaging-api) and [sender registration](https://developers.termii.com/sender-id).

In triumph-automations-production, store TERMII_API_KEY as a secret. Store TERMII_API_BASE, TERMII_SENDER_ID and TERMII_DND_APPROVED=true as nonsecret settings after their approval is verified. The base must be an HTTPS origin under termii.com or termii.ai. Keep BOOKING_SMS_ENABLED=false until one controlled delivery test is authorized and the activation checks pass. Set equivalent staging values separately; do not copy production keys into source.

## WhatsApp activation

Wait for the required Meta approvals, confirm Coexistence eligibility and connect the company number +2349090090910. Do not use the existing UK phone ID as the booking sender. The adapter checks the configured phone ID's actual display number before every drain and refuses any number other than the company number.

Store BOOKING_WA_ACCESS_TOKEN as a separate secret, then configure BOOKING_WA_PHONE_NUMBER_ID and the currently supported BOOKING_WA_GRAPH_VERSION. Configure BOOKING_WA_TEMPLATE_LANGUAGE (defaults to en; must match the approved template) and BOOKING_WA_CONFIRMATION_TEMPLATE, BOOKING_WA_REMINDER_TEMPLATE, BOOKING_WA_CANCELLATION_TEMPLATE. Keep BOOKING_WHATSAPP_ENABLED=false until the templates, sender ownership, STOP bridge and controlled real delivery are verified.

Submit templates as appointment updates without promotional content. Each body has two positional text parameters: customer name and appointment date/time in Lagos. Suggested bodies:

- Confirmation: "Hi {{1}}, your TriumphantTech automation consultation is confirmed for {{2}} WAT. Joining and management details are in your confirmation email. Reply STOP to stop WhatsApp booking updates."
- Reminder: "Hi {{1}}, this is a reminder of your TriumphantTech automation consultation at {{2}} WAT. Use your confirmation email to manage the appointment. Reply STOP to stop WhatsApp booking updates."
- Cancellation: "Hi {{1}}, your TriumphantTech automation consultation at {{2}} WAT has been cancelled. Reply STOP to stop WhatsApp booking updates."

These are drafts, not approved templates. Metadata and language must match the final Meta approval. Phone consent covers this appointment, separately from marketing consent. RESUME restarts the bot only; it does not restore revoked booking consent.

## Delivery behavior

BOOKING_SMS_DAILY_LIMIT and BOOKING_WA_DAILY_LIMIT cap provider send attempts separately per Lagos calendar day (default 50 each). Deferred jobs retain their queue state; elapsed appointments are suppressed. Confirm a suitable test budget before raising these limits or enabling a channel.

The same atomic booking batch stores explicit phone choices, consent time and channel jobs. Unique booking/channel/kind keys prevent duplicate scheduling. Customers can stop phone notifications through their private management code without cancelling the booking; signed WhatsApp STOP events revoke WhatsApp booking consent for that phone and cancel pending WhatsApp jobs.

The outbox records provider acceptance and its message ID, not inbox/handset delivery. Delivery receipt webhooks or status reconciliation must be added and verified before advertising handset delivery tracking. A 429 rejection may be retried with backoff; network errors, 5xx responses, malformed success responses and expired sender leases are marked unknown and require review. They are never blindly replayed. Pending reminders and confirmations are suppressed after the appointment or cancellation. Already accepted messages cannot be recalled.

The existing WhatsApp Worker's signed STOP bridge uses /v1/whatsapp/notification-optout and the existing dedicated bridge secret. The automation endpoint must deploy before that Worker update. No account creation, template submission, sender activation or charge is performed by deploying this preparation.
