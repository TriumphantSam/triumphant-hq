"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type Status = {
  available: boolean;
  testerOnly: boolean;
  connected: boolean;
  displayPhone: string | null;
  isOnBizApp: boolean;
  sandbox: boolean;
};
type SessionPayload = {
  type?: string;
  event?: string;
  data?: Record<string, unknown>;
};
declare global {
  interface Window {
    FB?: {
      init: (options: {
        appId: string;
        autoLogAppEvents: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: { authResponse?: { code?: string } }) => void,
        options: Record<string, unknown>,
      ) => void;
    };
    fbAsyncInit?: () => void;
  }
}
async function rpc<T>(action: string, payload: unknown): Promise<T> {
  const response = await fetch("/api/platform", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Please try again.");
  return data;
}
const appId = process.env.NEXT_PUBLIC_META_APP_ID || "";
const configId = process.env.NEXT_PUBLIC_META_ES_CONFIG_ID || "";
const graphVersion = process.env.NEXT_PUBLIC_META_GRAPH_VERSION || "v26.0";
export default function WhatsAppConnect({
  workspaceId,
  connected,
  onChanged,
}: {
  workspaceId: string;
  connected: boolean;
  onChanged: () => void;
}) {
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const sessionRef = useRef<SessionPayload | null>(null);
  useEffect(() => {
    let active = true;
    rpc<Status>("whatsapp.read", { workspaceId })
      .then((data) => {
        if (active) setStatus(data);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [workspaceId, connected]);
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB?.init({
        appId,
        autoLogAppEvents: true,
        xfbml: true,
        version: graphVersion,
      });
      setReady(true);
    };
    function onMessage(event: MessageEvent) {
      if (!String(event.origin).endsWith("facebook.com")) return;
      try {
        const data = JSON.parse(String(event.data)) as SessionPayload;
        if (data.type === "WA_EMBEDDED_SIGNUP") sessionRef.current = data;
      } catch {
        return;
      }
    }
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);
  async function run(work: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await work();
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  function launch() {
    if (!window.FB) {
      setError("Facebook Login is still loading. Try again in a moment.");
      return;
    }
    sessionRef.current = null;
    window.FB.login(
      (response) => {
        const code = response.authResponse?.code;
        const session = sessionRef.current;
        if (!code || !session) {
          setError(
            "Embedded Signup did not finish. Complete the Meta screens, then try again.",
          );
          return;
        }
        void run(async () => {
          setStatus(
            await rpc<Status>("whatsapp.connect", {
              workspaceId,
              code,
              session,
            }),
          );
        });
      },
      {
        config_id: configId,
        response_type: "code",
        override_default_response_type: true,
        extras: { version: "v5" },
      },
    );
  }
  const configured = Boolean(appId && configId);
  return (
    <section className="platform-card platform-form">
      {configured && (
        <Script
          src="https://connect.facebook.net/en_US/sdk.js"
          strategy="lazyOnload"
          onLoad={() => {
            if (window.FB) {
              window.FB.init({
                appId,
                autoLogAppEvents: true,
                xfbml: true,
                version: graphVersion,
              });
              setReady(true);
            }
          }}
        />
      )}
      <div className="platform-sandbox">
        <strong>Staging tester onboarding</strong> · Embedded Signup v5. App
        Review is not submitted, so only Meta app admins, developers and testers
        can complete this. External customers cannot be onboarded yet. The UK
        campaign number stays on the existing bot.
      </div>
      <h2>Connect your WhatsApp number</h2>
      <p>
        Use official Meta onboarding. If this number already runs in the
        WhatsApp Business app, keep that account; do not deregister it. The
        webhook override sends this number’s messages to the staging Worker
        only.
      </p>
      {error && (
        <p role="alert" className="platform-error">
          {error}
        </p>
      )}
      {status?.connected ? (
        <>
          <p>
            Connected{status.displayPhone ? `: ${status.displayPhone}` : ""}.
            {status.isOnBizApp
              ? " WhatsApp Business app coexistence is enabled."
              : " Cloud API registration completed."}{" "}
            Live replies use this business’s approved answers. A team reply
            pauses automation.
          </p>
          <button
            className="platform-secondary"
            disabled={busy}
            onClick={() =>
              void run(async () => {
                setStatus(
                  await rpc<Status>("whatsapp.disconnect", { workspaceId }),
                );
              })
            }
          >
            Disconnect this number
          </button>
        </>
      ) : (
        <>
          <p className="platform-muted">
            {status?.available
              ? "A genuine inbound message to the connected number is required before this is treated as live delivery."
              : "Staging WhatsApp is not switched on yet. Add the Meta app settings, Facebook Login configuration and Worker secrets first. Production stays disabled."}
          </p>
          <button
            className="platform-primary"
            disabled={
              busy || !configured || !status?.available || (!ready && configured)
            }
            onClick={launch}
          >
            {busy ? "Connecting…" : "Start official WhatsApp onboarding"}
          </button>
          {!configured && (
            <p className="platform-muted">
              This preview does not have the public Meta app and configuration
              IDs, so the signup button stays closed.
            </p>
          )}
        </>
      )}
    </section>
  );
}
