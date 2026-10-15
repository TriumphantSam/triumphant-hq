"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
type TurnstileAPI = {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": (code: string) => void;
      theme: string;
    },
  ) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileAPI;
  }
}

export default function Turnstile({
  onToken,
}: {
  onToken: (token: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  const [loaded, setLoaded] = useState(false);
  const [issue, setIssue] = useState("");
  const [retry, setRetry] = useState(0);
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  useEffect(() => {
    callback.current = onToken;
  }, [onToken]);
  useEffect(() => {
    if (!key || !loaded || !container.current || !window.turnstile) return;
    const widget = window.turnstile.render(container.current, {
      sitekey: key,
      action: "lead_enquiry",
      callback: (token) => {
        setIssue("");
        callback.current(token);
      },
      "expired-callback": () => {
        callback.current("");
        setIssue("Your security check expired. Please verify again.");
      },
      "error-callback": () => {
        callback.current("");
        setIssue(
          "The security check could not complete. Please retry, or open this page in another browser if it keeps failing.",
        );
      },
      theme: "light",
    });
    return () => {
      window.turnstile?.remove(widget);
    };
  }, [key, loaded, retry]);
  if (!key) return null;
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onReady={() => setLoaded(true)}
        onError={() =>
          setIssue(
            "The security check could not load. Please refresh this page and try again.",
          )
        }
      />
      <div ref={container} className="my-3 min-h-16" />
      {issue && (
        <div className="lab-note" role="alert">
          <p>{issue}</p>
          {loaded && (
            <button
              type="button"
              className="lab-link secondary mt-3"
              onClick={() => {
                callback.current("");
                setIssue("");
                setRetry((value) => value + 1);
              }}
            >
              Retry security check
            </button>
          )}
        </div>
      )}
    </>
  );
}
