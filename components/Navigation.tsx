import Link from 'next/link';

export default function Navigation() {
    return (
        <nav className="sticky top-0 z-50 glass backdrop-blur-md border-b border-[var(--glass-border)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl font-bold tracking-wider" style={{ color: 'var(--accent-color)' }}>
                            TRIUMPHANT HQ
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8">
                        <Link
                            href="/"
                            className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors duration-300"
                        >
                            Home
                        </Link>
                        <Link
                            href="/services"
                            className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors duration-300"
                        >
                            Services
                        </Link>
                        <Link
                            href="/blog"
                            className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors duration-300"
                        >
                            Tech Diary
                        </Link>
                        <Link
                            href="/about"
                            className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors duration-300"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors duration-300"
                        >
                            Contact
                        </Link>
                    </div>

                    {/* Mobile Menu Button (placeholder for now) */}
                    <div className="md:hidden">
                        <button className="text-[var(--text-primary)] hover:text-[var(--accent-color)]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
