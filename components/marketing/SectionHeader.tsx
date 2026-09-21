import type { ReactNode } from "react";

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  liveDot = false,
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  liveDot?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`section-heading ${align === "center" ? "section-heading-center" : ""} ${className}`}
    >
      <p className="eyebrow inline-flex items-center gap-2">
        {liveDot ? <span className="live-dot" aria-hidden="true" /> : null}
        {eyebrow}
      </p>
      <h2>{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  );
}
