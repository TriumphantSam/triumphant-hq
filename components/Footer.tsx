'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { agencyServices, discoveryCallUrl, whatsappNumber } from '@/lib/services';
import { formattedNapAddress, siteIdentity } from '@/lib/seo';

const columns = [
  {
    title: 'Agency Services',
    links: agencyServices.map((service) => ({
      label: service.shortTitle,
      href: `/services/${service.slug}`,
    })).concat([{ label: 'Ongoing Support', href: '/ongoing-support' }]),
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
      { label: 'Work', href: '/work' },
      { label: 'Locations', href: '/locations' },
      { label: 'Industries', href: '/industries' },
      { label: 'Compare', href: '/compare' },
      { label: 'Work With Us', href: '/contact' },
      { label: 'Free SEO Audit', href: '/seo-snapshot' },
      { label: 'Website Scorecard', href: '/website-scorecard' },
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
    <footer className="site-footer relative z-20 border-t border-slate-200 bg-[#f7f8fb]">
      <div className="site-footer-inner mx-auto max-w-[1240px] px-5 lg:px-8">
        <div className="grid gap-12 border-b border-slate-200/90 pt-16 pb-14 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16 lg:pt-20 lg:pb-14">
          {/* Brand / NAP / CTAs — single left edge, even vertical rhythm */}
          <div className="site-footer-brand flex w-full max-w-[22rem] flex-col items-start gap-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600">
                <span className="font-display text-lg font-bold text-white">T</span>
              </div>
              <span className="font-display text-xl font-bold tracking-[-0.03em] text-slate-950">
                Triumphant<span className="text-blue-600">HQ</span>
              </span>
            </Link>

            <p className="w-full text-[0.98rem] leading-7 text-slate-600">
              Websites, software, SEO and automation for ambitious businesses—based in Ibadan, serving Oyo, Osun and
              Nigeria.
            </p>

            <address className="site-footer-nap flex w-full flex-col gap-1 not-italic text-[0.92rem] leading-6 text-slate-600">
              <p className="font-semibold text-slate-950">{siteIdentity.legalName}</p>
              <p>{formattedNapAddress}</p>
              <p className="pt-2">
                <a href={`mailto:${siteIdentity.email}`} className="transition-colors hover:text-slate-950">
                  {siteIdentity.email}
                </a>
              </p>
              <p>
                <a href={`tel:${siteIdentity.phoneE164}`} className="transition-colors hover:text-slate-950">
                  {siteIdentity.phoneDisplay}
                </a>
                <span className="text-slate-400"> · </span>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-slate-950"
                >
                  WhatsApp
                </a>
              </p>
              <p className="pt-2">
                <Link href="/locations" className="font-medium text-blue-600 transition-colors hover:text-blue-800">
                  Service areas →
                </Link>
              </p>
            </address>

            <div className="site-footer-ctas flex w-full flex-wrap items-start gap-3">
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

        <div className="site-footer-bar flex flex-col gap-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Triumphant Technological Services. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2.5">
            <a href={`mailto:${siteIdentity.email}`} className="transition-colors hover:text-slate-950">
              {siteIdentity.email}
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
