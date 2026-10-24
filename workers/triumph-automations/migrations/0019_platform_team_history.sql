CREATE TABLE platform_team_history (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
  event_key TEXT NOT NULL UNIQUE,
  action TEXT NOT NULL CHECK(action IN ('invited','joined','withdrawn','removed')),
  actor_user_id TEXT NOT NULL,
  subject_email TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX platform_team_history_workspace ON platform_team_history(workspace_id,sequence DESC);
