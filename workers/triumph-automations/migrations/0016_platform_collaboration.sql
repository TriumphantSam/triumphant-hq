CREATE TABLE platform_thread_assignments (
 workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 channel TEXT NOT NULL CHECK(channel IN ('rehearsal','whatsapp')),
 thread_id TEXT NOT NULL,
 assignee_id TEXT REFERENCES platform_auth_user(id),
 version INTEGER NOT NULL DEFAULT 0,
 PRIMARY KEY(workspace_id,channel,thread_id)
);
CREATE TABLE platform_thread_notes (
 id TEXT PRIMARY KEY,
 workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 channel TEXT NOT NULL CHECK(channel IN ('rehearsal','whatsapp')),
 thread_id TEXT NOT NULL,
 author_id TEXT NOT NULL REFERENCES platform_auth_user(id),
 body TEXT NOT NULL CHECK(length(body) BETWEEN 1 AND 2000),
 created_at TEXT NOT NULL
);
CREATE INDEX platform_thread_notes_lookup ON platform_thread_notes(workspace_id,channel,thread_id,created_at,id);
CREATE TRIGGER platform_unassign_removed_member AFTER DELETE ON platform_memberships
BEGIN
 UPDATE platform_thread_assignments SET assignee_id=NULL,version=version+1
 WHERE workspace_id=OLD.workspace_id AND assignee_id=OLD.user_id;
END;
