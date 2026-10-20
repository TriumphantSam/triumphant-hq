'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

let posthogInitialized = false;

function PostHogPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname === '/platform' || pathname.startsWith('/platform/') || pathname.startsWith('/business/')) {
      if (posthogInitialized) posthog.stopSessionRecording();
      return;
    }
    if (pathname && typeof window !== 'undefined') {
      window.__triumphMarketingActive = true;
      try {
        const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
        // The SDK inserts script elements. Wait for hydration so it cannot
        // displace the server-rendered JSON-LD before React matches the DOM.
        if (posthogKey && !posthogInitialized) {
          posthog.init(posthogKey, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
            person_profiles: 'identified_only',
            capture_pageview: false,
            session_recording: { blockSelector: '.platform' },
            before_send: (event) => window.location.pathname === '/platform' || window.location.pathname.startsWith('/platform/') || window.location.pathname.startsWith('/business/') ? null : event,
          });
          posthogInitialized = true;
        }
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
