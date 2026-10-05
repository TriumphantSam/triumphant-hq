import ReceiptDashboard from "@/components/invoices/ReceiptDashboard";
import InvoiceDbSetupNotice, {
  toSetupErrorMessage,
} from "@/components/invoices/InvoiceDbSetupNotice";
import { listReceipts } from "@/lib/invoices/receipts";

export const dynamic = "force-dynamic";

export default async function ReceiptsPage() {
  try {
    const receipts = await listReceipts();
    return <ReceiptDashboard receipts={receipts} />;
  } catch (err) {
    return <InvoiceDbSetupNotice error={toSetupErrorMessage(err)} />;
  }
}
