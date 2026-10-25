# Cloudflare website migration

## Current state — 25 October 2026

The website is deployed separately at:

https://triumphant-hq-web-preview.triumphantsam30.workers.dev

Last code deployment: `f0a9d12a-638b-4fb6-997d-0bfb58e80aff`. Later secret updates create separate active versions.
The canonical domain is still served by Vercel. The new Cloudflare zone contains a verified DNS-only copy of all 16 original
records. Namecheap now delegates to Cloudflare; the zone and Universal SSL certificate
are active. Website records still point to Vercel. Webhook subscriptions, existing
automation Workers and Vercel schedules remain unchanged.
This branch starts from production `main` (`60d726c`); the unpublished operations
readiness work remains on its original branch.

The preview now uses 31 complete exportable production configurations retrieved
from Vercel, with local credentials retained for sensitive settings Vercel cannot
export. Owner access was configured locally without logging the password. All
NEXT_PUBLIC settings are packed into SITE_PUBLIC_CONFIG: 58 secret bindings plus
three text settings fit the Free plan's 64-variable limit. Only public keys can be
expanded from the pack; service bindings and private settings cannot be replaced.
Private configuration files and DNS backups are ignored by Git. The generated
OpenNext environment fallback is removed before deployment.

## Verified

- Next.js 16.4.3 production build, TypeScript and OpenNext build pass.
- 15 existing automation tests and eight migration tests pass.
- Changed-file lint passes (the pre-existing unused `seedForgeProducts` warning remains).
- Wrangler dry run: 2,215.94 KiB gzip, 427 asset files; preview deployment completed.
- Remote R2 cache seeded with 117 entries; the last eight changed assets uploaded.
- Local and deployed Workers: home, dynamic blog index, article, product catalogue,
  sitemap, robots, platform page and SEO URL redirect return expected responses.
- Invoice and builder protection reject anonymous requests. Builder authentication,
  invoice login, signed session verification and a read of the existing invoice
  database succeed on the deployed Worker. No invoice records were created.
- Malformed contact submissions are rejected before delivery.
- Mobile home/menu visually checked; live home-page console reports no errors.
  A later contact-page browser check received HTTP 400 from the Turnstile challenge;
  error code `110200` identified the missing hostname authorization. The exact
  preview hostname was added to the existing widget while preserving both
  production hostnames; the preview server allowlist also includes it. Automated
  challenge completion and real submission acceptance remain unresolved.
- Preview responses carry `X-Robots-Tag: noindex, nofollow`.
- Cloudflare preview has no schedules. The scheduled handler also requires
  `SITE_CRON_ENABLED=true`, preventing duplicate follow-ups during migration.

These checks do not establish delivery of a real form enquiry, payment settlement,
email receipt, booking, or WhatsApp conversation. No real messages or purchases
were sent as migration acceptance tests.

## Release blockers

1. **Stable SEO Node backend.** The scanner keeps its DNS-pinned HTTP implementation
   on Node because Workers does not support its lookup option. A dedicated HMAC
   endpoint binds the timestamp and exact request body; the client restricts the
   HTTPS Vercel origin and refuses redirects. Unsigned requests return 401 and
   private targets return 400. A real Cloudflare-to-protected-Node scan returned
   200 with 17 checks. The temporary acceptance Worker was removed. The current
   backend is a protected Vercel preview deployment; establish a retained production
   backend before cutover. Do not remove Vercel while this dependency remains.
2. **Configuration verification.** Exportable production settings are compared and
   complete, including the delivery override JSON. Signed owner dashboard access,
   invoice login/database reads and builder authentication passed on Cloudflare.
   Sensitive non-exportable credentials use original local values; real delivery
   and payment remain separate acceptance checks.
3. **DNS cutover.** A complete local backup now contains 15 host records and one
   Microsoft 365 MX record, with priority, TTL and original nameservers. Two host
   fields already include the domain and consequently resolve with a repeated
   domain suffix: preserve the actual existing names, do not silently repair them.
   The Free zone `b7b9a6c3e2aa32b63b75cf4a637c96c9` is created with
   `cosmin.ns.cloudflare.com` and `jewel.ns.cloudflare.com`. All 16 DNS-only records
   match the backup, including original TTLs; direct authoritative queries matched
   all 16 values and MX priority. The automatic scan found only eight records and
   incorrectly proxied Microsoft aliases; these were corrected and all missing
   records were added manually. Namecheap saved both assigned nameservers, and the zone activated at
   19:10 UTC on 25 October. Universal SSL for the root and wildcard is active.
   Website routing remains on Vercel until production Worker acceptance passes.
4. **End-to-end acceptance.** Turnstile hostname configuration is prepared for the
   preview, but a successful challenge/submission is still unverified. Verify enquiry storage/delivery,
   booking and payment callbacks with a controlled test and cleanup before release.
5. **Builder publishing.** Existing builder actions update repository JSON only
   when a writable checkout is available. Deployed Workers cannot persist those
   changes to Git. Confirm the local review/publish workflow or implement durable
   publishing before relying on the hosted builder's state after reload.
6. **Credential reuse in local settings.** The local `ELGCC_FORWARD_SECRET` value
   also occurs within the public PostHog project identifier. This overlap was
   already present in the local configuration; the migration does not introduce
   the analytics identifier. Confirm whether that forwarding secret is active,
   and replace it at both ends with an independent private value if it is.

## Commands

```powershell
npm ci
node scripts/prepare-cloudflare-env.mjs
npm run test:automation
npm run test:cloudflare
npm run build:cloudflare
npm run check:cloudflare
npm run preview:cloudflare
```

`prepare-cloudflare-env.mjs` reads local env files and writes ignored `.dev.vars`
and `tmp/cloudflare-secrets.json`, printing names/counts only, never values. It reads the ignored production configuration and local Cloudflare overrides;
non-exportable credentials still require functional verification.

```powershell
node node_modules/wrangler/bin/wrangler.js whoami
node node_modules/wrangler/bin/wrangler.js secret bulk tmp/cloudflare-secrets.json --name triumphant-hq-web-preview
npm run deploy:cloudflare
```

The default Wrangler target is explicitly named `triumphant-hq-web-preview` and has
no custom-domain routes. The `production` environment is a separate
`triumphant-hq-web` service with its own cache bucket and scheduling disabled.
Production Worker and its separate cache bucket have now been created. Asset
upload and production acceptance must complete before website routing changes.

`scripts/cloudflare-middleware-trace.mjs` repairs a generated dependency trace:
Next traces OpenTelemetry's CommonJS entry, but OpenNext's middleware bundler selects
its ESM entry. It includes the missing ESM files in the generated trace and standalone
directory without editing installed packages. Node middleware support in OpenNext
is experimental, so retain runtime authentication checks in release acceptance.

## Cutover and rollback

Resolve every blocker above, then deploy and test the production Worker without
moving the domain. Attach the canonical and legacy/www hosts, verify redirects for
both pages and static files, and preserve all mail and verification records.

Disable the two Vercel site schedules before adding Cloudflare cron expressions
`0 0 * * *` and `0 2 * * *` and enabling `SITE_CRON_ENABLED`. Verify the correct
dedicated job secrets. The existing automation Worker's own schedules remain separate.

Keep the previous Vercel deployment and DNS export until live acceptance passes.
Rollback restores website routing to Vercel, disables Cloudflare site schedules,
and restores the corresponding Vercel schedules. Delete old Vercel deployments
only after confirming which projects consume deployment storage and retaining a
known-good rollback deployment.
