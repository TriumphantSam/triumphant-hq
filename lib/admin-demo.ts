// Fictional scenarios for the public lab. Never import private report data here.
export type DemoSale = {
  id: string;
  product: string;
  quantity: number;
  amountKobo: number;
};
export const demoProducts = [
  {
    id: "handbook",
    name: "Sample handbook",
    priceKobo: 350000,
    stock: 4,
    threshold: 2,
  },
  {
    id: "workbook",
    name: "Sample workbook",
    priceKobo: 200000,
    stock: 8,
    threshold: 3,
  },
] as const;
export function demoSummary(sales: DemoSale[]) {
  const unique = [...new Map(sales.map((sale) => [sale.id, sale])).values()];
  return {
    paidKobo: unique.reduce((sum, sale) => sum + sale.amountKobo, 0),
    paidOrders: unique.length,
    products: demoProducts.map((product) => ({
      ...product,
      stock: Math.max(
        0,
        product.stock -
          unique
            .filter((sale) => sale.product === product.id)
            .reduce((sum, sale) => sum + sale.quantity, 0),
      ),
    })),
  };
}
export const formatNaira = (kobo: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);
export function demoReport(sales: DemoSale[]) {
  const summary = demoSummary(sales);
  const low = summary.products.filter(
    (product) => product.stock <= product.threshold,
  );
  return [
    "SAMPLE DATA — Automation Lab report",
    "Fictional scenario; not TriumphantTech business results.",
    "New enquiries: 6",
    "Consultations booked: 3",
    `Paid sample orders: ${summary.paidOrders}`,
    `Sample payments: ${formatNaira(summary.paidKobo)}`,
    "Unpaid sample invoices: 2 (₦25,000)",
    `Stock alerts: ${low.length ? low.map((product) => `${product.name}: ${product.stock} left`).join("; ") : "None"}`,
    "Social drafts: awaiting owner approval; nothing published.",
  ].join("\n");
}
