# Owner sandbox usage

Usage shows the actual monthly sandbox counters and current enforced limits:
100 answer requests, 100 enquiry records and 100 booking records. Draft paid
plan allowances and test payments do not increase these sandbox limits. This
report does not claim to meter live WhatsApp, provider charges or paid invoices.

The owner-only `usage.read` action checks membership and role, then returns
aggregate counts without customer details. Period boundaries and the next reset
use Africa/Lagos. At 80% the UI warns that the limit is near; at or above 100 it
shows reached, with remaining clamped at zero. The display never raises a limit.
Users refresh manually; the snapshot time and period stay visible.

Enquiry status changes and booking cancellations still count, matching the
current public-workflow enforcement. Cancellation releases the time slot, not
monthly record capacity. Rehearsals, private notes and assignments do not count
towards the sandbox answer allowance. No billing, activation, notifications or
database migration is added by this increment.

Verification: 89 Worker tests passed, plus a focused test for enquiry/booking
boundaries and cancelled records. Owner/staff and cross-business access, near/
reached states, capped remaining values, Lagos midnight and year rollover were
checked. Frontend/Worker TypeScript, changed-component lint and website tests
passed. Browser acceptance and staging release are recorded separately.

Previous release: PR #23 merged into main at 7cc8a7b. Local main and origin/main
match. Production Vercel dpl_DgugiDCgQCGyCZXGFmMqwgNaiPpX is Ready and serves the
public domains. No Worker source changed in that PR, so no Worker redeployment
was required. The signed production platform gate still returns the expected
503; the production customer platform remains closed. Usage is a separate branch.

## Staging acceptance

Worker c2f6b217-3a1e-4d2b-97e4-c97c2de90f15 deployed after a successful dry-run;
no migration was needed. The accepted Vercel code preview 3e312cd showed the owner
Usage tab, October 2026 period and 1 November 00:00 WAT reset. All three zero
counts matched a scoped staging D1 aggregate check. Refresh and explanations for
cancelled bookings/status changes worked. No records, messages or charges were
created. Near/reached warnings were verified by automated tests, not by modifying
the owner's counters. Actual narrow viewport was 520px with document width 512px;
no horizontal overflow and readable cards. Viewport override was reset.
The subsequent heading-only change gives Usage its own workspace heading.
The existing staging team-preview alias is used to preserve the owner's session.
This increment remains in draft PR #24, separate from the completed main release.
