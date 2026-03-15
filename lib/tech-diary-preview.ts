import { cookies } from 'next/headers';

const COOKIE_NAME = 'tech_diary_preview';

export function getPreviewSecret(): string | undefined {
    return process.env.TECH_DIARY_PREVIEW_SECRET;
}

export async function isTechDiaryPreview(): Promise<boolean> {
    // Launch mode: show Tech Diary to everyone
    if (process.env.TECH_DIARY_PUBLIC === 'true') return true;

    const secret = getPreviewSecret();
    // No secret = show "Coming soon" to everyone (safe default for production)
    if (!secret) return false;
    const cookieStore = await cookies();
    const value = cookieStore.get(COOKIE_NAME)?.value;
    return value === secret;
}

export { COOKIE_NAME };
