# Operations readiness

## Backup and restore drill

Run from the repository in PowerShell 7 on Windows:

```powershell
./scripts/operations/backup-d1.ps1 -Environment staging
./scripts/operations/backup-d1.ps1 -Environment production
```

The script checks the TriumphantTech Cloudflare account, exports the selected D1
database, encrypts it with Windows DPAPI CurrentUser, decrypts that saved copy and
restores it into an isolated in-memory SQLite database. Integrity and foreign-key
checks must pass. Its private manifest records the SQL hash and per-table counts.
Plaintext SQL is removed in the finally block, including on verification errors.
The backup folder permits the current Windows identity only. SQL content,
credentials and customer records are never printed or committed.

Files live in `%USERPROFILE%/.codex/private-backups/triumphant-hq`. A `.sql.dpapi`
file and `.manifest.json` form a backup set. Keep both. DPAPI requires this Windows
profile and its recovery material: copying this file to another computer alone
does not make a portable disaster-recovery backup. This increment is manual;
there is no scheduled backup, off-device replication, backup-age monitor or
automated backup expiry. Those remain launch requirements.

25 October drill: actual staging and production exports both decrypted and
restored successfully in memory with integrity `ok` and zero foreign-key
violations. Remote databases were not restored or changed by the drill. Staging
was repeated to check the script can run again against an existing backup folder.

Cloudflare Time Travel was also queried read-only for production. The provider
documents an always-on recovery window of seven days on Workers Free or thirty
days on Workers Paid; do not assume this account's plan from a successful export.
See [Cloudflare Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/).
An in-place remote restore overwrites current data and cancels in-flight queries.
Before any real incident restore: stop writes and outbound processing, record a
fresh bookmark/export, choose the incident cutoff, obtain approval for that exact
restore target, then reconcile payments, accepted messages and post-cutoff
activity before resuming. The script deliberately offers no remote-restore action.

## Private operational warnings

`/admin/operations` uses the existing private owner-admin login, independently of
customer workspace sessions. Its signed `/v1/admin/operations` Worker endpoint
is not exposed by the customer RPC. It works while the customer platform is gated.
The page shows aggregate failed/unknown delivery jobs, pending jobs more than
fifteen minutes overdue, leases expired more than five minutes, and invitation
email outcomes needing review. Provider errors, message contents, customer emails
and tokens are excluded.

Migration 0021 records minute-cron start/completion/outcome and last successful
completion. Failed runs or no success within five minutes display attention.
Heartbeat-write failures are generic logged warnings and do not block existing
delivery work. Actual task failures preserve cron failure signalling and mark the
heartbeat failed. Provider acceptance is not delivery proof.

These are pull-based in-app warnings, not unattended incident notifications. No
email, SMS or WhatsApp alerts are sent. External uptime monitoring, backup-age
checks and all inline WhatsApp API failures remain outside this increment. Never
automatically replay payments or unknown provider outcomes from these counts.

## Owner retention preview

Migration 0020 stores a versioned owner preference: Off (default), 90, 180 or 365
days. Staff and other businesses cannot read or save it. Inbox shows counts of
closed enquiries (`won`/`lost`) with both creation and update older than the cutoff,
and past appointments whose end and update are older than the cutoff. Active
enquiries and future appointments stay outside the preview. Time is an exact
elapsed-day cutoff, displayed in Lagos; it is not a calendar-midnight deletion job.

Saving a preference never deletes or anonymises anything. There is no purge RPC,
deletion scheduler or activation flag. Billing, messages, internal notes, staff
history, exports, backups and provider copies need separate policies and lawful
handling. Existing agency-table cleanup is unchanged and is not controlled by
this preview. A future destructive rollout requires a complete preview, backup
and recovery plan plus explicit activation; a saved window is not consent to purge.

Local validation: 97 Worker tests passed, including retention isolation, stale
versions, no deletion, active/future exclusions, cron heartbeat and private job
warning distinctions. Worker/frontend TypeScript and targeted ESLint passed.
Migrations must precede deployment. Staging browser acceptance is recorded below.

27 October integration: PR #28 includes the current main branch's Cloudflare
website migration and automatic deployment setup. Vercel is retired; use the
existing Cloudflare website preview for acceptance. That preview's automation
bridge now targets triumph-automations-staging, with its matching private key.
Production bridge/settings are unchanged. Backend migrations/releases remain
separate from the website deployment workflow.

Fresh staging and production protected exports were both restored successfully
in isolated memory on 27 October. The private files remain under the same
current-user backup folder. Remote restore was not performed. The staged signed
operations endpoint returned 401 unsigned and 200 signed, with seven queue
groups and a recent successful cron heartbeat. Existing warnings can remain even
when cron is healthy; this is not a claim that every delivery succeeded.

After merging main, all 97 Worker tests, 15 website tests and 9 Cloudflare
compatibility tests passed again. Website preview build/browser acceptance is
being completed; production has not received this increment.
