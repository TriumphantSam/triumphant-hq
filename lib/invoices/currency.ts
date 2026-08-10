import type { InvoiceCurrency } from "./types";

export const CURRENCIES: {
  code: InvoiceCurrency;
  label: string;
  symbol: string;
  locale: string;
}[] = [
  { code: "NGN", label: "Nigerian Naira", symbol: "₦", locale: "en-NG" },
  { code: "USD", label: "US Dollar", symbol: "$", locale: "en-US" },
  { code: "GBP", label: "British Pound", symbol: "£", locale: "en-GB" },
  { code: "EUR", label: "Euro", symbol: "€", locale: "de-DE" },
];

export function getCurrencyMeta(code: InvoiceCurrency) {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

export function formatMoney(amount: number, currency: InvoiceCurrency): string {
  const meta = getCurrencyMeta(currency);
  try {
    return new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${meta.symbol}${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

export function lineItemAmount(quantity: number, unitPrice: number): number {
  return roundMoney(quantity * unitPrice);
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function computeInvoiceTotals(
  lineItems: { quantity: number; unitPrice: number }[],
  taxPercent = 0
) {
  const subtotal = roundMoney(
    lineItems.reduce((sum, item) => sum + lineItemAmount(item.quantity, item.unitPrice), 0)
  );
  const taxAmount = roundMoney(subtotal * (Math.max(0, taxPercent) / 100));
  const total = roundMoney(subtotal + taxAmount);
  return { subtotal, taxAmount, total };
}
