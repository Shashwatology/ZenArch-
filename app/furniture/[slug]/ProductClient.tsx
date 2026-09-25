"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useParams, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES } from "@/lib/data/furniture"; // keeping CATEGORIES for now if it's static
import { getWhatsAppUrl, getProductWhatsAppUrl } from "@/lib/config/brand";
import { SaveProductButton } from "@/components/store/SaveProductButton";
import { RequestQuoteModal } from "@/components/store/RequestQuoteModal";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import {
  ArrowLeft,
  ArrowRight,
  Box,
  MessageSquare,
  Ruler,
  Camera,
  Layers,
  ChevronRight,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

const SpatialCanvas = dynamic(
  () => import("@/components/3d/SpatialCanvas").then((mod) => mod.SpatialCanvas),
  { ssr: false }
);

const HeroSpatialScene = dynamic(
  () => import("@/components/3d/HeroSpatialScene").then((mod) => mod.HeroSpatialScene),
  { ssr: false }
);

interface ProductClientProps {
  isCategory: boolean;
  categoryLabel?: string;
  categoryProducts?: any[];
  product?: any;
  relatedProducts?: any[];
  isSaved?: boolean;
}

export function ProductClient({ 
  isCategory,
  categoryLabel,
  categoryProducts,
  product,
  relatedProducts,
  isSaved
}: ProductClientProps) {

  const searchParams = useSearchParams();
  const shouldOpenQuote = searchParams?.get("quote") === "true";

  // State for Product View
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"STUDIO" | "3D" | "AR_TRYON" | "PHOTO_VISUALIZER">("STUDIO");
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(shouldOpenQuote);

  // ---- CATEGORY VIEW ----
  if (isCategory && categoryProducts) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-zen-ivory pt-32 pb-24 selection:bg-zen-accent selection:text-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-16">
          <Reveal>
            <div className="space-y-6 max-w-4xl border-b border-white/10 pb-16">
              <div className="flex items-center gap-3">
                <Link href="/furniture" className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors font-mono flex items-center gap-2">
                  <ArrowLeft size={12}/> All Collections
                </Link>
              </div>
              <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal leading-[1.05] tracking-tight uppercase text-white">
                {categoryLabel}.
              </h1>
              <p className="text-lg text-zen-ivory/70 font-light leading-relaxed max-w-2xl">
                Verified inventory for the {categoryLabel} collection. Authentic dimensions and approved pricing.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 pt-8">
            {categoryProducts.map((p, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                key={p.id}
              >
                <Link href={`/furniture/${p.slug}`} className="group flex flex-col h-full">
                  <div className="relative aspect-square mb-5 bg-[#1A1A1A] overflow-hidden rounded-sm">
                    {p.images[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-contain p-8 group-hover:scale-110 transition-transform duration-700 ease-[0.16,1,0.3,1] mix-blend-screen"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/20 font-mono text-xs">NO IMAGE</div>
                    )}
                  </div>
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-xl sm:text-2xl text-white group-hover:text-zen-accent transition-colors">{p.name}</h3>
                      {p.basePrice && p.priceStatus === 'VERIFIED' && (
                        <span className="text-[11px] font-mono text-white/60 pt-1">₹{p.basePrice.toLocaleString("en-IN")}</span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 font-mono mb-4 flex-grow line-clamp-2">
                      {p.variants.length > 1 ? `${p.variants.length} Configurations` : 'Standard'}
                    </p>
                    <div className="flex items-center text-[10px] uppercase tracking-widest font-medium text-zen-accent mt-auto group-hover:translate-x-2 transition-transform duration-300">
                      View Details <ChevronRight size={14} className="ml-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---- PRODUCT DETAIL VIEW ----
  if (!product) return null;
  const currentVariant = product.variants[selectedVariantIndex] || product.variants[0];

  relatedProducts = relatedProducts || [];

  const whatsappLink = getProductWhatsAppUrl(
    product.name,
    currentVariant?.name,
    currentVariant?.priceInr || undefined
  );

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-zen-ivory pt-32 pb-24 selection:bg-zen-accent selection:text-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-16">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 text-[10px] font-mono uppercase tracking-widest text-white/40">
          <Link
            href="/furniture"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Showroom</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href={`/furniture/${product.category}`} className="hover:text-white transition-colors">{product.collection}</Link>
            <span>/</span>
            <span className="text-white font-medium">{product.name}</span>
          </div>
        </div>

        {/* Main Product Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Visual Presentation & Try In My Space */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square md:aspect-[4/3] bg-[#1A1A1A] overflow-hidden flex flex-col justify-between rounded-sm">
              
              {/* Top View Toggles */}
              <div className="absolute top-6 right-6 z-20 flex flex-wrap gap-2 justify-end max-w-[80%]">
                <button
                  onClick={() => setViewMode("STUDIO")}
                  className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-mono transition-colors border backdrop-blur-md ${
                    viewMode === "STUDIO"
                      ? "bg-white text-black border-white"
                      : "bg-black/40 text-white/80 border-white/20 hover:border-white/50"
                  }`}
                >
                  Gallery
                </button>
                {product.has3dModel ? (
                  <button
                    onClick={() => setViewMode("3D")}
                    className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-mono transition-colors border flex items-center gap-1 backdrop-blur-md ${
                      viewMode === "3D"
                        ? "bg-zen-accent text-white border-zen-accent"
                        : "bg-black/40 text-white/80 border-white/20 hover:border-white/50"
                    }`}
                  >
                    <Box size={10} /> 3D Orbit
                  </button>
                ) : (
                  <div className="px-3 py-1.5 text-[9px] uppercase tracking-widest font-mono border border-white/10 bg-black/20 text-white/20 flex items-center gap-1 cursor-not-allowed">
                    <Box size={10} /> 3D Asset Pending
                  </div>
                )}
                
                <SaveProductButton productId={product.id} isInitiallySaved={isSaved} />

                <button
                  onClick={() => setViewMode("AR_TRYON")}
                  className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-mono transition-colors border flex items-center gap-1 backdrop-blur-md ${
                    viewMode === "AR_TRYON"
                      ? "bg-white text-black border-white"
                      : "bg-black/40 text-white/80 border-white/20 hover:border-white/50"
                  }`}
                >
                  <Camera size={10} /> AR View
                </button>
                <button
                  onClick={() => setViewMode("PHOTO_VISUALIZER")}
                  className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-mono transition-colors border flex items-center gap-1 backdrop-blur-md ${
                    viewMode === "PHOTO_VISUALIZER"
                      ? "bg-white text-black border-white"
                      : "bg-black/40 text-white/80 border-white/20 hover:border-white/50"
                  }`}
                >
                  <ImageIcon size={10} /> Photo Fit
                </button>
              </div>

              {/* View Content */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <AnimatePresence mode="wait">
                  {viewMode === "STUDIO" && (
                    <motion.div
                      key="studio"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full relative"
                    >
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain mix-blend-screen"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          priority
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-white/20 font-mono text-sm uppercase tracking-widest">
                          Image Data Unavailable
                        </div>
                      )}
                    </motion.div>
                  )}
                  
                  {viewMode === "3D" && product.has3dModel && (
                    <motion.div
                      key="3d"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full"
                    >
                      <SpatialCanvas>
                        <HeroSpatialScene />
                      </SpatialCanvas>
                    </motion.div>
                  )}

                  {viewMode === "AR_TRYON" && (
                    <motion.div
                      key="ar"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full flex flex-col items-center justify-center space-y-4"
                    >
                      <Camera size={48} className="text-white/20" />
                      <h3 className="font-serif text-2xl text-white">Camera / AR Mode</h3>
                      <p className="text-xs text-white/60 font-mono max-w-sm text-center px-4">
                        Detecting surface... Place the {product.name} in your physical space using true dimensions: {product.dimensions || "Dimensions Unavailable"}.
                      </p>
                      <Button variant="outline" size="sm" onClick={() => {}}>Launch Native AR</Button>
                    </motion.div>
                  )}

                  {viewMode === "PHOTO_VISUALIZER" && (
                    <motion.div
                      key="photo"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full flex flex-col items-center justify-center space-y-4"
                    >
                      <ImageIcon size={48} className="text-white/20" />
                      <h3 className="font-serif text-2xl text-white">Photo Visualization</h3>
                      <p className="text-xs text-white/60 font-mono max-w-sm text-center px-4">
                        Upload a photo of your space to generate a conceptual placement.
                        <br/><span className="text-[10px] text-zen-accent mt-2 block">ESTIMATED VISUAL PLACEMENT ONLY</span>
                      </p>
                      <Button href={`/ai/transform-space?product=${product.slug}`} variant="outline" size="sm">Try in My Space</Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Traceability Footnote */}
            <div className="p-4 bg-[#1A1A1A] border border-white/5 text-xs text-white/40 flex items-center justify-between font-mono rounded-sm">
              <span className="flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500" /> SOURCE VERIFIED</span>
              <span>ID: {product.id.toUpperCase()}</span>
            </div>
          </div>

          {/* Right Column: Specifications & Configuration */}
          <div className="lg:col-span-5 space-y-10">
            <Reveal>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 border border-white/20 text-[9px] uppercase tracking-widest font-mono text-white/60">
                    {product.collection}
                  </span>
                  <span className="px-2 py-0.5 border border-white/20 text-[9px] uppercase tracking-widest font-mono text-white/60">
                    {product.category.replace(/-/g, ' ')}
                  </span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl font-normal leading-[1.1] text-white">
                  {product.name}
                </h1>
                <p className="text-sm text-white/60 font-light leading-relaxed">
                  Authentic {product.collection.toLowerCase()} collection piece. 
                  Hand-finished and configured for premium architectural environments.
                </p>
              </div>
            </Reveal>

            {/* Price Display */}
            <Reveal delay={0.1}>
              <div className="p-6 bg-[#1A1A1A] border border-white/10 space-y-2 rounded-sm">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-widest text-white/40 font-mono">
                    Base Price
                  </span>
                  {product.priceStatus === 'VERIFIED' && currentVariant.priceInr ? (
                    <span className="font-serif text-4xl text-white font-normal">
                      ₹{currentVariant.priceInr.toLocaleString("en-IN")}
                    </span>
                  ) : product.priceStatus === 'CONFLICT' ? (
                    <span className="flex items-center gap-2 text-zen-accent font-mono text-sm border border-zen-accent px-3 py-1">
                      <AlertTriangle size={14} /> PRICE UNDER REVIEW
                    </span>
                  ) : (
                    <span className="font-mono text-sm text-white/40 border border-white/10 px-3 py-1">
                      PRICE ON REQUEST
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest pt-2">
                  Ex-Warehouse. GST, Packing, forwarding & installation extra.
                </p>
              </div>
            </Reveal>

            {/* Variation Selector */}
            {product.variants.length > 1 && (
              <Reveal delay={0.2}>
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-widest text-white/60 font-mono block">
                    Select Configuration
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {product.variants.map((v: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedVariantIndex(index)}
                        className={`p-3 text-center border transition-all duration-300 flex flex-col items-center justify-center gap-1 rounded-sm ${
                          selectedVariantIndex === index
                            ? "border-white bg-white text-black"
                            : "border-white/10 bg-[#1A1A1A] hover:border-white/40 text-white/80"
                        }`}
                      >
                        <span className="text-[10px] font-medium uppercase tracking-widest">
                          {v.name}
                        </span>
                        {v.priceInr && (
                          <span className={`text-[10px] font-mono ${selectedVariantIndex === index ? 'text-black/60' : 'text-white/40'}`}>
                            ₹{v.priceInr.toLocaleString("en-IN")}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Technical Specifications */}
            <Reveal delay={0.3}>
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-white/60 font-mono flex items-center justify-between">
                  <span>Technical Specifications</span>
                  {product.dimensions && <span className="flex items-center gap-1"><Ruler size={10}/> DIMENSIONS VERIFIED</span>}
                </span>
                
                <div className="border border-white/10 divide-y divide-white/10 text-xs font-mono rounded-sm overflow-hidden">
                  <div className="p-4 flex justify-between bg-white/[0.02]">
                    <span className="text-white/40">Dimensions</span>
                    <span className="font-medium text-white text-right max-w-[60%]">{product.dimensions || "NOT PROVIDED"}</span>
                  </div>
                  
                  {product.specifications && product.specifications.length > 0 ? (
                    product.specifications.map((spec: any, i: number) => (
                      <div key={i} className={`p-4 flex justify-between ${i%2!==0 ? 'bg-white/[0.02]' : ''}`}>
                        <span className="text-white/40">{spec.key}</span>
                        <span className="font-medium text-white text-right max-w-[60%] leading-relaxed">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 flex justify-between">
                      <span className="text-white/40">Detailed Specs</span>
                      <span className="font-medium text-white/40">NOT PROVIDED IN SOURCE</span>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>

            {/* Space Fit Assistant Component */}
            <Reveal delay={0.4}>
               <div className="p-4 border border-white/10 bg-white/[0.02] space-y-3 rounded-sm">
                  <span className="text-[10px] uppercase tracking-widest text-white/60 font-mono flex items-center gap-2">
                    <Layers size={12} /> Space Fit Assistant
                  </span>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Room Width (ft)" className="w-full bg-[#0F0F0F] border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-zen-accent rounded-sm" />
                    <input type="text" placeholder="Room Length (ft)" className="w-full bg-[#0F0F0F] border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-zen-accent rounded-sm" />
                    <Button variant="outline" size="sm" className="whitespace-nowrap px-4 py-2 text-[10px] rounded-sm">Calculate Fit</Button>
                  </div>
                  <p className="text-[9px] font-mono text-white/40 uppercase">This is a planning aid. Real product footprint may vary slightly.</p>
               </div>
            </Reveal>

            {/* Actions */}
            <Reveal delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  href={`/ai/transform-space?product=${product.slug}`}
                  variant="primary"
                  size="lg"
                  className="flex-1 rounded-sm"
                  icon={<ImageIcon size={16} />}
                >
                  Try in My Space
                </Button>
                <Button
                  href={whatsappLink}
                  isExternal
                  variant="whatsapp"
                  size="lg"
                  className="flex-1 rounded-sm"
                  icon={<MessageSquare size={16} />}
                >
                  WhatsApp
                </Button>
                <Button
                  onClick={() => setIsQuoteModalOpen(true)}
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-sm"
                >
                  Quote
                </Button>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-24 space-y-10">
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block mb-2">
                  Atelier Curation
                </span>
                <h3 className="font-serif text-4xl text-white">
                  Related Designs
                </h3>
              </div>
              <Link
                href={`/furniture/${product.category}`}
                className="text-[10px] font-mono uppercase tracking-widest text-white/60 hover:text-white transition-colors flex items-center gap-1 pb-1"
              >
                <span>View Collection</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/furniture/${p.slug}`}
                  className="group block space-y-4"
                >
                  <div className="relative aspect-square bg-[#1A1A1A] overflow-hidden rounded-sm">
                    {p.images[0] && (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-contain p-6 mix-blend-screen group-hover:scale-110 transition-transform duration-700 ease-[0.16,1,0.3,1]"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-white group-hover:text-zen-accent transition-colors">{p.name}</h4>
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                      {p.priceStatus === 'VERIFIED' && p.basePrice ? `₹${p.basePrice.toLocaleString("en-IN")}` : 'Price On Request'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <RequestQuoteModal 
        productId={product.id}
        productName={product.name}
        variants={product.variants}
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </div>
  );
}
