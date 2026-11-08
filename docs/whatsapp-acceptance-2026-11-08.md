# Company WhatsApp acceptance — 8 November 2026

Status: connected in staging; inbound/outbound receipt confirmed by owner;
platform handover, pause and resume checks passed. Production customer rollout is not approved
by this evidence.

The owner supplied Meta approval screenshots for messaging and management.
The dashboard was inspected and showed both approved and the app Published.
Embedded Signup Builder offered WhatsApp Business App Onboarding, ES v4 and
session info v3. Commit `42d8c8b` aligns the website launch with that option,
defaults existing-app onboarding on, restricts session origins to explicit Meta
origins and removes the obsolete pending-review copy. Staging workflow
`42451104956` passed; local TypeScript and targeted component lint passed.

The owner completed the phone-app QR and final sharing consent. Workspace
`96845119-ee82-43bd-b080-d023fab18e69` (TriumphantTech Staging Test) reports
connected, with `is_on_biz_app=1`. Scoped D1 inspection confirmed that state.
No token, QR, access code, customer phone or private chat history is retained here.

The owner sent a consultation-hours question from their test recipient and
supplied a screenshot showing the platform welcome and outside-hours answer.
The platform's saved away message matches the received hours text. It was Sunday
outside the configured weekday hours: this is transport/away-responder evidence,
not a successful FAQ-selection or AI-quality test. Workspace AI matching is off.
The additional long away message is absent from platform settings and appears to
be the phone-app away responder. The owner was asked to temporarily disable it,
noting the old setting for restoration.

Baseline thread `0389a8f4-ae4f-4457-9281-7ca02f7c2eb2` had one inbound customer
event, no platform team reply, paused=0 and version=0. Next, the owner sends HUMAN.
The implementation pauses without sending an automatic acknowledgement. Verify
paused state, a platform inbox team reply, no automation while paused, explicit
resume and a subsequent automatic response. Do not infer platform takeover from
a reply sent directly in the phone app; that coexistence behaviour needs separate
verification.

## Handover and resume evidence

Both owner-sent HUMAN messages reached the platform. Scoped D1 inspection showed
paused=1/version=1 and no platform automation reply after them. The owner then
sent the staff takeover test through the workspace and confirmed receipt on the
test WhatsApp. D1 recorded an outgoing team event at 11:44:33 UTC and the thread
remained paused=1/version=2. The phone-app away reply after the first HUMAN was
visible in the owner's screenshot; the second HUMAN showed no such reply.

The owner tested further messages while paused, then explicitly resumed through
the workspace and sent the hours question again. Their screenshot shows no reply
to the 16:35 WAT question and the expected away response to the 16:36 question.
D1 confirmed paused=0/version=3, customer events at 15:30, 15:32 and 15:35 UTC
without an intervening platform automatic event, followed by customer and
automation events at 15:36:27 UTC. This confirms platform pause suppression,
staff delivery and resumed outside-hours delivery for this test conversation.
No new message was sent by the operator. FAQ/AI quality and STOP remain untested
in this exercise; direct phone-app team replies are not certified as takeover.

Restore any temporary phone-app setting by agreement at completion. Do not change
real business availability merely to force an in-hours FAQ test. Protect the
existing campaign number and Worker. Customer onboarding, templates, STOP,
FAQ/AI matching and production release retain their own acceptance gates.
