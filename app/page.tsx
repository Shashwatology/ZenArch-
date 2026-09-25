"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { BRAND, getWhatsAppUrl } from "@/lib/config/brand";
import { Button } from "@/components/ui/Button";
import { Reveal, MaskReveal, Parallax, ScrollTransform } from "@/components/ui/MotionPrimitives";
import { FURNITURE_CATALOGUE } from "@/lib/data/furniture";
import { ArrowUpRight, Sparkles, Box, MessageSquare } from "lucide-react";

// Safe Dynamic Imports for 3D
const SpatialCanvas = dynamic(
  () => import("@/components/3d/SpatialCanvas").then((mod) => mod.SpatialCanvas),
  { ssr: false }
);

const HeroArchitectureScene = dynamic(
  () => import("@/components/3d/HeroArchitectureScene").then((mod) => mod.HeroArchitectureScene),
  { ssr: false }
);

const ThresholdScene = dynamic(
  () => import("@/components/home/ThresholdScene").then((mod) => mod.ThresholdScene),
  { ssr: false }
);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter valid products to feature
  const featuredFurniture = FURNITURE_CATALOGUE.filter(p => p.images && p.images.length > 0).slice(0, 3);

  // Loading Sequence
  if (!mounted) {
    return (
      <div className="min-h-screen bg-zen-black flex flex-col items-center justify-center text-zen-ivory">
        <div className="font-serif text-3xl tracking-widest uppercase">Zen Arch</div>
        <div className="text-[10px] uppercase font-mono tracking-[0.3em] text-zen-accent mt-4">Interior Solution</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-zen-black text-zen-ivory selection:bg-zen-accent selection:text-white">
      
      {/* =========================================================================
          1. HERO — THE ARCHITECTURAL STUDIO
         ========================================================================= */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background 3D Composition */}
        <div className="absolute inset-0 z-0 bg-[#0C0B0A]">
          <SpatialCanvas
            camera={{ position: [0, 1.5, 4.5], fov: 45 }}
            className="w-full h-full"
            fallback={<div className="absolute inset-0 bg-[#0C0B0A]" />}
          >
            <HeroArchitectureScene />
          </SpatialCanvas>
          {/* Subtle gradient vignette to blend edges */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0C0B0A]/40 to-[#0C0B0A] pointer-events-none" />
        </div>

        {/* Editorial Typography overlay */}
        <div className="relative z-10 w-full px-6 md:px-12 pointer-events-none">
          <div className="max-w-7xl mx-auto flex flex-col justify-center h-full pt-20">
            <Reveal delay={0.2} direction="up" distance={20}>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-[1px] bg-zen-accent" />
                <span className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-zen-accent font-mono">
                  Architectural Studio &bull; Furniture Atelier
                </span>
              </div>
            </Reveal>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-normal leading-[0.95] tracking-tight text-zen-sand pointer-events-auto max-w-4xl">
              <MaskReveal delay={0.4}>SPACES DESIGNED</MaskReveal>
              <MaskReveal delay={0.6}>AROUND THE</MaskReveal>
              <MaskReveal delay={0.8} className="text-zen-ivory">WAY YOU LIVE.</MaskReveal>
            </h1>

            <Reveal delay={1.2} direction="up" distance={10}>
              <div className="mt-12 flex flex-col sm:flex-row gap-6 pointer-events-auto">
                <Button href="/projects" variant="primary" size="lg" className="px-8 border-zen-accent bg-zen-accent text-zen-black hover:bg-zen-ivory hover:border-zen-ivory">
                  START A PROJECT
                </Button>
                <Link href="/furniture" className="flex items-center gap-3 text-xs uppercase tracking-widest text-zen-sand hover:text-zen-ivory transition-colors py-4">
                  <span>Explore Furniture</span>
                  <ArrowRight size={14} className="text-zen-accent" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PHILOSOPHY — LARGE TYPOGRAPHIC REVEAL
         ========================================================================= */}
      <section className="relative py-40 md:py-60 px-6 md:px-12 bg-zen-black text-zen-sand flex items-center justify-center overflow-hidden">
        <ScrollTransform input={[0, 1]} output={[0, -50]} className="max-w-5xl mx-auto text-center z-10">
          <MaskReveal delay={0}>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-[5rem] font-normal leading-[1.1] uppercase text-balance">
              Detail is not decoration.
            </h2>
          </MaskReveal>
          <MaskReveal delay={0.2}>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-[5rem] font-normal leading-[1.1] uppercase text-balance text-zen-taupe/50 italic">
              It is the design.
            </h2>
          </MaskReveal>
          <Reveal delay={0.4} direction="up" className="mt-12">
            <span className="text-[10px] uppercase tracking-[0.3em] font-mono block">
              &mdash; {BRAND.founder}
            </span>
          </Reveal>
        </ScrollTransform>
      </section>

      {/* =========================================================================
          3. SPACES — ARCHITECTURAL HORIZONTAL GALLERY
         ========================================================================= */}
      <section className="py-32 px-6 md:px-12 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto space-y-16">
          <Reveal direction="left">
            <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block mb-4">
              01 &mdash; Spatial Architecture
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal uppercase tracking-tight">
              Interior Environments
            </h2>
          </Reveal>
          
          <div className="w-full flex flex-col md:flex-row gap-8 overflow-hidden">
            <Parallax offset={20} className="w-full md:w-2/3 group relative overflow-hidden aspect-[16/10] bg-zen-charcoal">
              <Image 
                src="/images/project-juhu.jpg" 
                alt="Living Space" 
                fill 
                className="object-cover object-center group-hover:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]" 
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
              <div className="absolute bottom-8 left-8">
                <span className="font-serif text-2xl">Lounge</span>
                <span className="block text-[10px] font-mono tracking-widest text-zen-sand mt-2">BESPOKE FABRICATION</span>
              </div>
            </Parallax>
            <Parallax offset={40} className="w-full md:w-1/3 group relative overflow-hidden aspect-[3/4] md:aspect-auto bg-zen-charcoal">
              <Image 
                src="/images/project-monolith.jpg" 
                alt="Workspace" 
                fill 
                className="object-cover object-center group-hover:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]" 
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
              <div className="absolute bottom-8 left-8">
                <span className="font-serif text-2xl">Atelier HQ</span>
                <span className="block text-[10px] font-mono tracking-widest text-zen-sand mt-2">COMMERCIAL DESIGN</span>
              </div>
            </Parallax>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. FURNITURE — CATALOGUE EDITORIAL
         ========================================================================= */}
      <section className="py-32 px-6 md:px-12 bg-zen-ivory text-zen-black">
        <div className="max-w-7xl mx-auto space-y-24">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <Reveal direction="left">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block mb-4">
                02 &mdash; Furniture Atelier
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-normal uppercase tracking-tight max-w-lg leading-tight">
                Objects for Lived Spaces.
              </h2>
            </Reveal>
            <Reveal direction="right">
              <Link href="/furniture" className="flex items-center gap-3 text-xs uppercase tracking-widest text-zen-charcoal hover:text-zen-accent transition-colors pb-2 border-b border-zen-charcoal/30 hover:border-zen-accent">
                <span>Explore Complete Collection</span>
                <ArrowRight size={14} />
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            {/* Large Featured Product */}
            {featuredFurniture[0] && (
              <div className="md:col-span-8 group cursor-pointer">
                <Link href={`/furniture/${featuredFurniture[0].slug}`} className="block relative overflow-hidden aspect-[16/10] bg-zen-stone/40">
                  <Image 
                    src={featuredFurniture[0].images[0]} 
                    alt={featuredFurniture[0].name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" 
                  />
                </Link>
                <div className="mt-6 flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-2xl">{featuredFurniture[0].name}</h3>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-zen-taupe mt-2">{featuredFurniture[0].collection} Collection</p>
                  </div>
                  <span className="font-mono text-xs">₹{featuredFurniture[0].basePrice?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

            {/* Smaller Products Stacked */}
            <div className="md:col-span-4 flex flex-col gap-12">
              {featuredFurniture.slice(1).map((product, idx) => (
                <div key={product.id} className="group cursor-pointer">
                  <Link href={`/furniture/${product.slug}`} className="block relative overflow-hidden aspect-[4/3] bg-zen-stone/40">
                    <Image 
                      src={product.images[0]} 
                      alt={product.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" 
                    />
                  </Link>
                  <div className="mt-4">
                    <h3 className="font-serif text-lg">{product.name}</h3>
                    <div className="flex justify-between mt-1 text-[10px] font-mono text-zen-taupe">
                      <span>{product.collection}</span>
                      <span>₹{product.basePrice?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. 3D INTERLUDE (Architectural Threshold)
         ========================================================================= */}
      <section className="relative h-[60vh] bg-zen-black overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <SpatialCanvas camera={{ position: [0, 0, 2], fov: 60 }} fallback={<div className="bg-zen-black absolute inset-0" />}>
            <ThresholdScene />
          </SpatialCanvas>
        </div>
        <div className="relative z-10 text-center text-zen-ivory pointer-events-none max-w-2xl px-6">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-widest text-zen-sand opacity-90 mix-blend-screen">
              Enter The Studio
            </h2>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          6. AI VISION (Grounded Spatial AI)
         ========================================================================= */}
      <section className="py-32 px-6 md:px-12 bg-zen-charcoal text-zen-ivory relative border-b border-zen-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative aspect-square bg-[#0a0a0a] border border-zen-border/20 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/project-juhu.jpg')] bg-cover bg-center opacity-30 filter grayscale mix-blend-luminosity" />
            
            {/* Simulated UI Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
              <div className="w-16 h-16 border border-zen-accent rounded-full flex items-center justify-center text-zen-accent">
                <Sparkles size={24} />
              </div>
              <div className="text-center">
                <span className="block text-[10px] font-mono tracking-widest uppercase text-zen-accent mb-2">AI VISUALIZATION</span>
                <span className="font-serif text-xl">Vegas Sofa &times; Your Space</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <Reveal direction="up">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block">
                03 &mdash; Spatial Intelligence
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-[1.1] mt-4 uppercase">
                See It Before <br/><span className="text-zen-taupe italic">You Commit.</span>
              </h2>
              <p className="text-sm font-light text-zen-sand/80 leading-relaxed mt-6 max-w-md">
                Upload a photograph of your room. Our architectural vision model grounds verified Zen Arch furniture into your exact floor plan, preserving your lighting and spatial proportions.
              </p>
              <div className="mt-10">
                <Button href="/ai/transform-space" variant="outline" size="md" className="border-zen-accent text-zen-accent hover:bg-zen-accent hover:text-zen-black">
                  TRANSFORM YOUR SPACE
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. FINAL CTA & FOOTER
         ========================================================================= */}
      <section className="pt-32 pb-16 px-6 md:px-12 bg-zen-black text-zen-ivory text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <Reveal direction="up">
            <h2 className="font-serif text-5xl md:text-7xl font-normal uppercase tracking-tight">
              Let&apos;s Design <br/>
              <span className="text-zen-sand italic">Your Space.</span>
            </h2>
          </Reveal>
          
          <Reveal delay={0.2} direction="up">
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              <Button href="/consultation" variant="primary" size="lg" className="bg-zen-ivory text-zen-black border-zen-ivory hover:bg-zen-accent hover:border-zen-accent">
                Start A Project
              </Button>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-zen-charcoal text-zen-ivory uppercase tracking-[0.2em] text-xs font-medium hover:border-zen-accent transition-colors"
              >
                <MessageSquare size={16} />
                <span>WhatsApp Studio</span>
              </a>
            </div>
          </Reveal>
        </div>

        {/* Minimal Footer */}
        <div className="mt-40 border-t border-zen-charcoal pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-mono uppercase tracking-widest text-zen-taupe">
          <div className="text-left space-y-2">
            <span className="block text-zen-ivory">ZENARCH INTERIOR SOLUTION</span>
            <span>Mumbai, Maharashtra</span>
          </div>
          
          <div className="flex gap-8">
            <Link href="/projects" className="hover:text-zen-ivory">Work</Link>
            <Link href="/furniture" className="hover:text-zen-ivory">Furniture</Link>
            <Link href="/services" className="hover:text-zen-ivory">Services</Link>
            <Link href="/ai/transform-space" className="hover:text-zen-ivory">AI</Link>
          </div>

          <div className="text-right space-y-2">
            <a href={`tel:${BRAND.phone}`} className="block hover:text-zen-ivory">{BRAND.phoneDisplay}</a>
            <a href={`mailto:${BRAND.email}`} className="block hover:text-zen-ivory">{BRAND.email}</a>
          </div>
        </div>
      </section>

    </div>
  );
}
