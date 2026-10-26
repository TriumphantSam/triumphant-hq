import test from 'node:test';
import assert from 'node:assert/strict';
import { GET as seo } from '../app/api/seo/run-follow-ups/route';
import { GET as forge } from '../app/api/digital-forge/follow-ups/run/route';
test('old follow-up routes fail closed and never call a sender, even with valid authentication', async()=>{
 const original={fetch:globalThis.fetch,secret:process.env.CRON_SECRET,seo:process.env.SEO_FOLLOWUP_CRON_SECRET,forge:process.env.FOLLOW_UP_RUNNER_SECRET};
 try {
  delete process.env.SEO_FOLLOWUP_CRON_SECRET;delete process.env.FOLLOW_UP_RUNNER_SECRET;
  process.env.CRON_SECRET='local-followup-test-secret';
  globalThis.fetch=async()=>{throw Error('No network request permitted');};
  for(const handler of [seo,forge]) {
   assert.equal((await handler(new Request('https://example.com'))).status,401);
   const response=await handler(new Request('https://example.com',{headers:{authorization:'Bearer local-followup-test-secret'}}));
   assert.equal(response.status,409);assert.equal((await response.json()).sendingEnabled,false);
  }
 } finally {
  globalThis.fetch=original.fetch;
  for(const [key,value] of [['CRON_SECRET',original.secret],['SEO_FOLLOWUP_CRON_SECRET',original.seo],['FOLLOW_UP_RUNNER_SECRET',original.forge]]) {
   if(value===undefined)delete process.env[key!];else process.env[key!]=value;
  }
 }
});
