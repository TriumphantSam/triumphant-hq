# Personal inbox filters and unread indicators

Rehearsal and WhatsApp conversation lists now support All, Assigned to me,
Unassigned, and Unread customer messages. Each row shows the current assignment
and that signed-in person's unread count. Refresh the list to fetch activity or
assignment changes; there is no realtime subscription in this increment. These
filters apply to the existing list window (100 rehearsals or 50 live threads),
not a full-history search.

Opening a conversation acknowledges only the snapshot actually loaded. A new
customer message inserted after that snapshot remains unread. Each member has
an independent read position; acknowledging one person's view cannot acknowledge
another person's messages. Old tabs cannot move the read position backwards.
Notes, outgoing replies and assignment changes do not increase unread counts.
Existing historical customer messages initially count as unread until opened.

The live thread now returns the latest 200 stored events in insertion order,
displayed oldest to newest within that window. Its read position uses the
highest stored event row ID in that snapshot, so equal message timestamps do
not lose new arrivals. Any future event deletion/retention feature must preserve
monotonic cursor identity; there is no event-retention deletion in this increment.
Rehearsal uses the length of its append-only message snapshot. Opening a thread
does not send WhatsApp read receipts or change automation.

Migration 0017 adds per-workspace, channel, thread and member read positions.
Removing a member clears their read positions as well as their assignments.
Business membership and channel/thread ownership are checked on every read
acknowledgement. Invalid future positions are rejected.

Local validation: all 88 Worker tests passed. Additional focused tests cover
personal cursors, new arrivals during a read, stale tabs, member removal,
cross-channel protection, equal timestamps and the latest-200-event window.
Browser, staging and production release evidence is tracked separately.

## Staging acceptance, 23 October 2026

Migration 0017 applied and Worker version
`d45d135a-fbbf-4ae6-98cc-7830695deca3` deployed. Both frontend and Worker
TypeScript, all 15 website tests, all 88 Worker tests, focused latest-history
tests and lint for all changed inbox components passed. Vercel code build
`5d57b26` is Ready. The earlier team preview alias was reassigned to this preview
to preserve the owner's sign-in; it no longer represents the frozen PR #20 build.

Owner browser checks on the existing synthetic rehearsal showed three unread
customer messages, then zero after opening the snapshot. Unread and Assigned to
me filters initially showed empty results as appropriate. After assigning the
thread to the owner and refreshing, Assigned to me included it and Unassigned
excluded it. The original six messages and paused automation stayed unchanged.
The assignment was cleared through the UI and the test read position was removed
with scoped D1 cleanup, restoring the fixture's initial unread state. No customer
messages, email or external WhatsApp read receipts were sent. Independent staff
read state and live-event races were verified by automated tests, not by a live
customer connection. Production is unchanged. Draft PR #21 depends on PR #20.
