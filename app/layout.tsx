import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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
  title: "Zen Arc Interior Solution — Luxury Architecture & Bespoke Furniture Atelier",
  description:
    "Spaces designed around the way you live. Zen Arc combines contemporary architectural design, bespoke handcrafted furniture collections, and intelligent digital spatial exploration. Founded by Rohit Pathak.",
  keywords: [
    "Zen Arc",
    "Rohit Pathak",
    "Interior Architecture Mumbai",
    "Luxury Furniture India",
    "Custom Sofas",
    "Puffy Collection",
    "Architectural Interior Studio",
    "High-End Interior Design",
  ],
  openGraph: {
    title: "Zen Arc Interior Solution — Architectural Studio & Furniture Atelier",
    description: "Spaces designed around the way you live. Bespoke interiors and handcrafted furniture.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-zen-accent selection:text-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
