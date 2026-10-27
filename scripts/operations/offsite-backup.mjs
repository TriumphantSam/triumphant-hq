import {spawnSync} from 'node:child_process';
import {mkdtempSync, readFileSync, writeFileSync, rmSync, rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {encryptBackup, decryptBackup} from './backup-archive.mjs';

// All command output is captured: export/restore errors must not leak SQL to CI.
const root = fileURLToPath(new URL('../../', import.meta.url));
const wrangler = resolve(root, 'node_modules/wrangler/bin/wrangler.js');
const environment = process.argv[2];
if (!['staging', 'production'].includes(environment)) throw new Error('Choose staging or production.');
if (process.env.CLOUDFLARE_ACCOUNT_ID !== 'a9bf344e401d603c114b152f500e6722') throw new Error('Wrong backup account.');
const key = process.env.BACKUP_ENCRYPTION_KEY;
// Validate the key before exporting any customer data.
encryptBackup(Buffer.from('preflight'), key);
const bucket = 'triumphant-hq-backups';
const database = environment === 'production' ? 'triumph_db' : 'triumph_db_staging';
const directory = mkdtempSync(join(tmpdir(), 'triumphant-backup-'));
const exported = join(directory, 'export.sql');
const restored = join(directory, 'restore.sql');
const archive = join(directory, 'backup.enc');
const downloaded = join(directory, 'download.enc');
const object = `${bucket}/daily/${environment}/${new Date().toISOString().slice(0, 10)}.sql.gz.enc`;
function run(script, args, cwd = root) {
  const result = spawnSync(process.execPath, [script, ...args], {cwd, encoding: 'utf8', timeout: 600000, maxBuffer: 4 * 1024 * 1024});
  if (result.status !== 0) throw new Error('Backup command failed; consult credential scope and service availability. No database content is logged.');
  return result.stdout;
}
try {
  run(wrangler, ['d1', 'export', database, '--remote', '--env', environment, '--output', exported], resolve(root, 'workers/triumph-automations'));
  const sql = readFileSync(exported);
  // Verify the source before allowing it to replace today's stored object.
  run(resolve(root, 'scripts/operations/verify-backup.mjs'), [exported]);
  writeFileSync(archive, encryptBackup(sql, key), {mode: 0o600});
  run(wrangler, ['r2', 'object', 'put', object, '--file', archive, '--remote']);
  run(wrangler, ['r2', 'object', 'get', object, '--file', downloaded, '--remote']);
  const recovered = decryptBackup(readFileSync(downloaded), key);
  if (!createHash('sha256').update(sql).digest().equals(createHash('sha256').update(recovered).digest())) throw new Error('Downloaded backup does not match the export.');
  writeFileSync(restored, recovered, {mode: 0o600});
  run(resolve(root, 'scripts/operations/verify-backup.mjs'), [restored]);
  const marker = join(directory, 'status.json');
  writeFileSync(marker, JSON.stringify({environment, verifiedAt: new Date().toISOString(), object}), {mode: 0o600});
  run(wrangler, ['r2', 'object', 'put', `${bucket}/status/${environment}.json`, '--file', marker, '--remote']);
  console.log(JSON.stringify({environment, object, downloadedRestore: 'verified', remoteDatabaseChanged: false}));
} catch {
  console.error('Offsite backup failed. No export, key or customer content is logged.');
  process.exitCode = 1;
} finally {
  // This exact directory is created by mkdtemp above; no user-supplied deletion path.
  for (const name of ['export.sql', 'restore.sql', 'backup.enc', 'download.enc', 'status.json']) rmSync(join(directory, name), {force: true});
  rmdirSync(directory);
}
