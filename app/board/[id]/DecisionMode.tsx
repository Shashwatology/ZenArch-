"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { X, Scale, AlertCircle, ArrowRight, Loader2, Check } from "lucide-react";
import Image from "next/image";

type Evidence = {
  statement: string;
  evidenceType: 'FACT' | 'USER_PREFERENCE' | 'INFERENCE' | 'UNKNOWN';
  source?: string;
};

type DecisionResult = {
  shortlistSummary: Array<{
    productId: string;
    productName: string;
    price: number | null;
    whatFits: Evidence[];
    tradeOffs: Evidence[];
    unknowns: Evidence[];
  }>;
  whatToConsider: Evidence[];
};

export function DecisionMode({ board, onClose }: { board: any, onClose: () => void }) {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [error, setError] = useState("");

  const toggleItem = (id: string) => {
    setSelectedItemIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    // Exclude rejected by default unless explicit? We will just pick non-rejected items for "select all"
    const eligible = board.items.filter((i: any) => i.status !== 'REJECTED').map((i: any) => i.id);
    setSelectedItemIds(eligible);
  };

  const handleCompare = async () => {
    if (selectedItemIds.length < 2) {
      setError("Please select at least 2 items to compare.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch('/api/experience/decision-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardId: board.id,
          itemIds: selectedItemIds,
          priorities: budget ? { budget } : undefined,
          question: question || undefined
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to analyze trade-offs.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const EvidenceItem = ({ item }: { item: Evidence }) => {
    let colorClass = "text-zen-charcoal";
    if (item.evidenceType === 'UNKNOWN') colorClass = "text-zen-taupe italic";
    if (item.evidenceType === 'INFERENCE') colorClass = "text-zen-black font-medium";

    return (
      <li className={`text-xs ${colorClass} flex items-start gap-2 mb-2`}>
        <span className="shrink-0 mt-0.5">•</span>
        <span>
          {item.statement}
          {item.source && <span className="block text-[9px] font-mono text-zen-taupe mt-0.5 uppercase tracking-wider">Source: {item.source}</span>}
        </span>
      </li>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-zen-offwhite flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-8 py-6 border-b border-zen-border bg-white shrink-0">
        <div>
          <h2 className="font-serif text-2xl flex items-center gap-3">
            <Scale className="text-zen-accent" /> Decision Mode
          </h2>
          <p className="text-xs text-zen-charcoal mt-1 uppercase tracking-widest font-mono">Verify Trade-Offs</p>
        </div>
        <button onClick={onClose} className="p-2 text-zen-taupe hover:text-zen-black border border-transparent hover:border-zen-border transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {!result ? (
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-sm font-mono uppercase tracking-widest">1. Select Shortlist</h3>
                <button onClick={selectAll} className="text-xs underline text-zen-charcoal">Select All Eligible</button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {board.items.map((item: any) => {
                  const isSelected = selectedItemIds.includes(item.id);
                  const isRejected = item.status === 'REJECTED';
                  
                  return (
                    <div 
                      key={item.id} 
                      onClick={() => toggleItem(item.id)}
                      className={`cursor-pointer border p-4 transition-all relative ${isSelected ? 'border-zen-black bg-white shadow-sm' : 'border-zen-border/50 opacity-70 hover:opacity-100'} ${isRejected && !isSelected ? 'grayscale opacity-40' : ''}`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-zen-black text-white p-1 rounded-full">
                          <Check size={12} />
                        </div>
                      )}
                      <div className="aspect-square relative bg-zen-stone/10 mb-4">
                        {item.product.images?.[0] && (
                          <Image src={item.product.images[0].url} alt={item.product.productName || "Product"} fill className="object-cover" />
                        )}
                      </div>
                      <p className="text-xs font-medium truncate">{item.product.name}</p>
                      {isRejected && <p className="text-[9px] text-red-500 uppercase mt-1">Previously Rejected</p>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 border-t border-zen-border pt-12">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-3">2. State Priorities (Optional)</label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-zen-charcoal mb-1">Budget Limit (₹)</label>
                    <input 
                      type="number"
                      value={budget}
                      onChange={e => setBudget(e.target.value)}
                      placeholder="e.g. 70000"
                      className="w-full border border-zen-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-zen-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zen-charcoal mb-1">Specific Question</label>
                    <textarea 
                      value={question}
                      onChange={e => setQuestion(e.target.value)}
                      placeholder="e.g. Which of these takes up the least space?"
                      className="w-full border border-zen-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-zen-black h-20"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-zen-stone/10 p-6 flex flex-col justify-center border border-zen-border text-center">
                <Scale className="mx-auto text-zen-taupe mb-4" size={32} />
                <p className="text-sm font-serif mb-6">Ready to compare trade-offs objectively.</p>
                
                {error && (
                  <div className="bg-red-50 text-red-700 text-xs p-3 border border-red-200 mb-4 flex items-center justify-center gap-2">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}
                
                <Button onClick={handleCompare} variant="primary" disabled={loading} className="w-full py-4 text-sm">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : "Run Decision Check"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-10 text-center">
              <h3 className="font-serif text-3xl mb-4">Trade-Off Analysis</h3>
              <button onClick={() => setResult(null)} className="text-xs text-zen-charcoal border-b border-zen-charcoal pb-0.5 hover:text-zen-black">
                Start Over / Change Selection
              </button>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
              {result.shortlistSummary.map((opt, i) => {
                const item = board.items.find((bi: any) => bi.product.id === opt.productId);
                return (
                  <div key={i} className="min-w-[320px] max-w-[400px] flex-1 border border-zen-border bg-white p-6 snap-center shrink-0 flex flex-col">
                    <div className="aspect-[4/3] relative bg-zen-stone/5 mb-6">
                      {item?.product.images?.[0] && (
                        <Image src={item.product.images[0].url} alt={opt.productName} fill className="object-cover" />
                      )}
                    </div>
                    
                    <h4 className="font-serif text-xl mb-1">{opt.productName}</h4>
                    <p className="text-sm text-zen-charcoal font-mono mb-6">
                      {opt.price ? `₹${opt.price.toLocaleString()}` : 'Price: CONFIRM'}
                    </p>

                    <div className="space-y-6 flex-1">
                      <div>
                        <h5 className="text-[10px] uppercase font-mono tracking-widest text-green-700 mb-3 border-b border-green-100 pb-2">What Fits</h5>
                        <ul className="pl-1">
                          {opt.whatFits.length > 0 ? opt.whatFits.map((f, j) => <EvidenceItem key={j} item={f} />) : <li className="text-xs text-zen-taupe italic">No specific alignments found.</li>}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-[10px] uppercase font-mono tracking-widest text-amber-700 mb-3 border-b border-amber-100 pb-2">Trade-Offs</h5>
                        <ul className="pl-1">
                          {opt.tradeOffs.length > 0 ? opt.tradeOffs.map((t, j) => <EvidenceItem key={j} item={t} />) : <li className="text-xs text-zen-taupe italic">No clear trade-offs identified.</li>}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-[10px] uppercase font-mono tracking-widest text-zen-taupe mb-3 border-b border-zen-border/50 pb-2">Unknowns</h5>
                        <ul className="pl-1">
                          {opt.unknowns.length > 0 ? opt.unknowns.map((u, j) => <EvidenceItem key={j} item={u} />) : <li className="text-xs text-zen-taupe italic">All requested data is available.</li>}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-zen-border">
                       <Button href={`/furniture/${item?.product.slug}`} variant="outline" className="w-full text-xs">
                         View Product Data
                       </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="max-w-3xl mx-auto mt-12 bg-zen-stone/10 p-8 border border-zen-border">
              <h4 className="font-serif text-xl mb-6 flex items-center gap-3">
                <AlertCircle className="text-zen-accent" size={20} /> What To Consider
              </h4>
              <div className="space-y-3">
                {result.whatToConsider.map((w, i) => (
                  <p key={i} className="text-sm text-zen-charcoal leading-relaxed flex items-start gap-3">
                     <ArrowRight size={14} className="mt-1 shrink-0 text-zen-taupe" />
                     {w.statement}
                  </p>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-zen-border/50 flex flex-wrap gap-4">
                 <Button href="/contact" variant="primary" size="sm">Ask ZEN ARCH via WhatsApp</Button>
                 <Button onClick={onClose} variant="outline" size="sm">Return to Board</Button>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
