import Link from "next/link";
import type { LeadMagnetMeta } from "@/lib/faqs";

export default function LeadMagnetBand({ magnet }: { magnet: LeadMagnetMeta }) {
  return (
    <section className="section-shell">
      <div className="grid gap-8 border-y border-slate-200 py-12 lg:grid-cols-[1.2fr_auto] lg:items-end lg:gap-12 lg:py-14">
        <div>
          <p className="eyebrow">{magnet.eyebrow}</p>
          <h2 className="font-display mt-5 max-w-2xl text-[clamp(1.7rem,3vw,2.45rem)] font-bold tracking-[-0.04em] text-slate-950">
            {magnet.title}
          </h2>
          <p className="mt-4 max-w-xl text-[1.02rem] leading-8 text-slate-600">{magnet.description}</p>
        </div>
        <Link className="button button-primary shrink-0" href={magnet.href}>
          {magnet.cta}
        </Link>
      </div>
    </section>
  );
}
