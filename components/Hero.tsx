import Link from "next/link";
import Image from "next/image";
import { discoveryCallUrl } from "@/lib/services";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/80 bg-white">
      {/* Premium Tech Dot-Grid Background & Soft Radial Ambient Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(7,94,229,0.06)_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-80" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_12%,rgba(7,94,229,0.14),transparent_35rem)]" />
      
      <div className="mx-auto grid min-h-[760px] max-w-[1240px] items-center gap-14 px-5 py-24 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
        <div>
          <p className="eyebrow">Technology and growth agency</p>
          <h1 className="mt-5 max-w-[820px] text-[clamp(3.1rem,7vw,5.5rem)] font-[850] leading-[0.96] tracking-[-0.065em] text-slate-950">
            Digital systems built to <span className="gradient-text">move business forward.</span>
          </h1>
          <p className="mt-7 max-w-[680px] text-[clamp(1.05rem,2vw,1.22rem)] leading-8 text-slate-600">
            We design high-performing websites, custom applications, search growth systems and practical automation for
            ambitious teams ready to operate at a higher level.
          </p>
          
          {/* Responsive Button Spacing */}
          <div className="mt-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4">
            <a className="button button-primary sm:w-auto" href={discoveryCallUrl} target="_blank" rel="noreferrer">
              Book a discovery call
            </a>
            <Link className="button button-secondary sm:w-auto" href="/services">
              Explore services
            </Link>
          </div>
          
          {/* Responsive Stats Grid to prevent "jampacked" layout on mobile */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[680px]">
            {[
              ["Since 2017", "Digital delivery"],
              ["4 disciplines", "One expert partner"],
              ["Global ready", "Local accountability"],
            ].map(([value, label]) => (
              <div 
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_12px_40px_rgba(7,94,229,0.06)]" 
                key={value}
              >
                <strong className="block text-base font-extrabold text-slate-950">{value}</strong>
                <span className="mt-1.5 block text-xs leading-5 text-slate-500 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Image Illustration Column with Elevated Badge Contrasts */}
        <div className="relative">
          <div className="absolute -inset-10 -z-10 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2.2rem] border border-white bg-white p-2.5 shadow-[0_32px_100px_rgba(7,45,100,0.15)]">
            <Image
              src="/images/agency-digital-systems-hero.png"
              alt="Connected website, application, analytics and automation systems"
              width={1024}
              height={768}
              className="aspect-[4/3] w-full rounded-[1.8rem] object-cover"
              priority
            />
            {/* Bottom Badge - Solid White with dark text */}
            <div className="absolute inset-x-7 bottom-7 rounded-2xl border border-slate-100 bg-white p-4.5 shadow-[0_16px_40px_rgba(15,23,42,0.12)] z-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-blue-600">Connected delivery</p>
                  <p className="mt-1 text-sm font-extrabold text-slate-950">Strategy, design, engineering and growth</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-600 text-white shadow-[0_4px_12px_rgba(7,94,229,0.3)] font-bold">↗</span>
              </div>
            </div>
          </div>
          {/* Top-Right Badge - Solid White with high-contrast text */}
          <div className="absolute right-5 top-5 rounded-2xl border border-slate-100 bg-white px-4.5 py-3.5 shadow-[0_16px_40px_rgba(15,23,42,0.12)] z-10">
            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">Built around</p>
            <p className="mt-1 text-sm font-extrabold text-slate-950">Business outcomes</p>
          </div>
        </div>
      </div>
    </section>
  );
}
