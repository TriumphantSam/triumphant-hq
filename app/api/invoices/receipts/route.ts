import { NextRequest, NextResponse } from "next/server";
import { requireInvoiceSession, jsonError } from "@/lib/invoices/api";
import { InvoiceStorageError } from "@/lib/invoices/errors";
import { createReceipt, listReceipts } from "@/lib/invoices/receipts";
import type { InvoiceCurrency } from "@/lib/invoices/types";

function storageOrUnknownError(err: unknown) {
  if (err instanceof InvoiceStorageError) {
    return NextResponse.json({ error: err.message }, { status: 503 });
  }
  console.error("[receipts]", err);
  return NextResponse.json(
    { error: err instanceof Error ? err.message : "Unexpected server error" },
    { status: 500 }
  );
}

export async function GET() {
  try {
    const auth = await requireInvoiceSession();
    if (!auth.ok) return auth.response;
    return NextResponse.json({ receipts: await listReceipts() });
  } catch (err) {
    return storageOrUnknownError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireInvoiceSession();
    if (!auth.ok) return auth.response;

    let body: { currency?: InvoiceCurrency; fromInvoiceId?: string } = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const currency = (body.currency || "NGN") as InvoiceCurrency;
    if (!["NGN", "USD", "GBP", "EUR"].includes(currency)) {
      return jsonError("Invalid currency");
    }

    const receipt = await createReceipt(auth.session.userId, {
      currency,
      fromInvoiceId: typeof body.fromInvoiceId === "string" ? body.fromInvoiceId : undefined,
    });
    return NextResponse.json({ receipt }, { status: 201 });
  } catch (err) {
    return storageOrUnknownError(err);
  }
}
