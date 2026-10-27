import assert from 'node:assert/strict';
import { seoNodeHeaders, SEO_NODE_PATH } from '../lib/seo-node-auth';

const origin=new URL(process.argv[2] || 'https://triumphant-hq-seo.netlify.app');
if(origin.protocol!=='https:'||origin.username||origin.password||origin.port||
 !/^(?:[a-f0-9]{24}--)?triumphant-hq-seo\.netlify\.app$/.test(origin.hostname))throw Error('Unexpected scanner origin');
const secret=process.env.SEO_NODE_SHARED_SECRET || '';
if(secret.length<32)throw Error('Scanner verification secret is missing');
const url=new URL(SEO_NODE_PATH,origin);
const unsigned=await fetch(url,{method:'POST',body:'{}',redirect:'manual',signal:AbortSignal.timeout(30000)});
assert.equal(unsigned.status,401,'Unsigned requests must be rejected');
await unsigned.body?.cancel();
const serverTime=Date.parse(unsigned.headers.get('date') || '');
if(!Number.isFinite(serverTime))throw Error('Missing scanner response date');
const skew=serverTime-Date.now();
for(const [websiteUrl,status] of [['http://127.0.0.1',400],['http://localtest.me',400],['https://example.com',200]] as const) {
 const body=JSON.stringify({websiteUrl});
 const response=await fetch(url,{method:'POST',body,headers:seoNodeHeaders(body,secret,Date.now()+skew),redirect:'manual',signal:AbortSignal.timeout(30000)});
 assert.equal(response.status,status,'Unexpected scanner result');
 const result=await response.json();
 if(status===200){assert.equal(result.ok,true);assert.equal(result.checks.length,17);}
}
console.log('Hosted scanner passed: unsigned rejection, private address/DNS rejection, 17 public checks.');
