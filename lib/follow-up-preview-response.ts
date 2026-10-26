export function followUpPreviewResponse(job: "seo" | "digital-forge") {
  return Response.json({ ok: false, mode: "preview", sendingEnabled: false, job,
    error: "Automatic follow-ups are disabled. Generate the read-only owner preview with node scripts/preview-follow-ups.mjs.",
  }, { status: 409, headers: { "cache-control": "no-store, private" } });
}
