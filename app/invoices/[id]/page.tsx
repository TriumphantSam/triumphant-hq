import { notFound } from "next/navigation";
import InvoiceEditor from "@/components/invoices/InvoiceEditor";
import { getInvoice, listClients, listTemplates } from "@/lib/invoices/store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function InvoiceEditPage({ params }: Props) {
  const { id } = await params;
  const invoice = getInvoice(id);
  if (!invoice) notFound();

  return (
    <InvoiceEditor
      initialInvoice={invoice}
      clients={listClients()}
      templates={listTemplates()}
    />
  );
}
