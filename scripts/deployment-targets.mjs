import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function deploymentTargets(files, target) {
  if (target) {
    if (!['all','website','scanner','redirects'].includes(target)) throw Error('Unknown deployment target');
    return Object.fromEntries(['website','scanner','redirects'].map(name=>[name,target==='all'||target===name]));
  }
  const changed = files.filter(file=>!file.includes('.test.')&&!file.startsWith('docs/')&&!/^[^/]+\.md$/.test(file));
  const shared = changed.some(file=>['package.json','package-lock.json','tsconfig.json','.github/workflows/deploy-production.yml','scripts/deployment-targets.mjs'].includes(file));
  return {
    website: shared || changed.some(file=>/^(app|components|lib|content|public|styles)\//.test(file)||/^cloudflare\/(worker|environment|schedules)\.ts$/.test(file)||/^scripts\/(build-cloudflare|cloudflare-|bundle-site-content|refresh-sitemap-lastmod|sync-blog-index)/.test(file)||/^(next\.config\.|open-next\.config\.|proxy\.|wrangler\.jsonc|postcss\.config\.|tailwind\.config\.)/.test(file)),
    scanner: shared || changed.some(file=>file.startsWith('netlify/scanner/')||/^lib\/(seo-|public-form-guard\.ts|client-ip\.ts|automation-api\.ts)/.test(file)||['scripts/check-hosted-scanner.mts','scripts/publish-netlify-draft.mjs'].includes(file)),
    redirects: shared || changed.some(file=>file.startsWith('cloudflare/legacy-redirect/')),
  };
}

if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  const event=JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH,'utf8'));
  if(process.env.GITHUB_EVENT_NAME==='pull_request') {
    fs.appendFileSync(process.env.GITHUB_OUTPUT,'website=false\nscanner=false\nredirects=false\nverify=true\n');
    console.log('Pull request: verification only; no production credentials or deployment jobs.');
    process.exit(0);
  }
  if(process.env.GITHUB_REF!=='refs/heads/main')throw Error('Production deploys require main');
  let files=[];
  if(process.env.GITHUB_EVENT_NAME==='push') {
    const before=event.before;
    const after=event.after;
    if(!/^[a-f0-9]{40}$/.test(before)||!/^[a-f0-9]{40}$/.test(after))throw Error('Invalid push revisions');
    const args=/^0+$/.test(before)?['ls-tree','-r','--name-only','-z',after]:['diff','--name-only','-z',before,after];
    const git=spawnSync('git',args,{encoding:'utf8'});
    if(git.status!==0)throw Error('Could not inspect changed paths');
    files=git.stdout.split('\0').filter(Boolean);
  }
  const targets=deploymentTargets(files,process.env.GITHUB_EVENT_NAME==='workflow_dispatch'?(event.inputs?.target||'all'):undefined);
  targets.verify=Object.values(targets).some(Boolean)||files.some(file=>file.includes('.test.'));
  fs.appendFileSync(process.env.GITHUB_OUTPUT,Object.entries(targets).map(([k,v])=>`${k}=${v}`).join('\n')+'\n');
  console.log(JSON.stringify(targets));
}
