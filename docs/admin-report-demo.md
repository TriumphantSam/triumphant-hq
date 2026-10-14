# Reports and admin demo

The public `/automation-lab/admin` dashboard uses fictional sample data only.
Sample sales update the payment total and stock level in page memory, stop at
zero stock, and can be reset. Downloads are marked SAMPLE DATA. Social copy is
three writing templates drawn from linked service pages, not AI generation.
Local approval publishes nothing and is not persisted.

The private `POST /v1/reports/summary` endpoint uses the existing Worker HMAC and
nonce protection. Body: `{"date":"2026-10-14","days":1}`; days may be 1 or 7.
Periods include the selected Lagos calendar day, ending at the next midnight,
with an exclusive upper bound. New leads and booking creations are period counts;
cancellations use their cancellation timestamp. Upcoming appointments are the
seven days following the reporting period. Failed jobs and pending Sheet sync
are current backlog counts. Counts may include authorized test records: they
are not claimed as commercial results. No names, emails, phone numbers, private
booking codes or customer notes are returned.

There is no public proxy for the private report, no report email schedule,
signed-in admin workspace, stock database, connected payment total or publishing
integration in this release. Missing payment, invoice and stock data return null
and an explicit not-connected state, never a fabricated zero. Existing email and
booking jobs are unchanged. No account or new secret is required for this demo.

## 60-second demonstration

0–10 seconds: show the SAMPLE DATA label and morning summary. 10–30 seconds:
record two sample handbook sales; show the payment total rising and stock alert.
30–40 seconds: download the labelled report. 40–55 seconds: check a draft's
source and mark it approved in the sample; explain that publishing needs a
separate authorized action. 55–60 seconds: explain how this becomes a private
daily owner report when a customer's actual systems are connected.
