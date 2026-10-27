# Encrypted offsite backups

Daily target: 02:00 Lagos (01:00 UTC), one dated object per environment per UTC
day. Repeating a run replaces that day's object. GitHub schedules may start late.
The private R2 bucket `triumphant-hq-backups` expires its `daily/` objects after
14 days. This targets fourteen daily copies: missed runs mean fewer copies and
asynchronous expiry may briefly leave older objects. Live customer records and
their retention preferences are unaffected.

## Recovery design

Official Wrangler D1 SQL exports pass an isolated SQLite restore before upload.
SQL is gzip-compressed and encrypted with AES-256-GCM and a random nonce. Each
archive is uploaded, downloaded, authenticated, decrypted and restored again.
Integrity, foreign keys, expected tables and recovered SQL SHA-256 must pass.
Only then is `status/<environment>.json` updated. The marker contains environment,
object path and verification time, without customer records. Temporary SQL and
archives are cleaned up in finally blocks. No plaintext CI artifacts are uploaded.

Keep the recovery key independently of GitHub, Cloudflare and the laptop profile.
The local DPAPI-wrapped copy alone is not portable. To copy the existing key
privately using PowerShell 7, run the following, then paste it into a password
manager entry named `TriumphantTech offsite backup key` and clear the clipboard:

```powershell
& "C:\Users\Adeyemi Olayemi\.codex\worktrees\operations-readiness\triumphant-hq\scripts\operations\copy-recovery-key.ps1"
```

Never paste it in chat. Preserve old keys until their archives expire. For a
recovery drill, use Wrangler `r2 object get` to download an encrypted object to a
private folder, set `BACKUP_ENCRYPTION_KEY` privately in the process environment,
then run:

```powershell
node scripts/operations/restore-offsite-backup.mjs "<private archive path>"
```

This verifies in-memory recovery only. Real remote restoration requires paused
writes/outbound jobs, exact-target approval, a recovery plan and reconciliation of
external payments/messages. R2 and D1 share a Cloudflare account: this protects
against database or laptop loss, not total Cloudflare-account loss.

## Activation gates

1. Verify public access is disabled and `daily-14-days` lifecycle is enabled.
2. Save a dedicated Cloudflare account-scoped token as Actions secret
   `BACKUP_CLOUDFLARE_API_TOKEN`, with D1 Edit and Workers R2 Storage Edit for the
   TriumphantTech account only. Do not upload the broad interactive OAuth token.
3. Save the generated recovery key as Actions secret `BACKUP_ENCRYPTION_KEY` and
   confirm an independent password-manager copy exists.
4. Merge reviewed workflows to main, manually dispatch `Encrypted offsite backups`
   and confirm both downloaded restores pass using the dedicated token. Then set
   repository variable `OFFSITE_BACKUPS_ENABLED=true` to enable daily scheduling.
5. Dispatch `Operations monitor`, verify its checks and a controlled failure,
   then set `OPERATIONS_MONITOR_ENABLED=true` to enable scheduled checks.

Scheduled runs remain gated off until their variables are enabled. Manual runs
on main permit acceptance testing first. Interactive OAuth drills do not prove
unattended credentials work.

## Monitoring limits

An independent GitHub workflow checks website availability, production automation
heartbeat (five-minute threshold) and fully verified production backup age
(36-hour threshold), approximately every fifteen minutes. Failures emit generic
check names, without SQL responses, credentials or customer content. No jobs are
replayed. Owner GitHub Actions notifications can report failed runs, but inbox
delivery has not been verified. GitHub outages can stop the monitor itself.

Resend incident emails have a separate disabled-by-default activation gate.
See [incident notifications](incident-notifications.md) for duplicate suppression,
the controlled delivery drill and notification limitations.

27 October drill: real staging and production encrypted archives were uploaded,
downloaded and restored successfully using the interactive Cloudflare login.
Live databases were unchanged. Encryption tests reject wrong keys, corrupted
headers/nonces/tags/ciphertext and truncated archives.
