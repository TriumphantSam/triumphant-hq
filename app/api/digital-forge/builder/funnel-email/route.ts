import fs from 'node:fs';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? '';
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? '';
const AIRTABLE_FUNNEL_LEADS_TABLE = process.env.AIRTABLE_FUNNEL_LEADS_TABLE ?? 'Funnel Leads';
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID ?? '';
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID ?? '';
const EMAILJS_TEMPLATE_ID_CONFIRMATION = process.env.EMAILJS_TEMPLATE_ID_CONFIRMATION ?? EMAILJS_TEMPLATE_ID;
const EMAILJS_TEMPLATE_ID_STARTING_SOON = process.env.EMAILJS_TEMPLATE_ID_STARTING_SOON ?? '';
const EMAILJS_TEMPLATE_ID_REPLAY = process.env.EMAILJS_TEMPLATE_ID_REPLAY ?? '';
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY ?? '';
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY ?? '';
const EMAILJS_FROM_NAME = process.env.EMAILJS_FROM_NAME ?? 'TriumphantHQ';
const EMAILJS_TRAINING_BASE_URL = process.env.EMAILJS_TRAINING_BASE_URL ?? 'https://triumphanthq.com/digital-forge/funnel';
const GENERATED_FUNNELS_DIR = path.join(process.cwd(), 'content', 'digital-forge', 'funnels');

type FunnelEmailTemplate = 'confirmation' | 'starting_soon' | 'replay';

type FunnelPayload = {
  slug: string;
  campaignName?: string;
  training?: { title?: string };
};

type FunnelLead = {
  id: string;
  name: string;
  email: string;
  slug: string;
};

function resolveEmailJsTemplateId(template: FunnelEmailTemplate): string {
  if (template === 'starting_soon') return EMAILJS_TEMPLATE_ID_STARTING_SOON;
  if (template === 'replay') return EMAILJS_TEMPLATE_ID_REPLAY;
  return EMAILJS_TEMPLATE_ID_CONFIRMATION;
}

function resolveFunnelPath(slug: string): string {
  return path.join(GENERATED_FUNNELS_DIR, `${slug}.json`);
}

function readLocalFunnel(slug: string): FunnelPayload | null {
  const filePath = resolveFunnelPath(slug);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as FunnelPayload;
  } catch {
    return null;
  }
}

async function fetchFunnelLeads(slug: string): Promise<FunnelLead[]> {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
    return [];
  }

  const params = new URLSearchParams();
  params.set('maxRecords', '100');
  params.set('filterByFormula', `{Slug}='${slug.replace(/'/g, "\\'")}'`);
  const endpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_FUNNEL_LEADS_TABLE)}?${params.toString()}`;

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Airtable lead fetch failed: ${response.status} ${detail}`);
  }

  const data = (await response.json()) as { records?: Array<{ id: string; fields?: Record<string, unknown> }> };
  return (data.records ?? [])
    .map((record) => {
      const fields = record.fields ?? {};
      return {
        id: record.id,
        name: typeof fields['Name'] === 'string' ? fields['Name'] : 'there',
        email: typeof fields['Email'] === 'string' ? fields['Email'] : '',
        slug: typeof fields['Slug'] === 'string' ? fields['Slug'] : slug,
      } as FunnelLead;
    })
    .filter((lead) => lead.email);
}

async function sendEmailJsTemplate(template: FunnelEmailTemplate, payload: {
  name: string;
  email: string;
  slug: string;
  trainingTitle: string;
  trainingUrl: string;
  offerUrl: string;
}) {
  const templateId = resolveEmailJsTemplateId(template);
  if (!EMAILJS_SERVICE_ID || !templateId || !EMAILJS_PUBLIC_KEY) {
    throw new Error(`EmailJS is not configured for template ${template}`);
  }

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PRIVATE_KEY || undefined,
      template_params: {
        name: payload.name,
        email: payload.email,
        slug: payload.slug,
        training_title: payload.trainingTitle,
        training_url: payload.trainingUrl,
        offer_url: payload.offerUrl,
        from_name: EMAILJS_FROM_NAME,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`EmailJS send failed: ${response.status} ${detail}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
    const template = body.template as FunnelEmailTemplate;
    const dryRun = Boolean(body.dryRun);
    const requestedEmails = Array.isArray(body.emails)
      ? (body.emails as unknown[]).filter((value: unknown): value is string => typeof value === 'string' && value.trim().length > 0).map((value: string) => value.trim().toLowerCase())
      : [];

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }
    if (!template || !['confirmation', 'starting_soon', 'replay'].includes(template)) {
      return NextResponse.json({ error: 'invalid template' }, { status: 400 });
    }

    const funnel = readLocalFunnel(slug);
    if (!funnel) {
      return NextResponse.json({ error: 'funnel not found' }, { status: 404 });
    }

    const trainingTitle = funnel.training?.title || funnel.campaignName || 'Digital Forge Training';
    const trainingUrl = `${EMAILJS_TRAINING_BASE_URL}/${slug}/training`;
    const offerUrl = `${EMAILJS_TRAINING_BASE_URL}/${slug}/offer`;

    const leads = await fetchFunnelLeads(slug);
    const recipients = requestedEmails.length > 0
      ? leads.filter((lead) => requestedEmails.includes(lead.email.toLowerCase()))
      : leads;

    if (recipients.length === 0) {
      return NextResponse.json({ error: 'no matching leads found' }, { status: 404 });
    }

    const results: Array<{ email: string; ok: boolean; error?: string }> = [];

    for (const lead of recipients) {
      if (dryRun) {
        results.push({ email: lead.email, ok: true });
        continue;
      }
      try {
        await sendEmailJsTemplate(template, {
          name: lead.name,
          email: lead.email,
          slug: lead.slug,
          trainingTitle,
          trainingUrl,
          offerUrl,
        });
        results.push({ email: lead.email, ok: true });
      } catch (error) {
        results.push({
          email: lead.email,
          ok: false,
          error: error instanceof Error ? error.message : 'Unknown send error',
        });
      }
    }

    const sent = results.filter((item) => item.ok).length;
    const failed = results.length - sent;

    return NextResponse.json({
      ok: true,
      slug,
      template,
      dryRun,
      recipientCount: recipients.length,
      sent,
      failed,
      trainingTitle,
      trainingUrl,
      offerUrl,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

