import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const AIRTABLE_PRODUCTS_TABLE = process.env.AIRTABLE_PRODUCTS_TABLE ?? "Products";
const GENERATED_FORGE_DIR = path.join(process.cwd(), "content", "digital-forge", "generated");
const REVIEWER_FALLBACK = process.env.BUILDER_USER ?? "builder";

type BuilderAction = "approve_for_publish" | "request_revision" | "push_to_publish" | "push_distribution";

type ForgePublishing = {
  queueStatus?: string;
  websiteSyncStatus?: string;
  distributionStatus?: string;
  qualityFlags?: string[];
  reviewStatus?: string;
  reviewer?: string;
  reviewedAt?: string;
  approvalNotes?: string;
  revisionNotes?: string;
  launchStatus?: string;
  lastDistributionAttemptAt?: string;
  lastWebsiteSyncAt?: string;
};

type ForgeProduct = {
  airtableRecordId?: string;
  slug: string;
  title: string;
  status?: "draft" | "published";
  publishing?: ForgePublishing;
  [key: string]: unknown;
};

function nowIso(): string {
  return new Date().toISOString();
}

function resolveGeneratedPath(slug: string): string {
  return path.join(GENERATED_FORGE_DIR, `${slug}.json`);
}

function readLocalProduct(slug: string): ForgeProduct | null {
  const filePath = resolveGeneratedPath(slug);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as ForgeProduct;
  } catch {
    return null;
  }
}

function writeLocalProduct(product: ForgeProduct): void {
  const filePath = resolveGeneratedPath(product.slug);
  fs.writeFileSync(filePath, JSON.stringify(product, null, 2), "utf-8");
}

function canWriteLocalProduct(product: ForgeProduct): boolean {
  try {
    const filePath = resolveGeneratedPath(product.slug);
    const targetDir = path.dirname(filePath);
    return fs.existsSync(targetDir) && fs.existsSync(filePath || targetDir);
  } catch {
    return false;
  }
}

function applyAction(product: ForgeProduct, action: BuilderAction, notes?: string | null): ForgeProduct {
  const stamp = nowIso();
  const publishing: ForgePublishing = { ...(product.publishing ?? {}) };

  if (action === "approve_for_publish") {
    publishing.reviewStatus = "approved";
    publishing.queueStatus = "approved_for_publish";
    publishing.reviewer = publishing.reviewer || REVIEWER_FALLBACK;
    publishing.reviewedAt = stamp;
    if (notes && notes.trim()) publishing.approvalNotes = notes.trim();
  }

  if (action === "request_revision") {
    publishing.reviewStatus = "revision_requested";
    publishing.queueStatus = "needs_revision";
    publishing.reviewer = publishing.reviewer || REVIEWER_FALLBACK;
    publishing.reviewedAt = stamp;
    if (notes && notes.trim()) publishing.revisionNotes = notes.trim();
  }

  if (action === "push_to_publish") {
    product.status = "published";
    publishing.queueStatus = "published";
    publishing.websiteSyncStatus = publishing.websiteSyncStatus && publishing.websiteSyncStatus !== "failed"
      ? publishing.websiteSyncStatus
      : "pending";
    publishing.launchStatus = "website_live";
    publishing.lastWebsiteSyncAt = stamp;
    if (!publishing.reviewStatus || publishing.reviewStatus === "not_reviewed") {
      publishing.reviewStatus = "approved";
      publishing.reviewer = publishing.reviewer || REVIEWER_FALLBACK;
      publishing.reviewedAt = stamp;
    }
  }

  if (action === "push_distribution") {
    publishing.queueStatus = "distribution_pending";
    publishing.distributionStatus = "pending";
    publishing.launchStatus = "social_pending";
    publishing.lastDistributionAttemptAt = stamp;
  }

  return {
    ...product,
    publishing,
  };
}

function extractUnknownFieldName(detail: string): string | null {
  const match = detail.match(/Unknown field name: \"([^\"]+)\"/i);
  return match?.[1] ?? null;
}

async function patchAirtableRecord(recordId: string, product: ForgeProduct): Promise<void> {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) return;
  const endpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_PRODUCTS_TABLE)}/${recordId}`;
  const publishing = product.publishing ?? {};
  const fields: Record<string, string> = {
    "Website Status": product.status ?? "draft",
    "Queue Status": publishing.queueStatus ?? "draft",
    "Website Sync Status": publishing.websiteSyncStatus ?? "pending",
    "Distribution Status": publishing.distributionStatus ?? "pending",
    "Review Status": publishing.reviewStatus ?? "not_reviewed",
    "Reviewer": publishing.reviewer ?? "",
    "Reviewed At": publishing.reviewedAt ?? "",
    "Approval Notes": publishing.approvalNotes ?? "",
    "Revision Notes": publishing.revisionNotes ?? "",
    "Launch Status": publishing.launchStatus ?? "not_started",
    "Last Distribution Attempt At": publishing.lastDistributionAttemptAt ?? "",
    "Last Website Sync At": publishing.lastWebsiteSyncAt ?? "",
    "Website Payload JSON": JSON.stringify(product),
  };

  while (true) {
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    });

    if (response.ok) {
      return;
    }

    const detail = await response.text();
    const missingField = extractUnknownFieldName(detail);
    if (response.status === 422 && missingField && missingField in fields) {
      delete fields[missingField];
      continue;
    }

    throw new Error(`Airtable update failed: ${response.status} ${detail}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const slug = typeof payload.slug === "string" ? payload.slug.trim() : "";
    const action = payload.action as BuilderAction;
    const recordId = typeof payload.recordId === "string" ? payload.recordId.trim() : "";
    const notes = typeof payload.notes === "string" ? payload.notes : null;
    const currentProduct =
      payload.currentProduct && typeof payload.currentProduct === "object"
        ? (payload.currentProduct as ForgeProduct)
        : null;

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }
    if (!action || !["approve_for_publish", "request_revision", "push_to_publish", "push_distribution"].includes(action)) {
      return NextResponse.json({ error: "invalid action" }, { status: 400 });
    }

    const current =
      currentProduct ??
      readLocalProduct(slug) ??
      { slug, title: slug, status: "draft", publishing: {} };
    const updated = applyAction(current, action, notes);

    if (recordId) {
      await patchAirtableRecord(recordId, updated);
    }

    if (!recordId && canWriteLocalProduct(updated)) {
      try {
        writeLocalProduct(updated);
      } catch (error) {
        if (!(error instanceof Error) || !/EROFS|read-only file system/i.test(error.message)) {
          throw error;
        }
      }
    }

    return NextResponse.json({ ok: true, product: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
