import { notFound } from "next/navigation";
import ReceiptDocument from "@/components/invoices/ReceiptDocument";
import ReceiptPrintChrome from "@/components/invoices/ReceiptPrintChrome";
import { verifyReceiptPrintToken } from "@/lib/invoices/auth";
import { getReceipt } from "@/lib/invoices/receipts";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function ReceiptPrintPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { token } = await searchParams;

  if (token) {
    const verified = await verifyReceiptPrintToken(token);
    if (!verified || verified.receiptId !== id) notFound();
  }

  const receipt = await getReceipt(id);
  if (!receipt) notFound();

  return (
    <div className="invoice-print-page min-h-screen bg-[#f1ebe3] px-3 py-6 sm:px-6 sm:py-10">
      <ReceiptPrintChrome receiptId={id} showEdit={!token} />
      <ReceiptDocument receipt={receipt} />
    </div>
  );
}
