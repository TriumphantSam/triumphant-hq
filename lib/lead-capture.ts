import { automationConfigured, automationRequest } from "./automation-api";
export type LeadInput = {
  name: string;
  email: string;
  service?: string;
  message: string;
  source?: string;
  phone?: string;
  consentMarketing?: boolean;
};
export async function captureLead(input: LeadInput) {
  if (automationConfigured()) {
    const result = await automationRequest<{ leadId: string }>(
      "/v1/leads",
      input,
    );
    return { stored: true, leadId: result.leadId, destination: "worker" };
  }
  const base = process.env.AIRTABLE_BASE_ID,
    key = process.env.AIRTABLE_API_KEY;
  if (!base || !key) return { stored: false, leadId: "", destination: "none" };
  const table = process.env.AIRTABLE_CONTACT_LEADS_TABLE || "Contact Leads";
  const response = await fetch(
    `https://api.airtable.com/v0/${encodeURIComponent(base)}/${encodeURIComponent(table)}`,
    {
      method: "POST",
      signal: AbortSignal.timeout(5000),
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Name: input.name,
              Email: input.email,
              Service: input.service || "",
              Message: input.message,
              Source: input.source || "contact_form",
              CapturedAt: new Date().toISOString(),
            },
          },
        ],
      }),
    },
  );
  if (!response.ok) throw new Error("Lead storage is temporarily unavailable.");
  const data = (await response.json()) as { records?: { id: string }[] };
  const leadId = data.records?.[0]?.id;
  if (!leadId) throw new Error("Lead storage did not confirm the record.");
  return { stored: true, leadId, destination: "airtable" };
}
