# Owner record export

Inbox offers owners a CSV download of stored enquiries or appointments for
their business. Staff do not see the controls; the server independently checks
owner membership on every request. Other businesses and revoked members cannot
export. Signed internal RPC and the existing same-origin private website gateway
are retained. Files are generated for the response and downloaded locally, not
saved to a public storage URL or sent to an email provider or AI model.

The inclusive date range is based on **record creation in Lagos**, for both
enquiries and appointments. It is not the scheduled appointment date. Dates must
be real ISO calendar dates, ordered and at most 31 days inclusive. CSV timestamps
use UTC and are labelled accordingly. Cancelled appointments and all enquiry
statuses are included; exports show current stored values, not historical values.

Each request selects at most 501 rows. More than 500 matches or a CSV over 2 MB
returns an explicit error with no partial download. Choose a shorter range in
that case. A single day exceeding these limits is not exportable in this first
increment; paginated or asynchronous large exports remain future work. Admission
is limited to ten export requests per business per hour, plus account limits.

CSV uses UTF-8 with a BOM, quoted cells, escaped embedded quotes and CRLF record
separators. Potential formula prefixes, including leading whitespace/control
characters, receive a literal apostrophe. Control characters other than tabs and
line breaks are replaced with spaces. Names, messages and Unicode remain text.
Customers should avoid removing protective apostrophes before opening a file
with a spreadsheet program.

Exported enquiry columns: reference, name, email, enquiry, status, creation time
and update time. Appointment columns: reference, name, email, start/end, state,
creation time and update time. No request/manage digests, cancellation links,
credentials, WhatsApp threads, internal notes or staff records are selected.
Download controls explain that the file contains customer contact information.

No migration or new sending flags are needed. Production remains gated until
the separately authorised release. Local verification: 95 Worker tests and 15
website tests passed, including owner isolation, staff refusal, Lagos boundary
dates, invalid dates, Unicode/quotes/formulas, cancelled bookings, empty exports,
row and byte bounds. Worker/frontend TypeScript and targeted ESLint passed.

25 October staging checkpoint: Worker version
6170a805-3217-479f-91ce-80fa20c3fd56 deployed and Vercel preview
dpl_5b5teEENQUR6MXH9CxjQ2YjwkF9Y is Ready. The reusable codex-team-i-60166a
staging alias points to this preview. The owner Inbox displayed the export form
and reported a prepared one-record enquiry export. The browser download event
timed out; disk receipt and file inspection remain unverified. Opening Edge's
internal Downloads page is blocked by browser-control policy, so user confirmation
of the saved path was requested. Evidence: tmp/record-export-preview.png.

Two disposable reserved example.test fixtures remain in staging for acceptance:
lead e850e456-3ae7-4a64-ae79-f4910e56ab42 and cancelled booking
0280b873-8d20-4b09-9d75-72c48e34fe1a, both scoped to TriumphantTech Staging Test.
Remove these exact records after file acceptance; no messages were queued.
Production is unchanged. Draft PR #27 contains this increment.
