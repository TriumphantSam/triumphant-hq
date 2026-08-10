import TemplatesManager from "@/components/invoices/TemplatesManager";
import InvoiceDbSetupNotice, {
  toSetupErrorMessage,
} from "@/components/invoices/InvoiceDbSetupNotice";
import { listTemplates } from "@/lib/invoices/store";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  try {
    return <TemplatesManager initialTemplates={await listTemplates()} />;
  } catch (err) {
    return <InvoiceDbSetupNotice error={toSetupErrorMessage(err)} />;
  }
}
