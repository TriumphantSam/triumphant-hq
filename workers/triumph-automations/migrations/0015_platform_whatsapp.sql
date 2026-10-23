CREATE TABLE platform_whatsapp_connections (
 workspace_id TEXT PRIMARY KEY REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 phone_number_id TEXT NOT NULL UNIQUE,
 messaging_account_id TEXT NOT NULL,
 business_id TEXT,
 display_phone TEXT,
 is_on_biz_app INTEGER NOT NULL DEFAULT 0 CHECK(is_on_biz_app IN (0,1)),
 token_ciphertext TEXT NOT NULL,
 token_iv TEXT NOT NULL,
 pin_ciphertext TEXT,
 pin_iv TEXT,
 state TEXT NOT NULL CHECK(state IN ('connected','disconnected')),
 connected_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);
CREATE INDEX platform_whatsapp_phone ON platform_whatsapp_connections(phone_number_id,state);
CREATE TABLE platform_whatsapp_threads (
 id TEXT PRIMARY KEY,
 workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 wa_id TEXT NOT NULL,
 label TEXT NOT NULL,
 paused INTEGER NOT NULL DEFAULT 0 CHECK(paused IN (0,1)),
 version INTEGER NOT NULL DEFAULT 0,
 updated_at TEXT NOT NULL,
 created_at TEXT NOT NULL,
 UNIQUE(workspace_id,wa_id)
);
CREATE INDEX platform_whatsapp_thread_inbox ON platform_whatsapp_threads(workspace_id,updated_at DESC);
CREATE TABLE platform_whatsapp_events (
 wamid TEXT PRIMARY KEY,
 workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 thread_id TEXT NOT NULL REFERENCES platform_whatsapp_threads(id) ON DELETE CASCADE,
 direction TEXT NOT NULL CHECK(direction IN ('in','out')),
 role TEXT NOT NULL CHECK(role IN ('customer','automation','team')),
 text TEXT NOT NULL,
 created_at TEXT NOT NULL
);
CREATE INDEX platform_whatsapp_event_thread ON platform_whatsapp_events(thread_id,created_at);
