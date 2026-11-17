# Customer pilot acceptance scorecard

Prepared 29 October 2026. Status: **owner rehearsal in progress; feedback fixes verified on staging**.
Live Paystack acceptance is deferred to the final checklist item at the owner's
request. WhatsApp delivery remains a separate permission/onboarding gate.

## Session record

- Participant role: returning owner (first rehearsal).
- Instructions: `customer-pilot-tasks.md`.
- Business ID / session start / finish: pending.
- Environment: Cloudflare staging only.
- No invitation or outbound test-message authorization in this session.

| Task | Result | Minutes | Help given / observed problem | Evidence |
| --- | --- | --- | --- | --- |
| Sign in and create separate business | Pending | — | — | — |
| Save website/appointment choices and FAQs | Pending | — | — | — |
| Save correct booking policy | Pending | — | — | — |
| Rehearse approved and unknown answers | Pending | — | — | — |
| Understand installation and launch blockers | Pending | — | — | — |
| Find records, usage and support | Pending | — | — | — |
| Understand trial and paid-plan boundaries | Pending | — | — | — |

Record navigation hints as assistance; once a hint is given, that task is not
unassisted. A researcher completing it is a functional check, not a usability pass.
User-reported outcomes and independently inspected saved state must be identified
separately. Do not convert "could find it" into proof of successful persistence.

## Criteria

Rehearsal succeeds when saved business facts and booking policy match the brief,
the participant distinguishes preparation from live activation, and no accidental
charge, publication or channel connection occurs. Any mistaken entitlement,
exposed other-business record or unintended external action blocks release.
Log confusing labels and recoverable dead ends for repair; do not invent a
completion rate or promise a setup time from a single returning-owner session.

The independent pilot still needs a genuinely new participant, following the
same tasks without coaching, on a fresh eligible account. It also needs explicit
authorization and separate evidence for colleague invitation/acceptance/removal,
installation on their actual allowed domain, synthetic enquiry and booking with
cancellation, and any real channel delivery. The synthetic cross-site acceptance
on 28 October is supporting technical evidence, not this customer's installation.
Live subscription/refund/cancellation is tracked separately at the end.

## Cleanup and follow-through

Check that the rehearsal business is unpublished, website embedding disabled and
no temporary staff invitations remain. Preserve synthetic evidence with its
workspace ID. Assign each blocker an issue, owner and retest result. Do not mark
the independent pilot passed until observed outcomes and cleanup are complete.

## First rehearsal feedback and retest, 29 October

The owner created Demo Studio Rehearsal and reported difficulty returning from
Business to Setup, unclear appointment-save feedback and the website publication
prerequisite. These are observed usability problems, not a completed pilot.

Commit `48874b0` adds the checklist return control, unsaved-edit warning, saved
appointment summary and Website → Launch guidance. Hosted staging workflow
`40798627416` passed its web/Worker tests, build, deployment and route check.
Local TypeScript and targeted component lint also passed.

Browser retest confirmed Business → Setup navigation and a saved Monday–Friday
10:00–16:00 WAT schedule, 30-minute appointments, 15-minute buffer and 24-hour
notice. Changing the buffer draft to 20 kept the saved summary at 15, marked
unsaved edits, and returning prompted before discarding. Cancelling the prompt
kept the draft; the operator restored it to 15 without saving. Website showed
the unpublished prerequisite, disabled embedding and offered Go to Launch.
No publication, payment, invitation or WhatsApp connection occurred in this retest.

The operator retest is assisted functional evidence. The remaining task outcomes,
independent participant session and live-channel gates remain open. Language and
typo quality are tracked separately in `platform-language-plan.md`.
