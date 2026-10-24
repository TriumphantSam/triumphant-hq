# Team access history

Owners can read their business's staff access history on Team. The first
increment records invitations created, invitations accepted, active invitations
withdrawn and staff memberships removed. It does not log email delivery,
conversation contents, settings changes or events predating migration 0019.

Each event contains the affected email address, the authenticated actor and a
timestamp. The UI uses Lagos time. Staff and other businesses cannot read the
history. Actor labels resolve from the current account; this is an operational
access history, not an immutable identity or compliance record.

History writes share a D1 batch transaction with the access mutation. Guarded
inserts and unique invitation event keys prevent successful retries from adding
duplicate events. Removing an already absent staff member adds no event. Failed
or cross-business operations add no history. An activity-write failure rolls
back the corresponding access mutation.

The owner-only team.history RPC returns twenty events per page, ordered by a
server sequence. A validated exclusive sequence cursor keeps older pages stable
when newer activity arrives. There is no customer write, deletion or export RPC.
Rows contain private staff emails; they are not sent to analytics or the AI.
History follows workspace deletion through a database foreign key. No new
retention/deletion policy is introduced by this increment.

Migration 0019 must precede deployment. This increment remains in staging until
release. It grants no new staff permissions and sends no messages.

Prior release checkpoint: staff invitation PR #25 merged into main at 8577cdb.
Production migration 0018 succeeded; Worker version
d4100bc4-2a72-4aac-8d3b-778b4bbcbe4c deployed. Vercel production deployment
dpl_3Az17mHf66g2N1WHX9DBzSUZUCQo is Ready on triumphantech.com. Public home,
platform and automation-lab routes returned 200. The signed platform RPC retained
its expected 503 gate. Local main was fast-forwarded and clean before creating
this branch. Invitation sending remains off.

Validation on 24 October: 93 Worker tests, 15 website tests, frontend and Worker
TypeScript, targeted ESLint and diff checks passed. Staging migration 0019 and
Worker version 64c53627-a298-4948-ab7a-b51e7a3d30ec are deployed. Vercel preview
dpl_9BtmKP2du2yXahaUqGtyg4CcUy2e is Ready; the reusable codex-team-i-60166a alias
points to it. Owner browser acceptance created and withdrew one reserved
example.test invitation without email. Both events appeared automatically with
the correct actor and WAT times, and a remote read confirmed persistence. There
were no pending invitations and only the owner membership after cleanup.
Evidence: tmp/team-history-desktop.png. This feature is draft PR #26 and has not
been promoted to production.
