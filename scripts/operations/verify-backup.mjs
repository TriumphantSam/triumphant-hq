import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
let database;
try {
  const bytes=readFileSync(process.argv[2]);
  database=new DatabaseSync(':memory:');
  database.exec(bytes.toString('utf8'));
  const integrity=database.prepare('PRAGMA integrity_check').all();
  const foreignKeys=database.prepare('PRAGMA foreign_key_check').all();
  if(integrity.length!==1||Object.values(integrity[0])[0]!=='ok'||foreignKeys.length)throw new Error();
  const tables=database.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all();
  if(!tables.some(t=>t.name==='platform_workspaces')||!tables.some(t=>t.name==='leads'))throw new Error();
  const counts=Object.fromEntries(tables.map(({name})=>[name,database.prepare('SELECT count(*) AS n FROM "'+name.replaceAll('"','""')+'"').get().n]));
  process.stdout.write(JSON.stringify({integrity:'ok',foreignKeyViolations:0,sqlSha256:createHash('sha256').update(bytes).digest('hex'),tables:counts}));
} catch {
  process.stderr.write('Isolated backup restore verification failed. No database content is logged.\n');
  process.exitCode=1;
} finally {database?.close();}
