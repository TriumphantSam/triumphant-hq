ALTER TABLE platform_team_invites ADD COLUMN email_state TEXT NOT NULL DEFAULT 'not-sent' CHECK(email_state IN ('not-sent','sending','accepted','unconfirmed'));
ALTER TABLE platform_team_invites ADD COLUMN email_attempted_at TEXT;
