import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import {
  COMPANY,
  INVOICE_COLORS,
  PROFORMA_DISCLAIMER,
} from "@/lib/invoices/company";
import { computeInvoiceTotals, formatMoney, lineItemAmount } from "@/lib/invoices/currency";
import { formatDisplayDate } from "@/lib/invoices/numbering";
import type { ProformaInvoice } from "@/lib/invoices/types";

type Props = {
  invoice: ProformaInvoice;
  className?: string;
};

export default function InvoiceDocument({ invoice, className = "" }: Props) {
  const totals = computeInvoiceTotals(invoice.lineItems, invoice.taxPercent);
  const clientName = invoice.client.company || invoice.client.name || "—";

  return (
    <article
      className={`invoice-document ${className}`}
      style={{
        background: INVOICE_COLORS.white,
        color: INVOICE_COLORS.navy,
        width: "100%",
        maxWidth: "210mm",
        margin: "0 auto",
        padding: "14mm 14mm 12mm",
        boxSizing: "border-box",
        fontFamily: 'var(--font-sans), "Segoe UI", sans-serif',
        boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
        border: `1px solid ${INVOICE_COLORS.line}`,
        position: "relative",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 5,
          background: `linear-gradient(90deg, ${INVOICE_COLORS.accent}, ${INVOICE_COLORS.accentSecondary})`,
        }}
      />

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1.5rem",
          alignItems: "flex-start",
          marginBottom: "1.75rem",
          paddingTop: "0.35rem",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ position: "relative", width: 220, height: 44, marginBottom: "0.85rem" }}>
            <Image
              src={COMPANY.logoPath}
              alt={COMPANY.legalName}
              fill
              sizes="220px"
              style={{ objectFit: "contain", objectPosition: "left center" }}
              priority
            />
          </div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem", letterSpacing: "-0.02em" }}>
            {COMPANY.legalName}
          </p>
          {COMPANY.addressLines.map((line) => (
            <p key={line} style={{ margin: "0.15rem 0 0", color: INVOICE_COLORS.muted, fontSize: "0.82rem" }}>
              {line}
            </p>
          ))}
          <p style={{ margin: "0.35rem 0 0", color: INVOICE_COLORS.muted, fontSize: "0.82rem" }}>
            {COMPANY.phones.join(" · ")}
          </p>
          <p style={{ margin: "0.15rem 0 0", color: INVOICE_COLORS.muted, fontSize: "0.82rem" }}>
            {COMPANY.email} · {COMPANY.website}
          </p>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p
            style={{
              margin: 0,
              color: INVOICE_COLORS.accent,
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Proforma Invoice
          </p>
          <p
            style={{
              margin: "0.35rem 0 0",
              fontFamily: 'var(--font-display), var(--font-sans), sans-serif',
              fontSize: "1.35rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: INVOICE_COLORS.navy,
            }}
          >
            {invoice.number}
          </p>
          <div style={{ marginTop: "0.9rem", fontSize: "0.82rem", color: INVOICE_COLORS.muted, lineHeight: 1.65 }}>
            <div>
              <span style={{ color: "#94a3b8" }}>Issue date</span>
              <br />
              <strong style={{ color: INVOICE_COLORS.navy }}>{formatDisplayDate(invoice.issueDate)}</strong>
            </div>
            <div style={{ marginTop: "0.55rem" }}>
              <span style={{ color: "#94a3b8" }}>Valid until</span>
              <br />
              <strong style={{ color: INVOICE_COLORS.navy }}>{formatDisplayDate(invoice.validUntil)}</strong>
            </div>
            <div style={{ marginTop: "0.55rem" }}>
              <span style={{ color: "#94a3b8" }}>Currency</span>
              <br />
              <strong style={{ color: INVOICE_COLORS.navy }}>{invoice.currency}</strong>
            </div>
          </div>
        </div>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "1rem",
          marginBottom: "1.5rem",
          padding: "1rem 1.1rem",
          background: INVOICE_COLORS.surface,
          borderRadius: 12,
          border: `1px solid ${INVOICE_COLORS.line}`,
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: INVOICE_COLORS.accent,
            }}
          >
            Bill to
          </p>
          <p style={{ margin: "0.4rem 0 0", fontWeight: 700, fontSize: "1rem" }}>{clientName}</p>
          {invoice.client.name && invoice.client.company ? (
            <p style={{ margin: "0.2rem 0 0", color: INVOICE_COLORS.muted, fontSize: "0.85rem" }}>
              Attn: {invoice.client.name}
            </p>
          ) : null}
          {invoice.client.address ? (
            <p style={{ margin: "0.35rem 0 0", color: INVOICE_COLORS.muted, fontSize: "0.85rem", whiteSpace: "pre-line" }}>
              {invoice.client.address}
            </p>
          ) : null}
          {(invoice.client.email || invoice.client.phone) && (
            <p style={{ margin: "0.45rem 0 0", color: INVOICE_COLORS.muted, fontSize: "0.82rem" }}>
              {[invoice.client.email, invoice.client.phone].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: INVOICE_COLORS.accent,
            }}
          >
            Registration
          </p>
          <p style={{ margin: "0.45rem 0 0", fontSize: "0.84rem", color: INVOICE_COLORS.muted }}>
            TIN / Tax ID: <strong style={{ color: INVOICE_COLORS.navy }}>{COMPANY.taxId}</strong>
          </p>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.84rem", color: INVOICE_COLORS.muted }}>
            RC No: <strong style={{ color: INVOICE_COLORS.navy }}>{COMPANY.registrationNumber}</strong>
          </p>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.84rem", color: INVOICE_COLORS.muted }}>
            Status: <strong style={{ color: INVOICE_COLORS.navy, textTransform: "capitalize" }}>{invoice.status}</strong>
          </p>
        </div>
      </section>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "1.25rem",
          fontSize: "0.88rem",
        }}
      >
        <thead>
          <tr style={{ background: "linear-gradient(90deg, #075ee5, #1a8fd4)", color: "#fff" }}>
            <th style={{ textAlign: "left", padding: "0.7rem 0.85rem", fontWeight: 600 }}>Description</th>
            <th style={{ textAlign: "center", padding: "0.7rem 0.5rem", fontWeight: 600, width: 56 }}>Qty</th>
            <th style={{ textAlign: "right", padding: "0.7rem 0.5rem", fontWeight: 600, width: 110 }}>Rate</th>
            <th style={{ textAlign: "right", padding: "0.7rem 0.85rem", fontWeight: 600, width: 120 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item, index) => {
            const details = item.details.filter((d) => d.trim());
            return (
              <tr
                key={item.id}
                style={{
                  borderBottom: `1px solid ${INVOICE_COLORS.line}`,
                  background: index % 2 === 0 ? "#fff" : "#fafcff",
                  verticalAlign: "top",
                }}
              >
                <td style={{ padding: "0.85rem" }}>
                  <div style={{ fontWeight: 700, color: INVOICE_COLORS.navy }}>
                    {item.title.trim() || "Untitled item"}
                  </div>
                  {details.length > 0 ? (
                    <ul
                      style={{
                        margin: "0.45rem 0 0",
                        paddingLeft: "1.1rem",
                        color: INVOICE_COLORS.muted,
                        fontSize: "0.8rem",
                        lineHeight: 1.55,
                      }}
                    >
                      {details.map((detail, i) => (
                        <li key={`${item.id}-d-${i}`}>{detail}</li>
                      ))}
                    </ul>
                  ) : null}
                </td>
                <td style={{ padding: "0.85rem 0.5rem", textAlign: "center", color: INVOICE_COLORS.navy }}>
                  {item.quantity}
                </td>
                <td style={{ padding: "0.85rem 0.5rem", textAlign: "right", color: INVOICE_COLORS.navy }}>
                  {formatMoney(item.unitPrice, invoice.currency)}
                </td>
                <td style={{ padding: "0.85rem", textAlign: "right", fontWeight: 700, color: INVOICE_COLORS.navy }}>
                  {formatMoney(lineItemAmount(item.quantity, item.unitPrice), invoice.currency)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1.35rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: 280 }}>
          <Row label="Subtotal" value={formatMoney(totals.subtotal, invoice.currency)} />
          {invoice.taxPercent > 0 ? (
            <Row
              label={`Tax (${invoice.taxPercent}%)`}
              value={formatMoney(totals.taxAmount, invoice.currency)}
            />
          ) : null}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "0.55rem",
              padding: "0.75rem 0.9rem",
              borderRadius: 10,
              background: "linear-gradient(135deg, rgba(7,94,229,0.08), rgba(26,143,212,0.08))",
              border: `1px solid ${INVOICE_COLORS.line}`,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Total due</span>
            <span style={{ fontWeight: 800, fontSize: "1.15rem", color: INVOICE_COLORS.accent }}>
              {formatMoney(totals.total, invoice.currency)}
            </span>
          </div>
        </div>
      </div>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1.1rem",
        }}
      >
        <InfoBlock title="Payment details">
          <p style={{ margin: 0 }}>Bank: {COMPANY.bank.name}</p>
          <p style={{ margin: "0.25rem 0 0" }}>Account name: {COMPANY.bank.accountName}</p>
          <p style={{ margin: "0.25rem 0 0" }}>Account number: {COMPANY.bank.accountNumber}</p>
        </InfoBlock>
        <InfoBlock title="Payment terms">
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{invoice.paymentTerms}</p>
        </InfoBlock>
      </section>

      {invoice.notes.trim() ? (
        <InfoBlock title="Notes / additional scope" style={{ marginBottom: "1.1rem" }}>
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{invoice.notes}</p>
        </InfoBlock>
      ) : null}

      <footer
        style={{
          marginTop: "1.25rem",
          paddingTop: "0.9rem",
          borderTop: `1px solid ${INVOICE_COLORS.line}`,
          fontSize: "0.72rem",
          color: "#64748b",
          lineHeight: 1.55,
        }}
      >
        {PROFORMA_DISCLAIMER}
      </footer>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "0.35rem 0.25rem",
        fontSize: "0.88rem",
        color: INVOICE_COLORS.muted,
      }}
    >
      <span>{label}</span>
      <span style={{ color: INVOICE_COLORS.navy, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function InfoBlock({
  title,
  children,
  style,
}: {
  title: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        padding: "0.9rem 1rem",
        borderRadius: 12,
        border: `1px solid ${INVOICE_COLORS.line}`,
        background: "#fff",
        ...style,
      }}
    >
      <p
        style={{
          margin: "0 0 0.45rem",
          fontSize: "0.68rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: INVOICE_COLORS.accent,
        }}
      >
        {title}
      </p>
      <div style={{ fontSize: "0.82rem", color: INVOICE_COLORS.muted, lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}
