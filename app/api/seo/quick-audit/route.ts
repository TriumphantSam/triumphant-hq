import { NextResponse } from 'next/server';
import { normalizeQuickAuditResponse, proxySeoBackend, type SeoQuickAuditRequest, type SeoQuickAuditResponse } from '@/lib/seo-backend';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SeoQuickAuditRequest;
    const websiteUrl = typeof body.websiteUrl === 'string' ? body.websiteUrl.trim() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const businessType = typeof body.businessType === 'string' ? body.businessType.trim() : '';
    const notes = typeof body.notes === 'string' ? body.notes.trim() : '';

    if (!websiteUrl || !name || !email.includes('@')) {
      return NextResponse.json({ ok: false, error: 'Please provide a valid website, name, and email.' }, { status: 400 });
    }

    const data = await proxySeoBackend<SeoQuickAuditResponse>('/api/seo/quick-audit', {
      websiteUrl,
      name,
      email,
      businessType,
      notes,
    });

    return NextResponse.json(normalizeQuickAuditResponse(data), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to run quick audit';
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
