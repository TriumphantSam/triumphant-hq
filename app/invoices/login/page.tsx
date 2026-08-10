import { Suspense } from "react";
import InvoiceLoginForm from "@/components/invoices/InvoiceLoginForm";

export default function InvoiceLoginPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center text-slate-500">Loading…</div>}>
      <InvoiceLoginForm />
    </Suspense>
  );
}
