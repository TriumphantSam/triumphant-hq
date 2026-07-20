"use client";

import Link from "next/link";
import Image from "next/image";
import { discoveryCallUrl } from "@/lib/services";

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

      <div className="relative z-10 mx-auto flex min-h-[min(100svh,920px)] w-[min(100%-2.5rem,1080px)] flex-col items-center justify-center px-2 pb-24 pt-36 text-center lg:pb-28 lg:pt-40">
        <div className="hero-copy">
          <p className="font-display animate-fade-in-up text-[clamp(1.35rem,2.4vw,1.85rem)] font-bold tracking-[-0.03em] text-white">
            Triumphant<span className="text-[#5b9cff]">HQ</span>
          </p>

          <h1 className="font-display animate-fade-in-up-delay-1 mt-5 text-[clamp(2.35rem,5vw,4.4rem)] font-extrabold leading-[1.05] tracking-[-0.045em] text-white">
            Digital systems built to move business forward.
          </h1>

          <p className="hero-lede animate-fade-in-up-delay-2 mx-auto mt-6 leading-8 text-white/80">
            Websites, custom applications, SEO and automation—designed and delivered as one coherent growth system.
          </p>

          <div className="button-row animate-fade-in-up-delay-3 mt-9 justify-center">
            <a
              className="button button-primary"
              href={discoveryCallUrl}
              target="_blank"
              rel="noreferrer"
            >
              Book a discovery call
            </a>
            <Link className="button button-ghost" href="/services">
              Explore services
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-fade-in-up-delay-4">
        <div className="flex flex-col items-center gap-2 text-white/45">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em]">Scroll</span>
          <span className="block h-8 w-px bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
