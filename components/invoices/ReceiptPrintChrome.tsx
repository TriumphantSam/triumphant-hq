"use client";

import Link from "next/link";

export default function ReceiptPrintChrome({
  receiptId,
  showEdit,
}: {
  receiptId: string;
  showEdit: boolean;
}) {
  return (
    <div className="invoice-print-chrome no-print mx-auto mb-5 flex max-w-[150mm] flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0a9a4a]">Print / Save PDF</p>
        <p className="mt-1 text-sm text-slate-600">
          Use your browser&apos;s print dialog and select &quot;Save as PDF&quot;.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {showEdit ? (
          <Link href={`/invoices/receipts/${receiptId}`} className="invoice-btn-ghost">
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
