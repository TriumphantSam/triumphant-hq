// File: iap-nextjs/app/about/page.js


import React from 'react';
import AboutPageContent from '../../components/About/AboutPageContent'; // New client component

export const metadata = {
  title: 'About IA Precision | Agricultural Drone Technology Experts in Nigeria',
  description: 'Learn about Integrated Aerial Precision (IAP), our mission to revolutionize Nigerian agriculture with smart farming, drone services, and precision technology.',
  keywords: 'about IA Precision, agricultural drone company Nigeria, smart farming Nigeria, IAP team, precision agriculture mission, agritech Nigeria',
  openGraph: {
    title: 'About Integrated Aerial Precision - Leading Agritech in Nigeria',
    description: 'Discover our vision and expertise in transforming agriculture across Nigeria with advanced drone solutions and precision farming techniques.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.iaprecision.com'}/about`,
    siteName: 'IA Precision',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.iaprecision.com'}/assets/og-image-home.png`, // Your default OG image
        width: 1200,
        height: 630,
        alt: 'Integrated Aerial Precision Team and Drone Technology',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About IA Precision | Drone Tech for Nigerian Agriculture',
    description: 'Meet the team behind IA Precision and learn about our commitment to advancing smart farming in Nigeria.',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.iaprecision.com'}/assets/og-image-home.png`], 
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.iaprecision.com'}/about`,
  },
};

export default function AboutPageServer() { // Renamed to avoid conflict
  return <AboutPageContent />;
}