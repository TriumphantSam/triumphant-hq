import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './worker';
test('legacy redirects preserve paths, encoding and query strings on both schemes',async()=>{
 for(const input of ['http://triumphanthq.com/','https://www.triumphanthq.com/blog/item?ref=legacy','https://triumphanthq.com/a%20b/file.pdf?x=1&y=2']) {
  const source=new URL(input);const response=await worker.fetch(new Request(input));
  const to=new URL(response.headers.get('location')!);
  assert.equal(response.status,301);assert.equal(to.origin,'https://triumphantech.com');
  assert.equal(to.pathname,source.pathname);assert.equal(to.search,source.search);
 }
});
