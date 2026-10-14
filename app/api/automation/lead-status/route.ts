import { NextResponse } from "next/server";
import { automationRequest } from "@/lib/automation-api";
import { readBoundedBody } from "@/lib/public-form-guard";
export async function POST(request: Request) {
  try {
    const raw = await readBoundedBody(request, 256);
    if (raw.length > 256)
      return NextResponse.json(
        { error: "Invalid reference." },
        { status: 400 },
      );
    const { leadId } = JSON.parse(raw);
    if (typeof leadId !== "string" || !/^[a-f0-9-]{36}$/.test(leadId))
      return NextResponse.json(
        { error: "Invalid reference." },
        { status: 400 },
      );
    const result = await automationRequest("/v1/lead-status", { leadId });
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Delivery status is temporarily unavailable." },
      { status: 503 },
    );
  }
}
