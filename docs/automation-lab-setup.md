# Set up the first live lead flow

Keep the website on Vercel and the existing WhatsApp bot on its current Worker.
These steps prepare a separate staging service. No hosting migration is needed.

## 1. Create the Sheet

Open https://sheets.new with the business's Google account. Name the spreadsheet
**TriumphantTech Leads**, rename the first tab **Leads**, then paste this tab-separated
line into cell A1:

```text
Reference	Created UTC	Source	Name	Email	Phone	Service	Enquiry	Marketing consent	Status
```

Keep **General access: Restricted**. Save the spreadsheet link. Its ID is the
part of the URL between `/spreadsheets/d/` and `/edit`.

## 2. Connect the Sheet without a service-account key

The organization blocks service-account JSON key creation. Keep that policy.
Use the supplied bound Apps Script instead; it runs under your Google account
and has access to this spreadsheet plus the external automation service.

1. Return to **TriumphantTech Leads** in Google Sheets.
2. Open **Extensions → Apps Script**.
3. Replace the default `Code.gs` contents with
   [the supplied Code.gs](../workers/triumph-automations/google-sheets/Code.gs).
4. Save the project as **TriumphantTech Lead Sync**.
5. Open the editor's **Project Settings**, show `appsscript.json`, and replace
   its contents with [the supplied manifest](../workers/triumph-automations/google-sheets/appsscript.json).
   It requests only `spreadsheets.currentonly` and `script.external_request`.
6. Once the new staging Worker is deployed, add two **Script properties**:
   `WORKER_API_BASE` (the staging HTTPS Worker URL) and `SHEETS_SYNC_SECRET`
   (a new strong secret, matching the Worker's setting of the same name).
7. Select `syncTriumphLeads`, run it once, and authorize the current-Sheet and
   external-request permissions yourself. If Google blocks authorization,
   report that message instead of changing organizational security policies.
8. After a successful test, use the editor's **Triggers** screen to add a
   time-driven trigger for `syncTriumphLeads`, every minute.

This is a bound script, not a public web app: **do not click Deploy**. Keep the
Sheet restricted and the sync secret in private settings, not code or chat.
The script reads pending leads through a separate authenticated connector,
upserts rows by reference, then acknowledges completed writes. Failed writes
stay pending. Trigger timing is approximate; this does not guarantee Sheet
delivery in under 60 seconds.

Google documents [bound scripts](https://developers.google.com/apps-script/guides/bound),
[current-document authorization](https://developers.google.com/apps-script/guides/services/authorization),
and [time-driven triggers](https://developers.google.com/apps-script/guides/triggers/installable).

## 3. Prepare the sending domain

1. Open https://resend.com/ and sign up or sign in. Complete any account terms
   yourself.
2. Open **Domains**, add **notify.triumphantech.com**, and choose sending only.
3. Copy the DNS records Resend displays into the provider that currently manages
   DNS for `triumphantech.com`. The DNS lookup on 13 October returned
   `dns1.registrar-servers.com` / `dns2.registrar-servers.com`, associated with
   Namecheap BasicDNS. Open the domain's DNS controls there; merely using
   Cloudflare Workers does not move DNS to Cloudflare. Do not move nameservers
   to enable email.
   [Namecheap's BasicDNS reference](https://www.namecheap.com/support/knowledgebase/article.aspx/923/10/what-is-your-basicdns/)
   identifies those nameservers.
4. Add the sending verification records at their exact displayed hostnames. Do
   not replace the root domain's existing mailbox MX records with subdomain
   records. The current root MX points to Microsoft 365; preserve it. Keep
   receiving disabled for this sending-only integration.
5. Return to Resend and verify the domain. Wait for **Verified**.
6. Create an API key with sending access restricted to that domain, if available.
   Store it as `RESEND_API_KEY` in the new Worker's secrets.

Set `EMAIL_FROM` to `TriumphantTech <hello@notify.triumphantech.com>` only after
the domain is verified. Set `OWNER_EMAIL` to `admin@triumphantech.com`.
Replies to customer acknowledgements go to the owner's email; replies to owner
alerts go to the customer's supplied address.

[Resend's domain verification guide](https://resend.com/docs/dashboard/domains/introduction)
explains why a separate sending subdomain is useful. DNS values are generated
for your account; do not use guessed/example DKIM or SPF values.

## 4. Create the staging database

In the existing Cloudflare account, open D1 and create a **new** database named
**triumph_db_staging**. Record its database ID. Do not select, edit or migrate
**whatsapp-bot-prod**.

The project lives in `workers/triumph-automations`. Staging and production now
have separate database IDs in its config. Apply migrations and deploy only the
intended environment using the detailed commands in [automation-lab.md](automation-lab.md).

## 5. Add the secrets to the correct service

Add these to **triumph-automations-staging**, not the existing WhatsApp Worker:

| Setting | Value source |
| --- | --- |
| `SHEETS_SYNC_SECRET` | Strong new secret shared only with the bound script |
| `RESEND_API_KEY` | Resend sending key |
| `EMAIL_FROM` | Verified sending address above |
| `OWNER_EMAIL` | `admin@triumphantech.com` |
| `AUTOMATION_HMAC_SECRET` | New random secret, identical in Worker and Vercel preview |

Use different values for `SHEETS_SYNC_SECRET` and `AUTOMATION_HMAC_SECRET`.
The Sheet connector key cannot create leads or call the website's other routes.
The older service-account adapter remains optional for organizations that
permit it; it is not required for this setup.

Set `AUTOMATION_API_BASE` in the Vercel preview to the new staging Worker URL.
Turnstile requires both a public site key and a server secret in Vercel; register
the actual preview/production hostnames before enabling it.

## 6. Verify before publishing

Submit one enquiry using an email you control. Verify the private D1 record,
Sheet row, acknowledgement email, owner email and delivery panel. Replay the
same submission and check that it does not create duplicate jobs. Confirm any
failed job is visible rather than described as sent.

The remaining booking, chat, payment, review and admin features still need their
implementation and provider setup. Configuring this lead flow does not activate
them automatically.
