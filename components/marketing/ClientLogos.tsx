import Image from "next/image";
import { clientLogos } from "@/lib/case-studies";

export default function ClientLogos({
  eyebrow = "Who we work with",
  title = "Trusted across sectors that need clear digital systems.",
}: {
  eyebrow?: string;
  title?: string;
}) {
  return (
    <section className="section-shell">
      <div className="max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="font-display mt-5 text-[clamp(1.7rem,3vw,2.4rem)] font-bold tracking-[-0.04em] text-slate-950">
          {title}
        </h2>
      </div>

      <ul className="mt-12 grid grid-cols-2 gap-px overflow-hidden border border-slate-200 bg-slate-200 sm:grid-cols-3">
        {clientLogos.map((client) => (
          <li
            key={client.name}
            className="group flex min-h-[124px] flex-col items-center justify-center gap-3.5 bg-white px-6 py-6 transition-colors hover:bg-slate-50/70"
          >
            <div className="relative flex h-14 w-full items-center justify-center">
              <Image
                src={client.logo}
                alt={`${client.name} logo`}
                width={160}
                height={56}
                className="max-h-11 w-auto max-w-full object-contain grayscale opacity-65 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
              />
            </div>
            <p className="text-center text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors group-hover:text-slate-600">
              {client.sector}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
