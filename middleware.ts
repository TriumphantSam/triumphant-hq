import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/digital-forge/builder", "/api/digital-forge/builder"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect the builder UI and its internal action routes
  if (!PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader) {
    // Authorization: Basic <base64(user:pass)>
    const encoded = authHeader.replace(/^Basic\s+/i, "");
    const decoded = atob(encoded);
    const [user, ...rest] = decoded.split(":");
    const pass = rest.join(":"); // allow colons in password

    const validUser = process.env.BUILDER_USER ?? "admin";
    const validPass = process.env.BUILDER_PASS ?? "";

    if (user === validUser && pass === validPass && validPass.length > 0) {
      return NextResponse.next();
    }
  }

  // Prompt for credentials
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Digital Forge Builder", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/digital-forge/builder/:path*", "/api/digital-forge/builder/:path*"],
};
