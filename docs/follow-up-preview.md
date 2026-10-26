# Follow-ups: preview first

Run `npm run preview:follow-ups` from the repository root. This performs a fixed
read-only query against the existing production D1 database, writes local reports
under ignored `output/followups/`, and prints aggregate counts only. The tool has
no email provider, database update, queue insertion or sending mode.

The first live preview inspected three leads: one SEO snapshot without marketing
consent and two unsupported sources. Zero recipients were eligible. No records
were created or changed and no messages were sent.

An SEO draft requires recorded consent and its timestamp, a new lead status,
no booking, a lead age of 1-7 days, and a confirmed initial reply at least one day
old. Only the newest enquiry per address is considered, so a newer enquiry
without consent suppresses an older consenting one. Records edited after their
consent timestamp require manual review, because the existing capture path can
merge repeat enquiries without renewing consent. Drafts include stable keys for
a future durable reservation; this preview itself is not a delivery ledger.

Digital Forge does not have a durable campaign queue. Its funnel sends an
immediate confirmation, and the course waitlist sends an owner notification;
neither creates a consent-aware nurture sequence. Transactional purchase records
must not be treated as marketing permission. A campaign capture/unsubscribe and
delivery ledger are required before an automatic runner can be enabled.

The old Python sender reads a different Airtable queue, omits consent checks,
has no send reservation, and advances a failed message's step. Do not reactivate
that sender. Website runner routes are changed to return explicit preview-only
409 responses after authentication instead of forwarding to it or claiming a
successful zero-message run. Unauthenticated calls remain 401. Website schedules
remain disabled. The independent automation Worker's existing schedule is unchanged.

The obsolete Vercel cron definitions are removed from source, and the existing
project's cron feature was disabled in its dashboard. API readback confirms a
disabledAt timestamp later than enabledAt. Their old definitions remain listed
but will not run. The independent automation Worker's schedules were not changed.

Tests: `node --test scripts/follow-up-preview.test.mjs` and
`npx tsx --test lib/follow-up-preview-response.test.ts`.
