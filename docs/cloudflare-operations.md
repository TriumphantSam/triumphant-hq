# Cloudflare website operations

## Live state

https://triumphantech.com is served by production Worker `triumphant-hq-web`.
`www.triumphantech.com` redirects to the canonical host, including asset paths.
Production is indexable; preview remains noindex at
https://triumphant-hq-web-preview.triumphantsam30.workers.dev.

Production deployment: `eeabad5f-8ff0-4b00-8e8a-23fc0906d286`.
Production has its own `triumphant-hq-web-cache` R2 bucket, 427 assets and 117
seeded cache entries. Gzip is 2,215.94 KiB. All uploads completed before testing.

Namecheap delegates to `cosmin.ns.cloudflare.com` and `jewel.ns.cloudflare.com`.
Free zone `b7b9a6c3e2aa32b63b75cf4a637c96c9` and Universal SSL are active.
Only root/www are proxied; the other 14 records remain DNS-only. Original website
destinations remain behind the Worker routes for rollback. Microsoft 365 MX
priority remains zero.

The scan found eight records and incorrectly proxied Microsoft aliases. All
missing records were added; all 16 names, values, TTLs and MX priority were
compared and queried directly before delegation. Two legacy relative host fields
contain the domain and resolve with repeated-domain names; these were preserved.
Backups and verification are in ignored `.cloudflare-dns-backup/`.

Existing WhatsApp/automation Workers were not modified; post-cutover etags match.
Unpublished operations-readiness work remains separate. Migration source started
from production main `60d726c`.

## Retained Node backend and schedules

The SEO scanner retains DNS-pinned HTTP on Node because Workers does not support
its lookup option. Cloudflare signs requests with dedicated HMAC and sends only
the target URL to the retained Vercel production endpoint:

https://triumphant-hq-adeyemi-olayemis-projects.vercel.app/api/internal/seo-snapshot

Backend deployment: `dpl_3Jt1PGPBBtPA4Qs99MsyTNBuQxX1`. Production no longer
depends on a preview deployment. The client restricts the HTTPS origin, refuses
redirects and uses deployment protection plus application HMAC. The endpoint
rejects unsigned/expired requests and private targets, and is absent on Cloudflare
(404). Keep Vercel production while this dependency remains.

Vercel retains website schedules `0 0 * * *` and `0 2 * * *`, plus legacy domain
redirects. Cloudflare has no scheduled triggers and SITE_CRON_ENABLED is false.
The separate automation Worker's schedules are unchanged.

`git.deploymentEnabled=false` disables automatic Vercel Git builds for ordinary
website pushes. Future Node releases require explicit production deployment.
Existing deployments/storage are not removed; review cleanup separately, keeping
the active backend and a rollback version.

## Verification and configuration

31 complete exportable production configurations were compared/reused. Sensitive
non-exportable credentials retain original local values. Owner access was set
locally without storing plaintext. Original env files were unchanged. Public
settings pack into SITE_PUBLIC_CONFIG: 58 secrets plus three preview or four
production text settings fit the binding limit. Expansion cannot replace private
settings/service bindings. Private files are ignored; the generated local env
fallback is removed before deploy.

- Next.js 16.4.3/OpenNext build, TypeScript and dry run pass; all 23 targeted tests
  pass. Changed-file lint passes except the existing seedForgeProducts warning.
- Canonical home, blog/article, products, sitemap, robots, platform and redirects
  pass. Root/www have Cloudflare headers; production has no preview noindex header.
  Live home rendering was inspected in the browser.
- Anonymous invoice/builder/cron requests reject access. Invoice login, HttpOnly
  session, database reads, builder authentication and owner dashboard reads pass
  on the canonical domain. No records were created.
- Production Node returns 401 without HMAC, 400 for a signed private target and
  200 with 17 checks for a signed public scan. Earlier real Cloudflare-to-Node
  acceptance returned 17 checks; its temporary Worker was removed.
- Malformed forms reject input before provider delivery. Nameservers and Microsoft
  365 MX were verified after cutover; non-website DNS values remain intact.

These checks do not prove real enquiry/email receipt, booking, payment settlement
or WhatsApp conversations. No real messages or purchases were sent. Turnstile's
canonical hosts remain authorized; preview was added preserving widget options.

## Manual releases

No automatic Cloudflare workflow or repository credentials were added. Start from
synchronized production source, verify the account, then deploy explicitly:

```powershell
git pull --ff-only origin main
npx wrangler whoami
node scripts/prepare-cloudflare-env.mjs
npm run test:automation
npm run test:cloudflare
npm run build:cloudflare
npx wrangler deploy --dry-run --env production
npx wrangler secret bulk tmp/cloudflare-secrets.json --env production
node node_modules/@opennextjs/cloudflare/dist/cli/index.js deploy --env production
```

Use the direct adapter command: this PowerShell/npm combination removed `--env`
when forwarded through an npm script. Wait for upload completion, then verify the
canonical domain, authentication and backend. Default target is preview; production
routes are scoped to root/www. Keep secrets out of logs and Git.

The middleware trace script repairs generated OpenTelemetry ESM traces without
editing installed packages. OpenNext Node middleware is experimental; retain
runtime authentication acceptance checks.

## Follow-ups and rollback

Hosted builder actions cannot persist repository JSON without a writable checkout;
retain local review/publish until durable publishing exists. Historical migration
notes record the pre-existing ELGCC credential overlap for separate owner review.

Rollback changes only root/www to DNS-only while original Vercel destinations
remain, or removes their Worker routes. Preserve mail, verification/VPS records,
Vercel production and DNS backups. Enable Cloudflare schedules only after disabling
the corresponding Vercel jobs and verifying dedicated secrets.
