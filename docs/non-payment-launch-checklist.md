# Non-payment launch work

17 November 2026. Owner explicitly deferred payment connection and live testing
until the rest of the product is finished. Do not request plan codes, change the
live webhook, enable checkout or run a payment as part of this work.

The owner reported switching off automatic replies after normal WhatsApp chats
received unwanted responses. Preserve that setting. CLI currently authenticates
to IAPrecision, not TriumphantTech; the attempted remote disable was rejected.
The owner's action is not independently verified remote state.

## Fixed release scope

Self-service business setup, approved FAQ answers, enquiry capture, appointments,
website installation, one eligible WhatsApp number, owner/staff inbox handover,
internal follow-ups, usage and owner operations. Arbitrary workflow design and
unvalidated claims of fluent Yoruba, Igbo or Hausa are outside the first release.
Payments stay a separate deferred release gate, including subscription collection,
cancellation and real refund acceptance.

## Finish and verify before calling the non-payment release ready

| Work | Evidence or next action | Status |
| --- | --- | --- |
| Make reply controls truthful | Practice chats must be distinct from real Inbox chats; shared autoresponder switch must state its WhatsApp effect; show saved global reply status independently of per-chat pause | Deployed to staging preview; authenticated owner browser acceptance still pending |
| Safe WhatsApp testing | Add explicit selected-test-contact scope so enabling tests does not answer unrelated existing chats; keep actual replies off until an approved test | Not implemented |
| Delivery and handover visibility | Verify delivery failures are recorded without exposing tokens; show actionable failure status without automatically replaying unknown sends; retest STOP, team takeover and resume | Earlier acceptance exists; source currently swallows inline send errors, so failure visibility remains open |
| Language and approved-answer quality | Keep approved facts; extend labelled paraphrase/typo/Pidgin cases and owner-reviewed language cases; retain fallback/handover | Earlier small synthetic evaluation and owner-reported Pidgin success; broad language validation open |
| Website installation acceptance | Technical cross-site test exists; verify intended production origin and customer installation, including human checks and enquiry/booking cleanup | Customer-specific acceptance deferred by owner; not a completed independent pilot |
| Privacy and account lifecycle | Finish versioned owner acceptance, processor inventory, complete export/closure runbooks and retention policy; automatic deletion stays off without separate authorisation | Draft pack and preview-only retention exist; publication/acceptance work open |
| Operations and final release | Recheck backups/restores, health warnings, staff isolation, mobile accessibility, deployment provenance and recovery path under the correct Cloudflare account | Historical checks exist; current refresh and unrelated delivery warning remain open |

Do not convert historical automated checks or the owner's rehearsal into an
independent customer pilot. The owner previously deferred that pilot; retain the
gate and its status rather than demanding a participant during current building.
Legal/processor and provider-account decisions need owner confirmation; code
completion alone does not resolve them.

## Controls change

The current UI update changes copy, navigation and read-only status loading. It
does not save responder settings on mount, resume a thread, reconnect a number,
alter opening hours, send a message or change payment configuration. Existing
internal navigation IDs and RPC actions are preserved.

Local website type-check and targeted React component lint passed. Preview CI
[44058942384](https://github.com/TriumphantSam/triumphant-hq/actions/runs/44058942384)
passed for `18cffc2`, including the existing website/Worker suites, build,
deployment and route check. The hosted workspace returned 200 with noindex.
Only the website preview was deployed; no backend settings or production gates
were changed. No authenticated browser session was available for a visual check.
