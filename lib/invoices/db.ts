import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { InvoiceStorageError } from "./errors";

type Sql = NeonQueryFunction<false, false>;

let sqlClient: Sql | null = null;
let schemaReady: Promise<void> | null = null;

export function getDatabaseUrl(): string {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    "";
  if (!url) {
    throw new InvoiceStorageError(
      "Missing DATABASE_URL. Create a Neon project and add DATABASE_URL to .env.local (and Vercel)."
    );
  }
  return url;
}

export function getSql(): Sql {
  if (!sqlClient) {
    sqlClient = neon(getDatabaseUrl());
  }
  return sqlClient;
}

export async function ensureInvoiceSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS invoice_clients (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL DEFAULT '',
          email TEXT NOT NULL DEFAULT '',
          phone TEXT NOT NULL DEFAULT '',
          company TEXT NOT NULL DEFAULT '',
          address TEXT NOT NULL DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS invoice_templates (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          title TEXT NOT NULL,
          quantity DOUBLE PRECISION NOT NULL DEFAULT 1,
          unit_price DOUBLE PRECISION NOT NULL DEFAULT 0,
          currency TEXT NOT NULL DEFAULT 'NGN',
          details JSONB NOT NULL DEFAULT '[]'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS invoice_sequences (
          year_month TEXT PRIMARY KEY,
          last_seq INTEGER NOT NULL DEFAULT 0
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS invoices (
          id TEXT PRIMARY KEY,
          number TEXT NOT NULL UNIQUE,
          issue_date DATE NOT NULL,
          valid_until DATE NOT NULL,
          currency TEXT NOT NULL DEFAULT 'NGN',
          status TEXT NOT NULL DEFAULT 'draft',
          client_id TEXT NULL REFERENCES invoice_clients(id) ON DELETE SET NULL,
          client JSONB NOT NULL DEFAULT '{}'::jsonb,
          line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
          notes TEXT NOT NULL DEFAULT '',
          payment_terms TEXT NOT NULL DEFAULT '',
          tax_percent DOUBLE PRECISION NOT NULL DEFAULT 0,
          created_by TEXT NOT NULL DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          last_emailed_at TIMESTAMPTZ NULL
        )
      `;

      await sql`CREATE INDEX IF NOT EXISTS invoices_updated_at_idx ON invoices (updated_at DESC)`;
      await sql`CREATE INDEX IF NOT EXISTS invoice_clients_name_idx ON invoice_clients (name)`;
      await sql`CREATE INDEX IF NOT EXISTS invoice_templates_name_idx ON invoice_templates (name)`;
    })().catch((err) => {
      schemaReady = null;
      const detail = err instanceof Error ? err.message : "unknown error";
      throw new InvoiceStorageError(`Could not initialize Neon invoice schema: ${detail}`);
    });
  }
  await schemaReady;
}
