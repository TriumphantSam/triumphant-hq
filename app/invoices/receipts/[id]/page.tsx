import { notFound } from "next/navigation";
import InvoiceDbSetupNotice, {
  toSetupErrorMessage,
} from "@/components/invoices/InvoiceDbSetupNotice";
import ReceiptEditor from "@/components/invoices/ReceiptEditor";
import { getReceipt } from "@/lib/invoices/receipts";
import { listClients } from "@/lib/invoices/store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ReceiptEditPage({ params }: Props) {
  const { id } = await params;

  let receipt;
  try {
    receipt = await getReceipt(id);
  } catch (err) {
    return <InvoiceDbSetupNotice error={toSetupErrorMessage(err)} />;
  }

  if (!receipt) notFound();

  try {
    const clients = await listClients();
    return <ReceiptEditor initialReceipt={receipt} clients={clients} />;
  } catch (err) {
    return <InvoiceDbSetupNotice error={toSetupErrorMessage(err)} />;
  }
}
