"use client";
import { useEffect, useState } from "react";
type Lead = {
  id: string;
  name: string;
  email: string;
  need: string;
  status: string;
  version: number;
  created_at: string;
};
type Booking = {
  id: string;
  name: string;
  email: string;
  start: string;
  end: string;
  state: string;
  version: number;
};
type Data = {
  leads: Lead[];
  bookings: Booking[];
  sandbox: boolean;
  notifications: string;
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
function EnquiryCard({
  lead,
  busy,
  update,
}: {
  lead: Lead;
  busy: boolean;
  update: (lead: Lead, status: string) => void;
}) {
  const [status, setStatus] = useState(lead.status);
  return (
    <article className="platform-inbox-record">
      <div>
        <h3>{lead.name}</h3>
        <a href={`mailto:${lead.email}`}>{lead.email}</a>
        <p>{lead.need}</p>
        <small>Reference: {lead.id}</small>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update(lead, status);
        }}
      >
        <label>
          Enquiry status
          <select
            value={status}
            disabled={busy}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["new", "contacted", "qualified", "won", "lost"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button
          className="platform-secondary"
          disabled={busy || status === lead.status}
        >
          Save status
        </button>
      </form>
    </article>
  );
}
export default function InboxPanel({ workspaceId }: { workspaceId: string }) {
  const [data, setData] = useState<Data | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  useEffect(() => {
    let active = true;
    rpc<Data>("inbox.read", { workspaceId })
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [workspaceId]);
  async function run(action?: string, payload: Record<string, unknown> = {}) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (action) await rpc(action, { workspaceId, ...payload });
      setData(await rpc<Data>("inbox.read", { workspaceId }));
      if (action) setNotice("Test record updated. No messages were sent.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please reload.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="platform-card platform-inbox">
      <div className="platform-inbox-title">
        <div>
          <h2>Your business inbox</h2>
          <p>
            Stored enquiries and appointments for this business only. Sandbox
            records are tests; notifications are disabled.
          </p>
        </div>
        <button
          className="platform-secondary"
          disabled={busy}
          onClick={() => void run()}
        >
          Refresh inbox
        </button>
      </div>
      {error && (
        <p role="alert" className="platform-error">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="platform-success">
          {notice}
        </p>
      )}
      {!data ? (
        <p role="status">Loading business records…</p>
      ) : (
        <>
          <h3 className="platform-inbox-section">
            Recent enquiries <span>{data.leads.length}</span>
          </h3>
          {data.leads.length ? (
            data.leads.map((lead) => (
              <EnquiryCard
                key={`${lead.id}:${lead.version}`}
                lead={lead}
                busy={busy}
                update={(record, status) =>
                  void run("lead.update", {
                    id: record.id,
                    version: record.version,
                    status,
                  })
                }
              />
            ))
          ) : (
            <p className="platform-muted">
              No enquiries yet. Use the sandbox customer page to submit a test.
            </p>
          )}
          <h3 className="platform-inbox-section">
            Recent appointments <span>{data.bookings.length}</span>
          </h3>
          {data.bookings.length ? (
            data.bookings.map((b) => (
              <article className="platform-inbox-record" key={b.id}>
                <div>
                  <h3>{b.name}</h3>
                  <a href={`mailto:${b.email}`}>{b.email}</a>
                  <p>
                    {new Intl.DateTimeFormat("en-NG", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Africa/Lagos",
                    }).format(new Date(b.start))}{" "}
                    WAT · {b.state}
                  </p>
                  <small>Reference: {b.id}</small>
                </div>
                {b.state === "confirmed" && (
                  <button
                    className="platform-secondary"
                    disabled={busy}
                    onClick={() =>
                      void run("booking.cancel", {
                        id: b.id,
                        version: b.version,
                      })
                    }
                  >
                    Cancel test appointment
                  </button>
                )}
              </article>
            ))
          ) : (
            <p className="platform-muted">No appointments yet.</p>
          )}
        </>
      )}
    </section>
  );
}
