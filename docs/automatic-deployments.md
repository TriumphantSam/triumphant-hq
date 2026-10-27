# Automatic deployments

`.github/workflows/deploy-production.yml` verifies pull requests without deploying
or exposing production credentials. A push or merge to `main` selects only the
services affected by the changed paths. Feature-branch pushes do not publish.
Documentation-only main pushes skip deployment; blog Markdown changes publish.
Test-only changes run verification without publishing.

- Website code/content publishes the production Cloudflare website.
- Scanner source/engine changes publish the existing isolated Netlify project.
- Legacy redirect changes publish the dedicated Cloudflare redirect Worker.
- Dependency/lockfile or deployment workflow changes publish all three.

GitHub Actions is free on standard hosted runners for this public repository.
Existing Cloudflare and Netlify free plans remain in place. No paid container or
new provider build integration is used. Vercel automatic builds remain disabled.

Production runs are serialised without interrupting an in-progress deployment.
PR verification uses a separate concurrency group. If shared scanner code changes,
the Netlify draft must pass authentication, private-network rejection and a real
public-site scan before promotion; a related website deploy waits for that success.
The website build gets public settings only, removes generated environment-file
fallbacks, checks the bundle, then deploys with existing remote runtime secrets
and control flags preserved. Live checks do not create leads or send messages.

Repository setup:

| Setting | Type | Purpose |
| --- | --- | --- |
| CLOUDFLARE_API_TOKEN | Actions secret | Scoped Worker, route and R2 cache deployment |
| NETLIFY_AUTH_TOKEN | Actions secret | Deploy/promote the existing scanner project |
| SEO_NODE_SHARED_SECRET | Actions secret | Verify signed scanner requests |
| SITE_PUBLIC_CONFIG | Actions variable | Public NEXT_PUBLIC_* build settings only |

The Cloudflare token is limited to the existing account with Workers Scripts
Edit, Workers R2 Storage Edit and Account Settings Read, plus Workers Routes Edit
and Zone Read for triumphantech.com and triumphanthq.com. Runtime mail, database,
payment and other application secrets remain on their hosting services.

Check the GitHub Actions **Deploy production** run after pushing main. A successful
git push confirms source upload; only a successful deployment run confirms live
publication. Failed checks leave the previous production deployment in place
until the deploy step starts. Post-deploy check failures require investigation
and, if needed, rollback; they are not reported as a successful release.

For a manual retry, use Actions > Deploy production > Run workflow on `main`,
then choose website, scanner, redirects or all. Existing local manual deployment
commands remain available for recovery.
