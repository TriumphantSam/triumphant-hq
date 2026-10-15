"use client";
import { useEffect, useState } from "react";
import Turnstile from "./Turnstile";
type Slot = { start: string; end: string };
type Reservation = { id: string; start: string; end: string; status: string };
type Delivery = { kind: string; state: string; channel?: string };
const deliveryLabels: Record<string, string> = {
  confirmation: "Your confirmation",
  owner_confirmation: "Team notification",
  cancellation: "Cancellation email",
};
const dateLabel = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(value));
const timeLabel = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
async function request(path: string, input?: unknown) {
  const response = await fetch(path, {
    method: input ? "POST" : "GET",
    headers: input ? { "Content-Type": "application/json" } : undefined,
    body: input ? JSON.stringify(input) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Please try again.");
  return data;
}
export default function BookingDemo() {
  const [slots, setSlots] = useState<Slot[]>([]),
    [loading, setLoading] = useState(true),
    [start, setStart] = useState(""),
    [day, setDay] = useState("");
  const [channels, setChannels] = useState({ sms: false, whatsapp: false });
  const [booking, setBooking] = useState<Reservation | null>(null),
    [code, setCode] = useState(""),
    [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [token, setToken] = useState(""),
    [attempt, setAttempt] = useState(0);
  const [identity, setIdentity] = useState<{
    fingerprint: string;
    id: string;
  } | null>(null);
  useEffect(() => {
    let stopped = false;
    request("/api/automation/bookings")
      .then((data) => {
        if (!stopped) setSlots(data.slots);
        if (!stopped)
          setChannels(data.channels || { sms: false, whatsapp: false });
      })
      .catch((error) => {
        if (!stopped) setError(error.message);
      })
      .finally(() => {
        if (!stopped) setLoading(false);
      });
    if (window.location.hash === "#manage")
      (
        document.getElementById("manage") as HTMLDetailsElement | null
      )?.setAttribute("open", "");
    return () => {
      stopped = true;
    };
  }, []);
  useEffect(() => {
    if (!booking || !code) return;
    let stopped = false,
      tries = 0,
      timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const data = await request("/api/automation/bookings/manage", {
          action: "status",
          id: booking.id,
          code,
        });
        if (!stopped) setDeliveries(data.deliveries);
      } catch {
        /* The reservation remains confirmed if status polling fails. */
      }
      if (!stopped && ++tries < 12) timer = setTimeout(poll, 5000);
    };
    void poll();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [booking, code]);
  function resetCheck() {
    setToken("");
    setAttempt((a) => a + 1);
  }
  async function reserve(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const details = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      smsOptIn: form.get("smsOptIn") === "on",
      whatsappOptIn: form.get("whatsappOptIn") === "on",
      reviewOptIn: form.get("reviewOptIn") === "on",
      start,
    };
    const fingerprint = JSON.stringify(details),
      requestId =
        identity?.fingerprint === fingerprint
          ? identity.id
          : crypto.randomUUID();
    setIdentity({ fingerprint, id: requestId });
    try {
      const data = await request("/api/automation/bookings", {
        ...details,
        requestId,
        turnstileToken: token,
        companyWebsite: form.get("companyWebsite"),
      });
      setBooking(data.booking);
      setCode(data.code);
    } catch (error) {
      try {
        const recovered = await request("/api/automation/bookings/recover", {
          ...details,
          requestId,
        });
        setBooking(recovered.booking);
        setCode(recovered.code);
      } catch {
        setError(
          error instanceof Error && error.name !== "TimeoutError"
            ? error.message
            : "The response took too long. Check your confirmation email before booking again.",
        );
        try {
          const data = await request("/api/automation/bookings");
          setSlots(data.slots);
        } catch {
          /* Keep choices for retry. */
        }
      }
    } finally {
      setBusy(false);
      resetCheck();
    }
  }
  async function manage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget),
      id = String(form.get("id")).trim(),
      privateCode = String(form.get("code")).trim();
    try {
      const data = await request("/api/automation/bookings/manage", {
        action: "status",
        id,
        code: privateCode,
      });
      setBooking(data.booking);
      setCode(privateCode);
      setDeliveries(data.deliveries);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function cancel(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!booking) return;
    setBusy(true);
    setError("");
    try {
      const data = await request("/api/automation/bookings/manage", {
        action: "cancel",
        id: booking.id,
        code,
        turnstileToken: token,
      });
      setBooking(data.booking);
      setDeliveries(data.deliveries);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
      resetCheck();
    }
  }
  function calendar() {
    // Calendar exports contain no private management credentials.
    if (!booking) return;
    const stamp = (value: string) =>
      value.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//TriumphantTech//Consultation//EN",
      "BEGIN:VEVENT",
      `UID:${booking.id}@triumphantech.com`,
      `DTSTAMP:${stamp(new Date().toISOString())}`,
      `DTSTART:${stamp(booking.start)}`,
      `DTEND:${stamp(booking.end)}`,
      "SUMMARY:TriumphantTech automation consultation",
      "DESCRIPTION:Our team will email joining details. Contact admin@triumphantech.com",
      "END:VEVENT",
      "END:VCALENDAR",
      "",
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/calendar;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "triumphanttech-consultation.ics";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const disabled =
    busy || Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !token);
  const days = [...new Set(slots.map((slot) => dateLabel(slot.start)))];
  return (
    <div className="lab-panel ph-no-capture" data-ph-no-capture>
      <h2>
        {booking
          ? booking.status === "cancelled"
            ? "Appointment cancelled"
            : "Your time is reserved"
          : "Book an automation consultation"}
      </h2>
      <p className="lab-note">
        Free · 30 minutes · Lagos time (WAT). Weekdays 10am–4pm, with a
        15-minute buffer and 24 hours’ notice.
      </p>
      {error && (
        <p role="alert" className="lab-error">
          {error}
        </p>
      )}
      {booking ? (
        <div className="lab-result" aria-live="polite">
          <p>
            <strong>
              {dateLabel(booking.start)}, {timeLabel(booking.start)}–
              {timeLabel(booking.end)} WAT
            </strong>
          </p>
          <p className="lab-reference">Reference: {booking.id}</p>
          {booking.status !== "cancelled" && (
            <>
              <p className="lab-note">
                Keep this private code to manage your appointment. It is also
                included in your confirmation email.
              </p>
              <label className="lab-private-code">
                Management code
                <input
                  readOnly
                  value={code}
                  aria-label="Private management code"
                  className="ph-mask"
                />
              </label>
              <button
                type="button"
                className="lab-link secondary"
                onClick={calendar}
              >
                Download calendar event
              </button>
            </>
          )}
          {deliveries
            .filter((d) =>
              ["confirmation", "owner_confirmation", "cancellation"].includes(
                d.kind,
              ),
            )
            .map((d) => (
              <div
                className="lab-result-row"
                key={`${d.channel || "email"}:${d.kind}`}
              >
                <span>
                  {d.channel && d.channel !== "email"
                    ? `${d.channel.toUpperCase()}: `
                    : ""}
                  {deliveryLabels[d.kind]}
                </span>
                <strong>
                  {d.state === "sent" || d.state === "accepted"
                    ? "Provider accepted"
                    : d.state}
                </strong>
              </div>
            ))}
          <p className="lab-note">
            {booking.status === "cancelled"
              ? "Your time is available for another customer."
              : "Email reminders are scheduled for 24 hours and 2 hours before your call. Our team will email joining details. Email acceptance is separate from inbox delivery."}
          </p>
          {booking.status !== "cancelled" && (
            <form className="lab-form" onSubmit={cancel}>
              {deliveries.some((d) => d.channel && d.channel !== "email") && (
                <button
                  type="button"
                  className="lab-link secondary"
                  disabled={busy}
                  onClick={async () => {
                    if (!booking) return;
                    setBusy(true);
                    setError("");
                    try {
                      const data = await request(
                        "/api/automation/bookings/manage",
                        { action: "notifications_off", id: booking.id, code },
                      );
                      setDeliveries(data.deliveries);
                    } catch (error) {
                      setError(
                        error instanceof Error
                          ? error.message
                          : "Please try again.",
                      );
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Stop phone notifications
                </button>
              )}
              <Turnstile key={attempt} onToken={setToken} />
              <label className="lab-consent">
                <input type="checkbox" required />I want to cancel this
                appointment.
              </label>
              <button className="lab-link secondary" disabled={disabled}>
                Cancel appointment
              </button>
            </form>
          )}
        </div>
      ) : (
        <>
          <form className="lab-form" onSubmit={reserve}>
            <fieldset className="lab-slot-fieldset">
              <legend>Choose an available time</legend>
              {loading ? (
                <p role="status">Loading available times…</p>
              ) : !slots.length ? (
                <p>No times are currently available. Please contact us.</p>
              ) : (
                <div className="lab-slot-day">
                  <label>
                    Date
                    <select
                      value={days.includes(day) ? day : days[0]}
                      onChange={(event) => {
                        setDay(event.target.value);
                        setStart("");
                      }}
                    >
                      {days.map((date) => (
                        <option key={date}>{date}</option>
                      ))}
                    </select>
                  </label>
                  <div className="lab-slots">
                    {slots
                      .filter(
                        (s) =>
                          dateLabel(s.start) ===
                          (days.includes(day) ? day : days[0]),
                      )
                      .map((slot) => (
                        <label key={slot.start} className="lab-slot">
                          <input
                            type="radio"
                            name="slot"
                            required
                            value={slot.start}
                            checked={start === slot.start}
                            onChange={() => setStart(slot.start)}
                          />
                          <span>{timeLabel(slot.start)}</span>
                        </label>
                      ))}
                  </div>
                </div>
              )}
            </fieldset>
            <label>
              Your name
              <input name="name" required maxLength={120} autoComplete="name" />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
              />
            </label>
            <label>
              Phone (optional)
              <input
                name="phone"
                type="tel"
                maxLength={30}
                autoComplete="tel"
              />
            </label>
            <div hidden aria-hidden="true">
              <input
                name="companyWebsite"
                tabIndex={-1}
                autoComplete="off"
                aria-label="Leave this blank"
              />
            </div>
            <fieldset>
              <legend className="lab-note">Optional phone notifications</legend>
              <label className="lab-consent">
                <input
                  type="checkbox"
                  name="whatsappOptIn"
                  disabled={!channels.whatsapp}
                />
                Send my booking updates on WhatsApp
                {!channels.whatsapp && " — number connection pending"}.
              </label>
              <label className="lab-consent">
                <input
                  type="checkbox"
                  name="smsOptIn"
                  disabled={!channels.sms}
                />
                Send my booking updates by SMS
                {!channels.sms && " — provider connection pending"}.
              </label>
              <p className="lab-note">
                These choices cover this appointment only. They do not subscribe
                you to marketing. Phone notifications need your mobile number
                and can be stopped from your booking management page.
              </p>
            </fieldset>
            <label className="lab-consent">
              <input type="checkbox" name="reviewOptIn" />
              Email me one request for honest feedback after this consultation.
              Optional; at most one request in 90 days.
            </label>
            <p className="lab-note">
              This is a real appointment. We use your details for the
              consultation, confirmation and reminders.{" "}
              <a href="/privacy-policy" className="underline">
                Privacy policy
              </a>
            </p>
            <Turnstile key={attempt} onToken={setToken} />
            <button className="lab-link" disabled={disabled || !start}>
              {busy ? "Reserving…" : "Confirm my appointment →"}
            </button>
          </form>
          <details id="manage" className="lab-manage">
            <summary>Manage an existing booking</summary>
            <form className="lab-form" onSubmit={manage}>
              <label>
                Booking reference
                <input name="id" required maxLength={36} autoComplete="off" />
              </label>
              <label>
                Private management code
                <input
                  name="code"
                  type="password"
                  autoComplete="new-password"
                  required
                  maxLength={64}
                  className="ph-mask"
                />
              </label>
              <button className="lab-link secondary" disabled={busy}>
                View appointment
              </button>
            </form>
          </details>
        </>
      )}
    </div>
  );
}
