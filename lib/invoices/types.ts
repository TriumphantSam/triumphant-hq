export type InvoiceCurrency = "NGN" | "USD" | "GBP" | "EUR";

export type InvoiceStatus = "draft" | "sent" | "accepted" | "expired";

export type InvoiceClient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceLineItem = {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number;
  /** Deliverables / scope bullets under the line item */
  details: string[];
};

export type LineItemTemplate = {
  id: string;
  name: string;
  title: string;
  quantity: number;
  unitPrice: number;
  currency: InvoiceCurrency;
  details: string[];
  createdAt: string;
  updatedAt: string;
};

export type InvoiceClientSnapshot = {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
};

export type ProformaInvoice = {
  id: string;
  number: string;
  issueDate: string;
  validUntil: string;
  currency: InvoiceCurrency;
  status: InvoiceStatus;
  clientId: string | null;
  client: InvoiceClientSnapshot;
  lineItems: InvoiceLineItem[];
  notes: string;
  paymentTerms: string;
  taxPercent: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastEmailedAt?: string | null;
};

export type InvoiceSequenceStore = {
  /** key: YYYY-MM, value: last sequence number used */
  months: Record<string, number>;
};

export type InvoiceUser = {
  id: string;
  username: string;
  /** Plain for env bootstrap in v1; hashed comparison via timing-safe helpers */
  password: string;
  name: string;
};

export type InvoiceSessionPayload = {
  userId: string;
  username: string;
  name: string;
  exp: number;
};
