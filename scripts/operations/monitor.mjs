import {spawnSync} from 'node:child_process';
import {mkdtempSync, readFileSync, rmSync, rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {incidentNotifications, notificationDrill} from './incident-notifications.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const wrangler = process.env.WRANGLER_PATH || join(root, 'node_modules/wrangler/bin/wrangler.js');
const directory = mkdtempSync(join(tmpdir(), 'triumphant-monitor-'));
const marker = join(directory, 'status.json');
const failures = [];
async function check(name, operation) {
  try { await operation(); console.log(`${name}: healthy`); }
  catch { failures.push(name); console.error(`${name}: attention required`); }
}
try {
  if (process.argv.includes('--notification-drill')) {
    await notificationDrill();
  } else {
  await check('Public website', async () => {
    const response = await fetch('https://triumphantech.com/', {signal: AbortSignal.timeout(20000)});
    if (!response.ok) throw new Error();
    await response.body?.cancel();
  });
  await check('Production automation heartbeat', async () => {
    const command = spawnSync(process.execPath, [wrangler, 'd1', 'execute', 'triumph_db', '--remote', '--env', 'production', '--json', '--command', "SELECT last_success,last_outcome FROM automation_heartbeat WHERE id='minute-cron'"], {cwd: join(root, 'workers/triumph-automations'), encoding: 'utf8', timeout: 60000});
    if (command.status !== 0) throw new Error();
    const result = JSON.parse(command.stdout);
    const heartbeat = result[0]?.results?.[0];
    const age = Date.now() - Date.parse(heartbeat?.last_success);
    if (!result[0]?.success || !Number.isFinite(age) || age < -60000 || age > 5 * 60000 || heartbeat.last_outcome === 'failed') throw new Error();
  });
  await check('Verified production backup age', async () => {
    const command = spawnSync(process.execPath, [wrangler, 'r2', 'object', 'get', 'triumphant-hq-backups/status/production.json', '--remote', '--file', marker], {encoding: 'utf8', timeout: 60000});
    if (command.status !== 0) throw new Error();
    const status = JSON.parse(readFileSync(marker, 'utf8'));
    const age = Date.now() - Date.parse(status.verifiedAt);
    if (status.environment !== 'production' || !Number.isFinite(age) || age < -60000 || age > 36 * 3600000) throw new Error();
  });
  if (failures.length) process.exitCode = 1;
  await incidentNotifications(failures);
  }
} catch {
  console.error('Operations notification check failed; review its credential or durable state. No provider response or customer data is logged.');
  process.exitCode = 1;
} finally {
  rmSync(marker, {force: true});
  rmdirSync(directory);
}
