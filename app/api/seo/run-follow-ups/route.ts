import { NextResponse } from "next/server";
import { proxySeoBackend } from "@/lib/seo-backend";

const CRON_SECRET = process.env.SEO_FOLLOWUP_CRON_SECRET ?? process.env.CRON_SECRET ?? "";

type RunFollowUpsResponse = {
  ok?: boolean;
  processed?: number;
  sent?: number;
  skipped?: number;
  message?: string;
  error?: string;
};

function isAuthorized(request: Request): boolean {
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

  try {
    const data = await proxySeoBackend<RunFollowUpsResponse>("/api/internal/run-follow-ups", undefined, "POST");
    return NextResponse.json({ ok: true, ...data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to run follow-ups";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}

