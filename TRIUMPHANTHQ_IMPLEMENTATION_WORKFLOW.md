# TriumphantHQ Implementation And Daily Workflow

This document explains what was set up for the TriumphantHQ lead capture, EmailJS follow-up, Airtable tracking, and Cal.com booking system.

It is written as a practical handoff from start to finish so the system can be understood, operated, and extended later.

## 1. System Purpose

The TriumphantHQ public SEO snapshot flow is designed to:

- collect a lead from the website
- run a safe quick SEO audit
- return public-safe SEO findings
- store the lead and sequence state in Airtable
- send the immediate email through EmailJS
- keep nurturing the lead through a timed email sequence
- move the lead toward a strategy call or implementation consult

## 2. Current Stack

The working stack is:

- backend: [`triumphq_backend.py`](/C:/Users/trium/Trium-Seo/triumphq_backend.py)
- audit engine: [`geo_audit.py`](/C:/Users/trium/Trium-Seo/geo_audit.py)
- env config: [`.env.local`](/C:/Users/trium/Trium-Seo/.env.local)
- email plan: [`TRIUMPHANTHQ_EMAIL_SEQUENCE.md`](/C:/Users/trium/Trium-Seo/TRIUMPHANTHQ_EMAIL_SEQUENCE.md)
- backend spec: [`TRIUMPHANTHQ_BACKEND_AND_OPS_SPEC.md`](/C:/Users/trium/Trium-Seo/TRIUMPHANTHQ_BACKEND_AND_OPS_SPEC.md)
- Airtable base: `app9oYcsHMCYf7pga`
- booking: `Cal.com`
- email delivery: `EmailJS`

## 3. Cal.com Setup

These booking links are now wired into the backend and env:

- Triage: `https://cal.com/adeyemi-olayemi-vqvyj4/15-min-seo-triage`
- Strategy: `https://cal.com/adeyemi-olayemi-vqvyj4/30-min-seo-strategy-call`
- Implementation: `https://cal.com/adeyemi-olayemi-vqvyj4/45-min-implementation-consult`

They are exposed in the quick-audit response as:

- `bookingLinks.triage`
- `bookingLinks.strategy`
- `bookingLinks.implementation`

The main CTA currently points to the `30-Min SEO Strategy Call`.

## 4. EmailJS Setup

These EmailJS values are wired into [`.env.local`](/C:/Users/trium/Trium-Seo/.env.local):

- `EMAILJS_SERVICE_ID=service_b7aob56`
- `EMAILJS_TEMPLATE_SEO_SNAPSHOT_01_READY=template_x0op5sr`
- `EMAILJS_TEMPLATE_SEO_SNAPSHOT_02_ISSUE=template_groa7be`
- `EMAILJS_TEMPLATE_SEO_SNAPSHOT_03_OPPORTUNITIES=template_al1ho1k`
- `EMAILJS_TEMPLATE_SEO_SNAPSHOT_04_EXECUTION=template_fehthjv`
- `EMAILJS_TEMPLATE_SEO_SNAPSHOT_05_CTA=template_v1l9swd`
- `EMAILJS_PUBLIC_KEY`
- `EMAILJS_PRIVATE_KEY`

The backend sends EmailJS requests directly through the REST API.

Important implementation note:

- EmailJS was returning `403 error code 1010` until browser-like headers were added.
- The backend now sends EmailJS requests with a browser-style `User-Agent` and `Origin`.

## 5. Airtable Setup

The Trium-Seo Airtable base is:

- `app9oYcsHMCYf7pga`

The backend now uses exact table IDs instead of display names. This avoids hidden table-name mismatch issues.

Configured table IDs in [`.env.local`](/C:/Users/trium/Trium-Seo/.env.local):

- `AIRTABLE_LEADS_TABLE=tbl5ZDQzjfompVwVw`
- `AIRTABLE_EMAIL_SEQUENCES_TABLE=tbl8f4BxJN6XuG3t1`
- `AIRTABLE_FOLLOW_UPS_TABLE=tbl23idyCEbOCGQq7`
- `AIRTABLE_CALLS_TABLE=tblvur9F1MsU3kBVw`

The important lead funnel tables are:

- `Leads`
- `EmailSequences`
- `FollowUps`
- `Calls`

## 6. What Was Fixed

Several real issues were found and fixed during implementation.

### Env loading

Originally the project was still inheriting values from the old AgentPrinter env first.

This was fixed in [`geo_audit.py`](/C:/Users/trium/Trium-Seo/geo_audit.py) so:

- shared env values can still load
- local project values from [`.env.local`](/C:/Users/trium/Trium-Seo/.env.local) override them

### EmailJS delivery

Originally EmailJS failed with Cloudflare protection.

This was fixed in [`triumphq_backend.py`](/C:/Users/trium/Trium-Seo/triumphq_backend.py) by:

- using the EmailJS REST API
- sending browser-like headers
- preserving SMTP fallback if needed later

### Airtable access

Originally Airtable returned:

- `403 INVALID_PERMISSIONS_OR_MODEL_NOT_FOUND`

This was fixed by:

- using the correct base
- using the new token
- switching from table names to the exact `tbl...` table IDs
- removing duplicate env definitions that were overriding the correct values

### Airtable compatibility

The backend was adjusted to be more tolerant of Airtable field quirks:

- `Business Type` can be dropped if Airtable blocks new select options
- `FollowUps -> Scheduled At` is now sent as plain text because the Airtable field was rejecting date formatting

## 7. Current Working Flow

The working flow is now:

1. Visitor submits the public SEO form.
2. Backend validates the lead.
3. Backend runs a quick audit.
4. Backend builds a public-safe quick-audit response.
5. Backend writes lead records into Airtable.
6. Backend sends Email 1 through EmailJS.
7. Backend stores sequence state in Airtable.
8. Backend returns the quick result plus CTA links.

This flow was tested live and is working.

## 8. Quick Audit Output

The quick-audit response includes:

- `leadId`
- `domain`
- `quickScore`
- `statusLabel`
- `summary`
- `visibleIssues`
- `opportunities`
- `scoreBreakdown`
- CTA URLs
- booking links
- EmailJS config metadata
- ops result showing Airtable and email send status

## 9. Email Sequence Logic

The immediate email is:

- Email 1: sent right after quick audit submission

The follow-up sequence is:

- Email 2: one issue holding back visibility
- Email 3: three missed SEO opportunities
- Email 4: why SEO needs weekly and monthly execution
- Email 5: direct CTA to fix the site together

The backend stores and advances the sequence in the `EmailSequences` table.

## 10. Follow-Up Runner

The backend now includes a follow-up processor in [`triumphq_backend.py`](/C:/Users/trium/Trium-Seo/triumphq_backend.py).

It reads due Airtable sequence records, sends the next email through EmailJS, and advances the lead state.

The internal route is:

- `POST /api/internal/run-follow-ups`

What it does:

- loads active sequence rows
- checks `Next Send At`
- finds the matching lead by `Lead ID`
- stops the sequence if needed
- sends the next EmailJS template
- updates `EmailSequences`
- updates `Leads`
- writes a sent event into `FollowUps`

## 11. Stop Conditions

The follow-up runner stops sequence delivery if:

- `Booked Call` is true
- `Lead Status` is `Booked Call`
- `Lead Status` is `Won`
- `Lead Status` is `Lost`

This means a lead should stop receiving nurture emails once they book or convert.

## 12. Airtable State Changes

When the system runs normally:

### Leads

The backend writes or updates:

- `Lead ID`
- `Name`
- `Email`
- `Domain`
- `Notes`
- `Quick Score`
- `Status Label`
- `Top Issue`
- `Quick Audit Summary`
- `Lead Status`
- `Last Contacted`
- `Next Follow Up`
- `Created At`
- `Updated At`

### EmailSequences

The backend writes or updates:

- `Lead ID`
- `Sequence Name`
- `Current Step`
- `Status`
- `Next Send At`
- `Last Sent At`
- `Last Subject`
- `Last Outcome`

### FollowUps

The backend writes:

- `Lead ID`
- `Follow Up Type`
- `Message Channel`
- `Scheduled At`
- `Status`
- `Owner`
- `Notes`

### Calls

When a booking intent endpoint is used, the backend logs:

- `Lead ID`
- `Call Date`
- `Call Status`
- `Outcome`
- `Proposal Status`
- `Notes`

## 13. Daily Workflow

This is the practical daily workflow for operating the system.

### During normal lead capture

1. A lead submits the public SEO form.
2. The quick audit runs.
3. Airtable stores the lead.
4. Email 1 is sent immediately.
5. The lead sees a CTA to book a strategy call or implementation consult.

### Daily or scheduled follow-up work

1. Run the follow-up processor.
2. It checks for due sequence rows.
3. It sends the next due email.
4. It updates Airtable automatically.
5. It stops any lead already booked or won.

### Sales workflow

1. If a lead books a call:
   - mark or let the system mark `Booked Call`
   - stop nurture
2. If a lead becomes a client:
   - set `Lead Status` to `Won`
   - stop nurture
3. If a lead requests deeper help:
   - use the full audit request path
   - move the lead into implementation or proposal flow

## 14. Manual Operations Right Now

Right now, follow-up sending is implemented but not yet scheduled automatically.

That means today the team can:

1. run the backend
2. call `POST /api/internal/run-follow-ups`
3. let it process due emails

This is enough for testing and manual ops.

Automation can be added later.

## 15. What Was Live-Tested

These items were tested live:

- quick audit endpoint
- EmailJS immediate send
- Airtable lead writes
- Airtable sequence writes
- Airtable follow-up writes
- follow-up runner
- live Email 2 send from the scheduler

Confirmed working:

- `airtableOk: true`
- `emailSent: true`
- `emailChannel: EmailJS`
- follow-up runner sent Email 2 and updated Airtable correctly

## 16. Important Files

Core files:

- [`triumphq_backend.py`](/C:/Users/trium/Trium-Seo/triumphq_backend.py)
- [`geo_audit.py`](/C:/Users/trium/Trium-Seo/geo_audit.py)
- [`.env.local`](/C:/Users/trium/Trium-Seo/.env.local)

Reference docs:

- [`TRIUMPHANTHQ_BACKEND_AND_OPS_SPEC.md`](/C:/Users/trium/Trium-Seo/TRIUMPHANTHQ_BACKEND_AND_OPS_SPEC.md)
- [`TRIUMPHANTHQ_EMAIL_SEQUENCE.md`](/C:/Users/trium/Trium-Seo/TRIUMPHANTHQ_EMAIL_SEQUENCE.md)
- [`TRIUMPHANTHQ_FRONTEND_BUILDER_BRIEF.md`](/C:/Users/trium/Trium-Seo/TRIUMPHANTHQ_FRONTEND_BUILDER_BRIEF.md)

This handoff file:

- [`TRIUMPHANTHQ_IMPLEMENTATION_WORKFLOW.md`](/C:/Users/trium/Trium-Seo/triumphanthq/TRIUMPHANTHQ_IMPLEMENTATION_WORKFLOW.md)

## 17. Recommended Next Steps Later

When you come back to this later, the next best improvements are:

1. schedule `POST /api/internal/run-follow-ups` automatically
2. add a small admin command or script to trigger follow-up runs
3. add richer fallback copy for Email 2 to Email 5 if EmailJS ever fails
4. connect booking completion from Cal.com back into Airtable automatically
5. queue full audits for high-intent leads

## 18. Final State

At the end of this implementation, the TriumphantHQ public SEO lead flow is working with:

- quick audit
- Airtable lead tracking
- EmailJS immediate send
- Cal.com CTA links
- Airtable-backed nurture sequencing
- follow-up runner with stop conditions

The main remaining future task is automation of the runner, not core functionality.
