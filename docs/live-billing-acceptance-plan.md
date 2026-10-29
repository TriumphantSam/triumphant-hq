# Controlled live billing acceptance

29 October 2026. Status: preflight inspected; no live checkout enabled, provider
plan created, charge or refund initiated. Independent customer pilot is deferred
at the owner's request. Meta approval is not required for this billing-only test.

## Verified blockers

Production Worker secret-name inspection found PAYSTACK_TEST_SECRET_KEY but no
PLATFORM_PAYSTACK_LIVE_SECRET_KEY. Secret values were not retrieved or printed.
Source billingMode requires production, PLATFORM_ENABLED, CUSTOMER_RELEASE and
BILLING_LIVE gates together. There is no owner-only live acceptance gate: live
billing accepts any otherwise eligible verified owner once opened. Do not open
general customer release merely to perform this test.

Live checkout requires explicitly configured live Paystack plan codes and checks
provider amount, NGN currency, monthly interval and live domain against the
displayed plan. Starter is 1,500,000 kobo (₦15,000). A ₦100 one-off payment cannot
be presented as acceptance of the real Starter subscription path. Do not alter
the public Starter price or map it to a mismatched low-value provider plan.

No refund-event/access reconciliation implementation was found in the Worker.
Cancellation is implemented, but it does not reverse the verified paid period.
Refund processing and entitlement correction need a reviewed, auditable path
before collecting a payment expected to be refunded.

## Work before payment approval

1. Add an expiring acceptance restriction for one explicitly selected owner and
   workspace. Keep general customer registration/release closed and all other
   owners denied. Scope website gateway, checkout, verified webhooks, management
   and cancellation consistently; do not let a browser select live/test mode.
   Preserve test/live separation and existing paid-test records.
2. Define refund reconciliation with immutable payment/refund references and
   verified provider state. A queued refund is not a completed refund. Prevent
   duplicate/refunded events from extending or restoring refunded access; keep
   cancellation usable and retain the accounting evidence.
3. Test denied owners/workspaces, expiry, price mismatch, invalid signatures,
   duplicate/out-of-order callbacks, cancellation and refund state transitions
   with mocks/test mode. Deploy only after checks pass. Verify rollback gates.
4. The owner saves the live key directly into the required Worker secret setting;
   never chat or repository files. Verify account ownership and live plan details
   read-only before configuring an approved plan. Confirm the correct live webhook.
5. Present the checkout purpose, owner/workspace, exact amount, recurring consent,
   provider fees/refund reserve and cleanup plan for explicit approval. No charge
   or live recurring agreement has been authorized yet.

## Proposed acceptance, subject to approval

Use one fresh, isolated owner workspace and one real Starter subscription at
₦15,000 monthly. The owner enters their own payment details and completes the
payment. Do not promise immediate reversal or that provider fees are returned.
If the owner wants a smaller test instead, build a clearly separate acceptance
product and state that actual Starter-price acceptance remains unverified.

Verify exactly one provider payment against the matching workspace, correct
amount/currency/live mode, and the verified paid-access period. A success screen
alone is insufficient. Verify callback processing without fabricating a new
charge. Do not claim renewal collection was tested by cancelling immediately.

Cancel renewal through the platform and verify the provider's non-renewing state.
Then the owner authorizes/initiates the full original-payment refund, and the
operator verifies its final provider outcome and corresponding access treatment.
Retain references without card details, codes or private provider tokens. Confirm
the owner's receipt of returned money separately. Keep pending/failed refund
status open and actionable. Disable the acceptance gate and remove temporary
credentials/configuration when the complete exercise is finished.

## References

- [Paystack subscriptions](https://paystack.com/docs/payments/subscriptions/)
- [Paystack refund lifecycle](https://paystack.com/docs/payments/refunds/)

Paystack documents recurring subscriptions separately from refunds. Creating a
refund queues processing; track the final result instead of treating API acceptance
as returned funds. This plan does not approve public sales or replace commercial
terms, tax decisions, the independent pilot or WhatsApp delivery acceptance.
