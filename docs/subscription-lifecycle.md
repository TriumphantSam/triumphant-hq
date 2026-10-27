# Subscription lifecycle

## Customer behavior

Owners choose Starter (₦15,000/month, 500 answers, 20 FAQs), Growth
(₦35,000/month, 2,000 answers, 60 FAQs) or Business (₦75,000/month, 5,000
answers, 150 FAQs). A draft plan is not payment. Server-side provider verification
and an idempotent payment ledger grant access for the verified paid period only.
The existing monthly usage counter resets at Lagos calendar-month boundaries;
it is not reset by paying again, stopping renewal or changing an enquiry status.
Website and connected WhatsApp automatic answers share that counter. Enquiry and
booking records retain separate 100/month safety limits; no unlimited claim is made.

Checkout atomically reserves one attempt, checks the saved FAQ count, selects the
agreed plan and invalidates stale editors. An uncertain initialization outcome
does not create a second subscription. Owners can refresh verification, view the
latest 24 verified payments, stop renewal, explicitly consent to resume the same
agreement, and obtain an owner-only Paystack-hosted card-update link. Card details
never enter our API. Renewing an agreement does not itself grant paid time.

Failed renewal does not extend access, but already-paid time remains usable.
Cancellation stops future renewal while preserving paid time. At expiry, live
customer automation is refused and existing records/owner workspace access remain.
Staging falls back to its 100-answer sandbox allowance. Cached idempotent replies
do not consume more allowance. Paid FAQs cannot be raised through draft selection.

Provider callbacks are verified, then reconciled from the provider's current
state rather than trusting out-of-order event payloads. The minute cron also
reconciles at most one due subscription per run under a five-minute lease:
six-hour intervals after success, fifteen-minute retry after failure. Provider
errors are generic and isolated from unrelated delivery work. Background
reconciliation never calls charge, checkout or subscription-enable endpoints.

## Test/live separation and release gates

Migration 0022 adds payment-domain columns and reconciliation scheduling. Existing
records default to test. Test credit can never activate live entitlements.

Staging continues to require `PLATFORM_BILLING_TEST_ENABLED=true`, a test key and
the explicit `PLATFORM_BILLING_TEST_EMAIL` acceptance account. Its existing signed
`/webhooks/paystack` flow and agency test payment behavior are preserved.

Live billing requires **all** of these, separately approved for activation:

- production environment and `PLATFORM_ENABLED=true`;
- `PLATFORM_CUSTOMER_RELEASE_ENABLED=true`;
- `PLATFORM_BILLING_LIVE_ENABLED=true`;
- private `PLATFORM_PAYSTACK_LIVE_SECRET_KEY` with the live-key prefix;
- `PLATFORM_PAYSTACK_LIVE_PLANS` JSON mapping the three plan IDs to verified live
  monthly NGN plans matching the displayed amounts;
- the live Paystack webhook configured for `/webhooks/platform-paystack`, after
  checking the account's existing live webhook dependencies. Do not overwrite an
  existing live integration without a routing plan.

The new live endpoint is bounded to 16 KiB and validates the raw-body SHA-512 HMAC
with the live key. Test signatures are rejected. The legacy test endpoint cannot
reconcile live subscriptions. Both new release switches default to **false** in
both environment configurations. This work does not create live plans, configure
live credentials, charge real money, enable production access or activate WhatsApp.

## First-release limits and acceptance

Plan upgrades/downgrades, replacing completed agreements, refunds and ambiguous
checkout outcomes require operator reconciliation rather than a second automatic
agreement. Existing billing records lock draft plan changes. Payment history is
not a tax invoice. No automatic charge retry or dunning email is promised.

Before paid launch: finish the remaining customer-release checklist and Meta
connection work, verify the live account configuration, approve a controlled live
payment test and cancellation, verify webhook delivery, and enable the release
switches only after the complete customer journey passes. Staging/mocked live
tests are not proof of live-provider settlement or WhatsApp readiness.

See Paystack's [subscription lifecycle](https://paystack.com/docs/payments/subscriptions/)
and [subscription API](https://paystack.com/docs/api/subscription/).
