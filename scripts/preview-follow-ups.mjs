import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { previewFollowUps } from './follow-up-preview.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
// Read-only production queries. No provider calls, queue writes or migrations.
const sql = `SELECT l.id,l.created_at,l.updated_at,l.source,l.name,l.email,l.consent_marketing,l.consent_at,l.status,
 EXISTS(SELECT 1 FROM bookings b WHERE b.email=l.email COLLATE NOCASE) AS has_booking,
 (SELECT sent_at FROM outbox o WHERE o.lead_id=l.id AND o.kind='reply_email' AND o.state='sent') AS reply_sent_at
 FROM leads l ORDER BY l.created_at DESC LIMIT 1001`;
const run = spawnSync(process.execPath, [path.join(root,'node_modules/wrangler/bin/wrangler.js'),
  'd1','execute','triumph_db','--remote','--env','production','--config',path.join(root,'workers/triumph-automations/wrangler.jsonc'),
  '--command',sql,'--json'], { cwd:root, encoding:'utf8', timeout:120000, maxBuffer:4*1024*1024 });
if (run.status !== 0) throw new Error('Read-only D1 preview failed. Check Wrangler login; no messages were sent.');
const response = JSON.parse(run.stdout);
if (!response[0]?.success || !Array.isArray(response[0].results)) throw new Error('D1 returned an invalid preview');
if (response[0].meta?.rows_written) throw new Error('Expected a read-only query');
if (response[0].results.length > 1000) throw new Error('Preview exceeds 1000 leads; pagination is required before proceeding.');
const result = previewFollowUps(response[0].results);
const directory = path.join(root,'output/followups');
fs.mkdirSync(directory,{recursive:true});
fs.writeFileSync(path.join(directory,'preview.json'),JSON.stringify(result,null,2));
fs.writeFileSync(path.join(directory,'preview.md'),`# Follow-up preview\n\nSending is disabled. Nothing was queued or sent.\n\nInspected: ${result.inspected}. Eligible drafts: ${result.eligible}.\n\nExclusions: ${JSON.stringify(result.excluded)}\n\nDigital Forge: ${result.digitalForge.reason}\n\n` + result.drafts.map(d=>`## Draft ${d.leadId}\n\nTo: ${d.to}\n\nSubject: ${d.subject}\n\n${d.body}\n`).join('\n'));
console.log(JSON.stringify({mode:result.mode,sendingEnabled:false,inspected:result.inspected,eligible:result.eligible,excluded:result.excluded,report:'output/followups/preview.md'}));
