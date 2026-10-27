import test from 'node:test';
import assert from 'node:assert/strict';
import { deploymentTargets } from './deployment-targets.mjs';
test('website, scanner and legacy redirects publish independently',()=>{
 assert.deepEqual(deploymentTargets(['app/page.tsx']),{website:true,scanner:false,redirects:false});
 assert.deepEqual(deploymentTargets(['content/blog/post.md']),{website:true,scanner:false,redirects:false});
 assert.deepEqual(deploymentTargets(['netlify/scanner/functions/seo-snapshot.mts']),{website:false,scanner:true,redirects:false});
 assert.deepEqual(deploymentTargets(['cloudflare/legacy-redirect/worker.ts']),{website:false,scanner:false,redirects:true});
 assert.deepEqual(deploymentTargets(['lib/seo-audit.ts']),{website:true,scanner:true,redirects:false});
});
test('documentation and tests skip releases; dependency and workflow updates publish all',()=>{
 assert.deepEqual(deploymentTargets(['docs/runbook.md','lib/seo-audit.test.ts']),{website:false,scanner:false,redirects:false});
 for(const file of ['package-lock.json','.github/workflows/deploy-production.yml'])assert.deepEqual(deploymentTargets([file]),{website:true,scanner:true,redirects:true});
 assert.deepEqual(deploymentTargets([], 'scanner'),{website:false,scanner:true,redirects:false});
 assert.throws(()=>deploymentTargets([],'unknown'));
});
