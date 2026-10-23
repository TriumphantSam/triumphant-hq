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
