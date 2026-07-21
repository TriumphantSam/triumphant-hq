"use client";

import { useEffect, useRef, useState } from "react";

export default function DeliveryProcess({ steps }: { steps: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={trackRef}
      className={`delivery-process ${visible ? "is-visible" : ""}`}
      style={{ ["--step-count" as string]: steps.length }}
    >
      <div className="delivery-process-line" aria-hidden="true" />
      <ol className="delivery-process-grid">
        {steps.map((step, index) => (
          <li
            key={step}
            className="delivery-process-step"
            style={{ ["--step-index" as string]: index }}
          >
            <span className="delivery-process-marker">
              <span className="delivery-process-dot" />
            </span>
            <span className="delivery-process-number">{String(index + 1).padStart(2, "0")}</span>
            <h3>{step}</h3>
          </li>
        ))}
      </ol>
    </div>
  );
}
