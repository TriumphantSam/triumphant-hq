import { NextRequest, NextResponse } from "next/server";
import { requireInvoiceSession, jsonError } from "@/lib/invoices/api";
import {
  deleteInvoice,
  duplicateInvoice,
  getInvoice,
  updateInvoice,
  isValidStatus,
  InvoiceStorageError,
} from "@/lib/invoices/store";
import { computeInvoiceTotals } from "@/lib/invoices/currency";
import { defaultValidUntil } from "@/lib/invoices/numbering";
import type { InvoiceCurrency, InvoiceLineItem, InvoiceClientSnapshot } from "@/lib/invoices/types";

type Params = { params: Promise<{ id: string }> };

function storageOrUnknownError(err: unknown) {
  if (err instanceof InvoiceStorageError) {
    return NextResponse.json({ error: err.message }, { status: 503 });
  }
  console.error("[invoices/id]", err);
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
    const invoice = await getInvoice(id);
    if (!invoice) return jsonError("Invoice not found", 404);

    return NextResponse.json({
      invoice: {
        ...invoice,
        totals: computeInvoiceTotals(invoice.lineItems, invoice.taxPercent),
      },
    });
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

    if (body.status && typeof body.status === "string" && !isValidStatus(body.status)) {
      return jsonError("Invalid status");
    }

    if (body.currency && !["NGN", "USD", "GBP", "EUR"].includes(body.currency as string)) {
      return jsonError("Invalid currency");
    }

    const patch: Parameters<typeof updateInvoice>[1] = {};
    if (typeof body.issueDate === "string") patch.issueDate = body.issueDate;
    if (typeof body.validUntil === "string") patch.validUntil = body.validUntil;
    if (typeof body.currency === "string") patch.currency = body.currency as InvoiceCurrency;
    if (typeof body.status === "string") {
      patch.status = body.status as Parameters<typeof updateInvoice>[1]["status"];
    }
    if (body.clientId === null || typeof body.clientId === "string") {
      patch.clientId = body.clientId as string | null;
    }
    if (body.client && typeof body.client === "object") {
      patch.client = body.client as InvoiceClientSnapshot;
    }
    if (Array.isArray(body.lineItems)) {
      patch.lineItems = body.lineItems as InvoiceLineItem[];
    }
    if (typeof body.notes === "string") patch.notes = body.notes;
    if (typeof body.paymentTerms === "string") patch.paymentTerms = body.paymentTerms;
    if (typeof body.taxPercent === "number") patch.taxPercent = body.taxPercent;

    if (patch.issueDate && !patch.validUntil) {
      patch.validUntil = defaultValidUntil(patch.issueDate);
    }

    const invoice = await updateInvoice(id, patch);
    if (!invoice) return jsonError("Invoice not found", 404);

    return NextResponse.json({
      invoice: {
        ...invoice,
        totals: computeInvoiceTotals(invoice.lineItems, invoice.taxPercent),
      },
    });
  } catch (err) {
    return storageOrUnknownError(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const auth = await requireInvoiceSession();
    if (!auth.ok) return auth.response;

    const { id } = await params;
    const ok = await deleteInvoice(id);
    if (!ok) return jsonError("Invoice not found", 404);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return storageOrUnknownError(err);
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireInvoiceSession();
    if (!auth.ok) return auth.response;

    const { id } = await params;
    let body: { action?: string } = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    if (body.action === "duplicate") {
      const invoice = await duplicateInvoice(id, auth.session.userId);
      if (!invoice) return jsonError("Invoice not found", 404);
      return NextResponse.json({ invoice }, { status: 201 });
    }

    return jsonError("Unknown action");
  } catch (err) {
    return storageOrUnknownError(err);
  }
}
