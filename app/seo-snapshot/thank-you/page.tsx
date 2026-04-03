'use client';

import Link from 'next/link';

const BOOKING_URL = process.env.NEXT_PUBLIC_SEO_BOOKING_URL || 'https://cal.com/adeyemi-olayemi-vqvyj4/30-min-seo-strategy-call';

export default function SeoSnapshotThankYouPage() {
  return (
    <div className="bg-[#020205] relative selection:bg-[#3b82f6]/30 font-sans border-b border-transparent overflow-hidden pb-16">
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[1000px] h-[1000px] bg-[#3b82f6]/10 blur-[300px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center gap-20 pt-24 px-6">
        <div className="flex flex-col items-center gap-8 w-full text-center mt-10">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] flex items-center justify-center shadow-[0_10px_40px_rgba(59,130,246,0.3)]">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight">Request Received.</h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-400 font-light leading-relaxed max-w-3xl">
            We have logged your full audit request. You will receive an email shortly with your snapshot summary and next steps.
          </p>
        </div>
        <div className="w-full bg-[#050510]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] sm:rounded-[3rem] px-8 py-14 sm:px-16 sm:py-20 shadow-2xl relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/50 to-transparent"></div>
          <div className="w-full text-center mb-12 sm:mb-16">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#60a5fa] border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-8 py-3 rounded-full">
              What happens next?
            </span>
          </div>
          <div className="flex flex-col gap-12 sm:gap-16">
            {[
              'Check your inbox — your snapshot summary is on its way.',
              'Our team reviews your domain in detail and builds a custom implementation plan.',
              'We will reach out within 24 hours to discuss the roadmap.',
            ].map((step, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center">
                <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]">
                  <span className="text-[#60a5fa] text-2xl sm:text-3xl font-black">{i + 1}</span>
                </div>
                <span className="text-gray-300 text-lg sm:text-2xl font-light leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-6 w-full z-20">
          <Link href={BOOKING_URL} className="group relative flex items-center justify-center px-10 sm:px-12 lg:px-16 min-h-[4rem] sm:min-h-[4.5rem] lg:min-h-[5.5rem] bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white font-black text-sm sm:text-lg lg:text-xl uppercase tracking-widest rounded-full transition-transform hover:-translate-y-1 overflow-hidden w-full sm:w-auto text-center">
            <span className="relative z-10 whitespace-nowrap pl-[0.1em] flex items-center justify-center gap-3">
              SKIP THE WAIT — BOOK A CALL <span className="text-3xl leading-none transition-transform group-hover:translate-x-2">→</span>
            </span>
          </Link>
          <span className="text-xs sm:text-sm text-gray-500 font-bold tracking-[0.25em] uppercase text-center mt-4">Private SEO Operations</span>
        </div>
        <div className="h-8 lg:h-12 w-full shrink-0"></div>
      </div>
    </div>
  );
}
