PRAGMA foreign_keys = ON;
CREATE TABLE leads (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  source TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL COLLATE NOCASE,
  phone TEXT NOT NULL DEFAULT '', service TEXT NOT NULL DEFAULT '', need TEXT NOT NULL,
  consent_marketing INTEGER NOT NULL DEFAULT 0 CHECK(consent_marketing IN (0,1)), consent_at TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','qualified','won','lost')),
  sheet_synced INTEGER NOT NULL DEFAULT 0, owner_notes TEXT NOT NULL DEFAULT ''
);
CREATE INDEX leads_email_created ON leads(email, created_at);
CREATE TABLE events (id TEXT PRIMARY KEY, type TEXT NOT NULL, ref_id TEXT, created_at TEXT NOT NULL);
-- Job payloads reference private records, rather than duplicating PII in logs.
CREATE TABLE outbox (
  id TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK(kind IN ('sheet','reply_email','owner_email')),
  state TEXT NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','sending','sent','failed')),
  attempts INTEGER NOT NULL DEFAULT 0, next_attempt_at TEXT NOT NULL,
  lease_until TEXT, sent_at TEXT, last_error TEXT,
  UNIQUE(lead_id, kind)
);
CREATE INDEX outbox_due ON outbox(state,next_attempt_at);
CREATE TABLE request_nonces (nonce TEXT PRIMARY KEY, expires_at INTEGER NOT NULL);
CREATE TABLE rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
