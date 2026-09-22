"use client";

import Link from "next/link";
import Image from "next/image";
import { projectEnquiryUrl } from "@/lib/services";

export default function Hero() {
  return (
    <section className="relative isolate min-h-[min(100svh,920px)] overflow-hidden">
      <Image
        src="/images/agency-hero-cinematic.png"
        alt="Modern agency workspace overlooking a city at dusk"
        fill
        priority
        className="object-cover object-center scale-105 animate-hero-ken"
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,12,28,0.62) 0%, rgba(6,12,28,0.42) 45%, rgba(6,12,28,0.78) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 70%, rgba(7,94,229,0.22), transparent 72%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[min(100svh,920px)] w-[min(100%-2.5rem,1100px)] flex-col items-center justify-center px-3 pb-24 pt-36 text-center lg:pb-28 lg:pt-40">
        <div className="hero-copy">
          <div className="animate-fade-in-up inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-md">
            <span className="live-dot !bg-[#5b9cff]" aria-hidden="true" />
            <span className="font-display text-[0.82rem] font-bold uppercase tracking-[0.14em] text-white">
              Triumphant<span className="text-[#7eb0ff]">HQ</span>
            </span>
            <span className="h-3 w-px bg-white/20" aria-hidden="true" />
            <span className="text-[0.78rem] font-medium tracking-wide text-white/80">
              Technology &amp; Growth Partner
            </span>
          </div>

          <h1 className="font-display animate-fade-in-up-delay-1 mt-6 text-[clamp(2.35rem,5.2vw,4.5rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-white">
            Digital systems built to{" "}
            <span className="text-[#8bb6ff]">move business forward</span>.
          </h1>

          <p className="hero-lede animate-fade-in-up-delay-2 mx-auto mt-6 text-[clamp(1.05rem,1.6vw,1.2rem)] leading-relaxed text-white/85">
            Websites, custom applications, SEO, automation and much more, designed and delivered as one coherent growth system.
          </p>

          <div className="button-row animate-fade-in-up-delay-3 mt-9 justify-center">
            <Link
              className="button button-primary"
              href={projectEnquiryUrl}
            >
              Send a project brief
              <span className="button-arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link className="button button-ghost" href="/digital-product">
              Shop a ready-to-use tool
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-fade-in-up-delay-4">
        <div className="scroll-cue">
          <span className="scroll-cue-label">Scroll</span>
          <span className="scroll-cue-mouse" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
