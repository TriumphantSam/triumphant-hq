CREATE TABLE chat_sessions (id TEXT PRIMARY KEY, ip_key TEXT NOT NULL, expires_at TEXT NOT NULL, turns INTEGER NOT NULL DEFAULT 0);
CREATE TABLE review_feedback (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5), feedback TEXT NOT NULL DEFAULT '', name TEXT NOT NULL DEFAULT '', email TEXT NOT NULL DEFAULT '');
CREATE TABLE review_jobs (id TEXT PRIMARY KEY, feedback_id TEXT NOT NULL REFERENCES review_feedback(id) ON DELETE CASCADE, state TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0, next_attempt_at TEXT NOT NULL, lease_until TEXT);
CREATE TABLE lab_invoices (
 id TEXT PRIMARY KEY, request_id TEXT NOT NULL UNIQUE, fingerprint TEXT NOT NULL,
 email TEXT NOT NULL, created_at TEXT NOT NULL, amount_kobo INTEGER NOT NULL CHECK(amount_kobo=10000),
 currency TEXT NOT NULL DEFAULT 'NGN' CHECK(currency='NGN'), mode TEXT NOT NULL DEFAULT 'test' CHECK(mode='test'),
 status TEXT NOT NULL DEFAULT 'initializing' CHECK(status IN ('initializing','awaiting_payment','paid','unknown','failed')),
 authorization_url TEXT, provider_id TEXT UNIQUE, paid_at TEXT, reminder_opt_in INTEGER NOT NULL DEFAULT 0 CHECK(reminder_opt_in IN (0,1))
);
CREATE TABLE lab_payment_jobs (id TEXT PRIMARY KEY, invoice_id TEXT NOT NULL REFERENCES lab_invoices(id) ON DELETE CASCADE, kind TEXT NOT NULL CHECK(kind IN ('receipt','owner','reminder_due','reminder_3d','reminder_7d')), state TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0, next_attempt_at TEXT NOT NULL, lease_until TEXT, UNIQUE(invoice_id,kind));
ALTER TABLE bookings ADD COLUMN completed_at TEXT;
ALTER TABLE bookings ADD COLUMN review_opt_in INTEGER NOT NULL DEFAULT 0 CHECK(review_opt_in IN (0,1));
CREATE TABLE review_contacts(email_hash TEXT PRIMARY KEY,last_requested_at TEXT NOT NULL,invite_id TEXT NOT NULL,opted_out INTEGER NOT NULL DEFAULT 0);
CREATE TABLE review_invites(id TEXT PRIMARY KEY,booking_id TEXT NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,created_at TEXT NOT NULL,email TEXT NOT NULL,clicked_at TEXT);
CREATE TABLE review_invite_jobs(id TEXT PRIMARY KEY,invite_id TEXT NOT NULL REFERENCES review_invites(id) ON DELETE CASCADE,state TEXT NOT NULL DEFAULT 'pending',attempts INTEGER NOT NULL DEFAULT 0,next_attempt_at TEXT NOT NULL,lease_until TEXT);
CREATE TABLE social_drafts(id TEXT PRIMARY KEY,created_at TEXT NOT NULL,body TEXT NOT NULL,source TEXT NOT NULL,state TEXT NOT NULL DEFAULT 'draft' CHECK(state IN ('draft','approved')));
CREATE TABLE owner_report_jobs(id TEXT PRIMARY KEY,created_at TEXT NOT NULL,report TEXT NOT NULL,state TEXT NOT NULL DEFAULT 'pending',attempts INTEGER NOT NULL DEFAULT 0,next_attempt_at TEXT NOT NULL,lease_until TEXT);
