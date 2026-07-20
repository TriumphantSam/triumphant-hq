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
  return (
    <article className="agency-card service-card group overflow-hidden">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          className="object-cover object-center transition duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="p-6 sm:p-7">
        <div className="service-icon">
          <ServiceIcon name={service.icon} />
        </div>
        <p className="card-eyebrow">{service.eyebrow}</p>
        <h3>{detailed ? service.title : service.shortTitle}</h3>
        <p className="card-copy">{detailed ? service.description : service.promise}</p>
        {detailed ? (
          <ul className="check-list">
            {service.outcomes.slice(0, 3).map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        ) : null}
        <Link className="text-link" href={`/services/${service.slug}`}>
          Explore {service.shortTitle}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
