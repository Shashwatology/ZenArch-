"use client";

import React, { useState } from "react";
import { BRAND, getWhatsAppUrl } from "@/lib/config/brand";
import { Button } from "@/components/ui/Button";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  CheckCircle2,
  Send,
} from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Architectural Project Consultation",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-zen-ivory text-zen-black pt-32 pb-24 px-6 md:px-12 selection:bg-zen-accent selection:text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-6 max-w-3xl border-b border-zen-border pb-10">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-zen-accent" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono">
              Inquiries &bull; Atelier Coordinates
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight uppercase">
            Connect with Zen Arch.
          </h1>
          <p className="text-base md:text-lg text-zen-charcoal/80 font-light leading-relaxed">
            Direct access to Rohit Pathak and the architectural studio. For new residential commissions, commercial projects, and custom furniture orders.
          </p>
        </div>

        {/* 2-Column Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Official Coordinates */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-zen-black text-zen-ivory space-y-6 border border-zen-charcoal">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block">
                Official Coordinates
              </span>
              <h2 className="font-serif text-3xl font-normal">
                Zen Arch Interior Solution
              </h2>

              <div className="space-y-4 text-xs font-mono text-zen-sand pt-4 border-t border-zen-charcoal">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-zen-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="text-zen-muted block uppercase text-[10px]">Studio Location</span>
                    <span>{BRAND.address.city}, {BRAND.address.state}, {BRAND.address.country}</span>
                    <span className="block text-zen-muted text-[10px] mt-0.5">{BRAND.address.region}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-zen-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="text-zen-muted block uppercase text-[10px]">Direct Email</span>
                    <a href={`mailto:${BRAND.email}`} className="hover:text-zen-ivory transition-colors">
                      {BRAND.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-zen-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="text-zen-muted block uppercase text-[10px]">Telephone Line</span>
                    <a href={`tel:${BRAND.phone}`} className="hover:text-zen-ivory transition-colors">
                      {BRAND.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-zen-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="text-zen-muted block uppercase text-[10px]">Operating Hours</span>
                    <span>Monday &ndash; Saturday &bull; 10:00 AM &ndash; 7:30 PM IST</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zen-charcoal space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-zen-muted font-mono block">
                  Creative Direction
                </span>
                <span className="text-sm font-medium text-zen-ivory block">
                  {BRAND.founder} &mdash; {BRAND.title}
                </span>
              </div>
            </div>

            {/* Instant WhatsApp Card */}
            <div className="p-6 bg-zen-ivory border border-zen-border space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 border border-zen-charcoal text-zen-black rounded-full">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zen-black">Immediate WhatsApp Concierge</h3>
                  <span className="text-xs text-zen-taupe">Direct chat with Rohit Pathak</span>
                </div>
              </div>
              <p className="text-xs text-zen-charcoal leading-relaxed font-light">
                Share photos, floor plans, or furniture inquiries for an instant response.
              </p>
              <a
                href={getWhatsAppUrl("Hello Rohit Pathak, I would like to enquire directly regarding a project.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 border border-zen-charcoal bg-transparent text-zen-black text-xs uppercase tracking-widest font-medium hover:border-zen-accent hover:text-zen-accent transition-colors flex items-center justify-center gap-2"
              >
                <span>Chat on WhatsApp (+91 93729 21244)</span>
              </a>
            </div>
          </div>

          {/* Right Column: Inquiries Form */}
          <div className="lg:col-span-7 bg-zen-offwhite border border-zen-border p-8 md:p-12 space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-zen-accent font-mono block">
                Transmission
              </span>
              <h2 className="font-serif text-3xl font-normal">
                Send an Architectural Inquiry
              </h2>
            </div>

            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-zen-muted font-mono">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Singhania"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full p-3.5 bg-zen-ivory border border-zen-border text-xs focus:outline-none focus:border-zen-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-zen-muted font-mono">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full p-3.5 bg-zen-ivory border border-zen-border text-xs focus:outline-none focus:border-zen-black"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zen-muted font-mono">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full p-3.5 bg-zen-ivory border border-zen-border text-xs focus:outline-none focus:border-zen-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zen-muted font-mono">Inquiry Type</label>
                  <select
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full p-3.5 bg-zen-ivory border border-zen-border text-xs focus:outline-none focus:border-zen-black"
                  >
                    <option>Architectural Project Consultation</option>
                    <option>Custom Furniture Fabrication Order</option>
                    <option>Commercial / Corporate Workspace Brief</option>
                    <option>Catalogue & Material Specifications</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zen-muted font-mono">Message / Project Details *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Please describe your space, timeline, and location..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full p-3.5 bg-zen-ivory border border-zen-border text-xs focus:outline-none focus:border-zen-black"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" icon={<Send size={14} />}>
                  Dispatch Inquiry
                </Button>
              </form>
            ) : (
              <div className="p-8 bg-zen-ivory border border-zen-border text-center space-y-4">
                <CheckCircle2 size={32} className="mx-auto text-zen-accent" />
                <h3 className="font-serif text-2xl font-normal">Inquiry Received</h3>
                <p className="text-xs text-zen-taupe leading-relaxed font-light max-w-sm mx-auto">
                  Thank you, {formState.name}. Rohit Pathak and the atelier team have received your transmission and will respond within 24 hours.
                </p>
                <div className="pt-2">
                  <Button
                    href={getWhatsAppUrl(`Hello Rohit, I have submitted an inquiry on the website regarding ${formState.subject}.`)}
                    isExternal
                    variant="whatsapp"
                    size="sm"
                  >
                    Connect on WhatsApp for Immediate Priority
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
