import { InvoiceStorageError } from "@/lib/invoices/errors";

export default function InvoiceDbSetupNotice({ error }: { error?: string }) {
  return (
    <div className="invoice-card mx-auto max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075ee5]">Setup required</p>
      <h1 className="font-display mt-2 text-2xl font-bold text-slate-950">Connect Neon database</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Invoice history now uses Neon Postgres so create/edit/delete works on production.
      </p>
      {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
        <li>
          Create a free project at{" "}
          <a className="font-semibold text-[#075ee5]" href="https://console.neon.tech" target="_blank" rel="noreferrer">
            console.neon.tech
          </a>
        </li>
        <li>Copy the connection string (use the pooled URL if Neon shows one)</li>
        <li>
          Add to <code className="rounded bg-slate-100 px-1">.env.local</code> and Vercel:
          <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">
            DATABASE_URL=postgresql://...
          </pre>
        </li>
        <li>
          Run: <code className="rounded bg-slate-100 px-1">npm run migrate:invoices</code>
        </li>
        <li>Restart the app</li>
      </ol>
    </div>
  );
}

export function toSetupErrorMessage(err: unknown): string {
  if (err instanceof InvoiceStorageError) return err.message;
  if (err instanceof Error) return err.message;
  return "Could not connect to the invoice database.";
}
