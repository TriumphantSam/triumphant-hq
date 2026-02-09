export default function Footer() {
    return (
        <footer className="glass border-t border-[var(--glass-border)] mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--accent-color)' }}>
                            TRIUMPHANT HQ
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-2">
                            Bridging Essential Tech with Digital Growth
                        </p>
                        <p className="text-[var(--text-secondary)] text-sm">
                            No 4, Kolawole Close, Ibadan, Nigeria
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/services" className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">
                                    Services
                                </a>
                            </li>
                            <li>
                                <a href="/blog" className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">
                                    Tech Diary
                                </a>
                            </li>
                            <li>
                                <a href="/about" className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                            Get in Touch
                        </h4>
                        <ul className="space-y-2 text-[var(--text-secondary)]">
                            <li>
                                <a href="mailto:info@triumphanthq.com" className="hover:text-[var(--accent-color)] transition-colors">
                                    info@triumphanthq.com
                                </a>
                            </li>
                            <li>
                                <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent-color)] transition-colors">
                                    WhatsApp: +234 800 000 0000
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-[var(--glass-border)] text-center text-[var(--text-secondary)] text-sm">
                    <p>&copy; {new Date().getFullYear()} Triumphant Technological Services. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
