'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

if (typeof window !== 'undefined') {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (posthogKey) {
    try {
      posthog.init(posthogKey, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false,
      });
    } catch {
      // Ignore initialization errors in restricted WebViews
    }
  }
}

function PostHogPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && typeof window !== 'undefined') {
      try {
        const origin = window.location?.origin || window.origin || '';
        let url = origin ? `${origin}${pathname}` : pathname;
        const query = searchParams?.toString();
        if (query) {
          url = `${url}?${query}`;
        }
        if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
          posthog.capture('$pageview', {
            $current_url: url,
          });
        }
      } catch {
        // Ignore telemetry errors
      }
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageViews />
      </Suspense>
      {children}
    </PHProvider>
  );
}
