"use client";

import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls, Environment, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export type MaterialPreset = "emerald-velvet" | "terracotta" | "royal-blue" | "mustard-gold";
export type ModelType = "vegas-sofa" | "flame-sofa" | "arcus-sofa" | "gold-ottoman";

interface HeroSpatialSceneProps {
  materialPreset?: MaterialPreset;
  modelType?: ModelType;
  interactive?: boolean;
}

const MATERIAL_CONFIGS = {
  "emerald-velvet": {
    upholsteryColor: "#005C45", // Rich Emerald
    upholsteryRoughness: 0.7,
    upholsteryMetalness: 0.15,
    metalColor: "#D4AF37", // Polished Gold
    metalRoughness: 0.15,
    metalness: 1.0,
    baseColor: "#111",
  },
  "terracotta": {
    upholsteryColor: "#B54D35", // Terracotta Rust
    upholsteryRoughness: 0.8,
    upholsteryMetalness: 0.1,
    metalColor: "#E5E4E2", // Platinum/Silver
    metalRoughness: 0.2,
    metalness: 0.9,
    baseColor: "#111",
  },
  "royal-blue": {
    upholsteryColor: "#113B69", // Royal Blue
    upholsteryRoughness: 0.75,
    upholsteryMetalness: 0.2,
    metalColor: "#B87333", // Copper
    metalRoughness: 0.2,
    metalness: 1.0,
    baseColor: "#111",
  },
  "mustard-gold": {
    upholsteryColor: "#D6A330", // Mustard/Gold
    upholsteryRoughness: 0.65,
    upholsteryMetalness: 0.25,
    metalColor: "#222", // Matte Black Metal
    metalRoughness: 0.6,
    metalness: 0.7,
    baseColor: "#111",
  },
};

// Procedural Models Built with Premium Organic Primitives
function VegasSofa({ config }: { config: any }) {
  return (
    <group position={[0, -0.1, 0]}>
      {/* Plush Base Cushion */}
      <RoundedBox args={[1.7, 0.25, 0.75]} radius={0.08} smoothness={8} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={config.upholsteryColor} roughness={config.upholsteryRoughness} metalness={config.upholsteryMetalness} />
      </RoundedBox>
      
      {/* Ergonomic Slanted Backrest */}
      <RoundedBox args={[1.7, 0.55, 0.25]} radius={0.1} smoothness={8} position={[0, 0.35, -0.25]} rotation={[-0.1, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={config.upholsteryColor} roughness={config.upholsteryRoughness} metalness={config.upholsteryMetalness} />
      </RoundedBox>
      
      {/* Soft Overstuffed Armrests */}
      <RoundedBox args={[0.25, 0.45, 0.75]} radius={0.1} smoothness={8} position={[-0.75, 0.25, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={config.upholsteryColor} roughness={config.upholsteryRoughness} metalness={config.upholsteryMetalness} />
      </RoundedBox>
      <RoundedBox args={[0.25, 0.45, 0.75]} radius={0.1} smoothness={8} position={[0.75, 0.25, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={config.upholsteryColor} roughness={config.upholsteryRoughness} metalness={config.upholsteryMetalness} />
      </RoundedBox>
      
      {/* Decorative Throw Pillows */}
      <RoundedBox args={[0.3, 0.3, 0.1]} radius={0.05} smoothness={4} position={[-0.55, 0.25, -0.1]} rotation={[0.1, 0.3, 0.2]} castShadow receiveShadow>
        <meshStandardMaterial color={config.metalColor} roughness={0.7} metalness={0.1} />
      </RoundedBox>
      <RoundedBox args={[0.3, 0.3, 0.1]} radius={0.05} smoothness={4} position={[0.55, 0.25, -0.1]} rotation={[0.1, -0.4, -0.1]} castShadow receiveShadow>
        <meshStandardMaterial color={config.metalColor} roughness={0.7} metalness={0.1} />
      </RoundedBox>

      {/* Architectural Angled Legs */}
      {[-0.75, 0.75].map((x) =>
        [-0.25, 0.25].map((z) => (
          <mesh key={`leg-${x}-${z}`} position={[x, -0.18, z]} rotation={[0, 0, x > 0 ? 0.1 : -0.1]} castShadow>
            <cylinderGeometry args={[0.025, 0.015, 0.25, 32]} />
            <meshStandardMaterial color={config.metalColor} roughness={config.metalRoughness} metalness={config.metalness} />
          </mesh>
        ))
      )}
    </group>
  );
}

function FlameSofa({ config }: { config: any }) {
  // Create channel tufting array
  const tufts = Array.from({ length: 9 }).map((_, i) => -0.6 + i * 0.15);
  
  return (
    <group position={[0, -0.1, 0]}>
      {/* Deep Lounge Base */}
      <RoundedBox args={[1.8, 0.28, 0.85]} radius={0.06} smoothness={8} position={[0, 0.05, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={config.upholsteryColor} roughness={config.upholsteryRoughness} metalness={config.upholsteryMetalness} />
      </RoundedBox>
      
      {/* Channel Quilted Backrest built with individual vertical bolsters */}
      <group position={[0, 0.4, -0.28]} rotation={[-0.05, 0, 0]}>
        {tufts.map((x, i) => (
          <RoundedBox key={`tuft-${i}`} args={[0.14, 0.55, 0.25]} radius={0.06} smoothness={8} position={[x, 0, 0]} castShadow receiveShadow>
            <meshStandardMaterial color={config.upholsteryColor} roughness={config.upholsteryRoughness} metalness={config.upholsteryMetalness} />
          </RoundedBox>
        ))}
      </group>
      
      {/* Wrap-around Channel Armrests */}
      <group position={[-0.8, 0.35, 0.1]}>
        <RoundedBox args={[0.2, 0.4, 0.7]} radius={0.08} smoothness={8} position={[0, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={config.upholsteryColor} roughness={config.upholsteryRoughness} metalness={config.upholsteryMetalness} />
        </RoundedBox>
      </group>
      <group position={[0.8, 0.35, 0.1]}>
        <RoundedBox args={[0.2, 0.4, 0.7]} radius={0.08} smoothness={8} position={[0, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={config.upholsteryColor} roughness={config.upholsteryRoughness} metalness={config.upholsteryMetalness} />
        </RoundedBox>
      </group>

      {/* Dramatic Dual Column Legs */}
      {[-0.6, 0.6].map((x) =>
        [-0.2, 0.2].map((z) => (
          <mesh key={`leg-${x}-${z}`} position={[x, -0.15, z]} castShadow>
            <cylinderGeometry args={[0.045, 0.035, 0.25, 32]} />
            <meshStandardMaterial color={config.metalColor} roughness={config.metalRoughness} metalness={config.metalness} />
          </mesh>
        ))
      )}
      
      {/* Floating Under-frame Brass Crossbar */}
      <mesh position={[0, -0.12, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 1.4, 32]} />
        <meshStandardMaterial color={config.metalColor} roughness={config.metalRoughness} metalness={config.metalness} />
      </mesh>
    </group>
  );
}

function ArcusSofa({ config }: { config: any }) {
  return (
    <group position={[0, -0.1, 0]}>
      {/* Plush Sculptural Seat — Using a flattened sphere/torus hybrid shape */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow scale={[1, 0.2, 0.7]}>
        <sphereGeometry args={[1.1, 64, 32]} />
        <meshStandardMaterial color={config.upholsteryColor} roughness={config.upholsteryRoughness} metalness={config.upholsteryMetalness} />
      </mesh>
      
      {/* Continuous Sweeping Backrest (Horseshoe shape) */}
      <group position={[0, 0.35, -0.1]}>
        <group rotation={[Math.PI / 2, 0, Math.PI]}>
          {/* Thick plush backrest/armrest wrapper */}
          <mesh castShadow receiveShadow>
            <torusGeometry args={[0.9, 0.28, 64, 128, Math.PI]} />
            <meshStandardMaterial color={config.upholsteryColor} roughness={config.upholsteryRoughness} metalness={config.upholsteryMetalness} />
          </mesh>
          
          {/* Seamless End Caps */}
          <mesh position={[0.9, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.28, 64, 64]} />
            <meshStandardMaterial color={config.upholsteryColor} roughness={config.upholsteryRoughness} metalness={config.upholsteryMetalness} />
          </mesh>
          <mesh position={[-0.9, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.28, 64, 64]} />
            <meshStandardMaterial color={config.upholsteryColor} roughness={config.upholsteryRoughness} metalness={config.upholsteryMetalness} />
          </mesh>
        </group>
      </group>
      
      {/* Recessed Heavy Brass Plinth Base */}
      <mesh position={[0, -0.05, 0]} scale={[1, 1, 0.65]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 0.95, 0.08, 128]} />
        <meshStandardMaterial color={config.metalColor} roughness={config.metalRoughness} metalness={config.metalness} />
      </mesh>
    </group>
  );
}

function GoldOttoman({ config }: { config: any }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Soft Domed Ottoman Cushion */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.3, 128]} />
        <meshStandardMaterial color={config.upholsteryColor} roughness={config.upholsteryRoughness} metalness={config.upholsteryMetalness} />
      </mesh>
      {/* Domed Cap */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow scale={[1, 0.2, 1]}>
        <sphereGeometry args={[0.55, 128, 64, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={config.upholsteryColor} roughness={config.upholsteryRoughness} metalness={config.upholsteryMetalness} />
      </mesh>
      
      {/* Oversized Heavy Brass Plinth Ring */}
      <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.56, 0.57, 0.2, 128]} />
        <meshStandardMaterial color={config.metalColor} roughness={config.metalRoughness} metalness={config.metalness} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <torusGeometry args={[0.56, 0.015, 32, 128]} />
        <meshStandardMaterial color={config.metalColor} roughness={0.1} metalness={1.0} />
      </mesh>
    </group>
  );
}

export function ShowroomModel({
  preset = "emerald-velvet",
  model = "vegas-sofa"
}: {
  preset?: MaterialPreset;
  model?: ModelType;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const config = MATERIAL_CONFIGS[preset] || MATERIAL_CONFIGS["emerald-velvet"];

  // Subtle idle motion
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = -0.15 + Math.sin(t * 0.5) * 0.005;
  });

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>
      {/* ARCHITECTURAL PEDESTAL (Grounded Gallery Plinth) */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.05, 64]} />
        <meshStandardMaterial
          color="#151515" // Dark stone base
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      {/* Subtle Rim */}
      <mesh position={[0, -0.375, 0]}>
        <torusGeometry args={[1.5, 0.005, 16, 64]} />
        <meshStandardMaterial
          color={config.metalColor}
          roughness={config.metalRoughness}
          metalness={config.metalness}
        />
      </mesh>

      {/* Product Model Switcher */}
      <group position={[0, -0.05, 0]}>
        {model === "vegas-sofa" && <VegasSofa config={config} />}
        {model === "flame-sofa" && <FlameSofa config={config} />}
        {model === "arcus-sofa" && <ArcusSofa config={config} />}
        {model === "gold-ottoman" && <GoldOttoman config={config} />}
      </group>

      {/* Realistic contact shadow grounded on the platform */}
      <ContactShadows
        position={[0, -0.38, 0]}
        opacity={0.6}
        scale={4.0}
        blur={2.5}
        far={2.0}
        color="#000000"
      />
    </group>
  );
}

export function HeroSpatialScene({
  materialPreset = "emerald-velvet",
  modelType = "vegas-sofa",
  interactive = true,
}: HeroSpatialSceneProps) {
  const { viewport } = useThree();
  
  // Responsive camera scaling based on viewport width
  // Since we have a contained frame now, we can scale it to fit nicely.
  const responsiveScale = viewport.width < 3 ? 0.7 : 0.9;
  const responsiveY = -0.1; // Centered in the square viewport

  return (
    <group scale={responsiveScale} position={[0, responsiveY, 0]}>
      {/* Dramatic Colorful Studio Lighting */}
      <ambientLight intensity={0.4} color="#FFF5E6" />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color="#FFE5B4"
      />
      <directionalLight
        position={[-4, 4, -2]}
        intensity={1.2}
        color="#4A90E2"
      />
      <pointLight position={[2, 3, -4]} intensity={2.0} color="#FF6B6B" />
      
      {/* High-fidelity PBR Environment Reflections */}
      <Environment preset="sunset" />

      {/* Product Model */}
      <ShowroomModel preset={materialPreset} model={modelType} />

      {/* Intuitive Orbit Inspection with constrained rotation */}
      {interactive && (
        <OrbitControls
          enableZoom={true}
          minDistance={2.5}
          maxDistance={6.0}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.1} // Prevent going fully under
          dampingFactor={0.05}
          makeDefault
        />
      )}
    </group>
  );
}
