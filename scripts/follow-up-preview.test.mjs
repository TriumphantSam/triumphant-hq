import test from 'node:test';
import assert from 'node:assert/strict';
import { previewFollowUps } from './follow-up-preview.mjs';
const now=new Date('2026-10-26T12:00:00Z');
const lead={id:'test',source:'seo_snapshot',email:'test@example.com',name:'Reader',status:'new',created_at:'2026-10-24T12:00:00Z',updated_at:'2026-10-24T12:00:00Z',consent_at:'2026-10-24T12:00:00Z',consent_marketing:1,has_booking:0,reply_sent_at:'2026-10-24T12:00:00Z'};
test('preview excludes missing consent, bookings, contacted leads, stale leads and unconfirmed replies',()=>{
 for(const patch of [{consent_marketing:0},{consent_at:null},{updated_at:'2026-10-25T12:00:00Z'},{has_booking:1},{status:'contacted'},{created_at:'2026-09-01T00:00:00Z'},{reply_sent_at:null},{source:'booking'}])
  assert.equal(previewFollowUps([{...lead,...patch}],now).eligible,0);
});
test('newer non-consenting enquiry suppresses an older consent record',()=>{
 const result=previewFollowUps([lead,{...lead,id:'later',created_at:'2026-10-25T12:00:00Z',consent_marketing:0}],now);
 assert.equal(result.eligible,0);assert.equal(result.duplicateRecordsExcluded,1);
});
test('eligible leads get stable drafts without mutation or sending',()=>{
 const before=JSON.stringify(lead);const result=previewFollowUps([lead],now);
 assert.equal(result.eligible,1);assert.equal(result.sendingEnabled,false);
 assert.equal(result.drafts[0].idempotencyKey,'seo-followup:test:1');
 assert.equal(JSON.stringify(lead),before);
});
