import { NextRequest, NextResponse } from "next/server";
import { requireInvoiceSession, jsonError } from "@/lib/invoices/api";
import { createReceiptPrintToken } from "@/lib/invoices/auth";
import { COMPANY } from "@/lib/invoices/company";
import { formatCodeAmount } from "@/lib/invoices/currency";
import { formatDisplayDate } from "@/lib/invoices/numbering";
import { getReceipt, paymentMethodLabel, updateReceipt } from "@/lib/invoices/receipts";
import { SITE_URL } from "@/lib/seo";

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID ?? "";
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY ?? "";
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY ?? "";
const EMAILJS_FROM_NAME = process.env.EMAILJS_FROM_NAME ?? "TriumphantHQ";
// Falls back to the invoice template: it renders {{{message_html}}} + {{subject}}, which we fill below.
const EMAILJS_TEMPLATE_ID_RECEIPT =
  process.env.EMAILJS_TEMPLATE_ID_RECEIPT ||
  process.env.EMAILJS_TEMPLATE_ID_INVOICE ||
  process.env.EMAILJS_TEMPLATE_ID ||
  "";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const auth = await requireInvoiceSession();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const receipt = await getReceipt(id);
  if (!receipt) return jsonError("Receipt not found", 404);

  let body: { to?: string; message?: string } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const to = (body.to || receipt.client.email || "").trim();
  if (!to || !to.includes("@")) {
    return jsonError("A valid client email is required");
  }

  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_TEMPLATE_ID_RECEIPT) {
    return jsonError(
      "Email is not configured. Set EMAILJS_SERVICE_ID, EMAILJS_PUBLIC_KEY, and EMAILJS_TEMPLATE_ID_RECEIPT (or EMAILJS_TEMPLATE_ID_INVOICE).",
      503
    );
  }

  const token = await createReceiptPrintToken(receipt.id);
  const base = SITE_URL.replace(/\/$/, "");
  const printUrl = `${base}/invoices/receipts/${receipt.id}/print?token=${encodeURIComponent(token)}`;
  const amount = formatCodeAmount(receipt.amount, receipt.currency);
  const payer = receipt.client.name || receipt.client.company || "there";
  const customMessage = body.message?.trim() || "";
  const subject = `Payment receipt ${receipt.number} — ${COMPANY.legalName}`;

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID_RECEIPT,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PRIVATE_KEY || undefined,
      template_params: {
        to_email: to,
        to_name: payer,
        from_name: EMAILJS_FROM_NAME,
        reply_to: COMPANY.email,
        subject,
        receipt_number: receipt.number,
        receipt_amount: amount,
        payment_date: formatDisplayDate(receipt.paymentDate),
        print_url: printUrl,
        custom_message: customMessage,
        company_name: COMPANY.legalName,
        company_email: COMPANY.email,
        company_phone: COMPANY.phones.join(" · "),
        // Keep invoice_* keys populated so the shared invoice template still reads sensibly
        invoice_number: receipt.number,
        invoice_total: amount,
        issue_date: formatDisplayDate(receipt.paymentDate),
        message_html: buildEmailHtml({
          payer,
          number: receipt.number,
          amount,
          date: formatDisplayDate(receipt.paymentDate),
          method: paymentMethodLabel(receipt.paymentMethod),
          reference: receipt.reference,
          description: receipt.description,
          printUrl,
          customMessage,
        }),
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return jsonError(`Failed to send email${text ? `: ${text.slice(0, 200)}` : ""}`, 502);
  }

  const updated = await updateReceipt(receipt.id, { lastEmailedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true, printUrl, receipt: updated });
}

function buildEmailHtml(input: {
  payer: string;
  number: string;
  amount: string;
  date: string;
  method: string;
  reference: string;
  description: string;
  printUrl: string;
  customMessage: string;
}) {
  const row = (label: string, value: string, bold = false) =>
    value
      ? `<tr><td style="padding:12px 14px;border-top:2px solid #111;font-size:13px">${escapeHtml(label)}</td><td style="padding:12px 14px;border-top:2px solid #111;text-align:right;font-size:13px;${bold ? "font-weight:800" : ""}">${escapeHtml(value)}</td></tr>`
      : "";
  const note = input.customMessage
    ? `<p style="margin:0 0 16px;color:#333;line-height:1.6;font-size:14px">${escapeHtml(input.customMessage)}</p>`
    : "";

  return `
    <div style="font-family:Segoe UI,Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff5e9;padding:28px 26px;color:#111">
      <p style="margin:0 0 4px;text-align:right;font-weight:800;font-size:12px;letter-spacing:0.04em">RECEIPT</p>
      <h1 style="margin:18px 0 16px;font-size:28px;color:#0a9a4a">Payment received!</h1>
      <p style="margin:0 0 16px;line-height:1.6;font-size:14px">Hello ${escapeHtml(input.payer)},<br/>Your payment of ${escapeHtml(input.amount)} to ${escapeHtml(COMPANY.legalName.toUpperCase())} was received successfully. Thank you!</p>
      ${note}
      <table style="width:100%;border-collapse:collapse;border:1.5px solid #111">
        <tr><td style="padding:12px 14px;font-size:13px">Receipt number</td><td style="padding:12px 14px;text-align:right;font-size:13px">${escapeHtml(input.number)}</td></tr>
        ${row("Payment reference", input.reference)}
        ${row("Payment method", input.method)}
        ${row("Payment date", input.date)}
        ${row("Payment for", input.description)}
        ${row("Amount", input.amount, true)}
      </table>
      <p style="margin:24px 0;text-align:center">
        <a href="${escapeHtml(input.printUrl)}" style="display:inline-block;background:#0a9a4a;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600">View / download receipt</a>
      </p>
      <p style="margin:0;text-align:center;color:#555;font-size:11px">© ${escapeHtml(COMPANY.legalName)} · ${escapeHtml(COMPANY.email)} · ${escapeHtml(COMPANY.phones.join(" · "))}</p>
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
