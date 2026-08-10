import { NextRequest, NextResponse } from "next/server";
import {
  INVOICE_SESSION_COOKIE,
  createSessionToken,
  findUser,
  sessionCookieOptions,
  verifySessionToken,
} from "@/lib/invoices/auth";

export async function GET() {
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  const session = await verifySessionToken(jar.get(INVOICE_SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.userId,
      username: session.username,
      name: session.name,
    },
  });
}

export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const username = body.username?.trim() || "";
  const password = body.password || "";
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  const user = findUser(username, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createSessionToken(user);
  const response = NextResponse.json({
    ok: true,
    user: { id: user.id, username: user.username, name: user.name },
  });
  response.cookies.set(INVOICE_SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(INVOICE_SESSION_COOKIE, "", { ...sessionCookieOptions(0), maxAge: 0 });
  return response;
}
