import Link from "next/link";
import { forgePillars, forgeWorkflow, getForgeProducts } from "@/lib/digital-forge";

export const metadata = {
  title: "Digital Forge | Triumphant HQ",
  description: "Digital Forge is the product division of Triumphant HQ for premium digital playbooks, systems, templates, and launch-ready assets.",
};

export default async function DigitalForgePage() {
  const forgeProducts = await getForgeProducts();
  const featured = forgeProducts.find((item) => item.featured) ?? forgeProducts[0];

  return (
    <div className="min-h-screen pt-28 pb-20">
      <section className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
        <div className="glass rounded-3xl" style={{ padding: 'clamp(2.5rem, 5vw, 4rem)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, var(--accent-color), var(--secondary-color), #7c3aed)' }} />
          <p className="uppercase tracking-widest text-sm font-semibold mb-3" style={{ color: 'var(--secondary-color)', letterSpacing: '0.25em' }}>
            Digital Forge
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5" style={{ color: 'var(--text-primary)', maxWidth: 820, lineHeight: 1.05 }}>
            The digital product division of Triumphant HQ.
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 760, lineHeight: 1.8, fontSize: '1.05rem' }}>
            Digital Forge turns research, packaging, sales strategy, and distribution into a repeatable system for building premium digital products.
            Instead of just publishing PDFs, we build product libraries, offer stacks, launch assets, and reusable business systems.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            <Link href="/digital-forge/products" style={{ display: 'inline-block', padding: '0.9rem 2.2rem', background: 'var(--accent-color)', color: '#fff', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, borderRadius: '2px' }}>
              Explore Products
            </Link>
            <Link href="/digital-forge/resources" style={{ display: 'inline-block', padding: '0.9rem 2.2rem', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, borderRadius: '2px' }}>
              View Resources
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-screen-xl px-6 sm:px-10 lg:px-16" style={{ paddingTop: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {forgePillars.map((pillar) => (
            <div key={pillar.title} className="glass rounded-2xl" style={{ padding: '1.75rem' }}>
              <h2 style={{ color: 'var(--secondary-color)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>{pillar.title}</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.95rem' }}>{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-screen-xl px-6 sm:px-10 lg:px-16" style={{ paddingTop: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }} className="lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass rounded-3xl" style={{ padding: '2rem' }}>
            <p className="uppercase tracking-widest text-sm font-semibold mb-2" style={{ color: 'var(--secondary-color)', letterSpacing: '0.25em' }}>
              Featured Offer
            </p>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{featured.title}</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>{featured.promise}</p>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '1.5rem' }}>Format: {featured.format}</p>
            <Link href={`/digital-forge/products/${featured.slug}`} style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {featured.cta} →
            </Link>
          </div>
          <div className="glass rounded-3xl" style={{ padding: '2rem' }}>
            <p className="uppercase tracking-widest text-sm font-semibold mb-2" style={{ color: 'var(--secondary-color)', letterSpacing: '0.25em' }}>
              Operating Flow
            </p>
            <ol style={{ display: 'grid', gap: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '1rem' }}>
              {forgeWorkflow.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
