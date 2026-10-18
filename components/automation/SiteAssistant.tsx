"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ChatDemo = dynamic(() => import("./ChatDemo"), {
  loading: () => (
    <p className="p-6" role="status">
      Loading the assistant…
    </p>
  ),
});

function AssistantDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    else if (!open && element.open) element.close();
  }, [open]);

  function close() {
    dialog.current?.close();
  }

  return (
    <div id="site-ai-assistant" data-page-reader-ignore>
      <button
        ref={launcher}
        type="button"
        className="site-ai-launcher"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="site-ai-dialog"
        onClick={() => {
          setActivated(true);
          setOpen(true);
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 5h14v11H9l-4 3V5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9 9h6M9 12h4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        Ask AI
      </button>
      <dialog
        ref={dialog}
        id="site-ai-dialog"
        className="site-ai-dialog"
        aria-labelledby="site-ai-title"
        onClose={() => {
          setOpen(false);
          launcher.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="site-ai-header">
          <div>
            <h2 id="site-ai-title">TriumphantTech AI assistant</h2>
            <Link href="/automation-lab/chat" onClick={close}>
              Open the full chat page →
            </Link>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close AI assistant"
            autoFocus
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="site-ai-content lab">
          {activated ? <ChatDemo /> : null}
        </div>
      </dialog>
    </div>
  );
}

export default function SiteAssistant() {
  const pathname = usePathname();
  // Keep private workspaces and focused transaction flows free of a second chat.
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/invoices") ||
    pathname.startsWith("/receipt/") ||
    pathname === "/automation-lab/chat" ||
    pathname === "/automation-lab/assistant" ||
    pathname.includes("/checkout") ||
    pathname.startsWith("/parent-home-routine") ||
    pathname.startsWith("/digital-forge/funnel/")
  )
    return null;
  return <AssistantDialog />;
}
