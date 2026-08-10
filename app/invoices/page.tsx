import InvoiceDashboard from "@/components/invoices/InvoiceDashboard";
import { computeInvoiceTotals } from "@/lib/invoices/currency";
import { listInvoices } from "@/lib/invoices/store";

export const dynamic = "force-dynamic";

export default function InvoicesPage() {
  const invoices = listInvoices().map((inv) => ({
    ...inv,
    totals: computeInvoiceTotals(inv.lineItems, inv.taxPercent),
  }));

  return <InvoiceDashboard invoices={invoices} />;
}
