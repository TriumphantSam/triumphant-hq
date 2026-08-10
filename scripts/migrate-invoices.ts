import { config } from "dotenv";
import { resolve } from "node:path";

// Load .env.local when run from CLI
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const { migrateInvoiceDatabase } = await import("../lib/invoices/store");
  console.log("Connecting to Neon and ensuring invoice schema...");
  await migrateInvoiceDatabase();
  console.log("Done. Tables ready and default templates seeded if empty.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
