# Company WhatsApp acceptance — 8 November 2026

Status: connected in staging; inbound/outbound receipt confirmed by owner;
handover and resume checks pending. Production customer rollout is not approved
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

Restore any temporary phone-app setting by agreement at completion. Do not change
real business availability merely to force an in-hours FAQ test. Protect the
existing campaign number and Worker. Customer onboarding, templates, STOP,
FAQ/AI matching and production release retain their own acceptance gates.
