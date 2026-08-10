import { NextRequest, NextResponse } from "next/server";
import { requireInvoiceSession, jsonError } from "@/lib/invoices/api";
import { createPrintToken } from "@/lib/invoices/auth";
import { COMPANY } from "@/lib/invoices/company";
import { computeInvoiceTotals, formatMoney } from "@/lib/invoices/currency";
import { formatDisplayDate } from "@/lib/invoices/numbering";
import { getInvoice, updateInvoice } from "@/lib/invoices/store";
import { SITE_URL } from "@/lib/seo";

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID ?? "";
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY ?? "";
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY ?? "";
const EMAILJS_FROM_NAME = process.env.EMAILJS_FROM_NAME ?? "TriumphantHQ";
const EMAILJS_TEMPLATE_ID_INVOICE =
  process.env.EMAILJS_TEMPLATE_ID_INVOICE ||
  process.env.EMAILJS_TEMPLATE_ID ||
  "";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const auth = await requireInvoiceSession();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const invoice = await getInvoice(id);
  if (!invoice) return jsonError("Invoice not found", 404);

  let body: { to?: string; message?: string } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const to = (body.to || invoice.client.email || "").trim();
  if (!to || !to.includes("@")) {
    return jsonError("A valid client email is required");
  }

  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_TEMPLATE_ID_INVOICE) {
    return jsonError(
      "Email is not configured. Set EMAILJS_SERVICE_ID, EMAILJS_PUBLIC_KEY, and EMAILJS_TEMPLATE_ID_INVOICE.",
      503
    );
  }

  const totals = computeInvoiceTotals(invoice.lineItems, invoice.taxPercent);
  const printToken = await createPrintToken(invoice.id);
  const base = SITE_URL.replace(/\/$/, "");
  const printUrl = `${base}/invoices/${invoice.id}/print?token=${encodeURIComponent(printToken)}`;

  const lineSummary = invoice.lineItems
    .filter((item) => item.title.trim())
    .map(
      (item, index) =>
        `${index + 1}. ${item.title} — ${formatMoney(
          item.quantity * item.unitPrice,
          invoice.currency
        )}`
    )
    .join("\n");

  const customMessage = body.message?.trim() || "";

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID_INVOICE,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PRIVATE_KEY || undefined,
      template_params: {
        to_email: to,
        to_name: invoice.client.name || invoice.client.company || "Client",
        from_name: EMAILJS_FROM_NAME,
        reply_to: COMPANY.email,
        invoice_number: invoice.number,
        invoice_total: formatMoney(totals.total, invoice.currency),
        invoice_currency: invoice.currency,
        issue_date: formatDisplayDate(invoice.issueDate),
        valid_until: formatDisplayDate(invoice.validUntil),
        print_url: printUrl,
        line_summary: lineSummary,
        custom_message: customMessage,
        company_name: COMPANY.legalName,
        company_email: COMPANY.email,
        company_phone: COMPANY.phones.join(" · "),
        subject: `Proforma Invoice ${invoice.number} — ${COMPANY.legalName}`,
        message_html: buildEmailHtml({
          clientName: invoice.client.name || invoice.client.company || "there",
          invoiceNumber: invoice.number,
          total: formatMoney(totals.total, invoice.currency),
          issueDate: formatDisplayDate(invoice.issueDate),
          validUntil: formatDisplayDate(invoice.validUntil),
          printUrl,
          lineSummary,
          customMessage,
        }),
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return jsonError(`Failed to send email${text ? `: ${text.slice(0, 200)}` : ""}`, 502);
  }

  const updated = await updateInvoice(invoice.id, {
    status: invoice.status === "draft" ? "sent" : invoice.status,
    lastEmailedAt: new Date().toISOString(),
  });

  return NextResponse.json({
    ok: true,
    printUrl,
    invoice: updated,
  });
}

function buildEmailHtml(input: {
  clientName: string;
  invoiceNumber: string;
  total: string;
  issueDate: string;
  validUntil: string;
  printUrl: string;
  lineSummary: string;
  customMessage: string;
}) {
  const note = input.customMessage
    ? `<p style="margin:16px 0;color:#334155;line-height:1.6">${escapeHtml(input.customMessage)}</p>`
    : "";

  return `
    <div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0a1220">
      <p style="color:#075ee5;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;font-size:12px;margin:0 0 12px">Proforma Invoice</p>
      <h1 style="font-size:22px;margin:0 0 12px;color:#0a1220">Invoice ${escapeHtml(input.invoiceNumber)}</h1>
      <p style="margin:0 0 16px;color:#4a5568;line-height:1.6">Hello ${escapeHtml(input.clientName)},</p>
      <p style="margin:0 0 16px;color:#4a5568;line-height:1.6">Please find your proforma invoice from ${escapeHtml(COMPANY.legalName)}.</p>
      ${note}
      <table style="width:100%;border-collapse:collapse;margin:20px 0;background:#f4f7fb;border-radius:12px">
        <tr><td style="padding:12px 16px;color:#64748b;font-size:13px">Total</td><td style="padding:12px 16px;text-align:right;font-weight:700;color:#075ee5">${escapeHtml(input.total)}</td></tr>
        <tr><td style="padding:12px 16px;color:#64748b;font-size:13px">Issue date</td><td style="padding:12px 16px;text-align:right">${escapeHtml(input.issueDate)}</td></tr>
        <tr><td style="padding:12px 16px;color:#64748b;font-size:13px">Valid until</td><td style="padding:12px 16px;text-align:right">${escapeHtml(input.validUntil)}</td></tr>
      </table>
      <pre style="white-space:pre-wrap;font-family:Segoe UI,Arial,sans-serif;background:#fff;border:1px solid #d8e2f0;border-radius:10px;padding:14px;color:#334155;font-size:13px;line-height:1.55">${escapeHtml(input.lineSummary || "—")}</pre>
      <p style="margin:24px 0">
        <a href="${escapeHtml(input.printUrl)}" style="display:inline-block;background:#075ee5;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:600">View / download invoice</a>
      </p>
      <p style="margin:24px 0 0;color:#6b778c;font-size:12px;line-height:1.5">${escapeHtml(COMPANY.legalName)} · ${escapeHtml(COMPANY.email)} · ${escapeHtml(COMPANY.phones.join(" · "))}</p>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
