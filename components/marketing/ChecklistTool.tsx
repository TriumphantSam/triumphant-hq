"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  bandForScore,
  scoreChecklist,
  type ChecklistMagnet,
} from "@/lib/lead-magnets";
import { discoveryCallUrl } from "@/lib/services";

export default function ChecklistTool({ magnet }: { magnet: ChecklistMagnet }) {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>(
    Object.fromEntries(magnet.questions.map((q) => [q.id, null])),
  );
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { score, answered, total } = useMemo(
    () => scoreChecklist(answers, magnet.questions),
    [answers, magnet.questions],
  );

  const complete = answered === total;
  const band = bandForScore(score, magnet.bands);

  const setAnswer = (id: string, value: boolean) => {
    setAnswers((current) => ({ ...current, [id]: value }));
  };

  const handleShowResults = () => {
    if (!complete) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveLead = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.includes("@") || !name.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/contact-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          service: `${magnet.eyebrow} · Score ${score}`,
          message: [
            `Lead magnet: ${magnet.slug}`,
            `Score: ${score}/100 (${band.label})`,
            `Band summary: ${band.summary}`,
            "",
            "Answers:",
            ...magnet.questions.map((q) => `- ${q.prompt}: ${answers[q.id] ? "Yes" : "No"}`),
          ].join("\n"),
        }),
      });
      setSaved(true);
    } catch {
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (submitted && complete) {
    return (
      <div className="section-shell pb-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="eyebrow">Your result</p>
            <p className="font-mono mt-6 text-sm font-bold tracking-[0.14em] text-blue-600">{band.label}</p>
            <h2 className="font-display mt-3 text-[clamp(2.4rem,6vw,4.5rem)] font-bold tracking-[-0.05em] text-slate-950">
              {score}
              <span className="text-[0.45em] text-slate-400"> / 100</span>
            </h2>
            <p className="mt-6 max-w-xl text-[1.08rem] leading-8 text-slate-600">{band.summary}</p>
            <p className="mt-5 max-w-xl border-l border-blue-200/80 pl-5 text-[1.02rem] leading-8 text-slate-700">
              <span className="font-semibold text-slate-950">Recommended next step: </span>
              {band.nextStep}
            </p>
            <div className="button-row mt-10">
              <a className="button button-primary" href={discoveryCallUrl} target="_blank" rel="noreferrer">
                Book a discovery call
              </a>
              <Link className="button button-secondary" href={magnet.relatedServiceHref}>
                Explore {magnet.relatedService}
              </Link>
            </div>
            <button
              type="button"
              className="mt-8 text-sm font-semibold text-slate-500 underline-offset-4 hover:text-blue-700 hover:underline"
              onClick={() => setSubmitted(false)}
            >
              Adjust my answers
            </button>
          </div>

          <div className="next-step-panel self-start">
            <p className="eyebrow">Optional</p>
            <h3 className="font-display mt-5 text-[1.45rem] font-bold tracking-[-0.03em] text-slate-950">
              Email me this score and a practical next-step note.
            </h3>
            <p className="mt-3 text-[0.98rem] leading-7 text-slate-600">
              We will follow up with a concise interpretation—no spam, no automated pitch sequence.
            </p>
            {saved ? (
              <p className="mt-8 text-[1.02rem] font-medium text-slate-950">
                Saved. If useful, book a call and we will walk through the priorities together.
              </p>
            ) : (
              <form className="mt-8 grid gap-4" onSubmit={handleSaveLead}>
                <label className="block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-slate-500">
                  Name
                  <input
                    required
                    className="mt-2.5 w-full rounded-xl border border-slate-200/90 bg-slate-50/50 px-4 py-3.5 text-[0.95rem] text-slate-950 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </label>
                <label className="block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-slate-500">
                  Work email
                  <input
                    required
                    type="email"
                    className="mt-2.5 w-full rounded-xl border border-slate-200/90 bg-slate-50/50 px-4 py-3.5 text-[0.95rem] text-slate-950 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                  />
                </label>
                <button className="button button-primary mt-2" disabled={saving} type="submit">
                  {saving ? "Saving…" : "Send my results"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-shell pb-20">
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-sm font-medium text-slate-500">
          {answered} of {total} answered
        </p>
        <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-slate-200 sm:w-48">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(answered / total) * 100}%` }}
          />
        </div>
      </div>

      <ol className="grid gap-0 border-t border-slate-200">
        {magnet.questions.map((question, index) => (
          <li key={question.id} className="grid gap-4 border-b border-slate-200 py-7 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8">
            <span className="font-mono text-xs font-bold tracking-[0.14em] text-blue-600">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="text-[1.05rem] font-medium leading-7 text-slate-950">{question.prompt}</p>
            <div className="flex gap-2">
              <button
                type="button"
                className={`min-h-11 min-w-[4.5rem] rounded-xl border px-4 text-sm font-bold transition ${
                  answers[question.id] === true
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                }`}
                onClick={() => setAnswer(question.id, true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={`min-h-11 min-w-[4.5rem] rounded-xl border px-4 text-sm font-bold transition ${
                  answers[question.id] === false
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                }`}
                onClick={() => setAnswer(question.id, false)}
              >
                No
              </button>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">Answer every question for an accurate score.</p>
        <button
          type="button"
          className="button button-primary disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!complete}
          onClick={handleShowResults}
        >
          See my score
        </button>
      </div>
    </div>
  );
}
