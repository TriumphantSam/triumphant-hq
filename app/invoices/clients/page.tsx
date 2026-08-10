import ClientsManager from "@/components/invoices/ClientsManager";
import { listClients } from "@/lib/invoices/store";

export const dynamic = "force-dynamic";

export default function ClientsPage() {
  return <ClientsManager initialClients={listClients()} />;
}
