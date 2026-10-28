CREATE TABLE platform_trials (
 workspace_id TEXT PRIMARY KEY REFERENCES platform_workspaces(id) ON DELETE CASCADE,
 user_id TEXT NOT NULL UNIQUE REFERENCES platform_auth_user(id),
 started_at TEXT NOT NULL,
 expires_at TEXT NOT NULL
);
CREATE TABLE platform_billing_plans_versioned (
 plan_id TEXT NOT NULL, amount INTEGER NOT NULL CHECK(amount>0),
 plan_code TEXT UNIQUE, state TEXT NOT NULL DEFAULT 'creating', created_at TEXT NOT NULL,
 PRIMARY KEY(plan_id,amount)
);
INSERT INTO platform_billing_plans_versioned SELECT plan_id,amount,plan_code,state,created_at FROM platform_billing_plans;
DROP TABLE platform_billing_plans;
ALTER TABLE platform_billing_plans_versioned RENAME TO platform_billing_plans;
