import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyStagingRelease} from './whatsapp-staging-release.mjs';

function fake({enabled=0,workspace='96845119-ee82-43bd-b080-d023fab18e69',database='triumph_db_staging',testing=0}={}){
 const queries=[];let state=enabled;
 const fetcher=async(url,init)=>{
  assert.ok(String(url).startsWith('https://api.cloudflare.com/client/v4/accounts/a9bf344e401d603c114b152f500e6722/d1/database/97244bca-414e-4cd1-b1d2-492f9c0b5c5f'));
  assert.equal(new Headers(init.headers).get('Authorization'),'Bearer synthetic-token');
  if(!String(url).endsWith('/query'))return Response.json({success:true,result:{uuid:'97244bca-414e-4cd1-b1d2-492f9c0b5c5f',name:database}});
  const {sql,params}=JSON.parse(init.body);queries.push({sql,params});let results;
  if(sql.startsWith('SELECT c.workspace_id'))results=[{workspace_id:workspace,state:'connected',enabled:state,ai_enabled:state}];
  else if(sql.startsWith('UPDATE platform_responder_settings')){assert.equal(params[0],workspace);assert.equal(params[2],'1414395761751675');state=0;results=[];}
  else if(sql.includes('FROM platform_whatsapp_test_settings'))results=[{enabled:testing,count:0}];
  else if(sql.includes('FROM d1_migrations'))results=[{count:1}];
  else throw Error('Unexpected staging query');
  return Response.json({success:true,result:[{success:true,results}]});
 };
 return {fetcher,queries};
}
test('release check targets staging and keeps the company connected with replies off',async()=>{
 const f=fake();const result=await verifyStagingRelease('before','synthetic-token',f.fetcher);
 assert.equal(result.automaticReplies,false);assert.equal(result.companyConnected,true);assert.equal(f.queries.filter(q=>q.sql.startsWith('UPDATE')).length,0);
});
test('an enabled responder is disabled only for the checked company workspace',async()=>{
 const f=fake({enabled:1});await verifyStagingRelease('before','synthetic-token',f.fetcher);assert.equal(f.queries.filter(q=>q.sql.startsWith('UPDATE')).length,1);
});
test('wrong database or workspace fail before any mutation',async()=>{
 for(const options of [{database:'triumph_db'},{workspace:'another-workspace'}]){
  const f=fake(options);await assert.rejects(verifyStagingRelease('before','synthetic-token',f.fetcher));assert.equal(f.queries.filter(q=>q.sql.startsWith('UPDATE')).length,0);
 }
});
test('post-release verifies the migration and refuses enabled selected-contact testing',async()=>{
 await verifyStagingRelease('after','synthetic-token',fake().fetcher);
 await assert.rejects(verifyStagingRelease('after','synthetic-token',fake({testing:1}).fetcher),/remain off/);
});
test('rejected credentials fail with a generic status without exposing the provider body',async()=>{
 await assert.rejects(verifyStagingRelease('before','synthetic-token',async()=>new Response('PRIVATE PROVIDER BODY',{status:403})),error=>error.message==='Staging D1 request rejected (403)');
});
