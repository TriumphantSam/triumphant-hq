"use client";

import { useState } from "react";

const WA_NUMBER = "447478036301"; // UK number — no + or spaces
const WA_MESSAGE = encodeURIComponent(
  "Hi! I'm interested in the Digital Forge Starter System. Can you help me?"
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

export default function WhatsAppWidget() {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <>
      {/* Tooltip */}
      <div
        aria-hidden={!hovered}
        style={{
          position: "fixed",
          bottom: "9.5rem",
          right: "1.6rem",
          background: "#fff",
          color: "#111",
          fontSize: "0.82rem",
          fontWeight: 600,
          padding: "0.55rem 0.95rem",
          borderRadius: 10,
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.22s ease, transform 0.22s ease",
          zIndex: 9998,
        }}
      >
        Chat with us on WhatsApp
        {/* Arrow */}
        <span
          style={{
            position: "absolute",
            bottom: -7,
            right: 18,
            width: 0,
            height: 0,
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            borderTop: "7px solid #fff",
          }}
        />
      </div>

      {/* Floating Button */}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        id="whatsapp-chat-widget"
        aria-label="Chat with us on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "fixed",
          bottom: "5.5rem",
          right: "1.6rem",
          width: 58,
          height: 58,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #25D366, #128C7E)",
          boxShadow: hovered
            ? "0 8px 32px rgba(37,211,102,0.55)"
            : "0 4px 20px rgba(37,211,102,0.38)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          textDecoration: "none",
          transform: hovered ? "scale(1.08)" : "scale(1)",
          transition: "box-shadow 0.22s ease, transform 0.22s ease",
        }}
      >
        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="30"
          height="30"
          fill="white"
          aria-hidden="true"
        >
          <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.38.63 4.63 1.73 6.587L2.667 29.333l6.907-1.693A13.27 13.27 0 0 0 16.003 29.333C23.36 29.333 29.333 23.36 29.333 16S23.36 2.667 16.003 2.667zm0 24.267a11.08 11.08 0 0 1-5.653-1.547l-.4-.24-4.107 1.013 1.04-3.987-.267-.413A11.1 11.1 0 0 1 4.88 16c0-6.133 4.987-11.12 11.12-11.12S27.12 9.867 27.12 16s-4.987 11.12-11.117 11.12v.014zm6.12-8.347c-.333-.16-1.973-.973-2.28-1.093-.307-.107-.533-.16-.76.16s-.867 1.093-1.067 1.32c-.2.227-.387.254-.72.08-.333-.16-1.4-.52-2.667-1.653-.987-.88-1.653-1.973-1.853-2.307-.187-.333-.013-.507.16-.68.147-.147.333-.387.493-.573.16-.187.213-.32.32-.547.107-.213.053-.4-.027-.56-.08-.16-.76-1.827-1.04-2.507-.28-.667-.547-.56-.76-.56h-.653c-.227 0-.587.08-.893.4-.307.32-1.173 1.147-1.173 2.8 0 1.653 1.2 3.24 1.373 3.467.16.213 2.373 3.627 5.747 5.08.8.347 1.427.547 1.92.707.8.253 1.533.213 2.107.133.64-.093 1.973-.8 2.253-1.573.28-.773.28-1.427.2-1.573-.08-.147-.293-.227-.627-.387z" />
        </svg>

        {/* Pulse ring */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid rgba(37,211,102,0.5)",
            animation: "wa-pulse 2s ease-out infinite",
            pointerEvents: "none",
          }}
        />
      </a>

      {/* Pulse animation */}
      <style>{`
        @keyframes wa-pulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(1.5); opacity: 0;   }
          100% { transform: scale(1.5); opacity: 0;   }
        }
      `}</style>
    </>
  );
}
