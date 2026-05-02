"use client";

import { useEffect, useState } from "react";

/**
 * Geo-aware currency component.
 *
 * On first render it shows the `ngnLabel` (₦ price).
 * After mount it checks the user's timezone and – if the timezone is NOT
 * Africa/Lagos – swaps to the `usdLabel` ($ price).
 *
 * This approach:
 *  - is 100 % client-side (no API calls, no GDPR cookie issues)
 *  - avoids showing mixed currencies in the same journey
 *  - SSR always renders the NGN price (which is the home-market default)
 */
export default function CurrencyPrice({
  ngnLabel,
  usdLabel,
  className,
  style,
}: {
  ngnLabel: string;
  usdLabel: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [label, setLabel] = useState(ngnLabel);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
      // Nigerian timezones
      const isNigerian = tz === "Africa/Lagos" || tz.startsWith("Africa/");
      if (!isNigerian) {
        setLabel(usdLabel);
      }
    } catch {
      // If Intl is unavailable, keep NGN (safe default for primary audience)
    }
  }, [usdLabel]);

  return (
    <span className={className} style={style}>
      {label}
    </span>
  );
}
