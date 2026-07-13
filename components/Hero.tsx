import Link from "next/link";
import Image from "next/image";
import { discoveryCallUrl } from "@/lib/services";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_12%,rgba(7,94,229,0.12),transparent_28rem)]" />
      <div className="mx-auto grid min-h-[760px] max-w-[1240px] items-center gap-14 px-5 py-20 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
        <div>
          <p className="eyebrow">Technology and growth agency</p>
          <h1 className="mt-5 max-w-[820px] text-[clamp(3.1rem,7vw,6.2rem)] font-[820] leading-[0.94] tracking-[-0.07em] text-slate-950">
            Digital systems built to move business forward.
          </h1>
          <p className="mt-7 max-w-[680px] text-[clamp(1.05rem,2vw,1.25rem)] leading-8 text-slate-600">
            We design high-performing websites, custom applications, search growth systems and practical automation for
            ambitious teams ready to operate at a higher level.
          </p>
          <div className="button-row mt-9">
            <a className="button button-primary" href={discoveryCallUrl} target="_blank" rel="noreferrer">
              Book a discovery call
            </a>
            <Link className="button button-secondary" href="/services">
              Explore services
            </Link>
          </div>
          <div className="mt-12 grid max-w-[650px] grid-cols-3 gap-2.5">
            {[
              ["Since 2017", "Digital delivery"],
              ["4 disciplines", "One expert partner"],
              ["Global ready", "Local accountability"],
            ].map(([value, label]) => (
              <div className="rounded-2xl border border-slate-200/80 bg-white/75 px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur-sm" key={value}>
                <strong className="block text-sm font-extrabold text-slate-950">{value}</strong>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-10 -z-10 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-2.5 shadow-[0_30px_90px_rgba(7,45,100,0.18)]">
            <Image
              src="/images/agency-digital-systems-hero.png"
              alt="Connected website, application, analytics and automation systems"
              width={1024}
              height={768}
              className="aspect-[4/3] w-full rounded-[1.45rem] object-cover"
              priority
            />
            <div className="absolute inset-x-7 bottom-7 rounded-2xl border border-white/70 bg-white/88 p-4 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-blue-600">Connected delivery</p>
                  <p className="mt-1 text-sm font-bold text-slate-950">Strategy, design, engineering and growth</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-600 text-white">↗</span>
              </div>
            </div>
          </div>
          <div className="absolute right-5 top-5 rounded-2xl border border-blue-100 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md">
            <p className="text-[0.62rem] font-bold uppercase tracking-wider text-slate-400">Built around</p>
            <p className="mt-1 text-sm font-extrabold text-slate-950">Business outcomes</p>
          </div>
        </div>
      </div>
    </section>
  );
}
