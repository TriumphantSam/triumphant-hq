"use client";
import { useEffect, useState } from "react";
import Turnstile from "./Turnstile";
type Capture = { leadId: string; queued: boolean; email: string };
type Delivery = { kind: string; state: string };
export default function LeadDemo({
  source = "automation_lab",
}: {
  source?: "automation_lab" | "chat";
}) {
  const [capture, setCapture] = useState<Capture | null>(null),
    [deliveries, setDeliveries] = useState<Delivery[]>([]),
    [error, setError] = useState(""),
    [sending, setSending] = useState(false),
    [token, setToken] = useState(""),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!capture?.queued) return;
    let stopped = false,
      timer: ReturnType<typeof setTimeout>;
    let tries = 0;
    const poll = async () => {
      try {
        const response = await fetch("/api/automation/lead-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadId: capture.leadId }),
          signal: AbortSignal.timeout(8000),
        });
        const result = await response.json();
        if (!stopped && response.ok) setDeliveries(result.deliveries || []);
      } catch {
        /* Keep the confirmed stored state. */
      }
      if (!stopped && ++tries < 20) timer = setTimeout(poll, 3000);
    };
    void poll();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [capture]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setSending(true);
    setError("");
    try {
      const email = String(values.get("email"));
      const response = await fetch("/api/contact-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.get("name"),
          email,
          phone: values.get("phone"),
          message: values.get("message"),
          service: "Automation Lab enquiry",
          source,
          companyWebsite: values.get("companyWebsite"),
          consentMarketing: values.get("consent") === "on",
          turnstileToken: token,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || !result.ok)
        throw new Error(result.error || "Your enquiry could not be saved.");
      setCapture({
        leadId: result.leadId,
        email,
        queued: result.deliveriesQueued === true,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Please try again.");
      setToken("");
      setAttempt((a) => a + 1);
    } finally {
      setSending(false);
    }
  }
  const labels: Record<string, string> = {
    sheet: "Google Sheet",
    reply_email: "Your email reply",
    owner_email: "Owner email alert",
  };
  return (
    <div className="lab-panel">
      <h2>{capture ? "What actually happened" : "Send a real enquiry"}</h2>
      {capture ? (
        <div className="lab-result" aria-live="polite">
          <div className="lab-result-row">
            <span>Enquiry stored</span>
            <strong>Confirmed</strong>
          </div>
          <div className="lab-result-row">
            <span>Your email</span>
            <span>
              {capture.email.slice(0, 1)}•••@{capture.email.split("@")[1]}
            </span>
          </div>
          {capture.queued ? (
            ["sheet", "reply_email", "owner_email"].map((kind) => (
              <div key={kind} className="lab-result-row">
                <span>{labels[kind]}</span>
                <strong>
                  {deliveries.find((d) => d.kind === kind)?.state || "queued"}
                </strong>
              </div>
            ))
          ) : (
            <p className="lab-placeholder">
              Saved to our enquiry system. Automated email and Sheet delivery
              are not connected to this submission.
            </p>
          )}
          <p className="lab-reference">Your reference: {capture.leadId}</p>
          <p className="lab-note">
            “Sent” means the provider accepted the message; inbox delivery can
            take longer. This panel displays only your submission.
          </p>
        </div>
      ) : (
        <form className="lab-form" onSubmit={submit}>
          <label>
            Your name
            <input name="name" required autoComplete="name" maxLength={120} />
          </label>
          <label>
            Email
            <input
              name="email"
              required
              type="email"
              autoComplete="email"
              maxLength={254}
            />
          </label>
          <label>
            Phone (optional)
            <input name="phone" type="tel" autoComplete="tel" maxLength={30} />
          </label>
          <label>
            What would you like to automate?
            <textarea name="message" required rows={3} maxLength={2000} />
          </label>
          <div aria-hidden="true" className="hidden">
            <label>
              Leave this blank
              <input name="companyWebsite" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <label className="lab-consent">
            <input name="consent" type="checkbox" />
            Email me occasional tips and offers. Optional; unsubscribe any time.
          </label>
          <p className="lab-note">
            We use these details to respond to your enquiry.{" "}
            <a href="/privacy-policy" className="underline">
              Privacy policy
            </a>
          </p>
          <Turnstile key={attempt} onToken={setToken} />
          {error && (
            <p role="alert" className="lab-error">
              {error}
            </p>
          )}
          <button
            className="lab-link"
            disabled={
              sending ||
              Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !token)
            }
            type="submit"
          >
            {sending ? "Saving your enquiry…" : "Send enquiry →"}
          </button>
        </form>
      )}
    </div>
  );
}
