import { NextRequest, NextResponse } from "next/server";
import { requireInvoiceSession, jsonError } from "@/lib/invoices/api";
import {
  deleteClient,
  listClients,
  saveClient,
  InvoiceStorageError,
} from "@/lib/invoices/store";

function storageOrUnknownError(err: unknown) {
  if (err instanceof InvoiceStorageError) {
    return NextResponse.json({ error: err.message }, { status: 503 });
  }
  console.error("[invoices/clients]", err);
  return NextResponse.json(
    { error: err instanceof Error ? err.message : "Unexpected server error" },
    { status: 500 }
  );
}

export async function GET() {
  try {
    const auth = await requireInvoiceSession();
    if (!auth.ok) return auth.response;
    return NextResponse.json({ clients: await listClients() });
  } catch (err) {
    return storageOrUnknownError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireInvoiceSession();
    if (!auth.ok) return auth.response;

    let body: {
      id?: string;
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
      address?: string;
    };
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON");
    }

    if (!body.name?.trim()) return jsonError("Client name is required");

    const client = await saveClient({
      id: body.id,
      name: body.name || "",
      email: body.email || "",
      phone: body.phone || "",
      company: body.company || "",
      address: body.address || "",
    });

    return NextResponse.json({ client }, { status: body.id ? 200 : 201 });
  } catch (err) {
    return storageOrUnknownError(err);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireInvoiceSession();
    if (!auth.ok) return auth.response;

    const id = request.nextUrl.searchParams.get("id");
    if (!id) return jsonError("id is required");
    const ok = await deleteClient(id);
    if (!ok) return jsonError("Client not found", 404);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return storageOrUnknownError(err);
  }
}
