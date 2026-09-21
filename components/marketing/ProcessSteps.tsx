"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Discover",
    copy: "We clarify the commercial problem, key constraints, and what measurable success must look like.",
  },
  {
    number: "02",
    title: "Design",
    copy: "We shape the user experience, systems architecture, and delivery roadmap before production.",
  },
  {
    number: "03",
    title: "Build",
    copy: "We engineer in focused iterations with continuous previews, production quality, and test coverage.",
  },
  {
    number: "04",
    title: "Improve",
    copy: "We launch with analytics and technical handoff, measuring real demand and compounding growth.",
  },
];

export default function ProcessSteps() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`process-timeline relative mt-8 pt-4 ${isVisible ? "is-visible" : ""}`}
    >
      {/* Desktop connecting drawn line */}
      <div
        className="process-timeline-line hidden md:block absolute top-[27px] left-6 right-6 h-[2px] bg-gradient-to-r from-blue-200 via-blue-500 to-blue-200 origin-left transition-transform duration-1000 ease-out"
        style={{
          transform: isVisible ? "scaleX(1)" : "scaleX(0)",
          transitionDelay: "150ms",
        }}
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-6">
        {steps.map((step, idx) => (
          <div
            key={step.number}
            className="group relative flex flex-col items-start pl-8 md:pl-0"
            style={{
              transitionDelay: `${idx * 120}ms`,
            }}
          >
            {/* Mobile vertical line */}
            <div
              className="absolute left-[11px] top-6 bottom-[-2rem] w-[2px] bg-gradient-to-b from-blue-500 to-slate-200 md:hidden last:hidden"
              aria-hidden="true"
            />

            {/* Marker Dot */}
            <div className="absolute left-0 top-1.5 md:relative md:left-auto md:top-auto md:mb-6 flex items-center justify-center">
              <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white ring-4 ring-blue-100 transition-all duration-300 group-hover:ring-8 group-hover:ring-blue-100">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-color)]" />
              </span>
            </div>

            <span className="font-mono text-[0.72rem] font-bold tracking-[0.14em] text-[var(--accent-color)]">
              STEP {step.number}
            </span>
            <h3 className="font-display mt-2 text-[1.35rem] font-bold tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-[var(--accent-color)]">
              {step.title}
            </h3>
            <p className="mt-2 text-[0.94rem] leading-relaxed text-slate-600">
              {step.copy}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
