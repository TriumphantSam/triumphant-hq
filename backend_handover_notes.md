# TriumphantHQ SEO Funnel: Backend Handover Notes

**Status:** Frontend Design & Client Routing 100% Complete. 
**Next Phase:** API Wiring & Backend Logic Implementation.

Welcome to the backend handover for the new elite "Digital Forge" SEO lead engine. The frontend UX, layout, animations, and routing have been completely restructured. It is vital that the incoming backend systems conform perfectly to the data types expected by the frontend state management to prevent hydration bugs or layout collapses.

## 1. Funnel Architecture Flow
The funnel operates sequentially, using `sessionStorage` to carry payload states forward without requiring URL parameters.
1. `/seo-snapshot`: Landing page. Captures lead details via Modal form. Submits `POST` payload.
2. `/seo-implementation`: Results page. Instantiates its content dynamically by parsing `sessionStorage.getItem('trium_seo_result')`.
3. `/seo-snapshot/thank-you`: Final success page after the user completes the funnel or books a follow-up call.

## 2. Global State & API Expected Contracts
When the user submits the form on the landing page, the following fetch is executed:

### The Request Trigger
```javascript
const res = await fetch('/api/seo/quick-audit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    websiteUrl: 'apple.com',
    name: 'John Doe',
    email: 'john@apple.com',
    businessType: 'ecommerce' // Can be: '', 'ecommerce', 'local', 'saas', 'agency', 'other'
  }),
});
```

### The Expected Response (CRITICAL)
For the `/seo-implementation` UI to render perfectly, the backend **must** return an object exactly matching this interface shape. The frontend currently mocks this payload if the `fetch` fails in development mode.

```typescript
interface ExpectedBackendResponse {
  ok: boolean; // Must be true for the frontend router to trigger progression
  leadId: string; // Database ID mapping to this specific user report
  domain: string; // Stripped of https/www for aesthetic rendering
  quickScore: number; // 0-100 score integer
  statusLabel: string; // E.g., 'Needs Attention', 'Critical Warning', 'Excellent'
  summary: string; // 1-2 sentence paragraph summarizing the holistic health
  visibleIssues: string[]; // Minimum 3 strings. Displayed dynamically as red warning cards
  opportunities: string[]; // Minimum 3 strings. Displayed dynamically as green action cards
}
```
*Note: Ensure strings within arrays do not contain markdown—the UI expects plain text and applies its own typography classes.*

## 3. Immediate Backend Action Items
1. **Build the API Route**: Create exactly `app/api/seo/quick-audit/route.ts` to handle the incoming `POST` request.
2. **Remove the Demo Mock**: Inside `app/seo-snapshot/page.tsx`, navigate to `handleSubmit`. You will see `if (!res.ok) { data = { /* mock data */ } }`. **Remove this `!res.ok` override**. The code must rely natively on `const data = await res.json()`.
3. **Connect CRM / Automated Emails**: Use the captured payload (`name`, `email`) within the route to trigger the backend webhook (e.g., ActiveCampaign, Mailgun, Pipedream) so the user receives the "We have logged your full audit request" email promised on the Thank You page.
4. **Wire the Calendly Links**: Across `/seo-implementation` and the Thank You page, there are "Skip the Wait - Book a Call" or "Start Operations Now" buttons. Currently, these contain `<Link href="/contact">`. You need to replace these `href` values with either your production booking URL or Calendly popup script links.

## 4. Design Note on Edits
The entire funnel is built using highly specific "brute force vertical spacers" (e.g., `<div className="h-10 lg:h-16 w-full shrink-0"></div>`). 
Do **not** use CSS Grid layout changes, flex gaps, or native `margin-top/bottom` on major sections, as they previously caused complex responsive rendering collapses on smaller screens. Maintain the strict spacer architecture.
