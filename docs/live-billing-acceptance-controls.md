# Private live billing acceptance controls

9 November 2026. Implementation and staging verification only. No real payment,
refund, live plan creation or production activation is authorised by this file.

Validation: 128 backend tests, Worker and website type-checks, targeted billing
component lint, and Worker dry-run passed. Migrations 0026/0027 applied only to
staging. Backend staging version `f53fa1ed-95f7-4e5f-b635-23c357d5a94c` deployed.
Signed operations returned 200, unsigned 401, heartbeat healthy and all four
refund queue warning counters zero. Overall operations attention remains true
from an existing unrelated queue condition; no delivery retry was initiated.
Website preview CI [42647676300](https://github.com/TriumphantSam/triumphant-hq/actions/runs/42647676300)
passed for code commit `3253a07`, including its build, deployment and route check.
The updated preview workspace returned 200 with noindex. The website rejects the
operator refund action with 400, and the unsigned backend refund endpoint returns
401. Production was not deployed or enabled during this release.

## Production configuration for a later approved exercise

Keep `PLATFORM_CUSTOMER_RELEASE_ENABLED=false`. The operator selects exactly one
existing production workspace and its verified owner's email, then configures:

- `PLATFORM_BILLING_ACCEPTANCE_ENABLED=true`
- `PLATFORM_BILLING_ACCEPTANCE_EMAIL`: the verified owner email
- `PLATFORM_BILLING_ACCEPTANCE_WORKSPACE_ID`: that workspace's UUID
- `PLATFORM_BILLING_ACCEPTANCE_EXPIRES_AT`: an explicit UTC timestamp
- Existing platform/live billing flags, the live secret, and matching live plan
  codes must also be configured. These remain disabled until separately approved.

Missing or malformed acceptance settings fail closed. The browser cannot choose
the billing mode or override identity. Closed-production RPC admits sign-in only
for this email; verified-session requests are restricted to this workspace, and
public customer workflows remain closed. The existing ownership check still
applies. New workspace creation is denied through this restricted RPC: prepare
the isolated owner account/workspace privately before enabling acceptance.

The acceptance deadline prevents preparing or reopening checkout through the
platform and restarting renewal. Verification, cancellation, provider callbacks,
refund checks and paid-ledger access remain restricted to that owner/workspace
after expiry, allowing cleanup. Disabling acceptance or removing its settings is
a stronger kill switch, and also disables that cleanup path. Therefore cancel
renewal and verify refund outcome before removing credentials/settings. Never
toggle general customer release merely to bypass the acceptance restriction.

An already issued Paystack checkout URL can exist outside our app. The deadline
does not revoke a URL already opened at Paystack or cancel an existing recurring
agreement. Verify late outcomes and explicitly stop renewal. Do not describe it
as a guaranteed provider-side charge cutoff.

## Refund notifications and recovery

The signed Paystack refund notifications enqueue a check for a known initial
payment reference or recorded renewal payment in the active billing domain.
Unrelated references and other acceptance workspaces are ignored. Notification
amounts and statuses do not grant or remove paid access directly. An unverified
refund notification temporarily holds the affected payment's access until its
provider evidence is checked, including notifications arriving before the local
payment ledger is written.

Minute cron processes at most one refund check per call. It lists refunds for
the recorded provider transaction and fetches each refund individually before
recording it. Up to five refunds per payment are handled automatically. Six or
more require operator pagination/reconciliation rather than silently accepting
a truncated response. The check retries after 15 minutes on failure and every
six hours on success. New verified payments get a scheduled discovery check even
if no refund webhook arrives. Existing payments predating this release can be
enrolled with a real notification or a reviewed operator queue insertion; this
release does not scan all historical payments automatically.

Queue leases bound concurrent work. Version checks prevent a running check from
clearing a newer notification. Failed, overdue and expired-lease checks appear in
operations health. No worker endpoint creates or retries refunds; initiate an
approved refund in Paystack, then verify its outcome. Provider `processed` does
not independently prove receipt in the customer's bank account.

Apply migrations 0026 and 0027 before deploying the corresponding backend.
Rollback can leave these additive tables intact. Keep live flags disabled while
checking staging. Payment/refund evidence should be retained for reconciliation.

References: [Paystack refunds](https://paystack.com/docs/payments/refunds/) and
[refund API](https://paystack.com/docs/api/refund/).
