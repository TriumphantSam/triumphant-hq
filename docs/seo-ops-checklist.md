# SEO Ops Checklist — Triumphant HQ (Ibadan)

Use this weekly. On-site work underperforms without these off-site steps.

## Canonical NAP (lock this everywhere)

- **Legal name:** Triumphant Technological Services
- **Brand:** Triumphant HQ
- **Address:** Basorun Rd, Ibadan 211107, Oyo
- **Phone / WhatsApp:** +234 810 771 1190 (`2348107711190`)
- **Email:** admin@triumphantech.com
## Canonical host (lock this)

- **Website:** https://triumphantech.com (apex, no `www`, no `triumphanthq.com`)
- Redirects and dashboard steps: [`docs/canonical-hosts.md`](./canonical-hosts.md)
- After any domain change, verify with `curl -sI` that `www` and `triumphanthq.com` **301** to the matching apex path.

Update GBP, WhatsApp Business, social bios, email signatures, invoices, and directories to match exactly.

## Google Business Profile (do this week)

- [ ] Confirm primary category (e.g. Website designer / IT consultant / Marketing agency)
- [ ] Add secondary categories that match real services
- [ ] Add services: Website design, SEO, App development, Automation, NIN support, BVN support
- [ ] Set hours accurately
- [ ] Upload photos: exterior, team, workspace, NIMC certificate, project screens
- [ ] Seed Q&A from site FAQs (Local Support + Ibadan hub)
- [ ] Post 2× per week (tip, offer, case, NIN tip)
- [ ] Add GBP URL to site `sameAs` in `lib/seo.ts` when the public Maps/profile URL is stable

## Search Console & Bing

- [ ] Verify https://triumphantech.com in Google Search Console
- [ ] Submit sitemap: https://triumphantech.com/sitemap.xml
- [ ] Request indexing for `/`, `/ibadan-tech-agency`, `/locations/ibadan`, `/services/websites`, `/services/seo`, `/local-support`
- [ ] Verify Bing Webmaster and submit the same sitemap

## Review engine (ongoing)

- [ ] After every successful agency delivery, send a polite GBP review request
- [ ] After every smooth NIN/BVN visit, ask for a short review mentioning Ibadan / service
- [ ] Target steady weekly velocity (not a one-day dump)
- [ ] Never invent AggregateRating on the website until you have a real public aggregate

## Citations (15–25 listings)

Create/claim listings with identical NAP:

- [ ] Google Business Profile
- [ ] LinkedIn Company
- [ ] Instagram / Facebook / X (if used)
- [ ] Nigerian business directories (legal/compliant only)
- [ ] Chamber / association listings if applicable
- [ ] Paste each public profile URL into `siteIdentity.sameAs` in `lib/seo.ts`

## Weekly measurement (see `docs/seo-keyword-tracker.md`)

- [ ] Check GSC queries/impressions for Pillars A–C
- [ ] Note average position for the top 15 keywords
- [ ] Review GBP calls, messages, direction requests
- [ ] Note Cal.com bookings + WhatsApp Local Support volume
