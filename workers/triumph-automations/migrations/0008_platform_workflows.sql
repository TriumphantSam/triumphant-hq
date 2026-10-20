CREATE TABLE platform_leads (
 id TEXT PRIMARY KEY, workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 request_id TEXT NOT NULL, request_digest TEXT NOT NULL,
 name TEXT NOT NULL, email TEXT NOT NULL, need TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','qualified','won','lost')),
 version INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 UNIQUE(workspace_id,request_id)
);
CREATE INDEX platform_leads_scope ON platform_leads(workspace_id,created_at);
CREATE TABLE platform_bookings (
 id TEXT PRIMARY KEY, workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 request_id TEXT NOT NULL, request_digest TEXT NOT NULL, manage_digest TEXT NOT NULL,
 name TEXT NOT NULL, email TEXT NOT NULL, start TEXT NOT NULL, end TEXT NOT NULL,
 blocked_until TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'confirmed' CHECK(state IN ('confirmed','cancelled')),
 version INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 UNIQUE(workspace_id,request_id)
);
CREATE INDEX platform_bookings_scope ON platform_bookings(workspace_id,start,state);
CREATE TABLE platform_reply_requests (
 workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 request_id TEXT NOT NULL, payload_digest TEXT NOT NULL, reply TEXT NOT NULL,
 claim_id TEXT NOT NULL, created_at TEXT NOT NULL, PRIMARY KEY(workspace_id,request_id)
);
