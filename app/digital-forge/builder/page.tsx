import Link from "next/link";
import { getForgeProducts, ForgeProduct } from "@/lib/digital-forge";

export const metadata = {
  title: "Digital Forge Builder | Triumphant HQ",
  description: "Internal product pipeline and lifecycle status panel.",
  robots: { index: false, follow: false },
};

// ─── Types ────────────────────────────────────────────────────────

type PublishingBlock = {
  queueStatus?: string;      // "ready_for_review" | "published" | "draft"
  websiteSyncStatus?: string; // "pending" | "synced" | "success"
  distributionStatus?: string; // "pending" | "sent" | "done"
  qualityFlags?: string[];
};

type LiveMode =
  | "live-published"     // status=published, payload ok, page strong
  | "published-pending"  // status=published, sync still pending
  | "review-needed"      // flags present or page incomplete
  | "draft-only";        // status=draft

// ─── Helpers ─────────────────────────────────────────────────────

function pub(p: ForgeProduct): PublishingBlock {
  return ((p as unknown as Record<string, unknown>).publishing ?? {}) as PublishingBlock;
}

function raw(p: ForgeProduct): Record<string, unknown> {
  return p as unknown as Record<string, unknown>;
}

function has(val: unknown): boolean {
  if (val === null || val === undefined) return false;
  if (typeof val === "string") return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  return Boolean(val);
}

function getLiveMode(p: ForgeProduct): LiveMode {
  const block = pub(p);
  const flags = block.qualityFlags ?? [];
  const isPublished = p.status === "published";
  const hasSyncedAirtable =
    block.websiteSyncStatus === "synced" || block.websiteSyncStatus === "success";

  if (!isPublished) return "draft-only";
  if (flags.length > 0) return "review-needed";
  if (isPublished && hasSyncedAirtable) return "live-published";
  if (isPublished) return "published-pending";
  return "draft-only";
}

const LIVE_MODE_META: Record<LiveMode, { label: string; color: string; bg: string; dot: string }> = {
  "live-published":    { label: "Published · Live",          color: "#10b981", bg: "rgba(16,185,129,0.12)",  dot: "✦" },
  "published-pending": { label: "Published · Sync Pending",  color: "#f59e0b", bg: "rgba(245,158,11,0.12)", dot: "◑" },
  "review-needed":     { label: "Live Review Needed",        color: "#f97316", bg: "rgba(249,115,22,0.12)", dot: "⚠" },
  "draft-only":        { label: "Draft Only",                color: "#64748b", bg: "rgba(100,116,139,0.1)",  dot: "○" },
};

// ─── Small Components ─────────────────────────────────────────────

function Dot({ ok }: { ok: boolean }) {
  return (
    <span
      style={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: ok ? "#10b981" : "rgba(255,255,255,0.15)",
        boxShadow: ok ? "0 0 5px #10b981" : "none",
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

function Row({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", padding: "0.25rem 0" }}>
      <Dot ok={ok} />
      <span
        style={{
          fontSize: "0.78rem",
          color: ok ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.3)",
          fontWeight: ok ? 500 : 400,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Panel({
  title,
  icon,
  accent,
  children,
}: {
  title: string;
  icon: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "rgba(5,8,20,0.9)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderTop: `3px solid ${accent}`,
        borderRadius: "12px",
        padding: "1.1rem 1.25rem 1.25rem",
      }}
    >
      <p
        style={{
          color: "rgba(255,255,255,0.38)",
          fontSize: "0.67rem",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: "0.8rem",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <span>{icon}</span> {title}
      </p>
      {children}
    </div>
  );
}

function Chip({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        background: ok ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${ok ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "100px",
        padding: "0.18rem 0.6rem",
        fontSize: "0.67rem",
        fontWeight: 600,
        color: ok ? "#10b981" : "rgba(255,255,255,0.3)",
        letterSpacing: "0.05em",
      }}
    >
      {ok ? "✓" : "○"} {label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────

export default async function DigitalForgeBuilderPage() {
  const products = await getForgeProducts();

  const counts = {
    live:    products.filter((p) => getLiveMode(p) === "live-published").length,
    pending: products.filter((p) => getLiveMode(p) === "published-pending").length,
    review:  products.filter((p) => getLiveMode(p) === "review-needed").length,
    draft:   products.filter((p) => getLiveMode(p) === "draft-only").length,
  };

  return (
    <div className="min-h-screen pb-24">

      {/* ── Header ── */}
      <section className="relative pt-32 pb-10">
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2rem" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(0,102,255,0.08)", border: "1px solid rgba(0,102,255,0.25)", borderRadius: "100px", padding: "0.3rem 0.9rem", marginBottom: "1rem" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00CCFF", boxShadow: "0 0 6px #00CCFF", display: "inline-block" }} />
                <span style={{ color: "#00CCFF", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  Internal — Builder Panel
                </span>
              </div>
              <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "0.4rem" }}>
                Digital Forge Builder
              </h1>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.85rem" }}>
                Full pipeline lifecycle: Generation → Website → Distribution
              </p>
            </div>
            <Link href="/digital-forge/products" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.25rem", background: "rgba(0,102,255,0.08)", border: "1px solid rgba(0,102,255,0.25)", borderRadius: "8px", color: "#00CCFF", textDecoration: "none", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              ← Live Store
            </Link>
          </div>

          {/* Summary row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.85rem", marginBottom: "1.25rem" }}>
            {[
              { label: "Total",    value: products.length,  color: "#0066FF" },
              { label: "Live",     value: counts.live,      color: "#10b981" },
              { label: "Pending",  value: counts.pending,   color: "#f59e0b" },
              { label: "Review",   value: counts.review,    color: "#f97316" },
              { label: "Draft",    value: counts.draft,     color: "#64748b" },
            ].map((s) => (
              <div key={s.label} style={{ background: "rgba(5,8,20,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: `3px solid ${s.color}`, borderRadius: "10px", padding: "0.85rem 1rem" }}>
                <div style={{ fontSize: "1.9rem", fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: "0.2rem" }}>{s.value}</div>
                <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.38)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Doctrine line */}
          <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.75rem", fontStyle: "italic" }}>
            When a product is marked published and synced to Airtable, the website picks it up automatically and renders the live sales page.
          </p>
        </div>
      </section>

      {/* ── Product Cards ── */}
      <section>
        <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
          <div style={{ display: "grid", gap: "1.75rem" }}>

            {products.map((product) => {
              const mode     = getLiveMode(product);
              const meta     = LIVE_MODE_META[mode];
              const block    = pub(product);
              const r        = raw(product);
              const flags    = block.qualityFlags ?? [];

              // ── Page readiness checks ──
              const pageChecks = [
                { label: "Headline",     ok: has(product.headline) },
                { label: "Subheadline",  ok: has(product.subheadline) },
                { label: "Problem",      ok: has(product.problem) },
                { label: "Deliverables", ok: has(product.deliverables) },
                { label: "FAQ",          ok: has(product.faq) },
                { label: "Cover Image",  ok: has(r.coverImageUrl) },
                { label: "Flags Clear",  ok: flags.length === 0 },
              ];
              const pageScore = pageChecks.filter((c) => c.ok).length;

              // ── Generation checks ──
              const hasBundle   = has(r.bundleZipPath);
              const hasPdf      = has(r.bundlePdfPath);
              const hasDrive    = has(r.driveFolderLink);
              const hasPayload  = has(product.headline) && has(product.deliverables);
              const hasIncludes = has(product.includes);

              // ── Website checks ──
              const isPublished     = product.status === "published";
              const airtableSynced  = block.websiteSyncStatus === "synced" || block.websiteSyncStatus === "success";
              const liveEligible    = isPublished && pageScore >= 5;

              // ── Distribution checks ──
              // These are separate file outputs on VPS — we infer from distributionStatus
              const distStatus = block.distributionStatus ?? "pending";
              const distDone   = distStatus === "sent" || distStatus === "done";
              // Channel asset presence — stored as separate files; JSON doesn't currently carry these paths
              // so we show "pending" unless distributionStatus says done
              const channelReady = distDone;

              return (
                <div key={product.slug} style={{ background: "rgba(6,10,25,0.92)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", overflow: "hidden" }}>

                  {/* ─── Card Header ─── */}
                  <div style={{ padding: "1.25rem 1.6rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Status chip */}
                      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.6rem", alignItems: "center" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", background: meta.bg, border: `1px solid ${meta.color}40`, borderRadius: "100px", padding: "0.22rem 0.75rem", fontSize: "0.67rem", fontWeight: 700, color: meta.color, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                          <span>{meta.dot}</span> {meta.label}
                        </span>
                        <span style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "6px", padding: "0.18rem 0.55rem", fontSize: "0.67rem", fontWeight: 600, color: "rgba(255,255,255,0.38)", letterSpacing: "0.09em", textTransform: "uppercase" }}>
                          {product.category}
                        </span>
                        {product.generationProfile && (
                          <span style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: "6px", padding: "0.18rem 0.55rem", fontSize: "0.67rem", fontWeight: 600, color: "rgba(167,139,250,0.75)", letterSpacing: "0.09em", textTransform: "uppercase" }}>
                            {product.generationProfile}
                          </span>
                        )}
                        {/* Page score badge */}
                        <span style={{ background: pageScore >= 5 ? "rgba(16,185,129,0.1)" : "rgba(249,115,22,0.1)", border: `1px solid ${pageScore >= 5 ? "rgba(16,185,129,0.25)" : "rgba(249,115,22,0.25)"}`, borderRadius: "6px", padding: "0.18rem 0.55rem", fontSize: "0.67rem", fontWeight: 700, color: pageScore >= 5 ? "#10b981" : "#f97316", letterSpacing: "0.08em" }}>
                          Page {pageScore}/{pageChecks.length}
                        </span>
                      </div>

                      <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "1rem", lineHeight: 1.35, marginBottom: "0.3rem" }}>
                        {product.title}
                      </h2>
                      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", fontFamily: "monospace" }}>
                        /digital-forge/products/{product.slug}
                      </p>
                    </div>

                    <Link href={`/digital-forge/products/${product.slug}`} target="_blank" style={{ display: "inline-flex", alignItems: "center", padding: "0.45rem 0.9rem", background: "rgba(0,102,255,0.1)", border: "1px solid rgba(0,102,255,0.25)", borderRadius: "7px", color: "#00CCFF", textDecoration: "none", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", flexShrink: 0 }}>
                      View ↗
                    </Link>
                  </div>

                  {/* ─── Quality Flags (if any) ─── */}
                  {flags.length > 0 && (
                    <div style={{ padding: "0.75rem 1.6rem", background: "rgba(249,115,22,0.05)", borderBottom: "1px solid rgba(249,115,22,0.12)" }}>
                      <p style={{ color: "rgba(249,115,22,0.85)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                        ⚠ Quality Flags
                      </p>
                      {flags.map((f, i) => (
                        <p key={i} style={{ color: "rgba(249,115,22,0.7)", fontSize: "0.75rem", lineHeight: 1.55 }}>· {f}</p>
                      ))}
                    </div>
                  )}

                  {/* ─── 3 Panels ─── */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", padding: "1.25rem 1.6rem" }}>

                    {/* 1 — Generation */}
                    <Panel title="Generation" icon="⚙" accent="rgba(124,58,237,0.7)">
                      <Row ok={has(product.title)}  label="Product generated" />
                      <Row ok={hasPayload}           label="Website payload built" />
                      <Row ok={hasIncludes}          label="Prompt pack & templates" />
                      <Row ok={hasPdf}               label="PDF ebook created" />
                      <Row ok={hasBundle}            label="ZIP bundle created" />
                      <Row ok={hasDrive}             label="Drive folder linked" />
                      {hasDrive && (
                        <a href={r.driveFolderLink as string} target="_blank" rel="noopener noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", marginTop: "0.65rem", color: "#a78bfa", fontSize: "0.7rem", fontWeight: 600, textDecoration: "none" }}>
                          Open Drive Folder ↗
                        </a>
                      )}
                    </Panel>

                    {/* 2 — Website Sync */}
                    <Panel title="Website Sync" icon="🌐" accent="rgba(0,102,255,0.7)">
                      <Row ok={hasPayload}      label="Payload present" />
                      <Row ok={isPublished}     label={`Status: ${product.status ?? "draft"}`} />
                      <Row ok={airtableSynced}  label={`Airtable: ${block.websiteSyncStatus ?? "pending"}`} />
                      <Row ok={liveEligible}    label="Live site eligible" />
                      <Row ok={pageScore >= 5}  label={`Page score: ${pageScore}/${pageChecks.length}`} />
                      <div style={{ marginTop: "0.85rem", padding: "0.6rem 0.8rem", background: isPublished ? "rgba(0,102,255,0.07)" : "rgba(255,255,255,0.03)", border: `1px solid ${isPublished ? "rgba(0,102,255,0.18)" : "rgba(255,255,255,0.06)"}`, borderRadius: "7px", fontSize: "0.71rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                        {isPublished
                          ? "This product is eligible for live website rendering. The site will pick it up automatically from Airtable."
                          : "Website status is draft — not yet eligible for public display."}
                      </div>
                    </Panel>

                    {/* 3 — Distribution */}
                    <Panel title="Distribution" icon="📡" accent="rgba(16,185,129,0.7)">
                      <Row ok={channelReady}  label="Telegram pack" />
                      <Row ok={channelReady}  label="WhatsApp pack" />
                      <Row ok={channelReady}  label="Social pack created" />
                      <Row ok={channelReady}  label="Facebook post ready" />
                      <Row ok={channelReady}  label="Instagram caption ready" />
                      <Row ok={channelReady}  label="LinkedIn post ready" />
                      <Row ok={channelReady}  label="X (Twitter) post ready" />
                      <Row
                        ok={distDone}
                        label={`Send status: ${block.distributionStatus ?? "pending"}`}
                      />
                      {!distDone && (
                        <p style={{ marginTop: "0.65rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", lineHeight: 1.55 }}>
                          Run distribution pipeline on VPS to push channel assets.
                        </p>
                      )}
                    </Panel>
                  </div>

                  {/* ─── Page Readiness Strip ─── */}
                  <div style={{ padding: "0.85rem 1.6rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "0.55rem" }}>
                      Page Readiness
                    </p>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {pageChecks.map((c) => <Chip key={c.label} label={c.label} ok={c.ok} />)}
                    </div>
                  </div>

                </div>
              );
            })}

          </div>
        </div>
      </section>
    </div>
  );
}
