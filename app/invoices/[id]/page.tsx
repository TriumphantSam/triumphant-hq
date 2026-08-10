import { notFound } from "next/navigation";
import InvoiceEditor from "@/components/invoices/InvoiceEditor";
import InvoiceDbSetupNotice, {
  toSetupErrorMessage,
} from "@/components/invoices/InvoiceDbSetupNotice";
import { getInvoice, listClients, listTemplates } from "@/lib/invoices/store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function InvoiceEditPage({ params }: Props) {
  const { id } = await params;

  let invoice;
  try {
    invoice = await getInvoice(id);
  } catch (err) {
    return <InvoiceDbSetupNotice error={toSetupErrorMessage(err)} />;
  }

  if (!invoice) notFound();

  try {
    const [clients, templates] = await Promise.all([listClients(), listTemplates()]);
    return (
      <InvoiceEditor
        initialInvoice={invoice}
        clients={clients}
        templates={templates}
      />
    );
  } catch (err) {
    return <InvoiceDbSetupNotice error={toSetupErrorMessage(err)} />;
  }
}
