ALTER TABLE platform_responder_settings ADD COLUMN ai_enabled INTEGER NOT NULL DEFAULT 0 CHECK(ai_enabled IN (0,1));
CREATE TABLE platform_ai_requests (
 workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 request_id TEXT NOT NULL, digest TEXT NOT NULL,
 state TEXT NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','complete')),
 ids TEXT NOT NULL DEFAULT '[]', handoff INTEGER NOT NULL DEFAULT 1,
 input_tokens INTEGER NOT NULL DEFAULT 0, output_tokens INTEGER NOT NULL DEFAULT 0,
 created_at TEXT NOT NULL, PRIMARY KEY(workspace_id,request_id)
);
CREATE INDEX platform_ai_month ON platform_ai_requests(workspace_id,created_at);
CREATE INDEX platform_ai_day ON platform_ai_requests(created_at);
