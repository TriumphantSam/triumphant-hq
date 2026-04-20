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
  title: "Triumphant HQ | Best Tech Company in Nigeria & AI Solutions",
  description: "As the best tech company in Nigeria, we build autonomous AI systems, advanced digital product ecosystems, and high-conversion funnels for global and local growth.",
  keywords: ["Best Tech Company in Nigeria", "Top Tech Companies in Nigeria", "Best Tech Company in Ibadan", "Triumphant HQ", "AI Consulting Nigeria", "Web Development", "SEO Services Nigeria", "Digital Growth"],
  authors: [{ name: "Triumphant HQ Team" }],
  openGraph: {
    title: "Triumphant HQ | Best Tech Company in Nigeria",
    description: "The premier tech and AI solutions company in Nigeria. Bridging the gap between essential tech services and digital growth.",
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
    title: "Triumphant HQ | Best Tech Company in Nigeria & AI Solutions",
    description: "The premier tech and AI solutions company in Nigeria. Bridging the gap between essential tech services and digital growth.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
      </body>
    </html>
  );
}
