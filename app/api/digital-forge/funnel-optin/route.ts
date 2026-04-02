import { NextResponse } from 'next/server';

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? '';
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? '';
const AIRTABLE_FUNNEL_LEADS_TABLE = process.env.AIRTABLE_FUNNEL_LEADS_TABLE ?? 'Funnel Leads';

async function pushLeadToAirtable(lead: { slug: string; name: string; email: string }) {
    if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
        return false;
    }

    const endpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_FUNNEL_LEADS_TABLE)}`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            records: [
                {
                    fields: {
                        Slug: lead.slug,
                        Name: lead.name,
                        Email: lead.email,
                        Source: 'digital_forge_funnel',
                        CapturedAt: new Date().toISOString(),
                    },
                },
            ],
        }),
    });

    if (!response.ok) {
        const detail = await response.text();
        throw new Error(`Airtable lead capture failed: ${response.status} ${detail}`);
    }

    return true;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const email = typeof body.email === 'string' ? body.email.trim() : '';

        if (!slug || !name || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const lead = { slug, name, email };
        let storedInAirtable = false;

        try {
            storedInAirtable = await pushLeadToAirtable(lead);
        } catch (error) {
            console.error('[Funnel Engine] Airtable lead capture failed', error);
        }

        console.log(`[Funnel Engine] New Lead Captured: ${name} (${email}) for funnel: ${slug}`);

        return NextResponse.json({
            success: true,
            message: 'Reserved spot successfully.',
            storedInAirtable,
        });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to process lead capture' }, { status: 500 });
    }
}
