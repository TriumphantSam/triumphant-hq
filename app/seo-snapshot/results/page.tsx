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
    <div className="bg-[#020205] min-h-screen relative selection:bg-[#3b82f6]/30 font-sans pb-32">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[1000px] h-[1000px] bg-[#3b82f6]/5 blur-[300px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 w-full pt-16 sm:pt-24 pb-0 flex flex-col items-center">
        {/* HEADER */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col items-center text-center mb-16">
          <span className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#60a5fa] border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-8 py-3 rounded-full mb-8">
            Analysis Complete
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight mb-8">
            SEO Snapshot — <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#06b6d4]">{result.domain}</span>
          </h1>
          <p className="text-lg sm:text-2xl text-gray-400 font-light leading-relaxed max-w-4xl">
            {result.summary}
          </p>
        </div>

        {/* RESULTS GRID */}
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 w-full">
            
            {/* SCORE CARD */}
            <div className="w-full lg:w-1/3 shrink-0 flex flex-col items-center justify-center bg-[#050510]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-12 sm:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              
              <div className="relative w-48 h-48 mb-10">
                <svg className="w-full h-full -rotate-90 drop-shadow-2xl" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r={r} fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="12" />
                  <circle cx="60" cy="60" r={r} fill="none" className={scoreRing} strokeWidth="12" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={dash} style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-black text-white tracking-tighter">{score}</span>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">/ 100</span>
                </div>
              </div>
              
              <span className="px-8 py-3 rounded-full text-sm font-black uppercase tracking-[0.25em] border mb-6 inline-block" style={{ color: scoreColor, borderColor: `${scoreColor}40`, background: `${scoreColor}10` }}>
                {scoreLabel}
              </span>
              <p className="text-gray-400 text-sm mt-2 font-medium tracking-wide uppercase">Visibility Score</p>
            </div>

            {/* DETAILS CARDS */}
            <div className="w-full flex-grow flex flex-col gap-8 sm:gap-12">
              
              {/* Priority Blockers */}
              <div className="bg-[#050510]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 sm:p-14 shadow-2xl relative">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent"></div>
                <h2 className="text-white text-2xl sm:text-3xl font-black mb-10 flex items-center gap-4">
                  <span className="shrink-0 w-4 h-10 rounded-full bg-red-500/80"></span>
                  Priority Blockers
                </h2>
                <div className="flex flex-col gap-8">
                  {result.visibleIssues.map((issue, i) => (
                    <div key={i} className="flex gap-6 items-start">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-lg font-black flex items-center justify-center -mt-1 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                        {i + 1}
                      </div>
                      <p className="text-gray-300 text-xl font-light leading-relaxed">{issue}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Wins */}
              <div className="bg-[#050510]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 sm:p-14 shadow-2xl relative">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#06b6d4]/20 to-transparent"></div>
                <h2 className="text-white text-2xl sm:text-3xl font-black mb-10 flex items-center gap-4">
                  <span className="shrink-0 w-4 h-10 rounded-full bg-[#06b6d4]/80"></span>
                  Quick Wins Available
                </h2>
                <div className="flex flex-col gap-8">
                  {result.opportunities.map((opp, i) => (
                    <div key={i} className="flex gap-6 items-start">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[#06b6d4] text-lg font-black flex items-center justify-center -mt-1 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                        {i + 1}
                      </div>
                      <p className="text-gray-300 text-xl font-light leading-relaxed">{opp}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="h-16 lg:h-32 w-full shrink-0"></div>

        {/* CTA SECTION */}
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="bg-[#050510]/80 backdrop-blur-xl border border-[#3b82f6]/20 rounded-[3rem] px-8 py-16 sm:px-16 sm:py-24 relative overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.1)]">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/50 to-transparent"></div>
            
            <div className="max-w-4xl relative z-10 mx-auto text-center flex flex-col items-center">
              <span className="text-sm font-black uppercase tracking-[0.25em] text-[#60a5fa] border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-8 py-3 rounded-full mb-10 inline-block">
                Roadmap & Fix
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-8 tracking-tight leading-[1.1]">
                {cta.headline}
              </h2>
              <p className="text-gray-400 text-xl md:text-2xl font-light leading-relaxed mb-16 max-w-3xl">
                {cta.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto justify-center">
                <button 
                  onClick={handleBookCall} 
                  disabled={booking} 
                  className="group relative flex items-center justify-center px-10 sm:px-14 min-h-[5rem] bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white font-black text-sm sm:text-lg uppercase tracking-widest rounded-full transition-transform hover:-translate-y-1 disabled:opacity-50 overflow-hidden w-full sm:w-auto"
                >
                   <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                   <span className="relative z-10 flex items-center gap-4">
                     {booking ? 'Redirecting…' : `${cta.primaryLabel} →`}
                   </span>
                </button>
                <button 
                  onClick={handleRequestAudit} 
                  disabled={requesting} 
                  className="flex items-center justify-center px-10 sm:px-14 min-h-[5rem] border border-white/10 hover:border-white/30 hover:bg-white/5 text-gray-300 font-bold text-sm sm:text-lg uppercase tracking-widest rounded-full transition-all disabled:opacity-50 w-full sm:w-auto"
                >
                  {requesting ? 'Sending…' : cta.secondaryLabel}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
