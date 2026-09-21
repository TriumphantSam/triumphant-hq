"use client";

import { useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Triumphant HQ brought clarity to our digital systems from the very first conversation. The final experience felt considered, fast, and significantly easier for our patients and partners to navigate.",
    name: "Dr. Seyi O.",
    role: "Clinical Director",
    company: "Absolute Wellness & Medical",
  },
  {
    quote:
      "The implementation order was practical and disciplined. Instead of another advisory deck, we had an accountable partner who could translate growth strategy into clean Next.js engineering.",
    name: "Amara O.",
    role: "Head of Operations",
    company: "Precision Agriculture Partner",
  },
  {
    quote:
      "The automation and portal integration gave our team a workflow we can actually sustain. Lead response time dropped to minutes, and we no longer waste hours moving data by hand.",
    name: "Tunde A.",
    role: "Managing Director",
    company: "Regional Logistics & Services",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = TESTIMONIALS[index];

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % TESTIMONIALS.length);
    }, 5600);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section className="section-shell">
      <div className="section-heading section-heading-center mx-auto text-center">
        <p className="eyebrow">Client perspective</p>
        <h2>Professional execution, with a partner who stays close to the problem.</h2>
      </div>

      <div
        className="mx-auto max-w-3xl border-y border-slate-200 py-10 sm:py-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="testimonial-stage flex flex-col items-center text-center">
          <blockquote key={active.name} className="testimonial-slide">
            <p className="font-display text-[clamp(1.25rem,2.4vw,1.65rem)] leading-[1.55] tracking-[-0.025em] text-slate-800">
              “{active.quote}”
            </p>
            <footer className="mt-8">
              <p className="text-sm font-bold text-slate-950">{active.name}</p>
              <p className="mt-1 text-xs tracking-wide text-slate-500">
                {active.role} · <span className="font-semibold text-slate-700">{active.company}</span>
              </p>
            </footer>
          </blockquote>

          <div className="mt-10 flex items-center gap-4">
            <button
              type="button"
              aria-label="Previous testimonial"
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-blue-300 hover:text-blue-700"
              onClick={() => setIndex((current) => (current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            >
              ←
            </button>
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  className="testimonial-dot"
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next testimonial"
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-blue-300 hover:text-blue-700"
              onClick={() => setIndex((current) => (current + 1) % TESTIMONIALS.length)}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
