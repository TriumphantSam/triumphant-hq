"use client";

import { useState } from "react";
import { agencyServices, discoveryCallUrl, whatsappNumber } from "@/lib/services";

const serviceLabels: Record<string, string> = Object.fromEntries(
  agencyServices.map((service) => [service.slug, service.shortTitle]),
);

const initialForm = { name: "", email: "", company: "", service: "", budget: "", timeline: "", message: "" };

export default function ContactPage() {
  const [formData, setFormData] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const projectMessage = [
    formData.company ? `Company: ${formData.company}` : "",
    formData.budget ? `Budget: ${formData.budget}` : "",
    formData.timeline ? `Timeline: ${formData.timeline}` : "",
    "",
    formData.message,
  ].filter(Boolean).join("\n");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const leadResponse = await fetch("/api/contact-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          service: serviceLabels[formData.service] || formData.service || "Not specified",
          message: projectMessage,
        }),
      });
      if (!leadResponse.ok) throw new Error("We could not save your enquiry. Please try again.");

      const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: "service_fgz42ok",
          template_id: "template_2bilwne",
          user_id: "TCsiAiLBlJkqHpCn5",
          template_params: {
            from_name: formData.name,
            reply_to: formData.email,
            service: serviceLabels[formData.service] || formData.service || "Not specified",
            message: projectMessage,
          },
        }),
      });
      if (!emailResponse.ok) throw new Error("We could not send your enquiry. Please try again.");

      setSent(true);
      setFormData(initialForm);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const update = (field: keyof typeof initialForm, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const fieldClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
  const labelClass = "text-xs font-extrabold uppercase tracking-[0.1em] text-slate-600";

  return (
    <div>
      <header className="page-hero">
        <p className="eyebrow">Work with us</p>
        <h1>Tell us what the business needs to achieve.</h1>
        <p>
          Share the context, the challenge and where you want to get to. We will review your enquiry and respond with a
          practical next step within one business day.
        </p>
      </header>

      <section className="section-muted">
        <div className="section-shell grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <aside>
            <p className="eyebrow">Before you submit</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-950">A useful first conversation starts with context.</h2>
            <p className="mt-4 leading-7 text-slate-600">
              You do not need a complete specification. A clear description of the problem, the desired outcome and your
              timing is enough for us to recommend the next step.
            </p>
            <div className="mt-8 grid gap-3">
              {[
                ["Response time", "Within one business day"],
                ["Discovery call", "30 minutes, no pressure"],
                ["Project fit", "Honest guidance before a proposal"],
              ].map(([label, value]) => (
                <div className="rounded-xl border border-slate-200 bg-white p-4" key={label}>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
                  <p className="mt-1 text-sm font-bold text-slate-950">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-col items-start gap-3">
              <a className="text-link !mt-0 !pt-0" href={discoveryCallUrl} target="_blank" rel="noreferrer">Book directly instead <span>→</span></a>
              <a className="text-sm font-semibold text-slate-600 hover:text-blue-700" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp: +234 810 771 1190</a>
              <a className="text-sm font-semibold text-slate-600 hover:text-blue-700" href="mailto:admin@triumphantech.com">admin@triumphantech.com</a>
            </div>
          </aside>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-9">
            {sent ? (
              <div className="grid min-h-[460px] place-items-center text-center">
                <div>
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blue-600 text-xl text-white">✓</span>
                  <h2 className="mt-5 text-2xl font-extrabold text-slate-950">Your project enquiry is with us.</h2>
                  <p className="mt-3 text-slate-600">We will review the details and reply within one business day.</p>
                  <button className="button button-secondary mt-7" onClick={() => setSent(false)}>Send another enquiry</button>
                </div>
              </div>
            ) : (
              <form className="grid gap-5" onSubmit={handleSubmit}>
                <div>
                  <p className="eyebrow">Project enquiry</p>
                  <h2 className="mt-3 text-2xl font-extrabold text-slate-950">Help us understand the opportunity.</h2>
                </div>

                {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className={labelClass}>Your name
                    <input required className={fieldClass} value={formData.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name" />
                  </label>
                  <label className={labelClass}>Work email
                    <input required type="email" className={fieldClass} value={formData.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" />
                  </label>
                </div>
                <label className={labelClass}>Company or organisation
                  <input className={fieldClass} value={formData.company} onChange={(e) => update("company", e.target.value)} placeholder="Optional" />
                </label>
                <label className={labelClass}>Primary service
                  <select required className={fieldClass} value={formData.service} onChange={(e) => update("service", e.target.value)}>
                    <option value="">Select the closest fit</option>
                    {agencyServices.map((service) => <option key={service.slug} value={service.slug}>{service.shortTitle}</option>)}
                    <option value="Not sure yet">Not sure yet</option>
                  </select>
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className={labelClass}>Indicative budget
                    <select className={fieldClass} value={formData.budget} onChange={(e) => update("budget", e.target.value)}>
                      <option value="">Select a range</option>
                      <option>Under ₦350,000</option>
                      <option>₦350,000 – ₦1,000,000</option>
                      <option>₦1,000,000 – ₦3,000,000</option>
                      <option>Above ₦3,000,000</option>
                      <option>Monthly retainer</option>
                    </select>
                  </label>
                  <label className={labelClass}>Desired timeline
                    <select className={fieldClass} value={formData.timeline} onChange={(e) => update("timeline", e.target.value)}>
                      <option value="">Select timing</option>
                      <option>As soon as possible</option>
                      <option>Within 1–2 months</option>
                      <option>Within 3–6 months</option>
                      <option>Exploring for later</option>
                    </select>
                  </label>
                </div>
                <label className={labelClass}>Project context
                  <textarea required rows={6} className={`${fieldClass} resize-y`} value={formData.message} onChange={(e) => update("message", e.target.value)} placeholder="What is the current challenge, what would success look like, and is there anything we should know?" />
                </label>
                <button className="button button-primary sm:justify-self-start" disabled={sending} type="submit">
                  {sending ? "Sending enquiry…" : "Send project enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
