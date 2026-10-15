import { runSeoAudit } from "../lib/seo-audit";
// Read-only engine checks: never creates leads or sends email/WhatsApp.
const urls = process.argv.slice(2);
if (!urls.length) throw new Error("Supply public website URLs to audit.");
const results: {
  url: string;
  ok: boolean;
  ms: number;
  score?: number;
  error?: string;
}[] = [];
for (const url of urls) {
  const started = Date.now();
  try {
    const result = await runSeoAudit(url);
    results.push({
      url,
      ok: result.ok,
      ms: Date.now() - started,
      score: result.quickScore,
    });
  } catch (error) {
    results.push({
      url,
      ok: false,
      ms: Date.now() - started,
      error: error instanceof Error ? error.message : "Audit failed",
    });
  }
}
console.log(JSON.stringify(results, null, 2));
if (results.some((r) => !r.ok || r.ms >= 15000)) process.exitCode = 1;
