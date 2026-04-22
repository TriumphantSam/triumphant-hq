import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import AntigravityBackground from "@/components/AntigravityBackground";
import Footer from "@/components/Footer";
import PageReader from "@/components/PageReader";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://triumphantech.com'),
  title: "Triumphant HQ | Premier Tech & SEO Company",
  description: "As a premier tech and SEO company, we build autonomous AI systems, advanced digital product ecosystems, and elite search engine optimization (SEO) strategies for global growth.",
  keywords: ["Best Tech Company", "Best SEO Company", "Global SEO Agency", "Top SEO Expert", "Premier Tech Company", "Triumphant HQ", "AI Consulting", "Web Development", "SEO Services", "Digital Growth"],
  authors: [{ name: "Triumphant HQ Team" }],
  openGraph: {
    title: "Triumphant HQ | Premier Tech & SEO Company",
    description: "The premier tech and SEO solutions company. Bridging the gap between essential tech services, search engine visibility, and global digital growth.",
    url: "https://triumphantech.com",
    siteName: "Triumphant HQ",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: '/',
  },
  twitter: {
    card: "summary_large_image",
    title: "Triumphant HQ | Premier Tech & SEO Company",
    description: "The premier tech and SEO solutions company. Bridging the gap between essential tech services, search engine visibility, and global digital growth.",
  },
};

import { PostHogProvider } from "./providers";
import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '951975760918976');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }} src="https://www.facebook.com/tr?id=951975760918976&ev=PageView&noscript=1" />
        </noscript>
        <PostHogProvider>
          <AntigravityBackground />
          <Navigation />
          <main
            id="site-main-content"
            className="flex-grow w-full"
            data-page-reader-root
          >
            {children}
          </main>
          <Footer />
          <PageReader />
          <WhatsAppWidget />
        </PostHogProvider>
      </body>
    </html>
  );
}
