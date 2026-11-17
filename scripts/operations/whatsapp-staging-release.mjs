import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';

const account='a9bf344e401d603c114b152f500e6722';
const database='97244bca-414e-4cd1-b1d2-492f9c0b5c5f';
const workspace='96845119-ee82-43bd-b080-d023fab18e69';
const phone='1414395761751675';

// Fixed staging target; no caller-controlled account, database or SQL.
export async function verifyStagingRelease(mode,token,fetcher=fetch){
 assert.ok(['before','after'].includes(mode),'Choose before or after');
 assert.ok(typeof token==='string'&&token.length>10,'Missing staging D1 credential');
 const base=`https://api.cloudflare.com/client/v4/accounts/${account}/d1/database/${database}`;
 async function api(path,body){
  const response=await fetcher(base+path,{method:body?'POST':'GET',redirect:'error',signal:AbortSignal.timeout(15000),headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
  if(!response.ok)throw Error(`Staging D1 request rejected (${response.status})`);
  const data=await response.json();assert.equal(data.success,true,'Staging D1 request failed');return data.result;
 }
 const info=await api('');assert.equal(info.uuid,database,'Unexpected database ID');assert.equal(info.name,'triumph_db_staging','Unexpected database name');
 async function query(sql,params=[]){
  const results=await api('/query',{sql,params});assert.equal(results.length,1,'Unexpected D1 response');assert.equal(results[0].success,true,'Staging query failed');return results[0].results;
 }
 const read=()=>query('SELECT c.workspace_id,c.state,r.enabled,r.ai_enabled FROM platform_whatsapp_connections c LEFT JOIN platform_responder_settings r ON r.workspace_id=c.workspace_id WHERE c.phone_number_id=?',[phone]);
 const rows=await read();assert.equal(rows.length,1,'Expected one company connection');assert.equal(rows[0].workspace_id,workspace,'Unexpected company workspace');assert.equal(rows[0].state,'connected','Company number must remain connected');
 if(mode==='before'){
  assert.ok(rows[0].enabled!==null&&rows[0].ai_enabled!==null,'Missing saved responder settings');
  if(rows[0].enabled!==0||rows[0].ai_enabled!==0){
   await query("UPDATE platform_responder_settings SET enabled=0,ai_enabled=0,version=version+1,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE workspace_id=? AND EXISTS(SELECT 1 FROM platform_whatsapp_connections WHERE workspace_id=? AND phone_number_id=?)",[workspace,workspace,phone]);
  }
 }
 const verified=await read();assert.equal(verified[0].enabled,0,'Automatic replies must be off');assert.equal(verified[0].ai_enabled,0,'AI replies must be off');
 if(mode==='after'){
  const settings=await query('SELECT enabled,json_array_length(recipients) AS count FROM platform_whatsapp_test_settings WHERE workspace_id=?',[workspace]);
  assert.ok(settings.length<=1,'Unexpected test settings');assert.equal(settings[0]?.enabled||0,0,'Selected-contact testing must remain off');
  const applied=await query("SELECT count(*) AS count FROM d1_migrations WHERE name='0028_whatsapp_test_contacts.sql'");assert.equal(applied[0].count,1,'Test-contact migration is not applied');
 }
 return {environment:'staging',companyConnected:true,automaticReplies:false,aiReplies:false,...(mode==='after'?{selectedContactTesting:false,migrationApplied:true}:{})};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 try{console.log(JSON.stringify(await verifyStagingRelease(process.argv[2],process.env.CLOUDFLARE_API_TOKEN)));}
 catch(error){console.error(error instanceof Error?error.message:'Staging release verification failed');process.exitCode=1;}
}
