"use client";

import type { ReactNode } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function TrackedLink({
  href,
  event,
  projectName,
  className,
  children,
}: {
  href: string;
  event: "portfolio_whatsapp_click" | "portfolio_visit_site";
  projectName?: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => window.gtag?.("event", event, projectName ? { project_name: projectName } : {})}
    >
      {children}
    </a>
  );
}
