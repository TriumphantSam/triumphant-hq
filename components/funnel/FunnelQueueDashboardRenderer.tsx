"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FunnelPayload } from "@/lib/digital-forge";

type FunnelQueueStatus = "draft" | "needs_review" | "approved" | "published" | "archived";
type BuilderAction = "approve_for_publish" | "request_revision" | "push_to_publish" | "push_distribution";

const FUNNEL_LANES: { status: FunnelQueueStatus; label: string; color: string; bg: string }[] = [
  { status: "needs_review", label: "Needs Review", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  { status: "approved", label: "Approved to Publish", color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
  { status: "published", label: "Published", color: "#00CCFF", bg: "rgba(0,204,255,0.08)" },
  { status: "draft", label: "Draft", color: "#64748b", bg: "rgba(100,116,139,0.06)" },
];

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
      {Array.isArray(children) || typeof children === 'string' ? children : <div className="space-y-1">{children}</div>}
    </div>
  );
}

async function runFunnelActionRequest(funnel: FunnelPayload, action: BuilderAction, notes?: string | null) {
  const response = await fetch("/api/digital-forge/builder/actions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slug: funnel.slug,
      recordId: funnel.airtableRecordId,
      action,
      notes,
      currentFunnel: funnel,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "Funnel action failed");
  }
  return data.funnel as FunnelPayload;
}

function FunnelDetailDrawer({ funnel, onClose, onAction, actionPending }: { funnel: FunnelPayload; onClose: () => void; onAction: (a: BuilderAction, f: FunnelPayload) => void; actionPending: BuilderAction | null; }) {
  const laneMeta = FUNNEL_LANES.find((l) => l.status === (funnel.review?.status ?? funnel.status));

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40, backdropFilter: "blur(2px)" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "min(680px, 100vw)",
        background: "rgba(6,10,25,0.98)", borderLeft: "1px solid rgba(245,158,11,0.2)",
        zIndex: 50, overflowY: "auto", padding: "2rem 1.75rem",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <span style={{ color: "rgba(245,158,11,0.6)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            Funnel Command View
          </span>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "0.35rem 0.75rem", color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", cursor: "pointer" }}>
            ✕ Close
          </button>
        </div>

        <div className="mb-6 pb-6 border-b border-white/5">
          <div className="flex gap-2 flex-wrap mb-3">
            {laneMeta && <Badge label={laneMeta.label} color={laneMeta.color} bg={laneMeta.bg} />}
            <Badge label={funnel.funnelType} color="rgba(255,255,255,0.5)" bg="rgba(255,255,255,0.04)" />
          </div>
          <h2 className="text-white font-black text-xl mb-1">{funnel.campaignName}</h2>
          <p className="text-gray-500 font-mono text-xs mb-4">/digital-forge/funnel/{funnel.slug}</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 rounded p-2">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Linked Product</span>
              <span className="text-sm font-bold text-gray-200">{funnel.productSlug}</span>
            </div>
            <div className="bg-white/5 rounded p-2">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Niche</span>
              <span className="text-sm font-bold text-gray-200">{funnel.niche}</span>
            </div>
          </div>
        </div>

        <div className="mb-6 pb-6 border-b border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">The Promise</p>
          <div className="mb-3 pl-3 border-l-2 border-amber-500/50">
            <p className="text-xl font-bold text-white mb-2">{funnel.promise.headline}</p>
            <p className="text-sm text-gray-400 leading-relaxed">{funnel.promise.subheadline}</p>
          </div>
          <p className="text-xs font-mono text-amber-500">CTA: {funnel.promise.cta}</p>
        </div>

        <div className="mb-6 pb-6 border-b border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Training Asset</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white/5 rounded p-2"><span className="text-[10px] uppercase text-gray-500 block">Title</span><span className="text-xs font-bold text-gray-300">{funnel.training.title}</span></div>
            <div className="bg-white/5 rounded p-2"><span className="text-[10px] uppercase text-gray-500 block">Mode</span><span className="text-xs font-bold text-gray-300">{funnel.training.mode}</span></div>
            <div className="bg-white/5 rounded p-2"><span className="text-[10px] uppercase text-gray-500 block">Duration</span><span className="text-xs font-bold text-gray-300">{funnel.training.duration}</span></div>
          </div>
          <p className="text-xs font-bold text-gray-400 mb-2">Methodology:</p>
          <ul className="space-y-1 mb-4">
            {funnel.training.coreMethod.map((m,i)=><li key={i} className="text-xs text-gray-300 flex gap-2"><span className="text-amber-500">{i+1}.</span>{m}</li>)}
          </ul>
        </div>

        <div className="mb-6 pb-6 border-b border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Commercial Offer</p>
          <div className="bg-[#00CCFF]/5 border border-[#00CCFF]/20 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-bold text-white mb-1">{funnel.offer.name} <span className="text-[#00CCFF] ml-2">{funnel.offer.price}</span></h3>
            <p className="text-xs text-gray-400 mb-3">{funnel.offer.summary}</p>
            <div className="flex flex-wrap gap-2">
                {funnel.offer.deliverables.slice(0,3).map((d,i)=><span key={i} className="text-[10px] font-bold uppercase tracking-wider text-white bg-white/10 px-2 py-1 rounded">{d}</span>)}
                {funnel.offer.deliverables.length > 3 && <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white/5 px-2 py-1 rounded">+{funnel.offer.deliverables.length - 3} more</span>}
            </div>
            <p className="text-xs font-mono text-[#00CCFF] mt-3">CTA: {funnel.offer.cta}</p>
            {funnel.offer.checkoutUrl && <p className="text-[11px] text-gray-500 mt-2 font-mono truncate">Checkout: {funnel.offer.checkoutUrl}</p>}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Review & Approval</p>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-gray-300 font-mono mb-2">Status: <span className="text-amber-400">{funnel.review?.status || funnel.status}</span></p>
            {funnel.review?.notes && <p className="text-xs text-gray-400 mb-2 border-l-2 border-gray-600 pl-2">{funnel.review.notes}</p>}
            <div className="flex gap-2 flex-wrap mt-4">
              <button disabled={actionPending!==null} onClick={()=>onAction("approve_for_publish", funnel)} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold rounded">{actionPending === "approve_for_publish" ? "Working…" : "Approve"}</button>
              <button disabled={actionPending!==null} onClick={()=>onAction("push_to_publish", funnel)} className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-500 text-xs font-bold rounded">{actionPending === "push_to_publish" ? "Working…" : "Publish Live"}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function QueueFunnelCard({ funnel, onSelect }: { funnel: FunnelPayload; onSelect: () => void; }) {
  const laneMeta = FUNNEL_LANES.find((l) => l.status === (funnel.review?.status ?? funnel.status)) || FUNNEL_LANES[3];

  return (
    <div style={{
      background: "rgba(6,10,25,0.9)", border: "1px solid rgba(255,255,255,0.07)",
      borderTop: `3px solid ${laneMeta.color}`, borderRadius: "14px", overflow: "hidden",
    }}>
      <div style={{ padding: "1rem 1.1rem 0.75rem" }}>
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.55rem", alignItems: "center" }}>
          <Badge label={laneMeta.label} color={laneMeta.color} bg={laneMeta.bg} />
          <Badge label={funnel.funnelType.replace('_', ' ')} color="rgba(255,255,255,0.4)" bg="rgba(255,255,255,0.04)" />
        </div>
        <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "0.92rem", lineHeight: 1.3, marginBottom: "0.25rem" }}>
          {funnel.campaignName}
        </h3>
        <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.7rem", fontFamily: "monospace" }}>
          /{funnel.slug}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", padding: "0.75rem 1.1rem" }}>
        <MiniPanel title="Promise">
          <p className="text-[10px] text-gray-400 line-clamp-2 leading-tight">{funnel.promise.headline}</p>
        </MiniPanel>
        <MiniPanel title="Offer">
          <p className="text-[10px] text-gray-400 line-clamp-2 leading-tight">{funnel.offer.name}</p>
        </MiniPanel>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 1.1rem", borderTop: "1px solid rgba(255,255,255,0.05)", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={onSelect}
            style={{ padding: "0.42rem 0.9rem", background: `${laneMeta.color}20`, border: `1px solid ${laneMeta.color}50`, borderRadius: "7px", color: laneMeta.color, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", letterSpacing: "0.08em" }}>
            Review →
          </button>
          {funnel.status === "published" && (
            <Link href={`/digital-forge/funnel/${funnel.slug}`} target="_blank"
              style={{ display: "inline-flex", alignItems: "center", padding: "0.42rem 0.9rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "7px", color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 700, textDecoration: "none" }}>
              Live ↗
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function QueueLane({ lane, funnels, onSelect }: {
    lane: typeof FUNNEL_LANES[0];
    funnels: FunnelPayload[];
    onSelect: (f: FunnelPayload) => void;
}) {
  const [collapsed, setCollapsed] = useState(funnels.length === 0);
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
        <span style={{ background: `${lane.color}20`, border: `1px solid ${lane.color}40`, borderRadius: "100px", padding: "0.12rem 0.55rem", fontSize: "0.68rem", fontWeight: 700, color: lane.color }}>{funnels.length}</span>
      </button>

      {!collapsed && funnels.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.85rem" }}>
          {funnels.map((f) => (
            <QueueFunnelCard key={f.slug} funnel={f} onSelect={() => onSelect(f)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FunnelQueueDashboardRenderer({ funnels }: { funnels: FunnelPayload[] }) {
    const router = useRouter();
    const [funnelState, setFunnelState] = useState<FunnelPayload[]>(funnels);
    const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
    const [busySlug, setBusySlug] = useState<string | null>(null);
    const [busyAction, setBusyAction] = useState<BuilderAction | null>(null);
    const [actionError, setActionError] = useState("");
    const [, startTransition] = useTransition();

    async function handleAction(action: BuilderAction, funnel: FunnelPayload) {
        let notes: string | null | undefined = undefined;
        if (action === "approve_for_publish") {
            const value = window.prompt("Optional approval note", funnel.review?.notes ?? "");
            if (value === null) return;
            notes = value;
        }
        if (action === "request_revision") {
            const value = window.prompt("Revision note for the funnel", funnel.review?.notes ?? "");
            if (value === null) return;
            notes = value;
        }

        setBusySlug(funnel.slug);
        setBusyAction(action);
        setActionError("");

        try {
            const updated = await runFunnelActionRequest(funnel, action, notes);
            setFunnelState(prev => prev.map(f => f.slug === updated.slug ? updated : f));
            startTransition(() => router.refresh());
        } catch (error) {
            setActionError(error instanceof Error ? error.message : "Funnel action failed");
        } finally {
            setBusySlug(null);
            setBusyAction(null);
        }
    }

    const selectedFunnel = selectedSlug ? funnelState.find((item) => item.slug === selectedSlug) ?? null : null;

    return (
        <div>
            {actionError && (
              <div style={{ marginBottom: "1rem", padding: "0.75rem 0.95rem", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "9px", color: "rgba(248,113,113,0.9)", fontSize: "0.78rem" }}>
                {actionError}
              </div>
            )}
            {selectedFunnel && (
                <FunnelDetailDrawer 
                    funnel={selectedFunnel} 
                    onClose={() => setSelectedSlug(null)} 
                    onAction={handleAction} 
                    actionPending={busySlug === selectedFunnel.slug ? busyAction : null} 
                />
            )}

            {FUNNEL_LANES.map(lane => (
                <QueueLane 
                    key={lane.status}
                    lane={lane}
                    funnels={funnelState.filter(f => (f.review?.status ?? f.status) === lane.status)}
                    onSelect={(f) => setSelectedSlug(f.slug)}
                />
            ))}
        </div>
    );
}
