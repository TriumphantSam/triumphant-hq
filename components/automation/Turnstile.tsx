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
      "error-callback": () => void;
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
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  useEffect(() => {
    callback.current = onToken;
  }, [onToken]);
  useEffect(() => {
    if (!key || !loaded || !container.current || !window.turnstile) return;
    const widget = window.turnstile.render(container.current, {
      sitekey: key,
      action: "lead_enquiry",
      callback: (token) => callback.current(token),
      "expired-callback": () => callback.current(""),
      "error-callback": () => callback.current(""),
      theme: "light",
    });
    return () => {
      window.turnstile?.remove(widget);
    };
  }, [key, loaded]);
  if (!key) return null;
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onReady={() => setLoaded(true)}
      />
      <div ref={container} className="my-3 min-h-16" />
    </>
  );
}
