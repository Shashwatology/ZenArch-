"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { BRAND, getWhatsAppUrl, getProductWhatsAppUrl } from "@/lib/config/brand";
import { getProductBySlug, FurnitureProduct } from "@/lib/data/furniture";
import { Button } from "@/components/ui/Button";
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
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

function TransformSpaceContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams?.get("product");
  
  const [selectedProduct, setSelectedProduct] = useState<FurnitureProduct | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedStyle, setSelectedStyle] = useState<string>("Zen Minimalist");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (productSlug) {
      const p = getProductBySlug(productSlug);
      if (p) setSelectedProduct(p);
    }
  }, [productSlug]);

  const presets = [
    { id: "salon", name: "Empty Travertine Living Area", thumb: "/images/cinematic_hero.jpg" },
    { id: "penthouse", name: "Double-Height High Ceiling Penthouse", thumb: "/images/project-juhu.jpg" },
    { id: "workspace", name: "Executive Creative Office", thumb: "/images/project-monolith.jpg" },
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

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // In V1.4, we mock the network call to the vision API we built in V1.3.1
    // to preserve product identity and show the flow without actually spending real API credits 
    // unless the user specifically uploads an image (which we can't do easily via standard browser file upload yet in QA)
    
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedImageUrl(selectedProduct?.images[0] || "/images/project-juhu.jpg");
      setActiveStep(4);
    }, 2000);
  };

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
            Upload your living room photograph or architectural plan. Visualize authentic Zen Arch pieces directly in your environment.
          </p>
        </div>

        {/* Selected Product Context (if arrived from PDP) */}
        {selectedProduct && activeStep < 4 && (
          <div className="bg-zen-stone/20 border border-zen-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white border border-zen-border relative overflow-hidden flex-shrink-0">
                {selectedProduct.images[0] && (
                  <Image src={selectedProduct.images[0]} alt={selectedProduct.name} fill className="object-cover mix-blend-multiply" />
                )}
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-zen-accent font-mono block">Selected Product</span>
                <h3 className="font-serif text-lg">{selectedProduct.name}</h3>
                <span className="text-xs font-mono text-zen-taupe">{selectedProduct.dimensions || "Dimensions Available on Request"}</span>
              </div>
            </div>
            <Link href={`/furniture/${selectedProduct.slug}`} className="text-xs uppercase tracking-widest font-medium border border-zen-charcoal px-4 py-2 hover:bg-zen-charcoal hover:text-white transition-colors">
              Change Product
            </Link>
          </div>
        )}

        {/* Progress Bar */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono uppercase tracking-widest text-zen-muted border-b border-zen-border pb-4 overflow-x-auto">
          <span className={activeStep === 1 ? "text-zen-black font-semibold whitespace-nowrap" : "whitespace-nowrap"}>
            01. Space Photo
          </span>
          <span className="px-2">&rarr;</span>
          <span className={activeStep === 2 ? "text-zen-black font-semibold whitespace-nowrap" : "whitespace-nowrap"}>
            02. Aesthetic
          </span>
          <span className="px-2">&rarr;</span>
          <span className={activeStep === 3 ? "text-zen-black font-semibold whitespace-nowrap" : "whitespace-nowrap"}>
            03. Confirmation
          </span>
          <span className="px-2">&rarr;</span>
          <span className={activeStep === 4 ? "text-zen-black font-semibold whitespace-nowrap" : "whitespace-nowrap"}>
            04. AI Result
          </span>
        </div>

        {/* STEP 1: Upload or Preset */}
        {activeStep === 1 && (
          <div className="bg-zen-offwhite border border-zen-border p-8 md:p-12 space-y-8">
            <h2 className="font-serif text-3xl font-normal">
              Step 1 &mdash; Upload Your Existing Room
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div
                onClick={() => {
                  setUploadedImage("/images/project-monolith.jpg");
                  setActiveStep(2);
                }}
                className="border-2 border-dashed border-zen-border p-10 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:border-zen-black transition-colors bg-zen-ivory min-h-[300px]"
              >
                <Upload size={32} className="text-zen-accent" />
                <span className="text-xs uppercase tracking-widest font-medium text-zen-black">
                  Upload Room Photo / Blueprint
                </span>
                <span className="text-[11px] text-zen-taupe font-light">
                  PNG, JPG, or PDF up to 25MB
                </span>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-zen-muted block">
                  Or Explore with Atelier Presets:
                </span>
                {presets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setUploadedImage(p.thumb);
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
                      <div key={i} className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: color }} />
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
                Continue to Generation
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Confirm & Generate */}
        {activeStep === 3 && (
          <div className="bg-zen-offwhite border border-zen-border p-8 md:p-12 space-y-8">
            <h2 className="font-serif text-3xl font-normal">
              Step 3 &mdash; Initiate Spatial Synthesis
            </h2>
            
            <div className="bg-zen-ivory p-6 border border-zen-border space-y-4">
               <h3 className="text-xs font-mono uppercase tracking-widest text-zen-charcoal">Configuration Summary:</h3>
               <ul className="space-y-2 text-sm text-zen-charcoal/80">
                 <li><strong>Base Room:</strong> Uploaded Photo</li>
                 <li><strong>Aesthetic:</strong> {selectedStyle}</li>
                 <li><strong>Target Subject:</strong> {selectedProduct ? selectedProduct.name : "Curated Atelier Discovery"}</li>
               </ul>
            </div>

            <div className="flex justify-between pt-6 border-t border-zen-border">
              <button onClick={() => setActiveStep(2)} className="px-6 py-3 border border-zen-border text-xs uppercase tracking-widest hover:border-zen-black">
                Back
              </button>
              <Button onClick={handleGenerate} variant="primary" size="lg" icon={<Sparkles size={16} />} disabled={isGenerating}>
                {isGenerating ? "Synthesizing Architecture..." : "Generate Concept"}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Rendered Concept */}
        {activeStep === 4 && (
          <div className="space-y-12">
            <div className="bg-zen-black text-zen-ivory border border-zen-charcoal p-8 md:p-12 space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zen-charcoal pb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block mb-1">
                    Spatial Concept Preview
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl font-normal">
                    {selectedStyle} &bull; Synthesis
                  </h2>
                </div>
              </div>

              {/* Slider for Before / After */}
              <div className="relative bg-zen-charcoal/80 border border-zen-charcoal overflow-hidden aspect-[16/9] md:aspect-[21/9]">
                <ReactCompareSlider
                  itemOne={<ReactCompareSliderImage src={uploadedImage || "/images/project-juhu.jpg"} alt="Original Room" />}
                  itemTwo={<ReactCompareSliderImage src={generatedImageUrl || "/images/cinematic_hero.jpg"} alt="AI Generated Architecture" />}
                  className="w-full h-full"
                />
              </div>

              <div className="text-xs text-zen-muted font-mono leading-relaxed border-t border-zen-charcoal pt-4">
                <strong>Important Notice:</strong> This AI concept is an exploratory spatial tool designed for ideation. Product scales and lighting are conceptual estimates.
              </div>
            </div>

            {/* Matched Product Integration Block */}
            {selectedProduct && (
              <div className="bg-zen-offwhite border border-zen-border p-8 md:p-12 space-y-8">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block mb-1">
                    Catalogue Integration
                  </span>
                  <h3 className="font-serif text-3xl font-normal">
                    Product Used in this Concept
                  </h3>
                </div>

                <div className="flex flex-col md:flex-row gap-8 bg-zen-ivory border border-zen-border p-6">
                  <div className="w-full md:w-1/3 aspect-square bg-zen-stone/40 flex items-center justify-center p-4 relative overflow-hidden">
                    {selectedProduct.images[0] ? (
                       <Image src={selectedProduct.images[0]} alt={selectedProduct.name} fill className="object-contain p-4 mix-blend-multiply" />
                    ) : (
                       <span className="font-serif text-3xl text-zen-charcoal">{selectedProduct.name}</span>
                    )}
                  </div>
                  <div className="w-full md:w-2/3 space-y-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="font-serif text-3xl">{selectedProduct.name}</h4>
                      </div>
                      <p className="text-xs font-mono text-zen-taupe mb-4">{selectedProduct.collection} &bull; {selectedProduct.category}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono py-4 border-y border-zen-border">
                         <div>
                           <span className="text-zen-taupe block mb-1">Verified Pricing</span>
                           <span className="text-zen-black font-semibold text-sm">
                             {selectedProduct.priceStatus === 'VERIFIED' && selectedProduct.basePrice 
                               ? `₹${selectedProduct.basePrice.toLocaleString('en-IN')}` 
                               : 'Price On Request'}
                           </span>
                         </div>
                         <div>
                           <span className="text-zen-taupe block mb-1">Dimensions</span>
                           <span className="text-zen-black">{selectedProduct.dimensions || "Not Specified"}</span>
                         </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button href={`/furniture/${selectedProduct.slug}`} variant="outline" size="md" className="flex-1">
                        View Product Details
                      </Button>
                      <Button
                        href={getProductWhatsAppUrl(selectedProduct.name, selectedProduct.variants[0]?.name, selectedProduct.basePrice || undefined)}
                        isExternal
                        variant="whatsapp"
                        size="md"
                        icon={<MessageSquare size={16} />}
                        className="flex-1"
                      >
                        Inquire on WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* General CTA */}
            <div className="border border-zen-border bg-zen-stone/40 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-2 max-w-xl">
                <h3 className="font-serif text-2xl md:text-3xl font-normal">
                  Bring This Concept to Life
                </h3>
                <p className="text-xs md:text-sm text-zen-taupe leading-relaxed font-light">
                  Schedule a consultation with our Atelier to refine this generated spatial plan into actionable interior execution.
                </p>
              </div>
              <div className="flex gap-4">
                <Button href={`/consultation${selectedProduct ? `?product=${selectedProduct.slug}` : ''}`} variant="primary" size="md">
                  Request Official Quote
                </Button>
                <Button onClick={() => setActiveStep(1)} variant="outline" size="md" icon={<RefreshCw size={14}/>}>
                   Try Another Photo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TransformSpacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zen-ivory flex items-center justify-center font-mono text-xs uppercase tracking-widest">Loading Space Studio...</div>}>
      <TransformSpaceContent />
    </Suspense>
  );
}
