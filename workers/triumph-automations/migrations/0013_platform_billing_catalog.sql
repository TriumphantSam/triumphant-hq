CREATE TABLE platform_billing_plans (
 plan_id TEXT PRIMARY KEY, amount INTEGER NOT NULL CHECK(amount>0),
 plan_code TEXT UNIQUE, state TEXT NOT NULL DEFAULT 'creating', created_at TEXT NOT NULL
);
