"use client";

import React, { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";

interface SpatialCanvasProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  camera?: {
    position: [number, number, number];
    fov?: number;
  };
}

export function SpatialCanvas({
  children,
  fallback,
  className = "w-full h-full",
  camera = { position: [0, 1.2, 4.5], fov: 42 },
}: SpatialCanvasProps) {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setMounted(true);
    // WebGL availability check
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!mounted || !hasWebGL) {
    return <div className={`relative ${className}`}>{fallback || null}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={camera}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
