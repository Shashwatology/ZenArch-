"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BRAND, getWhatsAppUrl, getProductWhatsAppUrl } from "@/lib/config/brand";
import { FURNITURE_CATALOGUE, FurnitureProduct } from "@/lib/data/furniture";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  Send,
  MessageSquare,
  ArrowRight,
  ArrowUpRight,
  Bot,
  User,
  Box,
  Compass,
  Layers,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  recommendedProducts?: FurnitureProduct[];
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Welcome to the Zen Arc Spatial Studio. I am your architectural design assistant. I can guide you through our 2026 furniture collections, dimensional specifications, fabric requirements, and spatial styling for your home or project. How may I assist your space today?",
      recommendedProducts: [
        FURNITURE_CATALOGUE[0], // Vegas
        FURNITURE_CATALOGUE[4], // Arcus
        FURNITURE_CATALOGUE[15], // Albert Puffy
      ],
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsTyping(true);

    // Context-aware assistant logic grounded in verified catalogue data
    setTimeout(() => {
      let replyText = "";
      let matchedProducts: FurnitureProduct[] = [];

      const query = text.toLowerCase();

      if (query.includes("vegas")) {
        const prod = FURNITURE_CATALOGUE.find((p) => p.slug === "vegas");
        if (prod) matchedProducts.push(prod);
        replyText =
          "The Vegas Sofa is an architectural centerpiece in our 2026 catalogue (Page 2). Available in Single Seater (3.50ft, ₹56,000), Two Seater (5.25ft, ₹74,000), and Three Seater (7.25ft, ₹92,000). Fabric allowance is included at ₹500/meter.";
      } else if (query.includes("arcus") || query.includes("curve") || query.includes("curved")) {
        const arcus = FURNITURE_CATALOGUE.find((p) => p.slug === "arcus");
        const curve = FURNITURE_CATALOGUE.find((p) => p.slug === "curve");
        if (arcus) matchedProducts.push(arcus);
        if (curve) matchedProducts.push(curve);
        replyText =
          "For organic curved profiles, we recommend the Arcus and the Curve sofas. Arcus begins at ₹33,500 (3.25ft) with enveloping cocoon arms and bolster pillows. The Curve sofa (5.50ft to 7.00ft) creates a dramatic sweeping arc ideal for central salons.";
      } else if (query.includes("puffy") || query.includes("pouf") || query.includes("ottoman") || query.includes("10,000") || query.includes("under")) {
        const albert = FURNITURE_CATALOGUE.find((p) => p.slug === "albert");
        const eva = FURNITURE_CATALOGUE.find((p) => p.slug === "eva");
        const gold = FURNITURE_CATALOGUE.find((p) => p.slug === "gold");
        if (albert) matchedProducts.push(albert);
        if (eva) matchedProducts.push(eva);
        if (gold) matchedProducts.push(gold);
        replyText =
          "Our 2026 Puffy Collection features sculptural accent poufs crafted with textured bouclé and architectural metal trims. The Albert (₹6,500), Eva (₹5,500), and Gold (₹6,250) provide tactile seating accents with zero visual clutter.";
      } else if (query.includes("consultation") || query.includes("process") || query.includes("price") || query.includes("rohit")) {
        replyText =
          "Every architectural commission is directed by Rohit Pathak. We begin with our 8-step guided consultation to align floor area, investment budget, and custom joinery requirements. Would you like to launch the onboarding brief or connect directly on WhatsApp?";
      } else {
        matchedProducts = [
          FURNITURE_CATALOGUE[1], // Flame
          FURNITURE_CATALOGUE[3], // Montana
          FURNITURE_CATALOGUE[16], // Libra
        ];
        replyText =
          "Based on your inquiry, I have curated these architectural selections from our catalogue. Each piece is constructed in our Mumbai atelier with custom dimensions and material specifications available upon request.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text: replyText,
          recommendedProducts: matchedProducts,
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  const samplePrompts = [
    "What are the specifications and prices for the Vegas sofa?",
    "Recommend curved organic seating for a living room",
    "Show me sculptural accent poufs from the Puffy collection",
    "How does the Zen Arc guided consultation work?",
  ];

  return (
    <div className="min-h-screen bg-zen-ivory text-zen-black pt-32 pb-20 px-6 md:px-12 selection:bg-zen-accent selection:text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zen-border pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zen-black text-zen-ivory text-[10px] uppercase tracking-[0.25em] font-mono">
              <Sparkles size={12} className="text-zen-accent" />
              <span>Zen Arc Spatial Intelligence</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal uppercase tracking-tight">
              Design Assistant.
            </h1>
            <p className="text-xs md:text-sm text-zen-charcoal/80 font-light max-w-xl">
              Grounded in the verified 2026 catalogues, dimensions, and architectural planning principles directed by Rohit Pathak.
            </p>
          </div>

          <div className="flex gap-3">
            <Button href="/ai/transform-space" variant="outline" size="sm">
              Transform Your Space
            </Button>
            <Button
              href={getWhatsAppUrl("Hello Rohit, I was using the Zen Arc AI design assistant and would like to continue our discussion.")}
              isExternal
              variant="whatsapp"
              size="sm"
              icon={<MessageSquare size={14} />}
            >
              WhatsApp Handoff
            </Button>
          </div>
        </div>

        {/* Chat Console Area */}
        <div className="bg-zen-offwhite border border-zen-border flex flex-col h-[650px] shadow-sm">
          {/* Message Stream */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-zen-black text-zen-ivory flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} className="text-zen-accent" />
                  </div>
                )}

                <div
                  className={`max-w-2xl space-y-4 ${
                    msg.sender === "user"
                      ? "bg-zen-black text-zen-ivory p-4 md:p-5 border border-zen-black"
                      : "bg-zen-ivory text-zen-black p-5 md:p-6 border border-zen-border"
                  }`}
                >
                  <p className="text-xs md:text-sm leading-relaxed font-light whitespace-pre-line">
                    {msg.text}
                  </p>

                  {/* Recommendation Cards */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="pt-2 space-y-2 border-t border-zen-border/70">
                      <span className="text-[10px] uppercase tracking-widest text-zen-muted font-mono block">
                        Curated Catalogue Matches:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {msg.recommendedProducts.map((p) => (
                          <div
                            key={p.id}
                            className="p-3 bg-zen-offwhite border border-zen-border text-xs flex flex-col justify-between gap-2"
                          >
                            <div>
                              <div className="flex justify-between items-baseline">
                                <strong className="font-serif text-base text-zen-black font-normal">
                                  {p.name}
                                </strong>
                                <span className="text-[10px] font-mono text-zen-accent">
                                  From ₹{p.basePrice.toLocaleString("en-IN")}
                                </span>
                              </div>
                              <p className="text-[11px] text-zen-taupe font-light line-clamp-1">
                                {p.tagline}
                              </p>
                            </div>
                            <div className="flex justify-between items-center pt-1 border-t border-zen-border/50">
                              <span className="text-[9px] font-mono text-zen-muted">
                                Pg {p.sourceCatalogue.page}
                              </span>
                              <div className="flex gap-2">
                                <Link
                                  href={`/furniture/${p.slug}`}
                                  className="text-[10px] uppercase tracking-wider text-zen-black hover:text-zen-accent flex items-center gap-0.5"
                                >
                                  <span>Details</span>
                                  <ArrowUpRight size={12} />
                                </Link>
                                <a
                                  href={getProductWhatsAppUrl(p.name, p.variations[0]?.seater, p.basePrice)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] uppercase tracking-wider text-[#25D366] hover:underline"
                                >
                                  WhatsApp
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-zen-accent text-white flex items-center justify-center shrink-0 mt-1">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-zen-black text-zen-ivory flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-zen-accent" />
                </div>
                <div className="bg-zen-ivory border border-zen-border p-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-zen-accent animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-zen-accent animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-zen-accent animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preset Prompts */}
          <div className="px-6 py-2 bg-zen-stone/30 border-t border-zen-border flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-zen-muted font-mono uppercase text-[9px] shrink-0">Inquire:</span>
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 bg-zen-ivory border border-zen-border hover:border-zen-black text-zen-charcoal whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 bg-zen-ivory border-t border-zen-border flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Ask about dimensions, sofa models, fabrics, or planning..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 p-3 bg-zen-offwhite border border-zen-border text-xs focus:outline-none focus:border-zen-black font-light"
            />
            <button
              type="submit"
              className="p-3 bg-zen-black text-zen-ivory hover:bg-zen-accent transition-colors"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Footnote Disclaimers */}
        <div className="text-[11px] text-zen-taupe font-mono flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 border-t border-zen-border">
          <span>{BRAND.disclaimers.aiNotice}</span>
          <Link href="/consultation" className="text-zen-accent hover:underline uppercase tracking-wider">
            Switch to 8-Step Project Consultation &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
