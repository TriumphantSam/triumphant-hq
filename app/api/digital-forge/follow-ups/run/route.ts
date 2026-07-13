import { NextResponse } from "next/server";
import { fetchDueFollowUps, markFollowUpStatus, sendFollowUpEmail } from "@/lib/follow-up-emails";

const FOLLOW_UP_RUNNER_SECRET = process.env.FOLLOW_UP_RUNNER_SECRET ?? process.env.CRON_SECRET ?? "";

function isAuthorized(request: Request): boolean {
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

  const due = await fetchDueFollowUps(30);
  let sent = 0;
  let failed = 0;

  for (const item of due) {
    if (!item.email || !item.templateKey) continue;
    try {
      const ok = await sendFollowUpEmail({
        name: item.name,
        email: item.email,
        templateKey: item.templateKey,
        metadata: item.metadata,
      });
      await markFollowUpStatus(item.id, ok ? "sent" : "failed");
      if (ok) sent += 1;
      else failed += 1;
    } catch {
      failed += 1;
      await markFollowUpStatus(item.id, "failed");
    }
  }

  return NextResponse.json({ ok: true, processed: due.length, sent, failed });
}

