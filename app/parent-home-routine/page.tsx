'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SELAR_URL = 'https://selar.com/9c47895c18';

/* ── Scroll reveal hook ── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShow(true); ob.disconnect(); } }, { threshold });
    ob.observe(el);
    return () => ob.disconnect();
  }, [threshold]);
  return { ref, show };
}

/* ── SVG icon components ── */
const icons = {
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  ),
  notebook: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  broom: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2v8M4.93 10.93l2.83 2.83M2 18h20M19.07 10.93l-2.83 2.83M12 10a4 4 0 00-4 4h8a4 4 0 00-4-4z" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  ),
};

export default function ParentHomeRoutinePage() {
  /* ── Calculator state ── */
  const [nags, setNags] = useState(6);
  const [screenFight, setScreenFight] = useState(20);
  const [bedtimeStall, setBedtimeStall] = useState(30);

  const dailyFriction = nags * 4 + screenFight + bedtimeStall;
  const weeklyHrs = Number(((dailyFriction * 7) / 60).toFixed(1));
  const annualNags = nags * 365;
  const monthlySaved = Math.round(((dailyFriction * 30.5) / 60) * 0.8);

  /* ── Reveal refs ── */
  const { ref: heroRef, show: heroShow } = useReveal();
  const { ref: painRef, show: painShow } = useReveal();
  const { ref: calcRef, show: calcShow } = useReveal();
  const { ref: insideRef, show: insideShow } = useReveal();
  const { ref: timeRef, show: timeShow } = useReveal();
  const { ref: priceRef, show: priceShow } = useReveal();

  /* ── Color constants ── */
  const TEAL = '#1A5C47';
  const TEAL_DEEP = '#0E3B2E';
  const GOLD = '#D4A843';
  const GOLD_LIGHT = '#F0D88A';
  const CREAM = '#FDF8EF';
  const CREAM_DARK = '#F5EDE0';
  const WARM_BG = '#1C1108';

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }} className="min-h-screen overflow-x-hidden">

      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />

      {/* ═══ STICKY NAV ═══ */}
      <nav className="fixed top-0 w-full z-[100] border-b" style={{ background: '#ffffff', backdropFilter: 'blur(16px)', borderColor: 'rgba(212,168,67,0.12)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/parent-home-routine" style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-bold tracking-wide">
            <span style={{ color: GOLD }}>Parent</span><span style={{ color: CREAM }}>Peace</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="#calculator" className="hidden sm:block text-[11px] font-semibold uppercase tracking-[0.15em] hover:opacity-100 transition-opacity" style={{ color: 'rgba(253,248,239,0.4)' }}>Calculator</Link>
            <Link href="#inside" className="hidden sm:block text-[11px] font-semibold uppercase tracking-[0.15em] hover:opacity-100 transition-opacity" style={{ color: 'rgba(253,248,239,0.4)' }}>Inside</Link>
            <a href={SELAR_URL} className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110 hover:scale-[1.03]" style={{ background: `linear-gradient(135deg, ${GOLD}, #C4942F)`, color: WARM_BG }}>
              Get Bundle — ₦3,000
            </a>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 overflow-hidden" style={{ background: "linear-gradient(135deg, #ffffff 0%, #f4f8ff 100%)" }}>
        {/* Ambient orbs */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none" style={{ background: `${TEAL}15` }} />
        <div className="absolute bottom-10 right-1/3 w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none" style={{ background: `${GOLD}10` }} />

        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Copy */}
          <div className={`flex flex-col gap-8 transition-all duration-1000 ${heroShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 w-fit px-4 py-1.5 rounded-full border" style={{ borderColor: `${GOLD}30`, background: `${GOLD}08` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>Instant Digital Download</span>
            </div>

            <h1 style={{ fontFamily: "'Playfair Display', serif", color: CREAM }} className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.08] tracking-tight">
              Stop repeating yourself.
              <span className="block mt-2">
                <span className="relative inline-block">
                  <span className="relative z-10" style={{ color: GOLD }}>Start the routine.</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 rounded-full -z-0" style={{ background: `${GOLD}15` }} />
                </span>
              </span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed max-w-lg font-light" style={{ color: 'rgba(253,248,239,0.5)' }}>
              The <strong style={{ color: 'rgba(253,248,239,0.8)' }}>Parent Home Routine Mega Bundle</strong> is a printable system that replaces nagging with structure — screen-time agreements, chore charts, calm parent scripts, and weekly family reviews all in one.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href={SELAR_URL} className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold transition-all hover:scale-[1.02] hover:brightness-110" style={{ background: `linear-gradient(135deg, ${GOLD}, #C4942F)`, color: WARM_BG }}>
                Get the Complete Bundle
                <span className="group-hover:translate-x-1 transition-transform">{icons.arrow}</span>
              </a>
              <Link href="#calculator" className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-semibold border transition-all hover:bg-white/5" style={{ borderColor: 'rgba(253,248,239,0.1)', color: 'rgba(253,248,239,0.6)' }}>
                Calculate Your Stress
              </Link>
            </div>

            {/* Stats strip */}
            <div className="flex items-center gap-8 pt-6 border-t" style={{ borderColor: 'rgba(253,248,239,0.06)' }}>
              {[{ n: '₦3,000', s: 'One-time' }, { n: '37+', s: 'Pages' }, { n: '3-14', s: 'Age Range' }].map((x, i) => (
                <div key={i} className="text-center">
                  <span className="block text-lg font-bold" style={{ color: GOLD }}>{x.n}</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'rgba(253,248,239,0.25)' }}>{x.s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Hero Image */}
          <div className={`relative transition-all duration-1000 delay-300 ${heroShow ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-12 rotate-1'}`}>
            <div className="relative rounded-3xl overflow-hidden border shadow-2xl" style={{ borderColor: `${GOLD}15`, boxShadow: `0 25px 80px ${TEAL}30` }}>
              <Image src="/images/parent-routine/cover-hero.png" alt="Parent Home Routine Mega Bundle — complete system with workbook, printables, screen-time agreement, chore chart, and homework tracker" width={700} height={950} className="w-full h-auto object-cover" priority />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,17,8,0.18) 0%, transparent 40%)' }} />
            </div>
            {/* Glow */}
            <div className="absolute -inset-6 rounded-3xl blur-3xl -z-10" style={{ background: `linear-gradient(135deg, ${GOLD}08, ${TEAL}10)` }} />
          </div>
        </div>
      </section>

      {/* ═══ PAIN POINTS ═══ */}
      <section ref={painRef} className="relative px-6" style={{ background: CREAM, paddingTop: '112px', paddingBottom: '144px' }}>
        <div className="max-w-5xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${painShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: TEAL }}>Sound familiar?</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: TEAL_DEEP }} className="text-3xl sm:text-5xl font-bold mt-3 mb-5">Does your evening look like this?</h2>
            <p className="font-light max-w-lg mx-auto" style={{ color: '#7A6F60' }}>Most homes are stuck in these four friction zones — burning energy that should be spent on connection.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: icons.sun, title: 'The Morning Rush', desc: 'Nagging them to brush teeth, wear shoes, find backpacks. Starting the workday already exhausted before 8 AM.', bg: '#FFF8ED', border: '#F5DEB3' },
              { icon: icons.phone, title: 'Screen-Time Hostage Crisis', desc: 'Tears, anger, and bargaining whenever devices need to go away. Feeling guilty for simply setting limits.', bg: '#EDF5FF', border: '#B3D4F5' },
              { icon: icons.broom, title: 'The Chore Battle', desc: 'Asking five times, getting ignored, then doing it yourself because arguing drains more energy than the chore itself.', bg: '#EDFAF4', border: '#B3E6D0' },
              { icon: icons.moon, title: 'The Bedtime Marathon', desc: 'One more story, one more cup of water. Reclaiming your evening at 10 PM instead of 8 PM, every single night.', bg: '#F3EDFA', border: '#D0B3F5' },
            ].map((p, i) => (
              <div key={i} className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${painShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ background: p.bg, borderColor: p.border, transitionDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'white', color: TEAL, boxShadow: '0 2px 8px rgba(15,23,42,0.1)' }}>
                  {p.icon}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: TEAL_DEEP }}>{p.title}</h3>
                <p className="text-sm leading-relaxed font-light" style={{ color: '#7A6F60' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ QUOTE BREAK with product image ═══ */}
      <section className="relative overflow-hidden" style={{ background: TEAL_DEEP }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-[300px] lg:min-h-[450px]">
            <Image src="/images/parent-routine/cover-calmer.png" alt="Calmer Evenings Start Here — product cover showing the complete bundle" fill className="object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0E3B2E] lg:block hidden" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E3B2E] to-transparent lg:hidden" />
          </div>
          <div className="flex items-center px-8 sm:px-16 py-16 lg:py-24 relative z-10">
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", color: CREAM }} className="text-2xl sm:text-3xl font-semibold italic leading-snug">
                &ldquo;We already agreed on the routine. Please check the chart and do the next thing.&rdquo;
              </p>
              <p className="text-xs font-bold uppercase tracking-[0.2em] mt-6" style={{ color: GOLD }}>— Calm Parent Script #5</p>
              <a href={SELAR_URL} className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110" style={{ background: `${GOLD}20`, color: GOLD, border: `1px solid ${GOLD}30` }}>
                Read All 8 Scripts Inside {icons.arrow}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CALCULATOR ═══ */}
      <section ref={calcRef} id="calculator" className="relative py-28 px-6" style={{ background: CREAM }}>
        <div className="max-w-5xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${calcShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: TEAL }}>Interactive tool</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: TEAL_DEEP }} className="text-3xl sm:text-5xl font-bold mt-3 mb-5">Your Parental Stress Calculator</h2>
            <p className="font-light max-w-lg mx-auto" style={{ color: '#7A6F60' }}>Adjust the sliders to estimate how much emotional energy daily friction is costing you.</p>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 transition-all duration-700 delay-200 ${calcShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Sliders */}
            <div className="lg:col-span-7 p-8 rounded-3xl bg-white border-2 flex flex-col gap-10" style={{ borderColor: CREAM_DARK }}>
              {[
                { label: 'Daily Reminders & Nagging', sub: 'Repeat instructions for shoes, homework, packing, etc.', value: nags, set: setNags, min: 2, max: 20, step: 1, unit: 'times / day' },
                { label: 'Screen-Time Arguments', sub: 'Time spent debating, managing tantrums, negotiating device transitions.', value: screenFight, set: setScreenFight, min: 5, max: 90, step: 5, unit: 'mins / day' },
                { label: 'Bedtime Stalling', sub: 'How long bedtime drags past the scheduled sleep hour.', value: bedtimeStall, set: setBedtimeStall, min: 5, max: 120, step: 5, unit: 'mins / night' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold" style={{ color: TEAL_DEEP }}>{s.label}</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-lg" style={{ background: `${TEAL}10`, color: TEAL }}>{s.value} {s.unit}</span>
                  </div>
                  <p className="text-[11px] mb-3 font-light" style={{ color: '#9A8F80' }}>{s.sub}</p>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={(e) => s.set(Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, ${TEAL} 0%, ${TEAL} ${((s.value - s.min) / (s.max - s.min)) * 100}%, ${CREAM_DARK} ${((s.value - s.min) / (s.max - s.min)) * 100}%, ${CREAM_DARK} 100%)` }} />
                </div>
              ))}
            </div>

            {/* Results */}
            <div className="lg:col-span-5 relative rounded-3xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DEEP})` }}>
              <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 20%, #ffffff, transparent 60%)' }} />
              <div className="relative z-10 p-8 flex flex-col justify-between h-full min-h-[400px]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: GOLD_LIGHT }}>Your Stress Estimate</span>
                  <div className="mt-6 mb-8">
                    <span style={{ fontFamily: "'Playfair Display', serif", color: CREAM }} className="block text-6xl sm:text-7xl font-black leading-none">{weeklyHrs}</span>
                    <span className="text-sm font-medium mt-1 block" style={{ color: 'rgba(253,248,239,0.6)' }}>hours of weekly friction</span>
                  </div>
                  <div className="flex flex-col gap-4 border-t pt-5" style={{ borderColor: 'rgba(253,248,239,0.1)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-light" style={{ color: 'rgba(253,248,239,0.4)' }}>Annual nagging incidents</span>
                      <span className="text-sm font-bold" style={{ color: GOLD }}>{annualNags.toLocaleString()} times</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-light" style={{ color: 'rgba(253,248,239,0.4)' }}>Peace restored monthly</span>
                      <span className="text-sm font-bold" style={{ color: CREAM }}>{monthlySaved} hours</span>
                    </div>
                  </div>
                </div>
                <a href={SELAR_URL} className="mt-8 w-full text-center text-sm font-bold py-4 rounded-2xl transition-all hover:brightness-110" style={{ background: GOLD, color: TEAL_DEEP }}>
                  Reclaim {monthlySaved} Hours of Sanity →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHAT&apos;S INSIDE ═══ */}
      <section ref={insideRef} id="inside" className="relative py-28 px-6" style={{ background: "linear-gradient(135deg, #ffffff 0%, #f4f8ff 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${insideShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: GOLD }}>Everything Included</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: CREAM }} className="text-3xl sm:text-5xl font-bold mt-3 mb-5">Inside the Bundle</h2>
            <p className="font-light max-w-lg mx-auto" style={{ color: 'rgba(253,248,239,0.4)' }}>Not a 300-page theory book. A practical, printable toolbox you start using today.</p>
          </div>

          {/* Product spread */}
          <div className={`mb-16 transition-all duration-700 delay-200 ${insideShow ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="relative rounded-3xl overflow-hidden border max-w-3xl mx-auto" style={{ borderColor: `${GOLD}15` }}>
              <Image src="/images/parent-routine/cover-screentime.png" alt="Stop the daily screen-time fight — full bundle spread showing all included materials" width={800} height={1100} className="w-full h-auto object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${WARM_BG}80 0%, transparent 30%)` }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: icons.book, title: 'Parent Routine Guide', desc: 'The psychology of routine-setting. Transition from nagging to visual reminders without causing a rebellion.' },
              { icon: icons.notebook, title: '37-Page Workbook', desc: 'Interactive templates to map your specific rules, timings, and expectations for the whole household.' },
              { icon: icons.shield, title: 'Screen-Time Agreement', desc: 'A mutual written contract. Daily device limits, allowed apps, device parking spot, and consequence ladder.' },
              { icon: icons.chat, title: 'Calm Parent Scripts', desc: 'Exact verbal patterns to de-escalate conflict mid-argument. No more guessing what to say under pressure.' },
              { icon: icons.chart, title: 'Chore & Homework Trackers', desc: 'Visual check-off sheets that put children in charge of their duties and build intrinsic motivation.' },
              { icon: icons.calendar, title: 'Weekly Family Review', desc: 'A 5-minute Sunday ritual to evaluate what worked, what caused friction, and what to adjust next week.' },
            ].map((item, i) => (
              <div key={i} className={`group p-7 rounded-2xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${insideShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ background: 'rgba(253,248,239,0.03)', borderColor: 'rgba(253,248,239,0.06)', transitionDelay: `${300 + i * 100}ms` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${GOLD}15`, color: GOLD }}>
                  {item.icon}
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: CREAM }}>{item.title}</h3>
                <p className="text-xs leading-relaxed font-light" style={{ color: 'rgba(253,248,239,0.4)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7-DAY TIMELINE ═══ */}
      <section ref={timeRef} className="relative py-28 px-6" style={{ background: CREAM }}>
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${timeShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: TEAL }}>Quick Results</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: TEAL_DEEP }} className="text-3xl sm:text-5xl font-bold mt-3 mb-5">Your 7-Day Home Reset</h2>
            <p className="font-light max-w-lg mx-auto" style={{ color: '#7A6F60' }}>You do not need to overhaul everything at once. Roll it out step by step.</p>
          </div>

          <div className="relative ml-4 sm:ml-8">
            <div className="absolute left-[11px] top-4 bottom-4 w-px" style={{ background: `linear-gradient(to bottom, ${TEAL}40, ${TEAL}10)` }} />
            <div className="flex flex-col gap-10">
              {[
                { day: 'Day 1', title: 'Download & Print', desc: 'Get the bundle from Selar, download the PDFs, and print the Core Guide plus blank Chore Charts and Script Cards.' },
                { day: 'Day 3', title: 'The Routine Family Meeting', desc: 'A quick 10-minute talk with the kids. Introduce the visual routine cards and choose ONE rule to focus on first.' },
                { day: 'Day 5', title: 'Sign the Screen-Time Agreement', desc: 'Fill out the contract together. Agree on allowed apps, hours, device parking, and the consequence ladder.' },
                { day: 'Day 7', title: 'Run the Sunday Family Review', desc: 'Five minutes: what worked, what caused friction, who earned rewards, and what to adjust next week.' },
              ].map((step, idx) => (
                <div key={idx} className={`relative transition-all duration-700 ${timeShow ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{ paddingLeft: '56px', transitionDelay: `${idx * 150}ms` }}>
                  <div className="absolute left-0 top-[22px] w-[23px] h-[23px] rounded-full border-2 flex items-center justify-center" style={{ borderColor: `${TEAL}40`, background: CREAM }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: TEAL }} />
                  </div>
                  <div className="p-6 rounded-2xl bg-white border-2 transition-all hover:shadow-md" style={{ borderColor: CREAM_DARK }}>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: TEAL }}>{step.day}</span>
                    <h3 className="text-lg font-bold mt-1 mb-2" style={{ color: TEAL_DEEP }}>{step.title}</h3>
                    <p className="text-sm leading-relaxed font-light" style={{ color: '#7A6F60' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRICING CTA ═══ */}
      <section ref={priceRef} className="relative py-28 px-6 overflow-hidden" style={{ background: `linear-gradient(180deg, ${TEAL_DEEP}, ${WARM_BG})` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none" style={{ background: `${GOLD}08` }} />

        <div className={`max-w-2xl mx-auto relative z-10 text-center transition-all duration-700 ${priceShow ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="p-10 sm:p-14 rounded-[2rem] border" style={{ background: 'rgba(253,248,239,0.03)', borderColor: `${GOLD}15`, backdropFilter: 'blur(20px)' }}>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: GOLD }}>Limited Launch Price</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: CREAM }} className="text-4xl sm:text-6xl font-bold mt-4 mb-2">₦3,000</h2>
            <p className="text-sm font-light mb-10" style={{ color: 'rgba(253,248,239,0.3)' }}>One-time payment · Instant PDF access · No subscription</p>

            <div className="flex flex-col gap-3 mb-10 text-left max-w-sm mx-auto">
              {[
                'Premium Parent Routine Guide',
                '37-Page Interactive Workbook',
                'Screen-Time Agreement Contract',
                'Calm Parent Script Cards',
                'Chore & Homework Trackers',
                '7-Day Home Reset Plan',
                'Weekly Family Review Templates',
                'Bonus Printable Pages Pack',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: `${TEAL}20`, color: GOLD }}>{icons.check}</div>
                  <span className="text-sm font-light" style={{ color: 'rgba(253,248,239,0.55)' }}>{item}</span>
                </div>
              ))}
            </div>

            <a href={SELAR_URL} className="group inline-flex items-center justify-center gap-3 px-12 py-5 rounded-2xl text-lg font-bold transition-all hover:scale-[1.02] hover:brightness-110 shadow-lg" style={{ background: `linear-gradient(135deg, ${GOLD}, #C4942F)`, color: TEAL_DEEP, boxShadow: `0 8px 30px ${GOLD}25` }}>
              Get Instant Access Now
            </a>

            <div className="flex flex-wrap justify-center gap-6 mt-8 text-[11px] font-light" style={{ color: 'rgba(253,248,239,0.2)' }}>
              <span>🔒 Secure Checkout</span>
              <span>📥 Instant Download</span>
              <span>🖨️ Unlimited Prints</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ AFFILIATE ═══ */}
      {/* ═══ AFFILIATE ═══ */}
      <section className="px-6 border-y" style={{ background: '#FFFFFF', borderColor: CREAM_DARK, paddingTop: '112px', paddingBottom: '112px' }}>
        <div className="max-w-4xl mx-auto bg-[#FDF8EF] border p-8 sm:p-12 rounded-3xl relative overflow-hidden" style={{ borderColor: `${GOLD}30` }}>
          <div className="absolute top-0 right-0 w-28 h-28 rounded-bl-full flex items-center justify-center" style={{ background: `${TEAL}10` }}>
            <span style={{ fontFamily: "'Playfair Display', serif", color: TEAL }} className="text-2xl font-black">50%</span>
          </div>
          <div className="max-w-xl relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: TEAL }}>Affiliate Program</span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: TEAL_DEEP }} className="text-2xl sm:text-3xl font-bold mt-2 mb-4">Earn ₦1,500 per referral</h3>
            <p className="text-sm font-light leading-relaxed mb-6" style={{ color: '#7A6F60' }}>
              Love this system? Recommend it to other parents and earn 50% on every sale. Selar handles tracking and payouts automatically — just share your affiliate link.
            </p>
            <a href="https://selar.com/affiliate" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-sm font-bold transition-all hover:opacity-80" style={{ color: TEAL }}>
              Join the Affiliate Program <span className="group-hover:translate-x-1 transition-transform inline-block">{icons.arrow}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="px-6" style={{ background: CREAM, paddingTop: '112px', paddingBottom: '112px' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: TEAL }}>Questions</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: TEAL_DEEP }} className="text-3xl sm:text-4xl font-bold mt-3">Frequently Asked</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { q: 'Is this a physical product?', a: 'No — 100% digital PDF download. You get instant access after payment on Selar and can print unlimited copies from home or any print shop.' },
              { q: 'What age group is this for?', a: 'Built for children aged 3 to 14. Younger kids (3-5) use visual routine charts. Older children (6-14) benefit from the Screen-Time Agreement, Homework Trackers, and Family Reviews.' },
              { q: 'How do the calm parent scripts work?', a: 'Short, firm yet polite verbal patterns to use instead of shouting. Example: "We already agreed on the screen-time rule. Please check the chart and do the next thing."' },
              { q: 'Can I print multiple copies?', a: 'Absolutely. Once purchased, you own personal printing rights. Reprint chore charts, screen-time contracts, and review pages whenever needed.' },
            ].map((faq, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border transition-all duration-300 hover:shadow-md" style={{ borderColor: CREAM_DARK }}>
                <h3 className="text-base font-bold mb-3" style={{ color: TEAL_DEEP }}>{faq.q}</h3>
                <p className="text-sm leading-relaxed font-light" style={{ color: '#7A6F60' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA BANNER ═══ */}
      <section className="px-6 relative overflow-hidden" style={{ background: `linear-gradient(to bottom, ${TEAL_DEEP}, ${WARM_BG})`, paddingTop: '112px', paddingBottom: '112px' }}>
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(212,168,67,0.15), transparent 70%)' }} />
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: CREAM }} className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">Your peaceful home starts tonight.</h2>
          <p className="font-light text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: 'rgba(253,248,239,0.65)' }}>Download the bundle, print one page, and watch the difference when the rules are on the wall instead of in your throat.</p>
          <a href={SELAR_URL} className="group inline-flex items-center justify-center gap-3 px-10 py-4.5 rounded-2xl text-base font-bold transition-all hover:scale-[1.02] hover:brightness-110 shadow-xl" style={{ background: `linear-gradient(135deg, ${GOLD}, #C4942F)`, color: TEAL_DEEP, boxShadow: `0 8px 30px ${GOLD}20` }}>
            Get the Bundle — ₦3,000
            <span className="group-hover:translate-x-1 transition-transform inline-block">{icons.arrow}</span>
          </a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-12 px-6 border-t text-center" style={{ background: WARM_BG, borderColor: 'rgba(253,248,239,0.05)' }}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-light" style={{ color: 'rgba(253,248,239,0.2)' }}>
            © {new Date().getFullYear()} ParentPeace · Hosted on <Link href="/" className="underline hover:opacity-60 transition-opacity">Triumphant HQ</Link>
          </p>
          <div className="flex gap-6 text-xs font-light" style={{ color: 'rgba(253,248,239,0.2)' }}>
            <Link href="/privacy-policy" className="hover:opacity-60 transition-opacity">Privacy</Link>
            <Link href="/terms" className="hover:opacity-60 transition-opacity">Terms</Link>
          </div>
        </div>
      </footer>

      {/* ═══ CUSTOM SLIDER STYLES ═══ */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 22px; height: 22px; border-radius: 50%;
          background: ${TEAL}; cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(15,23,42,0.12), 0 0 0 3px ${TEAL}20;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          box-shadow: 0 2px 12px rgba(15,23,42,0.12), 0 0 0 5px ${TEAL}25;
        }
        input[type="range"]::-moz-range-thumb {
          width: 22px; height: 22px; border-radius: 50%;
          background: ${TEAL}; cursor: pointer;
          border: 3px solid white;
        }
      `}</style>
    </div>
  );
}
