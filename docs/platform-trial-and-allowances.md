# Revised plans and bounded trial

New software prices: Starter NGN 15,000, Growth NGN 30,000, Business NGN 50,000.
Reply/FAQ allowances remain 500/20, 2,000/60 and 5,000/150. Enquiry limits are
100/500/1,500; booking-record limits are 100/300/1,000 per Lagos calendar month.
Optional AI matching attempts follow the corresponding reply allowance, with a
separate shared 500-attempt daily cap. Exact approved FAQ matches need no AI call.
The shared cap can constrain availability; this is not unrestricted AI.

`trial.start` requires an authenticated verified owner, an unsuspended workspace,
at most 20 saved FAQs, no existing billing agreement and no prior owner/workspace
trial. A repeated request returns existing dates, never resets them. The trial
expires after 14 elapsed days or 50 metered automated responses, whichever comes
first. It permits ten enquiry records and ten booking records over its lifetime.
No provider API, payment method, billing agreement, email or debit is created.

Trial usage uses the workspace's fixed `trial` period and record counts from its
original start, so crossing a calendar month does not replenish it. Response
reservation remains atomic across website and connected WhatsApp. Expiry or quota
exhaustion stops automation and preserves private workspace access and records.
A later verified paid period supersedes trial access without restarting its dates.

Trials require `PLATFORM_TRIAL_ENABLED=true`. It defaults false in both checked-in
environments. Production also requires the independent customer release flag;
the overall platform and channel gates continue to apply. Staging may explicitly
enable the trial flag for acceptance while production stays closed.

Existing stopped Starter agreement remains unchanged. Verified old Growth at
NGN 35,000 and Business at NGN 75,000 remain recognized; no existing recurring
amount is changed. Billing resume consent displays the actual agreement amount,
not the new catalogue price. Existing agreements still block second checkout.

Migration 0025 copies the existing provider catalogue to a composite
`(plan_id,amount)` key, retaining all rows and codes, then introduces the trial
ledger. Provisioning new test plans targets the new amount without updating the
old provider plan. Unknown creation outcomes remain reserved for operator review.
Do not delete reservations, repurpose old codes, or auto-migrate subscriptions.

Apply migration before backend deployment; deploy backend before preview.
Production must keep platform/customer-release/live-billing/trial flags disabled.
Do not merge/deploy this branch to production as part of staging acceptance.
Use a database backup before migration. Rollback needs a compatible catalogue
reader; an older implementation selecting only by plan ID is insufficient once
multiple amounts exist. Prefer a forward fix; do not remove catalogue or trial
records to make old code work.

Managed service from NGN 75,000 remains a separately scoped service, not a fourth
checkout plan. Trial and self-service pricing do not establish final tax terms,
provider-funded messaging, refund automation or an approved live customer release.

Acceptance must include: staff/foreign owner rejection; disabled/release gates;
retry without date reset; 50th-response race; no reset across month boundaries;
expiry preserving data; tier record quota; legacy paid period and recorded price;
versioned catalogue preservation; and browser plan/trial/usage displays. A returning
paid-owner browser check does not prove the fresh-account trial-start journey.
