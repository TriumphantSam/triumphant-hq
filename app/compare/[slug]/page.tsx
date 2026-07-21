import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComparisonView from "@/components/marketing/ComparisonView";
import { comparisons, getComparison } from "@/lib/compare-industries";

export function generateStaticParams() {
  return comparisons.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getComparison(slug);
  if (!page) return {};
  return {
    title: `${page.title} | Triumphant HQ`,
    description: page.description,
  };
}

export default async function ComparisonSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getComparison(slug);
  if (!page) notFound();
  return <ComparisonView page={page} />;
}
