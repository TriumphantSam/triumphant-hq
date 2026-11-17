-- Preserve the payment ledger; only verified completed refunds remove access.
CREATE TABLE platform_billing_refunds (
 refund_id TEXT PRIMARY KEY,
 payment_reference TEXT NOT NULL REFERENCES platform_billing_payments(reference),
 mode TEXT NOT NULL CHECK(mode IN ('test','live')),
 amount INTEGER NOT NULL CHECK(amount>0),
 status TEXT NOT NULL CHECK(status IN ('pending','processing','needs-attention','failed','processed')),
 verified_at TEXT NOT NULL
);
CREATE INDEX platform_refund_payment ON platform_billing_refunds(payment_reference,status);
