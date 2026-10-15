"use client";
import { useState } from "react";
export default function AdminActions({
  action,
  id,
  label,
}: {
  action: string;
  id?: string;
  label: string;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function run() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/automation/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
      setBusy(false);
    }
  }
  return (
    <div>
      <button
        className="my-3 rounded border px-4 py-2"
        type="button"
        disabled={busy}
        onClick={run}
      >
        {busy ? "Working…" : label}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
