CREATE TABLE platform_team_invites (
 id TEXT PRIMARY KEY,
 workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 email TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','accepted','revoked','expired')),
 created_by TEXT NOT NULL REFERENCES platform_auth_user(id),
 created_at TEXT NOT NULL, expires_at TEXT NOT NULL
);
CREATE UNIQUE INDEX platform_pending_team_email ON platform_team_invites(workspace_id,email) WHERE state='pending';
CREATE INDEX platform_team_recipient ON platform_team_invites(email,state,expires_at);
