import TemplatesManager from "@/components/invoices/TemplatesManager";
import { listTemplates } from "@/lib/invoices/store";

export const dynamic = "force-dynamic";

export default function TemplatesPage() {
  return <TemplatesManager initialTemplates={listTemplates()} />;
}
