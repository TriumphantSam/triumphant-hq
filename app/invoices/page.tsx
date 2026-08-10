import InvoiceDashboard from "@/components/invoices/InvoiceDashboard";
import InvoiceDbSetupNotice, {
  toSetupErrorMessage,
} from "@/components/invoices/InvoiceDbSetupNotice";
import { computeInvoiceTotals } from "@/lib/invoices/currency";
import { listInvoices } from "@/lib/invoices/store";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  try {
    const invoices = (await listInvoices()).map((inv) => ({
      ...inv,
      totals: computeInvoiceTotals(inv.lineItems, inv.taxPercent),
    }));
    return <InvoiceDashboard invoices={invoices} />;
  } catch (err) {
    return <InvoiceDbSetupNotice error={toSetupErrorMessage(err)} />;
  }
}
