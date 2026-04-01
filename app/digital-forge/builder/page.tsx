import { getForgeBuilderProducts } from "@/lib/digital-forge";
import ApprovalQueueDashboard from "./ApprovalQueueDashboard";

export const metadata = {
  title: "Approval Queue & Launch Dashboard | Digital Forge",
  description: "Internal editorial review queue, approval workflow, and distribution monitor for Digital Forge products.",
  robots: { index: false, follow: false },
};

export default async function DigitalForgeBuilderPage() {
  const products = await getForgeBuilderProducts();
  return <ApprovalQueueDashboard products={products} />;
}
