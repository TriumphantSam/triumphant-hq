"use client";
import { useState } from "react";
import Turnstile from "./Turnstile";
export default function AdminLogin({ configured }: { configured: boolean }) {
  const [token, setToken] = useState(""),
    [attempt, setAttempt] = useState(0),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = new FormData(event.currentTarget),
        response = await fetch("/api/automation/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "login",
            password: data.get("password"),
            turnstileToken: token,
          }),
        });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in.");
      setToken("");
      setAttempt((n) => n + 1);
      setBusy(false);
    }
  }
  return (
    <form className="mt-6 max-w-md space-y-4" onSubmit={login}>
      <p>
        Private owner workspace. Customer records are available only after
        sign-in.
      </p>
      <label className="block">
        Owner password
        <input
          className="mt-2 w-full rounded border p-3"
          type="password"
          name="password"
          required
          autoComplete="current-password"
          maxLength={200}
        />
      </label>
      <Turnstile key={attempt} onToken={setToken} />
      <button
        className="rounded bg-blue-700 px-5 py-3 text-white"
        disabled={
          !configured ||
          busy ||
          Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !token)
        }
      >
        {!configured
          ? "Owner access configuration pending"
          : busy
            ? "Signing in…"
            : "Sign in"}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
