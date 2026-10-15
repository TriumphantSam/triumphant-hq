"use client";

import { useId, useState } from "react";

export type ManagedLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  need: string;
  status: string;
  owner_notes: string;
  updated_at: string;
};
const statuses = ["new", "contacted", "qualified", "won", "lost"] as const;

export default function LeadManager({ lead }: { lead: ManagedLead }) {
  const fieldId = useId();
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.owner_notes);
  const [version, setVersion] = useState(lead.updated_at);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/automation/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_lead",
          id: lead.id,
          status,
          notes,
          updatedAt: version,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to save this enquiry.");
      setVersion(result.updatedAt);
      setMessage(
        "Saved privately. Sheet status update queued. No customer message was sent.",
      );
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Unable to save this enquiry.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <article className="my-4 rounded-xl border border-slate-200 p-5">
      <h3 className="font-bold">{lead.name}</h3>
      <p className="my-1 break-words text-sm">
        {lead.email || "No email"} · {lead.phone || "No phone"} · {lead.service}
      </p>
      <p className="my-4 whitespace-pre-wrap break-words">{lead.need}</p>
      <form onSubmit={save} className="grid gap-4">
        <label htmlFor={fieldId + "-status"}>
          Enquiry status
          <select
            id={fieldId + "-status"}
            value={status}
            disabled={busy}
            onChange={(event) => {
              setStatus(event.target.value);
              setMessage("");
            }}
            className="mt-2 block min-h-11 w-full rounded border border-slate-300 bg-white px-3"
          >
            {statuses.map((value) => (
              <option key={value} value={value}>
                {value[0].toUpperCase() + value.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={fieldId + "-notes"}>
          Private owner notes
          <textarea
            id={fieldId + "-notes"}
            value={notes}
            maxLength={2000}
            rows={3}
            disabled={busy}
            onChange={(event) => {
              setNotes(event.target.value);
              setMessage("");
            }}
            className="mt-2 block w-full rounded border border-slate-300 bg-white p-3"
          />
        </label>
        <p className="text-sm text-slate-600">
          Notes stay in this private workspace. Status changes are queued for
          your Sheet. Saving never sends a customer email.
        </p>
        <button
          type="submit"
          disabled={busy}
          className="min-h-11 justify-self-start rounded bg-blue-700 px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save enquiry"}
        </button>
        {message && (
          <p role="status" className="text-sm text-green-800">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-red-800">
            {error}
          </p>
        )}
      </form>
    </article>
  );
}
