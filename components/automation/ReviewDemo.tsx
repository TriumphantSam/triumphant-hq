"use client";
import { useRef, useState, useSyncExternalStore } from "react";
import Turnstile from "./Turnstile";
const googleReviewUrl = "https://g.page/r/CYfV5FDkEGq_EAI/review";
const subscribeToLocation = (callback: () => void) => {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
};
const reviewInvite = () => {
  const id = new URL(location.href).searchParams.get("request");
  return id && /^[a-f0-9-]{36}$/.test(id) ? id : "";
};
export default function ReviewDemo() {
  const [rating, setRating] = useState(0),
    [token, setToken] = useState(""),
    [attempt, setAttempt] = useState(0),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [saved, setSaved] = useState(false);
  const requestId = useRef("");
  const invite = useSyncExternalStore(
    subscribeToLocation,
    reviewInvite,
    () => "",
  );
  const [stopped, setStopped] = useState(false);
  async function invitation(action: "click" | "stop") {
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/automation/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: invite, action }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (action === "stop") setStopped(true);
      else location.assign(result.googleReviewUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const values = new FormData(event.currentTarget);
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch("/api/automation/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: requestId.current,
          rating,
          feedback: values.get("feedback"),
          name: values.get("name"),
          email: values.get("email"),
          companyWebsite: values.get("companyWebsite"),
          turnstileToken: token,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Please try again.");
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
      setToken("");
      setAttempt((n) => n + 1);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="lab-panel">
      <span className="lab-badge">Honest reviews · every rating welcome</span>
      <h2>How was your experience?</h2>
      <p className="lab-note">
        You can explore the rating choices without submitting anything. Only
        leave a public review if you have genuinely used our services. No
        incentive is offered.
      </p>
      <fieldset className="lab-slots">
        <legend>Your rating</legend>
        {[1, 2, 3, 4, 5].map((value) => (
          <label className="lab-slot" key={value}>
            <input
              type="radio"
              name="rating"
              checked={rating === value}
              onChange={() => setRating(value)}
            />
            <span>{value} / 5</span>
          </label>
        ))}
      </fieldset>
      {invite ? (
        <>
          <button
            type="button"
            className="lab-link mt-6"
            disabled={busy}
            onClick={() => invitation("click")}
          >
            Leave an honest Google review →
          </button>
          <button
            type="button"
            className="lab-link secondary mt-6"
            disabled={busy || stopped}
            onClick={() => invitation("stop")}
          >
            {stopped
              ? "Future review invitations stopped"
              : "Stop future review invitations"}
          </button>
        </>
      ) : (
        <a
          className="lab-link mt-6"
          href={googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Leave an honest Google review →
        </a>
      )}
      <p className="lab-note">
        The same Google review link is available at every score. Private
        feedback below is optional and available to everyone.
      </p>
      {saved ? (
        <p className="lab-admin-alert" role="status">
          Your private feedback was saved. An owner alert is queued. Thank you
          for helping us improve.
        </p>
      ) : (
        <form className="lab-form" onSubmit={submit}>
          <label>
            Private feedback for our team
            <textarea name="feedback" maxLength={2000} rows={4} />
          </label>
          <label>
            Name (optional)
            <input name="name" maxLength={80} />
          </label>
          <label>
            Email (optional, if you want a reply)
            <input type="email" name="email" maxLength={254} />
          </label>
          <label className="sr-only" aria-hidden="true">
            Leave this empty
            <input name="companyWebsite" tabIndex={-1} autoComplete="off" />
          </label>
          <p className="lab-note">
            Submitting sends real feedback to TriumphantTech, stores it
            privately and queues an email alert to our team.{" "}
            <a href="/privacy-policy">Privacy policy</a>
          </p>
          <Turnstile key={attempt} onToken={setToken} />
          <button
            className="lab-link"
            disabled={
              busy ||
              !rating ||
              Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !token)
            }
          >
            {busy ? "Saving…" : "Send private feedback"}
          </button>
          {error && (
            <p className="lab-error" role="alert">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
