"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { readApiJson } from "@/lib/invoices/client-api";
import type { InvoiceClient } from "@/lib/invoices/types";

const emptyForm = {
  id: "",
  name: "",
  email: "",
  phone: "",
  company: "",
  address: "",
};

export default function ClientsManager({ initialClients }: { initialClients: InvoiceClient[] }) {
  const router = useRouter();
  const [clients, setClients] = useState(initialClients);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/invoices/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id || undefined,
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          address: form.address,
        }),
      });
      const data = await readApiJson<{ error?: string; client?: InvoiceClient }>(res);
      if (!res.ok) throw new Error(data.error || "Save failed");
      if (!data.client) throw new Error("Save failed");
      setForm(emptyForm);
      setClients((prev) => {
        const others = prev.filter((c) => c.id !== data.client!.id);
        return [...others, data.client!].sort((a, b) => a.name.localeCompare(b.name));
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this client?")) return;
    const res = await fetch(`/api/invoices/clients?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await readApiJson<{ error?: string }>(res).catch(() => ({ error: "Delete failed" }));
    if (!res.ok) {
      setError(data.error || "Delete failed");
      return;
    }
    setClients((prev) => prev.filter((c) => c.id !== id));
    if (form.id === id) setForm(emptyForm);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075ee5]">Directory</p>
        <h1 className="font-display mt-1 text-3xl font-bold tracking-[-0.03em] text-slate-950">Clients</h1>
        <p className="mt-1 text-sm text-slate-500">Reusable client details for faster invoicing.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <form onSubmit={onSubmit} className="invoice-card space-y-3">
          <h2>{form.id ? "Edit client" : "Add client"}</h2>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              Contact name
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
              Company
            </span>
            <input
              className="invoice-input"
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              Email
            </span>
            <input
              type="email"
              className="invoice-input"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              Phone
            </span>
            <input
              className="invoice-input"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              Address
            </span>
            <textarea
              className="invoice-input min-h-[80px]"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            />
          </label>
          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="submit" className="invoice-btn-primary" disabled={saving}>
              {saving ? "Saving…" : form.id ? "Update client" : "Save client"}
            </button>
            {form.id ? (
              <button type="button" className="invoice-btn-ghost" onClick={() => setForm(emptyForm)}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>

        <div className="invoice-card !p-0 overflow-hidden">
          {clients.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">No clients saved yet.</div>
          ) : (
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div className="font-semibold">{client.company || client.name}</div>
                      {client.company && client.name ? (
                        <div className="text-xs text-slate-500">{client.name}</div>
                      ) : null}
                    </td>
                    <td className="text-sm text-slate-600">
                      <div>{client.email || "—"}</div>
                      <div className="text-xs">{client.phone}</div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="invoice-btn-ghost !px-2 !py-1 text-xs"
                          onClick={() =>
                            setForm({
                              id: client.id,
                              name: client.name,
                              email: client.email,
                              phone: client.phone,
                              company: client.company,
                              address: client.address,
                            })
                          }
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="invoice-btn-ghost !px-2 !py-1 text-xs text-red-600"
                          onClick={() => remove(client.id)}
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
    </div>
  );
}
