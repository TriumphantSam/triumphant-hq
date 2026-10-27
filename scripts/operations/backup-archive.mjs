import {createCipheriv, createDecipheriv, randomBytes} from 'node:crypto';
import {gzipSync, gunzipSync} from 'node:zlib';

const magic = Buffer.from('TTHQBK01');
const limit = 256 * 1024 * 1024;
function keyBytes(value) {
  if (!/^[a-f0-9]{64}$/i.test(value ?? '')) throw new Error('A 32-byte hexadecimal recovery key is required.');
  return Buffer.from(value, 'hex');
}
export function encryptBackup(sql, key) {
  if (!Buffer.isBuffer(sql) || sql.length === 0 || sql.length > limit) throw new Error('Invalid export size.');
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', keyBytes(key), iv);
  cipher.setAAD(magic);
  const body = Buffer.concat([cipher.update(gzipSync(sql)), cipher.final()]);
  return Buffer.concat([magic, iv, cipher.getAuthTag(), body]);
}
export function decryptBackup(archive, key) {
  if (archive.length < 37 || archive.length > limit || !archive.subarray(0, 8).equals(magic)) throw new Error('Invalid backup archive.');
  const cipher = createDecipheriv('aes-256-gcm', keyBytes(key), archive.subarray(8, 20));
  cipher.setAAD(magic);
  cipher.setAuthTag(archive.subarray(20, 36));
  const compressed = Buffer.concat([cipher.update(archive.subarray(36)), cipher.final()]);
  return gunzipSync(compressed, {maxOutputLength: limit});
}
