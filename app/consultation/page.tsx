"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BRAND, getWhatsAppUrl } from "@/lib/config/brand";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  MessageSquare,
  Home,
  Building,
  Briefcase,
  Store,
  Calendar,
  IndianRupee,
  MapPin,
  Ruler,
  User,
  Mail,
  Phone,
  Sparkles,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { getPublicProductBySlug } from "@/lib/actions/publicProducts";

function ConsultationForm() {
  const searchParams = useSearchParams();
  const productSlug = searchParams?.get("product");

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 8;

  // Form State
  const [formData, setFormData] = useState({
    propertyType: "Residential Villa",
    areaSqFt: "2,000 - 5,000 sq.ft",
    location: "Mumbai",
    requirements: ["Full Interior Architecture", "Custom Furniture Selection"] as string[],
    budget: "₹30L - ₹60L",
    timeline: "1 - 3 Months",
    floorPlanNote: "Will share via WhatsApp",
    name: "",
    email: "",
    phone: "",
    preferredMode: "WhatsApp",
  });

  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (productSlug) {
      getPublicProductBySlug(productSlug).then(p => {
        if (p) {
          setFormData((prev) => ({
            ...prev,
            requirements: [
              ...prev.requirements.filter((r) => r !== "Custom Furniture Selection"),
              `Quote for: ${p.name}`,
            ],
          }));
        }
      });
    }
  }, [productSlug]);

  const toggleRequirement = (req: string) => {
    if (formData.requirements.includes(req)) {
      setFormData({
        ...formData,
        requirements: formData.requirements.filter((r) => r !== req),
      });
    } else {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, req],
      });
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setSubmitted(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getSummaryWhatsAppText = () => {
    return encodeURIComponent(
      `Hello Rohit Pathak & Zen Arch Team, I have completed the Project Consultation brief:\n\n` +
        `• Name: ${formData.name || "Prospective Client"}\n` +
        `• Phone: ${formData.phone}\n` +
        `• Email: ${formData.email}\n` +
        `• Property: ${formData.propertyType}\n` +
        `• Area: ${formData.areaSqFt}\n` +
        `• Location: ${formData.location}\n` +
        `• Scope: ${formData.requirements.join(", ")}\n` +
        `• Budget: ${formData.budget}\n` +
        `• Timeline: ${formData.timeline}\n` +
        `• Preferred Contact: ${formData.preferredMode}\n\n` +
        `Please let me know when we can schedule an initial review.`
    );
  };

  return (
    <div className="min-h-screen bg-zen-ivory text-zen-black pt-32 pb-24 px-6 md:px-12 selection:bg-zen-accent selection:text-white">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-zen-border pb-8">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-zen-accent" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono">
              Direct Project Onboarding
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight uppercase">
            Guided Spatial Consultation.
          </h1>
          <p className="text-xs md:text-sm text-zen-charcoal/80 font-light leading-relaxed max-w-xl">
            Complete our 8-step project brief. Rohit Pathak and the principal architectural team review every inquiry within 24 hours.
          </p>
        </div>

        {!submitted ? (
          <div className="bg-zen-offwhite border border-zen-border p-8 md:p-12 space-y-10">
            {/* Step Indicator Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest text-zen-muted">
                <span>Step 0{currentStep} of 0{totalSteps}</span>
                <span>
                  {currentStep === 1 && "Property Type"}
                  {currentStep === 2 && "Floor Area"}
                  {currentStep === 3 && "Location"}
                  {currentStep === 4 && "Scope & Requirements"}
                  {currentStep === 5 && "Investment Tier"}
                  {currentStep === 6 && "Anticipated Timeline"}
                  {currentStep === 7 && "Blueprints / Imagery"}
                  {currentStep === 8 && "Client Coordinates"}
                </span>
              </div>
              <div className="w-full h-1 bg-zen-stone overflow-hidden">
                <div
                  className="h-full bg-zen-accent transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Contents */}
            <div className="min-h-[260px] flex flex-col justify-center">
              {/* STEP 1: Property Type */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl md:text-3xl font-normal">
                    What type of space are you planning to transform?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Residential Villa / Bunglow", icon: <Home size={18} /> },
                      { label: "Luxury Penthouse / Apartment", icon: <Building size={18} /> },
                      { label: "Corporate Office / Studio", icon: <Briefcase size={18} /> },
                      { label: "Boutique Retail / Hospitality", icon: <Store size={18} /> },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => setFormData({ ...formData, propertyType: item.label })}
                        className={`p-5 text-left border flex items-center gap-4 transition-all duration-200 ${
                          formData.propertyType === item.label
                            ? "bg-zen-black text-zen-ivory border-zen-black"
                            : "bg-zen-ivory border-zen-border hover:border-zen-charcoal text-zen-charcoal"
                        }`}
                      >
                        <div className="p-2 border border-current rounded-full">{item.icon}</div>
                        <span className="text-xs uppercase tracking-wider font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Floor Area */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl md:text-3xl font-normal">
                    What is the approximate carpet or built-up area?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      "Under 1,500 sq.ft",
                      "1,500 - 3,500 sq.ft",
                      "3,500 - 7,000 sq.ft",
                      "7,000+ sq.ft (Estate / Multi-Floor)",
                    ].map((area) => (
                      <button
                        key={area}
                        onClick={() => setFormData({ ...formData, areaSqFt: area })}
                        className={`p-5 text-left border transition-all duration-200 ${
                          formData.areaSqFt === area
                            ? "bg-zen-black text-zen-ivory border-zen-black"
                            : "bg-zen-ivory border-zen-border hover:border-zen-charcoal text-zen-charcoal"
                        }`}
                      >
                        <span className="text-xs uppercase tracking-wider font-medium">{area}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Location */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl md:text-3xl font-normal">
                    Where is the project located?
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      "Mumbai",
                      "Alibaug",
                      "Pune",
                      "Goa",
                      "Delhi NCR",
                      "Bangalore",
                      "Dubai / International",
                      "Other City",
                    ].map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setFormData({ ...formData, location: loc })}
                        className={`p-4 text-center border transition-all duration-200 ${
                          formData.location === loc
                            ? "bg-zen-black text-zen-ivory border-zen-black"
                            : "bg-zen-ivory border-zen-border hover:border-zen-charcoal text-zen-charcoal"
                        }`}
                      >
                        <span className="text-xs uppercase tracking-wider font-medium">{loc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Requirements */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl md:text-3xl font-normal">
                    Select all scopes required for your project:
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      "Full Interior Architecture",
                      "Custom Furniture Selection (Sofas/Puffy)",
                      "Turnkey Project Management",
                      "3D Spatial Visualization & Lighting",
                    ].map((req) => {
                      const isSelected = formData.requirements.includes(req);
                      return (
                        <button
                          key={req}
                          onClick={() => toggleRequirement(req)}
                          className={`p-5 text-left border flex items-center justify-between transition-all duration-200 ${
                            isSelected
                              ? "bg-zen-black text-zen-ivory border-zen-black"
                              : "bg-zen-ivory border-zen-border hover:border-zen-charcoal text-zen-charcoal"
                          }`}
                        >
                          <span className="text-xs uppercase tracking-wider font-medium">{req}</span>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected ? "bg-zen-accent border-zen-accent text-white" : "border-zen-border"
                            }`}
                          >
                            {isSelected && <Check size={12} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: Budget */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl md:text-3xl font-normal">
                    What is your allocated investment tier?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { tier: "₹15L - ₹30L", desc: "Curated Interior & Signature Furniture" },
                      { tier: "₹30L - ₹60L", desc: "Comprehensive Architectural Transformation" },
                      { tier: "₹60L - ₹1.2Cr", desc: "Luxury Residence / Multi-Room Atelier" },
                      { tier: "₹1.2Cr+", desc: "Flagship Architectural Estate" },
                    ].map((item) => (
                      <button
                        key={item.tier}
                        onClick={() => setFormData({ ...formData, budget: item.tier })}
                        className={`p-5 text-left border transition-all duration-200 ${
                          formData.budget === item.tier
                            ? "bg-zen-black text-zen-ivory border-zen-black"
                            : "bg-zen-ivory border-zen-border hover:border-zen-charcoal text-zen-charcoal"
                        }`}
                      >
                        <span className="text-xs uppercase tracking-wider font-medium block">{item.tier}</span>
                        <span className="text-[11px] opacity-75 font-light block mt-1">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: Timeline */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl md:text-3xl font-normal">
                    When are you looking to commence?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      "Immediate (< 1 Month)",
                      "1 - 3 Months",
                      "3 - 6 Months",
                      "Conceptual Planning Phase",
                    ].map((time) => (
                      <button
                        key={time}
                        onClick={() => setFormData({ ...formData, timeline: time })}
                        className={`p-5 text-left border transition-all duration-200 ${
                          formData.timeline === time
                            ? "bg-zen-black text-zen-ivory border-zen-black"
                            : "bg-zen-ivory border-zen-border hover:border-zen-charcoal text-zen-charcoal"
                        }`}
                      >
                        <span className="text-xs uppercase tracking-wider font-medium">{time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: Blueprint / Imagery */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl md:text-3xl font-normal">
                    Do you have floor plans or reference photos?
                  </h2>
                  <div className="border-2 border-dashed border-zen-border p-8 text-center space-y-3 bg-zen-ivory">
                    <Upload size={28} className="mx-auto text-zen-accent" />
                    <p className="text-xs font-medium uppercase tracking-wider text-zen-black">
                      Floor Plans &bull; Photos &bull; CAD Files
                    </p>
                    <p className="text-[11px] text-zen-taupe font-light">
                      You may also send photos directly via WhatsApp to Rohit Pathak after submitting.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    {["I have drawings ready to send", "Drawings in progress", "Site visit required first"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setFormData({ ...formData, floorPlanNote: opt })}
                        className={`flex-1 p-3 text-center text-xs border ${
                          formData.floorPlanNote === opt
                            ? "bg-zen-black text-zen-ivory border-zen-black"
                            : "bg-zen-ivory border-zen-border"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 8: Contact Coordinates */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl md:text-3xl font-normal">
                    Where should Rohit Pathak and the atelier send your review?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-zen-muted font-mono">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikram Singhania"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3.5 bg-zen-ivory border border-zen-border text-xs focus:outline-none focus:border-zen-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-zen-muted font-mono">Phone / WhatsApp Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-3.5 bg-zen-ivory border border-zen-border text-xs focus:outline-none focus:border-zen-black"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-zen-muted font-mono">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3.5 bg-zen-ivory border border-zen-border text-xs focus:outline-none focus:border-zen-black"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-zen-border">
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-zen-border text-xs uppercase tracking-widest hover:border-zen-black transition-colors"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              <Button onClick={nextStep} variant="primary" size="md">
                {currentStep === totalSteps ? "Complete & Review Brief" : "Next Step"}
              </Button>
            </div>
          </div>
        ) : (
          /* Submission Confirmation & Direct WhatsApp Handoff */
          <div className="bg-zen-black text-zen-ivory border border-zen-charcoal p-8 md:p-14 space-y-8 text-center">
            <div className="w-16 h-16 rounded-full bg-zen-accent/20 text-zen-accent flex items-center justify-center mx-auto">
              <Check size={32} />
            </div>

            <div className="space-y-3 max-w-xl mx-auto">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block">
                Brief Assembled
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-normal">
                Thank You, {formData.name || "Client"}.
              </h2>
              <p className="text-xs md:text-sm text-zen-sand/80 font-light leading-relaxed">
                Your consultation brief for a <strong>{formData.propertyType}</strong> in <strong>{formData.location}</strong> ({formData.budget}) has been recorded.
              </p>
            </div>

            {/* Brief Summary Box */}
            <div className="bg-zen-charcoal/60 border border-zen-charcoal p-6 max-w-lg mx-auto text-left text-xs space-y-2 text-zen-sand font-mono">
              <div className="flex justify-between border-b border-zen-charcoal pb-2">
                <span className="text-zen-muted">Location:</span>
                <span>{formData.location} ({formData.areaSqFt})</span>
              </div>
              <div className="flex justify-between border-b border-zen-charcoal pb-2">
                <span className="text-zen-muted">Budget Tier:</span>
                <span>{formData.budget}</span>
              </div>
              <div className="flex justify-between border-b border-zen-charcoal pb-2">
                <span className="text-zen-muted">Timeline:</span>
                <span>{formData.timeline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zen-muted">Scope:</span>
                <span className="text-right max-w-[200px]">{formData.requirements.join(", ")}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=${getSummaryWhatsAppText()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#25D366] text-white uppercase tracking-[0.2em] text-xs font-medium hover:bg-[#1EBE5D] transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} />
                <span>Send Brief to Rohit Pathak via WhatsApp</span>
              </a>
              <Button href="/" variant="outline-light" size="md">
                Return to Homepage
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConsultationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zen-ivory flex items-center justify-center font-mono text-xs uppercase tracking-widest">Loading...</div>}>
      <ConsultationForm />
    </Suspense>
  );
}
