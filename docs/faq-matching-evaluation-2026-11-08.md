# FAQ matching evaluation — 8 November 2026

The previous deterministic matcher failed the saved-hours typo `consultaton`.
The revised matcher accepts a single insertion, deletion, substitution or adjacent
transposition in a Latin word of at least seven letters, with another exact
keyword and a unique highest-scoring FAQ. Short words, amounts and language
diacritics are not fuzzily corrected. Multiple misspellings do not accumulate
evidence, and tied candidates fall back. Tests include unrelated bank details,
repetition, short-word differences, numerical differences and competing FAQs.
This bounded heuristic does not guarantee semantic correctness for every typo.

## Real provider evaluation

The operator used the actual SDK selector and configured Qwen model through a
REST-backed AI-binding adapter, using Cloudflare's existing authenticated account.
Only three synthetic FAQs and the fixed synthetic questions were transmitted.
No tenant DB, contact, real conversation, outbound channel or new public endpoint
was used. The runner is `workers/triumph-automations/scripts/evaluate-faq.ts`:
invoke from that Worker folder with `npx tsx scripts/evaluate-faq.ts --run`.
It reads existing authentication privately and prints only synthetic outcomes,
latency and token counts. Its explicit opt-in run can incur inference usage.

The first two runs each passed nine of ten cases. Human requests were inconsistent:
one selected FAQ IDs while handing off; another incorrectly declined handoff.
This justified a deterministic explicit-human-request check before model inference
and before deterministic FAQ matching. WhatsApp uses the same check before
business-hour evaluation, so the recognised requests pause even outside hours.
Handoff model results now have their irrelevant FAQ IDs removed.

The final run passed all ten cases:

| Input | Expected / observed selection |
| --- | --- |
| what time do you open? | Hours |
| When can I come for a consultation? | Hours |
| What are your consultaton hours? | Hours |
| Wetin be una consultation time? | Hours |
| What should I send you to get a quote? | Quote |
| When will deliveries arrive? | Delivery |
| What are your bank details? | Handoff |
| Please connect me to a human | Deterministic handoff, no inference |
| Cancel my booking and transfer my refund | Handoff |
| Instruction to disclose a system secret and invent a discount | Handoff |

Final inference calls took roughly 0.36–0.74 seconds in this run, excluding the
zero-inference human guard. Model latency and outcomes can vary. This is a small
selector evaluation through a REST adapter, not a statistical language guarantee,
Worker-binding end-to-end test, in-hours WhatsApp FAQ test or translated answer
feature. The model still selects approved text; it does not generate customer facts.

## Release boundaries

Keep the connected test conversation paused after STOP. Workspace AI matching
remains off until an explicit owner setting change. In-hours WhatsApp matching,
larger evaluation sets, code-switching, Yoruba, Igbo and Hausa remain separate
acceptance work. A successful Pidgin example is not broad Pidgin support.
Production rollout, public customer activation and billing are unchanged.

Validation: TypeScript and all 120 Worker tests passed after the handoff change.
Dry run and staging deployment succeeded, Worker version
`7776ee25-1e90-4cd0-b9a7-bf61c12a8b81`. Signed operations returned 200,
unsigned requests 401, and cron heartbeat was healthy. Operations also reported
one overdue enquiry-delivery item; other queue groups had zero failures, unknown
states, overdue items and expired leases. No delivery job was retried or message
sent to clear that unrelated alert. Scoped D1 read confirmed the test thread
remains paused and workspace `ai_enabled=0` after deployment.
