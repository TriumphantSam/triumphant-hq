import { cookies } from 'next/headers';

const COOKIE_NAME = 'tech_diary_preview';

export function getPreviewSecret(): string | undefined {
    return process.env.TECH_DIARY_PREVIEW_SECRET;
}

export async function isTechDiaryPreview(): Promise<boolean> {
    const secret = getPreviewSecret();
    if (!secret) return true; // no secret configured = show to everyone (e.g. when you're ready to launch)
    const cookieStore = await cookies();
    const value = cookieStore.get(COOKIE_NAME)?.value;
    return value === secret;
}

export { COOKIE_NAME };
