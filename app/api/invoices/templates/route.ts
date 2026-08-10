import { NextRequest, NextResponse } from "next/server";
import { requireInvoiceSession, jsonError } from "@/lib/invoices/api";
import { deleteTemplate, listTemplates, saveTemplate } from "@/lib/invoices/store";
import type { InvoiceCurrency } from "@/lib/invoices/types";

export async function GET() {
  const auth = await requireInvoiceSession();
  if (!auth.ok) return auth.response;
  return NextResponse.json({ templates: listTemplates() });
}

export async function POST(request: NextRequest) {
  const auth = await requireInvoiceSession();
  if (!auth.ok) return auth.response;

  let body: {
    id?: string;
    name?: string;
    title?: string;
    quantity?: number;
    unitPrice?: number;
    currency?: InvoiceCurrency;
    details?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON");
  }

  if (!body.name?.trim() || !body.title?.trim()) {
    return jsonError("Template name and title are required");
  }

  const currency = (body.currency || "NGN") as InvoiceCurrency;
  if (!["NGN", "USD", "GBP", "EUR"].includes(currency)) {
    return jsonError("Invalid currency");
  }

  const template = saveTemplate({
    id: body.id,
    name: body.name,
    title: body.title,
    quantity: typeof body.quantity === "number" ? body.quantity : 1,
    unitPrice: typeof body.unitPrice === "number" ? body.unitPrice : 0,
    currency,
    details: Array.isArray(body.details) ? body.details : [],
  });

  return NextResponse.json({ template }, { status: body.id ? 200 : 201 });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireInvoiceSession();
  if (!auth.ok) return auth.response;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return jsonError("id is required");
  const ok = deleteTemplate(id);
  if (!ok) return jsonError("Template not found", 404);
  return NextResponse.json({ ok: true });
}
