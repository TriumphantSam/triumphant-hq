import type { PaymentMethod } from "./types";

/** Client-safe (no Node imports) so the editor + document can use it too. */
export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "cash", label: "Cash" },
  { value: "pos", label: "POS" },
  { value: "card", label: "Card" },
  { value: "online", label: "Online payment" },
  { value: "other", label: "Other" },
];

export function isValidPaymentMethod(value: string): value is PaymentMethod {
  return PAYMENT_METHODS.some((m) => m.value === value);
}

export function paymentMethodLabel(value: PaymentMethod): string {
  return PAYMENT_METHODS.find((m) => m.value === value)?.label ?? "Other";
}
