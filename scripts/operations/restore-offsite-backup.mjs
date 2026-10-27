import {readFileSync, writeFileSync, mkdtempSync, rmSync, rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {decryptBackup} from './backup-archive.mjs';

// Verification only: deliberately no remote D1 connection or restore option.
const directory = mkdtempSync(join(tmpdir(), 'triumphant-recovery-'));
const sql = join(directory, 'recovery.sql');
try {
  writeFileSync(sql, decryptBackup(readFileSync(process.argv[2]), process.env.BACKUP_ENCRYPTION_KEY), {mode: 0o600});
  const check = spawnSync(process.execPath, [fileURLToPath(new URL('./verify-backup.mjs', import.meta.url)), sql], {encoding: 'utf8', timeout: 600000});
  if (check.status !== 0) throw new Error();
  console.log('Downloaded archive decrypted and restored in isolated SQLite. Remote database unchanged.');
} catch {
  console.error('Recovery verification failed. No SQL, key or customer content is logged.');
  process.exitCode = 1;
} finally {
  rmSync(sql, {force: true});
  rmdirSync(directory);
}
