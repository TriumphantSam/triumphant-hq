# Shared business assistant and website simulator

This release adds a channel-independent conversation engine, a website simulator
at `/automation-lab/assistant`, and read-only owner commands inside `/admin`.
It extends the existing Cloudflare Workers AI and Next.js stack. It does not
activate the Meta company number or introduce a banking, order or invoice system.

## Customer journey

Start a session after the existing security check. Ask about approved business
facts, consultation availability, the test payment demonstration or a team
handoff. A conservative router handles high-confidence requests; Workers AI
classifies remaining questions into an allowlisted intent and approved fact IDs.
The server composes the answer. No model-generated URL, SQL, code, amount or
authorisation is executed. Dates and time-of-day requests filter real available
slots; dates outside the bookable schedule return no availability.

Selecting a numbered slot creates a five-minute preview. Continuing rechecks
availability and opens the existing real booking form with the chosen time.
It does not reserve a slot. The customer supplies contact details, channel
permissions and final booking confirmation through the existing booking workflow.
The form reloads availability and the booking backend retains its atomic capacity
and request-id checks. A cancellation of a preview has no business side effects.

Human handoff has the same review step. Continuing opens the existing enquiry
form and pauses automated conversation. The form explicitly explains storage
and queued customer/owner emails; no alert is sent before it is submitted.
STOP and RESUME pause/resume this simulator only; they do not change external
WhatsApp or SMS subscriptions. Text is the only accepted input.

## Owner commands

The existing signed-in owner workspace contains a separate owner-mode component.
The Next.js gateway verifies the HttpOnly owner cookie on every start and turn,
then derives a scope-specific actor digest. A public request cannot select owner
mode without that session. Worker routes require the existing server HMAC and
bind the conversation to its scope and actor digest.

Current commands are new-enquiry counts across all dates, tomorrow's confirmed
consultation count, and today's enquiries/consultation counts in Lagos time.
Responses are generated directly from aggregate database queries. No customer
names, emails, phone numbers, private notes or management codes are provided to
the AI model. Reporting includes test records and never labels operational counts
as live sales, stock or revenue. Record changes and outbound commands are absent.

## Transport contract and persistence

The browser sends `mode`, `action`, session `token`, expected `version` and a
UUID `requestId`. For a turn it sends one short message or an explicit
`decision` and `pendingId`. Browser-supplied roles, actor keys and arbitrary
tool arguments are never forwarded. The gateway supplies the trusted scope and
actor digest to `/v1/assistant/start` and `/v1/assistant/turn`.

Migration `0006_assistant.sql` adds only `assistant_sessions`. Tokens are stored
as HMAC digests. Sessions expire after an hour and allow twenty turns; session
starts are capped per actor. The shared daily provider budget is the existing
100-call chat budget. Session state stores offered times, pending navigation,
selected fact IDs and pause state. It does not retain raw customer messages or
contact details. The latest response is cached for a transport retry. Expired
sessions are removed by the existing cron retention task.

An atomic version/lease update serialises turns. A repeated latest request gets
the same cached answer without another AI call. A different stale request fails
with 409. A crashed process may leave its session requiring a restart; it cannot
create duplicate bookings, charges or messages because the conversation engine
only reads records and prepares reviewed navigation. Final forms remain separate
idempotent workflows. The UI preserves a failed request ID for explicit retry and
offers session restart for expired/conflicting sessions.

## Connecting WhatsApp later

The pure `assistantTurn` engine accepts trusted scope, server state and injected
operations. A future inbound adapter must validate Meta signatures through the
identified WhatsApp Worker, deduplicate provider message IDs, derive the customer
actor from the verified sender and maintain session state. It must not accept an
owner claim from message text or caller-supplied phone fields. Real owner access
over WhatsApp needs its own approved identity/enrolment design; the website owner
cookie is not WhatsApp authentication.

Adapt replies to allowed message types and map review buttons to exact pending
IDs. Do not bypass the final booking/enquiry approval or infer marketing consent
from a conversation. Verify company-number onboarding/coexistence, templates,
conversation-window rules, delivery handling, opt-outs and human pause behaviour
before enabling the real channel. No outbound WhatsApp adapter is enabled here.

## Release and verification

Apply `0006_assistant.sql` in the intended environment before deploying the new
Worker. The migration is additive; a code rollback can retain the empty/new table.
Deploy and test staging first. Website production must not point to this new route
until the matching production Worker and migration are ready.

Tests cover scope isolation, actor/session expiry, version conflicts and retries,
taken/expired/changed previews, ambiguous yes, pause/resume, safe fact IDs, date
filtering and aggregate-only owner answers. Preview-path tests assert zero new
bookings, leads, payment records or outbound jobs. Existing booking tests cover
the separate reservation, cancellation and reminder behaviours.

Remaining product work: actual WhatsApp transport/activation, structured orders
and live invoice workflows, voice/image processing, additional tested languages,
staff roles and write commands, and separate client deployments/onboarding.
The reference deployment remains a single business, not a multi-tenant platform.

### Verification record

The full Worker suite passed 48 tests. All 14 assistant tests were rerun after
the final routing refinements and passed; Worker type checking also passed.
The existing 12 website automation tests, root TypeScript check, targeted ESLint
and a full Next.js production build passed. The new page and API route appeared
in the build output.

Staging migration 0006 was applied, and Worker version
`762257b7-1257-4798-ab48-a401f4d960df` was deployed. Six hybrid conversation
checks passed against staging, including a real Workers AI SEO answer. They
covered natural Friday-afternoon availability, approved pricing, human handoff,
test-checkout navigation and refusal of a bank-transfer request. Slot selection,
confirmation, retry reuse, customer/owner separation and aggregate owner queries
also passed. No test submitted a business booking, enquiry or outbound message.

Local website-to-staging gateway checks returned 401 for missing/forged owner
sessions, 403 for a missing Origin, 200 for an authenticated read-only owner query,
and 401 for switching a token into another scope. In the browser a natural
Friday-afternoon request displayed real times, a chosen time required review,
and continuing opened the existing booking form with that date and radio option
selected. The test stopped before final reservation. A 390px mobile viewport
had no horizontal overflow. Floating chat launchers are omitted on the simulator
so they do not cover the conversation controls.

Local testing used staging credentials and a process-only test clock correction
for the workstation's approximately 72-second drift from Cloudflare. The operating
system clock, production verification window and production Turnstile settings
were unchanged. Local security checks were not a production CAPTCHA test.
Browser extension attributes caused a development hydration warning outside the
conversation component; this is not claimed as a clean production-console check.

Production promotion and real WhatsApp activation are separate release steps.
