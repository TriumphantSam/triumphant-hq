'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { agencyServices, discoveryCallUrl, whatsappNumber } from '@/lib/services';

const columns = [
    {
        title: 'Resources',
        links: [
            { label: 'Resources Hub', href: '/resources' },
            { label: 'Digital Forge', href: '/digital-forge' },
            { label: 'Products', href: '/digital-forge/products' },
            { label: 'Free Training', href: '/digital-forge/training' },
            { label: 'Insights', href: '/blog' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About', href: '/about' },
            { label: 'Work With Us', href: '/contact' },
            { label: 'Free SEO Audit', href: '/seo-snapshot' },
            { label: 'Local Support', href: '/local-support' },
        ],
    },
];

export default function Footer() {
    const pathname = usePathname();

    if (pathname.startsWith('/digital-forge/funnel/') || pathname.startsWith('/parent-home-routine')) {
        return null;
    }

    return (
        <footer className="relative z-20 overflow-hidden border-t border-slate-200 bg-slate-950 text-white">
            <div className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-20">
                <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600">
                                <span className="text-xl font-black text-white">T</span>
                            </div>
                            <span className="text-xl font-black tracking-[0.1em] uppercase">
                                TRIUMPHANT<span className="text-blue-400">HQ</span>
                            </span>
                        </Link>
                        <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
                            A technology and growth agency designing websites, custom software, SEO systems and practical automation for ambitious businesses.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <a href={discoveryCallUrl} target="_blank" rel="noreferrer" className="button button-primary !min-h-11 !text-[0.7rem]">Book a call</a>
                            <Link href="/contact" className="button !min-h-11 !border-white/15 !bg-white/5 !text-[0.7rem] !text-white hover:!bg-white/10">Project enquiry</Link>
                        </div>
                    </div>

                    <div className="lg:col-span-3 lg:col-start-6">
                        <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-400">Agency Services</h3>
                        <div className="mt-6 flex flex-col gap-4">
                            {agencyServices.map((service) => (
                                <Link key={service.slug} href={`/services/${service.slug}`} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                                    {service.shortTitle}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {columns.map((column) => (
                        <div className="lg:col-span-2" key={column.title}>
                            <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-400">{column.title}</h3>
                            <div className="mt-6 flex flex-col gap-4">
                                {column.links.map((link) => (
                                    <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-6 pt-8 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
                    <p>© {new Date().getFullYear()} Triumphant Technological Services. All rights reserved.</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-3">
                        <a href="mailto:admin@triumphantech.com" className="hover:text-white">admin@triumphantech.com</a>
                        <a href={`https://wa.me/${whatsappNumber}`} className="hover:text-white">WhatsApp</a>
                        <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
                        <Link href="/terms" className="hover:text-white">Terms</Link>
                        <Link href="/refund-policy" className="hover:text-white">Refunds</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
