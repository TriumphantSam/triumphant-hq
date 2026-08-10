import { NextRequest, NextResponse } from "next/server";
import { requireInvoiceSession, jsonError } from "@/lib/invoices/api";
import { deleteClient, listClients, saveClient } from "@/lib/invoices/store";

export async function GET() {
  const auth = await requireInvoiceSession();
  if (!auth.ok) return auth.response;
  return NextResponse.json({ clients: listClients() });
}

export async function POST(request: NextRequest) {
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

  const client = saveClient({
    id: body.id,
    name: body.name || "",
    email: body.email || "",
    phone: body.phone || "",
    company: body.company || "",
    address: body.address || "",
  });

  return NextResponse.json({ client }, { status: body.id ? 200 : 201 });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireInvoiceSession();
  if (!auth.ok) return auth.response;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return jsonError("id is required");
  const ok = deleteClient(id);
  if (!ok) return jsonError("Client not found", 404);
  return NextResponse.json({ ok: true });
}
