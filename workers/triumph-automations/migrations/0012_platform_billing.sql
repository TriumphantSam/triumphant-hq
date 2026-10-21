CREATE TABLE platform_billing (
 workspace_id TEXT PRIMARY KEY REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 request_id TEXT NOT NULL, reference TEXT NOT NULL UNIQUE,
 email TEXT NOT NULL, plan_id TEXT NOT NULL, plan_code TEXT NOT NULL,
 amount INTEGER NOT NULL CHECK(amount>0),
 state TEXT NOT NULL DEFAULT 'initializing', checkout_url TEXT,
 subscription_code TEXT UNIQUE, customer_code TEXT,
 paid_through TEXT, cancel_requested INTEGER NOT NULL DEFAULT 0 CHECK(cancel_requested IN (0,1)),
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE platform_billing_payments (
 reference TEXT PRIMARY KEY, provider_id TEXT NOT NULL UNIQUE,
 workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 amount INTEGER NOT NULL, paid_at TEXT NOT NULL, period_end TEXT NOT NULL
);
