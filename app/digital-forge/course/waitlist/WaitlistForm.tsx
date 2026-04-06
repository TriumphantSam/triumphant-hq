'use client';

import { useState } from "react";

const ACCESS_OPTIONS = [
  "Hosted course access",
  "Bundle delivery first",
  "Both options",
  "Not sure yet",
];

const HELP_OPTIONS = [
  "Choosing the right offer",
  "Building the product",
  "Packaging and messaging",
  "Launch and promotion",
  "Operations and scaling",
];

export default function WaitlistForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    accessPath: ACCESS_OPTIONS[0],
    helpTopic: HELP_OPTIONS[0],
    note: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.9rem 1rem",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.03)",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    const message = [
      `Priority access request for the Digital Forge Course.`,
      ``,
      `Preferred access path: ${formData.accessPath}`,
      `Main help topic: ${formData.helpTopic}`,
      `WhatsApp number: ${formData.whatsapp || "Not provided"}`,
      ``,
      `Additional note:`,
      formData.note || "No extra note provided.",
    ].join("\n");

    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: "service_fgz42ok",
          template_id: "template_2bilwne",
          user_id: "TCsiAiLBlJkqHpCn5",
          template_params: {
            from_name: formData.name,
            reply_to: formData.email,
            service: "Digital Forge Course Waitlist",
            message,
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to join the waitlist");
      setSent(true);
      setFormData({
        name: "",
        email: "",
        whatsapp: "",
        accessPath: ACCESS_OPTIONS[0],
        helpTopic: HELP_OPTIONS[0],
        note: "",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div
        style={{
          background: "rgba(124,58,237,0.07)",
          border: "1px solid rgba(124,58,237,0.24)",
          borderRadius: 22,
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "2.6rem", marginBottom: "0.8rem" }}>✅</div>
        <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.55rem" }}>
          You’re on the waitlist
        </h3>
        <p style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.8, marginBottom: "1.2rem" }}>
          You’ll now be easier to track for course-first updates, access announcements, and the strongest next step when the full rollout opens.
        </p>
        <button
          onClick={() => {
            setSent(false);
            setError("");
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.9rem 1.3rem",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.16)",
            background: "transparent",
            color: "rgba(255,255,255,0.82)",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Add Another Entry
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "rgba(124,58,237,0.07)",
        border: "1px solid rgba(124,58,237,0.24)",
        borderRadius: 22,
        padding: "1.6rem",
      }}
    >
      <p style={{ color: "#8B5CF6", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.5rem", fontWeight: 700 }}>
        Join the Waitlist
      </p>
      <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "1.15rem", marginBottom: "0.7rem" }}>
        Tell us how you want access
      </h3>
      <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.8, fontSize: "0.92rem", marginBottom: "1.4rem" }}>
        This is the real course waitlist step. Share your preferred access path and what you want most help with so the launch flow can be shaped around actual demand.
      </p>

      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            borderRadius: 10,
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#f87171",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Adeyemi Samuel"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>
              WhatsApp Number
            </label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="+234..."
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>
              Preferred Access Path
            </label>
            <select
              value={formData.accessPath}
              onChange={(e) => setFormData({ ...formData, accessPath: e.target.value })}
              style={{ ...inputStyle, colorScheme: "dark" }}
            >
              {ACCESS_OPTIONS.map((option) => (
                <option key={option} value={option} style={{ background: "#050510", color: "#fff" }}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>
            What do you want most help with?
          </label>
          <select
            value={formData.helpTopic}
            onChange={(e) => setFormData({ ...formData, helpTopic: e.target.value })}
            style={{ ...inputStyle, colorScheme: "dark" }}
          >
            {HELP_OPTIONS.map((option) => (
              <option key={option} value={option} style={{ background: "#050510", color: "#fff" }}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>
            Extra Note
          </label>
          <textarea
            rows={4}
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Tell us what would make the course most useful for you."
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem 1.5rem",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontSize: "0.82rem",
            color: "#fff",
            background: sending ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg, #7C3AED, #4C1D95)",
            border: "none",
            cursor: sending ? "wait" : "pointer",
          }}
        >
          {sending ? "Joining..." : "Join the Waitlist"}
        </button>
      </form>
    </div>
  );
}
