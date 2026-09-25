"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FURNITURE_CATALOGUE, CATEGORIES, FurnitureProduct } from "@/lib/data/furniture";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Search, Box, ChevronRight, MessageSquare, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export default function FurnitureDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const validProducts = useMemo(() => {
    return FURNITURE_CATALOGUE;
  }, []);

  const filteredProducts = useMemo(() => {
    return validProducts.filter((product) => {
      const matchesCat = selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery, validProducts]);

  const featuredProducts = validProducts.slice(0, 4); 
  
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-zen-ivory pt-32 pb-24 selection:bg-zen-accent selection:text-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-16">
        <Reveal>
          <div className="space-y-6 max-w-4xl border-b border-white/10 pb-16">
            <div className="flex items-center gap-3">
              <span className="w-12 h-[1px] bg-zen-accent" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono">
                Zen Arch Digital Showroom
              </span>
            </div>
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal leading-[1.05] tracking-tight uppercase text-white">
              The Collection.
            </h1>
            <p className="text-lg md:text-xl text-zen-ivory/70 font-light leading-relaxed max-w-2xl">
              Explore our verified inventory of bespoke seating, executive chairs, and architectural tables. Handcrafted to order and scaled for the modern built environment.
            </p>
          </div>
        </Reveal>

        {selectedCategory === "all" && !searchQuery && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 pb-16 border-b border-white/10">
            <div className="md:col-span-8 group relative aspect-[4/3] md:aspect-auto md:h-[600px] overflow-hidden bg-[#1A1A1A] block">
              <Link href={`/furniture/${featuredProducts[0]?.slug}`}>
                {featuredProducts[0]?.images[0] && (
                  <Image 
                    src={featuredProducts[0].images[0]} 
                    alt={featuredProducts[0].name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-zen-accent mb-2 block">
                      {featuredProducts[0]?.collection}
                    </span>
                    <h2 className="font-serif text-4xl text-white">
                      {featuredProducts[0]?.name}
                    </h2>
                  </div>
                  <div className="hidden sm:flex h-12 w-12 rounded-full border border-white/20 items-center justify-center backdrop-blur-md group-hover:bg-white group-hover:text-black transition-colors duration-500">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            </div>

            <div className="md:col-span-4 flex flex-col gap-6 md:gap-8">
              {featuredProducts.slice(1, 3).map((prod) => (
                <Link key={prod.id} href={`/furniture/${prod.slug}`} className="group relative h-[284px] overflow-hidden bg-[#1A1A1A]">
                  {prod.images[0] && (
                    <Image 
                      src={prod.images[0]} 
                      alt={prod.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1]"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="font-serif text-2xl text-white mb-1">{prod.name}</h3>
                    <span className="text-xs font-mono text-white/60 uppercase tracking-widest">{prod.collection}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="sticky top-20 z-40 bg-[#0F0F0F]/90 backdrop-blur-xl py-6 border-b border-white/10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 text-[10px] uppercase tracking-[0.15em] font-medium transition-all duration-300 border rounded-full ${
                  selectedCategory === cat.id
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white/60 border-white/20 hover:border-white/50 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="w-full lg:w-80 relative">
            <input
              type="text"
              placeholder="Search complete inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-zen-accent transition-colors rounded-full"
            />
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-white/40 pt-4">
          <span>Showing {filteredProducts.length} verified pieces</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500" /> Data Quality: Verified</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 pt-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: idx > 12 ? 0 : idx * 0.05 }}
                key={product.id}
              >
                <Link
                  href={`/furniture/${product.slug}`}
                  className="group flex flex-col h-full"
                >
                  <div className="relative aspect-square mb-5 bg-[#1A1A1A] overflow-hidden rounded-sm">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-contain p-8 group-hover:scale-110 transition-transform duration-700 ease-[0.16,1,0.3,1] mix-blend-screen"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/20 font-mono text-xs">NO IMAGE</div>
                    )}
                    
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[9px] uppercase tracking-widest font-mono border border-white/10">
                        {product.collection}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-xl sm:text-2xl text-white group-hover:text-zen-accent transition-colors">
                        {product.name}
                      </h3>
                      {product.basePrice && product.priceStatus === 'VERIFIED' && (
                        <span className="text-[11px] font-mono text-white/60 pt-1">
                          ₹{product.basePrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-white/40 font-mono mb-4 flex-grow line-clamp-2">
                      {product.variants.length > 1 
                        ? `${product.variants.length} Configurations Available` 
                        : (product.dimensions ? `Dims: ${product.dimensions}` : 'Standard Configuration')}
                    </p>
                    
                    <div className="flex items-center text-[10px] uppercase tracking-widest font-medium text-zen-accent mt-auto group-hover:translate-x-2 transition-transform duration-300">
                      View Details <ChevronRight size={14} className="ml-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-32 text-center flex flex-col items-center">
            <span className="font-serif text-3xl text-white/40 mb-4">No matching pieces found.</span>
            <Button onClick={() => {setSearchQuery(""); setSelectedCategory("all");}} variant="outline" size="sm">
              Clear Filters
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
