"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { getProductBySlug, FURNITURE_CATALOGUE, ProductVariation } from "@/lib/data/furniture";
import { BRAND, getProductWhatsAppUrl, getWhatsAppUrl } from "@/lib/config/brand";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  ArrowRight,
  Box,
  MessageSquare,
  CheckCircle2,
  Ruler,
  Layers,
  Sparkles,
  Share2,
} from "lucide-react";

// Dynamic 3D Viewer
const SpatialCanvas = dynamic(
  () => import("@/components/3d/SpatialCanvas").then((mod) => mod.SpatialCanvas),
  { ssr: false }
);

const HeroSpatialScene = dynamic(
  () => import("@/components/3d/HeroSpatialScene").then((mod) => mod.HeroSpatialScene),
  { ssr: false }
);

export default function ProductOrCategoryPage() {
  const params = useParams();
  const rawSlug = params?.slug as string;
  const isCategory = ["sofas", "puffy-collection", "benches"].includes(rawSlug);
  const categoryProducts = isCategory ? FURNITURE_CATALOGUE.filter((p) => p.category === rawSlug) : [];
  const product = !isCategory ? getProductBySlug(rawSlug) : undefined;

  if (!isCategory && !product) {
    notFound();
  }

  const [selectedVariationIndex, setSelectedVariationIndex] = useState<number>(0);
  const [view3D, setView3D] = useState<boolean>(false);

  // If category view:
  if (isCategory) {
    const categoryTitle =
      rawSlug === "sofas"
        ? "Sofas & Lounges"
        : rawSlug === "puffy-collection"
        ? "Puffy Collection"
        : "Sculptural Benches";

    const categorySubtitle =
      rawSlug === "sofas"
        ? "38+ Handcrafted Settees, Daybeds, and Sectionals — Zenarch 2026 Source"
        : rawSlug === "puffy-collection"
        ? "28+ Sculptural Accent Poufs & Ottomans — W.E.F. 1st May 2026"
        : "Architectural Low Benches & Circular Lounges";

    return (
      <div className="min-h-screen bg-zen-ivory text-zen-black pt-32 pb-24 px-6 md:px-12 selection:bg-zen-accent selection:text-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-6 max-w-3xl border-b border-zen-border pb-10">
            <div className="flex items-center gap-3">
              <Link href="/furniture" className="text-xs font-mono uppercase tracking-widest text-zen-muted hover:text-zen-black flex items-center gap-1">
                <ArrowLeft size={12} /> All Collections
              </Link>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight uppercase">
              {categoryTitle}.
            </h1>
            <p className="text-base text-zen-charcoal/80 font-light leading-relaxed">
              {categorySubtitle}. Verified dimensional tables, fabric meterage calculations, and approved price lists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryProducts.map((p) => (
              <Link
                key={p.id}
                href={`/furniture/${p.slug}`}
                className="group bg-zen-offwhite border border-zen-border p-6 flex flex-col justify-between hover:border-zen-black transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="relative aspect-[4/3] bg-zen-stone/40 overflow-hidden flex items-center justify-center p-6">
                    <div className="text-center">
                      <span className="font-serif text-4xl text-zen-charcoal block group-hover:scale-105 transition-transform duration-500">
                        {p.name}
                      </span>
                      <span className="text-xs text-zen-taupe tracking-wider block mt-2 italic font-serif">
                        &ldquo;{p.tagline}&rdquo;
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-3 text-[9px] font-mono text-zen-taupe/80">
                      Pg {p.sourceCatalogue.page}
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h2 className="font-serif text-2xl font-normal group-hover:text-zen-accent transition-colors">
                        {p.name}
                      </h2>
                      <span className="text-xs font-mono text-zen-black font-medium">
                        {p.variations.length > 1
                          ? `From ₹${p.basePrice.toLocaleString("en-IN")}`
                          : `₹${p.basePrice.toLocaleString("en-IN")}`}
                      </span>
                    </div>
                    <p className="text-xs text-zen-taupe line-clamp-2 leading-relaxed font-light">
                      {p.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-zen-border/70 flex items-center justify-between mt-4">
                  <span className="text-[10px] text-zen-muted font-mono">{p.sourceCatalogue.catalogueName}</span>
                  <span className="text-xs uppercase tracking-widest font-medium text-zen-black group-hover:text-zen-accent transition-colors flex items-center gap-1">
                    <span>View</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise product detail view:
  if (!product) return null;
  const currentVariation: ProductVariation =
    product.variations[selectedVariationIndex] || product.variations[0];

  const relatedProducts = FURNITURE_CATALOGUE.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  ).slice(0, 3);

  const whatsappLink = getProductWhatsAppUrl(
    product.name,
    currentVariation.seater,
    currentVariation.priceInr
  );

  return (
    <div className="min-h-screen bg-zen-ivory text-zen-black pt-28 pb-24 px-6 md:px-12 selection:bg-zen-accent selection:text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between border-b border-zen-border pb-6 text-xs font-mono uppercase tracking-widest text-zen-muted">
          <Link
            href="/furniture"
            className="flex items-center gap-2 hover:text-zen-black transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Catalogue</span>
          </Link>
          <div className="flex items-center gap-2">
            <span>{product.categoryLabel}</span>
            <span>/</span>
            <span className="text-zen-black font-semibold">{product.name}</span>
          </div>
        </div>

        {/* Main Product Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Visual Presentation (Studio or 3D) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/3] bg-zen-stone/40 border border-zen-border overflow-hidden flex items-center justify-center p-8">
              {/* Top View Toggle */}
              {product.has3dModel && (
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                  <button
                    onClick={() => setView3D(false)}
                    className={`px-3 py-1 text-[10px] uppercase tracking-widest font-mono transition-colors border ${
                      !view3D
                        ? "bg-zen-black text-zen-ivory border-zen-black"
                        : "bg-zen-ivory/80 text-zen-black border-zen-border"
                    }`}
                  >
                    Studio View
                  </button>
                  <button
                    onClick={() => setView3D(true)}
                    className={`px-3 py-1 text-[10px] uppercase tracking-widest font-mono transition-colors border flex items-center gap-1 ${
                      view3D
                        ? "bg-zen-accent text-white border-zen-accent"
                        : "bg-zen-ivory/80 text-zen-black border-zen-border"
                    }`}
                  >
                    <Box size={12} /> 3D Orbit
                  </button>
                </div>
              )}

              {/* Source Page Watermark */}
              <div className="absolute top-4 left-4 text-[9px] uppercase font-mono tracking-widest text-zen-taupe/80 bg-zen-ivory/60 px-2 py-1 border border-zen-border/50">
                {product.sourceCatalogue.catalogueName} &bull; Page {product.sourceCatalogue.page}
              </div>

              {/* View Content */}
              {view3D ? (
                <div className="w-full h-full">
                  <SpatialCanvas>
                    <HeroSpatialScene />
                  </SpatialCanvas>
                </div>
              ) : (
                <div className="text-center space-y-4 max-w-md">
                  <span className="font-serif text-6xl md:text-7xl lg:text-8xl text-zen-charcoal block">
                    {product.name}
                  </span>
                  <span className="text-sm md:text-base font-serif italic text-zen-accent block">
                    &ldquo;{product.tagline}&rdquo;
                  </span>
                  <p className="text-xs text-zen-taupe font-light tracking-wide max-w-sm mx-auto">
                    Handcrafted architectural proportions. Photographed &amp; documented in the official Zen Arc collection.
                  </p>
                </div>
              )}
            </div>

            {/* Architectural Traceability Footnote */}
            <div className="p-4 bg-zen-stone/30 border border-zen-border text-xs text-zen-taupe flex items-center justify-between font-mono">
              <span>CATALOGUE TRACEABILITY</span>
              <span>{product.sourceCatalogue.catalogueName} &bull; PG {product.sourceCatalogue.page}</span>
            </div>
          </div>

          {/* Right Column: Specifications & Configuration Selector */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block">
                {product.categoryLabel}
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-normal leading-tight">
                {product.name}
              </h1>
              <p className="text-xs md:text-sm text-zen-charcoal/80 font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Display */}
            <div className="p-6 bg-zen-offwhite border border-zen-border space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-widest text-zen-muted font-mono">
                  Approved Price
                </span>
                <span className="font-serif text-3xl md:text-4xl text-zen-black font-normal">
                  ₹{currentVariation.priceInr.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-[11px] text-zen-taupe font-light">
                {product.pricingTerms}
              </p>
              {product.fabricRateNote && (
                <p className="text-[11px] text-zen-accent font-medium">
                  {product.fabricRateNote}
                </p>
              )}
            </div>

            {/* Variation / Seater Selector */}
            {product.variations.length > 1 && (
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.2em] text-zen-black font-medium block">
                  Select Seater Configuration
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {product.variations.map((v, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariationIndex(index)}
                      className={`p-3 text-center border transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                        selectedVariationIndex === index
                          ? "border-zen-black bg-zen-black text-zen-ivory"
                          : "border-zen-border bg-zen-ivory hover:border-zen-charcoal text-zen-charcoal"
                      }`}
                    >
                      <span className="text-xs font-medium uppercase tracking-wider">
                        {v.seater}
                      </span>
                      <span className="text-[11px] font-mono opacity-80">
                        ₹{v.priceInr.toLocaleString("en-IN")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dimensional & Specification Table */}
            <div className="border border-zen-border divide-y divide-zen-border text-xs">
              <div className="p-3.5 flex justify-between bg-zen-stone/20">
                <span className="text-zen-muted font-mono uppercase">Dimensions (Size)</span>
                <span className="font-medium text-zen-black">{currentVariation.sizeFt || "Custom"}</span>
              </div>
              {currentVariation.fabricMeters && (
                <div className="p-3.5 flex justify-between">
                  <span className="text-zen-muted font-mono uppercase">Fabric Consumption</span>
                  <span className="font-medium text-zen-black">{currentVariation.fabricMeters} Meters</span>
                </div>
              )}
              {product.specifications.frameMaterial && (
                <div className="p-3.5 flex justify-between bg-zen-stone/20">
                  <span className="text-zen-muted font-mono uppercase">Frame Structure</span>
                  <span className="font-medium text-zen-black">{product.specifications.frameMaterial}</span>
                </div>
              )}
              {product.specifications.legFinish && (
                <div className="p-3.5 flex justify-between">
                  <span className="text-zen-muted font-mono uppercase">Leg / Base Finish</span>
                  <span className="font-medium text-zen-black">{product.specifications.legFinish}</span>
                </div>
              )}
            </div>

            {/* Order & WhatsApp CTA Area */}
            <div className="space-y-3 pt-2">
              <Button
                href={whatsappLink}
                isExternal
                variant="whatsapp"
                size="lg"
                fullWidth
                icon={<MessageSquare size={16} />}
              >
                Inquire on WhatsApp ({currentVariation.seater})
              </Button>
              <Button
                href="/consultation"
                variant="outline"
                size="md"
                fullWidth
              >
                Book Space Consultation with Rohit Pathak
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products from Collection */}
        {relatedProducts.length > 0 && (
          <div className="pt-16 border-t border-zen-border space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block mb-1">
                  Atelier Curation
                </span>
                <h3 className="font-serif text-3xl font-normal uppercase">
                  Related Designs
                </h3>
              </div>
              <Link
                href="/furniture"
                className="text-xs uppercase tracking-widest text-zen-black hover:text-zen-accent transition-colors flex items-center gap-1"
              >
                <span>All Catalogues</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/furniture/${p.slug}`}
                  className="p-6 bg-zen-offwhite border border-zen-border hover:border-zen-black transition-colors group block space-y-4"
                >
                  <div className="aspect-[4/3] bg-zen-stone/40 flex items-center justify-center p-4">
                    <span className="font-serif text-3xl text-zen-charcoal group-hover:scale-105 transition-transform">
                      {p.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-serif text-xl">{p.name}</h4>
                    <span className="text-xs font-mono text-zen-black">
                      From ₹{p.basePrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
