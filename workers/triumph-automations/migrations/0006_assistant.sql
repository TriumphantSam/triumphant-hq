CREATE TABLE assistant_sessions (
 id TEXT PRIMARY KEY,
 scope TEXT NOT NULL CHECK(scope IN ('customer','owner')),
 actor_key TEXT NOT NULL,
 expires_at TEXT NOT NULL,
 turns INTEGER NOT NULL DEFAULT 0,
 version INTEGER NOT NULL DEFAULT 0,
 state TEXT NOT NULL DEFAULT '{}',
 last_request_id TEXT,
 last_response TEXT,
 lock_until INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX assistant_expiry ON assistant_sessions(expires_at);
