CREATE TABLE platform_whatsapp_test_settings (
 workspace_id TEXT PRIMARY KEY REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 enabled INTEGER NOT NULL DEFAULT 0 CHECK(enabled IN (0,1)),
 recipients TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(recipients) AND json_type(recipients)='array'),
 version INTEGER NOT NULL DEFAULT 0,
 updated_at TEXT NOT NULL
);
-- Missing rows mean testing is OFF; never enrol any existing phone implicitly.
