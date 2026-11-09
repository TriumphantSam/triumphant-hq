# Refund reconciliation preparation

9 November 2026. Local implementation; no payment or refund initiated. This
does not open live checkout or customer release.

The operator-only signed `POST /v1/platform/billing/reconcile-refund` accepts
`refundId` and `paymentReference`. It reads an existing payment in the enabled
billing environment, then fetches `/refund/:id` from Paystack. It checks the
transaction ID, environment, currency, amount and recognised refund status before
storing evidence. It cannot create or retry a refund. The website RPC allowlist
does not expose this operator endpoint.

Migration `0026_platform_refunds.sql` must be applied before releasing this code.
Payment history is preserved. Refund identifiers cannot be reassigned to another
payment or amount. Once verified as processed, a refund cannot regress because
of stale provider state. Distinct processed partial refunds are summed; only a
fully refunded payment stops granting its paid period. Later unrefunded renewal
payments remain eligible. Pending, processing, needs-attention and failed refunds
do not revoke access. A replayed charge success cannot bypass the refund ledger.

The billing history displays the verified processed refund amount. “Processed”
is provider processing status, not confirmation that funds reached the customer's
bank. Owner confirmation of receipt remains separate.

## Remaining before live acceptance

Local validation: Worker type-check and website type-check passed; all 123 Worker
tests passed. The updated replay case also passed in a separate three-test refund
run. No remote migration or deployment was performed.

- Restrict live acceptance to one verified owner/workspace, with an expiring
  checkout window and a cleanup path for cancellation after the window closes.
- Add refund discovery/reconciliation from provider notifications and scheduled
  recovery. This first implementation needs an operator-supplied refund ID;
  it is not unattended refund handling.
- Apply the migration and verify in staging before any production release.
- Verify live account, plans, webhook and secret settings without printing keys.
- Obtain specific approval for the amount and recurring payment; the owner
  completes checkout personally. No live charge is currently authorised.

References: [Paystack refund API](https://paystack.com/docs/api/refund/) and
[refund lifecycle](https://paystack.com/docs/payments/refunds/).
