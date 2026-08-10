"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { readApiJson } from "@/lib/invoices/client-api";
import { randomUUID } from "@/lib/invoices/client-id";
import { CURRENCIES, computeInvoiceTotals, formatMoney } from "@/lib/invoices/currency";
import type {
  InvoiceClient,
  InvoiceCurrency,
  InvoiceLineItem,
  InvoiceStatus,
  LineItemTemplate,
  ProformaInvoice,
} from "@/lib/invoices/types";
import InvoiceDocument from "./InvoiceDocument";

type Props = {
  initialInvoice: ProformaInvoice;
  clients: InvoiceClient[];
  templates: LineItemTemplate[];
};

export default function InvoiceEditor({ initialInvoice, clients, templates }: Props) {
  const router = useRouter();
  const [invoice, setInvoice] = useState(initialInvoice);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailTo, setEmailTo] = useState(initialInvoice.client.email || "");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setInvoice(initialInvoice);
    setEmailTo(initialInvoice.client.email || "");
  }, [initialInvoice]);

  const totals = useMemo(
    () => computeInvoiceTotals(invoice.lineItems, invoice.taxPercent),
    [invoice.lineItems, invoice.taxPercent]
  );

  function patchInvoice(partial: Partial<ProformaInvoice>) {
    setInvoice((prev) => ({ ...prev, ...partial }));
  }

  function updateLine(id: string, partial: Partial<InvoiceLineItem>) {
    setInvoice((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) => (item.id === id ? { ...item, ...partial } : item)),
    }));
  }

  function addLine() {
    setInvoice((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { id: randomUUID(), title: "", quantity: 1, unitPrice: 0, details: [""] },
      ],
    }));
  }

  function removeLine(id: string) {
    setInvoice((prev) => ({
      ...prev,
      lineItems: prev.lineItems.length <= 1 ? prev.lineItems : prev.lineItems.filter((i) => i.id !== id),
    }));
  }

  function applyTemplate(templateId: string) {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;
    setInvoice((prev) => ({
      ...prev,
      currency: template.currency || prev.currency,
      lineItems: [
        ...prev.lineItems.filter((item) => item.title.trim() || item.unitPrice > 0 || item.details.some((d) => d.trim())),
        {
          id: randomUUID(),
          title: template.title,
          quantity: template.quantity,
          unitPrice: template.unitPrice,
          details: [...template.details],
        },
      ],
    }));
  }

  function applyClient(clientId: string) {
    if (!clientId) {
      patchInvoice({ clientId: null });
      return;
    }
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    patchInvoice({
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

  async function save() {
    setSaving(true);
    setError(null);
    setSaveMsg(null);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueDate: invoice.issueDate,
          validUntil: invoice.validUntil,
          currency: invoice.currency,
          status: invoice.status,
          clientId: invoice.clientId,
          client: invoice.client,
          lineItems: invoice.lineItems,
          notes: invoice.notes,
          paymentTerms: invoice.paymentTerms,
          taxPercent: invoice.taxPercent,
        }),
      });
      const data = await readApiJson<{ error?: string; invoice?: ProformaInvoice }>(res);
      if (!res.ok) throw new Error(data.error || "Save failed");
      setInvoice(data.invoice as ProformaInvoice);
      setSaveMsg("Saved");
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function sendEmail() {
    setEmailing(true);
    setError(null);
    try {
      // Save first so emailed content matches
      await save();
      const res = await fetch(`/api/invoices/${invoice.id}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: emailTo, message: emailMessage }),
      });
      const data = await readApiJson<{ error?: string; invoice?: ProformaInvoice }>(res);
      if (!res.ok) throw new Error(data.error || "Email failed");
      if (data.invoice) setInvoice(data.invoice);
      setEmailOpen(false);
      setSaveMsg("Email sent");
      startTransition(() => router.refresh());
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
          <Link href="/invoices" className="invoice-btn-ghost">
            ← All invoices
          </Link>
          <span className="invoice-pill">{invoice.number}</span>
          <span className="text-sm text-slate-500">{formatMoney(totals.total, invoice.currency)}</span>
          {saveMsg ? <span className="text-sm font-medium text-emerald-600">{saveMsg}</span> : null}
          {error ? <span className="text-sm font-medium text-red-600">{error}</span> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="invoice-btn-secondary" onClick={() => setEmailOpen(true)}>
            Email client
          </button>
          <Link href={`/invoices/${invoice.id}/print`} target="_blank" className="invoice-btn-secondary">
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
            <h2>Invoice details</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Issue date">
                <input
                  type="date"
                  className="invoice-input"
                  value={invoice.issueDate}
                  onChange={(e) => patchInvoice({ issueDate: e.target.value })}
                />
              </Field>
              <Field label="Valid until">
                <input
                  type="date"
                  className="invoice-input"
                  value={invoice.validUntil}
                  onChange={(e) => patchInvoice({ validUntil: e.target.value })}
                />
              </Field>
              <Field label="Currency">
                <select
                  className="invoice-input"
                  value={invoice.currency}
                  onChange={(e) => patchInvoice({ currency: e.target.value as InvoiceCurrency })}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select
                  className="invoice-input"
                  value={invoice.status}
                  onChange={(e) => patchInvoice({ status: e.target.value as InvoiceStatus })}
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="accepted">Accepted</option>
                  <option value="expired">Expired</option>
                </select>
              </Field>
              <Field label="Tax % (optional)">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className="invoice-input"
                  value={invoice.taxPercent}
                  onChange={(e) => patchInvoice({ taxPercent: Number(e.target.value) || 0 })}
                />
              </Field>
            </div>
          </section>

          <section className="invoice-card">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="!mb-0">Client</h2>
              <Link href="/invoices/clients" className="text-sm font-medium text-[#075ee5]">
                Manage clients
              </Link>
            </div>
            <Field label="Saved client">
              <select
                className="invoice-input"
                value={invoice.clientId || ""}
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
                  value={invoice.client.company}
                  onChange={(e) =>
                    patchInvoice({ client: { ...invoice.client, company: e.target.value } })
                  }
                />
              </Field>
              <Field label="Contact name">
                <input
                  className="invoice-input"
                  value={invoice.client.name}
                  onChange={(e) => patchInvoice({ client: { ...invoice.client, name: e.target.value } })}
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  className="invoice-input"
                  value={invoice.client.email}
                  onChange={(e) => {
                    patchInvoice({ client: { ...invoice.client, email: e.target.value } });
                    setEmailTo(e.target.value);
                  }}
                />
              </Field>
              <Field label="Phone">
                <input
                  className="invoice-input"
                  value={invoice.client.phone}
                  onChange={(e) =>
                    patchInvoice({ client: { ...invoice.client, phone: e.target.value } })
                  }
                />
              </Field>
              <Field label="Address" className="sm:col-span-2">
                <textarea
                  className="invoice-input min-h-[72px]"
                  value={invoice.client.address}
                  onChange={(e) =>
                    patchInvoice({ client: { ...invoice.client, address: e.target.value } })
                  }
                />
              </Field>
            </div>
          </section>

          <section className="invoice-card">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="!mb-0">Line items &amp; scope</h2>
              <div className="flex flex-wrap gap-2">
                <select
                  className="invoice-input !w-auto"
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      applyTemplate(e.target.value);
                      e.target.value = "";
                    }
                  }}
                >
                  <option value="">Insert template…</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <button type="button" className="invoice-btn-secondary" onClick={addLine}>
                  Add line
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {invoice.lineItems.map((item, index) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-[#fafcff] p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#075ee5]">
                      Item {index + 1}
                    </span>
                    <button
                      type="button"
                      className="text-xs font-medium text-red-600"
                      onClick={() => removeLine(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <Field label="Title">
                    <input
                      className="invoice-input"
                      value={item.title}
                      placeholder="e.g. Website Design & Development"
                      onChange={(e) => updateLine(item.id, { title: e.target.value })}
                    />
                  </Field>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Field label="Qty">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        className="invoice-input"
                        value={item.quantity}
                        onChange={(e) => updateLine(item.id, { quantity: Number(e.target.value) || 0 })}
                      />
                    </Field>
                    <Field label="Unit price">
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        className="invoice-input"
                        value={item.unitPrice}
                        onChange={(e) => updateLine(item.id, { unitPrice: Number(e.target.value) || 0 })}
                      />
                    </Field>
                  </div>
                  <Field label="Deliverables / what we will do" className="mt-2">
                    <div className="space-y-2">
                      {item.details.map((detail, detailIndex) => (
                        <div key={`${item.id}-detail-${detailIndex}`} className="flex gap-2">
                          <input
                            className="invoice-input"
                            value={detail}
                            placeholder="We will…"
                            onChange={(e) => {
                              const next = [...item.details];
                              next[detailIndex] = e.target.value;
                              updateLine(item.id, { details: next });
                            }}
                          />
                          <button
                            type="button"
                            className="invoice-btn-ghost shrink-0 px-2"
                            onClick={() => {
                              const next = item.details.filter((_, i) => i !== detailIndex);
                              updateLine(item.id, { details: next.length ? next : [""] });
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="text-sm font-medium text-[#075ee5]"
                        onClick={() => updateLine(item.id, { details: [...item.details, ""] })}
                      >
                        + Add deliverable
                      </button>
                    </div>
                  </Field>
                </div>
              ))}
            </div>
          </section>

          <section className="invoice-card">
            <h2>Terms &amp; notes</h2>
            <Field label="Payment terms">
              <textarea
                className="invoice-input min-h-[110px]"
                value={invoice.paymentTerms}
                onChange={(e) => patchInvoice({ paymentTerms: e.target.value })}
              />
            </Field>
            <Field label="Additional notes" className="mt-3">
              <textarea
                className="invoice-input min-h-[90px]"
                placeholder="Anything else the client should know…"
                value={invoice.notes}
                onChange={(e) => patchInvoice({ notes: e.target.value })}
              />
            </Field>
          </section>
        </div>

        <div className="invoice-preview-panel">
          <div className="invoice-preview-sticky">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#075ee5]">Live preview</p>
            <div className="invoice-preview-scale">
              <InvoiceDocument invoice={invoice} />
            </div>
          </div>
        </div>
      </div>

      {emailOpen ? (
        <div className="invoice-modal-backdrop" role="dialog" aria-modal="true">
          <div className="invoice-modal">
            <h3 className="font-display text-xl font-bold text-slate-950">Email proforma</h3>
            <p className="mt-1 text-sm text-slate-500">
              Sends a summary and a secure view/print link to the client.
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
              <button
                type="button"
                className="invoice-btn-primary"
                disabled={emailing}
                onClick={sendEmail}
              >
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
