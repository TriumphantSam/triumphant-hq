ALTER TABLE bookings ADD COLUMN whatsapp_opt_in INTEGER NOT NULL DEFAULT 0 CHECK(whatsapp_opt_in IN (0,1));
ALTER TABLE bookings ADD COLUMN sms_opt_in INTEGER NOT NULL DEFAULT 0 CHECK(sms_opt_in IN (0,1));
ALTER TABLE bookings ADD COLUMN notification_consent_at TEXT;
CREATE TABLE booking_messages (
 id TEXT PRIMARY KEY, booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
 channel TEXT NOT NULL CHECK(channel IN ('sms','whatsapp')),
 kind TEXT NOT NULL CHECK(kind IN ('confirmation','reminder_24h','reminder_2h','cancellation')),
 state TEXT NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','sending','accepted','failed','unknown','cancelled')),
 next_attempt_at TEXT NOT NULL, lease_until TEXT, attempts INTEGER NOT NULL DEFAULT 0,
 provider_id TEXT, accepted_at TEXT, last_error TEXT,
 UNIQUE(booking_id,channel,kind)
);
CREATE INDEX booking_messages_due ON booking_messages(state,next_attempt_at);
