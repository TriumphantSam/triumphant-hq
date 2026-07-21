import Link from "next/link";
import { discoveryCallUrl } from "@/lib/services";

type Action = {
  href: string;
  label: string;
  external?: boolean;
  variant?: "primary" | "secondary";
};

export default function NextStepPanel({
  eyebrow = "Next step",
  title = "Scope is confirmed after discovery.",
  description = "We review your goals, constraints and existing systems, then share a written proposal with timeline and deliverables before any work begins.",
  actions,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  actions?: Action[];
}) {
  const resolvedActions: Action[] =
    actions ??
    ([
      { href: discoveryCallUrl, label: "Book a discovery call", external: true, variant: "primary" },
      { href: "/contact", label: "Send a project brief", variant: "secondary" },
    ] satisfies Action[]);

  return (
    <div className="next-step-panel">
      <p className="eyebrow">{eyebrow}</p>
      <h3 className="font-display mt-5 text-[clamp(1.35rem,2.4vw,1.85rem)] font-bold tracking-[-0.035em] text-slate-950">
        {title}
      </h3>
      <p className="mt-4 max-w-lg text-[1.02rem] leading-8 text-slate-600">{description}</p>
      <div className="button-row mt-8">
        {resolvedActions.map((action) => {
          const className = `button ${action.variant === "secondary" ? "button-secondary" : "button-primary"}`;
          if (action.external) {
            return (
              <a
                key={action.href + action.label}
                className={className}
                href={action.href}
                target="_blank"
                rel="noreferrer"
              >
                {action.label}
              </a>
            );
          }
          return (
            <Link key={action.href + action.label} className={className} href={action.href}>
              {action.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
