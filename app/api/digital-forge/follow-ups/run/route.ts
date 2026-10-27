import { NextResponse } from "next/server";
import { followUpPreviewResponse } from "@/lib/follow-up-preview-response";

function isAuthorized(request: Request): boolean {
  const FOLLOW_UP_RUNNER_SECRET = process.env.FOLLOW_UP_RUNNER_SECRET ?? process.env.CRON_SECRET ?? "";
  if (!FOLLOW_UP_RUNNER_SECRET) return false;
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : "";
  const token = request.headers.get("x-followup-secret")?.trim() ?? "";
  return bearer === FOLLOW_UP_RUNNER_SECRET || token === FOLLOW_UP_RUNNER_SECRET;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  return followUpPreviewResponse("digital-forge");
}
