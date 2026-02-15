// File: iap-nextjs/app/contact/page.jsx
// NO 'use client'; at the top. This is the Server Component.

import React from 'react';
import ContactPageContent from '../../components/Contact/ContactPageContent'; // We will create this next

// --- SEO Metadata for the Contact Page ---
export const metadata = {
  title: 'Contact IA Precision | Agricultural Drone Experts in Nigeria',
  description: 'Get in touch with Integrated Aerial Precision for drone services, product inquiries, or consultations. Visit our office or contact us via phone or email.',
  keywords: 'contact IA Precision, drone services Nigeria, IAPrecision address, agricultural drone company contact, agritech support',
  openGraph: {
    title: 'Contact Integrated Aerial Precision',
    description: 'Reach out to our team to learn how our drone technology can transform your agricultural operations.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
    siteName: 'IA Precision',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/assets/og-image-home.png`, // Your default OG image
        width: 1200,
        height: 630,
        alt: 'Contact Integrated Aerial Precision in Nigeria',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact IA Precision | Drone & Agritech Solutions',
    description: 'Have a question? Get in touch with the IA Precision team today.',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/assets/og-image-home.png`], 
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
  },
};

// This Server Component simply renders the Client Component that holds the page content.
export default function ContactPage() {
  return <ContactPageContent />;
}