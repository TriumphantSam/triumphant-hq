-- Resend idempotency expires after 24 hours. Never replay an uncertain old send.
ALTER TABLE lab_payment_jobs ADD COLUMN first_attempt_at TEXT;
ALTER TABLE review_jobs ADD COLUMN first_attempt_at TEXT;
ALTER TABLE review_invite_jobs ADD COLUMN first_attempt_at TEXT;
ALTER TABLE owner_report_jobs ADD COLUMN first_attempt_at TEXT;
