import { NextResponse } from "next/server";
import { followUpPreviewResponse } from "@/lib/follow-up-preview-response";

function isAuthorized(request: Request): boolean {
  const CRON_SECRET = process.env.SEO_FOLLOWUP_CRON_SECRET ?? process.env.CRON_SECRET ?? "";
  if (!CRON_SECRET) return false;
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : "";
  const tokenHeader = request.headers.get("x-cron-secret")?.trim() ?? "";
  return bearer === CRON_SECRET || tokenHeader === CRON_SECRET;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  return followUpPreviewResponse("seo");
}

