export default function ServicesPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
                    Our Services
                </h1>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                    From essential local tech support to advanced digital growth strategies,
                    we provide comprehensive solutions for individuals and businesses.
                </p>
            </section>

            {/* Local & Essential Services */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--accent-color)' }}>
                        Local & Essential Services
                    </h2>
                    <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                        Reliable, in-person support for your everyday tech needs in Ibadan and beyond.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* NIMC Registration */}
                    <div className="glass glass-hover rounded-2xl p-8">
                        <div className="text-5xl mb-4">🆔</div>
                        <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--secondary-color)' }}>
                            NIMC Registration
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-4">
                            Fast and accurate National Identity Number (NIN) registration and enrollment services.
                        </p>
                        <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
                            <li>✓ New NIN enrollment</li>
                            <li>✓ NIN modification & updates</li>
                            <li>✓ NIN slip printing</li>
                            <li>✓ Expert guidance through the process</li>
                        </ul>
                    </div>

                    {/* School Portal Registrations */}
                    <div className="glass glass-hover rounded-2xl p-8">
                        <div className="text-5xl mb-4">🎓</div>
                        <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--secondary-color)' }}>
                            School Registrations
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-4">
                            Hassle-free registration for JAMB, WAEC, NECO, and other educational portals.
                        </p>
                        <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
                            <li>✓ JAMB registration & profile creation</li>
                            <li>✓ WAEC/NECO registration</li>
                            <li>✓ Result checking & verification</li>
                            <li>✓ Portal troubleshooting</li>
                        </ul>
                    </div>

                    {/* General Internet Services */}
                    <div className="glass glass-hover rounded-2xl p-8">
                        <div className="text-5xl mb-4">💻</div>
                        <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--secondary-color)' }}>
                            Internet Services
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-4">
                            Document typing, printing, scanning, and general internet assistance.
                        </p>
                        <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
                            <li>✓ Document typing & formatting</li>
                            <li>✓ Printing & scanning</li>
                            <li>✓ Email setup & support</li>
                            <li>✓ Online form filling</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Digital Professional Services */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--accent-color)' }}>
                        Digital Professional Services
                    </h2>
                    <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                        Advanced solutions for businesses looking to grow their online presence and leverage modern technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* SEO & Website Management */}
                    <div className="glass glass-hover rounded-2xl p-8">
                        <div className="text-5xl mb-4">📈</div>
                        <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--secondary-color)' }}>
                            SEO & Website Management
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-4">
                            Proven strategies to increase your online visibility and drive organic growth.
                        </p>
                        <div className="mb-4 p-4 rounded-lg" style={{ background: 'rgba(0, 255, 136, 0.1)', border: '1px solid var(--accent-color)' }}>
                            <p className="text-sm font-semibold" style={{ color: 'var(--accent-color)' }}>
                                ✨ Track Record: 40% Organic Traffic Increase
                            </p>
                        </div>
                        <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
                            <li>✓ Keyword research & optimization</li>
                            <li>✓ On-page & technical SEO</li>
                            <li>✓ Content strategy development</li>
                            <li>✓ WordPress website setup & maintenance</li>
                            <li>✓ Performance monitoring & reporting</li>
                        </ul>
                    </div>

                    {/* AI Data & Quality Assurance */}
                    <div className="glass glass-hover rounded-2xl p-8">
                        <div className="text-5xl mb-4">🤖</div>
                        <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--secondary-color)' }}>
                            AI Data Consulting
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-4">
                            Human-in-the-Loop data services to ensure your AI models are accurate and reliable.
                        </p>
                        <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
                            <li>✓ Data annotation & labeling</li>
                            <li>✓ AI output evaluation & testing</li>
                            <li>✓ Quality assurance for ML models</li>
                            <li>✓ Prompt engineering & optimization</li>
                            <li>✓ Training data accuracy consulting</li>
                        </ul>
                    </div>

                    {/* Technical Support */}
                    <div className="glass glass-hover rounded-2xl p-8">
                        <div className="text-5xl mb-4">🔧</div>
                        <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--secondary-color)' }}>
                            Technical Support
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-4">
                            Expert troubleshooting and support for hardware, software, and system issues.
                        </p>
                        <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
                            <li>✓ HP printer setup & troubleshooting</li>
                            <li>✓ Microsoft 365 support</li>
                            <li>✓ Hardware diagnostics & repair</li>
                            <li>✓ Software installation & configuration</li>
                            <li>✓ Remote & on-site support available</li>
                        </ul>
                    </div>

                    {/* AI-Enhanced Productivity */}
                    <div className="glass glass-hover rounded-2xl p-8">
                        <div className="text-5xl mb-4">⚡</div>
                        <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--secondary-color)' }}>
                            AI-Enhanced Productivity
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-4">
                            Leverage modern AI tools to streamline your business workflows and save time.
                        </p>
                        <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
                            <li>✓ AI tool integration & training</li>
                            <li>✓ Workflow automation consulting</li>
                            <li>✓ Custom AI solution recommendations</li>
                            <li>✓ Team training on AI productivity tools</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <div className="glass rounded-3xl p-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
                        Whether you need local tech support or professional digital services,
                        we're here to help you succeed.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="inline-block px-8 py-4 text-lg font-semibold uppercase tracking-wider transition-all duration-300 rounded-lg"
                            style={{
                                background: 'var(--accent-color)',
                                color: '#000',
                            }}
                        >
                            Contact Us
                        </a>
                        <a
                            href="https://wa.me/2348000000000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-8 py-4 text-lg font-semibold uppercase tracking-wider transition-all duration-300 rounded-lg"
                            style={{
                                background: 'rgba(0, 255, 136, 0.1)',
                                border: '1px solid var(--accent-color)',
                                color: 'var(--accent-color)',
                            }}
                        >
                            WhatsApp Us
                        </a>
                    </div>
                </div>
            </section>

            {/* Location Info */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                <p className="text-[var(--text-secondary)]">
                    📍 Visit us at: No 4, Kolawole Close, Ibadan, Nigeria
                </p>
            </section>
        </div>
    );
}
