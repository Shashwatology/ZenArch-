"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView, useReducedMotion } from "framer-motion";

// -----------------------------------------------------------------------------
// Consistent Cinematic Easing Curves
// -----------------------------------------------------------------------------
export const CINEMATIC_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]; // Custom cubic-bezier for smooth architectural entrances
export const SLOW_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

// -----------------------------------------------------------------------------
// Primitives
// -----------------------------------------------------------------------------

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
  width?: "fit-content" | "100%";
}

export function Reveal({
  children,
  delay = 0,
  duration = 1.2,
  direction = "up",
  distance = 30,
  className = "",
  width = "100%",
}: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const shouldReduceMotion = useReducedMotion();

  let y = 0;
  let x = 0;
  if (!shouldReduceMotion) {
    if (direction === "up") y = distance;
    if (direction === "down") y = -distance;
    if (direction === "left") x = distance;
    if (direction === "right") x = -distance;
  }

  return (
    <div ref={ref} style={{ width }} className={className}>
      <motion.div
        initial={{ opacity: 0, y, x }}
        animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y, x }}
        transition={{ duration, delay, ease: CINEMATIC_EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface MaskRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function MaskReveal({ children, delay = 0, className = "" }: MaskRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: shouldReduceMotion ? 0 : "110%" }}
        animate={isInView ? { y: "0%" } : { y: shouldReduceMotion ? 0 : "110%" }}
        transition={{ duration: 1.2, delay, ease: CINEMATIC_EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface ParallaxProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export function Parallax({ children, offset = 50, className = "" }: ParallaxProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const shouldReduceMotion = useReducedMotion();

  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: shouldReduceMotion ? 0 : y }}>
        {children}
      </motion.div>
    </div>
  );
}

export function ScrollTransform({ children, className = "", input = [0, 1], output = [0, 100] }: { children: React.ReactNode, className?: string, input?: number[], output?: number[] }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, input, output);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: shouldReduceMotion ? 0 : y }}>
        {children}
      </motion.div>
    </div>
  );
}

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  delay?: number;
  priority?: boolean;
}

export function ImageReveal({ src, alt, className = "", imageClassName = "", delay = 0, priority = false }: ImageRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ scale: shouldReduceMotion ? 1 : 1.1, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: shouldReduceMotion ? 1 : 1.1, opacity: 0 }}
        transition={{ duration: 1.8, delay, ease: CINEMATIC_EASE }}
        className="w-full h-full"
      >
        <img src={src} alt={alt} className={`w-full h-full object-cover ${imageClassName}`} loading={priority ? "eager" : "lazy"} />
      </motion.div>
      {/* Wipe effect */}
      {!shouldReduceMotion && (
        <motion.div
          initial={{ top: 0, bottom: 0 }}
          animate={isInView ? { top: "100%", bottom: 0 } : { top: 0, bottom: 0 }}
          transition={{ duration: 1.2, delay, ease: CINEMATIC_EASE }}
          className="absolute inset-x-0 bg-zen-black z-10"
        />
      )}
    </div>
  );
}

export function TextReveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return <Reveal delay={delay} className={className}>{children}</Reveal>;
}
