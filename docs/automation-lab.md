# Automation Lab: implementation and launch record

Date: 13 October 2026. Branch: `codex/automation-lab`.

## Scope and current status

The supplied SUMMARY and CODEX_BRIEF describe a multi-phase programme. They are
requirements and prior observations, not proof of the current configuration or
authorization to migrate hosting, replace the WhatsApp bot, send campaigns, or
enable live payments. This delivery implements the initial repair and lead
foundation. **It does not complete or launch all seven live automations.**

| Area | Implemented | Still required |
| --- | --- | --- |
| SEO snapshot | Native Node audit, bounded fetch, safe DNS pinning, HTML parser, current response contract | Preview/live validation and client-site acceptance checks |
| Lead capture | D1 storage, rolling ten-minute merge, durable jobs, authenticated server gateway; staging Worker and protected Vercel preview verified through a browser submission | Production configuration, abuse controls and broader acceptance |
| Google Sheets | Keyless bound-script connector, scoped HMAC, reference upsert/ack; scheduled script acknowledged backend and website test records | Retention/deletion procedure and production acceptance |
| Email | Resend enquiry acknowledgement and owner alert, retries, provider idempotency key; backend and website test email pairs reported delivered by Resend | Production configuration and broader acceptance |
| WhatsApp | Existing Worker identified and health-checked; production preserved | Validate token, confirm Meta webhook registration, approve bridge and new menu flows |
| Booking | Link to existing Cal.com calendar | Approved hours; native booking/capacity, cancellation, ICS and reminders |
| AI chat | Clearly marked planned flow | Approved KB, provider, handoff and golden-question tests |
| Payments | Clearly marked planned test flow | Paystack test keys, webhook verification, invoice/receipt implementation and replay tests |
| Reviews | Documented non-gating flow | Confirm Place ID, customer completion triggers and opt-in messaging |
| Admin | Described operational flow; no fake metrics | Protected dashboard, real reports, stock management and draft approvals |

The hub is `/automation-lab`. No placeholder page claims to be a working live
automation. The lead form sends a real enquiry; it never publishes a CRM row.
Its delivery panel shows only the submitting visitor's opaque reference and
delivery states. “Sent” means provider acceptance, not inbox delivery.
Browser verification exposed a pre-existing PostHog module-load hydration
mismatch. Initialization now runs after hydration instead of prepending scripts
before React can match the server-rendered JSON-LD.

The dependency audit also identified critical advisories in the existing
Next.js 16.1.6 stack. Next.js, its MDX integration and ESLint configuration were
upgraded together to 16.4.0; the critical dependency findings cleared.
React and React DOM were patched within 19.2 to 19.2.8. Other
moderate/high dependency findings remain and need a separate compatibility
review. This change does not update the production deployment automatically.
The same Syne, DM Sans and JetBrains Mono fonts now come from local Fontsource
assets, preventing builds from depending on Google Fonts downloads.

Read-only engine smoke checks passed for triumphantech.com, example.com,
nextjs.org and developers.cloudflare.com, at approximately 1.4–4.0 seconds
per audit from this machine. These are reference-site checks, not the brief's
three client-site acceptance runs or twenty production API submissions.

## Verified existing WhatsApp deployment

- Account: `a9bf344e401d603c114b152f500e6722`.
- Worker: `triumphanthq-whatsapp-bot`.
- Repository: `TriumphantSam/AgentPrinter`; production branch `main`.
- Build root: `/cloudflare/whatsapp`; Python Workers runtime.
- Deployed commit: `45f23efb744884497144c9be57201d30b7b1fa73`.
- Worker URL: `https://triumphanthq-whatsapp-bot.triumphantsam30.workers.dev`.
- Source webhook path: `/webhook`. **The callback registered in Meta has not
  been independently checked.**
- D1: `DB` → `whatsapp-bot-prod`, ID
  `98b592e5-70c7-4f7f-af89-7ecd7fd0cc11`; assets binding `ASSETS`.
- Active offer: `gis_handbook`. This is a product/ad bot, not the requested
  general service menu.
- Dashboard lists no custom domain, extra routes, KV, service binding, cron
  triggers or queue consumers. Worker logs/traces are disabled.
- `GET /health`: 200, `ok:true`.
- `GET /ready`: 200, configuration checks pass, but
  `access_token_validated:false`. No test WhatsApp message was sent.
- Names of secret bindings: `META_APP_SECRET`, `WHATSAPP_ACCESS_TOKEN`,
  `WHATSAPP_VERIFY_TOKEN`. Their values were not revealed or changed.

The Next.js repository also has a WhatsApp webhook; that is not evidence Meta
uses it. Do not redirect Meta to that endpoint or deploy this new Worker over
the existing bot. No changes were made to AgentPrinter or Cloudflare settings.

## Hosting decision

Keep the existing Next.js app on Vercel. Use a separate Cloudflare Worker for
durable automation data and jobs. Website migration is unnecessary for this
architecture. The native SEO fetcher currently uses Node DNS and HTTP sockets;
moving the website would require a separate runtime compatibility review.

## Native SEO audit

`app/api/seo/quick-audit/route.ts` runs `lib/seo-audit.ts` directly. It no longer
calls `TRIUM_SEO_BACKEND_URL`. The local backend setting points to
`seo-api.triumphantech.com`; hosting at Coolify has not been independently
established from that hostname. The handler has a 30-second platform budget, a
9-second main fetch budget and concurrent 2-second optional crawl-file checks.
Lead capture runs independently, with a bounded provider timeout.

Safety: public HTTP(S) on ports 80/443; no credentials, local names, private,
reserved or mapped addresses; validate every DNS answer and pin the connection
to a validated address; validate every redirect; at most five redirects; 2 MB
body limit. Compressed responses that ignore `Accept-Encoding: identity` are
rejected rather than decoded without a safe decompression budget.

Seventeen checks: HTTPS, title, description, H1, canonical, robots meta,
viewport, Open Graph, image alt attributes, visible HTML words, links, optional
LocalBusiness JSON-LD, HTML response duration/weight, HTTP status, robots.txt
and sitemap.xml. Optional checks that cannot be measured do not reduce the
score. This is a technical checklist score, not a ranking prediction or a
Core Web Vitals measurement. JavaScript rendering and PageSpeed are not yet
included. Crawl files can exist elsewhere; a missing standard path is not proof
that the site lacks a sitemap.

Unreachable targets return HTTP 200 with `ok:false` and a friendly `error`.
Invalid inputs return 400; throttling returns 429. A result includes
`leadStored`, and `leadId` is empty when storage was not confirmed. Audit
success never fabricates CRM success.

The existing full-audit, booking-intent and legacy email follow-up routes still
use the old backend with an added eight-second timeout. The results UI now
checks full-audit failures and stays on the results instead of falsely showing
a received request. Migrating these legacy workflows requires preserving their
existing Airtable fields and consent history. Do not enable old marketing
sequences for new lab enquiries by default.

The website scorecard has no remote fetch in its page component. Its reported
production delay requires deployment/trace measurements; it was not attributed
to Coolify. Its save form now checks the server response and exposes failure.

## Local setup

The app uses its existing root dependencies. The Worker is an independent
package and is excluded from the root TypeScript project.

```powershell
npm ci
npm run test:automation
npm run build
Set-Location workers/triumph-automations
npm ci
npm run check
npm test
npm run migrate:local
npm run dev
```

Worker tests use Node's SQLite API; use Node 22.17 or newer. The migration command
uses **local** D1 only. Staging now targets the separately created
`triumph_db_staging`, ID `97244bca-414e-4cd1-b1d2-492f9c0b5c5f`, and never the
WhatsApp database.

For a local Worker, create ignored `.dev.vars` with
`AUTOMATION_HMAC_SECRET` and any provider secrets. Set the same secret in the
website's ignored `.env.local`, plus `AUTOMATION_API_BASE=http://localhost:8787`.
Use test accounts/emails when testing deliveries. Do not copy production
credentials into documentation or source.

## Staging configuration and deployment

1. The **new** D1 database `triumph_db_staging` is created and recorded in
   `wrangler.jsonc`. Never use the existing `whatsapp-bot-prod` database ID.
2. Authenticate Wrangler using the account's approved access method. No CLI
   account token was created or copied during this task.
3. Apply the migrations remotely to the new staging database:
   `npx wrangler d1 migrations apply triumph_db_staging --remote --env staging`.
4. Use `wrangler secret put NAME --env staging` for the secrets listed below.
5. Run `npm run deploy:staging`. The dry-run is available as
   `npx wrangler deploy --env staging --dry-run`.
6. Set the preview website's server env to the new Worker URL and shared HMAC
   secret. Verify an authenticated `/v1/health` call through the gateway.
7. Test real enquiry delivery with the owner's selected test recipients. Check
   D1, the Sheet, the customer email and owner email, then confirm status in the
   lab. Backend connector tests have passed, but the website submission test is
   still required.

Staging is deployed at
`https://triumph-automations-staging.triumphantsam30.workers.dev`.
The user saved `AUTOMATION_HMAC_SECRET`, `SHEETS_SYNC_SECRET` and
`RESEND_API_KEY` in Cloudflare. The private bound Apps Script is authorized and
has an every-minute trigger. The sending domain `notify.triumphantech.com` is
verified. On 13 October, one synthetic Sheet-only record and one explicitly
authorized delivery-test record were inserted into staging D1. The script
acknowledged both Sheet writes; Resend reported the acknowledgement and owner
alert as delivered. These tests exercise backend delivery, not website capture.
An invalid dashboard sender value missing its closing `>` caused HTTP 422
rejections; the corrected sender was redeployed and the same idempotent jobs
retried successfully. Provider failures now retain only their HTTP status,
without storing the provider body or credentials.

Vercel CLI authorization and project linking are complete for `triumphant-hq`
(`prj_qVewEBnPjYCEvYvCd9FHYbOmRyN9`) in `adeyemi-olayemis-projects`.
`AUTOMATION_API_BASE` and sensitive `AUTOMATION_HMAC_SECRET` are configured only
for Preview. The unpublished local branch cannot receive a branch-specific
environment override, so these currently apply to this project's previews.
Production configuration is unchanged. The Worker HMAC value is aligned with
the ignored private local configuration. A read-only authenticated health
request returned HTTP 200. The local machine was approximately 67 seconds
behind Cloudflare, outside the 60-second signature window; the temporary local
check uses the trusted HTTPS response Date header. The deployed website uses
Vercel's clock and the Worker's verification window remains unchanged.
`.vercelignore` excludes environment files, local dependencies, temporary test
files and the independently deployed Worker from website uploads.

The protected Vercel preview built successfully with Next.js 16.4.0, Node 24
and all 153 pages. One additional website test was explicitly authorized by
the user and submitted through the visible lead form. The returned reference
was `832be1f3-e92b-419d-80b8-15c2d3a7db1e`. The browser showed confirmed storage
and all three deliveries as sent, with no console errors. D1 confirmed
`source=automation_lab`, `consent_marketing=0`, `sheet_synced=1`, and all three
job states `sent`. Resend separately reported the website test acknowledgement
and owner alert delivered. This verifies browser → Vercel API → authenticated
Worker → D1 → scheduled Sheet/email delivery → browser status. It is one
authorized website test, not twenty production submissions or full acceptance
of all seven workflows.

Final protected preview:
`https://triumphant-jwbdni17u-adeyemi-olayemis-projects.vercel.app/automation-lab/lead-capture`
(`dpl_6nGyKgf61UfvZV215sgfCy2cwcig`, READY). Its rendered badge reads
“Connected enquiry form”. An authenticated read-only request to this final
deployment's `/api/automation/lead-status` returned `ok=true` and all three
delivery states `sent` for the verified website test reference. Vercel CLI
automatically provisioned a deployment-protection bypass token for that check;
the token value was not printed or committed. Production was not promoted.

On 14 October, the production backend was deployed separately as
`triumph-automations-production`, with D1 `triumph_db`
(`72f0af83-6643-426d-ac2e-c7b99e96fe0f`). It has its own HMAC and Sheet connector
keys, the verified sending configuration, and the same every-minute outbox
cron. Its authenticated health check returned HTTP 200. Vercel Production
received the production API URL, encrypted HMAC key, public Turnstile sitekey
and encrypted Turnstile secret. The managed Turnstile widget permits only
`triumphantech.com` and `www.triumphantech.com`; a dummy-token check returned
`invalid-input-response`, confirming invalid tokens are rejected without a
secret-key error. The bound Apps Script still needs the owner's production
URL/key update and a production Sheet acknowledgement before release
verification is complete. No custom API domain or WhatsApp binding was added.

Website variables:

- `AUTOMATION_API_BASE`, `AUTOMATION_HMAC_SECRET` (server only).
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` (the server key is
  required here because verification happens before forwarding).
- `TURNSTILE_ALLOWED_HOSTNAMES` for preview/production hostname checking.
- Existing Airtable credentials remain a fallback when no Worker is configured.

Worker variables/secrets:

- `AUTOMATION_HMAC_SECRET`.
- `RESEND_API_KEY`, `EMAIL_FROM` (verified sender), `OWNER_EMAIL`.
- Recommended for the current organization: `SHEETS_SYNC_SECRET`. The bound
  script stores this same secret plus `WORKER_API_BASE` in Script properties.
- Optional service-account mode only: `GOOGLE_SA_EMAIL`,
  `GOOGLE_SA_PRIVATE_KEY`, `LEADS_SHEET_ID`.
- `DB` binding and `ENVIRONMENT` in Wrangler.

The supplied organization policy blocks service-account key creation. The
recommended mode uses `google-sheets/Code.gs` bound to the private Sheet, with
current-document and external-request scopes. No public web-app deployment or
JSON key is required. `/v1/sheets/pull` and `/v1/sheets/ack` require a separate
sync secret that cannot authorize other Worker routes. Acknowledgements match
the exported record version before reporting `sheet_synced=1`. Cron skips Sheet
jobs in this mode; the script's approximately one-minute trigger owns delivery.
The local connector tests use a mock Sheet. Real Google authorization and
end-to-end staging delivery have been verified; production uses its own URL
and connector key.

Prepare the Sheet with a `Leads` tab and columns A:J:
`Reference, Created UTC, Source, Name, Email, Phone, Service, Enquiry,
Marketing consent, Status`. Share it only with the intended service account
and owner. Both integrations neutralize formula prefixes. The service-account
adapter writes `RAW` cells; the bound script upserts matching references.

## Reliability, rate limiting and privacy

- The HMAC covers timestamp, nonce, method, path and the exact request body.
  Requests expire after one minute; D1 claims nonces atomically to reject replay.
  The Worker exposes no direct unauthenticated lead endpoint or browser CORS.
- The website validates fields and size, checks a honeypot and optionally
  verifies Turnstile when both keys are set. An incomplete key pair fails closed.
  Existing forms must render the challenge before keys are enabled.
- The website keeps a process-local fallback and, when connected, obtains
  admission from a signed Worker endpoint. D1 atomically enforces five requests
  per IP per hour across website instances. Only an HMAC digest of the IP is
  forwarded; Vercel's platform-provided forwarding header takes precedence.
  The Worker separately limits email submissions. Failed admission checks fail
  closed. Turnstile checks both the allowed production hostname and the
  `lead_enquiry` action before admission.
- Recent duplicate lead submissions merge inside a D1 batch. No provider calls
  run before the lead and durable jobs are committed.
  Updated duplicates requeue their Sheet job without resending accepted emails.
- Cron drains the outbox every minute. A lease prevents simultaneous job claims.
  Failures retry with exponential backoff up to ten attempts. `failed` jobs need
  owner attention and an explicit retry after fixing configuration.
- Resend requests use a stable idempotency key. Sheet retry checks for the
  reference before append; Google does not supply a transactional append
  idempotency key. A rare append/timeout/visibility race must be monitored.
- Acknowledgements respond to a user enquiry; there are no promotional sequences
  or WhatsApp/SMS sends in this Worker. Optional marketing consent defaults to
  false and stores a timestamp. No unapproved message template is used.
- D1 lead/job data and audit events are pruned after 365 days. The mirrored Sheet
  and provider copies require separate retention/deletion procedures before
  launch. Deletion requests use `admin@triumphantech.com` / `/data-deletion`.
- Logs do not contain request bodies or provider tokens. Failure fields contain
  fixed error codes. Full contact data stays out of the public status endpoint.

## 60-second recording: lead capture

0–10s: open the lab and show the current status. 10–25s: submit a genuine test
enquiry. 25–40s: show confirmed storage and queued/delivered states. 40–55s:
show the private Sheet and received emails after delivery is confirmed.
55–60s: explain the use case for the customer's business. Do not record a
“sent” claim while jobs are queued or a provider is disconnected.

## Remaining launch gates

The brief's seven live demos, Lighthouse >=85, actual email/WhatsApp/SMS receipt,
twenty production SEO requests, three client-site audits, booking concurrency,
Paystack replay, chat golden questions and seven browser smoke flows are not all
complete. Record each phase's evidence as it ships. The current repository must
not be described as the entire completed Automation Lab.
