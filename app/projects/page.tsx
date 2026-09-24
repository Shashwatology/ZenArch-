"use client";

import React from "react";
import Link from "next/link";
import { PROJECTS_DATA } from "@/lib/data/projects";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, ArrowRight, Compass } from "lucide-react";

export default function ProjectsDirectory() {
  return (
    <div className="min-h-screen bg-zen-ivory text-zen-black pt-32 pb-24 px-6 md:px-12 selection:bg-zen-accent selection:text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Editorial Header */}
        <div className="space-y-6 max-w-3xl border-b border-zen-border pb-10">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-zen-accent" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono">
              Portfolio &bull; Built Architecture
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight uppercase">
            Selected Works.
          </h1>
          <p className="text-base md:text-lg text-zen-charcoal/80 font-light leading-relaxed">
            Residential sanctuaries, modern workspaces, and bespoke private pavilions directed by Rohit Pathak. Each project is an bespoke synthesis of spatial architecture and handcrafted furniture.
          </p>
        </div>

        {/* Editorial Asymmetric Case Study Cards */}
        <div className="space-y-16">
          {PROJECTS_DATA.map((project, idx) => (
            <div
              key={project.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border border-zen-border bg-zen-offwhite p-6 md:p-10 hover:border-zen-black transition-colors duration-300"
            >
              {/* Visual Presentation Area */}
              <div className={`lg:col-span-7 ${idx % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
                <div className="relative aspect-[16/10] bg-zen-charcoal overflow-hidden flex items-center justify-center p-8 text-zen-ivory">
                  <div className="absolute inset-0 bg-dark-grain opacity-30 pointer-events-none" />
                  <div className="text-center space-y-2 relative z-10">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-zen-sand font-mono block">
                      {project.category}
                    </span>
                    <h3 className="font-serif text-3xl md:text-5xl font-normal">
                      {project.title}
                    </h3>
                    <span className="text-xs text-zen-taupe block font-mono">
                      {project.location} &bull; {project.year}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 text-[9px] font-mono text-zen-taupe/70">
                    AREA: {project.area}
                  </div>
                  <div className="absolute bottom-4 right-4 text-[9px] font-mono text-zen-taupe/70">
                    ARCH: {project.leadArchitect}
                  </div>
                </div>
              </div>

              {/* Text & Narrative Content */}
              <div className={`lg:col-span-5 space-y-6 ${idx % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-zen-accent font-mono block">
                    Case Study 0{idx + 1}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-normal text-zen-black">
                    {project.title}
                  </h2>
                  <p className="text-sm font-serif italic text-zen-taupe">
                    &ldquo;{project.tagline}&rdquo;
                  </p>
                </div>

                <p className="text-xs md:text-sm text-zen-charcoal/80 font-light leading-relaxed">
                  {project.overview}
                </p>

                {/* Key Metrics Chips */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zen-border text-center">
                  {project.metrics.map((m, i) => (
                    <div key={i} className="p-2 bg-zen-stone/40">
                      <span className="text-[9px] uppercase tracking-wider text-zen-muted block font-mono">
                        {m.label}
                      </span>
                      <span className="text-xs font-semibold text-zen-black block mt-0.5">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="pt-2">
                  <Button
                    href={`/projects/${project.slug}`}
                    variant="primary"
                    size="sm"
                    icon={<ArrowRight size={14} />}
                  >
                    Explore Case Study
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Inquiries CTA */}
        <div className="bg-zen-black text-zen-ivory p-10 md:p-14 text-center space-y-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block">
            Commence Your Architecture Journey
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-normal max-w-2xl mx-auto leading-tight">
            Have a residential villa or corporate space in planning?
          </h2>
          <p className="text-xs md:text-sm text-zen-sand/80 font-light max-w-xl mx-auto leading-relaxed">
            Schedule an initial consultation to discuss site requirements, spatial layout, and custom furniture curation.
          </p>
          <div className="pt-2">
            <Button href="/consultation" variant="gold" size="lg">
              Start Project Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
