CREATE TABLE platform_refund_checks (
 payment_reference TEXT PRIMARY KEY,
 workspace_id TEXT NOT NULL REFERENCES platform_workspaces(id),
 mode TEXT NOT NULL CHECK(mode IN ('test','live')),
 blocking INTEGER NOT NULL DEFAULT 0 CHECK(blocking IN (0,1)),
 state TEXT NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','verified','needs-review')),
 next_check_at TEXT NOT NULL,
 lease_until TEXT,
 version INTEGER NOT NULL DEFAULT 0,
 last_checked_at TEXT
);
CREATE INDEX platform_refund_due ON platform_refund_checks(mode,next_check_at);
