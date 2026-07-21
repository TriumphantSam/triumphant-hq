"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { agencyServices, discoveryCallUrl, whatsappNumber } from "@/lib/services";

const serviceLabels: Record<string, string> = Object.fromEntries(
  agencyServices.map((service) => [service.slug, service.shortTitle]),
);

const initialForm = { name: "", email: "", company: "", service: "", budget: "", timeline: "", message: "" };

const expectations = [
  {
    number: "01",
    title: "Reply within one business day",
    copy: "We review every enquiry and come back with a clear next step.",
  },
  {
    number: "02",
    title: "30-minute discovery, no pressure",
    copy: "A short call to understand fit—not a sales pitch.",
  },
  {
    number: "03",
    title: "Honest guidance before a proposal",
    copy: "If we are not the right partner, we will say so early.",
  },
];

export default function ContactForm() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const projectMessage = [
    formData.company ? `Company: ${formData.company}` : "",
    formData.budget ? `Budget: ${formData.budget}` : "",
    formData.timeline ? `Timeline: ${formData.timeline}` : "",
    "",
    formData.message,
  ]
    .filter(Boolean)
    .join("\n");

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

      router.push("/contact/thank-you");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Failed to send. Please try again.");
      setSending(false);
    }
  };

  const update = (field: keyof typeof initialForm, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const fieldClass =
    "mt-2.5 w-full rounded-xl border border-slate-200/90 bg-slate-50/50 px-4 py-3.5 text-[0.95rem] text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";
  const labelClass = "block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-slate-500";

  return (
    <>
      <div className="relative h-[42vw] min-h-[240px] max-h-[480px] w-full overflow-hidden">
        <Image
          src="/images/contact-enquiry.png"
          alt="Quiet meeting table ready for a discovery conversation"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(247,248,251,0.55) 0%, transparent 28%, transparent 72%, rgba(247,248,251,0.7) 100%)",
          }}
        />
      </div>

      <section className="section-shell pb-16 lg:pb-20">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16 xl:gap-20">
          <aside className="lg:sticky lg:top-28">
            <p className="eyebrow">Before you submit</p>
            <h2 className="font-display mt-7 max-w-md text-[clamp(1.85rem,3.2vw,2.55rem)] font-bold leading-[1.1] tracking-[-0.04em] text-slate-950">
              A useful first conversation starts with context.
            </h2>
            <p className="mt-6 max-w-md text-[1.02rem] leading-8 text-slate-600">
              You do not need a complete specification. A clear description of the problem, the desired outcome and your
              timing is enough for us to recommend the next step.
            </p>

            <div className="mt-12 grid gap-8 border-l border-blue-200/80 pl-6 sm:pl-8">
              {expectations.map((item) => (
                <div key={item.number}>
                  <span className="font-mono text-[0.7rem] font-bold tracking-[0.14em] text-blue-600">
                    {item.number}
                  </span>
                  <h3 className="font-display mt-2 text-[1.1rem] font-bold tracking-[-0.02em] text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 max-w-sm text-[0.95rem] leading-7 text-slate-500">{item.copy}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 space-y-4 border-t border-slate-200/80 pt-8">
              <a className="text-link !mt-0 !pt-0" href={discoveryCallUrl} target="_blank" rel="noreferrer">
                Book a discovery call instead <span>→</span>
              </a>
              <div className="flex flex-col gap-2.5 text-[0.95rem]">
                <a
                  className="font-medium text-slate-600 transition hover:text-blue-700"
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp · +234 810 771 1190
                </a>
                <a
                  className="font-medium text-slate-600 transition hover:text-blue-700"
                  href="mailto:admin@triumphantech.com"
                >
                  admin@triumphantech.com
                </a>
              </div>
            </div>
          </aside>

          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <form className="grid gap-7" onSubmit={handleSubmit}>
              <div>
                <p className="eyebrow">Project enquiry</p>
                <h2 className="font-display mt-5 text-[clamp(1.55rem,2.5vw,2rem)] font-bold tracking-[-0.035em] text-slate-950">
                  Help us understand the opportunity.
                </h2>
              </div>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">{error}</div>
              ) : null}

              <div className="grid gap-6 sm:grid-cols-2">
                <label className={labelClass}>
                  Your name
                  <input
                    required
                    className={fieldClass}
                    value={formData.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Full name"
                  />
                </label>
                <label className={labelClass}>
                  Work email
                  <input
                    required
                    type="email"
                    className={fieldClass}
                    value={formData.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@company.com"
                  />
                </label>
              </div>

              <label className={labelClass}>
                Company or organisation
                <input
                  className={fieldClass}
                  value={formData.company}
                  onChange={(e) => update("company", e.target.value)}
                  placeholder="Optional"
                />
              </label>

              <label className={labelClass}>
                Primary service
                <select
                  required
                  className={fieldClass}
                  value={formData.service}
                  onChange={(e) => update("service", e.target.value)}
                >
                  <option value="">Select the closest fit</option>
                  {agencyServices.map((service) => (
                    <option key={service.slug} value={service.slug}>
                      {service.shortTitle}
                    </option>
                  ))}
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </label>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className={labelClass}>
                  Indicative budget
                  <select
                    className={fieldClass}
                    value={formData.budget}
                    onChange={(e) => update("budget", e.target.value)}
                  >
                    <option value="">Select a range</option>
                    <option>Under ₦350,000</option>
                    <option>₦350,000 – ₦1,000,000</option>
                    <option>₦1,000,000 – ₦3,000,000</option>
                    <option>Above ₦3,000,000</option>
                    <option>Monthly retainer</option>
                  </select>
                </label>
                <label className={labelClass}>
                  Desired timeline
                  <select
                    className={fieldClass}
                    value={formData.timeline}
                    onChange={(e) => update("timeline", e.target.value)}
                  >
                    <option value="">Select timing</option>
                    <option>As soon as possible</option>
                    <option>Within 1–2 months</option>
                    <option>Within 3–6 months</option>
                    <option>Exploring for later</option>
                  </select>
                </label>
              </div>

              <label className={labelClass}>
                Project context
                <textarea
                  required
                  rows={5}
                  className={`${fieldClass} resize-y`}
                  value={formData.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="What is the current challenge, what would success look like, and is there anything we should know?"
                />
              </label>

              <div className="pt-1">
                <button className="button button-primary w-full sm:w-auto" disabled={sending} type="submit">
                  {sending ? "Sending enquiry…" : "Send project enquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
