import { NextResponse } from 'next/server';
import { proxySeoBackend } from '@/lib/seo-backend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const leadId = typeof body.leadId === 'string' ? body.leadId.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    if (!leadId) {
      return NextResponse.json({ ok: false, error: 'leadId is required' }, { status: 400 });
    }

    const data = await proxySeoBackend<{ ok: boolean; leadId: string }>('/api/seo/book-call-intent', {
      leadId,
      email,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to log booking intent';
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
