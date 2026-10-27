import fs from 'node:fs';
const draft=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const site='e931abc2-e905-4dce-bcf7-871710bcd062';
if(draft.site_id!==site||!/^[a-f0-9]{24}$/.test(draft.deploy_id))throw Error('Unexpected Netlify deployment');
const token=process.env.NETLIFY_AUTH_TOKEN;
if(!token)throw Error('Netlify deployment credential is missing');
const response=await fetch(`https://api.netlify.com/api/v1/sites/${site}/deploys/${draft.deploy_id}/restore`,{
 method:'POST',headers:{authorization:`Bearer ${token}`},signal:AbortSignal.timeout(30000),
});
if(!response.ok)throw Error(`Netlify publish failed: ${response.status}`);
const published=await response.json();
if(published.id!==draft.deploy_id||published.state!=='ready')throw Error('Netlify publication was not confirmed');
console.log(`Published verified scanner deployment ${published.id}.`);
