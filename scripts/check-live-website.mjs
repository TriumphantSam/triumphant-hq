import assert from 'node:assert/strict';
if(!process.argv.includes('--redirects-only')) {
 for(const [path,status] of [['/',200],['/blog',200],['/sitemap.xml',200],['/robots.txt',200],['/api/invoices',401],['/api/seo/run-follow-ups',401],['/api/digital-forge/follow-ups/run',401]]) {
  const response=await fetch('https://triumphantech.com'+path,{redirect:'manual',signal:AbortSignal.timeout(30000)});
  assert.equal(response.status,status,path);
  assert.equal(response.headers.get('x-robots-tag'),null,'Production must remain indexable');
  await response.body?.cancel();
 }
 console.log('Live website checks passed; no leads or messages were created.');
}
for(const host of ['www.triumphantech.com','triumphanthq.com','www.triumphanthq.com']) {
 const response=await fetch(`https://${host}/blog?ref=deploy-check`,{redirect:'manual',signal:AbortSignal.timeout(30000)});
 assert.equal(response.status,301,host);
 assert.equal(response.headers.get('location'),'https://triumphantech.com/blog?ref=deploy-check',host);
 await response.body?.cancel();
}
console.log('Canonical and legacy redirect checks passed.');
