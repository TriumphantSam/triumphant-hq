import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import AntigravityBackground from "@/components/AntigravityBackground";
import Footer from "@/components/Footer";
import PageReader from "@/components/PageReader";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import JsonLd from "@/components/seo/JsonLd";
import { PostHogProvider } from "./providers";
import Script from "next/script";
import {
  defaultKeywords,
  localBusinessJsonLd,
  organizationJsonLd,
  SITE_URL,
  siteIdentity,
  websiteJsonLd,
} from "@/lib/seo";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Triumphant HQ | Technology Agency in Ibadan, Nigeria",
    template: "%s | Triumphant HQ",
  },
  description:
    "Ibadan-based technology and growth agency for website design, SEO, custom applications and automation—plus certified NIN and BVN support across Oyo State and Nigeria.",
  keywords: defaultKeywords,
  authors: [{ name: siteIdentity.brandName }],
  creator: siteIdentity.brandName,
  publisher: siteIdentity.legalName,
  openGraph: {
    title: "Triumphant HQ | Technology Agency in Ibadan, Nigeria",
    description:
      "Websites, SEO, apps and automation from Ibadan—serving Oyo State, Osun State and clients across Nigeria.",
    url: SITE_URL,
    siteName: siteIdentity.brandName,
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "/images/agency-hero-cinematic.png",
        width: 1920,
        height: 1080,
        alt: "Triumphant HQ — technology and growth agency in Ibadan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Triumphant HQ | Technology Agency in Ibadan, Nigeria",
    description:
      "Websites, SEO, apps and automation from Ibadan—plus local NIN and BVN support.",
    images: ["/images/agency-hero-cinematic.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "technology",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#075ee5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NG">
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
      <body className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable} antialiased`}>
        <JsonLd data={[organizationJsonLd(), localBusinessJsonLd(), websiteJsonLd()]} />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://www.facebook.com/tr?id=951975760918976&ev=PageView&noscript=1"
          />
        </noscript>
        <PostHogProvider>
          <AntigravityBackground />
          <Navigation />
          <main id="site-main-content" className="flex-grow w-full" data-page-reader-root>
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
