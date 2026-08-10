"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatMoney } from "@/lib/invoices/currency";
import { formatDisplayDate } from "@/lib/invoices/numbering";
import type { InvoiceCurrency, InvoiceStatus, ProformaInvoice } from "@/lib/invoices/types";

type Row = ProformaInvoice & {
  totals: { subtotal: number; taxAmount: number; total: number };
};

export default function InvoiceDashboard({ invoices }: { invoices: Row[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createInvoice() {
    setError(null);
    setBusyId("new");
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: "NGN" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create invoice");
      router.push(`/invoices/${data.invoice.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create invoice");
      setBusyId(null);
    }
  }

  async function duplicate(id: string) {
    setError(null);
    setBusyId(id);
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Duplicate failed");
      router.push(`/invoices/${data.invoice.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Duplicate failed");
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this proforma invoice?")) return;
    setError(null);
    setBusyId(id);
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075ee5]">Proforma</p>
          <h1 className="font-display mt-1 text-3xl font-bold tracking-[-0.03em] text-slate-950">
            Invoices
          </h1>
          <p className="mt-1 text-sm text-slate-500">Create, save, print and email professional proformas.</p>
        </div>
        <button
          type="button"
          className="invoice-btn-primary"
          onClick={createInvoice}
          disabled={busyId === "new"}
        >
          {busyId === "new" ? "Creating…" : "New proforma"}
        </button>
      </div>

      {error ? <p className="mb-4 text-sm font-medium text-red-600">{error}</p> : null}

      <div className="invoice-card overflow-x-auto !p-0">
        {invoices.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-display text-xl font-bold text-slate-950">No invoices yet</p>
            <p className="mt-2 text-sm text-slate-500">Create your first proforma to get started.</p>
            <button type="button" className="invoice-btn-primary mt-5" onClick={createInvoice}>
              New proforma
            </button>
          </div>
        ) : (
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Number</th>
                <th>Client</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <Link href={`/invoices/${inv.id}`} className="font-semibold text-[#075ee5]">
                      {inv.number}
                    </Link>
                  </td>
                  <td>
                    <div className="font-medium text-slate-900">
                      {inv.client.company || inv.client.name || "—"}
                    </div>
                    {inv.client.email ? (
                      <div className="text-xs text-slate-500">{inv.client.email}</div>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap text-slate-600">
                    {formatDisplayDate(inv.issueDate)}
                  </td>
                  <td>
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="whitespace-nowrap font-semibold">
                    {formatMoney(inv.totals.total, inv.currency as InvoiceCurrency)}
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/invoices/${inv.id}`} className="invoice-btn-ghost !px-2 !py-1 text-xs">
                        Edit
                      </Link>
                      <Link
                        href={`/invoices/${inv.id}/print`}
                        target="_blank"
                        className="invoice-btn-ghost !px-2 !py-1 text-xs"
                      >
                        Print
                      </Link>
                      <button
                        type="button"
                        className="invoice-btn-ghost !px-2 !py-1 text-xs"
                        disabled={busyId === inv.id}
                        onClick={() => duplicate(inv.id)}
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        className="invoice-btn-ghost !px-2 !py-1 text-xs text-red-600"
                        disabled={busyId === inv.id}
                        onClick={() => remove(inv.id)}
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

function StatusBadge({ status }: { status: InvoiceStatus }) {
  return <span className={`invoice-status invoice-status-${status}`}>{status}</span>;
}
