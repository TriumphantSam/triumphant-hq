# Customer platform acceptance — 28 October 2026

## Decision

The current staged build passes the automated regression suite and the selected
authenticated owner journeys below. This completes the verification pass for the
current build phase. It is **not approval to launch paid customer onboarding**.
Real WhatsApp onboarding/delivery, live billing, customer-site installation and
an unassisted new-customer pilot remain release gates.

## Build under test

- Source: `85cad8714278c39fcbf271d81cc9c22909882f45` (PR #41), including
  subscription lifecycle #38, guided setup #39 and daily operations #40.
- Website: `https://triumphant-hq-web-preview.triumphantsam30.workers.dev`.
- Hosted Linux build/deploy: GitHub Actions run **40651384505**, passed.
- Backend: staging Worker version **1c31ca22-36eb-458f-83df-ec8c7ffd46c5**.
- Staging schema includes migration 0024. This acceptance report adds no schema.
- Final fresh regression: **114 Worker + 15 website + 9 Cloudflare tests passed**.
  Worker TypeScript and frontend type/lint checks also passed in this build phase.
- No production deployment or merge is implied. PRs #38–41 remain open and ready
  for review, in that dependency order. Older draft #35 is separate, not silently
  approved or closed by this report.

## Acceptance matrix

| Area | Evidence in this pass | Result / limit |
| --- | --- | --- |
| Identity and isolation | Fresh automated OTP/hash/session revocation, verified RPC, unrelated-workspace isolation and staff restrictions; existing owner session survives reload in browser | Pass for automated contract and returning-owner flow; no new email-code delivery was requested |
| Business preparation | Browser retained service/both-channel choices; after reviewing appointment rules, setup displays 6/6 required steps | Pass; preparation is separate from live release |
| Appointment policy | Corrected staging buffer from earlier test value 20 to requested 15; weekdays 10–16 Lagos, 30-minute duration, 24-hour notice retained; UI confirmed saved | Pass for saved configuration; no reservation or notification created |
| FAQ and assistant | Fresh automated scoped answers, ambiguous/unknown rejection, AI grounding, usage/idempotency | Pass in test environment; no claim of real customer conversation delivery |
| Enquiries and bookings | Fresh automated tenant isolation, retry-safe capture, simultaneous-slot conflicts, policy changes and private cancellation | Pass automated; no new live customer booking or email in this pass |
| Subscription lifecycle | Browser shows Starter test access, renewal stopped, 500 replies/20 FAQs, existing paid period retained until 21 Nov 2026 21:33 WAT; fresh expiry/ledger/reconciliation/idempotency tests | Pass test-mode contract; no new checkout, renewal or live charge |
| Staff onboarding | Browser shows owner only, zero pending invites; fresh accepted-recipient, removal, capacity, invitation/history and staff-permission tests | Pass automated and cleanup observation; no fresh second-user sign-in in this pass |
| Daily work | Authenticated save → assigned task appears in Today → completion removes it; rehearsal retains six messages and team control; fresh assignment/version/isolation tests | Pass; completed synthetic follow-up remains as metadata, no open test task |
| Exports and retention | Browser shows bounded CSV tooling and saved retention Off / deletion disabled; fresh scope/date/formula/size and non-destructive retention tests | Pass automated/UI; earlier real CSV download was not repeated |
| Owner support | Separate admin login confirmed; exact test-business diagnostics shows verified Starter versus saved Growth choice, effective allowance and launch blockers; unsigned backend admin request returns 401 | Pass read-only diagnostics; no customer impersonation or messages exposed |
| Deployment protection | Hosted preview build/tests pass; customer-release and live-billing flags remain false in staging deployment output | Pass staged gate configuration; no production release claim |

The prior same-day support screenshot showed preparation 5/6 before the final
appointment review. The final setup screenshot shows the resulting 6/6. Both
are valid sequential observations, not competing readiness claims.

## Outstanding launch requirements

1. Review/merge the dependency stack and apply production migrations/deploy the
   appropriate backend and website under a separate release instruction. Keep
   customer access disabled until channel/billing acceptance is approved.
2. Resume deferred WhatsApp work: confirm actual Meta permissions, complete
   customer Embedded Signup/number eligibility and coexistence, then verify
   inbound/outbound delivery, templates, STOP and human handover on the intended
   company/customer number. Leave the legacy WhatsApp Worker untouched.
3. Complete live subscription acceptance with explicit authorization and final
   commercial terms; test payment recovery, cancellation and duplicate callbacks
   against actual provider behavior. Test credit is never live entitlement.
4. Install and exercise the selected website assistant on an actual pilot
   customer's allowed domain. Earlier synthetic cross-site evidence does not
   certify every customer's installation.
5. Run one fresh, unassisted customer journey: account verification → business
   setup → colleague acceptance → chosen channel → enquiry/booking → handover →
   verified subscription and cancellation. Staff test access must be removed
   afterward. This returning-owner review is not that pilot.
6. Review customer terms/privacy/subprocessors, support/refunds and measured NGN
   plan costs before selling access. Incident emails previously arrived in Spam;
   inbox placement remains an operational limitation. Recheck backup/restore and
   alert health before launch; no outage/restore or new email drill was repeated.

## Retained evidence and cleanup

Local ignored evidence under this worktree's `tmp/`:
`final-web-tests.log`, `final-cloudflare-tests.log`, `final-worker-tests.log`,
`daily-work-accepted.png`, `owner-support-accepted.png`,
`final-acceptance-setup.png`. These are local artifacts, not GitHub attachments.
Do not assume they exist on another machine.

No new customer-facing message, charge, invitation, booking, deletion or channel
connection was made in this final pass. The only configuration write restored
the agreed staging appointment buffer and recorded its review. Temporary staff
access/invitations are absent; retention remains off; the legacy sender and
production configuration are unchanged.
