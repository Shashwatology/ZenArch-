import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIConsultant } from "@/components/ai/AIConsultant";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zen Arch Interior Solution — Luxury Architecture & Bespoke Furniture Atelier",
  description:
    "Spaces designed around the way you live. Zen Arch combines contemporary architectural design, bespoke handcrafted furniture collections, and intelligent digital spatial exploration. Founded by Rohit Pathak.",
  keywords: [
    "Zen Arch",
    "Rohit Pathak",
    "Interior Architecture Mumbai",
    "Luxury Furniture India",
    "Custom Sofas",
    "Puffy Collection",
    "Architectural Interior Studio",
    "High-End Interior Design",
  ],
  openGraph: {
    title: "Zen Arch Interior Solution — Architectural Studio & Furniture Atelier",
    description: "Spaces designed around the way you live. Bespoke interiors and handcrafted furniture.",
    type: "website",
    locale: "en_IN",
  },
};

import { AnalyticsProvider } from "@/components/AnalyticsProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-zen-accent selection:text-white">
        <AnalyticsProvider />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <AIConsultant />
      </body>
    </html>
  );
}
