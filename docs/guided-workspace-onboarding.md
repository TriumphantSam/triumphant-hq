# Guided workspace preparation

The owner's Setup page now recommends the next incomplete preparation step using
the existing server readiness facts. It still counts only saved business details,
approved answers, responder settings and rehearsal activity. Complete preparation
does not claim that WhatsApp, a paid subscription or a website is live.

Each step explains what to prepare and check, with navigation to its existing
editor. Optional guidance covers booking hours, staff invitations and website
installation. Three starter-example sets (services, appointments and shops)
provide draft questions, answers and welcome messages. Selecting an example does
not write any business configuration. Examples must be adapted to the business.
The category selection resets when switching businesses. Staff retain their
existing Inbox/Conversations-only navigation.

The Setup and WhatsApp screens now accurately state that Meta App Review was
submitted on 23 October 2026 and approval is pending. No authentication, billing,
channel activation, API permissions or customer notifications change.

## Previous release verification, 24 October 2026

PRs 19, 20 and 21 are merged. Main also contains the independently merged brand
update #22 at d443e3e; local main was fast-forwarded to that commit. Vercel
production deployment dpl_HB14reXsuXbyzRbba7zRgRVNaaAQ is Ready and serves the
public domains. Production D1 migrations 0012 through 0017 applied successfully.
Production Worker deb4a690-9beb-49a6-9c20-287bace7d68a deployed from main.
Public home, platform shell and automation lab return 200. A signed platform RPC
still returns the expected disabled-platform 503. Production platform, WhatsApp,
AI and test-billing flags remain false; the protected existing bot was untouched.
The onboarding increment is a separate branch and preview release.

## Increment validation

Frontend TypeScript and lint for SetupGuide, PlatformWorkspace and WhatsAppConnect
passed. Vercel code build bf6db6c is Ready. The existing staging team-preview alias
now points to that build to avoid introducing another login domain. Browser
layout and navigation acceptance is pending because the prior session expired;
the user was asked to sign in again. No business configuration was changed by
the examples, and production does not include this onboarding increment yet.
