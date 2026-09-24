"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FURNITURE_CATALOGUE, FurnitureProduct } from "@/lib/data/furniture";
import { BRAND, getWhatsAppUrl } from "@/lib/config/brand";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, Filter, Layers, Box, Check, MessageSquare } from "lucide-react";

export default function FurnitureDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    { id: "all", label: "Complete Catalogue (66+)" },
    { id: "sofas", label: "Sofas & Lounges (38+)" },
    { id: "puffy-collection", label: "Puffy Collection (28+)" },
    { id: "benches", label: "Sculptural Benches" },
  ];

  const filteredProducts = FURNITURE_CATALOGUE.filter((product) => {
    const matchesCat = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-zen-ivory text-zen-black pt-32 pb-24 px-6 md:px-12 selection:bg-zen-accent selection:text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Editorial Header */}
        <div className="space-y-6 max-w-3xl border-b border-zen-border pb-10">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-zen-accent" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono">
              2026 Furniture Ateliers
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight uppercase">
            Curated Catalogue.
          </h1>
          <p className="text-base md:text-lg text-zen-charcoal/80 font-light leading-relaxed">
            Handcrafted architectural seating, custom sofas, and sculptural accent poufs. Designed in Mumbai by Rohit Pathak and fabricated to bespoke specifications.
          </p>
        </div>

        {/* Filter & Category Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-zen-border">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 text-xs uppercase tracking-[0.16em] font-medium transition-all duration-300 border ${
                  selectedCategory === cat.id
                    ? "bg-zen-black text-zen-ivory border-zen-black"
                    : "bg-transparent text-zen-charcoal/70 border-zen-border hover:border-zen-charcoal hover:text-zen-black"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search design or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-zen-offwhite border border-zen-border text-xs focus:outline-none focus:border-zen-black transition-colors"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/furniture/${product.slug}`}
              className="group bg-zen-offwhite border border-zen-border p-6 flex flex-col justify-between hover:border-zen-black hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Visual Architectural Card Preview */}
                <div className="relative aspect-[4/3] bg-zen-stone/40 overflow-hidden flex items-center justify-center p-6">
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-0.5 bg-zen-black text-zen-ivory text-[9px] uppercase tracking-widest font-mono">
                      {product.categoryLabel}
                    </span>
                    {product.has3dModel && (
                      <span className="px-2 py-0.5 bg-zen-accent text-white text-[9px] uppercase tracking-widest font-mono flex items-center gap-1">
                        <Box size={10} /> 3D
                      </span>
                    )}
                  </div>

                  {/* Centered Minimalist Architectural Monolith Graphic */}
                  <div className="text-center">
                    <span className="font-serif text-4xl md:text-5xl text-zen-charcoal block group-hover:scale-105 transition-transform duration-500">
                      {product.name}
                    </span>
                    <span className="text-xs text-zen-taupe tracking-wider block mt-2 max-w-[200px] mx-auto italic font-serif">
                      &ldquo;{product.tagline}&rdquo;
                    </span>
                  </div>

                  {/* Bottom Right Source Traceability */}
                  <div className="absolute bottom-2 right-3 text-[9px] font-mono text-zen-taupe/80">
                    Pg {product.sourceCatalogue.page}
                  </div>
                </div>

                {/* Info Block */}
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h2 className="font-serif text-2xl font-normal group-hover:text-zen-accent transition-colors">
                      {product.name}
                    </h2>
                    <span className="text-xs font-mono text-zen-black font-medium">
                      {product.variations.length > 1
                        ? `From ₹${product.basePrice.toLocaleString("en-IN")}`
                        : `₹${product.basePrice.toLocaleString("en-IN")}`}
                    </span>
                  </div>
                  <p className="text-xs text-zen-taupe line-clamp-2 leading-relaxed font-light">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Card Footer with Seater Specs */}
              <div className="pt-6 border-t border-zen-border/70 flex items-center justify-between mt-4">
                <div className="flex gap-2 text-[10px] text-zen-muted font-mono">
                  {product.variations.map((v, i) => (
                    <span key={i} className="border border-zen-border px-1.5 py-0.5 bg-zen-ivory">
                      {v.seater === "Single Seater"
                        ? "1S"
                        : v.seater === "Two Seater"
                        ? "2S"
                        : v.seater === "Three Seater"
                        ? "3S"
                        : v.seater}
                    </span>
                  ))}
                </div>
                <span className="text-xs uppercase tracking-widest font-medium text-zen-black group-hover:text-zen-accent transition-colors flex items-center gap-1">
                  <span>Details</span>
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Editorial Assistance Box */}
        <div className="border border-zen-border bg-zen-stone/40 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-serif text-2xl md:text-3xl font-normal">
              Looking for Custom Dimensions or Bulk Fabrication?
            </h3>
            <p className="text-xs md:text-sm text-zen-taupe leading-relaxed font-light">
              All Zen Arc pieces can be customized in bespoke lengths, premium Italian fabrics, and custom metal powder coatings.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              href={getWhatsAppUrl("Hello Zen Arc, I would like to request custom dimensions for a furniture piece.")}
              isExternal
              variant="whatsapp"
              size="md"
              icon={<MessageSquare size={16} />}
            >
              WhatsApp Atelier
            </Button>
            <Button href="/consultation" variant="primary" size="md">
              Start Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
