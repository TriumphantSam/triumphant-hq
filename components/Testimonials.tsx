"use client";

import { useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Triumphant HQ brought clarity to the project from the first conversation. The final experience felt considered, professional and much easier for our customers to use.",
    name: "Chinonso E.",
    role: "Business Owner",
  },
  {
    quote:
      "The implementation order was clear and practical. Instead of another report, we had a partner who could explain the priorities and execute the technical work.",
    name: "Amara O.",
    role: "Marketing Lead",
  },
  {
    quote:
      "The automation setup gave our small team a process we could actually maintain. Follow-up became consistent, and we spend less time moving information manually.",
    name: "Tunde A.",
    role: "Founder, Service Business",
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
              <p className="mt-1 text-xs tracking-wide text-slate-500">{active.role}</p>
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
