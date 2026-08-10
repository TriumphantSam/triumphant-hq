"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { readApiJson } from "@/lib/invoices/client-api";

export default function InvoiceLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/invoices/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await readApiJson<{ error?: string }>(res);
      if (!res.ok) throw new Error(data.error || "Login failed");
      const next = searchParams.get("next") || "/invoices";
      router.push(next.startsWith("/invoices") ? next : "/invoices");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(160deg,#f4f7fb_0%,#e8f1ff_45%,#fafbfd_100%)] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#075ee5]">Triumphant HQ</p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-[-0.03em] text-slate-950">
          Invoice studio
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Sign in to create and send proforma invoices.
        </p>

        <label className="mt-6 block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            Username
          </span>
          <input
            className="invoice-input"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            Password
          </span>
          <input
            type="password"
            className="invoice-input"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}

        <button type="submit" className="invoice-btn-primary mt-6 w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
