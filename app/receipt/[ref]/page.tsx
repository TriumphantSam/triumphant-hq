import ReceiptView from "@/components/automation/ReceiptView";
export const metadata = {
  title: "Test payment receipt | TriumphantTech",
  robots: { index: false, follow: false },
};
export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  return <ReceiptView reference={ref} />;
}
