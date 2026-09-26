"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND, getWhatsAppUrl } from "@/lib/config/brand";
import { Menu, X, ArrowUpRight, MessageSquare } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-zen-ivory/90 backdrop-blur-md py-4 border-b border-zen-border/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
            : "bg-gradient-to-b from-zen-black/60 via-zen-black/20 to-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link href="/" className="group flex flex-col">
            <span
              className={`font-serif text-2xl md:text-3xl tracking-[0.18em] uppercase transition-colors duration-300 font-normal ${
                isScrolled ? "text-zen-black" : "text-zen-ivory"
              }`}
            >
              Zen Arch
            </span>
            <span
              className={`text-[9px] uppercase tracking-[0.28em] font-sans -mt-1 transition-colors duration-300 ${
                isScrolled ? "text-zen-muted" : "text-zen-ivory/70"
              }`}
            >
              Interior Solution
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-9 text-xs uppercase tracking-[0.2em] font-medium">
            {BRAND.navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative py-1 transition-colors duration-300 ${
                    isScrolled
                      ? isActive
                        ? "text-zen-accent font-semibold"
                        : "text-zen-charcoal/80 hover:text-zen-accent"
                      : isActive
                      ? "text-zen-ivory font-semibold"
                      : "text-zen-ivory/80 hover:text-zen-ivory"
                  }`}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[8px] tracking-wider rounded-full bg-zen-accent text-white uppercase font-sans">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-zen-accent"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Area (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/account"
              className={`px-3 py-2 text-xs tracking-[0.18em] uppercase font-medium transition-colors ${
                isScrolled
                  ? "text-zen-charcoal/80 hover:text-zen-accent"
                  : "text-zen-ivory/80 hover:text-zen-ivory"
              }`}
            >
              Account
            </Link>
            <Link
              href="/consultation"
              className={`px-5 py-2.5 text-xs tracking-[0.18em] uppercase font-medium transition-all duration-300 border ${
                isScrolled
                  ? "border-zen-black text-zen-black hover:bg-zen-black hover:text-zen-ivory"
                  : "border-zen-ivory text-zen-ivory hover:bg-zen-ivory hover:text-zen-black"
              }`}
            >
              Start Project
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center gap-3">
            <Link
              href="/account"
              className={`px-2 py-1.5 text-[10px] tracking-widest uppercase font-medium transition-colors ${
                isScrolled
                  ? "text-zen-charcoal"
                  : "text-zen-ivory"
              }`}
            >
              Account
            </Link>
            <Link
              href="/consultation"
              className={`px-3 py-1.5 text-[10px] tracking-widest uppercase font-medium border transition-colors ${
                isScrolled
                  ? "border-zen-black text-zen-black"
                  : "border-zen-ivory text-zen-ivory"
              }`}
            >
              Consult
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className={`p-2 transition-colors ${
                isScrolled ? "text-zen-black" : "text-zen-ivory"
              }`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-zen-black text-zen-ivory flex flex-col justify-between p-8 pt-28 lg:hidden overflow-y-auto"
          >
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zen-muted block mb-4">
                Navigation
              </span>
              <nav className="flex flex-col space-y-4">
                {BRAND.navigation.map((item, idx) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between font-serif text-3xl py-2 border-b border-zen-charcoal text-zen-ivory hover:text-zen-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="text-[10px] px-2 py-0.5 bg-zen-accent text-white uppercase rounded-full tracking-wider font-sans">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <ArrowUpRight size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Mobile Footer Area */}
            <div className="pt-8 border-t border-zen-charcoal space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-zen-muted block">
                  Studio Atelier & Inquiries
                </span>
                <p className="text-sm font-light text-zen-sand">{BRAND.founder}, {BRAND.title}</p>
                <p className="text-sm font-light text-zen-sand">{BRAND.email}</p>
                <p className="text-sm font-light text-zen-sand">{BRAND.phoneDisplay}</p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/consultation"
                  className="w-full text-center py-3.5 bg-zen-ivory text-zen-black uppercase tracking-[0.2em] text-xs font-medium hover:bg-zen-accent hover:text-white transition-colors"
                >
                  Start Guided Consultation
                </Link>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#25D366] text-white uppercase tracking-[0.18em] text-xs font-medium hover:bg-[#1EBE5D] transition-colors"
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp Atelier</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
