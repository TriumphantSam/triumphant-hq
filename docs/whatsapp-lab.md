# WhatsApp service menu

The existing `triumphanthq-whatsapp-bot` Worker keeps the GIS campaign as its default. `LAB` explicitly enters the service menu; `GIS` returns to the campaign. The lab uses configured handbook pricing and checkout, and the existing 30-minute Cal.com SEO strategy call. It does not create native bookings or claim verified payments.

`HUMAN` signs a request to the production automation Worker with a dedicated, path-scoped `WHATSAPP_BRIDGE_SECRET`. The Meta message ID yields a stable handoff reference. One lead, Sheet job and owner-email job are queued atomically, with no invented customer email or acknowledgement email. Provider retries use the existing outbox. The bot acknowledges only after queue acceptance, then pauses for 24 hours. Incoming messages during the pause are retained without bot replies. `RESUME` restarts sooner. `STOP` persists until `RESUME`, which does not grant marketing consent.

The three original Meta secrets, webhook URL, phone-number ID, GIS price and checkout remain unchanged. `WHATSAPP_LAB_ENABLED` controls the additive menu. No proactive messages or marketing follow-ups are scheduled. Live acceptance requires a person to send LAB from WhatsApp, then HUMAN to verify the owner alert and Sheet row.

Validation: 66 Python routing/adapter/API tests passed, including existing GIS behaviour, paused-message deduplication, STOP/RESUME and failed handoff retries. The automation Worker passes 13 tests, including handoff idempotency, credential scope and the absence of a customer email job.

