# WhatsApp App Review recording plan

## Submission status, 23 October 2026

The owner confirmed App Review submission on 23 October 2026 and provided the
downloaded Digital Forge 2 App Review PDF. It contains the two intended WhatsApp
permissions, descriptions and video entries. The messaging recording shows the
website send and WhatsApp Web receipt; the separate template recording shows
creation and saving in WhatsApp Manager, explicitly permitted by Meta's shown
instructions. Approval is pending, not granted. Temporary review sending was
disabled and its credential removed. The notes below preserve preparation
history and shot lists; incomplete-form statements refer to the earlier audit.

### Earlier preparation audit, before submission

Business verification is approved. App Review submission is not confirmed: the
user explicitly says it was not submitted, the permission forms are incomplete,
and the live use-case page shows app review incomplete. An onboarding badge that
says In review is not sufficient evidence of a submitted request.

The two WhatsApp forms show required API tests Completed. They still need an
accurate use-case description, a genuine recording and the owner's allowed-usage
agreement. Do not check agreements or submit on the basis of this plan alone.

Meta API Setup offers a separate sender explicitly labelled Test Number. It was
selected during the audit. The user generated a temporary test-account token and
approved one connectivity send. Meta showed success and the user confirmed the
message arrived on the verified recipient ending 1190. No retry occurred. This
was sent through API Setup, not through the platform UI, and is not a video file.
No webhook change, customer connection or template creation occurred. A scoped
staging D1 read confirmed zero connected workspaces and zero live WhatsApp events.

## Video 1: whatsapp_business_messaging

The separately authorised website send was performed once after the user said
their recording was running. The staging panel showed Meta accepted the message.
Receipt of this second message and the saved recording file still need checking;
the earlier handset confirmation applied to the initial connectivity test only.
The temporary staging sender was disabled and its token deleted afterward.
The deployed read check also exposed a Workers incompatibility with redirect
mode `error`; using `manual` rejects redirects without forwarding credentials.
The live readiness check and send then succeeded. Production was unchanged.

1. Use the authorised Meta app's isolated test account. Establish permitted
   app-owned test access; do not present external-customer onboarding as working.
2. Show the real authorisation flow requested by the review form. Keep passwords,
   access tokens and private account details out of the recorded area. If current
   Advanced Access restrictions prevent the required flow, preserve the error
   and resolve the review-testing route; do not substitute an edited success.
   Meta's live Show instructions modal specifically says the API Setup tool can
   be used for steps1/2, and to embed its cURL command in the website and record
   the website sending. A staging-only owner review panel is being prepared for
   that exact real API request. It must not be described as working customer
   Embedded Signup or a connected tenant inbox.
3. Show the application sending one approved test message to a consenting,
   verified recipient. Record the app operation and its actual API outcome.
4. Show the identical message arriving in WhatsApp on the phone or web. Graph API
   acceptance alone does not prove handset delivery. Record both ends clearly.
5. If demonstrating inbound FAQ automation or human takeover, verify the actual
   webhook and tenant association first. The dashboard rehearsal does not count.

The initial connectivity check may use an existing approved test template. It
does not, by itself, demonstrate the full business workflow or customer OAuth
onboarding. The recording and written reviewer instructions must state exactly
what is tested.

## Video 2: whatsapp_business_management

1. Open the authorised test account's template-management screen or a genuine
   application management flow, as permitted by Meta's shown instructions.
2. Create a separate template while recording. Use an invented appointment
   confirmation, with no real customer data. Choose the category that accurately
   fits the actual message; do not label promotional content as utility.
3. Show the resulting template in the same account and the real creation status.
   Created/Pending is not Approved. Do not send an unapproved template.
4. If the test account cannot create templates, preserve the exact error and
   identify a permitted owned test account. Do not use the protected campaign
   account as an unannounced workaround.

The existing platform code currently has no template-creation action. A Meta
Manager recording must not be described as an existing custom dashboard feature.
If a custom in-app management demonstration is needed, implement and test that
flow before claiming it in the review description.

## Before recording

- Obtain explicit permission for the recipient and message; no unsolicited sends.
- User handles sign-ins, credential generation, OTPs and binding consent.
- Keep the company Business app number registered and the campaign bot unchanged.
- Inspect account-specific test webhook options before any subscription changes.
  Do not change the app default callback, which can affect the existing bot.
- Use two clearly named videos and English UI/captions where feasible. Review
  the whole captured frame for exposed credentials before upload.
- A real screen recorder must capture the actions. Screenshots and generated
  animations are not substitute evidence. Do not claim a video exists until the
  actual recording file has been saved and reviewed.

## Private staging review sender

The new review panel is disabled unless staging has a short-lived, explicit
configuration. Its credential and recipient live only in Worker secret settings;
never send them to the browser. Only the configured verified owner and workspace
can use it. The sender profile must match Meta's isolated Test Number, and the
message is fixed to hello_world in en_US. A durable per-run reservation prevents
duplicate posts, including after a provider timeout. Review reservations are
excluded from normal seven-day request cleanup. An accepted Graph response is
labelled accepted, not delivered. Handset receipt remains a separate check.

Required Worker settings (names only): PLATFORM_WA_REVIEW_ENABLED,
PLATFORM_WA_REVIEW_OWNER_EMAIL, PLATFORM_WA_REVIEW_WORKSPACE_ID,
PLATFORM_WA_REVIEW_PHONE_ID, PLATFORM_WA_REVIEW_RECIPIENT,
PLATFORM_WA_REVIEW_TOKEN, PLATFORM_WA_REVIEW_RUN_ID and
PLATFORM_WA_REVIEW_EXPIRES_AT. Expiration must be in the next24hours. A separate
user approval is needed to store the temporary token in Cloudflare staging and
send the additional recording message. Disable the sender and remove its token
after acceptance. No production settings or existing bot callbacks are changed.

## References

The user's current Tech Provider onboarding instructions explicitly request a
send/receipt video and a separate template-creation video. The permission dialog
also requests the OAuth authorisation flow in the screencast.

Meta's official template API collection documents the real template-creation
endpoint: https://www.postman.com/meta/whatsapp-business-platform/request/3o32lzu/create-template-w-location-header-text-body-text-footer-and-a-website-buttons
