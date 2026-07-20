import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import AntigravityBackground from "@/components/AntigravityBackground";
import Footer from "@/components/Footer";
import PageReader from "@/components/PageReader";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { PostHogProvider } from "./providers";
import Script from "next/script";

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
  metadataBase: new URL("https://triumphantech.com"),
  title: "Triumphant HQ | Technology and Growth Agency",
  description:
    "Triumphant HQ designs high-performing websites, custom applications, SEO growth systems and practical business automation.",
  keywords: [
    "Technology Agency",
    "Web Design Agency",
    "Custom Application Development",
    "SEO Agency",
    "AI Automation",
    "Triumphant HQ",
    "Web Development",
    "Digital Growth",
  ],
  authors: [{ name: "Triumphant HQ Team" }],
  openGraph: {
    title: "Triumphant HQ | Technology and Growth Agency",
    description:
      "Websites, custom applications, SEO and automation connected around ambitious business outcomes.",
    url: "https://triumphantech.com",
    siteName: "Triumphant HQ",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Triumphant HQ | Technology and Growth Agency",
    description:
      "Websites, custom applications, SEO and automation connected around ambitious business outcomes.",
  },
};

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
      <body className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable} antialiased`}>
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
