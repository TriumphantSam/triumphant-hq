import fs from 'node:fs';
import path from 'node:path';
import bundledContent from '@/content/site-content.generated.json';
import { NextResponse } from 'next/server';

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID ?? '';
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID ?? '';
const EMAILJS_TEMPLATE_ID_CONFIRMATION = process.env.EMAILJS_TEMPLATE_ID_CONFIRMATION ?? EMAILJS_TEMPLATE_ID;
const EMAILJS_TEMPLATE_ID_STARTING_SOON = process.env.EMAILJS_TEMPLATE_ID_STARTING_SOON ?? '';
const EMAILJS_TEMPLATE_ID_REPLAY = process.env.EMAILJS_TEMPLATE_ID_REPLAY ?? '';
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY ?? '';
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY ?? '';
const EMAILJS_FROM_NAME = process.env.EMAILJS_FROM_NAME ?? 'TriumphantTech';
const EMAILJS_TRAINING_BASE_URL = process.env.EMAILJS_TRAINING_BASE_URL ?? 'https://triumphantech.com/digital-forge/funnel';
const GENERATED_FUNNELS_DIR = path.join(process.cwd(), 'content', 'digital-forge', 'funnels');

type FunnelPayload = {
    slug: string;
    campaignName?: string;
    training?: { title?: string };
};

function resolveFunnelPath(slug: string): string {
    return path.join(GENERATED_FUNNELS_DIR, `${slug}.json`);
}

function readLocalFunnel(slug: string): FunnelPayload | null {
    const filePath = resolveFunnelPath(slug);
    if (!fs.existsSync(filePath)) return (bundledContent.funnels as Record<string, FunnelPayload>)[slug] ?? null;
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as FunnelPayload;
    } catch {
        return null;
    }
}

type FunnelEmailTemplate = 'confirmation' | 'starting_soon' | 'replay';

function resolveEmailJsTemplateId(template: FunnelEmailTemplate): string {
    if (template === 'starting_soon') return EMAILJS_TEMPLATE_ID_STARTING_SOON;
    if (template === 'replay') return EMAILJS_TEMPLATE_ID_REPLAY;
    return EMAILJS_TEMPLATE_ID_CONFIRMATION;
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
        return false;
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

        const funnel = readLocalFunnel(slug);
        const trainingTitle = funnel?.training?.title || funnel?.campaignName || 'Digital Forge Training';
        const trainingUrl = `${EMAILJS_TRAINING_BASE_URL}/${slug}/training`;
        const offerUrl = `${EMAILJS_TRAINING_BASE_URL}/${slug}/offer`;

        let sentConfirmationEmail = false;

        try {
            sentConfirmationEmail = await sendEmailJsTemplate('confirmation',{
                name,
                email,
                slug,
                trainingTitle,
                trainingUrl,
                offerUrl,
            });
        } catch (error) {
            console.error('[Funnel Engine] EmailJS confirmation failed', error);
        }

        console.log(`[Funnel Engine] New Lead Captured: ${name} (${email}) for funnel: ${slug}`);

        return NextResponse.json({
            success: true,
            message: 'Reserved spot successfully.',
            sentConfirmationEmail,
            templates: {
                confirmation: EMAILJS_TEMPLATE_ID_CONFIRMATION || null,
                startingSoon: EMAILJS_TEMPLATE_ID_STARTING_SOON || null,
                replay: EMAILJS_TEMPLATE_ID_REPLAY || null,
            },
        });
    } catch {
        return NextResponse.json({ error: 'Failed to process lead capture' }, { status: 500 });
    }
}

