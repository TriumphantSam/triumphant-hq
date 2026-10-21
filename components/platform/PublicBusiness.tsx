"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Turnstile from "@/components/automation/Turnstile";

type Business = {
  id: string;
  name: string;
  description: string;
  contactUrl: string;
  timezone: string;
};
type Faq = { id: string; question: string; answer: string };
type Slot = { start: string; end: string };
type Receipt = {
  reference: string;
  start?: string;
  end?: string;
  state?: string;
  manageCode?: string;
};
async function request<T>(
  action: string,
  payload: unknown,
  token = "",
): Promise<T> {
  const response = await fetch("/api/platform", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload, turnstileToken: token }),
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Please try again.");
  return data;
}
const time = (iso: string) =>
  new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso)) + " WAT";

export default function PublicBusiness({
  workspaceId,
  embedded = false,
}: {
  workspaceId: string;
  embedded?:boolean;
}) {
  const [business, setBusiness] = useState<Business | null>(null),
    [faqs, setFaqs] = useState<Faq[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const [mode, setMode] = useState<"answers" | "enquiry" | "booking">(
      "answers",
    ),
    [busy, setBusy] = useState(false),
    [question, setQuestion] = useState(""),
    [answer, setAnswer] = useState("");
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [need, setNeed] = useState(""),
    [consent, setConsent] = useState(false),
    [token, setToken] = useState(""),
    [widget, setWidget] = useState(0);
  const [slots, setSlots] = useState<Slot[]>([]),
    [loadingSlots, setLoadingSlots] = useState(false),
    [start, setStart] = useState(""),
    [receipt, setReceipt] = useState<Receipt | null>(null);
  const pending = useRef<{ fingerprint: string; id: string } | null>(null);
  useEffect(() => {
    let active = true;
    request<{ business: Business; faqs: Faq[] }>("public.read", { workspaceId })
      .then((data) => {
        if (active) {
          setBusiness(data.business);
          setFaqs(data.faqs);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [workspaceId]);
  async function run(work: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await work();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  function requestId(action: string, data: unknown) {
    const fingerprint = JSON.stringify([action, data]);
    if (pending.current?.fingerprint !== fingerprint)
      pending.current = { fingerprint, id: crypto.randomUUID() };
    return pending.current.id;
  }
  async function selectMode(next: typeof mode) {
    setMode(next);
    setError("");
    setReceipt(null);
    setConsent(false);
    setToken("");
    setWidget((v) => v + 1);
    if (next === "booking") {
      setSlots([]);
      setStart("");
      setLoadingSlots(true);
      await run(async () => {
        const data = await request<{ slots: Slot[] }>("public.slots", {
          workspaceId,
        });
        setSlots(data.slots);
      });
      setLoadingSlots(false);
    }
  }
  async function submit() {
    await run(async () => {
      const action = mode === "booking" ? "public.book" : "public.enquiry";
      const data = {
        workspaceId,
        name,
        email,
        consent,
        ...(mode === "booking" ? { start } : { need }),
      };
      const result = await request<Receipt>(
        action,
        { ...data, requestId: requestId(action, data) },
        token,
      );
      setReceipt(result);
      setToken("");
      setWidget((v) => v + 1);
    });
  }
  return (
    <div className={`platform public-business ph-no-capture${embedded?" platform-embedded":""}`}>
      <header className="platform-header">
        <span className="platform-brand">
          <span>{business?.name.slice(0, 1) || "B"}</span>
          {business?.name || "Business preview"}
        </span>
        <Link href="/platform" className="platform-back">
          Powered by TriumphantTech
        </Link>
      </header>
      <div className="public-business-content">
        <div className="platform-sandbox">
          <strong>Sandbox business page</strong> · Submissions are test records.
          No email, SMS or WhatsApp messages are sent.
        </div>
        {loading ? (
          <p role="status">Opening this business page…</p>
        ) : !business ? (
          <div className="platform-card">
            <h1>Business page unavailable</h1>
            <p>{error || "This page has not been published."}</p>
            <Link href={`/business/${workspaceId}/manage`}>
              Manage an existing test appointment →
            </Link>
          </div>
        ) : (
          <>
            <div className="public-business-title">
              <div className="platform-eyebrow">
                WELCOME TO {business.name.toUpperCase()}
              </div>
              <h1>How can we help?</h1>
              <p>{business.description}</p>
            </div>
            <nav
              className="public-business-tabs"
              aria-label="Customer workflows"
            >
              {(
                [
                  { id: "answers", label: "Business answers" },
                  { id: "enquiry", label: "Send an enquiry" },
                  { id: "booking", label: "Book an appointment" },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  aria-current={mode === item.id ? "page" : undefined}
                  disabled={busy}
                  onClick={() => void selectMode(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            {error && (
              <p className="platform-error" role="alert">
                {error}
              </p>
            )}
            {mode === "answers" ? (
              <div className="platform-columns">
                <section className="platform-card platform-form">
                  <h2>Ask about this business</h2>
                  <p>
                    Answers come from information approved by the business.
                    When AI matching is enabled, Cloudflare Workers AI may process your question and those approved answers. Unknown topics are referred to the team.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void run(async () => {
                        const payload = { workspaceId, question };
                        const data = await request<{ answer: string }>(
                          "public.ask",
                          {
                            ...payload,
                            requestId: requestId("public.ask", payload),
                          },
                        );
                        setAnswer(data.answer);
                      });
                    }}
                  >
                    <label>
                      Your question
                      <input
                        required
                        maxLength={800}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                      />
                    </label>
                    <button className="platform-primary" disabled={busy}>
                      Ask the business
                    </button>
                  </form>
                  {answer && (
                    <div className="platform-reply" role="status">
                      {answer}
                    </div>
                  )}
                </section>
                <section className="platform-card platform-guide">
                  <h2>Frequently asked</h2>
                  {faqs.map((f) => (
                    <details key={f.id} className="public-faq">
                      <summary>{f.question}</summary>
                      <p>{f.answer}</p>
                    </details>
                  ))}
                  {business.contactUrl && (
                    <a
                      href={business.contactUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Visit the business contact page →
                    </a>
                  )}
                </section>
              </div>
            ) : receipt ? (
              <section className="platform-card platform-form">
                <div className="platform-eyebrow">TEST RECORD SAVED</div>
                <h2>
                  {mode === "booking"
                    ? receipt.state === "cancelled"
                      ? "This test appointment is cancelled"
                      : "Your test appointment is reserved"
                    : "Your test enquiry is stored"}
                </h2>
                {receipt.start && <p>{time(receipt.start)}</p>}
                <p>
                  Reference: <code>{receipt.reference}</code>
                </p>
                <p className="platform-muted">
                  No messages were sent. The business can see this test record
                  in its workspace inbox.
                </p>
                {receipt.manageCode && (
                  <details className="public-faq">
                    <summary>Save the cancellation details</summary>
                    <p>
                      Keep the reference and code privately. They let you cancel
                      this test appointment.
                    </p>
                    <code className="public-management-code">
                      {receipt.manageCode}
                    </code>
                    <Link href={`/business/${workspaceId}/manage`}>
                      Open appointment management →
                    </Link>
                  </details>
                )}
                <button
                  className="platform-secondary"
                  onClick={() => {
                    setReceipt(null);
                    pending.current = null;
                  }}
                >
                  Back to this workflow
                </button>
              </section>
            ) : (
              <form
                className="platform-card platform-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  void submit();
                }}
              >
                <h2>
                  {mode === "booking"
                    ? "Choose a test appointment"
                    : "Tell the business what you need"}
                </h2>
                {mode === "booking" && (
                  <>
                    <p>
                      All times are in Lagos time. A time is reserved only after
                      you submit this form successfully.
                    </p>
                    <label>
                      Available appointment
                      <select
                        value={start}
                        disabled={loadingSlots}
                        required
                        onChange={(e) => setStart(e.target.value)}
                      >
                        <option value="">
                          {loadingSlots
                            ? "Loading available times…"
                            : slots.length
                            ? "Choose a time"
                            : "No available times"}
                        </option>
                        {slots.map((s) => (
                          <option key={s.start} value={s.start}>
                            {time(s.start)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </>
                )}
                <div className="platform-field-grid">
                  <label>
                    Your name
                    <input
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      minLength={2}
                      maxLength={120}
                    />
                  </label>
                  <label>
                    Your email
                    <input
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      maxLength={254}
                    />
                  </label>
                </div>
                {mode === "enquiry" && (
                  <label>
                    What do you need?
                    <textarea
                      rows={5}
                      required
                      minLength={10}
                      maxLength={4000}
                      value={need}
                      onChange={(e) => setNeed(e.target.value)}
                    />
                  </label>
                )}
                <label className="public-consent">
                  <input
                    type="checkbox"
                    checked={consent}
                    required
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  I agree to store these details as a test record for this
                  business. This does not subscribe me to marketing.
                </label>
                <Turnstile key={widget} onToken={setToken} />
                <button
                  disabled={
                    busy ||
                    !consent ||
                    (Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) &&
                      !token) ||
                    (mode === "booking" && !start)
                  }
                  className="platform-primary"
                >
                  {busy
                    ? loadingSlots ? "Loading available times…" : "Saving…"
                    : mode === "booking"
                      ? "Reserve test appointment"
                      : "Save test enquiry"}
                </button>
              </form>
            )}
            <p className="platform-muted public-manage-link">
              <Link href={`/business/${workspaceId}/manage`}>
                Manage an existing test appointment
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export function ManageAppointment({ workspaceId }: { workspaceId: string }) {
  const [id, setId] = useState(""),
    [code, setCode] = useState(""),
    [token, setToken] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState(false);
  return (
    <div className="platform public-business ph-no-capture">
      <header className="platform-header">
        <span className="platform-brand">
          TriumphantTech · Appointment management
        </span>
      </header>
      <div className="public-business-content">
        <div className="platform-sandbox">
          Sandbox · Cancellation sends no messages.
        </div>
        <section className="platform-card platform-form">
          <h1>Cancel a test appointment</h1>
          <p>
            Use the reference and private code shown when the appointment was
            saved. This still works if the business pauses its public page.
          </p>
          {done ? (
            <p role="status" className="platform-success">
              The test appointment is cancelled and its time is available again.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (busy) return;
                setBusy(true);
                setError("");
                request(
                  "public.cancel",
                  { workspaceId, id, manageCode: code },
                  token,
                )
                  .then(() => setDone(true))
                  .catch((e) => setError(e.message))
                  .finally(() => setBusy(false));
              }}
            >
              <label>
                Appointment reference
                <input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                  maxLength={36}
                />
              </label>
              <label>
                Private cancellation code
                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  minLength={64}
                  maxLength={64}
                  autoComplete="off"
                />
              </label>
              <Turnstile onToken={setToken} />
              <button
                className="platform-primary"
                disabled={
                  busy ||
                  (Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) &&
                    !token)
                }
              >
                {busy ? "Cancelling…" : "Cancel this test appointment"}
              </button>
            </form>
          )}
          {error && (
            <p role="alert" className="platform-error">
              {error}
            </p>
          )}
          <p className="public-manage-link">
            <Link href={`/business/${workspaceId}`}>
              Back to the business page →
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
