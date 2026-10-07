import Link from "next/link";
import { whatsappLink } from "@/lib/contact";

const wa = whatsappLink("Hi Triumphant Tech, I saw your website and I'd like a website with WhatsApp automation for my business.");

export default function Hero() {
  return (
    <section className="home-hero relative flex min-h-[min(82svh,760px)] items-center overflow-hidden bg-[var(--navy)] text-white">
      <div className="pointer-events-none absolute -right-28 top-0 h-96 w-96 rounded-full bg-[var(--brand)]/10 blur-3xl" />
      <div className="relative mx-auto w-full max-w-[1240px] px-5 py-20 sm:py-24 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9ec2ff]">Ibadan-based · Serving Nigeria since 2017</p>
        <h1 className="font-display mt-6 max-w-4xl text-[clamp(2.7rem,6vw,5.7rem)] font-extrabold leading-[1.04] tracking-[-0.055em]">Websites that make it easier for customers to choose you.</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-xl">We build clear, fast websites and connect WhatsApp and AI automation so your business can respond, book and follow up with confidence.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-13 items-center justify-center rounded-xl bg-[var(--wa)] px-6 py-3 font-bold text-white transition hover:bg-[#16a34a] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white">Chat on WhatsApp ↗</a>
          <Link href="/portfolio" className="inline-flex min-h-13 items-center justify-center rounded-xl border border-white/40 px-6 py-3 font-bold text-white transition hover:bg-white/10 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white">See our work →</Link>
        </div>
      </div>
    </section>
  );
}
