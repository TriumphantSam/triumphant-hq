export const COMPANY = {
  legalName: "Triumphant Technological Services",
  tradingAs: "Triumphant HQ",
  addressLines: ["Winners Way, Bashorun", "Ibadan, Oyo State, Nigeria"],
  phones: ["08107711190", "09090090910"],
  email: "admin@triumphantech.com",
  website: "triumphanthq.com",
  websiteUrl: "https://triumphanthq.com",
  bank: {
    name: "Moniepoint",
    accountName: "triumphanttech services",
    accountNumber: "8107711190",
  },
  taxId: "2622971125975",
  registrationNumber: "2988963",
  logoPath: "/images/invoice-logo.png",
} as const;

export const DEFAULT_PAYMENT_TERMS =
  "Eighty percent (80%) of the total amount is due before work begins. The remaining twenty percent (20%) is due within twenty-five (25) hours of project completion.";

export const DEFAULT_VALIDITY_DAYS = 7;

export const PROFORMA_DISCLAIMER =
  "This is a proforma invoice and not a tax invoice. It is issued for quotation and acceptance purposes and does not constitute a demand for payment until accepted. Prices and scope remain subject to written confirmation.";

export const INVOICE_COLORS = {
  accent: "#075ee5",
  accentSecondary: "#1a8fd4",
  navy: "#0a1220",
  muted: "#4a5568",
  line: "#d8e2f0",
  surface: "#f4f7fb",
  white: "#ffffff",
} as const;
