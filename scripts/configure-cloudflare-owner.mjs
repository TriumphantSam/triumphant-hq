// Local-only entry for a non-exportable Vercel owner credential. Never logs or
// stores the plaintext password and never changes the existing Vercel login.
import http from "node:http";
import fs from "node:fs";
import { createHash, randomBytes } from "node:crypto";
const origin = "http://127.0.0.1:8792";
const csrf = randomBytes(32).toString("hex");
const server = http.createServer(async (request, response) => {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'");
  response.setHeader("X-Content-Type-Options", "nosniff");
  if (request.headers.host !== "127.0.0.1:8792") { response.writeHead(403).end(); return; }
  if (request.method === "GET" && request.url === "/") {
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Preserve owner sign-in</title><style>body{font:17px system-ui;background:#f5f7fb;color:#152039;margin:0;padding:40px 20px}main{max-width:480px;margin:40px auto;background:white;padding:32px;border-radius:16px}h1{font-size:28px}p{line-height:1.6}input,button{box-sizing:border-box;width:100%;padding:14px;font:inherit;margin-top:12px;border-radius:8px;border:1px solid #aab6c9}button{background:#1556ce;color:white;border:0;cursor:pointer}</style><main><h1>Preserve owner sign-in</h1><p>Enter the password you currently use for the owner workspace. This prepares the same sign-in for the Cloudflare migration.</p><p>This page runs only on this computer. Your password is not sent through chat, and your existing website login stays unchanged.</p><form method="post" action="/save"><input type="hidden" name="csrf" value="${csrf}"><label for="password">Current owner password</label><input id="password" name="password" type="password" autocomplete="current-password" maxlength="200" required><button>Prepare owner sign-in</button></form></main></html>`);
    return;
  }
  if (request.method !== "POST" || request.url !== "/save" || request.headers.origin !== origin) { response.writeHead(403).end(); return; }
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body) > 4096) { response.writeHead(413).end(); return; }
  }
  const fields = new URLSearchParams(body);
  const password = fields.get("password") || "";
  if (fields.get("csrf") !== csrf || !password || password.length > 200) { response.writeHead(403).end(); return; }
  const file = ".env.cloudflare";
  const current = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const lines = current.split(/\r?\n/).filter(line => line && !line.startsWith("ADMIN_LAB_PASSWORD_HASH="));
  lines.push(`ADMIN_LAB_PASSWORD_HASH=${createHash("sha256").update(password).digest("hex")}`);
  fs.writeFileSync(file, lines.join("\n") + "\n", { mode: 0o600 });
  response.setHeader("Content-Type", "text/plain; charset=utf-8");
  response.end("Owner sign-in is prepared on this computer. You can close this page.");
  server.close();
});
server.listen(8792, "127.0.0.1", () => console.log(`Owner setup is available at ${origin}. Password values are never logged.`));
