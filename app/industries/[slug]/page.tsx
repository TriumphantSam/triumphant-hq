import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IndustryView from "@/components/marketing/IndustryView";
import { getIndustry, industries } from "@/lib/compare-industries";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return industries.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getIndustry(slug);
  if (!page) return {};
  return buildPageMetadata({
    title: `${page.title} | Triumphant HQ`,
    description: page.description,
    path: `/industries/${page.slug}`,
    keywords: [page.title, "Ibadan", "Oyo State", "Nigeria technology agency"],
  });
}

export default async function IndustrySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getIndustry(slug);
  if (!page) notFound();
  return <IndustryView page={page} />;
}
