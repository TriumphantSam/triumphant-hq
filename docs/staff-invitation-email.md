# Staff invitation emails

Owner invitation creation now optionally emails the colleague's sign-in
instructions. Pending invitations also offer an Email invitation action, plus
manual Share instructions with the actual expiry date. Email never grants
membership: the recipient must sign in using the invited verified email and
accept the recognised business. Staff remain unable to manage invitations.

Migration 0018 adds an email attempt state. One atomic reservation is permitted
per invitation. The provider request has a stable idempotency key; accepted,
in-flight and uncertain attempts are never automatically repeated. Provider
acceptance is labelled separately from delivery. A timeout or crash leaves a
reserved/uncertain state with manual sharing as fallback. This first increment
does not offer resend, bounce tracking or delivery webhooks.

Real email sending defaults off in both environments. It requires
PLATFORM_TEAM_EMAIL_ENABLED=true, existing Resend/from settings and an explicit
trusted HTTPS PLATFORM_WORKSPACE_URL ending exactly in /platform, without query,
fragment or credentials. Non-production sending additionally requires an exact
PLATFORM_TEAM_EMAIL_TEST_EMAIL recipient match. No browser-supplied link is used.
The email is plain text and contains neither credentials nor an access token.
Creation is limited by existing team capacity and invite throttling; email
attempts are limited to five per business per hour. Withdrawing an invitation
blocks acceptance even if a previously submitted email later arrives.

Local verification: 91 Worker tests and focused provider-mocked tests passed,
covering opt-in behavior, ownership, concurrent attempts, accepted replay,
ambiguous outcomes, withdrawn invitations, recipient restrictions and unchanged
membership. No real email was sent. Frontend and deployment acceptance is recorded
separately. Controlled real delivery requires a separately approved recipient.
