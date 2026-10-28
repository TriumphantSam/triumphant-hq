# Platform commercial review — internal only

Checked 28 October 2026. Owner agreed the revised direction:
NGN 15,000 / 30,000 / 50,000, with managed service from NGN 75,000.
Deployed plan data still uses NGN 15,000 / 35,000 / 75,000; this document does
not change provider agreements or runtime entitlements. Do not change live Paystack plans, billing flags or
public policies as a side effect of this document. This is a launch-price
recommendation, not evidence of measured profitability or accepted legal terms.

## Collection economics

Paystack's published Nigerian local collection price is 1.5% + NGN 100, capped
at NGN 2,000; the NGN 100 waiver applies below NGN 2,500. International channels
have different fees. Use actual settlement reports for accounting.
[Paystack pricing](https://paystack.com/pricing)

| Plan | Charge | Local collection cost | Settlement before other costs |
| --- | ---: | ---: | ---: |
| Starter | 15,000 | 325 | 14,675 |
| Growth | 30,000 | 550 | 29,450 |
| Business | 50,000 | 850 | 49,150 |

## Stress budget, not a supplier quote

Use an explicit **planning assumption** of NGN 2,000/USD and NGN 6,000/hour
internal staff cost. These are not today's exchange rate or an actual salary.
Qwen's published input/output prices are USD 0.0509/0.335 per million tokens.
For a hypothetical 2,000-input/160-output-token call, inference is USD 0.0001554.
Stress-budget one such call per included reply even though the current optional
AI matcher has a separate 100-attempt monthly cap. Real token/retry usage differs.
[Cloudflare model pricing](https://developers.cloudflare.com/workers-ai/models/qwen3-30b-a3b-fp8/)

| Monthly allocation, NGN | Starter | Growth | Business |
| --- | ---: | ---: | ---: |
| Local payment fee | 325 | 550 | 850 |
| Hypothetical full-quota inference, rounded up | 156 | 622 | 1,554 |
| Hosting/database/email allocation (assumption) | 1,000 | 2,000 | 4,000 |
| Configuration-help staff budget: 0.5 / 1 / 2 hours | 3,000 | 6,000 | 12,000 |
| Refund/incident reserve allocation: 10% of price | 1,500 | 3,000 | 5,000 |
| Remainder before tax, sales, core overhead and extra defect support | 9,019 | 17,828 | 26,596 |

The remainder is **not net profit**. The 10% reserve is not a statistically
validated refund forecast. Fixed minimum hosting charges are not eliminated by
an allocation per customer. At low customer counts and heavy support, margins
can be much lower. Customer-funded Meta charges are excluded; if we pay them,
this table is incomplete and prices must be reconsidered.

Pilot measurement: log actual collection fees, allocated hosting/email/AI costs,
configuration and defect-support minutes, refunds and acquisition cost per paying
business. Review after the first 30 paid days and again at ten customers. Use a
60% contribution-margin target after attributable delivery/support costs, before
central overhead/tax; this is an internal target, not a customer promise. Reprice
for new periods with disclosed notice and consent as required, never silently
raise an existing recurring debit.

## Meta pricing uncertainty and billing decision

Two first-party public pages conflict. The current FAQ describes service-message
charging effective 1 October 2026 after a per-number monthly free allowance;
the marketing pricing page still describes free service replies and free utility
responses. Consequently this review does not certify a numeric Nigeria rate,
universal free tier or free-entry-point duration for a customer contract.
Resolve against the actual current rate card and customer's billing account
before quoting and record currency, effective date, market and categories.
[Meta FAQ](https://whatsappbusiness.com/resources/faq/),
[Meta platform pricing](https://whatsappbusiness.com/products/platform-pricing/?lang=en).

Recommended initial billing model: customer's own Meta/provider billing, no
TriumphantTech prepaid wallet, no hidden markup, no Meta charge absorbed into the
reply allowance. This must be demonstrated during onboarding; it is not yet
proof that the deployed Embedded Signup path establishes direct customer billing.
If another model is required, stop and cost/disclose it before paid onboarding.

## Refund operations and statutory boundary

Paystack says original processing fees are not returned on refunds and customer
receipt can take 3–10 working days. Budget the collection fee as our cost when
promising a full platform refund. Verify refund eligibility/funding in the actual
provider account and track provider outcome; do not issue duplicate refunds.
[Paystack refund guidance](https://support.paystack.com/en/articles/2127106),
[refund lifecycle](https://paystack.com/docs/payments/refunds/).

Nigeria's FCCPA section 130 addresses service quality and remedies; a voluntary
seven-day guarantee cannot be used to remove applicable statutory remedies.
The draft intentionally avoids a blanket no-refund rule. Check applicability
and wording for the final customer contract rather than treating this review
as a legal determination.
[FCCPA text, section 130](https://fccpc.gov.ng/wp-content/uploads/2022/07/FCCPA-2018.pdf).

Refund processing/access reconciliation remains manual and requires a tested
runbook before selling. Cancellation is not a refund, and a provider refund must
not be assumed to revoke a locally verified paid period automatically.

## Competitor review and adopted direction

Public offers checked on 28 October: [Qwiqa](https://qwiqa.com/) lists NGN
15k/30k/50k and conversation-based capacities; [SureLeads](https://sureleads.ng/)
lists NGN 10k/25k/50k with message/voice credits; [BotWave](https://www.botwave.ng/)
lists NGN 9,900/24,900/59,900 with advertised channel and AI allowances.
[Buvvo](https://buvvo.ng/) also advertises free/5k/25k offers. These are published
claims, not tested performance, verified margins or equivalent usage units.

Adopted: outcome-led positioning, revised software prices, a bounded no-card
trial and a separately scoped managed-service tier. Do not copy unlimited claims,
assume all prices include Meta fees, or treat payment screenshots as settlement
evidence. Implement the recorded trial/quota/provider-plan work before marketing.
The revised cost table retains earlier support-time assumptions as a stress case;
trial conversion/abuse and stronger AI limits still need actual pilot measurement.

## Source-of-truth and implementation gaps

- Enforced plan amounts/FAQ/reply limits: `src/platform/plans.ts` in the Worker.
- Monthly new-record limits: `workflows.ts` and `usage.ts`, 100 each on all plans.
- Current team cap: ten including owner. Do not sell invented tier seat limits.
- AI cap: `tenant-ai.ts`, 100 attempts/workspace/month plus 500 shared daily.
- Self-service setup fee is zero by proposal; assisted onboarding/extra hours are
  manual quoted services, not existing checkout products.
- Configuration-help time is a service policy, not a software meter. Track it
  operationally; defects and rights-related support remain outside its cap.
- Tax status, final invoice wording, support staffing, guarantee funding and
  customer-consent acceptance need owner/accounting/legal review before publish.
- Align the public plan cards with record/AI caps before activation. Do not
  activate billing just because the price numbers already exist in test plans.
