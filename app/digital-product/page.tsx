'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CHECKOUT_URL = '/digital-forge/checkout?offer=digital-product-seller-launch-bundle';
const PRICE_NOW = '₦3,000';
const PRICE_LATER = '₦10,000';

const GREEN = '#0B3D2E';
const GREEN_DEEP = '#06251C';
const GOLD = '#F2B430';
const CREAM = '#F7F4EC';
const WHATSAPP = '#25D366';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function useLagosCountdown() {
  const [left, setLeft] = useState({ h: 23, m: 59, s: 59 });

  useEffect(() => {
    const tick = () => {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      }).formatToParts(new Date());
      const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
      const m = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
      const s = Number(parts.find((p) => p.type === 'second')?.value ?? 0);
      const remaining = (23 - h) * 3600 + (59 - m) * 60 + (59 - s);
      setLeft({
        h: Math.max(0, Math.floor(remaining / 3600)),
        m: Math.max(0, Math.floor((remaining % 3600) / 60)),
        s: Math.max(0, remaining % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return left;
}

function BuyButton({ label, className = '' }: { label: string; className?: string }) {
  return (
    <a
      href={CHECKOUT_URL}
      className={`dp-buy group inline-flex items-center justify-center gap-3 rounded-2xl text-base sm:text-lg font-black tracking-tight transition-all duration-300 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98] shadow-2xl ${className}`}
      style={{
        background: `linear-gradient(135deg, ${GOLD}, #D49420)`,
        color: GREEN_DEEP,
        boxShadow: '0 12px 30px rgba(242,180,48,0.35)',
      }}
    >
      <span>{label}</span>
      <span className="text-xl transition-transform duration-300 group-hover:translate-x-1.5">→</span>
    </a>
  );
}

function CountdownPills({
  left,
  size = 'normal',
}: {
  left: { h: number; m: number; s: number };
  size?: 'normal' | 'large';
}) {
  const isLarge = size === 'large';
  return (
    <div className="flex items-center gap-3">
      {[
        [left.h, 'HRS'],
        [left.m, 'MIN'],
        [left.s, 'SEC'],
      ].map(([n, label]) => (
        <div
          key={String(label)}
          className={`text-center rounded-xl bg-black/45 border border-white/10 ${
            isLarge ? 'min-w-[74px] sm:min-w-[88px] px-3.5 py-3' : 'min-w-[58px] sm:min-w-[64px] px-2.5 py-2'
          }`}
        >
          <div className={`font-black leading-none text-white ${isLarge ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg'}`}>
            {pad(Number(n))}
          </div>
          <div className="mt-1 text-[9px] sm:text-[10px] font-bold tracking-[0.18em] text-[#F2B430]">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatPhone({
  name,
  status,
  messages,
}: {
  name: string;
  status: string;
  messages: { from: 'them' | 'me'; text: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0B141A] shadow-2xl transition-all duration-300 hover:border-white/20">
      <div className="flex items-center gap-3 bg-[#075E54] px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white shadow-inner">
          {name.slice(0, 1)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{name}</p>
          <p className="text-[11px] text-white/75">{status}</p>
        </div>
      </div>
      <div className="space-y-3.5 bg-[#ECE5DD] p-5 sm:p-6" style={{ minHeight: 300 }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] sm:text-[14px] leading-relaxed shadow-sm ${
                msg.from === 'me' ? 'rounded-tr-none' : 'rounded-tl-none'
              }`}
              style={{
                background: msg.from === 'me' ? '#DCF8C6' : '#FFFFFF',
                color: '#111827',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DigitalProductPage() {
  const left = useLagosCountdown();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const phase0Ref = useRef<HTMLDivElement>(null);
  const phase1Ref = useRef<HTMLDivElement>(null);
  const phase2Ref = useRef<HTMLDivElement>(null);

  // Video preloader and scroll-scrub loop
  useEffect(() => {
    fetch('/assets/hero.mp4')
      .then((res) => {
        if (!res.ok) throw new Error('Video response was not ok');
        return res.blob();
      })
      .then((blob) => {
        if (videoRef.current) {
          videoRef.current.src = URL.createObjectURL(blob);
          videoRef.current.load();
        }
      })
      .catch(() => {
        if (videoRef.current) {
          videoRef.current.src = '/assets/hero.mp4';
          videoRef.current.load();
        }
      });

    let targetProgress = 0;
    let currentProgress = 0;
    let frameId: number;

    const updateScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const max = rect.height - window.innerHeight;
      if (max > 0) {
        targetProgress = Math.max(0, Math.min(1, -rect.top / max));
      }
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    updateScroll();

    const calcOpacity = (progress: number, enterStart: number, enterEnd: number, exitStart: number, exitEnd: number) => {
      if (progress < enterStart || progress > exitEnd) return 0;
      if (progress < enterEnd) return (progress - enterStart) / (enterEnd - enterStart);
      if (progress > exitStart) return Math.max(0, 1 - (progress - exitStart) / (exitEnd - exitStart));
      return 1.0;
    };

    const scrubLoop = () => {
      currentProgress += (targetProgress - currentProgress) * 0.15;

      const video = videoRef.current;
      if (video && video.duration && !video.seeking) {
        const targetTime = currentProgress * video.duration;
        if (Math.abs(video.currentTime - targetTime) > 0.01) {
          video.currentTime = targetTime;
        }
      }

      const op0 = calcOpacity(targetProgress, 0.0, 0.05, 0.20, 0.28);
      const op1 = calcOpacity(targetProgress, 0.28, 0.38, 0.55, 0.65);
      const op2 = calcOpacity(targetProgress, 0.65, 0.75, 0.90, 0.98);

      if (phase0Ref.current) {
        phase0Ref.current.style.opacity = op0.toFixed(3);
        phase0Ref.current.style.transform = `translateY(${-targetProgress * 45}px)`;
      }
      if (phase1Ref.current) {
        phase1Ref.current.style.opacity = op1.toFixed(3);
        phase1Ref.current.style.transform = `translateY(${(0.45 - targetProgress) * 35}px)`;
      }
      if (phase2Ref.current) {
        phase2Ref.current.style.opacity = op2.toFixed(3);
        phase2Ref.current.style.transform = `translateY(${(0.80 - targetProgress) * 35}px)`;
      }

      frameId = requestAnimationFrame(scrubLoop);
    };

    frameId = requestAnimationFrame(scrubLoop);

    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const packs = [
    {
      no: '01',
      title: 'WhatsApp Launch Kit',
      price: '₦5,000 if sold alone',
      img: '/images/digital-product/pack-whatsapp-launch.png',
      points: ['Launch & teaser scripts that build eager buyer tension', 'Sample & checkout messages that explain the product in 1 screen', 'Delivery & upsell replies to turn 1 sale into 2'],
    },
    {
      no: '02',
      title: 'Price Objection Replies',
      price: '₦2,500 if sold alone',
      img: '/images/digital-product/pack-objections.png',
      points: ['Exact replies for "Too expensive" and "Last price?"', 'What to send when they say "I will get back to you later"', 'When to offer a bonus vs when to stand firm on price'],
    },
    {
      no: '03',
      title: 'TikTok to WhatsApp Scripts',
      price: '₦3,000 if sold alone',
      img: '/images/digital-product/pack-tiktok.png',
      points: ['Comment replies that pull warm buyers into private DMs', 'DM-to-WhatsApp handoff that doesn\'t lose customer intent', 'Checkout follow-ups that close payments seamlessly'],
    },
    {
      no: '04',
      title: 'Daily Sales Post Templates',
      price: '₦2,500 if sold alone',
      img: '/images/digital-product/pack-posts.png',
      points: ['50 ready-to-use sales post frameworks & angles', 'Trust-builders, soft-sells, and urgency openers', 'Complete Call-To-Action bank + 7-Day sales plan'],
    },
  ];

  const reasons = [
    'The launch post is weak, so nobody understands what they are buying.',
    'You cannot explain what is inside in one clean WhatsApp message.',
    'You give the whole file as a “sample” and accidentally kill the sale.',
    'People comment PRICE on TikTok and you dump the entire story in public.',
    'They say too expensive and you either beg or freeze in silence.',
    'Checkout clicks happen, then nobody follows up with the warm lead.',
    'Payment comes in and delivery looks messy or unprofessional.',
  ];

  const benefits = [
    'Announce your product offer without sounding desperate or pushy.',
    'Explain the complete value in one clear, irresistible WhatsApp message.',
    'Send a high-converting teaser sample without giving away the product.',
    'Effortlessly transfer TikTok and Instagram commenters into WhatsApp buyers.',
    'Answer "Too expensive" with confidence without discounting your price.',
    'Follow up abandoned checkouts once, professionally and gracefully.',
    'Deliver the file instantly so the customer actually opens and loves it.',
  ];

  const faqs = [
    {
      q: 'Is this a course?',
      a: 'No. It is a downloadable bundle of copy-paste scripts, posts, and trackers. No Zoom calls. No waiting. You get the files immediately after payment and can start using them on your phone the same day.',
    },
    {
      q: 'Will this work if I sell physical products too?',
      a: 'Yes. The price objection replies, TikTok-to-WhatsApp handoff scripts, and daily sales posts work great for physical product vendors. The launch kit is especially powerful if you sell downloadable guides, templates, planners, or mini-offers.',
    },
    {
      q: 'I do not have a digital product yet. Should I still buy?',
      a: 'Only if you already have something ready to sell, even a simple PDF, checklist, or template. This is a launch and sales-message system, not a product-creation tutorial.',
    },
    {
      q: 'How do I get the files?',
      a: 'Tap any buy button on this page, pay ₦3,000, and the bundle is emailed to you immediately. Check your inbox and spam folder. If you need help, WhatsApp support is available.',
    },
    {
      q: 'Does this guarantee sales?',
      a: 'No. It gives you the exact proven words and the professional follow-up path. You still have to post, reply, and send messages. That is the honest truth.',
    },
    {
      q: 'Why ₦3,000 today and ₦10,000 later?',
      a: '₦3,000 is our special launch window price. After this current window, the price returns to ₦10,000. The countdown resets at midnight Lagos time.',
    },
  ];

  return (
    <div className="dp-landing min-h-screen w-full bg-[#F7F4EC] text-[#10231C]" style={{ fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
      
      {/* 1. High-Contrast Sticky Offer Bar */}
      <header className="fixed top-0 left-0 right-0 z-[120] w-full border-b border-white/10 shadow-lg" style={{ background: GREEN_DEEP }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-10 lg:px-16 py-4 sm:py-5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#25D366]"></span>
            </span>
            <p className="text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-wider text-white">
              Launch price <span style={{ color: GOLD }}>{PRICE_NOW}</span> · returns to {PRICE_LATER}
            </p>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <CountdownPills left={left} size="normal" />
            <a
              href={CHECKOUT_URL}
              className="hidden sm:inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider transition-transform duration-200 hover:scale-105 active:scale-95 shadow-md"
              style={{ background: GOLD, color: GREEN_DEEP }}
            >
              Get Bundle
            </a>
          </div>
        </div>
      </header>

      {/* 2. 400vh Sticky Scroll Hero Video Engine */}
      <div id="hero-section" ref={containerRef} className="relative h-[400vh] w-full clear-both">
        <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
          <video
            id="hero-video"
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover pointer-events-none brightness-[0.45] saturate-[0.8]"
            playsInline
            muted
            preload="auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06251C] via-[#06251C]/40 to-black/50 pointer-events-none"></div>

          {/* Phase 0 Typography (0% - 25% Scroll) */}
          <div
            id="phase-0"
            ref={phase0Ref}
            className="absolute bottom-24 sm:bottom-32 left-8 sm:left-16 md:left-28 max-w-3xl pointer-events-none"
          >
            <div className="mb-5 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full" style={{ background: WHATSAPP }} />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white">4 Complete Packs Inside</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.12] tracking-tight">
              Your digital product is not the problem.
              <span className="block mt-3 font-black" style={{ color: GOLD }}>Your messages are.</span>
            </h1>
            <p className="mt-7 sm:mt-8 text-base sm:text-xl text-white/80 max-w-2xl leading-relaxed">
              Creating the PDF is one thing. Selling it is another. This bundle gives you the launch scripts, objection replies, TikTok-to-WhatsApp messages, and daily posts so buyers actually pay.
            </p>
          </div>

          {/* Phase 1 Typography (28% - 60% Scroll) */}
          <div
            id="phase-1"
            ref={phase1Ref}
            className="absolute top-[32%] right-8 sm:right-16 md:right-28 max-w-2xl pointer-events-none opacity-0"
          >
            <p className="mb-5 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#F2B430]">The Selling System</p>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Announce, convince, and close buyers without sounding desperate.
            </h2>
            <p className="mt-6 text-base sm:text-lg text-white/80 leading-relaxed">
              Never get stuck on "How much?" or "Last price?" again. Copy the exact messages that turn warm chats into instant payments.
            </p>
          </div>

          {/* Phase 2 Typography (65% - 95% Scroll) */}
          <div
            id="phase-2"
            ref={phase2Ref}
            className="absolute bottom-28 sm:bottom-36 left-8 sm:left-16 md:left-28 max-w-2xl pointer-events-none opacity-0"
          >
            <p className="mb-5 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#F2B430]">Instant Download Today</p>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-8">
              The complete copy-paste sales bundle to turn chats into payments.
            </h2>
            <div className="pointer-events-auto mt-8">
              <BuyButton label={`Get the bundle — ${PRICE_NOW}`} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Problem-Aware Listicle ("7 reasons a good file still makes ₦0") */}
      <section className="dp-section relative w-full clear-both" style={{ background: CREAM }}>
        <div className="dp-cluster-lg mx-auto max-w-4xl">
          <div className="dp-cluster">
            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.22em]" style={{ color: GREEN }}>
              If you are still guessing what to post
            </p>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight" style={{ color: GREEN_DEEP }}>
              7 reasons a good file still makes <span className="underline decoration-[#F2B430]">₦0</span>
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-[#4B5C54]">
              Most products do not fail because the idea is useless. They fail at the message. Read this, then decide.
            </p>
          </div>

          <div className="dp-cards">
            {reasons.map((item, i) => (
              <div
                key={item}
                className="dp-card flex items-start gap-5 sm:gap-6 rounded-2xl bg-white shadow-sm border border-[#E6E1D4] transition-all hover:border-[#F2B430]/60 hover:shadow-md"
              >
                <span
                  className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl text-base sm:text-lg font-black text-[#F2B430] shadow-sm"
                  style={{ background: GREEN }}
                >
                  {pad(i + 1)}
                </span>
                <p className="pt-1 text-base sm:text-lg font-semibold leading-relaxed text-[#10231C]">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div>
            <BuyButton label="I already have a product. Get the scripts." />
          </div>
        </div>
      </section>

      {/* 4. Inside The Bundle (4 Packs Showcases) */}
      <section id="inside" className="dp-section relative w-full clear-both bg-white">
        <div className="dp-cluster-lg mx-auto max-w-6xl">
          <div className="dp-cluster">
            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.22em]" style={{ color: GREEN }}>
              Inside the bundle
            </p>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight" style={{ color: GREEN_DEEP }}>
              Four packs. One launch system. Copy, edit, send.
            </h2>
            <p className="text-base sm:text-lg text-[#4B5C54] max-w-2xl leading-relaxed">
              Everything you need from your very first teaser post to closing sales on WhatsApp and delivering the file cleanly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 lg:gap-14">
            {packs.map((pack) => (
              <article
                key={pack.no}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E6E1D4] bg-[#FBF9F3] p-7 sm:p-10 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-emerald-800/30"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-md">
                    <Image
                      src={pack.img}
                      alt={pack.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-8 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#0B3D2E] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#F2B430]">
                      Pack {pack.no}
                    </span>
                    <span className="rounded-full bg-amber-100/80 px-3.5 py-1 text-xs font-bold text-amber-900">
                      {pack.price}
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl sm:text-3xl font-extrabold text-[#06251C]">
                    {pack.title}
                  </h3>
                  <ul className="mt-6 space-y-3.5 sm:space-y-4 text-sm sm:text-base text-[#3A4D45]">
                    {pack.points.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <span className="text-[#0B3D2E] font-black text-lg leading-none">✓</span>
                        <span className="font-medium leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          {/* Pricing Highlight Banner */}
          <div
            className="dp-banner rounded-3xl text-center text-white shadow-2xl border border-emerald-800/50"
            style={{ background: `linear-gradient(145deg, ${GREEN}, ${GREEN_DEEP})` }}
          >
            <div className="dp-cluster">
              <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#F2B430]">
                Bought one-by-one this is ₦13,000
              </p>
              <h3 className="text-4xl sm:text-6xl md:text-7xl font-black text-white">
                Today the bundle is <span style={{ color: GOLD }}>{PRICE_NOW}</span>
              </h3>
              <p className="text-sm sm:text-base text-white/75">
                After this launch window, the bundle price returns to {PRICE_LATER}.
              </p>
              <div className="flex justify-center">
                <BuyButton label={`Lock ${PRICE_NOW} before midnight`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Benefits & Audience Filter ("What this makes easier") */}
      <section className="dp-section relative w-full clear-both" style={{ background: CREAM }}>
        <div className="mx-auto grid max-w-6xl grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          <div className="dp-cluster-lg">
            <div className="dp-cluster">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight" style={{ color: GREEN_DEEP }}>
                What this makes easier
              </h2>
              <p className="text-base sm:text-lg text-[#4B5C54] leading-relaxed">
                No more guessing what to write or losing sales when people ask questions.
              </p>
            </div>
            <div className="dp-cards">
              {benefits.map((b) => (
                <div key={b} className="dp-card flex items-start gap-4 rounded-2xl bg-white shadow-sm border border-[#E6E1D4]">
                  <span className="font-black text-xl leading-none" style={{ color: GREEN }}>→</span>
                  <p className="text-base sm:text-lg text-[#1B2F27] font-semibold leading-relaxed">{b}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="dp-banner flex flex-col justify-between rounded-3xl text-white shadow-2xl border border-white/10" style={{ background: GREEN_DEEP }}>
            <div className="dp-cluster">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: GOLD }} />
                <span className="text-xs font-black uppercase tracking-widest text-[#F2B430]">Who this is for</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                Ebook, template, prompt-pack, planner, and mini-course sellers. Vendors who close on WhatsApp.
              </p>

              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5">
                <span className="h-2 w-2 rounded-full bg-white/40" />
                <span className="text-xs font-black uppercase tracking-widest text-white/60">Who this is not for</span>
              </div>
              <p className="text-base sm:text-lg text-white/75 leading-relaxed">
                People who want guaranteed money without posting, replying, or following up. People who only collect free files and never sell.
              </p>
            </div>
            <div className="border-t border-white/10" style={{ marginTop: '3rem', paddingTop: '2rem' }}>
              <BuyButton label="This is me. Send the bundle." />
            </div>
          </div>
        </div>
      </section>

      {/* 6. WhatsApp Social Proof Simulator */}
      <section id="proof" className="dp-section relative w-full clear-both" style={{ background: '#0B141A' }}>
        <div className="dp-cluster-lg mx-auto max-w-6xl">
          <div className="dp-cluster">
            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.22em]" style={{ color: WHATSAPP }}>
              Social proof
            </p>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
              This is what the chats look like when the words are ready.
            </h2>
            <p className="text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed">
              Designed from real vendor conversations: launch, price pushback, TikTok-to-WhatsApp, and delivery. Copy the pattern. Fill your blanks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 sm:gap-10">
            <ChatPhone
              name="Tosin · Ebook buyer"
              status="online"
              messages={[
                { from: 'them', text: 'How much is the guide?' },
                { from: 'me', text: 'It is ₦3,000. Instant access after payment.' },
                { from: 'them', text: 'Okay send the link.' },
                { from: 'me', text: 'Here: pay, then send screenshot.' },
                { from: 'them', text: 'Payment done ✅' },
                { from: 'me', text: 'Received. File sent. Start with Start Here.' },
                { from: 'them', text: 'Got it. Thank you so much.' },
              ]}
            />
            <ChatPhone
              name="Chioma · Too expensive"
              status="today"
              messages={[
                { from: 'them', text: 'Ehn this one is too expensive.' },
                { from: 'me', text: 'I understand. What are you comparing it to?' },
                { from: 'them', text: 'I saw a cheaper one.' },
                { from: 'me', text: 'That one is not the same. This includes launch, checkout, and delivery scripts.' },
                { from: 'them', text: 'Hmm. Last price?' },
                { from: 'me', text: '₦3,000 is already the launch price. Should I send the link?' },
                { from: 'them', text: 'Send it.' },
              ]}
            />
            <ChatPhone
              name="Malik from TikTok"
              status="from comments"
              messages={[
                { from: 'them', text: 'PRICE from your video' },
                { from: 'me', text: 'Welcome. The bag in the video is ₦____. Do you want delivery or pickup?' },
                { from: 'them', text: 'Delivery. I dey Lagos.' },
                { from: 'me', text: 'Send your area. I will quote delivery and send payment.' },
                { from: 'them', text: 'Yaba' },
                { from: 'me', text: 'Total is ₦____. Link: ____' },
                { from: 'them', text: '❤️' },
              ]}
            />
            <ChatPhone
              name="Ada · After delivery"
              status="testimonial"
              messages={[
                { from: 'them', text: 'I used the launch message this morning.' },
                { from: 'me', text: 'What happened?' },
                { from: 'them', text: '3 people asked price. 1 paid.' },
                { from: 'me', text: 'That is the point. Repeat the message that worked.' },
                { from: 'them', text: 'The objection replies saved me. I no even reduce price.' },
                { from: 'me', text: 'Good. Track it so you can use it again next week.' },
              ]}
            />
          </div>

          <div className="text-center">
            <BuyButton label="I want chats like this. Buy the bundle." />
          </div>
        </div>
      </section>

      {/* 7. Payout Proof & PayPal Receipts (UNCROPPED, HIGH VISIBILITY) */}
      <section className="dp-section relative w-full clear-both" style={{ background: CREAM }}>
        <div className="dp-cluster-lg mx-auto max-w-6xl">
          <div className="dp-cluster">
            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.22em]" style={{ color: GREEN }}>
              Payout proof
            </p>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight" style={{ color: GREEN_DEEP }}>
              These are real PayPal receipts.
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-[#4B5C54] max-w-3xl">
              Paid to Adeyemi Olayemi from Limitless Technology Group Ltd. Same person selling this bundle. The selling system in the pack is how digital products and services get followed up, checked out, and delivered.
            </p>
          </div>

          {/* Large Uncropped Receipts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {[
              { src: '/images/digital-product/paypal-259.png', alt: 'PayPal receipt: $259.44 USD received 20 February 2026', label: '$259.44 USD · 20 Feb' },
              { src: '/images/digital-product/paypal-171.png', alt: 'PayPal receipt: $171.08 USD received 31 March 2026', label: '$171.08 USD · 31 Mar' },
              { src: '/images/digital-product/paypal-71.png', alt: 'PayPal receipt: $71.13 USD received 16 April 2026', label: '$71.13 USD · 16 Apr' },
            ].map((shot) => (
              <figure key={shot.src} className="dp-card flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E6E1D4] bg-white shadow-xl transition-all hover:shadow-2xl">
                <div className="w-full overflow-hidden rounded-2xl bg-[#FBF9F3] p-3 border border-slate-100">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={720}
                    height={900}
                    className="w-full h-auto object-contain rounded-xl"
                    priority
                  />
                </div>
                <figcaption className="mt-5 py-4 px-4 text-center rounded-xl bg-blue-50 text-xs sm:text-sm font-extrabold text-[#1D4E89] border border-blue-100">
                  {shot.label} · PayPal Paid
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Payout History Breakdown & Document */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-start">
            <div className="dp-banner overflow-hidden rounded-3xl bg-white border border-[#E6E1D4] shadow-xl">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#06251C] mb-8">
                Monthly Payout Summary
              </h3>
              {[
                ['June 2026', [['30/06/2026', 'US$50.02'], ['17/06/2026', 'US$46.08'], ['15/06/2026', 'US$164.08']]],
                ['April 2026', [['16/04/2026', 'US$71.13'], ['15/04/2026', 'US$72.55']]],
                ['March 2026', [['31/03/2026', 'US$171.08'], ['24/03/2026', 'US$174.50'], ['02/03/2026', 'US$274.59']]],
                ['February 2026', [['20/02/2026', 'US$259.44'], ['16/02/2026', 'US$264.63']]],
              ].map(([month, rows]) => (
                <div key={String(month)} className="mb-8 last:mb-0 border-b border-[#EEEAE0] pb-6 last:border-0 last:pb-0">
                  <p className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">{month as string}</p>
                  <div className="space-y-3">
                    {(rows as [string, string][]).map(([date, amt]) => (
                      <div key={date + amt} className="flex items-center justify-between rounded-xl bg-[#FBF9F3] px-4 py-3.5">
                        <span className="text-xs sm:text-sm font-medium text-[#4B5C54]">{date}</span>
                        <span className="rounded-full bg-[#D6E8FF] px-3 py-1 text-xs font-bold text-[#1D4E89]">Paid</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-900">{amt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="dp-card rounded-3xl overflow-hidden border border-[#E6E1D4] shadow-xl bg-white">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#06251C] mb-6">
                Statement Overview
              </h3>
              <div className="relative w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                <Image
                  src="/images/digital-product/payouts.png"
                  alt="Paid payout history from digital products and services"
                  width={720}
                  height={1100}
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <BuyButton label={`Get the same selling system — ${PRICE_NOW}`} />
          </div>
        </div>
      </section>

      {/* 8. Urgency Section */}
      <section className="dp-section relative w-full clear-both text-white text-center" style={{ background: GREEN_DEEP }}>
        <div className="dp-cluster-lg mx-auto max-w-3xl">
          <div className="dp-cluster">
            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#F2B430]">
              Time Sensitive Offer
            </p>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
              1 day left at <span style={{ color: GOLD }}>{PRICE_NOW}</span>
            </h2>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl mx-auto">
              After midnight Lagos time, the price returns to {PRICE_LATER}. If you have a product ready, do not delay your launch.
            </p>
          </div>
          <div className="flex justify-center">
            <CountdownPills left={left} size="large" />
          </div>
          <div>
            <BuyButton label={`Pay ${PRICE_NOW} now`} />
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section className="dp-section relative w-full clear-both bg-white">
        <div className="dp-cluster-lg mx-auto max-w-4xl">
          <div className="dp-cluster">
            <h2 className="text-center text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight" style={{ color: GREEN_DEEP }}>
              Questions people ask before they pay
            </h2>
            <p className="text-center text-base sm:text-lg text-[#4B5C54]">
              Clear answers to common questions about the bundle and delivery.
            </p>
          </div>

          <div className="divide-y divide-[#EEEAE0] rounded-3xl border border-[#EEEAE0] bg-[#FBF9F3] overflow-hidden shadow-sm">
            {faqs.map((faq, i) => (
              <button
                key={faq.q}
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left transition duration-200 hover:bg-black/[0.03] focus:outline-none"
              >
                <div className="dp-faq-item">
                  <div className="flex items-center justify-between gap-5">
                    <p className="font-bold text-base sm:text-xl text-[#10231C]">{faq.q}</p>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xl font-black text-[#0B3D2E]">
                      {openFaq === i ? '−' : '+'}
                    </span>
                  </div>
                  {openFaq === i && (
                    <p className="text-sm sm:text-base leading-relaxed text-[#4B5C54] border-t border-[#E6E1D4]/60" style={{ marginTop: '1.25rem', paddingTop: '1.25rem' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="text-center">
            <BuyButton label="Okay. I am buying." />
          </div>
        </div>
      </section>

      {/* 10. Final Call to Action */}
      <section className="dp-section relative w-full clear-both text-center text-white" style={{ background: `linear-gradient(180deg, ${GREEN}, ${GREEN_DEEP})` }}>
        <div className="dp-cluster-lg mx-auto max-w-3xl">
          <div className="dp-cluster">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
              Stop staring at the file. Launch it.
            </h2>
            <p className="mx-auto max-w-xl text-base sm:text-xl text-white/80 leading-relaxed">
              Pay {PRICE_NOW}, get all four packs by email, and send your first message today. Tomorrow the price is {PRICE_LATER}.
            </p>
          </div>
          <div className="flex justify-center">
            <CountdownPills left={left} size="large" />
          </div>
          <div>
            <BuyButton label={`Get instant access — ${PRICE_NOW}`} />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-white/50 tracking-wider">
            Secure checkout · Instant download · WhatsApp direct support
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="dp-footer relative w-full clear-both text-center text-xs sm:text-sm text-white/50 border-t border-white/10" style={{ background: GREEN_DEEP }}>
        Digital Product Seller Launch Bundle · Hosted on <Link href="/" className="underline hover:text-white transition">Triumphant HQ</Link>
      </footer>

      {/* Mobile Sticky CTA bar */}
      <div className="dp-sticky-buy fixed bottom-0 left-0 right-0 z-[110] border-t border-white/15 sm:hidden shadow-2xl" style={{ background: GREEN_DEEP }}>
        <a
          href={CHECKOUT_URL}
          className="flex items-center justify-between rounded-xl font-black text-base shadow-lg"
          style={{ background: GOLD, color: GREEN_DEEP, padding: '1rem 1.25rem' }}
        >
          <span>Buy Now · {PRICE_NOW}</span>
          <span className="text-xs font-mono font-bold">{pad(left.h)}:{pad(left.m)}:{pad(left.s)} left</span>
        </a>
      </div>
      <div className="h-28 sm:hidden" />
    </div>
  );
}
