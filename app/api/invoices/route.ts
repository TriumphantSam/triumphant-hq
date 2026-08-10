import { NextRequest, NextResponse } from "next/server";
import { requireInvoiceSession, jsonError } from "@/lib/invoices/api";
import { createBlankInvoice, listInvoices } from "@/lib/invoices/store";
import { computeInvoiceTotals } from "@/lib/invoices/currency";
import type { InvoiceCurrency } from "@/lib/invoices/types";

export async function GET() {
  const auth = await requireInvoiceSession();
  if (!auth.ok) return auth.response;

  const invoices = listInvoices().map((inv) => {
    const totals = computeInvoiceTotals(inv.lineItems, inv.taxPercent);
    return {
      ...inv,
      totals,
    };
  });

  return NextResponse.json({ invoices });
}

export async function POST(request: NextRequest) {
  const auth = await requireInvoiceSession();
  if (!auth.ok) return auth.response;

  let body: { currency?: InvoiceCurrency } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const currency = (body.currency || "NGN") as InvoiceCurrency;
  if (!["NGN", "USD", "GBP", "EUR"].includes(currency)) {
    return jsonError("Invalid currency");
  }

  const invoice = createBlankInvoice(auth.session.userId, currency);
  return NextResponse.json({ invoice }, { status: 201 });
}
