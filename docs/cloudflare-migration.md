# Cloudflare website migration

## Current state — 25 October 2026

The website is deployed separately at:

https://triumphant-hq-web-preview.triumphantsam30.workers.dev

Worker version: `88f4145c-a08e-4a1f-8840-b255e9af806d`.
The canonical domain is still served by Vercel. No DNS records, webhook subscriptions,
existing automation Workers, or Vercel schedules were changed.
This branch starts from production `main` (`60d726c`); the unpublished operations
readiness work remains on its original branch.

The preview uses the existing local settings as a baseline, with production-local
overrides. These have **not** been compared with the live Vercel environment.
57 settings were stored as secrets on the new preview Worker. Secret values are
excluded from Git and the OpenNext env-file fallback is removed before deployment.

## Verified

- Next.js 16.4.3 production build, TypeScript and OpenNext build pass.
- 15 existing automation tests and four migration tests pass.
- Changed-file lint passes (the pre-existing unused `seedForgeProducts` warning remains).
- Wrangler dry run: 2,212.31 KiB gzip, 424 asset files; preview deployment completed.
- Remote R2 cache seeded with 117 entries; all 180 changed assets uploaded.
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

1. **SEO snapshot runtime.** `lib/seo-audit.ts` validates DNS answers and pins the
   HTTP connection to a validated IP. Cloudflare's Node HTTP implementation rejects
   the `lookup` option. A read-only local Workers probe failed with
   `The options.lookup option is not implemented`. Keep this scanner on a
   compatible Node backend and verify the frontend-to-backend path before cutover.
   Do not replace this with an unpinned fetch that weakens the existing SSRF checks.
   References: [Cloudflare HTTP support](https://developers.cloudflare.com/workers/runtime-apis/nodejs/http/)
   and [DNS support](https://developers.cloudflare.com/workers/runtime-apis/nodejs/dns/).
2. **Live configuration comparison.** The Vercel connection returns 403 for team
   `adeyemi-olayemis-projects`; team authorization is required. Compare all current
   production variables, public build settings, backend URLs, webhook secrets,
   invoice credentials and scheduled-job secrets before production deployment.
   Sensitive variables that Vercel cannot export need secure entry from their
   original source, never copying into chat or Git.
3. **DNS cutover.** `triumphantech.com` uses `dns1.registrar-servers.com` and
   `dns2.registrar-servers.com`. It is not a zone in the authenticated Cloudflare
   account. Export and preserve the complete DNS zone (especially mail records)
   before changing nameservers or website routing. Keep a rollback record.
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
and `tmp/cloudflare-secrets.json`, printing names/counts only, never values. These
are a preview baseline, not proof that current production credentials were copied.

```powershell
node node_modules/wrangler/bin/wrangler.js whoami
node node_modules/wrangler/bin/wrangler.js secret bulk tmp/cloudflare-secrets.json --name triumphant-hq-web-preview
npm run deploy:cloudflare
```

The default Wrangler target is explicitly named `triumphant-hq-web-preview` and has
no custom-domain routes. The `production` environment is a separate
`triumphant-hq-web` service with its own cache bucket and scheduling disabled.
Production resources have not been created by this migration.

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
