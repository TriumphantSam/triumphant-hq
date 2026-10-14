import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

const GENERATED_FORGE_DIR = path.join(process.cwd(), "content", "digital-forge", "generated");
const GENERATED_FUNNELS_DIR = path.join(process.cwd(), "content", "digital-forge", "funnels");
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
  publishedAt?: string;
  lastDistributionAttemptAt?: string;
  lastWebsiteSyncAt?: string;
};

type ForgeProduct = {
  slug: string;
  title: string;
  status?: "draft" | "published";
  publishing?: ForgePublishing;
  [key: string]: unknown;
};

type FunnelPayload = {
  slug: string;
  status: "draft" | "needs_review" | "approved" | "published" | "archived";
  funnelType: string;
  campaignName: string;
  review?: {
    status?: string;
    notes?: string;
    approvedBy?: string;
    approvedAt?: string;
  };
  [key: string]: unknown;
};

function nowIso(): string {
  return new Date().toISOString();
}

function resolveProductPath(slug: string): string {
  return path.join(GENERATED_FORGE_DIR, `${slug}.json`);
}

function resolveFunnelPath(slug: string): string {
  return path.join(GENERATED_FUNNELS_DIR, `${slug}.json`);
}

function readJsonFile<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return null;
  }
}

function writeJsonFile(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function canWriteLocalFile(filePath: string): boolean {
  try {
    const targetDir = path.dirname(filePath);
    return fs.existsSync(targetDir);
  } catch {
    return false;
  }
}

function applyProductAction(product: ForgeProduct, action: BuilderAction, notes?: string | null): ForgeProduct {
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
    const firstPublish = product.status !== "published" && !publishing.publishedAt;
    product.status = "published";
    publishing.queueStatus = "published";
    publishing.websiteSyncStatus = publishing.websiteSyncStatus && publishing.websiteSyncStatus !== "failed"
      ? publishing.websiteSyncStatus
      : "pending";
    publishing.launchStatus = "website_live";
    if (firstPublish) {
      publishing.publishedAt = stamp;
    }
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

function applyFunnelAction(funnel: FunnelPayload, action: BuilderAction, notes?: string | null): FunnelPayload {
  const stamp = nowIso();
  const review = { ...(funnel.review ?? {}) };

  if (action === "approve_for_publish") {
    funnel.status = "approved";
    review.status = "approved";
    review.approvedBy = review.approvedBy || REVIEWER_FALLBACK;
    review.approvedAt = stamp;
    if (notes && notes.trim()) review.notes = notes.trim();
  }

  if (action === "request_revision") {
    funnel.status = "draft";
    review.status = "needs_review";
    if (notes && notes.trim()) review.notes = notes.trim();
  }

  if (action === "push_to_publish") {
    funnel.status = "published";
    review.status = "approved";
    review.approvedBy = review.approvedBy || REVIEWER_FALLBACK;
    review.approvedAt = review.approvedAt || stamp;
  }

  if (action === "push_distribution") {
    review.status = review.status || funnel.status;
  }

  return {
    ...funnel,
    review,
  };
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const slug = typeof payload.slug === "string" ? payload.slug.trim() : "";
    const action = payload.action as BuilderAction;
    const notes = typeof payload.notes === "string" ? payload.notes : null;
    const currentProduct = payload.currentProduct && typeof payload.currentProduct === "object"
      ? (payload.currentProduct as ForgeProduct)
      : null;
    const currentFunnel = payload.currentFunnel && typeof payload.currentFunnel === "object"
      ? (payload.currentFunnel as FunnelPayload)
      : null;

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }
    if (!action || !["approve_for_publish", "request_revision", "push_to_publish", "push_distribution"].includes(action)) {
      return NextResponse.json({ error: "invalid action" }, { status: 400 });
    }

    if (currentFunnel) {
      const filePath = resolveFunnelPath(slug);
      const current = currentFunnel ?? readJsonFile<FunnelPayload>(filePath) ?? {
        slug,
        status: "draft",
        funnelType: "evergreen_training",
        campaignName: slug,
        productSlug: slug,
      } as FunnelPayload;
      const updated = applyFunnelAction(current, action, notes);

      if (canWriteLocalFile(filePath)) {
        try {
          writeJsonFile(filePath, updated);
        } catch (error) {
          if (!(error instanceof Error) || !/EROFS|read-only file system/i.test(error.message)) {
            throw error;
          }
        }
      }

      return NextResponse.json({ ok: true, funnel: updated });
    }

    const filePath = resolveProductPath(slug);
    const current = currentProduct ?? readJsonFile<ForgeProduct>(filePath) ?? { slug, title: slug, status: "draft", publishing: {} };
    const updated = applyProductAction(current, action, notes);

    if (canWriteLocalFile(filePath)) {
      try {
        writeJsonFile(filePath, updated);
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
