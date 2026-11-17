# Typo and Nigerian-language support

29 October 2026. Proposed scope; not a claim of released language support.

Current deterministic matching normalises case and punctuation, then considers
shared question keywords. It is not a spellchecker. Optional Workers AI selects
at most two approved FAQ IDs for paraphrases; displayed answers remain the
business's original approved text. It does not translate the response, verify
stock, change a booking or invent prices. AI is gated by platform/workspace
settings, entitlement and usage limits. An unavailable or uncertain result must
fall back to an enquiry.

## Delivery sequence

1. Measure English typos and Pidgin question matching against approved FAQs.
   Include mixed English/Pidgin, short forms and ambiguous requests. Keep the
   returned approved answer unchanged in this first phase.
2. Add business-approved answer variants and an explicit language preference:
   English, Nigerian Pidgin, Yoruba, Igbo and Hausa. Review translations with
   fluent speakers before publishing them. Preserve names, prices, dates and
   booking constraints exactly. Fall back visibly to an approved available
   language when a translation is absent.
3. Evaluate cross-language question selection and code-switching, including
   Yoruba/Igbo diacritics and common unaccented typing. Do not strip meaningful
   distinctions indiscriminately. Use fluent reviewers for each language.
4. Voice notes are a separate feature: consent, transcription accuracy, accent
   tests, retention, provider cost and confirmation before actions all need work.

## Acceptance before marketing

Create a versioned evaluation set per language: ordinary wording, typos,
paraphrases, mixed languages, unrelated questions, ambiguous facts, requests for
a person, private records and prompt injection. Include confusable FAQ pairs.
Measure correct selection, false answers, safe referrals, latency and cost
separately. A fluent reviewer must approve every displayed translation.

Require zero invented price/date/availability claims in the release set and no
cross-business facts. Record failures and expand the set before changing prompts
or matching logic. A mocked selector test proves validation, not real model
language quality. No language is advertised as supported until its real-provider
evaluation and customer UI flow pass. This plan does not enable AI or add charges.
