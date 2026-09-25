"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { BRAND, getWhatsAppUrl, getProductWhatsAppUrl } from "@/lib/config/brand";
import { Button } from "@/components/ui/Button";
import { Reveal, MaskReveal, Parallax, ScrollTransform, ImageReveal, TextReveal } from "@/components/ui/MotionPrimitives";
import type { MaterialPreset, ModelType } from "@/components/3d/HeroSpatialScene";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  RotateCw,
  MessageSquare,
  MapPin,
  Phone,
  Mail,
  Box
} from "lucide-react";

// SSR-safe dynamic imports for 3D components
const SpatialCanvas = dynamic(
  () => import("@/components/3d/SpatialCanvas").then((mod) => mod.SpatialCanvas),
  { ssr: false }
);

const HeroSpatialScene = dynamic(
  () => import("@/components/3d/HeroSpatialScene").then((mod) => mod.HeroSpatialScene),
  { ssr: false }
);

const FEATURED_PRODUCTS = [
  {
    slug: "vegas",
    name: "Vegas Sofa",
    category: "sofas",
    categoryLabel: "Sofas & Lounges",
    edition: "2026 Master Catalogue",
    tagline: "Timeless design. Unmatched comfort.",
    description: "Rounded enveloping arms, brushed champagne brass column accents, and 40-density ultra-flex cushioning.",
    basePrice: 56000,
    priceNote: "From ₹56,000 + GST",
    fabricRate: "Fabric: 500/- Mtr",
    dimensions: "Single: 3.50 ft | Two: 5.25 ft | Three: 7.25 ft",
    has3d: true,
    image: "/images/vegas.jpg",
  },
  {
    slug: "flame",
    name: "Flame Sofa",
    category: "sofas",
    categoryLabel: "Sofas & Lounges",
    edition: "2026 Master Catalogue",
    tagline: "Horizontal channel quilting on architectural brass columns.",
    description: "Deep-seated lounge proportions supported by dual architectural brushed champagne column legs.",
    basePrice: 48500,
    priceNote: "From ₹48,500 + GST",
    fabricRate: "Fabric: 500/- Mtr",
    dimensions: "Single: 3.50 ft | Two: 5.25 ft | Three: 7.00 ft",
    has3d: true,
    image: "/images/flame.jpg",
  },
  {
    slug: "arcus",
    name: "Arcus Curved Sofa",
    category: "sofas",
    categoryLabel: "Sofas & Lounges",
    edition: "2026 Master Catalogue",
    tagline: "Organic fluid curvature designed for grand reception salons.",
    description: "Sculptural serpentine silhouette with continuous lumbar contour and brushed champagne base trim.",
    basePrice: 33500,
    priceNote: "From ₹33,500 + GST",
    fabricRate: "Fabric: 500/- Mtr",
    dimensions: "Customizable 6.50 ft to 10.00 ft modular arc",
    has3d: true,
    image: "/images/arcus.jpg",
  },
  {
    slug: "gold",
    name: "Gold Ottoman",
    category: "puffy-collection",
    categoryLabel: "Puffy Collection",
    edition: "PUFFY W.E.F. 2026",
    tagline: "Minimal cylindrical form with luminous brass plinth ring.",
    description: "Cream textured bouclé cylindrical pouf grounded upon a heavy brushed champagne brass plinth ring.",
    basePrice: 6250,
    priceNote: "₹6,250 + GST",
    fabricRate: "Fabric Included",
    dimensions: "Dia 16\" x H 18\"",
    has3d: true,
    image: "/images/gold.jpg",
  },
];

const CLIENT_TESTIMONIALS = [
  {
    client: "Pradip Mahadan",
    project: "Full Interior Manufacturing",
    location: "Google Review",
    quote: "I recently worked with ZEN ARCHH INTERIOR SOLUTION for a full interior manufacturing project, and the experience was excellent from start to finish. The craftsmanship was top-notch and materials used were of high quality.",
  },
  {
    client: "Shashwat Upadhyay",
    project: "Bespoke Sofa",
    location: "Google Review",
    quote: "The sofa is very comfortable and cozy, the service was very good, the quality and material of sofa is good after sales-service is very good , and i got the best price the price was very reasonable and worthy.",
  },
];

export default function Home() {
  const [activeMaterial, setActiveMaterial] = useState<MaterialPreset>("emerald-velvet");
  const [activeModel, setActiveModel] = useState<ModelType>("vegas-sofa");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredProducts =
    selectedCategory === "all"
      ? FEATURED_PRODUCTS
      : FEATURED_PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen bg-zen-ivory text-zen-black selection:bg-zen-accent selection:text-white">
      
      {/* =========================================================================
          1. BREATHE (HERO) — THE CINEMATIC ARCHITECTURAL ENTRY
         ========================================================================= */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 px-6 md:px-12 overflow-hidden bg-zen-black text-zen-ivory">
        {/* Cinematic Breathing Background Loop */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ scale: 1.05 }}
            animate={{ 
              scale: 1.07, 
              x: ["0%", "-0.5%", "0.2%", "0%"],
              y: ["0%", "0.2%", "-0.2%", "0%"] 
            }}
            transition={{ 
              duration: 40, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "linear" 
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src="/images/cinematic_hero.jpg"
              alt="Zen Arch Architectural Interior"
              fill
              priority
              className="object-cover object-center opacity-70"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-zen-black/90 via-zen-black/80 lg:via-zen-black/60 to-transparent" />
          <div className="absolute inset-0 bg-dark-grain opacity-30" />
        </div>

        {/* Main Layout */}
        <div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pointer-events-none mt-10 lg:mt-0">
          
          {/* LEFT SIDE: Typography */}
          <div className="lg:col-span-7 space-y-10 pointer-events-auto">
            <Reveal delay={0.2} direction="left">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1px] bg-zen-accent" />
                <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-zen-accent font-mono font-medium">
                  Architectural Studio &bull; Furniture Atelier
                </span>
              </div>
            </Reveal>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal leading-[0.95] tracking-tight uppercase">
              <MaskReveal delay={0.4}>Spaces Designed</MaskReveal>
              <MaskReveal delay={0.6} className="text-zen-sand font-light">
                Around The Way
              </MaskReveal>
              <MaskReveal delay={0.8} className="text-zen-gold italic">
                You Live.
              </MaskReveal>
            </h1>

            <Reveal delay={1.0}>
              <p className="text-zen-sand/90 text-sm md:text-lg font-light max-w-md leading-relaxed tracking-wide">
                Founded by <strong>{BRAND.founder}</strong> in Mumbai, Zen Arch harmonizes pure architectural spatial discipline with artisanal, custom-fabricated furniture.
              </p>
            </Reveal>

            <Reveal delay={1.2}>
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <Button href="/consultation" variant="primary" size="md">
                  Start Project
                </Button>
                <Button href="/furniture" variant="outline" size="md">
                  Explore Furniture
                </Button>
              </div>
            </Reveal>
          </div>

          {/* RIGHT SIDE: Contained 3D Showroom Frame */}
          <div className="hidden lg:block lg:col-span-5 w-full pointer-events-auto">
            <Reveal delay={1.2} direction="up">
              <div className="relative aspect-square md:aspect-[4/3] lg:aspect-[4/5] bg-zen-black/20 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col group">
                
                {/* 3D Viewport Header */}
                <div className="absolute top-0 left-0 w-full flex justify-between items-center p-4 z-20 pointer-events-none">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-zen-sand/60">3D Spatial Preview</span>
                  <div className="flex items-center gap-2 text-zen-sand/60">
                    <RotateCw size={12} className="animate-spin-slow" />
                    <span className="text-[9px] uppercase tracking-widest font-mono">360&deg; Orbit</span>
                  </div>
                </div>

                {/* 3D Canvas */}
                <div className="flex-1 relative cursor-grab active:cursor-grabbing bg-transparent">
                  <SpatialCanvas
                    camera={{ position: [0, 1.5, 4.5], fov: 40 }}
                    className="w-full h-full"
                    fallback={null}
                  >
                    <HeroSpatialScene materialPreset={activeMaterial} modelType={activeModel} interactive={true} />
                  </SpatialCanvas>
                </div>

                {/* Viewport UI Controls */}
                <div className="absolute bottom-0 left-0 w-full p-4 z-20 bg-gradient-to-t from-zen-black/60 via-zen-black/30 to-transparent flex flex-col gap-4">
                  {/* Model Selector */}
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {[
                      { id: "vegas-sofa", label: "Model 01", product: "vegas" },
                      { id: "flame-sofa", label: "Model 02", product: "flame" },
                      { id: "arcus-sofa", label: "Model 03", product: "arcus" },
                      { id: "gold-ottoman", label: "Model 04", product: "gold" }
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setActiveModel(m.id as ModelType)}
                        className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-mono border transition-all whitespace-nowrap ${
                          activeModel === m.id
                            ? "border-zen-accent text-zen-accent bg-zen-accent/10"
                            : "border-zen-charcoal text-zen-sand/50 hover:text-zen-sand hover:border-zen-sand/30"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                    
                    {/* View Product CTA */}
                    <div className="ml-auto pl-2">
                      <Link 
                        href={`/furniture${
                          (() => {
                            const slug = [
                              { id: "vegas-sofa", slug: "vegas-sofas" },
                              { id: "flame-sofa", slug: "lopez-sofas" },
                              { id: "arcus-sofa", slug: "arcus-sofas" },
                              { id: "gold-ottoman", slug: "" }
                            ].find(x => x.id === activeModel)?.slug;
                            return slug ? `/${slug}` : "";
                          })()
                        }`}
                        className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-mono text-zen-ivory hover:text-zen-accent transition-colors whitespace-nowrap"
                      >
                        <span>View Product</span>
                        <ArrowUpRight size={10} />
                      </Link>
                    </div>
                  </div>

                  {/* Material Selector */}
                  <div className="flex gap-1 overflow-x-auto no-scrollbar">
                    {[
                      { id: "emerald-velvet", label: "Emerald" },
                      { id: "terracotta", label: "Terracotta" },
                      { id: "royal-blue", label: "Royal Blue" },
                      { id: "mustard-gold", label: "Mustard Gold" }
                    ].map((mat) => (
                      <button
                        key={mat.id}
                        onClick={() => setActiveMaterial(mat.id as MaterialPreset)}
                        className={`flex-1 py-1.5 text-[9px] uppercase tracking-widest font-mono border transition-colors whitespace-nowrap px-2 ${
                          activeMaterial === mat.id
                            ? "border-zen-sand/40 text-zen-ivory"
                            : "border-transparent text-zen-sand/40 hover:text-zen-sand"
                        }`}
                      >
                        {mat.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PHILOSOPHY
         ========================================================================= */}
      <section className="py-32 md:py-48 px-6 md:px-12 bg-zen-ivory text-zen-black relative overflow-hidden">
        <ScrollTransform input={[0, 1]} output={[0, -100]} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-serif text-zen-stone/20 whitespace-nowrap opacity-30 select-none">
            ZEN ARCH
          </div>
        </ScrollTransform>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
          <Reveal direction="up" delay={0.1}>
            <span className="text-[10px] uppercase tracking-[0.35em] text-zen-accent font-mono block">
              01 &mdash; Atelier Philosophy
            </span>
          </Reveal>
          
          <MaskReveal delay={0.2}>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal leading-[1.15] text-balance">
              &ldquo;We reject decorative noise. True luxury is the quiet precision of a space designed so intuitively around your rituals that it feels inevitable.&rdquo;
            </h2>
          </MaskReveal>
          
          <Reveal delay={0.5}>
            <div className="pt-4">
              <span className="text-sm font-medium text-zen-black block font-serif tracking-wide">
                {BRAND.founder}
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-zen-muted">
                Founder &amp; Creative Director, Zen Arch
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          3. SPACES (Visual Architectural Continuity)
         ========================================================================= */}
      <section className="px-6 md:px-12 pb-32 bg-zen-ivory">
        <div className="max-w-7xl mx-auto">
          <Parallax offset={40}>
            <ImageReveal 
              src="/images/project-juhu.jpg" 
              alt="Zen Arch Built Architecture" 
              className="aspect-[21/9] md:aspect-[24/9] border border-zen-border" 
            />
          </Parallax>
        </div>
      </section>

      {/* =========================================================================
          4. FURNITURE (Master Catalogue)
         ========================================================================= */}
      <section className="py-28 md:py-36 px-6 md:px-12 bg-zen-offwhite relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zen-border pb-8">
            <Reveal direction="left">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block">
                  02 &mdash; Master Catalogue
                </span>
                <h2 className="font-serif text-4xl md:text-6xl font-normal tracking-tight uppercase">
                  Curated Furniture
                </h2>
                <p className="text-xs md:text-sm text-zen-taupe font-light max-w-xl">
                  Sofas, lounges, ottomans, and sculptural benches verified across the 2026 Zen Arch catalogues.
                </p>
              </div>
            </Reveal>

            <Reveal direction="right" delay={0.2}>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "all", label: "All Collections" },
                  { id: "sofas", label: "Sofas & Lounges" },
                  { id: "puffy-collection", label: "Puffy Series" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                      selectedCategory === tab.id
                        ? "bg-zen-black text-zen-ivory font-medium"
                        : "bg-zen-ivory text-zen-charcoal hover:bg-zen-stone border border-zen-border"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, idx) => (
              <Reveal key={product.slug} delay={idx * 0.1} direction="up" distance={20}>
                <div className="bg-zen-ivory border border-zen-border p-6 hover:border-zen-black transition-all duration-300 group h-full flex flex-col">
                  <div className="aspect-square bg-zen-stone/40 border border-zen-border/60 flex items-center justify-center mb-6 overflow-hidden relative group-hover:border-zen-charcoal/30 transition-colors">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <span className="font-serif text-3xl text-zen-charcoal group-hover:scale-105 transition-transform duration-500">
                        {product.name.split(" ")[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-serif text-xl font-normal">{product.name}</h3>
                    <span className="text-xs font-mono text-zen-accent block pb-2">{product.priceNote}</span>
                    <p className="text-[11px] text-zen-taupe leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-zen-border mt-6">
                    <Link href={`/furniture/${product.slug}`} className="text-[10px] uppercase tracking-widest font-medium text-zen-black hover:text-zen-accent flex items-center justify-between">
                      <span>View Specifications</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. PROJECTS (Built Architecture)
         ========================================================================= */}
      <section className="py-28 md:py-36 px-6 md:px-12 bg-zen-black text-zen-ivory relative border-b border-zen-charcoal">
        <div className="max-w-7xl mx-auto space-y-16">
          <Reveal direction="up">
            <div className="space-y-4 border-b border-zen-charcoal pb-8">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block">
                03 &mdash; Built Architecture
              </span>
              <h2 className="font-serif text-4xl md:text-6xl font-normal uppercase tracking-tight">
                Selected Commissions
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Reveal direction="up" delay={0.2}>
              <Link href="/projects" className="group block space-y-6">
                <ImageReveal 
                  src="/images/project-monolith.jpg" 
                  alt="Atelier Monolith" 
                  className="aspect-[16/10] border border-zen-charcoal/80" 
                />
                <div>
                  <h3 className="font-serif text-3xl font-normal group-hover:text-zen-accent transition-colors">
                    Atelier Monolith HQ
                  </h3>
                  <p className="text-xs text-zen-sand/80 mt-2 font-light">Pune &bull; Commercial HQ &bull; 2025</p>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. AI (Spatial Intelligence)
         ========================================================================= */}
      <section className="py-28 md:py-36 px-6 md:px-12 bg-zen-ivory text-zen-black relative border-b border-zen-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-8">
            <Reveal direction="left">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block">
                04 &mdash; Grounded Spatial AI
              </span>
              <h2 className="font-serif text-4xl sm:text-6xl font-normal leading-tight mt-4">
                Transform Your Space.
              </h2>
              <p className="text-base font-light text-zen-taupe leading-relaxed mt-6">
                Upload a photograph of your living room. Our spatial intelligence model calculates floor proportions and pairs your room with verified Zen Arch pieces and real pricing.
              </p>
              <div className="mt-8 flex gap-4">
                <Button href="/ai/transform-space" variant="primary" size="md">
                  Launch Visualizer
                </Button>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-6">
            <Reveal direction="right" delay={0.2}>
              <div className="aspect-square bg-zen-stone/30 border border-zen-border flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/cinematic_hero.jpg')] bg-cover bg-center opacity-20 filter grayscale" />
                <div className="relative z-10 w-24 h-24 border border-zen-accent rounded-full flex items-center justify-center text-zen-accent animate-pulse">
                  <Sparkles size={32} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. REVIEWS (Patron Reflections)
         ========================================================================= */}
      <section className="py-28 px-6 md:px-12 bg-zen-offwhite">
        <div className="max-w-7xl mx-auto space-y-16">
          <Reveal>
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block mb-4">
                05 &mdash; Authentic Client Experiences
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal uppercase tracking-tight">
                Patron Reflections
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CLIENT_TESTIMONIALS.map((item, idx) => (
              <Reveal key={idx} delay={idx * 0.15}>
                <div className="p-8 md:p-12 bg-zen-ivory border border-zen-border h-full flex flex-col justify-between space-y-8 hover:border-zen-black transition-colors">
                  <p className="font-serif text-xl text-zen-charcoal leading-relaxed italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="pt-6 border-t border-zen-border flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-zen-black block font-sans">{item.client}</span>
                      <span className="text-[10px] text-zen-taupe block font-mono uppercase tracking-wider mt-1">{item.project}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. STUDIO & 9. START A PROJECT
         ========================================================================= */}
      <section className="py-32 px-6 md:px-12 bg-zen-black text-zen-ivory relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-8">
            <Reveal direction="left">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block">
                06 &mdash; Begin Your Commission
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.1] mt-4">
                Ready to Shape Your Space?
              </h2>
              <p className="text-sm md:text-base text-zen-sand/80 font-light leading-relaxed max-w-xl mt-6">
                Whether commissioning a full architectural residence or bespoke salon seating, our atelier guides you from initial spatial concept through white-glove installation.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <Button href="/consultation" variant="primary" size="lg">
                  Start Consultation
                </Button>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-zen-charcoal text-zen-ivory uppercase tracking-[0.2em] text-xs font-medium hover:border-zen-accent hover:text-zen-accent transition-colors"
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp Atelier</span>
                </a>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5 bg-zen-charcoal/30 border border-zen-charcoal p-8">
            <Reveal direction="up" delay={0.2}>
              <span className="text-zen-gold uppercase tracking-widest block font-medium pb-4 border-b border-zen-charcoal mb-4 text-sm font-mono">
                Mumbai Atelier Coordinates
              </span>
              <div className="space-y-4 text-zen-sand text-sm font-light">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-zen-accent shrink-0 mt-0.5" />
                  <span>{BRAND.address.line1}, {BRAND.address.locality}, {BRAND.address.city}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-zen-accent shrink-0" />
                  <a href={`tel:${BRAND.phone}`} className="hover:text-white transition-colors">{BRAND.phoneDisplay}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-zen-accent shrink-0" />
                  <a href={`mailto:${BRAND.email}`} className="hover:text-white transition-colors">{BRAND.email}</a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
