export function previewFollowUps(leads, now = new Date()) {
  const instant = now.getTime();
  if (!Number.isFinite(instant)) throw new Error('Invalid preview time');
  const latest = new Map();
  for (const lead of leads) {
    const email = String(lead.email || '').trim().toLowerCase();
    if (!latest.has(email) || String(lead.created_at) > String(latest.get(email).created_at)) latest.set(email, lead);
  }
  const excluded = {};
  const drafts = [];
  const skip = reason => { excluded[reason] = (excluded[reason] || 0) + 1; };
  for (const [email, lead] of latest) {
    const created = Date.parse(lead.created_at);
    const consentAt = Date.parse(lead.consent_at);
    const age = instant - created;
    if (lead.source !== 'seo_snapshot') { skip('unsupported_source'); continue; }
    if (lead.consent_marketing !== 1 || !Number.isFinite(consentAt) || consentAt < created || consentAt > instant) { skip('consent_missing'); continue; }
    // Existing lead capture can merge repeat enquiries without renewing consent.
    // A later edit must be reviewed rather than inferred to be a fresh opt-in.
    if (!lead.updated_at || Date.parse(lead.updated_at) > consentAt || !Number.isFinite(Date.parse(lead.updated_at))) { skip('consent_needs_review'); continue; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { skip('invalid_email'); continue; }
    if (lead.status !== 'new') { skip('already_contacted_or_closed'); continue; }
    if (lead.has_booking) { skip('booking_exists'); continue; }
    if (!Number.isFinite(created) || age > 7 * 86400000) { skip('stale_or_invalid'); continue; }
    if (age < 86400000) { skip('not_due'); continue; }
    if (!lead.reply_sent_at || !Number.isFinite(Date.parse(lead.reply_sent_at)) || Date.parse(lead.reply_sent_at) > instant - 86400000) { skip('initial_reply_not_confirmed_or_too_recent'); continue; }
    drafts.push({ leadId: lead.id, to: email, subject: 'Your website visibility next steps',
      body: `Hi ${String(lead.name || '').replace(/[\r\n]/g, ' ').slice(0, 120)},\n\nWould you like help prioritising the next steps from your website snapshot? You can reply with the issue you would like to tackle first.\n\nTriumphantTech`,
      idempotencyKey: `seo-followup:${lead.id}:1`, status: 'draft_only' });
  }
  return { mode: 'preview', sendingEnabled: false, generatedAt: now.toISOString(), inspected: leads.length,
    duplicateRecordsExcluded: leads.length - latest.size, eligible: drafts.length, excluded, drafts,
    digitalForge: { ready: false, reason: 'No durable consent-aware campaign queue; purchase and transactional email are not marketing consent.' } };
}
