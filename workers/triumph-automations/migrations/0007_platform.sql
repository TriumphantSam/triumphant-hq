CREATE TABLE platform_auth_user (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
 email_verified INTEGER NOT NULL, image TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE TABLE platform_auth_session (
 id TEXT PRIMARY KEY, expires_at INTEGER NOT NULL, token TEXT NOT NULL UNIQUE,
 created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, ip_address TEXT, user_agent TEXT,
 user_id TEXT NOT NULL REFERENCES platform_auth_user(id) ON DELETE CASCADE
);
CREATE INDEX platform_auth_session_user ON platform_auth_session(user_id);
CREATE TABLE platform_auth_account (
 id TEXT PRIMARY KEY, account_id TEXT NOT NULL, provider_id TEXT NOT NULL,
 user_id TEXT NOT NULL REFERENCES platform_auth_user(id) ON DELETE CASCADE,
 access_token TEXT, refresh_token TEXT, id_token TEXT, scope TEXT, password TEXT,
 access_token_expires_at INTEGER, refresh_token_expires_at INTEGER,
 created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE INDEX platform_auth_account_user ON platform_auth_account(user_id);
CREATE TABLE platform_auth_verification (
 id TEXT PRIMARY KEY, identifier TEXT NOT NULL, value TEXT NOT NULL,
 expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE INDEX platform_auth_verification_identifier ON platform_auth_verification(identifier);
CREATE TABLE platform_workspaces (
 id TEXT PRIMARY KEY, owner_user_id TEXT NOT NULL UNIQUE REFERENCES platform_auth_user(id),
 name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', timezone TEXT NOT NULL DEFAULT 'Africa/Lagos',
 contact_url TEXT NOT NULL DEFAULT '', plan_id TEXT NOT NULL DEFAULT 'starter',
 state TEXT NOT NULL DEFAULT 'draft' CHECK(state IN ('draft','testing','published','suspended')),
 version INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE platform_memberships (
 workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 user_id TEXT NOT NULL REFERENCES platform_auth_user(id) ON DELETE CASCADE,
 role TEXT NOT NULL CHECK(role IN ('owner','staff')), PRIMARY KEY(workspace_id,user_id)
);
CREATE TABLE platform_faqs (
 workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 id TEXT NOT NULL, question TEXT NOT NULL, answer TEXT NOT NULL,
 PRIMARY KEY(workspace_id,id)
);
CREATE TABLE platform_booking_policy (
 workspace_id TEXT PRIMARY KEY REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 days TEXT NOT NULL DEFAULT '[1,2,3,4,5]', start_hour INTEGER NOT NULL DEFAULT 10,
 end_hour INTEGER NOT NULL DEFAULT 16, duration INTEGER NOT NULL DEFAULT 30,
 buffer INTEGER NOT NULL DEFAULT 15, notice_hours INTEGER NOT NULL DEFAULT 24
);
CREATE TABLE platform_events (
 id TEXT PRIMARY KEY, workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 actor_user_id TEXT NOT NULL, type TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE INDEX platform_events_scope ON platform_events(workspace_id,created_at);
CREATE TABLE platform_usage (
 workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 period TEXT NOT NULL, kind TEXT NOT NULL, count INTEGER NOT NULL DEFAULT 0,
 PRIMARY KEY(workspace_id,period,kind)
);
CREATE TABLE platform_requests (
 workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 request_id TEXT NOT NULL, payload_digest TEXT NOT NULL, response TEXT,
 created_at TEXT NOT NULL, PRIMARY KEY(workspace_id,request_id)
);
