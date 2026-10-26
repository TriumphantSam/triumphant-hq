# Vercel retirement

On 2026-10-26, the approved batch of 29 unaliased deployments was removed with
Vercel CLI `remove --safe`. Re-inventory confirms 36 deployments remain and all
38 alias-to-deployment mappings are unchanged. Operations preview and designated
rollbacks are retained. Exact freed storage is not available from this inventory.
The ignored review and results are in `tmp/vercel-retirement-*.json` and
`tmp/vercel-retirement-review.md`.
The Vercel project's cron feature is disabled; API readback confirms disabledAt
is newer than enabledAt. The old job definitions remain listed but do not run.

`triumphanthq.com` was hosted on Vercel DNS and redirected to triumphantech.com.
Its five explicit Vercel DNS records were backed up before Cloudflare onboarding:
three CAA records and apex/wildcard ALIAS records. Cloudflare's scan materialised
the address records and also found www and _domainconnect. All three CAA issuers
were retained; _domainconnect was changed to DNS-only. No MX records existed.

New Free zone: `88ada1ec40abe66109661589dc73cb19`. Namecheap delegation is
`cosmin.ns.cloudflare.com` and `jewel.ns.cloudflare.com`; the registry confirms
the change and Cloudflare reports active. The dedicated redirect Worker is
`triumphant-legacy-redirect`, version `a0012dd4-30f8-4607-9e89-24dad4876c60`.
Its routes cover the legacy apex and www only, preserving paths, encoding and
query strings. HTTP and HTTPS have been verified through Cloudflare for both
hosts. Universal SSL is active for the apex and wildcard. HTTPS checks used
authoritative Cloudflare addresses with normal SNI and certificate validation,
so cached Vercel DNS responses could not produce a false pass.

Keep the production Vercel project and domains during DNS cache propagation.
Do not delete the 36 retained deployments or detach aliases as part of
the approved batch; those were expressly excluded.
