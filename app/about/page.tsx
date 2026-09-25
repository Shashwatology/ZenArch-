"use client";

import React from "react";
import Link from "next/link";
import { BRAND, getWhatsAppUrl } from "@/lib/config/brand";
import { Button } from "@/components/ui/Button";
import { ArrowRight, MessageSquare, Compass, ShieldCheck, Hammer, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zen-ivory text-zen-black pt-32 pb-24 px-6 md:px-12 selection:bg-zen-accent selection:text-white">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Header */}
        <div className="space-y-6 max-w-3xl border-b border-zen-border pb-10">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-zen-accent" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono">
              The Atelier &bull; Rohit Pathak
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight uppercase">
            About Zen Arch.
          </h1>
          <p className="text-base md:text-lg text-zen-charcoal/80 font-light leading-relaxed">
            Founded with a singular conviction: that architecture and furniture should never exist in isolation, but in continuous, sympathetic dialogue.
          </p>
        </div>

        {/* Founder & Creative Director Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 bg-zen-black text-zen-ivory p-8 md:p-12 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block">
              Leadership
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-normal">
              {BRAND.founder}
            </h2>
            <span className="text-xs font-mono uppercase tracking-widest text-zen-sand block">
              {BRAND.title}
            </span>
            <p className="text-xs md:text-sm text-zen-sand/80 font-light leading-relaxed">
              Rohit Pathak directs all spatial concepts, bespoke furniture geometry, and architectural commissions at Zen Arch Interior Solution. His work balances contemporary structural minimalism with deep tactile warmth.
            </p>
            <div className="pt-4 border-t border-zen-charcoal space-y-2 text-xs text-zen-sand font-mono">
              <div>STUDIO: Mumbai, Maharashtra</div>
              <div>EMAIL: {BRAND.email}</div>
              <div>PHONE: {BRAND.phoneDisplay}</div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 text-sm md:text-base font-light text-zen-charcoal/90 leading-relaxed">
            <h3 className="font-serif text-2xl md:text-3xl font-normal text-zen-black">
              The Architecture of Living
            </h3>
            <p>
              Zen Arch was established to redefine how high-end residences and commercial flagships are conceived in India. Rather than sourcing generic catalog furniture to fill an already built room, we design the furniture and the architectural shell simultaneously.
            </p>
            <p>
              Our Mumbai workshop employs master carpenters, metal fabricators, and upholstery artisans who construct every piece from kiln-dried hardwoods, structural steel, and curated fabrics specified at standard rates of ₹500/meter or imported designer textiles.
            </p>
            <p>
              Whether crafting a sweeping 10-foot sectional or developing a full architectural floorplan, we believe in radical material honesty, precise detailing, and spaces that feel calm the moment you cross their threshold.
            </p>
          </div>
        </div>

        {/* Four Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-zen-border">
          <div className="space-y-3">
            <span className="font-mono text-xs text-zen-accent">01 / PROPORTION</span>
            <h4 className="font-serif text-xl">Architectural Whitespace</h4>
            <p className="text-xs text-zen-taupe font-light leading-relaxed">
              We design with restrained volume and generous breathing room. Every element earns its place.
            </p>
          </div>
          <div className="space-y-3">
            <span className="font-mono text-xs text-zen-accent">02 / TACTILITY</span>
            <h4 className="font-serif text-xl">Material Authenticity</h4>
            <p className="text-xs text-zen-taupe font-light leading-relaxed">
              Travertine, solid oak, brushed brass, and bouclé fabrics selected for enduring sensory beauty.
            </p>
          </div>
          <div className="space-y-3">
            <span className="font-mono text-xs text-zen-accent">03 / ATELIER CRAFT</span>
            <h4 className="font-serif text-xl">In-House Fabrication</h4>
            <p className="text-xs text-zen-taupe font-light leading-relaxed">
              Our 38+ sofa silhouettes and 28+ Puffy accent designs are constructed locally in Mumbai.
            </p>
          </div>
          <div className="space-y-3">
            <span className="font-mono text-xs text-zen-accent">04 / INTEGRITY</span>
            <h4 className="font-serif text-xl">End-to-End Oversight</h4>
            <p className="text-xs text-zen-taupe font-light leading-relaxed">
              Rohit Pathak and our architectural team provide transparent BOQs and white-glove site delivery.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="border border-zen-border bg-zen-stone/40 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-serif text-2xl md:text-3xl font-normal">
              Meet Rohit Pathak for a Spatial Consultation
            </h3>
            <p className="text-xs md:text-sm text-zen-taupe leading-relaxed font-light">
              Visit our Mumbai studio coordinates or initiate a direct inquiry on WhatsApp.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              href={getWhatsAppUrl()}
              isExternal
              variant="whatsapp"
              size="md"
              icon={<MessageSquare size={16} />}
            >
              WhatsApp Rohit Pathak
            </Button>
            <Button href="/consultation" variant="primary" size="md">
              Start Project Brief
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
