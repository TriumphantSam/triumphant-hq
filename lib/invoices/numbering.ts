import { addDays, format, parseISO } from "date-fns";
import { DEFAULT_VALIDITY_DAYS } from "./company";
import type { InvoiceSequenceStore } from "./types";

export function monthKeyFromDate(isoDate: string): string {
  const d = parseISO(isoDate);
  return format(d, "yyyy-MM");
}

export function formatInvoiceNumber(yearMonth: string, sequence: number): string {
  const [year, month] = yearMonth.split("-");
  return `THQ-PF-${year}-${month}-${String(sequence).padStart(3, "0")}`;
}

export function nextInvoiceNumber(
  store: InvoiceSequenceStore,
  issueDate: string
): { number: string; nextStore: InvoiceSequenceStore } {
  const key = monthKeyFromDate(issueDate);
  const nextSeq = (store.months[key] ?? 0) + 1;
  return {
    number: formatInvoiceNumber(key, nextSeq),
    nextStore: {
      months: {
        ...store.months,
        [key]: nextSeq,
      },
    },
  };
}

export function defaultValidUntil(issueDate: string, days = DEFAULT_VALIDITY_DAYS): string {
  return format(addDays(parseISO(issueDate), days), "yyyy-MM-dd");
}

export function todayIsoDate(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatDisplayDate(isoDate: string): string {
  try {
    return format(parseISO(isoDate), "d MMMM yyyy");
  } catch {
    return isoDate;
  }
}
