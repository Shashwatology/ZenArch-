"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function ThresholdScene() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Continuously move through the threshold
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Simulate moving forward slowly and infinitely
    groupRef.current.position.z = (t * 0.5) % 4;
  });

  return (
    <group>
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 2, -5]} intensity={1} color="#ffeedd" />
      
      {/* Fog to hide the end of the tunnel */}
      <fog attach="fog" args={["#0a0a0a", 2, 8]} />
      
      <group ref={groupRef}>
        {/* Create a repeating corridor */}
        {Array.from({ length: 10 }).map((_, i) => (
          <group key={i} position={[0, 0, -i * 4]}>
            {/* Floor */}
            <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[4, 4]} />
              <meshStandardMaterial color="#111" roughness={0.9} />
            </mesh>
            
            {/* Ceiling */}
            <mesh position={[0, 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[4, 4]} />
              <meshStandardMaterial color="#050505" roughness={1} />
            </mesh>

            {/* Left Wall */}
            <mesh position={[-2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[4, 4]} />
              <meshStandardMaterial color="#151413" roughness={0.8} />
            </mesh>

            {/* Right Wall */}
            <mesh position={[2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <planeGeometry args={[4, 4]} />
              <meshStandardMaterial color="#151413" roughness={0.8} />
            </mesh>

            {/* Subtle Architectural Ribs/Arches */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[4.2, 4.2, 0.1]} />
              <meshStandardMaterial color="#000" roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
