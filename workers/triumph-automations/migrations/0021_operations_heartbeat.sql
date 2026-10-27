CREATE TABLE automation_heartbeat (
 id TEXT PRIMARY KEY CHECK(id='minute-cron'),
 last_started TEXT NOT NULL,
 last_finished TEXT,
 last_success TEXT,
 last_outcome TEXT NOT NULL CHECK(last_outcome IN ('running','ok','failed'))
);
