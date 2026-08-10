import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DEFAULT_PAYMENT_TERMS } from "./company";
import { defaultValidUntil, nextInvoiceNumber, todayIsoDate } from "./numbering";
import type {
  InvoiceClient,
  InvoiceClientSnapshot,
  InvoiceCurrency,
  InvoiceLineItem,
  InvoiceSequenceStore,
  InvoiceStatus,
  LineItemTemplate,
  ProformaInvoice,
} from "./types";
import { SEED_TEMPLATES } from "./seed-templates";

const DATA_DIR = path.join(process.cwd(), "data", "invoices");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePath(name: string) {
  return path.join(DATA_DIR, name);
}

function readJson<T>(name: string, fallback: T): T {
  ensureDataDir();
  const target = filePath(name);
  if (!fs.existsSync(target)) {
    writeJson(name, fallback);
    return fallback;
  }
  try {
    return JSON.parse(fs.readFileSync(target, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(name: string, data: unknown) {
  ensureDataDir();
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), "utf-8");
}

function nowIso() {
  return new Date().toISOString();
}

function emptyClientSnapshot(): InvoiceClientSnapshot {
  return { name: "", email: "", phone: "", company: "", address: "" };
}

export function listInvoices(): ProformaInvoice[] {
  const invoices = readJson<ProformaInvoice[]>("invoices.json", []);
  return [...invoices].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getInvoice(id: string): ProformaInvoice | null {
  return listInvoices().find((inv) => inv.id === id) ?? null;
}

export function saveInvoice(invoice: ProformaInvoice): ProformaInvoice {
  const invoices = listInvoices();
  const index = invoices.findIndex((inv) => inv.id === invoice.id);
  const next = { ...invoice, updatedAt: nowIso() };
  if (index >= 0) {
    invoices[index] = next;
  } else {
    invoices.unshift(next);
  }
  writeJson("invoices.json", invoices);
  return next;
}

export function deleteInvoice(id: string): boolean {
  const invoices = listInvoices();
  const next = invoices.filter((inv) => inv.id !== id);
  if (next.length === invoices.length) return false;
  writeJson("invoices.json", next);
  return true;
}

export function createBlankInvoice(createdBy: string, currency: InvoiceCurrency = "NGN"): ProformaInvoice {
  const issueDate = todayIsoDate();
  const sequence = readJson<InvoiceSequenceStore>("sequence.json", { months: {} });
  const { number, nextStore } = nextInvoiceNumber(sequence, issueDate);
  writeJson("sequence.json", nextStore);

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
    createdAt: nowIso(),
    updatedAt: nowIso(),
    lastEmailedAt: null,
  };

  return saveInvoice(invoice);
}

export function duplicateInvoice(id: string, createdBy: string): ProformaInvoice | null {
  const source = getInvoice(id);
  if (!source) return null;

  const issueDate = todayIsoDate();
  const sequence = readJson<InvoiceSequenceStore>("sequence.json", { months: {} });
  const { number, nextStore } = nextInvoiceNumber(sequence, issueDate);
  writeJson("sequence.json", nextStore);

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
    createdAt: nowIso(),
    updatedAt: nowIso(),
    lastEmailedAt: null,
  };

  return saveInvoice(copy);
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

export function updateInvoice(id: string, patch: InvoiceUpdateInput): ProformaInvoice | null {
  const existing = getInvoice(id);
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
    lineItems: (patch.lineItems ?? existing.lineItems).map((item) => normalizeLineItem(item)),
    client: patch.client ?? existing.client,
    updatedAt: nowIso(),
  };

  return saveInvoice(next);
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

/* ---------------- Clients ---------------- */

export function listClients(): InvoiceClient[] {
  const clients = readJson<InvoiceClient[]>("clients.json", []);
  return [...clients].sort((a, b) => a.name.localeCompare(b.name));
}

export function getClient(id: string): InvoiceClient | null {
  return listClients().find((c) => c.id === id) ?? null;
}

export function saveClient(
  input: Omit<InvoiceClient, "id" | "createdAt" | "updatedAt"> & { id?: string }
): InvoiceClient {
  const clients = listClients();
  const stamp = nowIso();
  if (input.id) {
    const index = clients.findIndex((c) => c.id === input.id);
    if (index >= 0) {
      const updated: InvoiceClient = {
        ...clients[index],
        name: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
        company: input.company.trim(),
        address: input.address.trim(),
        updatedAt: stamp,
      };
      clients[index] = updated;
      writeJson("clients.json", clients);
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
  clients.push(created);
  writeJson("clients.json", clients);
  return created;
}

export function deleteClient(id: string): boolean {
  const clients = listClients();
  const next = clients.filter((c) => c.id !== id);
  if (next.length === clients.length) return false;
  writeJson("clients.json", next);
  return true;
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

export function listTemplates(): LineItemTemplate[] {
  ensureTemplatesSeeded();
  const templates = readJson<LineItemTemplate[]>("templates.json", []);
  return [...templates].sort((a, b) => a.name.localeCompare(b.name));
}

export function getTemplate(id: string): LineItemTemplate | null {
  return listTemplates().find((t) => t.id === id) ?? null;
}

export function saveTemplate(
  input: Omit<LineItemTemplate, "id" | "createdAt" | "updatedAt"> & { id?: string }
): LineItemTemplate {
  ensureTemplatesSeeded();
  const templates = readJson<LineItemTemplate[]>("templates.json", []);
  const stamp = nowIso();

  if (input.id) {
    const index = templates.findIndex((t) => t.id === input.id);
    if (index >= 0) {
      const updated: LineItemTemplate = {
        ...templates[index],
        name: input.name.trim(),
        title: input.title.trim(),
        quantity: input.quantity,
        unitPrice: input.unitPrice,
        currency: input.currency,
        details: input.details.map((d) => d.trim()).filter(Boolean),
        updatedAt: stamp,
      };
      templates[index] = updated;
      writeJson("templates.json", templates);
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
  templates.push(created);
  writeJson("templates.json", templates);
  return created;
}

export function deleteTemplate(id: string): boolean {
  ensureTemplatesSeeded();
  const templates = readJson<LineItemTemplate[]>("templates.json", []);
  const next = templates.filter((t) => t.id !== id);
  if (next.length === templates.length) return false;
  writeJson("templates.json", next);
  return true;
}

function ensureTemplatesSeeded() {
  ensureDataDir();
  const target = filePath("templates.json");
  if (!fs.existsSync(target)) {
    writeJson("templates.json", SEED_TEMPLATES);
  }
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
