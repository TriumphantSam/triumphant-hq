# Canonical host — Triumphant HQ

Primary public host: **https://triumphantech.com** (apex, no `www`).

In-repo 301s live in `vercel.json` (edge) and `proxy.ts` (app). They preserve the path and query string.

## Hosts that must 301 to apex

| Request | Destination |
|---|---|
| `https://www.triumphantech.com/any/path?x=1` | `https://triumphantech.com/any/path?x=1` |
| `https://triumphanthq.com/any/path` | `https://triumphantech.com/any/path` |
| `https://www.triumphanthq.com/any/path` | `https://triumphantech.com/any/path` |

Never dump leftover URLs onto the homepage. Never send traffic to `www`.

## Vercel dashboard (required for triumphanthq.com)

Live checks on 27 Aug 2026 showed:

- `www.triumphantech.com` served **200** (same app as apex) — in-repo redirects fix this once deployed.
- `triumphanthq.com` returned a platform **307** to `https://www.triumphantech.com` **with the path preserved**. That redirect is configured at the Vercel domain layer, so application code does not run until the domain is assigned to this project (or the dashboard redirect is changed).

In **Vercel → Project → Settings → Domains**:

1. Set **triumphantech.com** as the Production / primary domain.
2. For **www.triumphantech.com**: either assign it to this project (in-repo 301s will fire) **or** set a **permanent** redirect to `triumphantech.com`. Do not leave both hosts serving 200.
3. For **triumphanthq.com** and **www.triumphanthq.com**:
   - Stop the current **temporary** redirect to `www.triumphantech.com`.
   - Either assign both hosts to this project (preferred — `vercel.json` / `proxy.ts` then 301 each path to apex), **or** set a **permanent 301** redirect to `https://triumphantech.com` that **preserves the path**.
4. Do not point leftover domains at a different Vercel project.

After deploy, Search Console: verify the apex property, submit `https://triumphantech.com/sitemap.xml`, and use URL inspection on previously indexed `www` / `triumphanthq.com` URLs.

## How to verify

```bash
curl -sI https://www.triumphantech.com/ | grep -iE 'HTTP/|location:'
# expect 301 and Location: https://triumphantech.com/

curl -sI https://www.triumphantech.com/locations/ibadan | grep -iE 'HTTP/|location:'
# expect Location: https://triumphantech.com/locations/ibadan

curl -sI https://triumphanthq.com/ | grep -iE 'HTTP/|location:'
# expect 301 and Location: https://triumphantech.com/

curl -sI https://triumphanthq.com/locations/ibadan | grep -iE 'HTTP/|location:'
# expect Location: https://triumphantech.com/locations/ibadan  (not homepage, not www)

curl -sL https://triumphantech.com/services/websites | grep -oE '<title>[^<]+</title>'
curl -sL https://triumphantech.com/seo-snapshot | grep -oE '<title>[^<]+</title>'
curl -sL https://triumphantech.com/sitemap.xml | head
```
