import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Local Services Card */}
          <div className="glass glass-hover rounded-2xl p-8">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--secondary-color)' }}>
              Local Services
            </h3>
            <p className="text-[var(--text-secondary)]">
              NIMC, School Registrations & Essential Internet Support
            </p>
          </div>

          {/* Digital Growth Card */}
          <div className="glass glass-hover rounded-2xl p-8">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--secondary-color)' }}>
              Digital Growth
            </h3>
            <p className="text-[var(--text-secondary)]">
              SEO Strategy & Website Management (40% Organic Growth Track Record)
            </p>
          </div>

          {/* AI Data Card */}
          <div className="glass glass-hover rounded-2xl p-8">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--secondary-color)' }}>
              AI Data & Training
            </h3>
            <p className="text-[var(--text-secondary)]">
              Human-in-the-Loop Data Annotation & Quality Assurance
            </p>
          </div>

          {/* Tech Diary Card */}
          <div className="glass glass-hover rounded-2xl p-8">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--secondary-color)' }}>
              Tech Diary
            </h3>
            <p className="text-[var(--text-secondary)]">
              Insights, tutorials, and my journey re-learning code in the AI era
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
          Ready to Bridge the Gap?
        </h2>
        <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
          Whether you need local tech support or global digital solutions, we're here to help.
        </p>
        <a
          href="/contact"
          className="inline-block px-8 py-4 text-lg font-semibold uppercase tracking-wider transition-all duration-300 rounded-lg"
          style={{
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid var(--accent-color)',
            color: 'var(--accent-color)',
          }}
        >
          Get in Touch
        </a>
      </section>
    </div>
  );
}
