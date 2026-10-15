# Assistant, test payments, reviews and owner workspace

The website remains on Vercel and the automation backend remains the separate
Cloudflare Worker. This branch also merges current main content (including the
founder page), retaining the durable enquiry routes and their abuse controls
where the older main branch still used email-only submissions.

## AI assistant

Cloudflare Workers AI, via the version-matched AI SDK 7 provider, classifies a
question into IDs from `content/kb/business.json`. The server renders those
known facts and source links; it never renders model-written claims. Unknown
topics and human requests offer a real enquiry form. No project prices, client
results or rankings are invented. The twenty scripted questions are in
`tests/chat-golden.json`; a real Cloudflare run passed all twenty.

Start requires Turnstile and the existing shared distributed admission control.
Sessions bind to a keyed IP digest, expire in 24 hours and allow twenty attempts.
The provider has a shared limit of 100 calls per Lagos day. Output is capped at
160 tokens with an eight-second timeout and no SDK retries. No transcript is
stored in D1. The Cloudflare `AI` binding requires no new provider key.
Gemini is supported as a later provider but its existing key returned HTTP 402.
No billing plan or prepayment was changed by this work.

## Paystack test payments

Only `sk_test_` keys are accepted, using `PAYSTACK_TEST_SECRET_KEY`. The public
product is fixed server-side at NGN 100 (10,000 kobo). Initialize requests bind
a random request ID to email and reminder choice; repeat requests reuse checkout.
Uncertain initialization is not blindly repeated. Verification requires success,
the exact reference, amount, currency, test domain and a valid provider ID/date.

Test webhook URL:
`https://triumph-automations-production.triumphantsam30.workers.dev/webhooks/paystack`.
Configure this in Paystack's **test** webhook settings. Webhooks validate HMAC
SHA-512 over the exact body, then reverify with Paystack. Payment state and the
two unique receipt/owner jobs commit together. Receipt pages expose reference,
date and amount, never the customer's email or card data. Provider acceptance
does not prove inbox delivery.

Test checkout reminders are optional and unchecked initially: days 1, 4 and 8,
then stop. They explicitly state that no money is owed. Verified payment and
opt-out cancel pending reminders. There is no real debt collection or live
payment activation in this public demo. Real business invoices remain separate.

## Honest reviews

Every score sees the owner's supplied Google review URL:
`https://g.page/r/CYfV5FDkEGq_EAI/review`.
Private feedback is stored separately and queues an owner email. No public
review is written automatically, and no incentive or rating-based gating exists.
Only genuine customers should submit public Google reviews.

New bookings offer a separate, unchecked review invitation choice. Old bookings
default to no permission. The authenticated owner can mark a past, uncancelled
consultation delivered; this queues one invitation only when permission exists,
limited to one customer request per 90 days using a keyed email digest.
Repeat completion cannot resend an invitation. The invitation offers the same
Google link at every score, records a click without exposing contact details,
and allows the recipient to stop future review invitations.

## Private owner workspace and reports

`/admin` requires a random owner password. Only its SHA-256 hash is in Vercel
`ADMIN_LAB_PASSWORD_HASH`; the existing server HMAC signs scoped eight-hour
HttpOnly, Secure, SameSite=Strict cookies. Login has Turnstile and admission
limits; actions check origin and session. Default invoice-system credentials
are not used. Customer data never appears in the public sample dashboard.

The workspace displays recent leads, consultations and private feedback,
prepares three weekly writing templates from verified sources, and records
approval. These templates are not AI-written; no social publishing API exists.
Weekly template generation runs Mondays during the 08:00 Lagos hour.

Daily owner emails are explicitly authorised and enabled in production with
`REPORTS_EMAIL_ENABLED=true`; staging remains off. They claim one job per date during
08:00–08:59 WAT, summarising the previous day; Monday uses the previous week.
Counts include authorised test records and distinguish disconnected financial
data from zero revenue. Reports go only to the configured owner email.

New email queues use leases and stable Resend idempotency keys. Sends uncertain
for more than 23 hours become `unknown` for manual review, rather than replaying
after the provider's idempotency window. Completed, opted-out and expired records
must be checked before retrying. Records follow the existing private retention
and deletion process; suppression digests remain to honour opt-out.

WhatsApp, Termii SMS, live payments and Instagram messaging remain outside this
release's activation. Those channels are not enabled by viewing or using these
demos.

## Production verification on 15 October 2026

- Vercel production build promoted with current founder-page fixes retained.
- Twelve website tests, thirty-three Worker tests and all twenty real Workers AI
  golden questions passed. A browser session passed Turnstile and received a
  sourced SEO answer that explicitly refused guaranteed number-one rankings.
- One authorised NGN 100 Paystack test checkout was verified paid, including
  exact reference, amount, currency and test domain. The public receipt rendered
  correctly without customer contact or card details. Repeated verification
  retained exactly two jobs: one receipt and one owner alert.
- Resend accepted those two jobs and the authorised private-feedback owner alert.
  Inbox delivery is not independently confirmed. No public Google review was posted.
- The owner confirmed saving the production URL in Paystack's test webhook
  settings. A real webhook replay remains distinct from the verified callback/API
  flow; unsigned requests are rejected and signature/replay behavior is tested.
- Production owner reports are enabled; staging reports, WhatsApp and SMS are off.
- Provider calls use `redirect: "manual"` and reject non-success responses. The
  deployed Worker runtime rejected `redirect: "error"`; regression tests cover
  redirect rejection and reuse of the same email idempotency key on retry.

Owner access is at `/admin`. The generated password is kept outside Git. On the
owner's Windows machine, `node C:\Users\trium\triumphant-hq\tmp\emit-owner-password.mjs | Set-Clipboard`
copies it privately for pasting into the login form. Do not put it in chat or docs.
