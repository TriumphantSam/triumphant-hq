import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { INVOICE_SESSION_COOKIE, verifySessionToken } from "./auth";
import type { InvoiceSessionPayload } from "./types";

export async function requireInvoiceSession(): Promise<
  | { ok: true; session: InvoiceSessionPayload }
  | { ok: false; response: NextResponse }
> {
  const jar = await cookies();
  const token = jar.get(INVOICE_SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true, session };
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
