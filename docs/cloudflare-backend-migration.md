# Remaining backend migration: prepared, not released

The live website and Vercel backend are unchanged by this branch. The scanner
container is opt-in; the production site continues using Vercel until remote
acceptance succeeds. No paid plan, container, cron trigger or new outbound message
has been activated.

## Scanner implementation

`cloudflare/seo-container/` packages the existing Node scanner, preserving DNS
pinning, validation of every DNS answer and redirect, TLS verification, standard
ports, timeouts, identity encoding and the 2 MB body limit. Replacing it with a
preflight DNS lookup plus ordinary fetch would lose connection pinning.

The private Worker authenticates the timestamped HMAC and validates the small URL
payload before starting the container. There is no public workers.dev or preview
URL. Only the target URL is sent; cookies and Vercel bypass credentials are stripped.
The Node process verifies HMAC again, rejects oversized/chunked payloads and extra
fields, admits at most two concurrent scans, and does not expose internal errors.

One lite instance is allowed and sleeps after 30 idle seconds. These controls
limit resource use but are not a hard monetary spending cap. The container runs
as the non-root node user. Its image context includes only the compiled server;
local environment files and website credentials are excluded.

The existing client has an inactive opt-in path: setting
`SEO_SCANNER_BACKEND=cloudflare-container` uses private `SEO_SCANNER` binding with
the existing shared secret. Missing binding/configuration fails closed. The
default Vercel transport remains intact. Redirect responses are rejected on both
paths, and the container path has a 30-second cold-start/request budget.

## Scheduled-job findings

Read-only Vercel environment inventory found none of CRON_SECRET,
SEO_FOLLOWUP_CRON_SECRET or FOLLOW_UP_RUNNER_SECRET (hidden production count was
zero). Both website cron routes therefore reject scheduled calls with 401.
Do not describe the existing schedule definitions as verified working jobs.

- The 00:00 UTC SEO job proxies to `seo-api.triumphantech.com`. Its Python source
  is in the separate local Trium-Seo project. The sender reads Airtable sequences,
  checks stop/booked status, sends EmailJS or SMTP and updates delivery state.
  Moving the trigger alone does not move that backend. Hosting and existing due
  queue must be audited before enabling sends, including idempotency/consent.
- The 02:00 UTC Digital Forge route returns zero processed/sent/failed; it is a
  placeholder, not a working delivery runner. Copying that trigger would not
  create functional follow-ups.

Keep both new Cloudflare triggers disabled until the intended behavior, backend
configuration and controlled acceptance are established. Remove/disable the
corresponding Vercel definitions before enabling replacements, and do not touch
the independent automation Worker's schedules.

## Cost and release gates

Validation completed: 13 targeted scanner/bridge tests (including four new
container tests), root and container TypeScript checks, changed-file lint,
Next/OpenNext website build, website dry run (2,216.95 KiB gzip), and private
gateway dry run (29.37 KiB gzip). The locally executed Node bundle returned all
17 checks for example.com and rejected both a private IP and private DNS target.
Chunked oversize HTTP input is covered separately from Content-Length rejection.

Cloudflare Containers requires Workers Paid: USD 5/month with included allowances,
plus usage charges beyond those allowances. The DNS zone can remain Free.
Sources: [Container pricing](https://developers.cloudflare.com/containers/platform/pricing/)
and [deployment requirements](https://developers.cloudflare.com/containers/get-started/).
The paid upgrade needs user authorization; no subscription was purchased.

Docker is not installed here. The built Node bundle was tested locally, but the
Docker image build and remote Container execution remain unverified. Wrangler's
full image dry run stops at the missing Docker executable. The Worker-only dry
run with `--containers-rollout=none` succeeds; it is not an image acceptance test.

Local preparation:

```powershell
npm run build:seo-container
npm run test:seo-container
npx tsc --project cloudflare/seo-container/tsconfig.json
npx wrangler deploy --dry-run --containers-rollout=none --config cloudflare/seo-container/wrangler.jsonc
```

After approved paid setup and Docker availability, build/test the image and deploy
the isolated service with its shared secret securely configured. Verify actual
Cloudflare-to-container-to-public-site scans, private/mixed-DNS rejection, redirect
bounds and invalid TLS rejection. Wire only website preview first:

```json
{
  "vars": { "SEO_SCANNER_BACKEND": "cloudflare-container" },
  "services": [{ "binding": "SEO_SCANNER", "service": "triumphant-hq-seo" }]
}
```

Append to existing bindings; do not replace ASSETS, self-reference or R2 bindings.
Test before enabling the production flag. Keep Vercel until production acceptance
and all legacy-domain redirects/schedules have separate replacements. Rollback
removes the opt-in flag and keeps the Vercel backend configuration.
