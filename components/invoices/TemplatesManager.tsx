"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CURRENCIES, formatMoney } from "@/lib/invoices/currency";
import type { InvoiceCurrency, LineItemTemplate } from "@/lib/invoices/types";

const emptyForm = {
  id: "",
  name: "",
  title: "",
  quantity: 1,
  unitPrice: 0,
  currency: "NGN" as InvoiceCurrency,
  detailsText: "",
};

export default function TemplatesManager({
  initialTemplates,
}: {
  initialTemplates: LineItemTemplate[];
}) {
  const router = useRouter();
  const [templates, setTemplates] = useState(initialTemplates);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const details = form.detailsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const res = await fetch("/api/invoices/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id || undefined,
          name: form.name,
          title: form.title || form.name,
          quantity: form.quantity,
          unitPrice: form.unitPrice,
          currency: form.currency,
          details,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setForm(emptyForm);
      setTemplates((prev) => {
        const others = prev.filter((t) => t.id !== data.template.id);
        return [...others, data.template].sort((a, b) => a.name.localeCompare(b.name));
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this template?")) return;
    const res = await fetch(`/api/invoices/templates?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Delete failed");
      return;
    }
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    if (form.id === id) setForm(emptyForm);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075ee5]">Reuse</p>
        <h1 className="font-display mt-1 text-3xl font-bold tracking-[-0.03em] text-slate-950">
          Line-item templates
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Save scopes with deliverable lists — insert them into any invoice.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <form onSubmit={onSubmit} className="invoice-card space-y-3">
          <h2>{form.id ? "Edit template" : "New template"}</h2>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              Template name
            </span>
            <input
              className="invoice-input"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              Line title on invoice
            </span>
            <input
              className="invoice-input"
              value={form.title}
              placeholder="Defaults to template name"
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </label>
          <div className="grid grid-cols-3 gap-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                Qty
              </span>
              <input
                type="number"
                min={0}
                className="invoice-input"
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) || 0 }))}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                Rate
              </span>
              <input
                type="number"
                min={0}
                step={0.01}
                className="invoice-input"
                value={form.unitPrice}
                onChange={(e) => setForm((f) => ({ ...f, unitPrice: Number(e.target.value) || 0 }))}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                Currency
              </span>
              <select
                className="invoice-input"
                value={form.currency}
                onChange={(e) =>
                  setForm((f) => ({ ...f, currency: e.target.value as InvoiceCurrency }))
                }
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              Deliverables (one per line)
            </span>
            <textarea
              className="invoice-input min-h-[140px]"
              placeholder={"We will design…\nWe will develop…\nWe will launch…"}
              value={form.detailsText}
              onChange={(e) => setForm((f) => ({ ...f, detailsText: e.target.value }))}
            />
          </label>
          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="submit" className="invoice-btn-primary" disabled={saving}>
              {saving ? "Saving…" : form.id ? "Update template" : "Save template"}
            </button>
            {form.id ? (
              <button type="button" className="invoice-btn-ghost" onClick={() => setForm(emptyForm)}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>

        <div className="space-y-3">
          {templates.map((template) => (
            <div key={template.id} className="invoice-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-950">{template.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {template.title} · qty {template.quantity} ·{" "}
                    {formatMoney(template.unitPrice, template.currency)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="invoice-btn-ghost !px-2 !py-1 text-xs"
                    onClick={() =>
                      setForm({
                        id: template.id,
                        name: template.name,
                        title: template.title,
                        quantity: template.quantity,
                        unitPrice: template.unitPrice,
                        currency: template.currency,
                        detailsText: template.details.join("\n"),
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="invoice-btn-ghost !px-2 !py-1 text-xs text-red-600"
                    onClick={() => remove(template.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {template.details.length > 0 ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {template.details.map((detail, i) => (
                    <li key={`${template.id}-${i}`}>{detail}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
