CREATE TABLE platform_thread_reads (
 workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 channel TEXT NOT NULL CHECK(channel IN ('rehearsal','whatsapp')),
 thread_id TEXT NOT NULL,
 user_id TEXT NOT NULL REFERENCES platform_auth_user(id) ON DELETE CASCADE,
 cursor INTEGER NOT NULL DEFAULT 0 CHECK(cursor>=0),
 PRIMARY KEY(workspace_id,channel,thread_id,user_id)
);
CREATE TRIGGER platform_clear_removed_member_reads AFTER DELETE ON platform_memberships
BEGIN
 DELETE FROM platform_thread_reads WHERE workspace_id=OLD.workspace_id AND user_id=OLD.user_id;
END;
