CREATE TABLE bookings (
 id TEXT PRIMARY KEY, request_id TEXT NOT NULL UNIQUE, fingerprint TEXT NOT NULL,
 created_at TEXT NOT NULL, slot_start TEXT NOT NULL, slot_end TEXT NOT NULL,
 name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL DEFAULT '',
 status TEXT NOT NULL DEFAULT 'confirmed' CHECK(status IN ('confirmed','cancelled')),
 cancelled_at TEXT
);
CREATE UNIQUE INDEX bookings_capacity ON bookings(slot_start) WHERE status='confirmed';
CREATE TABLE booking_outbox (
 id TEXT PRIMARY KEY, booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
 kind TEXT NOT NULL CHECK(kind IN ('confirmation','owner_confirmation','reminder_24h','reminder_2h','cancellation','owner_cancellation')),
 state TEXT NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','sending','sent','failed','cancelled')),
 attempts INTEGER NOT NULL DEFAULT 0, next_attempt_at TEXT NOT NULL,
 lease_until TEXT, sent_at TEXT, last_error TEXT,
 UNIQUE(booking_id,kind)
);
CREATE INDEX booking_outbox_due ON booking_outbox(state,next_attempt_at);
