# Refund reconciliation preparation

9 November 2026. Implemented and deployed to staging; no payment or refund
initiated. This does not open live checkout or customer release. See
`live-billing-acceptance-controls.md` for subsequent controls and deployment.

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

Initial local validation: Worker and website type-checks and all 123 Worker tests
passed, including a separate replay check. Subsequent acceptance validation ran
128 tests and deployed the backend/migrations to staging; see the controls file.

- The owner/workspace restriction, checkout deadline, notification queue and
  scheduled refund discovery are now implemented and tested; see the controls
  document for bounds and the separate production activation procedure.
- Production migrations and release remain pending.
- Verify live account, plans, webhook and secret settings without printing keys.
- Obtain specific approval for the amount and recurring payment; the owner
  completes checkout personally. No live charge is currently authorised.

References: [Paystack refund API](https://paystack.com/docs/api/refund/) and
[refund lifecycle](https://paystack.com/docs/payments/refunds/).
