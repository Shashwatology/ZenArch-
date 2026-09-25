"use client";

import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

export type MaterialPreset = "champagne-boucle" | "charcoal-velvet" | "cognac-leather";

interface HeroSpatialSceneProps {
  materialPreset?: MaterialPreset;
  interactive?: boolean;
}

const MATERIAL_CONFIGS = {
  "champagne-boucle": {
    upholsteryColor: "#FAF7F2",
    upholsteryRoughness: 0.85,
    upholsteryMetalness: 0.05,
    metalColor: "#C5A880", // Brushed Champagne Gold
    metalRoughness: 0.25,
    metalness: 0.9,
    baseColor: "#ECE6DC",
  },
  "charcoal-velvet": {
    upholsteryColor: "#22211F",
    upholsteryRoughness: 0.9,
    upholsteryMetalness: 0.1,
    metalColor: "#8A6848", // Brushed Bronze
    metalRoughness: 0.3,
    metalness: 0.85,
    baseColor: "#1A1918",
  },
  "cognac-leather": {
    upholsteryColor: "#7A4A28",
    upholsteryRoughness: 0.45,
    upholsteryMetalness: 0.15,
    metalColor: "#1F1E1D", // Architectural Matte Black
    metalRoughness: 0.4,
    metalness: 0.8,
    baseColor: "#DFD8CC",
  },
};

export function ZenArcArchitecturalChair({
  preset = "champagne-boucle",
}: {
  preset?: MaterialPreset;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const config = MATERIAL_CONFIGS[preset] || MATERIAL_CONFIGS["champagne-boucle"];

  // Gentle subtle idle breathe motion
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = -0.15 + Math.sin(t * 0.8) * 0.015;
  });

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>
      {/* =========================================================
          ARCHITECTURAL PEDESTAL (Grounded Gallery Plinth)
         ========================================================= */}
      {/* Lower tiered plinth */}
      <mesh position={[0, -0.68, 0]} receiveShadow>
        <cylinderGeometry args={[2.0, 2.05, 0.08, 64]} />
        <meshStandardMaterial
          color={config.baseColor}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Primary travertine disc platform */}
      <mesh position={[0, -0.62, 0]} receiveShadow>
        <cylinderGeometry args={[1.75, 1.75, 0.06, 64]} />
        <meshStandardMaterial
          color="#F5F1E9"
          roughness={0.7}
          metalness={0.08}
        />
      </mesh>

      {/* Brushed brass pedestal trim ring */}
      <mesh position={[0, -0.585, 0]}>
        <torusGeometry args={[1.75, 0.012, 16, 64]} />
        <meshStandardMaterial
          color={config.metalColor}
          roughness={config.metalRoughness}
          metalness={config.metalness}
        />
      </mesh>

      {/* =========================================================
          ZEN ARCH SIGNATURE LOUNGE CHAIR (Product Model)
         ========================================================= */}
      <group position={[0, -0.1, 0]}>
        {/* 1. SEAT CUSHION — Sculptural Organic Radius */}
        <mesh position={[0, -0.12, 0.05]} castShadow receiveShadow>
          <cylinderGeometry args={[0.78, 0.72, 0.28, 48]} />
          <meshStandardMaterial
            color={config.upholsteryColor}
            roughness={config.upholsteryRoughness}
            metalness={config.upholsteryMetalness}
          />
        </mesh>

        {/* 2. PLUSH UPPER TOP CUSHION */}
        <mesh position={[0, 0.05, 0.06]} castShadow receiveShadow scale={[1, 0.45, 1]}>
          <sphereGeometry args={[0.74, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial
            color={config.upholsteryColor}
            roughness={config.upholsteryRoughness}
            metalness={config.upholsteryMetalness}
          />
        </mesh>

        {/* 3. CURVED BARREL BACKREST — Plush Horseshoe Tub Design */}
        <group position={[0, 0.45, 0]}>
          {/* We rotate the horseshoe so the opening faces exactly +Z (front) */}
          <group rotation={[Math.PI / 2, 0, Math.PI * 0.875]}>
            {/* Thick plush backrest/armrest wrapper */}
            <mesh castShadow receiveShadow>
              <torusGeometry args={[0.75, 0.22, 32, 64, Math.PI * 1.25]} />
              <meshStandardMaterial
                color={config.upholsteryColor}
                roughness={config.upholsteryRoughness}
                metalness={config.upholsteryMetalness}
              />
            </mesh>
            
            {/* End Cap 1 */}
            <mesh position={[0.75, 0, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.22, 32, 32]} />
              <meshStandardMaterial
                color={config.upholsteryColor}
                roughness={config.upholsteryRoughness}
                metalness={config.upholsteryMetalness}
              />
            </mesh>

            {/* End Cap 2 */}
            <mesh position={[0.75 * Math.cos(Math.PI * 1.25), 0.75 * Math.sin(Math.PI * 1.25), 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.22, 32, 32]} />
              <meshStandardMaterial
                color={config.upholsteryColor}
                roughness={config.upholsteryRoughness}
                metalness={config.upholsteryMetalness}
              />
            </mesh>
          </group>
        </group>

        {/* 4. ARCHITECTURAL BRUSHED BRASS HARDWARE & CHASSIS */}
        {/* Rear architectural brass spine bar */}
        <mesh position={[0, 0.22, -0.88]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.72, 24]} />
          <meshStandardMaterial
            color={config.metalColor}
            roughness={config.metalRoughness}
            metalness={config.metalness}
          />
        </mesh>

        {/* Front Left Brass Leg */}
        <mesh position={[-0.52, -0.38, 0.48]} rotation={[0.1, 0, -0.08]} castShadow>
          <cylinderGeometry args={[0.024, 0.016, 0.46, 24]} />
          <meshStandardMaterial
            color={config.metalColor}
            roughness={config.metalRoughness}
            metalness={config.metalness}
          />
        </mesh>

        {/* Front Right Brass Leg */}
        <mesh position={[0.52, -0.38, 0.48]} rotation={[0.1, 0, 0.08]} castShadow>
          <cylinderGeometry args={[0.024, 0.016, 0.46, 24]} />
          <meshStandardMaterial
            color={config.metalColor}
            roughness={config.metalRoughness}
            metalness={config.metalness}
          />
        </mesh>

        {/* Rear Left Brass Leg */}
        <mesh position={[-0.46, -0.38, -0.48]} rotation={[-0.12, 0, -0.06]} castShadow>
          <cylinderGeometry args={[0.024, 0.016, 0.46, 24]} />
          <meshStandardMaterial
            color={config.metalColor}
            roughness={config.metalRoughness}
            metalness={config.metalness}
          />
        </mesh>

        {/* Rear Right Brass Leg */}
        <mesh position={[0.46, -0.38, -0.48]} rotation={[-0.12, 0, 0.06]} castShadow>
          <cylinderGeometry args={[0.024, 0.016, 0.46, 24]} />
          <meshStandardMaterial
            color={config.metalColor}
            roughness={config.metalRoughness}
            metalness={config.metalness}
          />
        </mesh>

        {/* Floating Under-frame Brass Crossbar */}
        <mesh position={[0, -0.28, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.85, 20]} />
          <meshStandardMaterial
            color={config.metalColor}
            roughness={config.metalRoughness}
            metalness={config.metalness}
          />
        </mesh>

        {/* 5. ACCENT BOLSTER CUSHION */}
        <mesh position={[0, 0.16, -0.04]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.62, 32]} />
          <meshStandardMaterial
            color={config.metalColor}
            roughness={0.65}
            metalness={0.15}
          />
        </mesh>
      </group>

      {/* Realistic contact shadow grounded on the platform */}
      <ContactShadows
        position={[0, -0.66, 0]}
        opacity={0.45}
        scale={4.2}
        blur={2.0}
        far={2.5}
        color="#0C0B0A"
      />
    </group>
  );
}

export function HeroSpatialScene({
  materialPreset = "champagne-boucle",
  interactive = true,
}: HeroSpatialSceneProps) {
  const { viewport } = useThree();
  
  // Responsive camera scaling based on viewport width
  const responsiveScale = viewport.width < 3 ? 0.75 : 1;
  const responsiveY = viewport.width < 3 ? -0.4 : -0.2;

  return (
    <group scale={responsiveScale} position={[0, responsiveY, 0]}>
      {/* Studio Architectural Golden-Hour Lighting */}
      <ambientLight intensity={0.4} color="#FAF7F2" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color="#FFF5E6"
      />
      <directionalLight
        position={[-4, 4, -4]}
        intensity={0.6}
        color="#D9CCBA"
      />
      
      {/* High-fidelity PBR Environment Reflections */}
      <Environment preset="city" />

      {/* Product Model */}
      <ZenArcArchitecturalChair preset={materialPreset} />

      {/* Intuitive 360-degree Orbit Inspection */}
      {interactive && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          dampingFactor={0.05}
          makeDefault
        />
      )}
    </group>
  );
}
