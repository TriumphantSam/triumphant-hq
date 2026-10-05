import { NextRequest, NextResponse } from "next/server";
import { requireInvoiceSession, jsonError } from "@/lib/invoices/api";
import { InvoiceStorageError } from "@/lib/invoices/errors";
import {
  deleteReceipt,
  getReceipt,
  isValidPaymentMethod,
  updateReceipt,
  type ReceiptUpdateInput,
} from "@/lib/invoices/receipts";
import type { InvoiceClientSnapshot, InvoiceCurrency, PaymentMethod } from "@/lib/invoices/types";

type Params = { params: Promise<{ id: string }> };

function storageOrUnknownError(err: unknown) {
  if (err instanceof InvoiceStorageError) {
    return NextResponse.json({ error: err.message }, { status: 503 });
  }
  console.error("[receipts/id]", err);
  return NextResponse.json(
    { error: err instanceof Error ? err.message : "Unexpected server error" },
    { status: 500 }
  );
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const auth = await requireInvoiceSession();
    if (!auth.ok) return auth.response;
    const { id } = await params;
    const receipt = await getReceipt(id);
    if (!receipt) return jsonError("Receipt not found", 404);
    return NextResponse.json({ receipt });
  } catch (err) {
    return storageOrUnknownError(err);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireInvoiceSession();
    if (!auth.ok) return auth.response;

    const { id } = await params;
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON");
    }

    if (body.currency && !["NGN", "USD", "GBP", "EUR"].includes(body.currency as string)) {
      return jsonError("Invalid currency");
    }
    if (typeof body.paymentMethod === "string" && !isValidPaymentMethod(body.paymentMethod)) {
      return jsonError("Invalid payment method");
    }

    const patch: ReceiptUpdateInput = {};
    if (typeof body.paymentDate === "string" && body.paymentDate) patch.paymentDate = body.paymentDate;
    if (typeof body.currency === "string") patch.currency = body.currency as InvoiceCurrency;
    if (typeof body.amount === "number") patch.amount = body.amount;
    if (body.clientId === null || typeof body.clientId === "string") {
      patch.clientId = body.clientId as string | null;
    }
    if (body.client && typeof body.client === "object") {
      patch.client = body.client as InvoiceClientSnapshot;
    }
    if (typeof body.description === "string") patch.description = body.description;
    if (typeof body.paymentMethod === "string") patch.paymentMethod = body.paymentMethod as PaymentMethod;
    if (typeof body.reference === "string") patch.reference = body.reference.trim();
    if (typeof body.invoiceNumber === "string") patch.invoiceNumber = body.invoiceNumber.trim();
    if (typeof body.notes === "string") patch.notes = body.notes;

    const receipt = await updateReceipt(id, patch);
    if (!receipt) return jsonError("Receipt not found", 404);
    return NextResponse.json({ receipt });
  } catch (err) {
    return storageOrUnknownError(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const auth = await requireInvoiceSession();
    if (!auth.ok) return auth.response;
    const { id } = await params;
    const ok = await deleteReceipt(id);
    if (!ok) return jsonError("Receipt not found", 404);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return storageOrUnknownError(err);
  }
}
