"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { readApiJson } from "@/lib/invoices/client-api";
import { CURRENCIES, formatMoney } from "@/lib/invoices/currency";
import { PAYMENT_METHODS } from "@/lib/invoices/payment-methods";
import type { InvoiceClient, InvoiceCurrency, PaymentMethod, PaymentReceipt } from "@/lib/invoices/types";
import ReceiptDocument from "./ReceiptDocument";

type Props = {
  initialReceipt: PaymentReceipt;
  clients: InvoiceClient[];
};

export default function ReceiptEditor({ initialReceipt, clients }: Props) {
  const router = useRouter();
  const [receipt, setReceipt] = useState(initialReceipt);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailTo, setEmailTo] = useState(initialReceipt.client.email || "");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setReceipt(initialReceipt);
    setEmailTo(initialReceipt.client.email || "");
  }, [initialReceipt]);

  function patch(partial: Partial<PaymentReceipt>) {
    setReceipt((prev) => ({ ...prev, ...partial }));
    setSaveMsg(null);
  }

  function patchClient(partial: Partial<PaymentReceipt["client"]>) {
    setReceipt((prev) => ({ ...prev, client: { ...prev.client, ...partial } }));
    setSaveMsg(null);
  }

  function applyClient(clientId: string) {
    if (!clientId) {
      patch({ clientId: null });
      return;
    }
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    patch({
      clientId: client.id,
      client: {
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        address: client.address,
      },
    });
    setEmailTo(client.email || "");
  }

  async function save(): Promise<boolean> {
    setSaving(true);
    setError(null);
    setSaveMsg(null);
    try {
      const res = await fetch(`/api/invoices/receipts/${receipt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentDate: receipt.paymentDate,
          currency: receipt.currency,
          amount: receipt.amount,
          clientId: receipt.clientId,
          client: receipt.client,
          description: receipt.description,
          paymentMethod: receipt.paymentMethod,
          reference: receipt.reference,
          invoiceNumber: receipt.invoiceNumber,
          notes: receipt.notes,
        }),
      });
      const data = await readApiJson<{ error?: string; receipt?: PaymentReceipt }>(res);
      if (!res.ok || !data.receipt) throw new Error(data.error || "Save failed");
      setReceipt(data.receipt);
      setSaveMsg("Saved");
      startTransition(() => router.refresh());
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function sendEmail() {
    setEmailing(true);
    setError(null);
    try {
      if (!(await save())) return;
      const res = await fetch(`/api/invoices/receipts/${receipt.id}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: emailTo, message: emailMessage }),
      });
      const data = await readApiJson<{ error?: string; receipt?: PaymentReceipt }>(res);
      if (!res.ok) throw new Error(data.error || "Email failed");
      if (data.receipt) setReceipt(data.receipt);
      setEmailOpen(false);
      setSaveMsg("Email sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email failed");
    } finally {
      setEmailing(false);
    }
  }

  return (
    <div className="invoice-editor">
      <div className="invoice-editor-toolbar">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/invoices/receipts" className="invoice-btn-ghost">
            ← All receipts
          </Link>
          <span className="invoice-pill">{receipt.number}</span>
          <span className="text-sm text-slate-500">{formatMoney(receipt.amount, receipt.currency)}</span>
          {saveMsg ? <span className="text-sm font-medium text-emerald-600">{saveMsg}</span> : null}
          {error ? <span className="text-sm font-medium text-red-600">{error}</span> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="invoice-btn-secondary" onClick={() => setEmailOpen(true)}>
            Email client
          </button>
          <Link href={`/invoices/receipts/${receipt.id}/print`} target="_blank" className="invoice-btn-secondary">
            Print / PDF
          </Link>
          <button type="button" className="invoice-btn-primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="invoice-editor-grid">
        <div className="invoice-form-panel space-y-5">
          <section className="invoice-card">
            <h2>Payment</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Amount received">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className="invoice-input"
                  value={receipt.amount}
                  onChange={(e) => patch({ amount: Number(e.target.value) || 0 })}
                />
              </Field>
              <Field label="Currency">
                <select
                  className="invoice-input"
                  value={receipt.currency}
                  onChange={(e) => patch({ currency: e.target.value as InvoiceCurrency })}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Payment date">
                <input
                  type="date"
                  className="invoice-input"
                  value={receipt.paymentDate}
                  onChange={(e) => patch({ paymentDate: e.target.value })}
                />
              </Field>
              <Field label="Payment method">
                <select
                  className="invoice-input"
                  value={receipt.paymentMethod}
                  onChange={(e) => patch({ paymentMethod: e.target.value as PaymentMethod })}
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Payment reference" className="sm:col-span-2">
                <input
                  className="invoice-input"
                  placeholder="e.g. TRF-278771781181 / session ID"
                  value={receipt.reference}
                  onChange={(e) => patch({ reference: e.target.value })}
                />
              </Field>
              <Field label="Payment for" className="sm:col-span-2">
                <textarea
                  className="invoice-input min-h-[72px]"
                  placeholder="e.g. Website design & development — 80% deposit"
                  value={receipt.description}
                  onChange={(e) => patch({ description: e.target.value })}
                />
              </Field>
              <Field label="Invoice reference (optional)" className="sm:col-span-2">
                <input
                  className="invoice-input"
                  placeholder="THQ-PF-2026-10-001"
                  value={receipt.invoiceNumber}
                  onChange={(e) => patch({ invoiceNumber: e.target.value })}
                />
              </Field>
            </div>
          </section>

          <section className="invoice-card">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="!mb-0">Received from</h2>
              <Link href="/invoices/clients" className="text-sm font-medium text-[#075ee5]">
                Manage clients
              </Link>
            </div>
            <Field label="Saved client">
              <select
                className="invoice-input"
                value={receipt.clientId || ""}
                onChange={(e) => applyClient(e.target.value)}
              >
                <option value="">Custom / one-off</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company || c.name}
                    {c.email ? ` (${c.email})` : ""}
                  </option>
                ))}
              </select>
            </Field>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Company">
                <input
                  className="invoice-input"
                  value={receipt.client.company}
                  onChange={(e) => patchClient({ company: e.target.value })}
                />
              </Field>
              <Field label="Contact name">
                <input
                  className="invoice-input"
                  value={receipt.client.name}
                  onChange={(e) => patchClient({ name: e.target.value })}
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  className="invoice-input"
                  value={receipt.client.email}
                  onChange={(e) => {
                    patchClient({ email: e.target.value });
                    setEmailTo(e.target.value);
                  }}
                />
              </Field>
              <Field label="Phone">
                <input
                  className="invoice-input"
                  value={receipt.client.phone}
                  onChange={(e) => patchClient({ phone: e.target.value })}
                />
              </Field>
              <Field label="Address" className="sm:col-span-2">
                <textarea
                  className="invoice-input min-h-[64px]"
                  value={receipt.client.address}
                  onChange={(e) => patchClient({ address: e.target.value })}
                />
              </Field>
            </div>
          </section>

          <section className="invoice-card">
            <h2>Note</h2>
            <Field label="Additional note (optional)">
              <textarea
                className="invoice-input min-h-[80px]"
                placeholder="e.g. Balance of NGN 50,000 due on project completion."
                value={receipt.notes}
                onChange={(e) => patch({ notes: e.target.value })}
              />
            </Field>
          </section>
        </div>

        <div className="invoice-preview-panel">
          <div className="invoice-preview-sticky">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#0a9a4a]">Live preview</p>
            <div className="invoice-preview-scale">
              <ReceiptDocument receipt={receipt} />
            </div>
          </div>
        </div>
      </div>

      {emailOpen ? (
        <div className="invoice-modal-backdrop" role="dialog" aria-modal="true">
          <div className="invoice-modal">
            <h3 className="font-display text-xl font-bold text-slate-950">Email receipt</h3>
            <p className="mt-1 text-sm text-slate-500">
              Sends the receipt summary and a secure view/download link.
            </p>
            <Field label="To" className="mt-4">
              <input
                type="email"
                className="invoice-input"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
              />
            </Field>
            <Field label="Personal message (optional)" className="mt-3">
              <textarea
                className="invoice-input min-h-[90px]"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
              />
            </Field>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="invoice-btn-ghost" onClick={() => setEmailOpen(false)}>
                Cancel
              </button>
              <button type="button" className="invoice-btn-primary" disabled={emailing} onClick={sendEmail}>
                {emailing ? "Sending…" : "Send email"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}
