import type { ServiceIcon as ServiceIconName } from "@/lib/services";

const paths: Record<ServiceIconName, React.ReactNode> = {
  web: (
    <>
      <rect x="3" y="4" width="18" height="15" rx="2" />
      <path d="M3 9h18M8 22h8M12 19v3" />
    </>
  ),
  app: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M10 5h4M11 18h2" />
    </>
  ),
  seo: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5M7.5 11.5l2-2 2 1.5 3-3" />
    </>
  ),
  automation: (
    <>
      <path d="M8 4h8M9 20h6M12 4v4M12 16v4" />
      <rect x="4" y="8" width="16" height="8" rx="3" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" />
    </>
  ),
};

export default function ServiceIcon({
  name,
  className = "h-6 w-6",
}: {
  name: ServiceIconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
