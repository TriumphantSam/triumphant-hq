import {test} from 'node:test';
import assert from 'node:assert/strict';
import {encryptBackup, decryptBackup} from './backup-archive.mjs';
import {mkdtempSync, writeFileSync, rmSync, rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const key = '12'.repeat(32);
test('portable encrypted archive round trips and uses a fresh nonce', () => {
  const sql = Buffer.from('CREATE TABLE leads(id TEXT);');
  const first = encryptBackup(sql, key);
  assert.deepEqual(decryptBackup(first, key), sql);
  assert.notDeepEqual(first, encryptBackup(sql, key));
  assert.equal(first.includes(sql), false);
});
test('recovery utility verifies a real isolated restore and rejects broken foreign keys', () => {
  const directory = mkdtempSync(join(tmpdir(), 'backup-test-'));
  const path = join(directory, 'synthetic.enc');
  const script = fileURLToPath(new URL('./restore-offsite-backup.mjs', import.meta.url));
  const base = 'CREATE TABLE platform_workspaces(id TEXT PRIMARY KEY); CREATE TABLE leads(id TEXT, workspace TEXT REFERENCES platform_workspaces(id));';
  try {
    for (const [sql, expected] of [[base, 0], [base + "INSERT INTO leads VALUES('synthetic','missing');", 1]]) {
      writeFileSync(path, encryptBackup(Buffer.from(sql), key));
      const result = spawnSync(process.execPath, [script, path], {encoding: 'utf8', env: {...process.env, BACKUP_ENCRYPTION_KEY: key}});
      assert.equal(result.status, expected);
      assert.equal((result.stdout + result.stderr).includes('INSERT INTO'), false);
    }
  } finally { rmSync(path, {force: true}); rmdirSync(directory); }
});
test('wrong key, modified ciphertext, truncated archive and header fail closed', () => {
  const archive = encryptBackup(Buffer.from('customer data'), key);
  assert.throws(() => decryptBackup(archive, '34'.repeat(32)));
  for (const position of [0, 9, 22, archive.length - 1]) {
    const modified = Buffer.from(archive); modified[position] ^= 1;
    assert.throws(() => decryptBackup(modified, key));
  }
  assert.throws(() => decryptBackup(archive.subarray(0, 25), key));
  assert.throws(() => encryptBackup(Buffer.from('sql'), 'bad'));
});
