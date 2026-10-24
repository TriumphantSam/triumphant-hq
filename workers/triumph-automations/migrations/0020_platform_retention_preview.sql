CREATE TABLE platform_retention_preview (
 workspace_id TEXT PRIMARY KEY REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 days INTEGER NOT NULL DEFAULT 0 CHECK(days IN (0,90,180,365)),
 version INTEGER NOT NULL DEFAULT 0,
 updated_at TEXT NOT NULL
);
