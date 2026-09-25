"use client";

import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, MeshReflectorMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

export function HeroArchitectureScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const isMobile = viewport.width < 4;

  // Gentle cinematic camera breathing
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.05;
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.02;
  });

  return (
    <group ref={groupRef} position={[0, -0.8, 0]} scale={isMobile ? 0.7 : 1}>
      
      {/* 1. ARCHITECTURAL FLOOR (Dark Travertine / Stone) */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={1.5}
          roughness={0.8}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#151413"
          metalness={0.1}
          mirror={0.2}
        />
      </mesh>

      {/* 2. RECESSED WALL & COVE LIGHTING (Background Depth) */}
      <group position={[0, 0, -4]}>
        {/* Main Wall */}
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[12, 4, 0.5]} />
          <meshStandardMaterial color="#0C0B0A" roughness={0.9} />
        </mesh>
        
        {/* Fluted / Ribbed Timber Detail (Left) */}
        {Array.from({ length: 15 }).map((_, i) => (
          <mesh key={`flute-${i}`} position={[-4 + i * 0.15, 2, 0.3]}>
            <boxGeometry args={[0.08, 4, 0.05]} />
            <meshStandardMaterial color="#1a1816" roughness={0.7} />
          </mesh>
        ))}

        {/* Ambient Cove Light Strip */}
        <mesh position={[0, 4, 0.3]} rotation={[Math.PI/2, 0, 0]}>
          <planeGeometry args={[12, 0.2]} />
          <meshBasicMaterial color="#ffeedd" />
        </mesh>
        <pointLight position={[0, 3.8, 0.5]} intensity={1.5} color="#ffeedd" distance={6} decay={2} />
      </group>

      {/* 3. HERO FURNITURE: The Vegas Modular Sofa Concept */}
      <group position={[1, 0, 0]} rotation={[0, -0.2, 0]}>
        {/* Main Seating Base */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.4, 1.2]} />
          <meshStandardMaterial color="#2a2826" roughness={0.85} />
        </mesh>
        
        {/* Left Seat Cushion */}
        <mesh position={[-0.8, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.2, 1.1]} />
          <meshStandardMaterial color="#32302e" roughness={0.9} />
        </mesh>

        {/* Right Seat Cushion (Chaise) */}
        <mesh position={[0.8, 0.45, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.2, 1.5]} />
          <meshStandardMaterial color="#32302e" roughness={0.9} />
        </mesh>

        {/* Backrest */}
        <mesh position={[-0.4, 0.8, -0.45]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.6, 0.3]} />
          <meshStandardMaterial color="#32302e" roughness={0.9} />
        </mesh>

        {/* Architectural Metal Plinth/Legs */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <boxGeometry args={[2.8, 0.1, 0.8]} />
          <meshStandardMaterial color="#b39268" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* 4. SCULPTURAL STONE COFFEE TABLE */}
      <group position={[-1.2, 0, 1.2]} rotation={[0, 0.5, 0]}>
        {/* Plinth Base */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.3, 32]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
        {/* Travertine Slab Top */}
        <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.7, 0.7, 0.05, 32]} />
          <meshStandardMaterial color="#ece9e4" roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Small Decorative Bowl */}
        <mesh position={[0.2, 0.36, 0.1]} castShadow>
          <cylinderGeometry args={[0.1, 0.05, 0.05, 16]} />
          <meshStandardMaterial color="#000000" roughness={0.5} />
        </mesh>
      </group>

      {/* 5. LIGHTING & ATMOSPHERE */}
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[-5, 5, 2]} 
        intensity={0.8} 
        color="#ffeedd" 
        castShadow 
        shadow-mapSize={[1024, 1024]} 
      />
      <directionalLight 
        position={[5, 4, -2]} 
        intensity={0.3} 
        color="#b0c4de" 
      />
      <Environment preset="studio" />

      {/* Contact Shadows for realism */}
      <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={10} blur={2.5} far={2} color="#000" />
    </group>
  );
}
