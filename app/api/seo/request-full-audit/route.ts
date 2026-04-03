import { NextResponse } from 'next/server';
import { proxySeoBackend } from '@/lib/seo-backend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const leadId = typeof body.leadId === 'string' ? body.leadId.trim() : '';
    const websiteUrl = typeof body.websiteUrl === 'string' ? body.websiteUrl.trim() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    if (!leadId) {
      return NextResponse.json({ ok: false, error: 'leadId is required' }, { status: 400 });
    }

    const data = await proxySeoBackend<{ ok: boolean; message: string; leadId: string }>('/api/seo/request-full-audit', {
      leadId,
      websiteUrl,
      name,
      email,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to request full audit';
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
