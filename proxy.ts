import { NextRequest, NextResponse } from "next/server";
import { canonicalRedirectUrl } from "@/lib/canonical-host";
import { INVOICE_SESSION_COOKIE, verifySessionToken } from "@/lib/invoices/auth";
import { automationRequest } from "@/lib/automation-api";

const BUILDER_PREFIXES = ["/digital-forge/builder", "/api/digital-forge/builder"];

function requestHost(request: NextRequest): string | null {
  return request.headers.get("x-forwarded-host") ?? request.headers.get("host");
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const canonical = canonicalRedirectUrl(requestHost(request), pathname, search);
  if (canonical) {
    return NextResponse.redirect(canonical, 301);
  }
  if(pathname==="/platform"||pathname.startsWith("/platform/")){
    const response=NextResponse.next();response.headers.set("Content-Security-Policy","frame-ancestors 'none'");return response;
  }
  let decodedPath=pathname;try{decodedPath=decodeURIComponent(pathname);}catch{}
  const widget = decodedPath.match(/^\/business\/([a-f0-9-]{36})\/widget\/?$/);
  if(widget){
    let ancestor="'none'";
    try {
      const {data}=await automationRequest<{data:{origin:string}}>("/v1/platform/rpc",{action:"public.widget",payload:{workspaceId:widget[1]},ipKey:"0".repeat(64)});
      const origin=new URL(data.origin);
      if(origin.protocol==="https:" && /^[a-z0-9.-]+$/i.test(origin.hostname) && origin.origin===data.origin)ancestor=origin.origin;
    }catch{ /* Fail closed if publication or backend checks fail. */ }
    const response=NextResponse.next();
    response.headers.set("Content-Security-Policy",`frame-ancestors ${ancestor}`);
    response.headers.set("Cache-Control","no-store, private");
    response.headers.set("Referrer-Policy","no-referrer");
    response.headers.set("X-Robots-Tag","noindex, nofollow");
    return response;
  }

  // Invoice studio auth
  if (pathname.startsWith("/invoices") || pathname.startsWith("/api/invoices")) {
    if (
      pathname.match(/^\/invoices\/(receipts\/)?[^/]+\/print$/) &&
      request.nextUrl.searchParams.get("token")
    ) {
      return NextResponse.next();
    }

    if (pathname === "/api/invoices/auth") {
      return NextResponse.next();
    }

    if (pathname === "/invoices/login") {
      const session = await verifySessionToken(request.cookies.get(INVOICE_SESSION_COOKIE)?.value);
      if (session) {
        return NextResponse.redirect(new URL("/invoices", request.url));
      }
      return NextResponse.next();
    }

    const session = await verifySessionToken(request.cookies.get(INVOICE_SESSION_COOKIE)?.value);
    if (!session) {
      if (pathname.startsWith("/api/invoices")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const login = new URL("/invoices/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }

    return NextResponse.next();
  }

  // Digital Forge builder basic auth
  if (!BUILDER_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader) {
    const encoded = authHeader.replace(/^Basic\s+/i, "");
    const decoded = atob(encoded);
    const [user, ...rest] = decoded.split(":");
    const pass = rest.join(":");

    const validUser = process.env.BUILDER_USER ?? "admin";
    const validPass = process.env.BUILDER_PASS ?? "";

    if (user === validUser && pass === validPass && validPass.length > 0) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Digital Forge Builder", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|txt|xml|webmanifest)$).*)",
  ],
};
