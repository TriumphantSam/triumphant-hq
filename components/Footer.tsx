import Link from 'next/link';

const footerLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Tech Diary', href: '/tech-diary' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
];

const services = [
    { label: 'NIMC Registration', href: '/services' },
    { label: 'SEO & Web', href: '/services' },
    { label: 'AI Data Consulting', href: '/services' },
    { label: 'Technical Support', href: '/services' },
];

export default function Footer() {
    return (
        <footer className="bg-[#020205] border-t border-[#0066FF]/20 relative overflow-hidden">
            {/* Hex Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0' stroke='%230066FF' stroke-width='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px'
                }}
            />

            <div className="container mx-auto px-6 py-16 relative z-10">
                {/* Main grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand column */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-[#0066FF] flex items-center justify-center rounded-sm">
                                <span className="text-white font-bold text-lg">T</span>
                            </div>
                            <span className="text-xl font-bold tracking-wider text-white uppercase">
                                TRIUMPHANT<span className="text-[#0066FF]">HQ</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
                            Bridging essential local tech services with cutting-edge digital solutions since 2017.
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            📍 No 4, Kolawole Close, Ibadan
                        </p>
                    </div>

                    {/* Navigation column */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-b border-[#0066FF]/30 pb-2 inline-block">
                            Quick Links
                        </h4>
                        <div className="flex flex-col gap-3">
                            {footerLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-gray-400 hover:text-[#00CCFF] transition-colors flex items-center gap-2"
                                >
                                    <span className="w-1 h-1 bg-[#0066FF] rounded-full" />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Services column */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-b border-[#0066FF]/30 pb-2 inline-block">
                            Services
                        </h4>
                        <div className="flex flex-col gap-3">
                            {services.map((s, i) => (
                                <Link
                                    key={i}
                                    href={s.href}
                                    className="text-sm text-gray-400 hover:text-[#00CCFF] transition-colors flex items-center gap-2"
                                >
                                    <span className="w-1 h-1 bg-[#0066FF] rounded-full" />
                                    {s.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact column */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-b border-[#0066FF]/30 pb-2 inline-block">
                            Get in Touch
                        </h4>
                        <div className="flex flex-col gap-4">
                            <a
                                href="mailto:admin@triumphantech.com"
                                className="text-sm text-gray-400 hover:text-[#00CCFF] transition-colors flex items-center gap-2"
                            >
                                📧 admin@triumphantech.com
                            </a>
                            <a
                                href="https://wa.me/2348107711190"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-400 hover:text-[#00CCFF] transition-colors flex items-center gap-2"
                            >
                                📱 +234 810 771 1190
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-[#0066FF]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-600">
                        © {new Date().getFullYear()} Triumphant Technological Services. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-600">
                        Built with ⚡ in Ibadan, Nigeria
                    </p>
                </div>
            </div>
        </footer>
    );
}
