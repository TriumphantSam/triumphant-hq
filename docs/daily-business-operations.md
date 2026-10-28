# Daily business operations

Today is a private work view for the owner and accepted staff. It shows new
enquiries, confirmed appointments starting in the next 24 hours, paused rehearsal
and WhatsApp conversation counts, and whether autoresponders were reviewed and
enabled. Paused is not described as unanswered or delivered.

Internal follow-ups can be attached to enquiries, bookings, private rehearsals or
stored WhatsApp conversations. They have a Lagos due time, optional current team
member and a private note. One follow-up exists per source record. Saving a
completed follow-up explicitly reopens it. Completing it does not alter enquiry
status, cancel a reservation, send a message or resume automation.

The Today queue defaults to work assigned to the viewer plus unassigned work.
Removed team members' work appears effectively unassigned so it is not lost.
The all-team view is available to accepted members. Up to 50 open follow-ups are
shown earliest due first, with a truncation notice when more exist. Refresh is
manual, with the last update time shown; no push notifications are promised.

Follow-up controls are inside enquiry/booking records and the conversation's team
details. Today can inspect and edit each listed follow-up with its source context.
Inbox and conversation links open their existing lists, not a promise of an
unbounded record search. Existing list/export limits still apply.

## Permissions and safety

`operations.read` and `followup.read/save/complete` require current workspace
membership. The source must belong to that workspace. Assignment validity is
checked inside the write, and version comparisons reject stale edits/completion.
Due times must be canonical ISO timestamps within one year of the current time;
notes are limited to 1,000 characters. No provider API is called by these actions.

Removed source records are excluded from the active queue and cannot be read or
modified through follow-up RPC. Their private metadata is not automatically
deleted; coordinate its cleanup with any future approved record-deletion rollout.
There is no new purge endpoint or automatic customer-data deletion.

Unknown in-hours questions now pause non-AI rehearsal automation after giving its
fallback, matching the existing WhatsApp handover behavior. Further customer
messages do not receive automated replies until a member explicitly resumes.
Outside-hours replies and disabled responders retain their existing behavior.
Saving staff rehearsal replies no longer forces navigation back to Inbox.

## Release and acceptance

This change depends on PR #39 and transitively PR #38. Apply additive migration
0024 after 0023, deploy the staging automation Worker, then publish the preview.
Preserve billing acceptance overrides and keep live billing/customer release off.
The protected legacy WhatsApp Worker and its existing number are untouched.

Use a synthetic rehearsal to save a private follow-up, verify it appears in Today,
mark it complete and confirm the original conversation remains unchanged. Do not
send customer messages or start new bookings/payments during this acceptance.
