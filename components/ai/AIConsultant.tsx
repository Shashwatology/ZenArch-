// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, ArrowRight, Loader2, Maximize2, Minimize2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/config/brand";

export function AIConsultant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/ai/chat",
    onError: (e) => console.error(e)
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {/* Floating Entry Point */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 h-14 w-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
          >
            <MessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expandable Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed z-50 bg-[#0A0A0A] border border-white/10 shadow-2xl flex flex-col overflow-hidden
              ${isExpanded 
                ? "inset-0 md:inset-10 md:rounded-lg" 
                : "bottom-0 right-0 w-full h-[85vh] md:bottom-8 md:right-8 md:w-[450px] md:h-[650px] md:rounded-lg rounded-t-lg"
              }
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#111]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-zen-accent animate-pulse" />
                <div>
                  <h3 className="font-serif text-white tracking-wide">ZEN ARCH AI</h3>
                  <p className="text-[9px] uppercase tracking-widest text-white/40 font-mono">Your Furniture Consultant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)} 
                  className="p-2 text-white/60 hover:text-white hidden md:block transition-colors"
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 text-white/60 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 border border-white/10 flex items-center justify-center">
                    <MessageSquare size={20} className="text-white/20" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-serif text-xl text-white">How can we assist you?</p>
                    <p className="text-xs text-white/40 max-w-[250px] mx-auto font-light">
                      I can help you find verified pieces from our catalogue, compare designs, or arrange a consultation.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center pt-4 max-w-[300px]">
                    <button onClick={() => setInput("I need an executive chair under 25k")} className="px-3 py-1.5 border border-white/10 text-[10px] text-white/60 hover:text-white hover:border-white/40 transition-colors rounded-full">Executive Chairs</button>
                    <button onClick={() => setInput("Show me luxury leather sofas")} className="px-3 py-1.5 border border-white/10 text-[10px] text-white/60 hover:text-white hover:border-white/40 transition-colors rounded-full">Leather Sofas</button>
                    <button onClick={() => setInput("I need a quote for an office project")} className="px-3 py-1.5 border border-white/10 text-[10px] text-white/60 hover:text-white hover:border-white/40 transition-colors rounded-full">Request Quote</button>
                  </div>
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {m.role === 'assistant' && <span className="text-[9px] uppercase tracking-widest text-white/20 mb-1 ml-1 font-mono">ZEN ARCH AI</span>}
                    
                    {/* Text content */}
                    {m.content && (
                      <div className={`px-4 py-3 max-w-[85%] text-sm font-light leading-relaxed ${
                        m.role === 'user' 
                          ? 'bg-white text-black rounded-l-xl rounded-tr-xl' 
                          : 'bg-[#1A1A1A] text-white border border-white/5 rounded-r-xl rounded-tl-xl'
                      }`}>
                        {m.content}
                      </div>
                    )}

                    {/* Tool Invocations / Cards */}
                    {m.toolInvocations?.map((toolInvocation: any) => {
                      if (toolInvocation.toolName === 'showProductCard' && 'result' in toolInvocation) {
                        const product = toolInvocation.result.product;
                        if (!product) return null;
                        return (
                          <div key={toolInvocation.toolCallId} className="mt-3 w-full max-w-[300px] border border-white/10 bg-[#111] overflow-hidden group rounded-sm">
                            <div className="relative aspect-square bg-[#1A1A1A]">
                              {product.images?.[0] && (
                                <Image 
                                  src={product.images[0]} 
                                  alt={product.name} 
                                  fill 
                                  className="object-contain p-4 mix-blend-screen group-hover:scale-105 transition-transform duration-500"
                                />
                              )}
                            </div>
                            <div className="p-4 space-y-3">
                              <div>
                                <span className="text-[9px] uppercase tracking-widest text-zen-accent font-mono block mb-1">{product.collection}</span>
                                <h4 className="font-serif text-lg text-white">{product.name}</h4>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                                <span className="text-xs font-mono text-white/60">
                                  {product.priceStatus === 'VERIFIED' && product.basePrice ? `₹${product.basePrice.toLocaleString("en-IN")}` : 'Price on Request'}
                                </span>
                                <div className="flex items-center gap-3">
                                  <Link href={`/ai/transform-space?product=${product.slug}`} className="text-[9px] uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                                    Try in Space
                                  </Link>
                                  <Link href={`/furniture/${product.slug}`} className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-white hover:text-zen-accent transition-colors">
                                    View <ArrowRight size={10} />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      
                      if (toolInvocation.toolName === 'requestQuotation' && 'result' in toolInvocation) {
                        const intentUrl = toolInvocation.result.details.intentType === 'WHATSAPP' 
                          ? getWhatsAppUrl("Hello ZEN ARCH, I would like to arrange a consultation for a project.")
                          : "/consultation";
                        
                        return (
                          <div key={toolInvocation.toolCallId} className="mt-3 p-4 border border-zen-accent/30 bg-zen-accent/5 rounded-sm w-full max-w-[85%]">
                            <h4 className="font-serif text-white mb-2">Connect with our Atelier</h4>
                            <p className="text-xs text-white/60 font-light mb-4">Our design consultants are ready to assist with your specific requirements.</p>
                            <Link 
                              href={intentUrl}
                              className="inline-flex items-center justify-center gap-2 w-full bg-white text-black py-2.5 text-xs font-medium uppercase tracking-widest hover:bg-zen-accent hover:text-white transition-colors"
                            >
                              {toolInvocation.result.details.intentType === 'WHATSAPP' ? 'Open WhatsApp' : 'Book Consultation'}
                            </Link>
                          </div>
                        )
                      }
                      
                      // Loading states for tools
                      if (!('result' in toolInvocation)) {
                        const loadingText = toolInvocation.toolName === 'searchProducts' || toolInvocation.toolName === 'filterProducts' 
                          ? "Searching the collection..."
                          : toolInvocation.toolName === 'getProductDetails'
                          ? "Retrieving specifications..."
                          : "Processing...";
                          
                        return (
                          <div key={toolInvocation.toolCallId} className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 font-mono">
                            <Loader2 size={12} className="animate-spin" /> {loadingText}
                          </div>
                        );
                      }
                      
                      return null;
                    })}
                  </div>
                ))
              )}
              
              {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 font-mono ml-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
              {error && (
                <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-200 text-xs rounded-sm">
                  Service temporarily unavailable. Please try again or contact us via WhatsApp.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#111] border-t border-white/10">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about a product, style, or budget..."
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input?.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white text-black disabled:opacity-50 disabled:bg-white/20 disabled:text-white/40 transition-colors"
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
