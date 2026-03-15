import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/tech-diary-preview';

export function GET(request: NextRequest) {
    const url = new URL('/tech-diary', request.url);
    const res = NextResponse.redirect(url);
    res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
    return res;
}
