"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BRAND, getWhatsAppUrl, getProductWhatsAppUrl } from "@/lib/config/brand";
import { FURNITURE_CATALOGUE } from "@/lib/data/furniture";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  Upload,
  ArrowRight,
  ArrowLeft,
  Check,
  RefreshCw,
  MessageSquare,
  Box,
  Layers,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export default function TransformSpacePage() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedStyle, setSelectedStyle] = useState<string>("Zen Minimalist");
  const [selectedBudget, setSelectedBudget] = useState<string>("₹30L - ₹60L");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [conceptGenerated, setConceptGenerated] = useState<boolean>(false);

  const presets = [
    {
      id: "salon",
      name: "Empty Travertine Living Area",
      thumb: "Living Room Preset",
    },
    {
      id: "penthouse",
      name: "Double-Height High Ceiling Penthouse",
      thumb: "Penthouse Preset",
    },
    {
      id: "workspace",
      name: "Executive Creative Office",
      thumb: "Workspace Preset",
    },
  ];

  const styles = [
    {
      id: "zen",
      name: "Zen Minimalist",
      desc: "Warm travertine, textured ivory bouclé, raw oak, and serene diffused lighting.",
      palette: ["#FDFBF7", "#EAE6DF", "#8C827A", "#0C0B0A"],
    },
    {
      id: "editorial",
      name: "Contemporary Editorial",
      desc: "Monolithic charcoal slabs, brushed champagne gold accents, and fluted vertical timber.",
      palette: ["#1D1C1A", "#C2A374", "#9B7E63", "#F7F5F0"],
    },
    {
      id: "luxury",
      name: "Quiet Luxury / Modern Classical",
      desc: "Deep cognac leather, architectural button tufting, antique brass, and micro-cement.",
      palette: ["#2B241E", "#9B7E63", "#D8D2C5", "#0C0B0A"],
    },
  ];

  const budgets = [
    { tier: "₹15L - ₹30L", desc: "Signature Seating & Curated Architectural Lighting" },
    { tier: "₹30L - ₹60L", desc: "Comprehensive Spatial Overhaul & Custom Joinery" },
    { tier: "₹60L+", desc: "Flagship Architectural Estate & Turnkey Execution" },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setConceptGenerated(true);
      setActiveStep(4);
    }, 1500);
  };

  const curatedPieces = [
    FURNITURE_CATALOGUE[0], // Vegas
    FURNITURE_CATALOGUE[4], // Arcus
    FURNITURE_CATALOGUE[15], // Albert Puffy
  ];

  return (
    <div className="min-h-screen bg-zen-ivory text-zen-black pt-32 pb-24 px-6 md:px-12 selection:bg-zen-accent selection:text-white">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-zen-border pb-8">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-zen-accent" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono">
              Spatial Exploration Studio
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight uppercase">
            Transform Your Space.
          </h1>
          <p className="text-xs md:text-sm text-zen-charcoal/80 font-light leading-relaxed max-w-xl">
            Upload your living room photograph or architectural plan. Select an aesthetic and investment tier to visualize an bespoke Zen Arc transformation.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-zen-muted border-b border-zen-border pb-4">
          <span className={activeStep === 1 ? "text-zen-black font-semibold" : ""}>
            01. Space Photo
          </span>
          <span>&rarr;</span>
          <span className={activeStep === 2 ? "text-zen-black font-semibold" : ""}>
            02. Aesthetic
          </span>
          <span>&rarr;</span>
          <span className={activeStep === 3 ? "text-zen-black font-semibold" : ""}>
            03. Investment
          </span>
          <span>&rarr;</span>
          <span className={activeStep === 4 ? "text-zen-black font-semibold" : ""}>
            04. AI Architectural Concept
          </span>
        </div>

        {/* STEP 1: Upload or Preset */}
        {activeStep === 1 && (
          <div className="bg-zen-offwhite border border-zen-border p-8 md:p-12 space-y-8">
            <h2 className="font-serif text-3xl font-normal">
              Step 1 &mdash; Upload Your Existing Room
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Upload Box */}
              <div
                onClick={() => {
                  setUploadedImage("Custom Room Upload");
                  setActiveStep(2);
                }}
                className="border-2 border-dashed border-zen-border p-10 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:border-zen-black transition-colors bg-zen-ivory"
              >
                <Upload size={32} className="text-zen-accent" />
                <span className="text-xs uppercase tracking-widest font-medium text-zen-black">
                  Upload Room Photo / Blueprint
                </span>
                <span className="text-[11px] text-zen-taupe font-light">
                  PNG, JPG, or PDF up to 25MB
                </span>
              </div>

              {/* Or Presets */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-zen-muted block">
                  Or Explore with Atelier Presets:
                </span>
                {presets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setUploadedImage(p.name);
                      setActiveStep(2);
                    }}
                    className="w-full p-4 border border-zen-border bg-zen-ivory hover:border-zen-black text-left flex justify-between items-center transition-colors text-xs uppercase tracking-wider font-medium"
                  >
                    <span>{p.name}</span>
                    <ArrowRight size={14} className="text-zen-accent" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Choose Style */}
        {activeStep === 2 && (
          <div className="bg-zen-offwhite border border-zen-border p-8 md:p-12 space-y-8">
            <h2 className="font-serif text-3xl font-normal">
              Step 2 &mdash; Choose Design Aesthetic
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.name)}
                  className={`p-6 text-left border flex flex-col justify-between gap-6 transition-all duration-200 ${
                    selectedStyle === style.name
                      ? "bg-zen-black text-zen-ivory border-zen-black"
                      : "bg-zen-ivory border-zen-border hover:border-zen-charcoal text-zen-charcoal"
                  }`}
                >
                  <div className="space-y-2">
                    <span className="font-serif text-2xl font-normal block">{style.name}</span>
                    <p className="text-xs opacity-80 leading-relaxed font-light">{style.desc}</p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-current/20">
                    {style.palette.map((color, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full border border-black/10"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-6 border-t border-zen-border">
              <button
                onClick={() => setActiveStep(1)}
                className="px-6 py-3 border border-zen-border text-xs uppercase tracking-widest hover:border-zen-black"
              >
                Back
              </button>
              <Button onClick={() => setActiveStep(3)} variant="primary" size="md">
                Continue to Budget
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Choose Budget & Generate */}
        {activeStep === 3 && (
          <div className="bg-zen-offwhite border border-zen-border p-8 md:p-12 space-y-8">
            <h2 className="font-serif text-3xl font-normal">
              Step 3 &mdash; Select Investment Tier
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {budgets.map((b) => (
                <button
                  key={b.tier}
                  onClick={() => setSelectedBudget(b.tier)}
                  className={`p-6 text-left border flex flex-col justify-between gap-4 transition-all duration-200 ${
                    selectedBudget === b.tier
                      ? "bg-zen-black text-zen-ivory border-zen-black"
                      : "bg-zen-ivory border-zen-border hover:border-zen-charcoal text-zen-charcoal"
                  }`}
                >
                  <div>
                    <span className="font-mono text-sm uppercase tracking-wider block font-semibold">
                      {b.tier}
                    </span>
                    <p className="text-xs opacity-80 leading-relaxed font-light mt-2">{b.desc}</p>
                  </div>
                  <div className="text-[10px] font-mono text-zen-accent uppercase">
                    Select Tier &rarr;
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-6 border-t border-zen-border">
              <button
                onClick={() => setActiveStep(2)}
                className="px-6 py-3 border border-zen-border text-xs uppercase tracking-widest hover:border-zen-black"
              >
                Back
              </button>
              <Button
                onClick={handleGenerate}
                variant="gold"
                size="lg"
                icon={<Sparkles size={16} />}
                disabled={isGenerating}
              >
                {isGenerating ? "Synthesizing Architecture..." : "Generate Spatial Concept"}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Rendered Concept & Matched Furniture */}
        {activeStep === 4 && (
          <div className="space-y-12">
            {/* Visual Concept Showcase */}
            <div className="bg-zen-black text-zen-ivory border border-zen-charcoal p-8 md:p-12 space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zen-charcoal pb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block mb-1">
                    Spatial Concept Preview
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl font-normal">
                    {selectedStyle} &bull; {selectedBudget}
                  </h2>
                </div>
                <div className="px-3 py-1 bg-zen-charcoal text-zen-sand text-[10px] font-mono uppercase tracking-widest border border-zen-border/20">
                  Base: {uploadedImage || "Curated Room"}
                </div>
              </div>

              {/* Render Visualization Box */}
              <div className="relative aspect-[16/9] bg-zen-charcoal/80 border border-zen-charcoal overflow-hidden flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-dark-grain opacity-30 pointer-events-none" />
                <div className="text-center space-y-4 max-w-lg z-10">
                  <span className="font-serif text-4xl md:text-6xl text-zen-sand block">
                    The {selectedStyle} Synthesis
                  </span>
                  <p className="text-xs text-zen-sand/80 font-light leading-relaxed">
                    Sculpted architectural layout featuring low-profile monolithic seating, recessed cove illumination, travertine flooring, and custom acoustic timber wall fluting.
                  </p>
                  <div className="inline-block px-3 py-1 bg-zen-black/80 border border-zen-accent/50 text-[10px] font-mono uppercase text-zen-accent tracking-widest">
                    CONCEPTUAL VISUALIZATION &bull; ZEN ARC SPATIAL AI
                  </div>
                </div>
              </div>

              {/* Disclaimer Notice */}
              <div className="text-xs text-zen-muted font-mono leading-relaxed border-t border-zen-charcoal pt-4">
                <strong>Important Notice:</strong> This AI concept is an exploratory spatial tool designed for ideation. Rohit Pathak and the Zen Arc team refine all physical architectural plans, structural tolerances, and custom furniture fabrication to perfection.
              </div>
            </div>

            {/* Curated Products Matched to Concept */}
            <div className="bg-zen-offwhite border border-zen-border p-8 md:p-12 space-y-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block mb-1">
                  Catalogue Integration
                </span>
                <h3 className="font-serif text-3xl font-normal">
                  Pieces Featured in this Concept
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {curatedPieces.map((p) => (
                  <div key={p.id} className="p-6 bg-zen-ivory border border-zen-border space-y-4">
                    <div className="aspect-[4/3] bg-zen-stone/40 flex items-center justify-center p-4">
                      <span className="font-serif text-3xl text-zen-charcoal">{p.name}</span>
                    </div>
                    <div>
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-serif text-xl">{p.name}</h4>
                        <span className="text-xs font-mono text-zen-black">
                          From ₹{p.basePrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="text-[11px] text-zen-taupe font-light mt-1">{p.tagline}</p>
                    </div>
                    <div className="pt-2 border-t border-zen-border flex justify-between items-center text-xs">
                      <Link href={`/furniture/${p.slug}`} className="text-zen-black hover:text-zen-accent uppercase tracking-wider font-medium">
                        View Specs &rarr;
                      </Link>
                      <a
                        href={getProductWhatsAppUrl(p.name, p.variations[0]?.seater, p.basePrice)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#25D366] hover:underline uppercase tracking-wider font-medium"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps: Physical Consultation or WhatsApp */}
            <div className="border border-zen-border bg-zen-stone/40 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-2 max-w-xl">
                <h3 className="font-serif text-2xl md:text-3xl font-normal">
                  Bring This Concept to Life with Rohit Pathak
                </h3>
                <p className="text-xs md:text-sm text-zen-taupe leading-relaxed font-light">
                  Schedule a physical site inspection or discuss the CAD plans directly with the atelier.
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  href={getWhatsAppUrl(`Hello Rohit, I generated a ${selectedStyle} space concept on the website and would like to review it together.`)}
                  isExternal
                  variant="whatsapp"
                  size="md"
                  icon={<MessageSquare size={16} />}
                >
                  WhatsApp Rohit Pathak
                </Button>
                <Button href="/consultation" variant="primary" size="md">
                  Book Consultation
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
