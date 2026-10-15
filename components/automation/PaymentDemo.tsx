"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Turnstile from "./Turnstile";
type Status = { reference: string; status: string; paidAt: string | null };
const subscribeToLocation = (callback: () => void) => {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
};
const paymentReference = () => {
  try {
    const reference =
      new URL(location.href).searchParams.get("reference") ||
      sessionStorage.getItem("thq-test-payment-reference") ||
      "";
    return /^thq-test-[a-f0-9-]{36}$/.test(reference) ? reference : "";
  } catch {
    return "";
  }
};
export default function PaymentDemo() {
  const [ready, setReady] = useState(false),
    [token, setToken] = useState(""),
    [attempt, setAttempt] = useState(0),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [localReference, setReference] = useState(""),
    [status, setStatus] = useState<Status | null>(null);
  const requestId = useRef("");
  const returnedReference = useSyncExternalStore(
    subscribeToLocation,
    paymentReference,
    () => "",
  );
  const reference = localReference || returnedReference;
  useEffect(() => {
    let active = true;
    fetch("/api/automation/payments")
      .then((r) => r.json())
      .then((result) => {
        if (active) setReady(result.connected === true);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  async function verify() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/automation/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", reference }),
        signal: AbortSignal.timeout(18000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setStatus(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function checkout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const values = new FormData(event.currentTarget);
    requestId.current ||= crypto.randomUUID();
    const ref = "thq-test-" + requestId.current;
    setReference(ref);
    sessionStorage.setItem("thq-test-payment-reference", ref);
    try {
      const response = await fetch("/api/automation/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "initialize",
          requestId: requestId.current,
          email: values.get("email"),
          reminderOptIn: values.get("reminderOptIn") === "on",
          companyWebsite: values.get("companyWebsite"),
          turnstileToken: token,
        }),
        signal: AbortSignal.timeout(18000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      const url = new URL(result.url);
      if (url.protocol !== "https:" || url.hostname !== "checkout.paystack.com")
        throw new Error("Invalid checkout address.");
      location.assign(url.href);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
      setToken("");
      setAttempt((n) => n + 1);
      setBusy(false);
    }
  }
  return (
    <div className="lab-panel">
      <span className="lab-badge">Paystack test mode · ₦100 demo</span>
      <h2>A payment becomes a receipt</h2>
      <p className="lab-admin-alert">
        Test checkout only. No real money is collected and no product is
        delivered. Use Paystack’s test payment details in its checkout.
      </p>
      <p className="lab-note">
        A verified test payment queues a receipt to your email and a test alert
        to our team. We never collect or store card details.
      </p>
      {status?.status === "paid" ? (
        <div role="status">
          <h3>Test payment verified</h3>
          <p>₦100 · NGN · test mode</p>
          <Link className="lab-link mt-6" href={"/receipt/" + reference}>
            View test receipt →
          </Link>
        </div>
      ) : (
        <form className="lab-form" onSubmit={checkout}>
          <label>
            Email for your test receipt
            <input type="email" name="email" required maxLength={254} />
          </label>
          <label className="sr-only" aria-hidden="true">
            Leave this empty
            <input name="companyWebsite" tabIndex={-1} autoComplete="off" />
          </label>
          <label className="lab-consent">
            <input type="checkbox" name="reminderOptIn" />
            Email me demonstration checkout reminders if I do not finish: after
            1, 4 and 8 days, then stop. Optional; no money will be owed.
          </label>
          <Turnstile key={attempt} onToken={setToken} />
          <button
            className="lab-link"
            disabled={
              !ready ||
              busy ||
              Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !token)
            }
          >
            {!ready
              ? "Test key connection pending"
              : busy
                ? "Preparing checkout…"
                : "Open ₦100 test checkout →"}
          </button>
        </form>
      )}
      {reference && (
        <div className="lab-manage">
          <p className="lab-note">Test reference: {reference}</p>
          <button
            className="lab-link secondary"
            type="button"
            disabled={busy}
            onClick={verify}
          >
            Check this payment
          </button>
          <button
            className="lab-link secondary mt-3"
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                const response = await fetch("/api/automation/payments", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ action: "stop", reference }),
                });
                if (!response.ok)
                  throw new Error("Reminders could not be stopped.");
                setError("Demonstration reminders stopped for this checkout.");
              } catch (e) {
                setError(e instanceof Error ? e.message : "Please try again.");
              } finally {
                setBusy(false);
              }
            }}
          >
            Stop demonstration reminders
          </button>
          {status && status.status !== "paid" && (
            <p role="status">
              Payment is not confirmed yet ({status.status.replaceAll("_", " ")}
              ). A callback or checkout page alone is not proof of payment.
            </p>
          )}
        </div>
      )}
      {error && (
        <p className="lab-error" role="alert">
          {error}
        </p>
      )}
      <p className="lab-note">
        <a href="/privacy-policy">Privacy policy</a> ·{" "}
        <a
          href="https://paystack.com/docs/payments/test-payments/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Paystack test payment instructions
        </a>
      </p>
    </div>
  );
}
