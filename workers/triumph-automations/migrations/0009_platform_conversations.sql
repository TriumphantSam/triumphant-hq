CREATE TABLE platform_responder_settings (
 workspace_id TEXT PRIMARY KEY REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 welcome TEXT NOT NULL, away TEXT NOT NULL, fallback TEXT NOT NULL,
 enabled INTEGER NOT NULL DEFAULT 1 CHECK(enabled IN (0,1)),
 version INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL
);
CREATE TABLE platform_conversations (
 id TEXT PRIMARY KEY,
 workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 label TEXT NOT NULL,
 messages TEXT NOT NULL CHECK(json_valid(messages)),
 paused INTEGER NOT NULL DEFAULT 0 CHECK(paused IN (0,1)),
 version INTEGER NOT NULL DEFAULT 0,
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX platform_conversation_inbox ON platform_conversations(workspace_id,updated_at DESC);
