# Guided customer setup

The owner's Setup page saves a business type, channels to prepare and whether to
include appointment and team preparation. These preferences tailor the checklist;
they do not disable existing booking functionality, remove staff, publish a site,
connect WhatsApp or activate a subscription. Business-type examples remain drafts
and are never copied into approved answers automatically.

Progress is calculated on the server from this workspace's saved evidence:

- choices have been deliberately saved (version greater than zero);
- business description and HTTPS customer contact link are saved;
- at least one approved FAQ exists;
- appointment rules have been explicitly saved, when included;
- responders are saved and enabled;
- one rehearsal contains customer, automation and team messages;
- an accepted staff membership exists, when team preparation is included.

Defaults do not count as reviewed appointment rules. Existing businesses must
review/save their rules once after migration 0023. A pending invitation does not
count as staff onboarding. A one-message rehearsal does not count as a complete
practice. Optional steps remain visible as not required and do not inflate the
progress denominator. Disabled responders cease to satisfy the checklist.

`setup.read` and `setup.save` are owner-only, workspace-scoped RPC actions.
Preference writes use a separate version comparison; stale saves return 409.
Reading progress does not create preferences or mark steps complete. A stale
appointment editor cannot update the new `reviewed_at` evidence timestamp.

Setup and Launch share server-generated launch checks. A saved widget or a
recorded WhatsApp connection is described as configured, never delivery-tested.
A verified test subscription is not described as active live billing. Production
release remains a separate gate. Production publishing additionally refuses an
incomplete required preparation checklist, even when paid access is verified.

## Deployment and acceptance

This increment depends on the subscription lifecycle release (PR #38). Apply
additive migration `0023_platform_guided_setup.sql` after 0022, deploy the staging
automation Worker, then publish the website preview. Preserve the staging billing
acceptance overrides. Do not enable live billing/customer release or change the
protected legacy WhatsApp Worker during this work.

Check the signed-in Setup page, save choices on the synthetic staging business,
reload to confirm persistence, and inspect the next required step and Launch
statuses. Changing checklist preferences must not create invitations, messages,
payments or channel connections. Real channel delivery remains the next build
and acceptance stage.
