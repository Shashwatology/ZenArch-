"use client";

import React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { getProjectBySlug, PROJECTS_DATA } from "@/lib/data/projects";
import { BRAND, getWhatsAppUrl } from "@/lib/config/brand";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  MessageSquare,
} from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const otherProjects = PROJECTS_DATA.filter((p) => p.slug !== project.slug);

  return (
    <div className="min-h-screen bg-zen-ivory text-zen-black pt-28 pb-24 px-6 md:px-12 selection:bg-zen-accent selection:text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between border-b border-zen-border pb-6 text-xs font-mono uppercase tracking-widest text-zen-muted">
          <Link
            href="/projects"
            className="flex items-center gap-2 hover:text-zen-black transition-colors"
          >
            <ArrowLeft size={14} />
            <span>All Projects</span>
          </Link>
          <div className="flex items-center gap-2">
            <span>{project.category}</span>
            <span>/</span>
            <span className="text-zen-black font-semibold">{project.title}</span>
          </div>
        </div>

        {/* Hero Banner Section */}
        <div className="space-y-6 max-w-4xl">
          <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block">
            Architectural Case Study
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight uppercase">
            {project.title}
          </h1>
          <p className="font-serif italic text-xl md:text-2xl text-zen-taupe">
            &ldquo;{project.tagline}&rdquo;
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 bg-zen-offwhite border border-zen-border">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zen-muted font-mono block">Location</span>
            <span className="text-sm font-medium text-zen-black">{project.location}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zen-muted font-mono block">Timeline</span>
            <span className="text-sm font-medium text-zen-black">{project.year}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zen-muted font-mono block">Floor Area</span>
            <span className="text-sm font-medium text-zen-black">{project.area}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zen-muted font-mono block">Lead Direction</span>
            <span className="text-sm font-medium text-zen-black">{project.leadArchitect}</span>
          </div>
        </div>

        {/* Case Study Architectural Hero Visual */}
        <div className="relative aspect-[21/9] bg-zen-charcoal overflow-hidden flex items-center justify-center p-8 text-zen-ivory">
          <div className="absolute inset-0 bg-dark-grain opacity-40 pointer-events-none" />
          <div className="text-center space-y-4 max-w-xl relative z-10">
            <span className="font-serif text-5xl md:text-7xl block text-zen-sand">
              {project.title}
            </span>
            <span className="text-xs text-zen-taupe font-mono uppercase tracking-widest block">
              Architectural Concept &bull; Material Study
            </span>
          </div>
        </div>

        {/* Narrative & Design Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-4">
            <h2 className="font-serif text-3xl font-normal uppercase tracking-wide">
              The Design Story
            </h2>
            <p className="text-xs text-zen-taupe leading-relaxed font-light">
              Every architectural commission begins with an exhaustive examination of light orientation, human circulation, and material honesty.
            </p>
          </div>
          <div className="lg:col-span-8 space-y-6 text-sm md:text-base font-light text-zen-charcoal/90 leading-relaxed">
            <p>{project.overview}</p>
            <p>{project.designStory}</p>
          </div>
        </div>

        {/* Materiality & Custom Furniture Palette */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zen-border">
          {/* Materials */}
          <div className="p-8 bg-zen-offwhite border border-zen-border space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-zen-accent font-mono block">
              01 &mdash; Material Honesty
            </span>
            <h3 className="font-serif text-2xl font-normal">Architectural Palette</h3>
            <ul className="space-y-2 text-xs text-zen-charcoal/90">
              {project.materials.map((mat, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zen-accent" />
                  <span>{mat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Furniture Featured */}
          <div className="p-8 bg-zen-offwhite border border-zen-border space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-zen-accent font-mono block">
              02 &mdash; Integrated Ateliers
            </span>
            <h3 className="font-serif text-2xl font-normal">Bespoke Furniture Built</h3>
            <ul className="space-y-2 text-xs text-zen-charcoal/90">
              {project.furnitureFeatured.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zen-black" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom CTA Block */}
        <div className="border border-zen-border bg-zen-stone/40 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-serif text-2xl md:text-3xl font-normal">
              Commission a Project with Rohit Pathak
            </h3>
            <p className="text-xs md:text-sm text-zen-taupe leading-relaxed font-light">
              Discuss your architectural blueprints or interior requirements directly with our principal design team.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              href={getWhatsAppUrl(`Hello Zen Arc, I would like to discuss a project inspired by ${project.title}.`)}
              isExternal
              variant="whatsapp"
              size="md"
              icon={<MessageSquare size={16} />}
            >
              WhatsApp Studio
            </Button>
            <Button href="/consultation" variant="primary" size="md">
              Start Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
