import { randomUUID } from "node:crypto";
import { ensureInvoiceSchema, getSql } from "./db";
import { InvoiceStorageError } from "./errors";
import { computeInvoiceTotals } from "./currency";
import { formatReceiptNumber, monthKeyFromDate, todayIsoDate } from "./numbering";
import { getInvoice } from "./store";
import type {
  InvoiceClientSnapshot,
  InvoiceCurrency,
  PaymentMethod,
  PaymentReceipt,
} from "./types";

export { PAYMENT_METHODS, isValidPaymentMethod, paymentMethodLabel } from "./payment-methods";

type ReceiptRow = {
  id: string;
  number: string;
  payment_date: string | Date;
  currency: string;
  amount: number | string;
  client_id: string | null;
  client: InvoiceClientSnapshot | string;
  description: string;
  payment_method: string;
  reference: string;
  invoice_id: string | null;
  invoice_number: string;
  notes: string;
  created_by: string;
  created_at: string | Date;
  updated_at: string | Date;
  last_emailed_at: string | Date | null;
};

function emptyClient(): InvoiceClientSnapshot {
  return { name: "", email: "", phone: "", company: "", address: "" };
}

function asIso(value: string | Date | null | undefined): string {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toISOString();
}

function asDateOnly(value: string | Date): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? todayIsoDate() : d.toISOString().slice(0, 10);
}

function parseJson<T>(value: T | string, fallback: T): T {
  if (typeof value !== "string") return (value ?? fallback) as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function mapReceipt(row: ReceiptRow): PaymentReceipt {
  return {
    id: row.id,
    number: row.number,
    paymentDate: asDateOnly(row.payment_date),
    currency: (row.currency || "NGN") as InvoiceCurrency,
    amount: Number(row.amount) || 0,
    clientId: row.client_id,
    client: parseJson(row.client, emptyClient()),
    description: row.description || "",
    paymentMethod: (row.payment_method || "bank_transfer") as PaymentMethod,
    reference: row.reference || "",
    invoiceId: row.invoice_id,
    invoiceNumber: row.invoice_number || "",
    notes: row.notes || "",
    createdBy: row.created_by || "",
    createdAt: asIso(row.created_at),
    updatedAt: asIso(row.updated_at),
    lastEmailedAt: row.last_emailed_at ? asIso(row.last_emailed_at) : null,
  };
}

async function withDb<T>(fn: () => Promise<T>): Promise<T> {
  try {
    await ensureInvoiceSchema();
    return await fn();
  } catch (err) {
    if (err instanceof InvoiceStorageError) throw err;
    const detail = err instanceof Error ? err.message : "unknown error";
    throw new InvoiceStorageError(`Database error: ${detail}`);
  }
}

export async function listReceipts(): Promise<PaymentReceipt[]> {
  return withDb(async () => {
    const sql = getSql();
    const rows = (await sql`SELECT * FROM receipts ORDER BY updated_at DESC`) as ReceiptRow[];
    return rows.map(mapReceipt);
  });
}

export async function getReceipt(id: string): Promise<PaymentReceipt | null> {
  return withDb(async () => {
    const sql = getSql();
    const rows = (await sql`SELECT * FROM receipts WHERE id = ${id} LIMIT 1`) as ReceiptRow[];
    return rows[0] ? mapReceipt(rows[0]) : null;
  });
}

export async function saveReceipt(receipt: PaymentReceipt): Promise<PaymentReceipt> {
  return withDb(async () => {
    const sql = getSql();
    const next: PaymentReceipt = {
      ...receipt,
      amount: Number.isFinite(receipt.amount) ? Math.max(0, receipt.amount) : 0,
      updatedAt: new Date().toISOString(),
    };

    await sql`
      INSERT INTO receipts (
        id, number, payment_date, currency, amount, client_id, client,
        description, payment_method, reference, invoice_id, invoice_number,
        notes, created_by, created_at, updated_at, last_emailed_at
      ) VALUES (
        ${next.id},
        ${next.number},
        ${next.paymentDate},
        ${next.currency},
        ${next.amount},
        ${next.clientId},
        ${JSON.stringify(next.client)},
        ${next.description},
        ${next.paymentMethod},
        ${next.reference},
        ${next.invoiceId},
        ${next.invoiceNumber},
        ${next.notes},
        ${next.createdBy},
        ${next.createdAt},
        ${next.updatedAt},
        ${next.lastEmailedAt ?? null}
      )
      ON CONFLICT (id) DO UPDATE SET
        payment_date = EXCLUDED.payment_date,
        currency = EXCLUDED.currency,
        amount = EXCLUDED.amount,
        client_id = EXCLUDED.client_id,
        client = EXCLUDED.client,
        description = EXCLUDED.description,
        payment_method = EXCLUDED.payment_method,
        reference = EXCLUDED.reference,
        invoice_id = EXCLUDED.invoice_id,
        invoice_number = EXCLUDED.invoice_number,
        notes = EXCLUDED.notes,
        updated_at = EXCLUDED.updated_at,
        last_emailed_at = EXCLUDED.last_emailed_at
    `;

    return next;
  });
}

export async function deleteReceipt(id: string): Promise<boolean> {
  return withDb(async () => {
    const sql = getSql();
    const rows = (await sql`DELETE FROM receipts WHERE id = ${id} RETURNING id`) as Array<{
      id: string;
    }>;
    return rows.length > 0;
  });
}

async function allocateReceiptNumber(paymentDate: string): Promise<string> {
  const sql = getSql();
  const month = monthKeyFromDate(paymentDate);
  const key = `receipt:${month}`;
  const rows = (await sql`
    INSERT INTO invoice_sequences (year_month, last_seq)
    VALUES (${key}, 1)
    ON CONFLICT (year_month) DO UPDATE
      SET last_seq = invoice_sequences.last_seq + 1
    RETURNING last_seq
  `) as Array<{ last_seq: number }>;
  return formatReceiptNumber(month, Number(rows[0]?.last_seq || 1));
}

/** Creates a new receipt. If `fromInvoiceId` is given, client + amount + description are prefilled. */
export async function createReceipt(
  createdBy: string,
  options: { currency?: InvoiceCurrency; fromInvoiceId?: string } = {}
): Promise<PaymentReceipt> {
  return withDb(async () => {
    const paymentDate = todayIsoDate();
    const number = await allocateReceiptNumber(paymentDate);
    const now = new Date().toISOString();

    const receipt: PaymentReceipt = {
      id: randomUUID(),
      number,
      paymentDate,
      currency: options.currency || "NGN",
      amount: 0,
      clientId: null,
      client: emptyClient(),
      description: "",
      paymentMethod: "bank_transfer",
      reference: "",
      invoiceId: null,
      invoiceNumber: "",
      notes: "",
      createdBy,
      createdAt: now,
      updatedAt: now,
      lastEmailedAt: null,
    };

    if (options.fromInvoiceId) {
      const invoice = await getInvoice(options.fromInvoiceId);
      if (invoice) {
        const totals = computeInvoiceTotals(invoice.lineItems, invoice.taxPercent);
        receipt.currency = invoice.currency;
        receipt.amount = totals.total;
        receipt.clientId = invoice.clientId;
        receipt.client = { ...invoice.client };
        receipt.invoiceId = invoice.id;
        receipt.invoiceNumber = invoice.number;
        receipt.description = invoice.lineItems
          .map((item) => item.title.trim())
          .filter(Boolean)
          .join(", ");
      }
    }

    return saveReceipt(receipt);
  });
}

export type ReceiptUpdateInput = Partial<
  Pick<
    PaymentReceipt,
    | "paymentDate"
    | "currency"
    | "amount"
    | "clientId"
    | "client"
    | "description"
    | "paymentMethod"
    | "reference"
    | "invoiceId"
    | "invoiceNumber"
    | "notes"
    | "lastEmailedAt"
  >
>;

export async function updateReceipt(
  id: string,
  patch: ReceiptUpdateInput
): Promise<PaymentReceipt | null> {
  return withDb(async () => {
    const existing = await getReceipt(id);
    if (!existing) return null;
    return saveReceipt({ ...existing, ...patch });
  });
}
