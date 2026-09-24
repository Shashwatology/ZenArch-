import React from "react";
import Link from "next/link";
import { BRAND, getWhatsAppUrl } from "@/lib/config/brand";
import { MessageSquare, ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zen-black text-zen-ivory pt-24 pb-12 border-t border-zen-charcoal selection:bg-zen-accent selection:text-white relative overflow-hidden">
      {/* Subtle architectural grain */}
      <div className="absolute inset-0 bg-dark-grain opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Top Editorial Banner */}
        <div className="border-b border-zen-charcoal/80 pb-16 mb-16 flex flex-col lg:flex-row justify-between lg:items-end gap-8">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent block mb-3 font-mono">
              The Flagship Atelier
            </span>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-wide mb-6">
              Spaces designed around the way you live.
            </h2>
            <p className="text-zen-sand/80 text-sm md:text-base font-light leading-relaxed max-w-xl">
              Harmonizing contemporary architecture, handcrafted furniture, and intelligent spatial design. Directed by Rohit Pathak.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/consultation"
              className="px-8 py-4 bg-zen-ivory text-zen-black uppercase tracking-[0.2em] text-xs font-medium hover:bg-zen-accent hover:text-white transition-all duration-300 text-center"
            >
              Start Consultation
            </Link>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#25D366] text-white uppercase tracking-[0.2em] text-xs font-medium hover:bg-[#1EBE5D] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} />
              <span>WhatsApp Rohit Pathak</span>
            </a>
          </div>
        </div>

        {/* 4-Column Navigation & Atelier Coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-zen-charcoal/80">
          {/* Col 1: Furniture Catalogue */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.25em] text-zen-sand font-medium mb-6">
              Furniture Collections
            </h3>
            <ul className="space-y-3 text-sm text-zen-muted">
              <li>
                <Link href="/furniture?category=sofas" className="hover:text-zen-ivory transition-colors flex items-center justify-between group">
                  <span>Sofas &amp; Lounges</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/furniture?category=puffy-collection" className="hover:text-zen-ivory transition-colors flex items-center justify-between group">
                  <span>Puffy Collection</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/furniture?category=benches" className="hover:text-zen-ivory transition-colors flex items-center justify-between group">
                  <span>Sculptural Benches</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/furniture?category=executive" className="hover:text-zen-ivory transition-colors flex items-center justify-between group">
                  <span>Executive Collection</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/furniture?category=table-stand" className="hover:text-zen-ivory transition-colors flex items-center justify-between group">
                  <span>Table &amp; Stand Collection</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/furniture?category=prince" className="hover:text-zen-ivory transition-colors flex items-center justify-between group">
                  <span>Prince Collection</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/furniture" className="hover:text-zen-ivory transition-colors flex items-center justify-between group">
                  <span>All Verified Catalogues</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Studio & Architectural Services */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.25em] text-zen-sand font-medium mb-6">
              Studio &amp; Architecture
            </h3>
            <ul className="space-y-3 text-sm text-zen-muted">
              <li>
                <Link href="/services" className="hover:text-zen-ivory transition-colors">
                  Architectural Interiors
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-zen-ivory transition-colors">
                  Custom Furniture Atelier
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-zen-ivory transition-colors">
                  Selected Portfolio Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-zen-ivory transition-colors">
                  Philosophy &amp; Rohit Pathak
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Digital & AI Experience */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.25em] text-zen-sand font-medium mb-6">
              Digital Experience
            </h3>
            <ul className="space-y-3 text-sm text-zen-muted">
              <li>
                <Link href="/ai" className="hover:text-zen-ivory transition-colors flex items-center gap-2">
                  <span>Zen Arc AI Consultant</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-zen-accent/80 text-white rounded uppercase font-sans">
                    Live
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/ai/transform-space" className="hover:text-zen-ivory transition-colors">
                  Transform Your Space
                </Link>
              </li>
              <li>
                <Link href="/consultation" className="hover:text-zen-ivory transition-colors">
                  Guided 8-Step Consultation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-zen-ivory transition-colors">
                  Direct Atelier Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Atelier Coordinates */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.25em] text-zen-sand font-medium mb-6">
              Studio Coordinates
            </h3>
            <div className="space-y-3 text-sm text-zen-muted">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-zen-accent shrink-0 mt-1" />
                <span className="leading-snug text-xs">
                  {BRAND.address.line1}, {BRAND.address.line2}, {BRAND.address.locality}, {BRAND.address.city}, {BRAND.address.state} {BRAND.address.postalCode}, {BRAND.address.country}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-zen-accent shrink-0" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-zen-ivory transition-colors break-all">
                  {BRAND.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-zen-accent shrink-0" />
                <a href={`tel:${BRAND.phone}`} className="hover:text-zen-ivory transition-colors">
                  {BRAND.phoneDisplay}
                </a>
              </div>
              <div className="pt-2 border-t border-zen-charcoal/40">
                <span className="text-[10px] uppercase tracking-wider text-zen-sand/60 block">Creative Direction</span>
                <span className="text-sm text-zen-ivory font-medium">{BRAND.founder}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Official Disclaimers */}
        <div className="py-8 border-b border-zen-charcoal/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zen-muted/80 leading-relaxed font-light">
          <p>
            <strong className="text-zen-sand font-normal">Pricing Notice:</strong> {BRAND.disclaimers.pricingTerms}
          </p>
          <p>
            <strong className="text-zen-sand font-normal">Upholstery Terms:</strong> {BRAND.disclaimers.fabricNote}
          </p>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zen-muted">
          <p>
            &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span>Mumbai &bull; Pan-India Atelier</span>
            <span className="text-zen-charcoal">|</span>
            <span className="text-zen-sand/60">Architectural Interior Studio &amp; Bespoke Atelier</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
