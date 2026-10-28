CREATE TABLE platform_followups (
 workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 kind TEXT NOT NULL CHECK(kind IN ('enquiry','booking','rehearsal','whatsapp')),
 record_id TEXT NOT NULL,
 due_at TEXT NOT NULL,
 note TEXT NOT NULL DEFAULT '',
 assignee_id TEXT REFERENCES platform_auth_user(id) ON DELETE SET NULL,
 done INTEGER NOT NULL DEFAULT 0 CHECK(done IN (0,1)),
 version INTEGER NOT NULL DEFAULT 1,
 updated_at TEXT NOT NULL,
 PRIMARY KEY(workspace_id,kind,record_id)
);
CREATE INDEX platform_followups_due ON platform_followups(workspace_id,done,due_at);
