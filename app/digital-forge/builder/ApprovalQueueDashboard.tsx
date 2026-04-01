"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ForgeProduct, ForgePublishing } from "@/lib/digital-forge";

// ─── Types ────────────────────────────────────────────────────────

type QueueStatus =
  | "draft"
  | "ready_for_review"
  | "needs_revision"
  | "approved_for_publish"
  | "published"
  | "distribution_pending"
  | "distribution_complete"
  | "archived";

type View = "queue" | "launch_ops" | "store_health" | "blocked";
type BuilderAction = "approve_for_publish" | "request_revision" | "push_to_publish" | "push_distribution";

// ─── Constants ────────────────────────────────────────────────────

const QUEUE_LANES: { status: QueueStatus; label: string; color: string; bg: string; desc: string }[] = [
  { status: "ready_for_review",     label: "Needs Review",          color: "#f59e0b", bg: "rgba(245,158,11,0.08)",   desc: "Awaiting editorial approval" },
  { status: "needs_revision",       label: "Needs Revision",        color: "#f97316", bg: "rgba(249,115,22,0.08)",  desc: "Flagged — revisions requested" },
  { status: "approved_for_publish", label: "Approved to Publish",   color: "#00CCFF", bg: "rgba(0,204,255,0.07)",   desc: "Cleared — ready to go live" },
  { status: "published",            label: "Published",             color: "#10b981", bg: "rgba(16,185,129,0.07)", desc: "Live on the public store" },
  { status: "distribution_pending", label: "Distribution Pending",  color: "#8b5cf6", bg: "rgba(139,92,246,0.07)", desc: "Published but channels not sent" },
  { status: "draft",                label: "Draft",                 color: "#64748b", bg: "rgba(100,116,139,0.06)", desc: "Generated — not yet in review" },
];

// ─── Helpers ──────────────────────────────────────────────────────

function pub(p: ForgeProduct): ForgePublishing {
  return (p as unknown as Record<string, unknown>).publishing as ForgePublishing ?? {};
}

function has(val: unknown): boolean {
  if (val === null || val === undefined) return false;
  if (typeof val === "string") return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  return Boolean(val);
}

function getQueueStatus(p: ForgeProduct): QueueStatus {
  const block = pub(p);
  const qs = block.queueStatus;
  if (qs && ["draft","ready_for_review","needs_revision","approved_for_publish","published","distribution_pending","distribution_complete","archived"].includes(qs)) {
    return qs as QueueStatus;
  }
  // Derive from existing fields
  if (p.status === "published") {
    const distDone = block.distributionStatus === "sent" || block.distributionStatus === "done";
    return distDone ? "distribution_complete" : "distribution_pending";
  }
  const flags = block.qualityFlags ?? [];
  if (flags.length > 0) return "needs_revision";
  return "draft";
}

function getPageChecks(p: ForgeProduct) {
  const r = p as unknown as Record<string, unknown>;
  return [
    { label: "Headline",     ok: has(p.headline) },
    { label: "Subheadline",  ok: has(p.subheadline) },
    { label: "Problem",      ok: has(p.problem) },
    { label: "Deliverables", ok: has(p.deliverables) },
    { label: "FAQ",          ok: has(p.faq) },
    { label: "Cover Image",  ok: has(r.coverImageUrl) },
  ];
}

function getPageScore(p: ForgeProduct): number {
  return getPageChecks(p).filter((c) => c.ok).length;
}

function getPriority(p: ForgeProduct): "high" | "medium" | "urgent" {
  const qs = getQueueStatus(p);
  const score = getPageScore(p);
  const flags = (pub(p).qualityFlags ?? []).length;

  if (qs === "published" && pub(p).websiteSyncStatus === "pending") return "urgent";
  if (qs === "approved_for_publish" && pub(p).distributionStatus === "pending") return "urgent";
  if (qs === "ready_for_review" && score >= 5 && flags === 0) return "high";
  return "medium";
}

function applyUpdatedProduct(products: ForgeProduct[], updated: ForgeProduct): ForgeProduct[] {
  return products.map((item) => (item.slug === updated.slug ? updated : item));
}

async function runBuilderActionRequest(product: ForgeProduct, action: BuilderAction, notes?: string | null) {
  const response = await fetch("/api/digital-forge/builder/actions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slug: product.slug,
      recordId: product.airtableRecordId,
      action,
      notes,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "Builder action failed");
  }
  return data.product as ForgeProduct;
}

// ─── Sub-components (all inline for single-file client component) ──

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span style={{
      display: "inline-block", width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
      background: ok ? "#10b981" : "rgba(255,255,255,0.14)",
      boxShadow: ok ? "0 0 5px #10b981" : "none",
    }} />
  );
}

function StatusRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.2rem 0" }}>
      <StatusDot ok={ok} />
      <span style={{ fontSize: "0.75rem", color: ok ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.28)", fontWeight: ok ? 500 : 400 }}>
        {label}
      </span>
    </div>
  );
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.25rem",
      background: bg, border: `1px solid ${color}40`, borderRadius: "100px",
      padding: "0.18rem 0.65rem", fontSize: "0.65rem", fontWeight: 700,
      color, letterSpacing: "0.12em", textTransform: "uppercase",
    }}>
      {label}
    </span>
  );
}

function MiniPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "0.75rem 0.9rem" }}>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{title}</p>
      {children}
    </div>
  );
}

// ─── Product Detail Drawer ────────────────────────────────────────

function ProductDetailDrawer({ product, onClose, onAction, actionPending }: { product: ForgeProduct; onClose: () => void; onAction: (action: BuilderAction, product: ForgeProduct) => void; actionPending: BuilderAction | null; }) {
  const block = pub(product);
  const r = product as unknown as Record<string, unknown>;
  const flags = block.qualityFlags ?? [];
  const checks = getPageChecks(product);
  const score = getPageScore(product);
  const qs = getQueueStatus(product);
  const laneMeta = QUEUE_LANES.find((l) => l.status === qs);

  const distChannels = [
    { name: "Telegram",  ok: false },
    { name: "WhatsApp",  ok: false },
    { name: "LinkedIn",  ok: false },
    { name: "Facebook",  ok: false },
    { name: "Instagram", ok: false },
    { name: "X",         ok: false },
  ];
  const distDone = block.distributionStatus === "sent" || block.distributionStatus === "done";
  if (distDone) distChannels.forEach((c) => { c.ok = true; });

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40, backdropFilter: "blur(2px)" }} />

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "min(640px, 100vw)",
        background: "rgba(6,10,25,0.98)", borderLeft: "1px solid rgba(255,255,255,0.08)",
        zIndex: 50, overflowY: "auto", padding: "2rem 1.75rem",
      }}>
        {/* Close */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            Product Workspace
          </span>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "0.35rem 0.75rem", color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", cursor: "pointer" }}>
            ✕ Close
          </button>
        </div>

        {/* Block 1: Identity */}
        <div style={{ marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
            {laneMeta && <Badge label={laneMeta.label} color={laneMeta.color} bg={laneMeta.bg} />}
            <Badge label={product.category} color="rgba(255,255,255,0.5)" bg="rgba(255,255,255,0.04)" />
            {product.generationProfile && <Badge label={product.generationProfile} color="#a78bfa" bg="rgba(124,58,237,0.1)" />}
          </div>
          <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem", marginBottom: "0.35rem", lineHeight: 1.3 }}>{product.title}</h2>
          <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.72rem", fontFamily: "monospace", marginBottom: "0.5rem" }}>/digital-forge/products/{product.slug}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
            {[
              { k: "Format",      v: product.format },
              { k: "Status",      v: product.status ?? "draft" },
              { k: "Queue",       v: block.queueStatus ?? "derived" },
              { k: "Profile",     v: product.generationProfile ?? "—" },
              { k: "Review",      v: block.reviewStatus ?? "not_reviewed" },
              { k: "Launch",      v: block.launchStatus ?? "not_started" },
            ].map(({ k, v }) => (
              <div key={k} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "6px", padding: "0.45rem 0.6rem" }}>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>{k}</div>
                <div style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.78rem", fontWeight: 600 }}>{String(v)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Block 2: Page Quality */}
        <div style={{ marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>Page Quality</p>
            <span style={{ background: score >= 5 ? "rgba(16,185,129,0.12)" : "rgba(249,115,22,0.12)", border: `1px solid ${score >= 5 ? "rgba(16,185,129,0.3)" : "rgba(249,115,22,0.3)"}`, borderRadius: "100px", padding: "0.18rem 0.6rem", fontSize: "0.67rem", fontWeight: 700, color: score >= 5 ? "#10b981" : "#f97316" }}>
              {score}/{checks.length}
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
            {checks.map((c) => (
              <span key={c.label} style={{
                background: c.ok ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${c.ok ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: "100px", padding: "0.18rem 0.55rem",
                fontSize: "0.65rem", fontWeight: 600,
                color: c.ok ? "#10b981" : "rgba(255,255,255,0.28)",
              }}>
                {c.ok ? "✓" : "○"} {c.label}
              </span>
            ))}
          </div>
          {flags.length > 0 && (
            <div style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.18)", borderRadius: "8px", padding: "0.75rem 0.9rem" }}>
              <p style={{ color: "#f97316", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.4rem" }}>⚠ Quality Flags</p>
              {flags.map((f, i) => <p key={i} style={{ color: "rgba(249,115,22,0.75)", fontSize: "0.75rem", lineHeight: 1.6 }}>· {f}</p>)}
            </div>
          )}
          {has(product.headline) && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem 0.9rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", borderLeft: "3px solid rgba(0,204,255,0.3)" }}>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Headline</p>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.82rem", lineHeight: 1.55 }}>{product.headline}</p>
            </div>
          )}
          {has(product.subheadline) && (
            <div style={{ marginTop: "0.5rem", padding: "0.75rem 0.9rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px" }}>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Subheadline</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", lineHeight: 1.55 }}>{product.subheadline}</p>
            </div>
          )}
        </div>

        {/* Block 3: Approval Decision */}
        <div style={{ marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Approval Decision</p>
          <div style={{ display: "grid", gap: "0.4rem", marginBottom: "0.85rem" }}>
            {[
              { k: "Review status",  v: block.reviewStatus ?? "not_reviewed" },
              { k: "Reviewer",       v: block.reviewer ?? "—" },
              { k: "Reviewed at",    v: block.reviewedAt ?? "—" },
            ].map(({ k, v }) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.73rem" }}>{k}</span>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.73rem", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          {block.approvalNotes && (
            <div style={{ padding: "0.6rem 0.8rem", background: "rgba(16,185,129,0.06)", borderRadius: "7px", marginBottom: "0.5rem" }}>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Approval Notes</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", lineHeight: 1.6 }}>{block.approvalNotes}</p>
            </div>
          )}
          {block.revisionNotes && (
            <div style={{ padding: "0.6rem 0.8rem", background: "rgba(249,115,22,0.06)", borderRadius: "7px" }}>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Revision Notes</p>
              <p style={{ color: "rgba(249,115,22,0.75)", fontSize: "0.75rem", lineHeight: 1.6 }}>{block.revisionNotes}</p>
            </div>
          )}
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "1rem" }}>
            {[
              { action: "approve_for_publish" as BuilderAction, label: "Approve for Publish", color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)" },
              { action: "request_revision" as BuilderAction, label: "Request Revision", color: "#f97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.3)" },
              { action: "push_to_publish" as BuilderAction, label: "Push to Publish", color: "#00CCFF", bg: "rgba(0,204,255,0.08)", border: "rgba(0,204,255,0.3)" },
              { action: "push_distribution" as BuilderAction, label: "Push Distribution", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.3)" },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => onAction(btn.action, product)}
                disabled={actionPending !== null}
                style={{ padding: "0.5rem 0.9rem", background: btn.bg, border: `1px solid ${btn.border}`, borderRadius: "7px", color: btn.color, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", cursor: actionPending ? "wait" : "pointer", opacity: actionPending && actionPending !== btn.action ? 0.55 : 1 }}>
                {actionPending === btn.action ? "Working…" : btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Block 4: Publishing State */}
        <div style={{ marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Publishing State</p>
          <StatusRow ok={has(product.headline) && has(product.deliverables)} label="Website payload present" />
          <StatusRow ok={product.status === "published"} label={`Website status: ${product.status ?? "draft"}`} />
          <StatusRow ok={block.websiteSyncStatus === "synced" || block.websiteSyncStatus === "success"} label={`Airtable sync: ${block.websiteSyncStatus ?? "pending"}`} />
          <StatusRow ok={product.status === "published" && getPageScore(product) >= 5} label="Live eligible" />
          {block.lastWebsiteSyncAt && (
            <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.7rem", marginTop: "0.5rem" }}>Last sync: {block.lastWebsiteSyncAt}</p>
          )}
          {product.status === "published" && (
            <Link href={`/digital-forge/products/${product.slug}`} target="_blank"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", marginTop: "0.65rem", color: "#00CCFF", fontSize: "0.72rem", fontWeight: 600, textDecoration: "none" }}>
              Open Live Page ↗
            </Link>
          )}
        </div>

        {/* Block 5: Asset Readiness */}
        <div style={{ marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Asset Readiness</p>
          <StatusRow ok={has(r.bundlePdfPath)}    label="PDF ebook" />
          <StatusRow ok={has(r.bundleZipPath)}    label="ZIP bundle" />
          <StatusRow ok={has(r.driveFolderLink)}  label="Drive folder" />
          <StatusRow ok={has(r.coverImageUrl)}    label="Cover asset" />
          <StatusRow ok={has(product.includes)}   label="Prompt pack & templates" />
          <StatusRow ok={has(product.seo)}        label="SEO pack" />
          {has(r.driveFolderLink) && (
            <a href={r.driveFolderLink as string} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", marginTop: "0.6rem", color: "#a78bfa", fontSize: "0.72rem", fontWeight: 600, textDecoration: "none" }}>
              Open Drive Folder ↗
            </a>
          )}
        </div>

        {/* Block 6: Distribution Matrix */}
        <div>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Distribution Matrix</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {distChannels.map((ch) => (
              <div key={ch.name} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "rgba(255,255,255,0.03)", borderRadius: "7px", padding: "0.5rem 0.7rem",
                border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", fontWeight: 500 }}>{ch.name}</span>
                <span style={{
                  fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: ch.ok ? "#10b981" : "rgba(255,255,255,0.28)",
                }}>
                  {ch.ok ? "sent" : "pending"}
                </span>
              </div>
            ))}
          </div>
          {block.lastDistributionAttemptAt && (
            <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.7rem", marginTop: "0.6rem" }}>Last attempt: {block.lastDistributionAttemptAt}</p>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Queue Product Card ───────────────────────────────────────────

function QueueProductCard({ product, onSelect, onQuickAction, actionPending }: { product: ForgeProduct; onSelect: () => void; onQuickAction: (action: BuilderAction, product: ForgeProduct) => void; actionPending: BuilderAction | null; }) {
  const block = pub(product);
  const qs = getQueueStatus(product);
  const laneMeta = QUEUE_LANES.find((l) => l.status === qs)!;
  const score = getPageScore(product);
  const checks = getPageChecks(product);
  const priority = getPriority(product);
  const flags = block.qualityFlags ?? [];
  const r = product as unknown as Record<string, unknown>;

  const priorityColor = priority === "urgent" ? "#ef4444" : priority === "high" ? "#00CCFF" : "rgba(255,255,255,0.28)";

  return (
    <div style={{
      background: "rgba(6,10,25,0.9)", border: "1px solid rgba(255,255,255,0.07)",
      borderTop: `3px solid ${laneMeta.color}`, borderRadius: "14px", overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      {/* Card Header */}
      <div style={{ padding: "1rem 1.1rem 0.75rem" }}>
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.55rem", alignItems: "center" }}>
          <Badge label={laneMeta.label} color={laneMeta.color} bg={laneMeta.bg} />
          <Badge label={product.category} color="rgba(255,255,255,0.4)" bg="rgba(255,255,255,0.04)" />
          {product.generationProfile && (
            <Badge label={product.generationProfile} color="#a78bfa" bg="rgba(124,58,237,0.08)" />
          )}
          <span style={{
            background: score >= 5 ? "rgba(16,185,129,0.1)" : "rgba(249,115,22,0.1)",
            border: `1px solid ${score >= 5 ? "rgba(16,185,129,0.25)" : "rgba(249,115,22,0.25)"}`,
            borderRadius: "6px", padding: "0.15rem 0.5rem",
            fontSize: "0.62rem", fontWeight: 700,
            color: score >= 5 ? "#10b981" : "#f97316",
          }}>
            {score}/{checks.length}
          </span>
          {priority !== "medium" && (
            <span style={{ fontSize: "0.62rem", fontWeight: 700, color: priorityColor, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {priority === "urgent" ? "⚡ Urgent" : "↑ High priority"}
            </span>
          )}
        </div>

        <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "0.92rem", lineHeight: 1.3, marginBottom: "0.25rem" }}>
          {product.title}
        </h3>
        <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.7rem", fontFamily: "monospace" }}>
          /{product.slug}
        </p>
      </div>

      {/* Quality flag strip */}
      {flags.length > 0 && (
        <div style={{ padding: "0.45rem 1.1rem", background: "rgba(249,115,22,0.05)", borderTop: "1px solid rgba(249,115,22,0.12)", borderBottom: "1px solid rgba(249,115,22,0.08)" }}>
          <span style={{ color: "#f97316", fontSize: "0.68rem", fontWeight: 700 }}>⚠ {flags.length} flag{flags.length > 1 ? "s" : ""}</span>
        </div>
      )}

      {/* 3 mini panels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", padding: "0.75rem 1.1rem" }}>
        <MiniPanel title="Page">
          <StatusRow ok={has(product.headline)} label="Headline" />
          <StatusRow ok={has(product.deliverables)} label="Deliverables" />
          <StatusRow ok={has(product.faq)} label="FAQ" />
        </MiniPanel>
        <MiniPanel title="Publish">
          <StatusRow ok={product.status === "published"} label={product.status ?? "draft"} />
          <StatusRow ok={block.websiteSyncStatus === "synced" || block.websiteSyncStatus === "success"} label="Airtable" />
          <StatusRow ok={has(r.bundlePdfPath)} label="PDF" />
        </MiniPanel>
        <MiniPanel title="Distrib.">
          <StatusRow ok={block.distributionStatus === "sent" || block.distributionStatus === "done"} label={block.distributionStatus ?? "pending"} />
          <StatusRow ok={has(r.driveFolderLink)} label="Drive" />
          <StatusRow ok={has(r.coverImageUrl)} label="Cover" />
        </MiniPanel>
      </div>

      {/* Action footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 1.1rem", borderTop: "1px solid rgba(255,255,255,0.05)", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={onSelect}
            style={{ padding: "0.42rem 0.9rem", background: `${laneMeta.color}20`, border: `1px solid ${laneMeta.color}50`, borderRadius: "7px", color: laneMeta.color, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", letterSpacing: "0.08em" }}>
            Review →
          </button>
          {product.status === "published" && (
            <Link href={`/digital-forge/products/${product.slug}`} target="_blank"
              style={{ display: "inline-flex", alignItems: "center", padding: "0.42rem 0.9rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "7px", color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 700, textDecoration: "none" }}>
              Live ↗
            </Link>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {[
            { label: "Approve", action: "approve_for_publish" as BuilderAction },
            { label: "Revision", action: "request_revision" as BuilderAction },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => onQuickAction(a.action, product)}
              disabled={actionPending !== null}
              style={{ padding: "0.38rem 0.7rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", color: actionPending === a.action ? "#00CCFF" : "rgba(255,255,255,0.55)", fontSize: "0.65rem", fontWeight: 600, cursor: actionPending ? "wait" : "pointer" }}>
              {actionPending === a.action ? "Working…" : a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Queue Lane ───────────────────────────────────────────────────

function QueueLane({ lane, products, onSelect, onQuickAction, busySlug, busyAction }: {
  lane: typeof QUEUE_LANES[0];
  products: ForgeProduct[];
  onSelect: (p: ForgeProduct) => void;
  onQuickAction: (action: BuilderAction, product: ForgeProduct) => void;
  busySlug: string | null;
  busyAction: BuilderAction | null;
}) {
  const [collapsed, setCollapsed] = useState(products.length === 0);

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <button onClick={() => setCollapsed(!collapsed)}
        style={{
          display: "flex", alignItems: "center", gap: "0.75rem", width: "100%",
          padding: "0.75rem 1rem", background: lane.bg,
          border: `1px solid ${lane.color}30`, borderRadius: "10px",
          cursor: "pointer", marginBottom: collapsed ? 0 : "0.85rem", transition: "all 0.2s",
        }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: lane.color, boxShadow: `0 0 6px ${lane.color}`, flexShrink: 0, display: "inline-block" }} />
        <span style={{ color: lane.color, fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.04em", flex: 1, textAlign: "left" }}>{lane.label}</span>
        <span style={{ background: `${lane.color}20`, border: `1px solid ${lane.color}40`, borderRadius: "100px", padding: "0.12rem 0.55rem", fontSize: "0.68rem", fontWeight: 700, color: lane.color }}>{products.length}</span>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.8rem" }}>{collapsed ? "▸" : "▾"}</span>
      </button>

      {!collapsed && products.length === 0 && (
        <div style={{ padding: "1.25rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "0.78rem" }}>
          No products in this lane
        </div>
      )}

      {!collapsed && products.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.85rem" }}>
          {products.map((p) => (
            <QueueProductCard key={p.slug} product={p} onSelect={() => onSelect(p)} onQuickAction={onQuickAction} actionPending={busySlug === p.slug ? busyAction : null} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export default function ApprovalQueueDashboard({ products }: { products: ForgeProduct[] }) {
  const router = useRouter();
  const [activeView, setActiveView] = useState<View>("queue");
  const [productState, setProductState] = useState<ForgeProduct[]>(products);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [actionError, setActionError] = useState("");
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<BuilderAction | null>(null);
  const [, startTransition] = useTransition();

  const categories = useMemo(() => {
    const cats = Array.from(new Set(productState.map((p) => p.category)));
    return ["all", ...cats];
  }, [productState]);

  // Filter logic
  const filtered = useMemo(() => {
    return productState.filter((p) => {
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCategory === "all" || p.category === filterCategory;
      const qs = getQueueStatus(p);
      const flags = (pub(p).qualityFlags ?? []).length;

      if (activeView === "launch_ops") return matchSearch && matchCat && ["approved_for_publish", "published", "distribution_pending"].includes(qs);
      if (activeView === "store_health") return matchSearch && matchCat && ["published"].includes(qs);
      if (activeView === "blocked") return matchSearch && matchCat && (flags > 0 || qs === "needs_revision");
      return matchSearch && matchCat;
    });
  }, [productState, search, filterCategory, activeView]);

  // Summary counts
  const counts = useMemo(() => ({
    total:    productState.length,
    review:   productState.filter((p) => getQueueStatus(p) === "ready_for_review").length,
    revision: productState.filter((p) => getQueueStatus(p) === "needs_revision").length,
    approved: productState.filter((p) => getQueueStatus(p) === "approved_for_publish").length,
    live:     productState.filter((p) => getQueueStatus(p) === "published").length,
    distPend: productState.filter((p) => getQueueStatus(p) === "distribution_pending").length,
    blocked:  productState.filter((p) => (pub(p).qualityFlags ?? []).length > 0).length,
  }), [productState]);

  const selectedProduct = selectedSlug ? productState.find((item) => item.slug === selectedSlug) ?? null : null;

  async function handleAction(action: BuilderAction, product: ForgeProduct) {
    let notes: string | null | undefined = undefined;
    if (action === "approve_for_publish") {
      const value = window.prompt("Optional approval note", product.publishing?.approvalNotes ?? "");
      if (value === null) return;
      notes = value;
    }
    if (action === "request_revision") {
      const value = window.prompt("Revision note for the builder", product.publishing?.revisionNotes ?? "");
      if (value === null) return;
      notes = value;
    }

    try {
      setActionError("");
      setBusySlug(product.slug);
      setBusyAction(action);
      const updated = await runBuilderActionRequest(product, action, notes);
      setProductState((current) => applyUpdatedProduct(current, updated));
      if (selectedSlug === product.slug) {
        setSelectedSlug(updated.slug);
      }
      startTransition(() => router.refresh());
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Builder action failed");
    } finally {
      setBusySlug(null);
      setBusyAction(null);
    }
  }

  const views: { id: View; label: string }[] = [
    { id: "queue",       label: "Queue" },
    { id: "launch_ops",  label: "Launch Ops" },
    { id: "store_health",label: "Store Health" },
    { id: "blocked",     label: "Blocked" },
  ];

  return (
    <>
      {/* Detail drawer */}
      {selectedProduct && (
        <ProductDetailDrawer
          product={selectedProduct}
          onClose={() => setSelectedSlug(null)}
          onAction={handleAction}
          actionPending={busySlug === selectedProduct.slug ? busyAction : null}
        />
      )}

      <div className="min-h-screen pb-24">

        {/* ── Header ── */}
        <section className="relative pt-32 pb-8">
          <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(0,102,255,0.08)", border: "1px solid rgba(0,102,255,0.25)", borderRadius: "100px", padding: "0.3rem 0.9rem", marginBottom: "0.85rem" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00CCFF", boxShadow: "0 0 6px #00CCFF", display: "inline-block" }} />
                  <span style={{ color: "#00CCFF", fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>Internal — Digital Forge Command Center</span>
                </div>
                <h1 style={{ fontSize: "clamp(1.7rem, 4vw, 2.6rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "0.4rem" }}>
                  Approval Queue &amp; Launch Dashboard
                </h1>
                <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.85rem", maxWidth: "520px" }}>
                  Review products, approve publishing, track live sync, and monitor distribution from one place.
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                <Link href="/digital-forge/products" style={{ display: "inline-flex", alignItems: "center", padding: "0.55rem 1rem", background: "rgba(0,102,255,0.08)", border: "1px solid rgba(0,102,255,0.25)", borderRadius: "8px", color: "#00CCFF", textDecoration: "none", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Live Store ↗
                </Link>
                <Link href="/digital-forge" style={{ display: "inline-flex", alignItems: "center", padding: "0.55rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "rgba(255,255,255,0.45)", textDecoration: "none", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Product Library
                </Link>
              </div>
            </div>

            {/* Doctrine strip */}
            <div style={{ padding: "0.8rem 1.1rem", background: "rgba(0,102,255,0.05)", border: "1px solid rgba(0,102,255,0.13)", borderRadius: "9px", marginBottom: "1.5rem" }}>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", lineHeight: 1.7 }}>
                <strong style={{ color: "rgba(0,204,255,0.6)" }}>Pipeline:</strong> Digital Forge products move through a controlled pipeline: generated → reviewed → approved → published → distributed. This dashboard shows where each product stands and what needs action next.
              </p>
            </div>

            {/* Summary cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {[
                { label: "Total",             value: counts.total,    color: "#0066FF" },
                { label: "Queued for Review", value: counts.review,   color: "#f59e0b" },
                { label: "Needs Revision",    value: counts.revision, color: "#f97316" },
                { label: "Approved",          value: counts.approved, color: "#00CCFF" },
                { label: "Live",              value: counts.live,     color: "#10b981" },
                { label: "Dist. Pending",     value: counts.distPend, color: "#8b5cf6" },
                { label: "Blocked",           value: counts.blocked,  color: "#ef4444" },
              ].map((s) => (
                <div key={s.label} style={{ background: "rgba(5,8,20,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: `3px solid ${s.color}`, borderRadius: "10px", padding: "0.8rem 0.9rem" }}>
                  <div style={{ fontSize: "1.75rem", fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: "0.2rem" }}>{s.value}</div>
                  <div style={{ fontSize: "0.63rem", color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", lineHeight: 1.3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── View Switcher + Filters ── */}
        <section>
          <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
              {/* View tabs */}
              <div style={{ display: "flex", gap: "0.4rem", background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "0.3rem" }}>
                {views.map((v) => (
                  <button key={v.id} onClick={() => setActiveView(v.id)}
                    style={{
                      padding: "0.4rem 0.85rem", borderRadius: "7px", fontSize: "0.75rem", fontWeight: 700,
                      cursor: "pointer", letterSpacing: "0.06em", border: "none",
                      background: activeView === v.id ? "rgba(0,102,255,0.2)" : "transparent",
                      color: activeView === v.id ? "#00CCFF" : "rgba(255,255,255,0.4)",
                      outline: activeView === v.id ? "1px solid rgba(0,102,255,0.3)" : "none",
                    }}>
                    {v.label}
                  </button>
                ))}
              </div>

              {/* Filters */}
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title or slug…"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.42rem 0.75rem", color: "#fff", fontSize: "0.78rem", width: "200px", outline: "none" }} />
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                  style={{ background: "rgba(5,8,20,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.42rem 0.75rem", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", outline: "none", cursor: "pointer" }}>
                  {categories.map((c) => <option key={c} value={c}>{c === "all" ? "All categories" : c}</option>)}
                </select>
              </div>
            </div>

            {actionError && (
              <div style={{ marginBottom: "1rem", padding: "0.75rem 0.95rem", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "9px", color: "rgba(248,113,113,0.9)", fontSize: "0.78rem" }}>
                {actionError}
              </div>
            )}

            {/* View label */}
            <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.72rem", marginBottom: "1.25rem", fontStyle: "italic" }}>
              {activeView === "queue"        && `Showing all ${filtered.length} products grouped by queue stage.`}
              {activeView === "launch_ops"   && `Showing ${filtered.length} products in approved/published/distribution state.`}
              {activeView === "store_health" && `Showing ${filtered.length} live products and their sync health.`}
              {activeView === "blocked"      && `Showing ${filtered.length} products blocked by flags or revision requests.`}
            </p>

            {/* Queue Lanes or flat list */}
            {activeView === "queue" ? (
              QUEUE_LANES.map((lane) => (
                <QueueLane
                  key={lane.status}
                  lane={lane}
                  products={filtered.filter((p) => getQueueStatus(p) === lane.status)}
                  onSelect={(product) => setSelectedSlug(product.slug)}
                  onQuickAction={handleAction}
                  busySlug={busySlug}
                  busyAction={busyAction}
                />
              ))
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.85rem" }}>
                {filtered.length === 0 ? (
                  <div style={{ gridColumn: "1/-1", padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "0.85rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                    No products match this view.
                  </div>
                ) : (
                  filtered.map((p) => (
                    <QueueProductCard key={p.slug} product={p} onSelect={() => setSelectedSlug(p.slug)} onQuickAction={handleAction} actionPending={busySlug === p.slug ? busyAction : null} />
                  ))
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
