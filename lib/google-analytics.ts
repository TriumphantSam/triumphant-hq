/**
 * GA4 measurement ID for the triumphantech.com web stream.
 * Hardcoded so production builds inline it without a dashboard secret.
 */
export const GA_MEASUREMENT_ID = "G-HP3MLFLRCT";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
