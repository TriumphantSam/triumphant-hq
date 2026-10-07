import type { Metadata } from "next";
import Link from "next/link";
import { getForgeProducts } from "@/lib/digital-forge";
import { formatOfferPrice, resolveLaunchBundleOffer } from "@/lib/digital-forge-offers";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Shop Digital Products & Tools | Triumphant HQ",
  description: "Browse ready-to-use sales assets, AI playbooks and workflow tools from Triumphant HQ's Digital Forge. Start with the Digital Product Seller Launch Bundle.",
  path: "/shop",
});

export default async function ShopPage() {
  const offer = resolveLaunchBundleOffer();
  const products = (await getForgeProducts()).slice(0, 6);
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[var(--navy)] px-5 py-16 text-white sm:py-20 lg:px-8"><div className="mx-auto max-w-[1240px]"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9ec2ff]">Triumphant HQ shop</p><h1 className="font-display mt-4 max-w-3xl text-[clamp(2.5rem,5vw,4.7rem)] font-bold leading-tight tracking-[-0.05em]">Practical tools to help you sell and build.</h1><p className="mt-5 max-w-2xl leading-8 text-slate-200">Start with ready-made sales assets, then explore our Digital Forge products and systems.</p></div></section>
      <section className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8"><div className="rounded-3xl border border-blue-200 bg-[var(--tint)] p-7 sm:p-10"><p className="eyebrow">Start here</p><h2 className="font-display mt-3 text-3xl font-bold text-slate-950">Digital Product Seller Launch Bundle</h2><p className="mt-4 max-w-2xl leading-7 text-slate-700">WhatsApp scripts, price replies and daily sales posts you can adapt today.</p><p className="mt-4 text-2xl font-bold text-slate-950">{formatOfferPrice(offer.amount, offer.currency)}</p><Link href="/digital-product" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-[var(--brand)] px-6 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]">View the bundle →</Link></div>
        <div className="mt-14 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Digital Forge</p><h2 className="font-display mt-3 text-3xl font-bold text-slate-950">Explore more products</h2></div><Link href="/digital-forge/products" className="font-bold text-blue-700 underline underline-offset-4">Browse the full catalogue →</Link></div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <Link key={product.slug} href={`/digital-forge/products/${product.slug}`} className="rounded-2xl border border-slate-200 p-6 transition hover:border-blue-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-[var(--brand)]"><p className="text-xs font-bold uppercase tracking-wide text-blue-700">{product.category}</p><h3 className="mt-3 text-xl font-bold text-slate-950">{product.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{product.promise}</p><span className="mt-5 inline-block font-bold text-blue-700">View product →</span></Link>)}</div>
      </section>
    </div>
  );
}
