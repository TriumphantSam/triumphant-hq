import { NextRequest, NextResponse } from "next/server";
import { requireInvoiceSession, jsonError } from "@/lib/invoices/api";
import { createBlankInvoice, listInvoices, InvoiceStorageError } from "@/lib/invoices/store";
import { computeInvoiceTotals } from "@/lib/invoices/currency";
import type { InvoiceCurrency } from "@/lib/invoices/types";

function storageOrUnknownError(err: unknown) {
  if (err instanceof InvoiceStorageError) {
    return NextResponse.json({ error: err.message }, { status: 503 });
  }
  console.error("[invoices]", err);
  return NextResponse.json(
    { error: err instanceof Error ? err.message : "Unexpected server error" },
    { status: 500 }
  );
}

export async function GET() {
  try {
    const auth = await requireInvoiceSession();
    if (!auth.ok) return auth.response;

    const invoices = (await listInvoices()).map((inv) => ({
      ...inv,
      totals: computeInvoiceTotals(inv.lineItems, inv.taxPercent),
    }));

    return NextResponse.json({ invoices });
  } catch (err) {
    return storageOrUnknownError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const invoice = await createBlankInvoice(auth.session.userId, currency);
    return NextResponse.json({ invoice }, { status: 201 });
  } catch (err) {
    return storageOrUnknownError(err);
  }
}
