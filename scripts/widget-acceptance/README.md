# Independent widget installation acceptance

This is a separate, public test host on Cloudflare Workers. It has no bindings,
credentials, analytics, account login or payment API. Its only iframe points to
the reserved synthetic business on the stable Vercel staging alias.

From `workers/triumph-automations`, after checking `wrangler whoami`:

```powershell
npx wrangler deploy --config ../../scripts/widget-acceptance/wrangler.jsonc
```

Public address: https://triumphant-widget-acceptance.triumphantsam30.workers.dev/

Before testing, the staging synthetic business must be published and its saved
widget origin must match this address. The staging alias must permit public
visits. Only that alias received a public override with the owner's approval;
project-wide preview protection and production settings were not changed.

Use reserved contact details, never customer information. Ask the sample FAQ,
submit a synthetic enquiry, reserve/cancel a synthetic appointment, and confirm
the matching business records through authenticated APIs or a scoped D1 query.
Security checks remain enabled; a human must complete any challenge that cannot
be completed by the approved browser workflow.

Record desktop/mobile results separately. A top-level assistant page or an HTTP
200 is not proof of iframe installation. A real browser answered the sample FAQ
inside the independent site's iframe on 21 October 2026 after the owner opened a
fresh Edge tab. Earlier browser-controlled tabs stalled at `about:blank`.
Embedded enquiry/booking and negative-origin browser tests are still pending.

Disable the synthetic widget and restore its reserved origin after acceptance.
No private owner workspace or production business should be used as a fixture.
