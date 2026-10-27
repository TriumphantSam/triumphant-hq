ALTER TABLE platform_billing ADD COLUMN next_check_at TEXT NOT NULL DEFAULT '1970-01-01T00:00:00.000Z';
ALTER TABLE platform_billing ADD COLUMN mode TEXT NOT NULL DEFAULT 'test' CHECK(mode IN ('test','live'));
ALTER TABLE platform_billing_payments ADD COLUMN mode TEXT NOT NULL DEFAULT 'test' CHECK(mode IN ('test','live'));
ALTER TABLE platform_billing ADD COLUMN reconcile_lease_until TEXT;
ALTER TABLE platform_billing ADD COLUMN last_verified_at TEXT;
ALTER TABLE platform_billing ADD COLUMN reconcile_state TEXT NOT NULL DEFAULT 'pending';
CREATE INDEX platform_billing_due ON platform_billing(next_check_at,reconcile_lease_until);
