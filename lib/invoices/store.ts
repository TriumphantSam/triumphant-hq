import { randomUUID } from "node:crypto";
import { DEFAULT_PAYMENT_TERMS } from "./company";
import { ensureInvoiceSchema, getSql } from "./db";
import { InvoiceStorageError } from "./errors";
import { defaultValidUntil, formatInvoiceNumber, monthKeyFromDate, todayIsoDate } from "./numbering";
import { SEED_TEMPLATES } from "./seed-templates";
import type {
  InvoiceClient,
  InvoiceClientSnapshot,
  InvoiceCurrency,
  InvoiceLineItem,
  InvoiceStatus,
  LineItemTemplate,
  ProformaInvoice,
} from "./types";

export { InvoiceStorageError };

type InvoiceRow = {
  id: string;
  number: string;
  issue_date: string;
  valid_until: string;
  currency: string;
  status: string;
  client_id: string | null;
  client: InvoiceClientSnapshot | string;
  line_items: InvoiceLineItem[] | string;
  notes: string;
  payment_terms: string;
  tax_percent: number | string;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_emailed_at: string | null;
};

type ClientRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  created_at: string;
  updated_at: string;
};

type TemplateRow = {
  id: string;
  name: string;
  title: string;
  quantity: number | string;
  unit_price: number | string;
  currency: string;
  details: string[] | string;
  created_at: string;
  updated_at: string;
};

function emptyClientSnapshot(): InvoiceClientSnapshot {
  return { name: "", email: "", phone: "", company: "", address: "" };
}

function asIso(value: string | Date | null | undefined): string {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString();
  // date-only from Postgres often comes as YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toISOString();
}

function asDateOnly(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
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

function mapInvoice(row: InvoiceRow): ProformaInvoice {
  return {
    id: row.id,
    number: row.number,
    issueDate: asDateOnly(row.issue_date),
    validUntil: asDateOnly(row.valid_until),
    currency: row.currency as InvoiceCurrency,
    status: row.status as InvoiceStatus,
    clientId: row.client_id,
    client: parseJson(row.client, emptyClientSnapshot()),
    lineItems: parseJson(row.line_items, []),
    notes: row.notes || "",
    paymentTerms: row.payment_terms || "",
    taxPercent: Number(row.tax_percent) || 0,
    createdBy: row.created_by || "",
    createdAt: asIso(row.created_at),
    updatedAt: asIso(row.updated_at),
    lastEmailedAt: row.last_emailed_at ? asIso(row.last_emailed_at) : null,
  };
}

function mapClient(row: ClientRow): InvoiceClient {
  return {
    id: row.id,
    name: row.name || "",
    email: row.email || "",
    phone: row.phone || "",
    company: row.company || "",
    address: row.address || "",
    createdAt: asIso(row.created_at),
    updatedAt: asIso(row.updated_at),
  };
}

function mapTemplate(row: TemplateRow): LineItemTemplate {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    quantity: Number(row.quantity) || 0,
    unitPrice: Number(row.unit_price) || 0,
    currency: (row.currency || "NGN") as InvoiceCurrency,
    details: parseJson(row.details, []),
    createdAt: asIso(row.created_at),
    updatedAt: asIso(row.updated_at),
  };
}

function normalizeLineItem(item: InvoiceLineItem): InvoiceLineItem {
  return {
    id: item.id || randomUUID(),
    title: item.title?.trim() || "",
    quantity: Number.isFinite(item.quantity) ? Math.max(0, item.quantity) : 0,
    unitPrice: Number.isFinite(item.unitPrice) ? Math.max(0, item.unitPrice) : 0,
    details: (item.details || []).map((d) => d.trim()).filter((d, i, arr) => d || arr.length === 1),
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

export async function listInvoices(): Promise<ProformaInvoice[]> {
  return withDb(async () => {
    const sql = getSql();
    const rows = (await sql`
      SELECT * FROM invoices
      ORDER BY updated_at DESC
    `) as InvoiceRow[];
    return rows.map(mapInvoice);
  });
}

export async function getInvoice(id: string): Promise<ProformaInvoice | null> {
  return withDb(async () => {
    const sql = getSql();
    const rows = (await sql`
      SELECT * FROM invoices WHERE id = ${id} LIMIT 1
    `) as InvoiceRow[];
    return rows[0] ? mapInvoice(rows[0]) : null;
  });
}

export async function saveInvoice(invoice: ProformaInvoice): Promise<ProformaInvoice> {
  return withDb(async () => {
    const sql = getSql();
    const updatedAt = new Date().toISOString();
    const next: ProformaInvoice = {
      ...invoice,
      lineItems: invoice.lineItems.map(normalizeLineItem),
      updatedAt,
    };

    await sql`
      INSERT INTO invoices (
        id, number, issue_date, valid_until, currency, status,
        client_id, client, line_items, notes, payment_terms, tax_percent,
        created_by, created_at, updated_at, last_emailed_at
      ) VALUES (
        ${next.id},
        ${next.number},
        ${next.issueDate},
        ${next.validUntil},
        ${next.currency},
        ${next.status},
        ${next.clientId},
        ${JSON.stringify(next.client)},
        ${JSON.stringify(next.lineItems)},
        ${next.notes},
        ${next.paymentTerms},
        ${next.taxPercent},
        ${next.createdBy},
        ${next.createdAt},
        ${next.updatedAt},
        ${next.lastEmailedAt ?? null}
      )
      ON CONFLICT (id) DO UPDATE SET
        number = EXCLUDED.number,
        issue_date = EXCLUDED.issue_date,
        valid_until = EXCLUDED.valid_until,
        currency = EXCLUDED.currency,
        status = EXCLUDED.status,
        client_id = EXCLUDED.client_id,
        client = EXCLUDED.client,
        line_items = EXCLUDED.line_items,
        notes = EXCLUDED.notes,
        payment_terms = EXCLUDED.payment_terms,
        tax_percent = EXCLUDED.tax_percent,
        created_by = EXCLUDED.created_by,
        updated_at = EXCLUDED.updated_at,
        last_emailed_at = EXCLUDED.last_emailed_at
    `;

    return next;
  });
}

export async function deleteInvoice(id: string): Promise<boolean> {
  return withDb(async () => {
    const sql = getSql();
    const rows = (await sql`
      DELETE FROM invoices WHERE id = ${id} RETURNING id
    `) as Array<{ id: string }>;
    return rows.length > 0;
  });
}

async function allocateInvoiceNumber(issueDate: string): Promise<string> {
  const sql = getSql();
  const key = monthKeyFromDate(issueDate);
  const rows = (await sql`
    INSERT INTO invoice_sequences (year_month, last_seq)
    VALUES (${key}, 1)
    ON CONFLICT (year_month) DO UPDATE
      SET last_seq = invoice_sequences.last_seq + 1
    RETURNING last_seq
  `) as Array<{ last_seq: number }>;
  const seq = Number(rows[0]?.last_seq || 1);
  return formatInvoiceNumber(key, seq);
}

export async function createBlankInvoice(
  createdBy: string,
  currency: InvoiceCurrency = "NGN"
): Promise<ProformaInvoice> {
  return withDb(async () => {
    const issueDate = todayIsoDate();
    const number = await allocateInvoiceNumber(issueDate);
    const now = new Date().toISOString();

    const invoice: ProformaInvoice = {
      id: randomUUID(),
      number,
      issueDate,
      validUntil: defaultValidUntil(issueDate),
      currency,
      status: "draft",
      clientId: null,
      client: emptyClientSnapshot(),
      lineItems: [
        {
          id: randomUUID(),
          title: "",
          quantity: 1,
          unitPrice: 0,
          details: [""],
        },
      ],
      notes: "",
      paymentTerms: DEFAULT_PAYMENT_TERMS,
      taxPercent: 0,
      createdBy,
      createdAt: now,
      updatedAt: now,
      lastEmailedAt: null,
    };

    return saveInvoice(invoice);
  });
}

export async function duplicateInvoice(
  id: string,
  createdBy: string
): Promise<ProformaInvoice | null> {
  return withDb(async () => {
    const source = await getInvoice(id);
    if (!source) return null;

    const issueDate = todayIsoDate();
    const number = await allocateInvoiceNumber(issueDate);
    const now = new Date().toISOString();

    const copy: ProformaInvoice = {
      ...source,
      id: randomUUID(),
      number,
      issueDate,
      validUntil: defaultValidUntil(issueDate),
      status: "draft",
      lineItems: source.lineItems.map((item) => ({
        ...item,
        id: randomUUID(),
        details: [...item.details],
      })),
      createdBy,
      createdAt: now,
      updatedAt: now,
      lastEmailedAt: null,
    };

    return saveInvoice(copy);
  });
}

export type InvoiceUpdateInput = Partial<
  Pick<
    ProformaInvoice,
    | "issueDate"
    | "validUntil"
    | "currency"
    | "status"
    | "clientId"
    | "client"
    | "lineItems"
    | "notes"
    | "paymentTerms"
    | "taxPercent"
    | "lastEmailedAt"
  >
>;

export async function updateInvoice(
  id: string,
  patch: InvoiceUpdateInput
): Promise<ProformaInvoice | null> {
  return withDb(async () => {
    const existing = await getInvoice(id);
    if (!existing) return null;

    let issueDate = patch.issueDate ?? existing.issueDate;
    let validUntil = patch.validUntil ?? existing.validUntil;

    if (patch.issueDate && patch.issueDate !== existing.issueDate && !patch.validUntil) {
      validUntil = defaultValidUntil(issueDate);
    }

    const next: ProformaInvoice = {
      ...existing,
      ...patch,
      issueDate,
      validUntil,
      lineItems: (patch.lineItems ?? existing.lineItems).map(normalizeLineItem),
      client: patch.client ?? existing.client,
      updatedAt: new Date().toISOString(),
    };

    return saveInvoice(next);
  });
}

/* ---------------- Clients ---------------- */

export async function listClients(): Promise<InvoiceClient[]> {
  return withDb(async () => {
    const sql = getSql();
    const rows = (await sql`
      SELECT * FROM invoice_clients
      ORDER BY name ASC
    `) as ClientRow[];
    return rows.map(mapClient);
  });
}

export async function getClient(id: string): Promise<InvoiceClient | null> {
  return withDb(async () => {
    const sql = getSql();
    const rows = (await sql`
      SELECT * FROM invoice_clients WHERE id = ${id} LIMIT 1
    `) as ClientRow[];
    return rows[0] ? mapClient(rows[0]) : null;
  });
}

export async function saveClient(
  input: Omit<InvoiceClient, "id" | "createdAt" | "updatedAt"> & { id?: string }
): Promise<InvoiceClient> {
  return withDb(async () => {
    const sql = getSql();
    const stamp = new Date().toISOString();

    if (input.id) {
      const existing = await getClient(input.id);
      if (existing) {
        const updated: InvoiceClient = {
          ...existing,
          name: input.name.trim(),
          email: input.email.trim(),
          phone: input.phone.trim(),
          company: input.company.trim(),
          address: input.address.trim(),
          updatedAt: stamp,
        };
        await sql`
          UPDATE invoice_clients SET
            name = ${updated.name},
            email = ${updated.email},
            phone = ${updated.phone},
            company = ${updated.company},
            address = ${updated.address},
            updated_at = ${updated.updatedAt}
          WHERE id = ${updated.id}
        `;
        return updated;
      }
    }

    const created: InvoiceClient = {
      id: randomUUID(),
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      company: input.company.trim(),
      address: input.address.trim(),
      createdAt: stamp,
      updatedAt: stamp,
    };

    await sql`
      INSERT INTO invoice_clients (
        id, name, email, phone, company, address, created_at, updated_at
      ) VALUES (
        ${created.id},
        ${created.name},
        ${created.email},
        ${created.phone},
        ${created.company},
        ${created.address},
        ${created.createdAt},
        ${created.updatedAt}
      )
    `;

    return created;
  });
}

export async function deleteClient(id: string): Promise<boolean> {
  return withDb(async () => {
    const sql = getSql();
    const rows = (await sql`
      DELETE FROM invoice_clients WHERE id = ${id} RETURNING id
    `) as Array<{ id: string }>;
    return rows.length > 0;
  });
}

export function clientToSnapshot(client: InvoiceClient): InvoiceClientSnapshot {
  return {
    name: client.name,
    email: client.email,
    phone: client.phone,
    company: client.company,
    address: client.address,
  };
}

/* ---------------- Templates ---------------- */

async function ensureTemplatesSeeded() {
  const sql = getSql();
  const rows = (await sql`SELECT COUNT(*)::int AS count FROM invoice_templates`) as Array<{
    count: number;
  }>;
  if ((rows[0]?.count || 0) > 0) return;

  for (const template of SEED_TEMPLATES) {
    await sql`
      INSERT INTO invoice_templates (
        id, name, title, quantity, unit_price, currency, details, created_at, updated_at
      ) VALUES (
        ${template.id},
        ${template.name},
        ${template.title},
        ${template.quantity},
        ${template.unitPrice},
        ${template.currency},
        ${JSON.stringify(template.details)},
        ${template.createdAt},
        ${template.updatedAt}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

export async function listTemplates(): Promise<LineItemTemplate[]> {
  return withDb(async () => {
    await ensureTemplatesSeeded();
    const sql = getSql();
    const rows = (await sql`
      SELECT * FROM invoice_templates
      ORDER BY name ASC
    `) as TemplateRow[];
    return rows.map(mapTemplate);
  });
}

export async function getTemplate(id: string): Promise<LineItemTemplate | null> {
  return withDb(async () => {
    await ensureTemplatesSeeded();
    const sql = getSql();
    const rows = (await sql`
      SELECT * FROM invoice_templates WHERE id = ${id} LIMIT 1
    `) as TemplateRow[];
    return rows[0] ? mapTemplate(rows[0]) : null;
  });
}

export async function saveTemplate(
  input: Omit<LineItemTemplate, "id" | "createdAt" | "updatedAt"> & { id?: string }
): Promise<LineItemTemplate> {
  return withDb(async () => {
    await ensureTemplatesSeeded();
    const sql = getSql();
    const stamp = new Date().toISOString();

    if (input.id) {
      const existing = await getTemplate(input.id);
      if (existing) {
        const updated: LineItemTemplate = {
          ...existing,
          name: input.name.trim(),
          title: input.title.trim(),
          quantity: input.quantity,
          unitPrice: input.unitPrice,
          currency: input.currency,
          details: input.details.map((d) => d.trim()).filter(Boolean),
          updatedAt: stamp,
        };
        await sql`
          UPDATE invoice_templates SET
            name = ${updated.name},
            title = ${updated.title},
            quantity = ${updated.quantity},
            unit_price = ${updated.unitPrice},
            currency = ${updated.currency},
            details = ${JSON.stringify(updated.details)},
            updated_at = ${updated.updatedAt}
          WHERE id = ${updated.id}
        `;
        return updated;
      }
    }

    const created: LineItemTemplate = {
      id: randomUUID(),
      name: input.name.trim(),
      title: input.title.trim(),
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      currency: input.currency,
      details: input.details.map((d) => d.trim()).filter(Boolean),
      createdAt: stamp,
      updatedAt: stamp,
    };

    await sql`
      INSERT INTO invoice_templates (
        id, name, title, quantity, unit_price, currency, details, created_at, updated_at
      ) VALUES (
        ${created.id},
        ${created.name},
        ${created.title},
        ${created.quantity},
        ${created.unitPrice},
        ${created.currency},
        ${JSON.stringify(created.details)},
        ${created.createdAt},
        ${created.updatedAt}
      )
    `;

    return created;
  });
}

export async function deleteTemplate(id: string): Promise<boolean> {
  return withDb(async () => {
    await ensureTemplatesSeeded();
    const sql = getSql();
    const rows = (await sql`
      DELETE FROM invoice_templates WHERE id = ${id} RETURNING id
    `) as Array<{ id: string }>;
    return rows.length > 0;
  });
}

export function templateToLineItem(template: LineItemTemplate): InvoiceLineItem {
  return {
    id: randomUUID(),
    title: template.title,
    quantity: template.quantity,
    unitPrice: template.unitPrice,
    details: [...template.details],
  };
}

export function isValidStatus(value: string): value is InvoiceStatus {
  return ["draft", "sent", "accepted", "expired"].includes(value);
}

/** One-shot schema + seed helper for scripts / first deploy */
export async function migrateInvoiceDatabase(): Promise<void> {
  await withDb(async () => {
    await ensureTemplatesSeeded();
  });
}
