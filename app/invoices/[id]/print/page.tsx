import { notFound } from "next/navigation";
import InvoiceDocument from "@/components/invoices/InvoiceDocument";
import InvoicePrintChrome from "@/components/invoices/InvoicePrintChrome";
import { verifyPrintToken } from "@/lib/invoices/auth";
import { getInvoice } from "@/lib/invoices/store";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function InvoicePrintPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { token } = await searchParams;

  if (token) {
    const verified = await verifyPrintToken(token);
    if (!verified || verified.invoiceId !== id) notFound();
  }

  const invoice = await getInvoice(id);
  if (!invoice) notFound();

  return (
    <div className="invoice-print-page min-h-screen bg-[#e8eef7] px-3 py-6 sm:px-6 sm:py-10">
      <InvoicePrintChrome invoiceId={id} showEdit={!token} />
      <InvoiceDocument invoice={invoice} />
    </div>
  );
}
