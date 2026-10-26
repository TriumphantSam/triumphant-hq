# Free Node scanner

The scanner-only Netlify project uses `netlify/scanner/netlify.toml`. The public
website stays on Cloudflare. Do not attach the repository's website build to
Netlify or enable automatic production builds for unrelated website commits.

Only `SEO_NODE_SHARED_SECRET` is required on the isolated Netlify project.
Legacy Free requires all variable scopes; Functions-only scoping requires a paid
upgrade, which is not enabled. No other credentials are supplied to this project.
The function accepts only a timestamped HMAC-signed URL payload, refuses bodies
over 2 KiB, and reuses the existing DNS-pinned Node scanner without changes.
No lead details, mail credentials, or database credentials belong on Netlify.

After remote acceptance, configure the website with `SEO_SCANNER_BACKEND=netlify`
and `SEO_NODE_BACKEND_URL=https://<project>.netlify.app`. The shared secret must
match both services. Vercel bypass credentials are never sent to Netlify.

This account is on Legacy Free, not the newer 300-credit plan. The dashboard
confirms 100 GB bandwidth and 300 build minutes, with no payment method saved.
Do not migrate the team plan or add paid services. The earlier 300-credit scan
estimate does not describe this legacy account. Use draft deployments for
acceptance before publishing; the Cloudflare website is hosted independently.
No paid Cloudflare Container or scheduled follow-up jobs are enabled by this setup.

Local checks: `npx tsx --test netlify/scanner/scanner.test.ts lib/seo-node.test.ts`.
Remote checks must cover signed public scans, unsigned rejection, private target
rejection and the Cloudflare bridge before reporting the migration complete.

Published scanner: `https://triumphant-hq-seo.netlify.app`, project
`e931abc2-e905-4dce-bcf7-871710bcd062`, deployment `6adf3cf16dc726d4dbf92973`.
Signed example.com scans returned 17 checks; unsigned requests returned 401 and
127.0.0.1/localtest.me targets returned 400. A real Cloudflare Worker using the
website's bridge module also returned 17 checks. No lead records or mail were
created by these scanner checks. The existing Node DNS pinning remains intact.

The `.mts` entry point is required for the ESM-only parse5 dependency. An explicit
200 rewrite preserves the signed `/api/internal/seo-snapshot` request path.
