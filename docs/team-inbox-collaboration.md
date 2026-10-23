# Conversation assignment and internal notes

Owners and current staff can open **Team details** on a rehearsal conversation
or live WhatsApp thread. Choose a current member (or Unassigned) and save the
assignment. Assignment records responsibility; it does not change automation,
grant exclusive reply permission or send a customer message. Use the existing
Pause/Resume automation buttons for handover.

Internal notes are shared with that business's owner and staff. They contain an
author label and Lagos timestamp, are limited to 2,000 characters each and 200
notes per conversation, and cannot currently be edited or deleted. Do not put
credentials in notes. Refresh team details to see another colleague's changes;
this increment does not add realtime updates or notifications.

## Access and concurrency

Every collaboration request checks current workspace membership and confirms
the thread belongs to that workspace and channel. Staff do not gain owner
settings or team-administration permissions. Assignment uses a separate version
counter, rejecting stale writes and non-member assignees. Removing a member
automatically clears their assignments and advances that counter. Existing notes
retain their authorship after membership removal.

Note request IDs prevent duplicate notes on retry. Notes and assignment metadata
are separate from rehearsal messages and live WhatsApp events. A note does not
consume an assistant reply, pause automation or invoke Meta's API. No token is
needed for these operations.

## Release

Migration `0016_platform_collaboration.sql` must be applied before deploying the
Worker/UI increment. Production activation is separate from staging acceptance.
The branch builds on the WhatsApp review evidence branch; review that dependency
before merging. Meta App Review was submitted by the owner on 23 October 2026;
external customer onboarding remains gated by its outcome.

Local verification: all 86 Worker tests passed, including staff access,
cross-business/channel isolation, stale and invalid assignments, note retries,
author protection, automatic unassignment, removed-member denial, bounded note
storage and separation from customer messaging. Browser acceptance is recorded
separately; synthetic live-thread tests are not proof of WhatsApp delivery.

Staging release: migration 0016 applied successfully; Worker version
`f41f35b6-4236-4901-9a5b-0c0660292b33` deployed. The unsigned live RPC returned
401. All 15 website tests, Worker/frontend TypeScript, targeted new-component
ESLint and Worker dry-run passed. Vercel preview for commit `6714f6f` is Ready.
Draft PR #20 targets the review-evidence branch (#19); neither this record nor
the staging deployment represents a production merge or launch. Browser acceptance
completed with the signed-in staging owner on 23 October: assigned the existing
synthetic rehearsal to the owner, saved a private note, refreshed team details,
reloaded the whole page and reopened the thread. Assignment and note persisted;
the original six messages and paused state were unchanged. One transient request
failed without saving; retrying its same request ID saved exactly one note.
A transient bootstrap load also recovered on reload without another sign-in.
These intermittent availability errors remain a reliability limitation to track.

The narrow viewport check reported an actual 520px viewport with 512px document
width and no horizontal overflow; it is not a verified 390px result. Controls
and notes remained legible, and the viewport override was reset. The temporary
assignment was cleared through the UI; the single synthetic note was removed
with a scoped staging D1 cleanup. D1 confirmed zero notes, unassigned, six
messages and automation still paused. No customer messages or emails were sent.
Staff permissions and live-thread separation were covered by automated tests;
this owner rehearsal acceptance does not claim live WhatsApp delivery.
