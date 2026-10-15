import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminSession,
  validAdminSession,
  validAdminPassword,
} from "@/lib/admin-lab-auth";
import { automationRequest, AutomationError } from "@/lib/automation-api";
import {
  readBoundedBody,
  readPublicForm,
  FormError,
} from "@/lib/public-form-guard";
export async function POST(request: Request) {
  try {
    if (request.headers.get("origin") !== new URL(request.url).origin)
      throw new FormError("Invalid request origin.", 403);
    const raw = await readBoundedBody(request, 12288);
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      throw new FormError("Invalid request.");
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new FormError("Invalid request.");
    const store = await cookies();
    if (body?.action === "login") {
      await readPublicForm(
        new Request(request.url, {
          method: "POST",
          headers: request.headers,
          body: raw,
        }),
      );
      if (
        typeof body.password !== "string" ||
        !validAdminPassword(body.password)
      )
        throw new FormError("Unable to sign in.", 401);
      store.set(ADMIN_COOKIE, adminSession(), {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 8 * 3600,
      });
      return NextResponse.json({ ok: true });
    }
    if (!validAdminSession(store.get(ADMIN_COOKIE)?.value))
      throw new FormError("Please sign in.", 401);
    if (body.action === "logout") {
      store.delete(ADMIN_COOKIE);
      return NextResponse.json({ ok: true });
    }
    if (
      ![
        "complete_booking",
        "generate_drafts",
        "approve_draft",
        "update_lead",
      ].includes(body.action)
    )
      throw new FormError("Invalid action.");
    return NextResponse.json(
      await automationRequest("/v1/admin/action", {
        action: body.action,
        id: body.id,
        ...(body.action === "update_lead"
          ? {
              status: body.status,
              notes: body.notes,
              updatedAt: body.updatedAt,
            }
          : {}),
      }),
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof FormError || error instanceof AutomationError
            ? error.message
            : "This action could not be completed.",
      },
      {
        status:
          error instanceof FormError || error instanceof AutomationError
            ? error.status
            : 503,
      },
    );
  }
}
