import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/tech-diary-preview';

export function GET(request: NextRequest) {
    const secret = process.env.TECH_DIARY_PREVIEW_SECRET;
    const key = request.nextUrl.searchParams.get('key');

    if (!secret || key !== secret) {
        return NextResponse.redirect(new URL('/blog', request.url));
    }

    const res = NextResponse.redirect(new URL('/blog', request.url));
    res.cookies.set(COOKIE_NAME, secret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
    });
    return res;
}
