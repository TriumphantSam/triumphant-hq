import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import AntigravityBackground from "@/components/AntigravityBackground";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Triumphant HQ | Essential Tech & Digital Growth",
  description: "From local NIMC registrations to global AI data strategies. We bridge the gap between essential tech services and digital growth solutions.",
  keywords: ["Triumphant HQ", "Tech Support Ibadan", "NIMC Registration", "AI Consulting", "Web Development", "SEO Services", "Digital Growth"],
  authors: [{ name: "Triumphant HQ Team" }],
  openGraph: {
    title: "Triumphant HQ | Essential Tech & Digital Growth",
    description: "Bridging the gap between essential tech services and digital growth solutions.",
    url: "https://triumphanthq.com",
    siteName: "Triumphant HQ",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Triumphant HQ | Essential Tech & Digital Growth",
    description: "Bridging the gap between essential tech services and digital growth solutions.",
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
        <main className="flex-grow w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
