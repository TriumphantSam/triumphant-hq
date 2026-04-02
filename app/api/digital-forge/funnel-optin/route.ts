import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { slug, name, email } = body;

        if (!slug || !name || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Mocking Phase 3 lead capture (In Phase 4/5, we would pipe this to Airtable/EmailJS)
        console.log(`[Funnel Engine] New Lead Captured: ${name} (${email}) for funnel: ${slug}`);

        return NextResponse.json({ success: true, message: 'Reserved spot successfully.' });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to process lead capture' }, { status: 500 });
    }
}
