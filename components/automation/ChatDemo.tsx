"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Turnstile from "./Turnstile";
import LeadDemo from "./LeadDemo";
type Reply = {
  answer: string;
  sources: { id: string; href: string }[];
  handoff: boolean;
  remaining: number;
};
export default function ChatDemo() {
  const [session, setSession] = useState(""),
    [token, setToken] = useState(""),
    [attempt, setAttempt] = useState(0),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [messages, setMessages] = useState<{ question: string; reply: Reply }[]>(
      [],
    ),
    [human, setHuman] = useState(false);
  const question = useRef<HTMLInputElement>(null);
  async function call(body: unknown) {
    const response = await fetch("/api/automation/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(18000),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Please try again.");
    return result;
  }
  async function start() {
    setBusy(true);
    setError("");
    try {
      const result = await call({ action: "start", turnstileToken: token });
      setSession(result.token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
      setToken("");
      setAttempt((n) => n + 1);
    } finally {
      setBusy(false);
    }
  }
  async function ask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = question.current?.value.trim();
    if (!text || busy) return;
    setBusy(true);
    setError("");
    try {
      const reply = await call({
        action: "message",
        token: session,
        message: text,
      });
      setMessages((current) => [...current, { question: text, reply }]);
      if (reply.handoff) setHuman(true);
      if (question.current) question.current.value = "";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="lab-panel">
      <span className="lab-badge">AI assistant · verified business facts</span>
      <h2>Ask about our business</h2>
      <p className="lab-note">
        AI selects relevant information from our published business knowledge
        base. Answers use those facts and link to the source. Please avoid
        sharing private information. Up to 20 questions per session.
      </p>
      {!session ? (
        <>
          <Turnstile key={attempt} onToken={setToken} />
          <button
            type="button"
            className="lab-link"
            disabled={
              busy ||
              Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !token)
            }
            onClick={start}
          >
            {busy ? "Connecting…" : "Start the assistant"}
          </button>
        </>
      ) : (
        <>
          <div role="log" aria-label="Business conversation" aria-live="polite">
            {messages.map((message, index) => (
              <div className="lab-admin-draft" key={index}>
                <p>
                  <strong>You:</strong> {message.question}
                </p>
                <p style={{ whiteSpace: "pre-line" }}>
                  <strong>Assistant:</strong> {message.reply.answer}
                </p>
                <div className="lab-actions">
                  {message.reply.sources.map((source) => (
                    <Link
                      className="lab-back"
                      key={source.id}
                      href={source.href}
                    >
                      {source.id.replaceAll("-", " ")} →
                    </Link>
                  ))}
                </div>
                <p className="lab-note">
                  {message.reply.remaining} questions remaining
                </p>
              </div>
            ))}
          </div>
          <form className="lab-form" onSubmit={ask}>
            <label>
              Ask a question
              <input
                ref={question}
                name="question"
                maxLength={800}
                required
                placeholder="Do you offer SEO in Lagos?"
                disabled={busy}
              />
            </label>
            <button
              className="lab-link"
              disabled={busy || messages.at(-1)?.reply.remaining === 0}
            >
              {busy ? "Finding verified information…" : "Ask the assistant"}
            </button>
          </form>
        </>
      )}
      {error && (
        <p role="alert" className="lab-error">
          {error}
        </p>
      )}
      <button
        type="button"
        className="lab-link secondary mt-6"
        onClick={() => setHuman(true)}
      >
        Talk to our team
      </button>
      {human && (
        <div className="lab-manage">
          <h3>Send a real enquiry to our team</h3>
          <p className="lab-note">
            This form stores your enquiry and sends confirmation and an owner
            alert by email. It is separate from your chat.
          </p>
          <LeadDemo source="chat" />
        </div>
      )}
    </div>
  );
}
