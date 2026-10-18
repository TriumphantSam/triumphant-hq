"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Turnstile from "./Turnstile";
import "./conversation.css";

const BookingDemo = dynamic(() => import("./BookingDemo"), {
  loading: () => <p>Loading the booking form…</p>,
});
const LeadDemo = dynamic(() => import("./LeadDemo"), {
  loading: () => <p>Loading the enquiry form…</p>,
});
type Reply = {
  answer: string;
  token?: string;
  version: number;
  remaining: number;
  choices?: { label: string; message: string }[];
  sources?: { id: string; href: string }[];
  links?: { label: string; href: string }[];
  pending?: {
    id: string;
    kind: "booking" | "human";
    detail: string;
    expires: number;
  };
  next?: { kind: "booking"; start: string } | { kind: "human" };
};
type Turn = { question: string; reply: Reply };
const suggestions = {
  customer: [
    "What automation services do you offer?",
    "Available consultation times",
    "How much does a website cost?",
    "Talk to the team",
  ],
  owner: ["Show new enquiries", "Tomorrow's appointments", "Today's summary"],
};
export default function ConversationAssistant({
  mode = "customer",
}: {
  mode?: "customer" | "owner";
}) {
  const [session, setSession] = useState(""),
    [version, setVersion] = useState(0);
  const [verification, setVerification] = useState(""),
    [attempt, setAttempt] = useState(0);
  const [turns, setTurns] = useState<Turn[]>([]),
    [text, setText] = useState("");
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [retry, setRetry] = useState<{
    payload: Record<string, unknown>;
    question: string;
  } | null>(null);
  const [recovery, setRecovery] = useState(false);
  const inFlight = useRef(false);
  const latest = turns.at(-1)?.reply;
  const remaining = latest?.remaining ?? 20;
  async function call(payload: Record<string, unknown>, question: string) {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    setRecovery(false);
    try {
      const response = await fetch("/api/automation/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, mode }),
        signal: AbortSignal.timeout(18000),
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) {
        if ([401, 409].includes(response.status)) setRecovery(true);
        throw new Error(result.error || "Please try again.");
      }
      const reply = result as Reply;
      if (reply.token) setSession(reply.token);
      setVersion(reply.version);
      setTurns((current) => [...current, { question, reply }]);
      setText("");
      setRetry(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
      if (payload.action === "turn") setRetry({ payload, question });
      else {
        setVerification("");
        setAttempt((n) => n + 1);
      }
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  function send(message: string) {
    return call(
      {
        action: "turn",
        token: session,
        version,
        requestId: crypto.randomUUID(),
        message,
      },
      message,
    );
  }
  function decide(decision: "confirm" | "cancel") {
    if (!latest?.pending) return;
    return call(
      {
        action: "turn",
        token: session,
        version,
        requestId: crypto.randomUUID(),
        pendingId: latest.pending.id,
        decision,
      },
      decision === "confirm"
        ? "Continue with this preview"
        : "Cancel this preview",
    );
  }
  function reset() {
    setSession("");
    setVersion(0);
    setTurns([]);
    setRetry(null);
    setError("");
    setRecovery(false);
    setVerification("");
    setAttempt((n) => n + 1);
    setText("");
  }
  return (
    <section
      className="conversation"
      aria-label={
        mode === "owner"
          ? "Private owner commands"
          : "Business conversation simulator"
      }
    >
      <header className="conversation-head">
        <span className="conversation-dot" />
        <div>
          <h2>
            {mode === "owner"
              ? "Your operations assistant"
              : "Try a business conversation"}
          </h2>
          <p>
            {mode === "owner"
              ? "Signed-in owner · read-only commands"
              : "Website simulator · WhatsApp connection pending"}
          </p>
        </div>
        <span className="conversation-tag">
          {mode === "owner" ? "Private" : "Preview"}
        </span>
      </header>
      <div className="conversation-body">
        <p className="conversation-notice">
          {mode === "owner"
            ? "Counts come from your business records. Customer identities, private notes and management codes stay out of the AI prompt. This assistant cannot change records or initiate payments."
            : "Explore services, real consultation availability and a team handoff. The simulator sends no WhatsApp messages. A booking or enquiry is created only when you submit its separate final form. Please avoid sharing private information in chat."}
        </p>
        {!session ? (
          <div className="conversation-start">
            {mode === "customer" && (
              <Turnstile key={attempt} onToken={setVerification} />
            )}
            <button
              className="conversation-primary"
              type="button"
              disabled={
                busy ||
                (mode === "customer" &&
                  Boolean(
                    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !verification,
                  ))
              }
              onClick={() =>
                void call(
                  { action: "start", turnstileToken: verification },
                  "Start conversation",
                )
              }
            >
              {busy
                ? "Starting…"
                : mode === "owner"
                  ? "Start owner session"
                  : "Start simulator"}
            </button>
            <p>
              Sessions last one hour, with up to 20 turns. Suggested commands
              remain available if natural-language understanding is temporarily
              unavailable.
            </p>
          </div>
        ) : (
          <>
            <div
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              className="conversation-log"
              aria-label="Conversation history"
            >
              {turns.map((turn, index) => (
                <article key={index} className="conversation-turn">
                  <div className="conversation-question">
                    <span>You</span>
                    <p>{turn.question}</p>
                  </div>
                  <div className="conversation-answer">
                    <span>Assistant</span>
                    <p>{turn.reply.answer}</p>
                    {!!turn.reply.sources?.length && (
                      <div className="conversation-links">
                        {turn.reply.sources.map((s) => (
                          <Link key={s.id} href={s.href}>
                            {s.id.replaceAll("-", " ")} ↗
                          </Link>
                        ))}
                      </div>
                    )}
                    {!!turn.reply.links?.length && (
                      <div className="conversation-links">
                        {turn.reply.links.map((l) => (
                          <Link key={l.href} href={l.href}>
                            {l.label} →
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
            {!!latest?.choices?.length && (
              <div
                className="conversation-options"
                aria-label="Available consultation times"
              >
                {latest.choices.map((choice) => (
                  <button
                    type="button"
                    key={choice.message}
                    disabled={busy || !!retry || remaining === 0}
                    onClick={() => void send(choice.message)}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            )}
            {latest?.pending && (
              <div className="conversation-review">
                <strong>Review before continuing</strong>
                <p>{latest.pending.detail}</p>
                <p className="conversation-fine">
                  Preview expires after five minutes. Continuing does not submit
                  the final booking or enquiry.
                </p>
                <div className="conversation-buttons">
                  <button
                    type="button"
                    className="conversation-primary"
                    disabled={busy || !!retry || remaining === 0}
                    onClick={() => void decide("confirm")}
                  >
                    Continue to{" "}
                    {latest.pending.kind === "booking" ? "booking" : "enquiry"}{" "}
                    form
                  </button>
                  <button
                    type="button"
                    disabled={busy || !!retry || remaining === 0}
                    onClick={() => void decide("cancel")}
                  >
                    Cancel preview
                  </button>
                </div>
              </div>
            )}
            {!latest?.pending && (
              <div
                className="conversation-options"
                aria-label="Suggested questions"
              >
                {suggestions[mode].map((s) => (
                  <button
                    type="button"
                    key={s}
                    disabled={busy || !!retry || remaining === 0}
                    onClick={() => void send(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <form
              className="conversation-compose"
              onSubmit={(event) => {
                event.preventDefault();
                if (text.trim()) void send(text.trim());
              }}
            >
              <label htmlFor={`assistant-message-${mode}`}>Your message</label>
              <div>
                <input
                  id={`assistant-message-${mode}`}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={800}
                  disabled={busy || !!retry || remaining === 0}
                  required
                  placeholder={
                    mode === "owner"
                      ? "Show new enquiries"
                      : "Could we discuss automation next Friday afternoon?"
                  }
                />
                <button
                  className="conversation-primary"
                  disabled={busy || !!retry || remaining === 0}
                >
                  {busy ? "Working…" : "Send"}
                </button>
              </div>
            </form>
            <p className="conversation-fine">
              {remaining} turns remaining · Lagos time ·{" "}
              {mode === "owner"
                ? "Read-only business queries"
                : "Text only; orders and live invoice creation are not enabled"}
            </p>
            <button
              type="button"
              className="conversation-reset"
              onClick={reset}
              disabled={busy}
            >
              Start a new conversation
            </button>
          </>
        )}
        {error && (
          <div role="alert" className="conversation-error">
            <p>{error}</p>
            {retry && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void call(retry.payload, retry.question)}
              >
                Retry the same request
              </button>
            )}
            {recovery && (
              <p>
                For an expired or changed session, start a new conversation.
                Your existing bookings and enquiries are unaffected.
              </p>
            )}
          </div>
        )}
        {latest?.next?.kind === "booking" && !error && (
          <div className="conversation-followthrough">
            <h3>Complete your real booking</h3>
            <BookingDemo
              key={latest.next.start}
              preferredStart={latest.next.start}
            />
          </div>
        )}
        {latest?.next?.kind === "human" && !error && (
          <div className="conversation-followthrough">
            <h3>Send a real enquiry</h3>
            <LeadDemo source="chat" />
          </div>
        )}
      </div>
    </section>
  );
}
