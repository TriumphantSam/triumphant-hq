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
            className="flex min-h-[120px] flex-col items-center justify-center gap-3 bg-white px-5 py-6"
          >
            <div className="relative flex h-14 w-full items-center justify-center">
              <Image
                src={client.logo}
                alt={`${client.name} logo`}
                width={160}
                height={56}
                className="max-h-12 w-auto max-w-full object-contain"
              />
            </div>
            <p className="text-center text-[0.7rem] font-medium uppercase tracking-[0.12em] text-slate-400">
              {client.sector}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
