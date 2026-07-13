const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const AIRTABLE_FOLLOW_UPS_TABLE = process.env.AIRTABLE_FOLLOW_UPS_TABLE ?? "FollowUps";
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID ?? "";
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY ?? "";
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY ?? "";
const EMAILJS_FROM_NAME = process.env.EMAILJS_FROM_NAME ?? "TriumphantHQ";

const TEMPLATE_BY_KEY: Record<string, string> = {
  funnel_day3: process.env.EMAILJS_TEMPLATE_ID_FUNNEL_FOLLOWUP_DAY3 ?? "",
  funnel_day7: process.env.EMAILJS_TEMPLATE_ID_FUNNEL_FOLLOWUP_DAY7 ?? "",
  purchase_day3: process.env.EMAILJS_TEMPLATE_ID_PURCHASE_FOLLOWUP_DAY3 ?? "",
  purchase_day7: process.env.EMAILJS_TEMPLATE_ID_PURCHASE_FOLLOWUP_DAY7 ?? "",
};

export type FollowUpRow = {
  id: string;
  name: string;
  email: string;
  templateKey: string;
  scheduledAt: string;
  metadata: Record<string, string>;
};

export async function scheduleFollowUpEmail(payload: {
  name: string;
  email: string;
  templateKey: keyof typeof TEMPLATE_BY_KEY;
  source: string;
  sequence: string;
  leadId?: string;
  metadata?: Record<string, string>;
  scheduledAt: Date;
}) {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) return false;
  const endpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_FOLLOW_UPS_TABLE)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            Name: payload.name,
            Email: payload.email,
            "Template Key": payload.templateKey,
            Sequence: payload.sequence,
            Source: payload.source,
            Status: "pending",
            "Lead ID": payload.leadId ?? "",
            "Scheduled At": payload.scheduledAt.toISOString(),
            Metadata: JSON.stringify(payload.metadata ?? {}),
          },
        },
      ],
    }),
  });
  return response.ok;
}

export async function fetchDueFollowUps(limit = 20): Promise<FollowUpRow[]> {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) return [];
  const now = new Date().toISOString();
  const params = new URLSearchParams();
  params.set("maxRecords", String(limit));
  params.set("filterByFormula", `AND({Status}='pending', IS_BEFORE({Scheduled At}, '${now}'))`);
  const endpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_FOLLOW_UPS_TABLE)}?${params.toString()}`;
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    cache: "no-store",
  });
  if (!response.ok) return [];
  const payload = (await response.json()) as {
    records?: Array<{ id: string; fields?: Record<string, unknown> }>;
  };
  return (payload.records ?? []).map((record) => {
    const fields = record.fields ?? {};
    const metadataRaw = typeof fields["Metadata"] === "string" ? fields["Metadata"] : "{}";
    let metadata: Record<string, string> = {};
    try {
      metadata = JSON.parse(metadataRaw) as Record<string, string>;
    } catch {
      metadata = {};
    }
    return {
      id: record.id,
      name: String(fields["Name"] ?? "there"),
      email: String(fields["Email"] ?? ""),
      templateKey: String(fields["Template Key"] ?? ""),
      scheduledAt: String(fields["Scheduled At"] ?? ""),
      metadata,
    };
  });
}

export async function markFollowUpStatus(recordId: string, status: "sent" | "failed") {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) return;
  const endpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_FOLLOW_UPS_TABLE)}/${recordId}`;
  await fetch(endpoint, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        Status: status,
        "Sent At": status === "sent" ? new Date().toISOString() : undefined,
      },
    }),
  });
}

export async function sendFollowUpEmail(payload: {
  name: string;
  email: string;
  templateKey: string;
  metadata?: Record<string, string>;
}) {
  const templateId = TEMPLATE_BY_KEY[payload.templateKey];
  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !templateId) return false;

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PRIVATE_KEY || undefined,
      template_params: {
        name: payload.name,
        email: payload.email,
        from_name: EMAILJS_FROM_NAME,
        ...(payload.metadata ?? {}),
      },
    }),
  });

  return response.ok;
}

