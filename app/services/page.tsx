"use client";

import React from "react";
import Link from "next/link";
import { BRAND, getWhatsAppUrl } from "@/lib/config/brand";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  MessageSquare,
  Compass,
  Layers,
  Sparkles,
  CheckCircle2,
  Hammer,
} from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      number: "01",
      title: "Interior Architecture & Spatial Design",
      subtitle: "Full-Scope Spatial Transformation",
      description:
        "We approach interiors through structural and architectural logic rather than superficial decoration. Reconfiguring floorplates, sculpting ceiling heights, optimizing acoustic circulation, and choreographing natural daylight across living environments.",
      deliverables: [
        "Architectural space planning & 2D demolition/construction drawings",
        "Reflected ceiling plans, daylight optimization & architectural lighting",
        "HVAC, electrical, and smart automation coordination",
        "Bespoke bathroom & kitchen architectural detailing",
      ],
    },
    {
      number: "02",
      title: "Bespoke Furniture Atelier",
      subtitle: "Custom Handcrafted Seating & Joinery",
      description:
        "Every residence requires signature pieces designed specifically for its dimensional scale. From our 38+ sofa silhouettes and 28+ sculptural Puffy poufs to custom teak dining tables and fluted walnut credenzas, all pieces are built in our Mumbai atelier.",
      deliverables: [
        "Custom dimensional sizing (Single, Two, Three Seater & Sectionals)",
        "Premium fabric curation (Bouclé, Italian leathers, linen blends)",
        "Custom metal finishes (Brushed champagne gold, antique bronze, powder-coated steel)",
        "Detailed shop drawings & 3D prototyping prior to fabrication",
      ],
    },
    {
      number: "03",
      title: "Turnkey Project Execution",
      subtitle: "White-Glove Construction Management",
      description:
        "Under the strict oversight of Rohit Pathak, we manage the entire lifecycle from preliminary masonry to the final installation of curated art. One accountable partner ensuring zero contractor friction.",
      deliverables: [
        "Dedicated site engineer & project architect supervision",
        "Transparent bill of quantities (BOQ) with fixed phase milestones",
        "Rigorous material testing (moisture content, tensile strength, coatings)",
        "Complete white-glove handover with warranty documentation",
      ],
    },
    {
      number: "04",
      title: "Spatial 3D & AI Design Studio",
      subtitle: "Photorealistic & Conceptual Intelligence",
      description:
        "Before a single wall is touched, we construct comprehensive digital twins of your space. Using real-time 3D rendering and Zen Arch AI spatial tools, clients explore daylighting, material textures, and furniture arrangements with total confidence.",
      deliverables: [
        "Interactive 3D spatial models with responsive lighting",
        "Photorealistic 4K architectural visual renders",
        "Zen Arch AI space transformation concepts",
        "Material sampling moodboards & physical tactile swatches",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-zen-ivory text-zen-black pt-32 pb-24 px-6 md:px-12 selection:bg-zen-accent selection:text-white">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Editorial Header */}
        <div className="space-y-6 max-w-3xl border-b border-zen-border pb-10">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-zen-accent" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono">
              Atelier Capabilities
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight uppercase">
            Architectural Services.
          </h1>
          <p className="text-base md:text-lg text-zen-charcoal/80 font-light leading-relaxed">
            From comprehensive residential architecture and corporate headquarters to bespoke handcrafted furniture fabrication. Led by Rohit Pathak.
          </p>
        </div>

        {/* Asymmetrical Service Presentation */}
        <div className="space-y-20">
          {services.map((service, index) => (
            <div
              key={service.number}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-t border-zen-border pt-12 items-start"
            >
              {/* Service Number & Quick Overview */}
              <div className="lg:col-span-4 space-y-4">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-zen-accent block">
                  Service {service.number}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-normal leading-tight">
                  {service.title}
                </h2>
                <span className="text-xs font-serif italic text-zen-taupe block">
                  {service.subtitle}
                </span>
              </div>

              {/* Service Details & Deliverables */}
              <div className="lg:col-span-8 space-y-8">
                <p className="text-sm md:text-base text-zen-charcoal/90 font-light leading-relaxed">
                  {service.description}
                </p>

                <div className="bg-zen-offwhite border border-zen-border p-6 md:p-8 space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-zen-muted font-mono block">
                    Core Deliverables
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zen-charcoal">
                    {service.deliverables.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 size={15} className="text-zen-accent shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The 4-Stage Architectural Process */}
        <div className="bg-zen-black text-zen-ivory p-8 md:p-14 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block">
              Execution Methodology
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-normal">
              How We Work with Clients
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border-t border-zen-charcoal pt-6 space-y-2">
              <span className="text-xs font-mono text-zen-sand block">PHASE 01</span>
              <h3 className="font-serif text-xl">Discovery &amp; Consultation</h3>
              <p className="text-xs text-zen-sand/70 font-light leading-relaxed">
                Site visit, lifestyle interview, zoning analysis, and preliminary spatial budget alignment.
              </p>
            </div>
            <div className="border-t border-zen-charcoal pt-6 space-y-2">
              <span className="text-xs font-mono text-zen-sand block">PHASE 02</span>
              <h3 className="font-serif text-xl">Spatial Blueprint &amp; 3D</h3>
              <p className="text-xs text-zen-sand/70 font-light leading-relaxed">
                Architectural schematics, 3D daylight studies, and tailored furniture selection.
              </p>
            </div>
            <div className="border-t border-zen-charcoal pt-6 space-y-2">
              <span className="text-xs font-mono text-zen-sand block">PHASE 03</span>
              <h3 className="font-serif text-xl">Fabrication &amp; Craft</h3>
              <p className="text-xs text-zen-sand/70 font-light leading-relaxed">
                Hardwood joinery, bespoke sofa fabrication in our atelier, and structural site works.
              </p>
            </div>
            <div className="border-t border-zen-charcoal pt-6 space-y-2">
              <span className="text-xs font-mono text-zen-sand block">PHASE 04</span>
              <h3 className="font-serif text-xl">White Glove Handover</h3>
              <p className="text-xs text-zen-sand/70 font-light leading-relaxed">
                Furniture staging, architectural lighting tuning, warranty registration, and handover.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Consultation CTA */}
        <div className="border border-zen-border bg-zen-stone/40 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-serif text-2xl md:text-3xl font-normal">
              Discuss Your Architectural Brief
            </h3>
            <p className="text-xs md:text-sm text-zen-taupe leading-relaxed font-light">
              Connect directly with Rohit Pathak for project onboarding or WhatsApp our Mumbai studio.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              href={getWhatsAppUrl("Hello Zen Arch, I would like to inquire about your architectural services.")}
              isExternal
              variant="whatsapp"
              size="md"
              icon={<MessageSquare size={16} />}
            >
              WhatsApp Studio
            </Button>
            <Button href="/consultation" variant="primary" size="md">
              Start Project Onboarding
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
