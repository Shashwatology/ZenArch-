"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { getPublicProductBySlug, searchPublicProducts } from "@/lib/actions/publicProducts";
import { Button } from "@/components/ui/Button";
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { getProductWhatsAppUrl } from "@/lib/config/brand";
import {
  Sparkles,
  Upload,
  ArrowRight,
  ArrowLeft,
  Check,
  RefreshCw,
  MessageSquare,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ScanSearch
} from "lucide-react";

function TransformSpaceContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams?.get("product");
  
  const [activeStep, setActiveStep] = useState<number>(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Room DNA State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [storagePath, setStoragePath] = useState<string | null>(null);

  // Product Selection State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  
  // Reality Check State
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [realityCheck, setRealityCheck] = useState<any>(null);
  const [visualizationId, setVisualizationId] = useState<string | null>(null);

  // Generation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (productSlug) {
      getPublicProductBySlug(productSlug).then(p => {
        if (p) setSelectedProduct(p);
      });
    }
  }, [productSlug]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const delay = setTimeout(() => {
        searchPublicProducts(searchQuery).then(res => setSearchResults(res));
      }, 300);
      return () => clearTimeout(delay);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const presets = [
    { id: "salon", name: "Empty Travertine Living Area", thumb: "/images/cinematic_hero.jpg" },
    { id: "penthouse", name: "Double-Height High Ceiling Penthouse", thumb: "/images/project-juhu.jpg" },
    { id: "workspace", name: "Executive Creative Office", thumb: "/images/project-monolith.jpg" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        alert("File size exceeds 25MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getBase64 = async (imageSrc: string) => {
    let base64Image = imageSrc;
    let mimeType = "image/jpeg";
    
    if (base64Image.startsWith("data:")) {
      const matches = base64Image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches) {
        mimeType = matches[1];
        base64Image = matches[2];
      }
    } else if (base64Image.startsWith("/")) {
      const res = await fetch(base64Image);
      const blob = await res.blob();
      mimeType = blob.type;
      base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          resolve(dataUrl.split(",")[1]);
        };
        reader.readAsDataURL(blob);
      });
    }
    return { base64Image, mimeType };
  };

  const handleAnalyzeRoom = async () => {
    if (!uploadedImage) return;
    setIsAnalyzing(true);
    try {
      const { base64Image, mimeType } = await getBase64(uploadedImage);
      const res = await fetch("/api/experience/room-dna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64Image, mimeType })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSessionData(data.session);
      setAnalysis(data.analysis);
      setStoragePath(data.storagePath);
      setActiveStep(2);
      
      // If we already have a product, trigger reality check automatically
      if (selectedProduct && data.session && data.storagePath) {
        // Automatically do it after state updates
        setTimeout(() => handleRealityCheck(selectedProduct, data.session.id, data.storagePath), 500);
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRealityCheck = async (product: any, sId = sessionData?.id, sPath = storagePath) => {
    if (!product || !sId || !sPath) return;
    setSelectedProduct(product);
    setIsChecking(true);
    try {
      const { base64Image, mimeType } = await getBase64(uploadedImage!);
      const res = await fetch("/api/experience/reality-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sId,
          productId: product.id,
          imageBase64: base64Image,
          mimeType,
          storagePath: sPath
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setRealityCheck(data.realityCheck);
      setVisualizationId(data.visualizationId);
      setActiveStep(3);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsChecking(false);
    }
  };

  const handleGenerate = async () => {
    if (!visualizationId || !uploadedImage) return;
    setIsGenerating(true);
    try {
      const { base64Image } = await getBase64(uploadedImage);
      const res = await fetch("/api/experience/generate-visualization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visualizationId,
          imageBase64: base64Image
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || data.errorMessage);

      setGeneratedImageUrl(data.imageUrl);
      setActiveStep(4);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const LevelIcon = ({ level }: { level: string }) => {
    if (level === "GOOD") return <CheckCircle2 size={16} className="text-green-500" />;
    if (level === "CAUTION") return <AlertTriangle size={16} className="text-yellow-500" />;
    return <XCircle size={16} className="text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-zen-ivory text-zen-black pt-32 pb-24 px-6 md:px-12 selection:bg-zen-accent selection:text-white">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="space-y-4 border-b border-zen-border pb-8">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-zen-accent" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono">
              Experience Lab
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight uppercase">
            Reality Check.
          </h1>
          <p className="text-xs md:text-sm text-zen-charcoal/80 font-light leading-relaxed max-w-xl">
            Upload your room photograph. Zen Arch AI assesses fit, scale, and style before you commit.
          </p>
        </div>

        {/* Progress */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-zen-muted border-b border-zen-border pb-4">
          <span className={activeStep === 1 ? "text-zen-black font-semibold" : ""}>01. Photo</span>
          <span>&rarr;</span>
          <span className={activeStep === 2 ? "text-zen-black font-semibold" : ""}>02. DNA & Product</span>
          <span>&rarr;</span>
          <span className={activeStep === 3 ? "text-zen-black font-semibold" : ""}>03. Reality Check</span>
          <span>&rarr;</span>
          <span className={activeStep === 4 ? "text-zen-black font-semibold" : ""}>04. Space</span>
        </div>

        {/* STEP 1: Upload */}
        {activeStep === 1 && (
          <div className="bg-zen-offwhite border border-zen-border p-8 md:p-12 space-y-8">
            <h2 className="font-serif text-3xl font-normal">Step 1 &mdash; Upload Your Room</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <label className="border-2 border-dashed border-zen-border p-10 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer hover:border-zen-black transition-colors bg-zen-ivory min-h-[300px]">
                <input type="file" accept="image/jpeg, image/png, image/webp, image/heic" className="hidden" onChange={handleFileUpload} />
                <Upload size={32} className="text-zen-accent" />
                <div>
                  <span className="text-xs uppercase tracking-widest font-medium text-zen-black block mb-1">Take Photo or Upload</span>
                  <span className="text-[11px] text-zen-taupe font-light">Show clear floor space. Private & secure.</span>
                </div>
              </label>

              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-zen-muted block">Or Use Atelier Examples:</span>
                  {presets.map((p) => (
                    <button key={p.id} onClick={() => setUploadedImage(p.thumb)} className="w-full p-4 border border-zen-border bg-zen-ivory hover:border-zen-black text-left flex justify-between items-center transition-colors text-xs uppercase tracking-wider font-medium">
                      <span>{p.name}</span>
                      <ArrowRight size={14} className="text-zen-accent" />
                    </button>
                  ))}
                </div>
                
                {uploadedImage && (
                  <Button onClick={handleAnalyzeRoom} variant="primary" className="w-full" disabled={isAnalyzing}>
                    {isAnalyzing ? "Extracting Room DNA..." : "Analyze Room"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Room DNA & Product Selection */}
        {activeStep === 2 && analysis && (
          <div className="space-y-8">
            {/* Room DNA Block */}
            <div className="bg-zen-stone/10 border border-zen-border p-6 md:p-10 space-y-8">
              <div className="flex items-center gap-2 mb-2">
                <ScanSearch size={20} className="text-zen-accent" />
                <h2 className="font-serif text-2xl uppercase">Room DNA</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zen-muted block mb-1">Type</span>
                  <p className="capitalize font-medium">{analysis.roomType}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-zen-muted block mb-1">Character</span>
                  <p className="capitalize font-medium">{analysis.visualCharacter}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-mono uppercase text-zen-muted block mb-1">Spatial Notes</span>
                  <p className="font-medium text-zen-charcoal/90">{analysis.spatialNotes}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zen-border/50">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zen-black font-semibold block mb-2 border-b border-zen-border pb-1">Observed</span>
                  <ul className="text-xs text-zen-charcoal/80 space-y-1 list-disc pl-4">
                    {analysis.observed.map((item: string, i: number) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-zen-black font-semibold block mb-2 border-b border-zen-border pb-1">Inferred</span>
                  <ul className="text-xs text-zen-charcoal/80 space-y-1 list-disc pl-4">
                    {analysis.inferred.map((item: string, i: number) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-zen-muted block mb-2 border-b border-zen-border pb-1">Unknown</span>
                  <ul className="text-xs text-zen-muted space-y-1 list-disc pl-4">
                    {analysis.unknown.map((item: string, i: number) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            {/* Product Selection */}
            <div className="bg-zen-offwhite border border-zen-border p-6 md:p-10 space-y-6">
              <h2 className="font-serif text-2xl uppercase mb-6">Choose Zen Arch Product</h2>
              
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search catalogue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-zen-border text-sm focus:outline-none focus:border-zen-black transition-colors"
                />
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zen-muted" />
              </div>

              {searchResults.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                  {searchResults.map(product => (
                    <button 
                      key={product.id}
                      onClick={() => handleRealityCheck(product)}
                      disabled={isChecking}
                      className="group border border-zen-border bg-white text-left overflow-hidden hover:border-zen-black transition-colors"
                    >
                      <div className="aspect-[4/3] bg-zen-stone/20 relative">
                        {product.images[0] && <Image src={product.images[0]} alt={product.name} fill className="object-contain mix-blend-multiply p-4" />}
                      </div>
                      <div className="p-4">
                        <h4 className="font-serif text-lg">{product.name}</h4>
                        <span className="text-[10px] font-mono uppercase text-zen-taupe">{product.collection}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {isChecking && <p className="text-xs font-mono uppercase text-zen-accent mt-4">Running Reality Check...</p>}
            </div>
          </div>
        )}

        {/* STEP 3: Reality Check */}
        {activeStep === 3 && realityCheck && selectedProduct && (
          <div className="space-y-8">
            <div className="bg-zen-ivory border border-zen-border p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-12">
                <div className="md:w-1/3 border-r border-zen-border pr-8">
                  <div className="aspect-square bg-zen-stone/20 relative mb-6">
                    {selectedProduct.images[0] && <Image src={selectedProduct.images[0]} alt={selectedProduct.name} fill className="object-contain mix-blend-multiply p-4" />}
                  </div>
                  <h3 className="font-serif text-3xl mb-1">{selectedProduct.name}</h3>
                  <span className="text-xs font-mono text-zen-taupe block mb-4">{selectedProduct.dimensions || 'Dimensions Unavailable'}</span>
                  
                  <div className="pt-6 border-t border-zen-border mt-auto">
                    <span className="text-[10px] uppercase font-mono text-zen-muted block mb-2">Confidence Level</span>
                    <span className="text-sm font-medium">
                      {realityCheck.assessmentConfidence >= 80 ? "HIGH" : realityCheck.assessmentConfidence >= 50 ? "MEDIUM" : "LOW"}
                    </span>
                  </div>
                </div>

                <div className="md:w-2/3 space-y-8">
                  <div>
                    <h2 className="font-serif text-4xl mb-8 uppercase">Zen Arch Reality Check</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* FIT */}
                    <div className="border border-zen-border p-5 bg-white">
                      <div className="flex items-center gap-3 mb-3 border-b border-zen-border/50 pb-3">
                        <LevelIcon level={realityCheck.fitLevel} />
                        <span className="text-sm font-mono uppercase font-semibold tracking-widest">Fit &mdash; {realityCheck.fitLevel}</span>
                      </div>
                      <p className="text-sm text-zen-charcoal leading-relaxed">{realityCheck.fitReason}</p>
                    </div>

                    {/* SCALE */}
                    <div className="border border-zen-border p-5 bg-white">
                      <div className="flex items-center gap-3 mb-3 border-b border-zen-border/50 pb-3">
                        <LevelIcon level={realityCheck.scaleLevel} />
                        <span className="text-sm font-mono uppercase font-semibold tracking-widest">Scale &mdash; {realityCheck.scaleLevel}</span>
                      </div>
                      <p className="text-sm text-zen-charcoal leading-relaxed">{realityCheck.scaleReason}</p>
                    </div>

                    {/* STYLE */}
                    <div className="border border-zen-border p-5 bg-white">
                      <div className="flex items-center gap-3 mb-3 border-b border-zen-border/50 pb-3">
                        <LevelIcon level={realityCheck.styleLevel} />
                        <span className="text-sm font-mono uppercase font-semibold tracking-widest">Style &mdash; {realityCheck.styleLevel}</span>
                      </div>
                      <p className="text-sm text-zen-charcoal leading-relaxed">{realityCheck.styleReason}</p>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-wrap gap-4">
                    <Button onClick={handleGenerate} variant="primary" size="lg" disabled={isGenerating} className="flex-1 min-w-[200px]">
                      {isGenerating ? "Visualizing..." : "Try In My Space"}
                    </Button>
                    <Button onClick={async () => {
                      if (!selectedProduct) return;
                      if (sessionData?.userId) {
                         const { addItemToBoard } = await import("@/lib/actions/boards");
                         // If we don't know the boardId, we could prompt for it, 
                         // but for UX let's just alert them to use PDP or create a board.
                         // Wait, in Reality Check, let's just save it to local for now if no board selector is built,
                         // or just redirect them to /furniture/[slug] to use the proper board selector.
                         alert("To save to a board, click View Product to open the Atelier.");
                      } else {
                         // Local anonymous board
                         const stored = localStorage.getItem('zen_arch_local_board');
                         const localBoard = stored ? JSON.parse(stored) : { name: "My Temporary Board", items: [], comments: [] };
                         localBoard.items.push({ id: Date.now().toString(), product: selectedProduct, quantity: 1, status: 'PENDING' });
                         localStorage.setItem('zen_arch_local_board', JSON.stringify(localBoard));
                         alert("Added to temporary design board! View it at /board/local");
                      }
                    }} variant="outline" size="lg" className="flex-1 min-w-[200px]">
                      Save to Board
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Rendered Concept */}
        {activeStep === 4 && generatedImageUrl && selectedProduct && (
          <div className="space-y-12">
            <div className="bg-zen-black text-zen-ivory border border-zen-charcoal p-8 md:p-12 space-y-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block mb-1">
                  Visualization Complete
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-normal">
                  {selectedProduct.name} &bull; In Your Space
                </h2>
              </div>

              <div className="relative bg-zen-charcoal/80 border border-zen-charcoal overflow-hidden aspect-[16/9] md:aspect-[21/9]">
                <ReactCompareSlider
                  itemOne={<ReactCompareSliderImage src={uploadedImage || ""} alt="Original Room" />}
                  itemTwo={<ReactCompareSliderImage src={generatedImageUrl} alt="AI Generated Architecture" />}
                  className="w-full h-full"
                />
              </div>
              <div className="text-xs text-zen-muted font-mono leading-relaxed border-t border-zen-charcoal pt-4">
                <strong>Important Notice:</strong> This AI concept is an exploratory spatial tool designed for ideation based on approximate visual constraints.
              </div>
            </div>

            <div className="border border-zen-border bg-zen-stone/40 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-2 max-w-xl">
                <h3 className="font-serif text-2xl md:text-3xl font-normal">
                  Bring This Piece Home
                </h3>
                <p className="text-xs md:text-sm text-zen-taupe leading-relaxed font-light">
                  Now that you've verified spatial compatibility, connect with our Atelier to refine your selection.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Button href={`/furniture/${selectedProduct.slug}`} variant="outline" size="md">
                  View Product
                </Button>
                <Button href={`/furniture/${selectedProduct.slug}?quote=true`} variant="primary" size="md">
                  Request Quote
                </Button>
                <Button href={getProductWhatsAppUrl(selectedProduct.name, undefined, selectedProduct.basePrice || undefined)} isExternal variant="whatsapp" size="md" icon={<MessageSquare size={16}/>}>
                  WhatsApp
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
    <Suspense fallback={<div className="min-h-screen bg-zen-ivory flex items-center justify-center font-mono text-xs uppercase tracking-widest">Loading Experience Lab...</div>}>
      <TransformSpaceContent />
    </Suspense>
  );
}
