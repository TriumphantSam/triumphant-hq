import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export default function Breadcrumbs({
  items,
}: {
  items: Array<{ name: string; path: string }>;
}) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="Breadcrumb" className="section-shell !pb-0 !pt-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          {items.map((item, index) => {
            const last = index === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {last ? (
                  <span className="font-medium text-slate-800">{item.name}</span>
                ) : (
                  <Link href={item.path} className="transition hover:text-blue-700">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
