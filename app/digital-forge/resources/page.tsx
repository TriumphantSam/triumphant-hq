import { forgeResources } from "@/lib/digital-forge";

export const metadata = {
  title: "Digital Forge Resources | Triumphant HQ",
  description: "Free and supporting Digital Forge resources, lead magnets, prompt packs, and frameworks.",
};

export default function DigitalForgeResourcesPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <section className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
        <div className="glass rounded-3xl" style={{ padding: 'clamp(2rem, 4vw, 3rem)' }}>
          <p className="uppercase tracking-widest text-sm font-semibold mb-2" style={{ color: 'var(--secondary-color)', letterSpacing: '0.25em' }}>
            Resources
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            The free layer that feeds the product ladder.
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 760, lineHeight: 1.8 }}>
            Digital Forge resources are designed to create quick wins, improve trust, and move visitors naturally into deeper offers without relying on vague hype.
          </p>
        </div>
      </section>

      <section className="max-w-screen-xl px-6 sm:px-10 lg:px-16" style={{ paddingTop: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {forgeResources.map((resource) => (
            <div key={resource.title} className="glass rounded-2xl" style={{ padding: '1.75rem' }}>
              <h2 style={{ color: 'var(--secondary-color)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem' }}>{resource.title}</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.95rem' }}>{resource.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
