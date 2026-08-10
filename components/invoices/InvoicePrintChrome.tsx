"use client";

import Link from "next/link";

export default function InvoicePrintChrome({
  invoiceId,
  showEdit,
}: {
  invoiceId: string;
  showEdit: boolean;
}) {
  return (
    <div className="invoice-print-chrome no-print mx-auto mb-5 flex max-w-[210mm] flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075ee5]">Print / PDF</p>
        <p className="mt-1 text-sm text-slate-600">
          Use your browser&apos;s print dialog and choose &quot;Save as PDF&quot;.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {showEdit ? (
          <Link href={`/invoices/${invoiceId}`} className="invoice-btn-ghost">
            ← Edit
          </Link>
        ) : null}
        <button type="button" className="invoice-btn-primary" onClick={() => window.print()}>
          Print / Save PDF
        </button>
      </div>
    </div>
  );
}
