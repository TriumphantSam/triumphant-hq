# Independent widget installation acceptance

This is a separate, public test host on Cloudflare Workers. It has no bindings,
credentials, analytics, account login or payment API. Its only iframe points to
the reserved synthetic business on the Cloudflare staging website.

From `workers/triumph-automations`, after checking `wrangler whoami`:

```powershell
npx wrangler deploy --config ../../scripts/widget-acceptance/wrangler.jsonc
```

Public address: https://triumphant-widget-acceptance.triumphantsam30.workers.dev/

Before testing, the staging synthetic business must be published and its saved
widget origin must match this address. The public staging website is
https://triumphant-hq-web-preview.triumphantsam30.workers.dev. The private
workspace still requires sign-in. Production settings are not changed.

Use reserved contact details, never customer information. Ask the sample FAQ,
submit a synthetic enquiry, reserve/cancel a synthetic appointment, and confirm
the matching business records through authenticated APIs or a scoped D1 query.
Security checks remain enabled; a human must complete any challenge that cannot
be completed by the approved browser workflow.

Record desktop/mobile results separately. A top-level assistant page or an HTTP
200 is not proof of iframe installation. A real browser answered the sample FAQ
inside the independent site's iframe on 21 October 2026 after the owner opened a
fresh Edge tab. Earlier browser-controlled tabs stalled at `about:blank`.
On 22 October 2026, the independent iframe stored a synthetic enquiry and reserved
then cancelled a synthetic appointment. Scoped D1 reads confirmed both records
belong to the synthetic business and the appointment is cancelled. The cancellation
page was inspected at 390 pixels wide. No outbound messages or payments were sent.
The host now uses the same lazy loading as the generated customer snippet; the
embedded question form returned the approved answer after a fresh reload.

The `blocked` environment deploys the same page at
https://triumphant-widget-blocked.triumphantsam30.workers.dev/. This origin is
deliberately absent from the business's saved website origin. Chrome refused its
iframe while the allowed host worked. Do not add this negative-control origin to
the business configuration or loosen framing protection to make it load.

Disable the synthetic widget and restore its reserved origin after acceptance.
No private owner workspace or production business should be used as a fixture.

## Cloudflare recheck, 28 October 2026

The independent host now targets the Cloudflare staging website. Its widget
response returned HTTP 200 with `frame-ancestors` restricted to the allowed
acceptance origin. Initially the controlled Edge tab remained at `about:blank`.
After the owner opened a fresh tab, the embedded assistant rendered and the
browser check returned the approved weekday 10am–4pm Lagos answer inside the
iframe. An unknown question returned an explicit lack-of-approved-answer message
and directed the visitor to send an enquiry. This is a referral to the enquiry
form, not an automatic live-agent conversation transfer.

The negative-control host displayed the browser's "refused to connect" frame,
while the approved host worked. Turnstile did not mount in the controlled tab,
so the owner completed verification and submitted the synthetic enquiry in the
fresh tab. The UI confirmed reference `8292de05-212f-458f-b18f-755dffecc8fd`.
A scoped staging D1 read independently confirmed that reference belongs to
reserved workspace `d0e0f0a0-2026-4020-8020-202610200001`, with status `new`,
created at `2026-10-28T18:09:19.590Z`. No messages were sent.

Cleanup restored origin `https://example.test`, disabled the widget, and
advanced its configuration version from 5 to 6. The synthetic enquiry remains
as acceptance evidence. This recheck passes cross-site rendering, approved
answers, unknown-answer referral, origin isolation and enquiry persistence.
It does not certify live staff chat, mobile layout, booking/cancellation on this
deployment, live billing or WhatsApp delivery. Earlier October booking results
above describe the previous deployment.
