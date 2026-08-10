import ClientsManager from "@/components/invoices/ClientsManager";
import InvoiceDbSetupNotice, {
  toSetupErrorMessage,
} from "@/components/invoices/InvoiceDbSetupNotice";
import { listClients } from "@/lib/invoices/store";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  try {
    return <ClientsManager initialClients={await listClients()} />;
  } catch (err) {
    return <InvoiceDbSetupNotice error={toSetupErrorMessage(err)} />;
  }
}
