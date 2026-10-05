"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { readApiJson } from "@/lib/invoices/client-api";
import { formatMoney } from "@/lib/invoices/currency";
import { formatDisplayDate } from "@/lib/invoices/numbering";
import { paymentMethodLabel } from "@/lib/invoices/payment-methods";
import type { PaymentReceipt } from "@/lib/invoices/types";

export default function ReceiptDashboard({ receipts }: { receipts: PaymentReceipt[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createReceipt() {
    setError(null);
    setBusyId("new");
    try {
      const res = await fetch("/api/invoices/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: "NGN" }),
      });
      const data = await readApiJson<{ error?: string; receipt?: PaymentReceipt }>(res);
      if (!res.ok || !data.receipt?.id) throw new Error(data.error || "Could not create receipt");
      router.push(`/invoices/receipts/${data.receipt.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create receipt");
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this receipt?")) return;
    setError(null);
    setBusyId(id);
    try {
      const res = await fetch(`/api/invoices/receipts/${id}`, { method: "DELETE" });
      const data = await readApiJson<{ error?: string }>(res);
      if (!res.ok) throw new Error(data.error || "Delete failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  const totalNgn = receipts
    .filter((r) => r.currency === "NGN")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0a9a4a]">Payments</p>
          <h1 className="font-display mt-1 text-3xl font-bold tracking-[-0.03em] text-slate-950">Receipts</h1>
          <p className="mt-1 text-sm text-slate-500">
            Issue, print and email payment receipts.
            {receipts.length ? ` ${formatMoney(totalNgn, "NGN")} received across ${receipts.length} receipt(s).` : ""}
          </p>
        </div>
        <button type="button" className="invoice-btn-primary" onClick={createReceipt} disabled={busyId === "new"}>
          {busyId === "new" ? "Creating…" : "New receipt"}
        </button>
      </div>

      {error ? <p className="mb-4 text-sm font-medium text-red-600">{error}</p> : null}

      <div className="invoice-card overflow-x-auto !p-0">
        {receipts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-display text-xl font-bold text-slate-950">No receipts yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Create one here, or open a proforma and click &quot;Issue receipt&quot;.
            </p>
            <button type="button" className="invoice-btn-primary mt-5" onClick={createReceipt}>
              New receipt
            </button>
          </div>
        ) : (
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Number</th>
                <th>Received from</th>
                <th>Date</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link href={`/invoices/receipts/${r.id}`} className="font-semibold text-[#075ee5]">
                      {r.number}
                    </Link>
                    {r.invoiceNumber ? <div className="text-xs text-slate-500">for {r.invoiceNumber}</div> : null}
                  </td>
                  <td>
                    <div className="font-medium text-slate-900">{r.client.company || r.client.name || "—"}</div>
                    {r.client.email ? <div className="text-xs text-slate-500">{r.client.email}</div> : null}
                  </td>
                  <td className="whitespace-nowrap text-slate-600">{formatDisplayDate(r.paymentDate)}</td>
                  <td className="whitespace-nowrap text-slate-600">{paymentMethodLabel(r.paymentMethod)}</td>
                  <td className="whitespace-nowrap font-semibold">{formatMoney(r.amount, r.currency)}</td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/invoices/receipts/${r.id}`} className="invoice-btn-ghost !px-2 !py-1 text-xs">
                        Edit
                      </Link>
                      <Link
                        href={`/invoices/receipts/${r.id}/print`}
                        target="_blank"
                        className="invoice-btn-ghost !px-2 !py-1 text-xs"
                      >
                        Print
                      </Link>
                      <button
                        type="button"
                        className="invoice-btn-ghost !px-2 !py-1 text-xs text-red-600"
                        disabled={busyId === r.id}
                        onClick={() => remove(r.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
