import type { Metadata } from "next";
import { cookies } from "next/headers";
import InvoiceShell from "@/components/invoices/InvoiceShell";
import { INVOICE_SESSION_COOKIE, verifySessionToken } from "@/lib/invoices/auth";
import "./invoices.css";

export const metadata: Metadata = {
  title: "Proforma Invoices",
  robots: { index: false, follow: false },
};

export default async function InvoicesLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const session = await verifySessionToken(jar.get(INVOICE_SESSION_COOKIE)?.value);

  return <InvoiceShell userName={session?.name}>{children}</InvoiceShell>;
}
