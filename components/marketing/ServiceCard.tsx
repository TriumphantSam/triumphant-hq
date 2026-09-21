import Image from "next/image";
import Link from "next/link";
import type { AgencyService } from "@/lib/services";
import ServiceIcon from "./ServiceIcon";

export default function ServiceCard({
  service,
  detailed = false,
}: {
  service: AgencyService;
  detailed?: boolean;
}) {
  const serviceNumbers: Record<string, string> = {
    websites: "01",
    "app-development": "02",
    seo: "03",
    automation: "04",
  };

  return (
    <article className="agency-card service-card group flex flex-col justify-between overflow-hidden">
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            className="object-cover object-center transition duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60" />
        </div>
        <div className="p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="service-icon !mb-0">
              <ServiceIcon name={service.icon} />
            </div>
            <span className="font-mono text-[0.72rem] font-bold tracking-[0.14em] text-slate-400">
              {serviceNumbers[service.slug] ?? "01"}
            </span>
          </div>
          <p className="card-eyebrow">{service.eyebrow}</p>
          <h3 className="line-clamp-2">{detailed ? service.title : service.shortTitle}</h3>
          <p className="card-copy line-clamp-3">{detailed ? service.description : service.promise}</p>
          {detailed ? (
            <ul className="check-list mt-5">
              {service.outcomes.slice(0, 3).map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      <div className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
        <Link className="text-link group/link !mt-0 !pt-0" href={`/services/${service.slug}`}>
          Explore {service.shortTitle}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
