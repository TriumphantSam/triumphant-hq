"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { GA_MEASUREMENT_ID } from "@/lib/google-analytics";

function GoogleAnalyticsPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? "";
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    const pagePath = search ? `${pathname}?${search}` : pathname;
    // gtag('config') in the root layout already records the first page view.
    if (lastPath.current === null) {
      lastPath.current = pagePath;
      return;
    }
    if (lastPath.current === pagePath) return;
    lastPath.current = pagePath;

    const timeout = window.setTimeout(() => {
      if (typeof window.gtag !== "function") return;
      window.gtag("event", "page_view", {
        page_path: pagePath,
        page_location: window.location.href,
        page_title: document.title,
      });
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [pathname, search]);

  return null;
}

export default function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsPageViews />
    </Suspense>
  );
}
