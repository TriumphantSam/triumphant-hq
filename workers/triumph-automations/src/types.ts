export type Env = {
  DB: D1Database;
  AUTOMATION_HMAC_SECRET: string;
  ENVIRONMENT: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  OWNER_EMAIL?: string;
  GOOGLE_SA_EMAIL?: string;
  GOOGLE_SA_PRIVATE_KEY?: string;
  LEADS_SHEET_ID?: string;
  SHEETS_SYNC_SECRET?: string;
  WHATSAPP_BRIDGE_SECRET?: string;
};
export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  need: string;
  source: string;
  created_at: string;
  consent_marketing: number;
};
export type Job = {
  id: string;
  lead_id: string;
  kind: "sheet" | "reply_email" | "owner_email";
  attempts: number;
};
