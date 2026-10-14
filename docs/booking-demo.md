# Booking and email reminder demo

Free, real 30-minute automation consultations. Approved owner availability: weekdays 10:00–16:00 Africa/Lagos, 15-minute buffer, minimum 24 hours' notice. Slots use 45-minute spacing and a rolling 14-day horizon. Each slot accepts one active reservation. The existing SEO Cal.com calendar stays separate; this demo does not read Google/Cal.com events or create a meeting link. The owner emails joining details.

## Flow

`/automation-lab/booking` loads actual availability through the signed Next.js → Worker bridge. Creating or cancelling uses the existing bounded public form, Turnstile and distributed admission limit. D1's partial unique index prevents double bookings. The booking, Sheet lead and email jobs are committed in one transaction. A client request ID binds exact booking details so retrying after a network error does not reserve twice.

Customers receive confirmation and 24-hour / 2-hour reminders. The owner receives confirmation and cancellation alerts. The minute cron leases durable jobs, retries failures and uses provider idempotency keys. Cancelled and expired reminder jobs are suppressed. Cancellation releases capacity and updates the lead mirror. An email already accepted by the provider cannot be recalled.

The private management code is derived with a purpose-specific HMAC from the backend signing secret and booking ID. It is never placed in a URL, the Sheet, owner email or logs. Customer emails include manual reference/code entry instructions; the optional `#manage` fragment is constant. Rotating AUTOMATION_HMAC_SECRET invalidates old management codes, so coordinate rotation and reissue codes before doing so. The browser keeps the code only in memory, excludes this panel from analytics autocapture, and masks the code for replay. Calendar downloads contain no private management code or customer contact details.

## Release and checks

Apply `0002_bookings.sql` before deploying the Worker with BOOKING_ENABLED=true. Reuse existing email and HMAC secrets. No new provider account or credential is needed. Retain bookings for 365 days, matching the enquiry policy; deletion cascades to booking jobs.

Tests cover the Lagos schedule, concurrent capacity, transactional rollback, exact retries, invalid management codes, cancellation/rebooking, provider failure privacy, email retries and suppression. A live customer/email test needs an approved test recipient and should be cancelled afterward so it does not occupy a genuine consultation slot. Email acceptance is distinct from inbox delivery. SMS and WhatsApp reminders are pending the company number's Meta API connection.
