CREATE TABLE platform_setup_preferences (
 workspace_id TEXT PRIMARY KEY REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 business_type TEXT NOT NULL DEFAULT 'services' CHECK(business_type IN ('services','appointments','shop')),
 appointments INTEGER NOT NULL DEFAULT 1 CHECK(appointments IN (0,1)),
 team INTEGER NOT NULL DEFAULT 0 CHECK(team IN (0,1)),
 channel TEXT NOT NULL DEFAULT 'both' CHECK(channel IN ('whatsapp','website','both')),
 version INTEGER NOT NULL DEFAULT 0,
 updated_at TEXT NOT NULL
);
ALTER TABLE platform_booking_policy ADD COLUMN reviewed_at TEXT;
