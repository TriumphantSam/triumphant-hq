# Owner support diagnostics

The private `/admin/platform` screen now opens an individual business by exact
workspace ID, either from its overview card or the lookup form. The separate
owner-admin login is required before any backend request. Workspace email-code
sign-in does not grant operator access. The backend uses the existing signed,
nonce-protected admin endpoint; customer RPC exposes no support action.

Diagnostics show the saved plan choice separately from verified entitlement,
the Lagos monthly assistant-reply count and effective allowance, accepted member
and unexpired pending-invitation counts, required setup evidence and launch gates.
Payment verification uses the local verified ledger. Opening this view does not
call Paystack or Meta, send messages, invite staff, alter subscriptions, resume
automation or change customer settings.

The response deliberately excludes customer contacts, conversation contents,
owner email, authentication records, provider tokens and business answer text.
Support reads saved metadata and counts only. Configured channels are not proof
of delivery. No impersonation, access override, refund, suspension or purge
control is introduced. Escalate payment discrepancies for a separate provider
review; guide the customer owner to the named workspace step for setup changes.

No migration is needed. This branch depends on PR #40 (and its prerequisites).
Deploy the automation staging Worker before the website preview. Keep existing
test-billing overrides and production launch/billing flags unchanged. Verify the
admin login gate and open synthetic-business diagnostics before review approval.
