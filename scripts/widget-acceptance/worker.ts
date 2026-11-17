// Independent public test host. No bindings, credentials, analytics or customer data.
const source = "https://triumphant-hq-web-preview.triumphantsam30.workers.dev";
const workspace = "d0e0f0a0-2026-4020-8020-202610200001";
export default {
  fetch(request: Request) {
    if (new URL(request.url).pathname !== "/") return new Response("Not found", { status: 404 });
    return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Independent website installation test</title>
<style>body{margin:0;background:#f3f6f1;color:#16392e;font:16px/1.6 system-ui,sans-serif}main{max-width:1040px;margin:auto;padding:32px 20px}h1{line-height:1.15;font-size:clamp(28px,5vw,46px)}.badge{font-size:12px;letter-spacing:.12em;text-transform:uppercase}.grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.5fr);gap:28px}iframe{width:100%;height:780px;border:1px solid #d2ddd4;border-radius:20px;background:white;box-sizing:border-box}aside{padding:12px}a{color:inherit}@media(max-width:700px){.grid{grid-template-columns:minmax(0,1fr)}main{padding:24px 14px}}</style>
<main><p class="badge">TriumphantTech · installation acceptance</p><h1>A customer website.<br>A separate assistant.</h1><p>This page is hosted on Cloudflare. The assistant below is served by the staging website on Cloudflare.</p><div class="grid"><aside><h2>Synthetic business only</h2><p>Ask: “What are your consultation hours?”</p><p>Enquiry and booking records are test records. No email, WhatsApp, SMS or payments are sent. Do not enter personal or customer information.</p><p>A working installation shows the business inside the frame and answers without an owner-workspace login.</p><p><a href="${source}/business/${workspace}/widget" target="_blank" rel="noopener noreferrer">Open assistant separately</a></p></aside><iframe src="${source}/business/${workspace}/widget" title="Business assistant" width="100%" height="780" loading="lazy" referrerpolicy="no-referrer" sandbox="allow-scripts allow-forms allow-same-origin allow-popups"></iframe></div></main></html>`, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Security-Policy": `default-src 'none'; style-src 'unsafe-inline'; frame-src ${source}; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`,
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
      },
    });
  },
};
