import Image from "next/image";
import type { ReactNode } from "react";
import { COMPANY } from "@/lib/invoices/company";
import { formatCodeAmount } from "@/lib/invoices/currency";
import { formatDisplayDate, formatReceiptHeaderDate } from "@/lib/invoices/numbering";
import { paymentMethodLabel } from "@/lib/invoices/payment-methods";
import type { PaymentReceipt } from "@/lib/invoices/types";

/** Palette inspired by the reference receipt (cream card + bold petals). */
export const RECEIPT_COLORS = {
  cream: "#fff5e9",
  ink: "#111111",
  text: "#1f1f1f",
  muted: "#5b5b5b",
  success: "#0a9a4a",
  orange: "#ff9b00",
  flame: "#ff5a05",
  blue: "#075ee5",
  navy: "#26306b",
  pink: "#f5b3cd",
} as const;

type Props = {
  receipt: PaymentReceipt;
  className?: string;
};

export default function ReceiptDocument({ receipt, className = "" }: Props) {
  const payerName = receipt.client.company || receipt.client.name || "Valued customer";
  const amountText = formatCodeAmount(receipt.amount, receipt.currency);
  const year = receipt.paymentDate.slice(0, 4) || String(new Date().getFullYear());

  return (
    <article
      className={`receipt-document ${className}`}
      style={{
        background: RECEIPT_COLORS.cream,
        color: RECEIPT_COLORS.text,
        width: "100%",
        maxWidth: "150mm",
        margin: "0 auto",
        boxSizing: "border-box",
        fontFamily: 'var(--font-sans), "Segoe UI", Arial, sans-serif',
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 18px 50px rgba(15, 23, 42, 0.10)",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      <div style={{ padding: "11mm 11mm 0" }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2.6rem",
          }}
        >
          <div style={{ position: "relative", width: 170, height: 38 }}>
            <Image
              src={COMPANY.logoPath}
              alt={COMPANY.legalName}
              fill
              sizes="170px"
              style={{ objectFit: "contain", objectPosition: "left center" }}
              priority
            />
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.04em", color: RECEIPT_COLORS.ink }}>
              RECEIPT
            </p>
            <p style={{ margin: "0.15rem 0 0", fontSize: "0.62rem", color: RECEIPT_COLORS.ink }}>
              {formatReceiptHeaderDate(receipt.paymentDate)}
            </p>
          </div>
        </header>

        {/* Headline */}
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-display), var(--font-sans), sans-serif',
            fontSize: "1.85rem",
            lineHeight: 1.1,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: RECEIPT_COLORS.success,
          }}
        >
          Payment received!
        </h1>

        <div style={{ margin: "1.4rem 0 1.15rem", fontSize: "0.78rem", lineHeight: 1.55, color: RECEIPT_COLORS.ink }}>
          <p style={{ margin: 0 }}>Hello {payerName},</p>
          <p style={{ margin: 0 }}>
            Your payment of {amountText} to {COMPANY.legalName.toUpperCase()}
            {receipt.description.trim() ? <> for {receipt.description.trim()}</> : null} was received
            successfully. Thank you!
          </p>
        </div>

        {/* Details table */}
        <div style={{ border: `1.5px solid ${RECEIPT_COLORS.ink}`, fontSize: "0.78rem" }}>
          <DetailRow label="Received from" first>
            <Stack
              lines={[
                receipt.client.company || receipt.client.name || "—",
                receipt.client.company && receipt.client.name ? receipt.client.name : "",
                receipt.client.address,
                receipt.client.email,
                receipt.client.phone,
              ]}
            />
          </DetailRow>
          <DetailRow label="Receipt number">{receipt.number}</DetailRow>
          {receipt.reference.trim() ? (
            <DetailRow label="Payment reference">
              <span style={{ wordBreak: "break-all" }}>{receipt.reference}</span>
            </DetailRow>
          ) : null}
          <DetailRow label="Payment method">{paymentMethodLabel(receipt.paymentMethod)}</DetailRow>
          <DetailRow label="Payment date">{formatDisplayDate(receipt.paymentDate)}</DetailRow>
          {receipt.description.trim() ? (
            <DetailRow label="Payment for">
              <span style={{ whiteSpace: "pre-line" }}>{receipt.description}</span>
            </DetailRow>
          ) : null}
          {receipt.invoiceNumber.trim() ? (
            <DetailRow label="Invoice reference">{receipt.invoiceNumber}</DetailRow>
          ) : null}
          <DetailRow label="Amount">
            <strong style={{ fontSize: "0.86rem", fontWeight: 800, color: RECEIPT_COLORS.ink }}>{amountText}</strong>
          </DetailRow>
        </div>

        {receipt.notes.trim() ? (
          <p
            style={{
              margin: "0.9rem 0 0",
              fontSize: "0.7rem",
              lineHeight: 1.55,
              color: RECEIPT_COLORS.muted,
              whiteSpace: "pre-wrap",
            }}
          >
            {receipt.notes}
          </p>
        ) : null}

        {/* Footer */}
        <footer style={{ textAlign: "center", margin: "1.5rem 0 0", fontSize: "0.6rem", lineHeight: 1.6 }}>
          <p style={{ margin: 0, fontWeight: 600, color: RECEIPT_COLORS.ink }}>
            © {COMPANY.legalName} {year}
          </p>
          <p style={{ margin: 0 }}>
            <span style={{ color: RECEIPT_COLORS.flame }}>Building technology </span>
            <span style={{ color: RECEIPT_COLORS.navy }}>that moves </span>
            <span style={{ color: RECEIPT_COLORS.success }}>your business </span>
            <span style={{ color: RECEIPT_COLORS.blue }}>forward.</span>
          </p>
          <p style={{ margin: "0.3rem 0 0", color: RECEIPT_COLORS.muted }}>
            RC {COMPANY.registrationNumber} · TIN {COMPANY.taxId} · {COMPANY.phones[0]} · {COMPANY.email}
          </p>
        </footer>
      </div>

      <Petals />
    </article>
  );
}

function DetailRow({
  label,
  children,
  first = false,
}: {
  label: string;
  children: ReactNode;
  first?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "1.25rem",
        padding: "0.85rem 0.8rem",
        borderTop: first ? "none" : `2.5px solid ${RECEIPT_COLORS.ink}`,
        color: RECEIPT_COLORS.ink,
      }}
    >
      <span style={{ flexShrink: 0 }}>{label}</span>
      <span style={{ textAlign: "right", minWidth: 0 }}>{children}</span>
    </div>
  );
}

function Stack({ lines }: { lines: string[] }) {
  const clean = lines.map((l) => l?.trim()).filter(Boolean) as string[];
  return (
    <>
      {clean.map((line, i) => (
        <span
          key={`${line}-${i}`}
          style={{ display: "block", marginTop: i === 0 ? 0 : "0.55rem", whiteSpace: "pre-line" }}
        >
          {line}
        </span>
      ))}
    </>
  );
}

/** Overlapping colour petals anchored to the bottom edge, as in the reference. */
function Petals() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 190"
      preserveAspectRatio="xMidYMax slice"
      style={{ display: "block", width: "100%", height: 170, marginTop: "1.25rem" }}
    >
      <ellipse cx="120" cy="120" rx="62" ry="105" transform="rotate(28 120 120)" fill={RECEIPT_COLORS.orange} />
      <ellipse cx="200" cy="112" rx="68" ry="110" transform="rotate(42 200 112)" fill={RECEIPT_COLORS.success} />
      <ellipse cx="280" cy="130" rx="66" ry="112" transform="rotate(62 280 130)" fill={RECEIPT_COLORS.blue} />
      <ellipse cx="330" cy="185" rx="110" ry="62" transform="rotate(-8 330 185)" fill={RECEIPT_COLORS.flame} />
      <ellipse cx="255" cy="205" rx="150" ry="55" transform="rotate(6 255 205)" fill={RECEIPT_COLORS.orange} />
      <ellipse cx="135" cy="210" rx="150" ry="78" transform="rotate(-12 135 210)" fill={RECEIPT_COLORS.pink} />
    </svg>
  );
}
