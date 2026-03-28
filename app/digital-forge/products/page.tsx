import { getForgeProducts } from "@/lib/digital-forge";

export const metadata = {
  title: "Digital Forge Products | Triumphant HQ",
  description: "Explore Digital Forge product categories and premium digital business assets.",
};

import Link from "next/link";

export default async function DigitalForgeProductsPage() {
  const forgeProducts = await getForgeProducts();
  return (
    <div className="min-h-screen pt-28 pb-20">
      <section className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
        <p className="uppercase tracking-widest text-sm font-semibold mb-2" style={{ color: 'var(--secondary-color)', letterSpacing: '0.25em' }}>
          Product Library
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          A growing library of practical digital products.
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 720, lineHeight: 1.8, marginBottom: '2.5rem' }}>
          Digital Forge products are designed around implementation. Each offer is built as a structured package, not a random PDF dropped into a store.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {forgeProducts.map((product) => (
            <Link key={product.slug} href={`/digital-forge/products/${product.slug}`} className="glass glass-hover rounded-2xl" style={{ padding: '1.8rem', borderTop: '3px solid var(--accent-color)', textDecoration: 'none', display: 'block' }}>
              <p style={{ color: 'var(--secondary-color)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, marginBottom: '0.75rem' }}>
                {product.category}
              </p>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.8rem', lineHeight: 1.35 }}>
                {product.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '1rem', fontSize: '0.95rem' }}>
                {product.promise}
              </p>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.92rem', marginBottom: '1.2rem' }}>
                <strong>Format:</strong> {product.format}
              </p>
              <span style={{ color: 'var(--accent-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.82rem' }}>
                {product.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
