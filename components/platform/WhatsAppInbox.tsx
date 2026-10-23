"use client";

import { useEffect, useRef, useState } from "react";

type Summary = {
  id: string;
  label: string;
  wa_id: string;
  paused: boolean | number;
  version: number;
  updated_at: string;
};
type Thread = Summary & {
  messages: { id: string; role: string; text: string; at: string }[];
  live?: boolean;
};
async function rpc<T>(action: string, payload: unknown): Promise<T> {
  const response = await fetch("/api/platform", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Please try again.");
  return data;
}
export default function WhatsAppInbox({ workspaceId }: { workspaceId: string }) {
  const [threads, setThreads] = useState<Summary[]>([]);
  const [thread, setThread] = useState<Thread | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef<string | null>(null);
  async function refresh() {
    const data = await rpc<{ threads: Summary[] }>("whatsapp.inbox", {
      workspaceId,
    });
    setThreads(data.threads);
  }
  useEffect(() => {
    let active = true;
    refresh()
      .catch((e) => {
        if (active) setError(e.message);
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
  async function open(id: string) {
    setThread(await rpc<Thread>("whatsapp.thread", { workspaceId, id }));
    setMessage("");
  }
  return (
    <div className="conversation-layout">
      <aside className="platform-card conversation-list">
        <h2>
          Live WhatsApp <span className="platform-status">Staging</span>
        </h2>
        <p className="platform-muted">
          Messages for the number connected to this business. Unknown or agency
          campaign numbers are ignored.
        </p>
        <button
          className="platform-secondary"
          disabled={busy}
          onClick={() => void run(refresh)}
        >
          Refresh conversations
        </button>
        {error && (
          <p role="alert" className="platform-error">
            {error}
          </p>
        )}
        <nav aria-label="Live WhatsApp conversations">
          {threads.map((item) => (
            <button
              key={item.id}
              disabled={busy}
              aria-current={thread?.id === item.id ? "page" : undefined}
              onClick={() => void run(() => open(item.id))}
            >
              <strong>{item.label}</strong>
              <small>
                {item.paused ? "With team" : "Automation on"} · ending {item.wa_id}
              </small>
            </button>
          ))}
        </nav>
        {!threads.length && (
          <p>No live WhatsApp conversations yet. Send a message to the connected number.</p>
        )}
      </aside>
      <section className="platform-card conversation-chat" aria-label="Live WhatsApp thread">
        {!thread ? (
          <div className="conversation-empty">
            <h2>Take over when needed.</h2>
            <p>
              Approved answers reply automatically. A team reply, STOP, HUMAN or
              an unknown question pauses automation until you resume it.
            </p>
          </div>
        ) : (
          <>
            <header className="conversation-heading">
              <div>
                <h2>{thread.label}</h2>
                <small>
                  {thread.paused
                    ? "Automation paused · team in control"
                    : "Automation available"}
                </small>
              </div>
              <button
                className="platform-secondary"
                disabled={busy}
                onClick={() =>
                  void run(async () => {
                    setThread(
                      await rpc<Thread>("whatsapp.pause", {
                        workspaceId,
                        id: thread.id,
                        version: thread.version,
                        paused: !thread.paused,
                      }),
                    );
                    await refresh();
                  })
                }
              >
                {thread.paused ? "Resume automation" : "Pause automation"}
              </button>
            </header>
            <div
              className="conversation-messages"
              role="log"
              aria-live="polite"
              aria-label="WhatsApp messages"
            >
              {thread.messages.map((item) => (
                <article
                  className={`conversation-bubble conversation-${item.role}`}
                  key={item.id}
                >
                  <small>
                    {item.role === "customer"
                      ? "Customer"
                      : item.role === "team"
                        ? "Your team"
                        : "Autoresponder"}
                  </small>
                  <p>{item.text}</p>
                  <time dateTime={item.at}>
                    {new Intl.DateTimeFormat("en-NG", {
                      timeZone: "Africa/Lagos",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(item.at))}{" "}
                    WAT
                  </time>
                </article>
              ))}
            </div>
            <form
              className="conversation-composer"
              onSubmit={(e) => {
                e.preventDefault();
                void run(async () => {
                  pending.current ??= crypto.randomUUID();
                  setThread(
                    await rpc<Thread>("whatsapp.reply", {
                      workspaceId,
                      id: thread.id,
                      version: thread.version,
                      text: message,
                      requestId: pending.current,
                    }),
                  );
                  pending.current = null;
                  setMessage("");
                  await refresh();
                });
              }}
            >
              <label>
                Team reply
                <textarea
                  required
                  rows={3}
                  maxLength={1000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </label>
              <button
                className="platform-primary"
                disabled={busy || !message.trim()}
              >
                {busy ? "Sending…" : "Send WhatsApp reply"}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
