'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { agencyServices, discoveryCallUrl, whatsappNumber } from '@/lib/services';

const columns = [
  {
    title: 'Agency Services',
    links: agencyServices.map((service) => ({
      label: service.shortTitle,
      href: `/services/${service.slug}`,
    })),
  },
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
    <footer className="relative z-20 border-t border-slate-200 bg-[#f7f8fb]">
      <div className="mx-auto max-w-[1240px] px-5 pt-16 pb-10 lg:px-8 lg:pt-20 lg:pb-12">
        <div className="grid gap-12 border-b border-slate-200/90 pb-14 lg:grid-cols-[1.15fr_1.85fr] lg:gap-16">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600">
                <span className="font-display text-lg font-bold text-white">T</span>
              </div>
              <span className="font-display text-xl font-bold tracking-[-0.03em] text-slate-950">
                Triumphant<span className="text-blue-600">HQ</span>
              </span>
            </Link>

            <p className="mt-7 max-w-sm text-[1.02rem] leading-8 text-slate-600">
              A technology and growth agency designing websites, custom software, SEO systems and practical automation
              for ambitious businesses.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={discoveryCallUrl} target="_blank" rel="noreferrer" className="button button-primary">
                Book a call
              </a>
              <Link href="/contact" className="button button-secondary">
                Project enquiry
              </Link>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-blue-600">{column.title}</h3>
                <ul className="mt-5 flex flex-col gap-3.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.95rem] font-medium text-slate-600 transition-colors hover:text-slate-950"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Triumphant Technological Services. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2.5">
            <a href="mailto:admin@triumphantech.com" className="transition-colors hover:text-slate-950">
              admin@triumphantech.com
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-slate-950"
            >
              WhatsApp
            </a>
            <Link href="/privacy-policy" className="transition-colors hover:text-slate-950">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-slate-950">
              Terms
            </Link>
            <Link href="/refund-policy" className="transition-colors hover:text-slate-950">
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
