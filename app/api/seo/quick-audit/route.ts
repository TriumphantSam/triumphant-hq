import { NextResponse } from "next/server";
import { runHostedSeoAudit } from "@/lib/seo-node-client";
import {
  runSeoAudit,
  AuditTargetError,
  normalizeAuditUrl,
} from "@/lib/seo-audit";
import { captureLead } from "@/lib/lead-capture";
import {
  readPublicForm,
  field,
  validateLead,
  FormError,
} from "@/lib/public-form-guard";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await readPublicForm(request);
    const name = field(body, "name", 121),
      email = field(body, "email", 255),
      websiteUrl = field(body, "websiteUrl");
    validateLead(name, email);
    normalizeAuditUrl(websiteUrl);
    const leadPromise = captureLead({
      name,
      email,
      source: "seo_snapshot",
      service: "SEO snapshot",
      message: `Website: ${websiteUrl}\nBusiness: ${field(body, "businessType", 120)}\n${field(body, "notes")}`,
      consentMarketing: body.consentMarketing === true,
    }).catch(() => ({ stored: false, leadId: "", destination: "none" }));
    const audit = await (process.env.HOSTING_PLATFORM === "cloudflare"
      ? runHostedSeoAudit(websiteUrl)
      : runSeoAudit(websiteUrl)).catch((error) => ({
      ok: false as const,
      error:
        error instanceof AuditTargetError
          ? error.message
          : "We could not reach that website in time. Check the address or ask us for a manual audit.",
    }));
    const lead = await leadPromise;
    return NextResponse.json(
      { ...audit, leadId: lead.leadId, leadStored: lead.stored },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const status =
      error instanceof FormError
        ? error.status
        : error instanceof AuditTargetError
          ? 400
          : 503;
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof FormError || error instanceof AuditTargetError
            ? error.message
            : "The snapshot service is temporarily unavailable. Please try again.",
      },
      { status },
    );
  }
}
