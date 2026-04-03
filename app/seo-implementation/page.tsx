'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SeoResult {
  domain: string;
  quickScore: number;
  statusLabel: string;
  summary: string;
  visibleIssues: string[];
  opportunities: string[];
  leadId: string;
  rootUrl?: string;
  cta?: { headline: string; description: string; primaryLabel: string; primaryUrl?: string; secondaryLabel: string; secondaryUrl?: string };
  bookingLinks?: { triage?: string; strategy?: string; implementation?: string };
}

const DEFAULT_BOOKING_URL = process.env.NEXT_PUBLIC_SEO_BOOKING_URL || 'https://cal.com/adeyemi-olayemi-vqvyj4/30-min-seo-strategy-call';

export default function SeoResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<SeoResult | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('trium_seo_result');
    if (!raw) {
      router.push('/seo-snapshot');
      return;
    }
    setResult(JSON.parse(raw) as SeoResult);
  }, [router]);

  const handleRequestAudit = async () => {
    if (!result?.leadId) return;
    setRequesting(true);
    try {
      await fetch('/api/seo/request-full-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: result.leadId, websiteUrl: result.rootUrl || result.domain }),
      });
    } finally {
      router.push('/seo-snapshot/thank-you');
    }
  };

  const handleBookCall = async () => {
    const bookingUrl = result?.cta?.primaryUrl || result?.bookingLinks?.strategy || DEFAULT_BOOKING_URL;
    if (!result?.leadId) {
      window.location.href = bookingUrl;
      return;
    }
    setBooking(true);
    try {
      await fetch('/api/seo/book-call-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: result.leadId }),
      });
    } finally {
      window.location.href = bookingUrl;
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-[#020205] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">Loading results…</div>
      </div>
    );
  }

  const score = result.quickScore;
  const scoreColor = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  const scoreLabel = score >= 70 ? 'Good' : score >= 40 ? 'Needs Work' : 'Critical';
  const scoreRing = score >= 70 ? 'stroke-green-500' : score >= 40 ? 'stroke-amber-400' : 'stroke-red-500';
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = circ - (circ * score) / 100;
  const cta = result.cta || {
    headline: 'Want the full roadmap?',
    description: 'We can turn this snapshot into a real implementation plan and help you execute the fixes.',
    primaryLabel: 'Book Strategy Call',
    secondaryLabel: 'Request Full Audit',
  };

  return (
    <div className="bg-[#020205] min-h-screen pb-32">
      <div className="bg-[#080815] border-b border-white/6 px-6 py-10">
        <div className="max-w-screen-lg mx-auto">
          <p className="text-xs text-[#60a5fa] font-bold uppercase tracking-widest mb-2">Analysis complete</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">
            SEO Snapshot — <span className="text-[#60a5fa]">{result.domain}</span>
          </h1>
          <p className="text-gray-400 leading-relaxed max-w-2xl">{result.summary}</p>
        </div>
      </div>
      <div className="max-w-screen-lg mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8">
        <div className="flex flex-col items-center justify-center bg-[#0c0c1a] border border-white/6 rounded-2xl p-10 lg:col-span-1">
          <div className="relative w-36 h-36 mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={r} fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="10" />
              <circle cx="60" cy="60" r={r} fill="none" className={scoreRing} strokeWidth="10" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={dash} style={{ transition: 'stroke-dashoffset 1s ease' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{score}</span>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest">/ 100</span>
            </div>
          </div>
          <span className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border" style={{ color: scoreColor, borderColor: `${scoreColor}40`, background: `${scoreColor}15` }}>
            {scoreLabel}
          </span>
          <p className="text-gray-500 text-xs mt-4 text-center">Visibility Score for {result.domain}</p>
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-[#0c0c1a] border border-white/6 rounded-2xl p-8">
            <h2 className="text-white font-bold mb-6">Priority Blockers</h2>
            <ol className="space-y-4">
              {result.visibleIssues.map((issue, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                  <p className="text-gray-300 text-sm leading-relaxed">{issue}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="bg-[#0c0c1a] border border-white/6 rounded-2xl p-8">
            <h2 className="text-white font-bold mb-6">Quick Wins Available</h2>
            <ol className="space-y-4">
              {result.opportunities.map((opp, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                  <p className="text-gray-300 text-sm leading-relaxed">{opp}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <div className="max-w-screen-lg mx-auto px-6">
        <div className="bg-gradient-to-br from-[#0d1a33] to-[#080815] border border-[#3b82f6]/25 rounded-2xl p-10 sm:p-14 relative overflow-hidden">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">{cta.headline}</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">{cta.description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={handleBookCall} disabled={booking} className="inline-flex items-center justify-center px-8 py-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-sm uppercase tracking-widest rounded-xl transition-all disabled:opacity-50">
                {booking ? 'Redirecting…' : `${cta.primaryLabel} →`}
              </button>
              <button onClick={handleRequestAudit} disabled={requesting} className="inline-flex items-center justify-center px-8 py-4 border border-white/10 hover:border-white/25 text-white font-bold text-sm uppercase tracking-widest rounded-xl transition-all disabled:opacity-50">
                {requesting ? 'Sending…' : cta.secondaryLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
