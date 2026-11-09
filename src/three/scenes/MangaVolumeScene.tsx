"use client";

import { Suspense, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { MangaVolume } from "../objects/MangaVolume";

export interface MangaVolumeSceneProps {
  progressRef: RefObject<number>;
  pointerRef?: RefObject<{ x: number; y: number }>;
}

/**
 * Ch01 hero scene (design.md §11.2) — mounted only near the
 * chapter (selective mounting), dpr capped, no shadows/postFX.
 * Pointer parallax is applied to the volume itself (refs), so the
 * camera stays untouched.
 */
export default function MangaVolumeScene({
  progressRef,
  pointerRef,
}: MangaVolumeSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 35, position: [0, 0, 7.4] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 7]} intensity={1.5} />
      <directionalLight position={[-6, -2, -4]} intensity={0.55} color="#16B8B1" />
      <Suspense fallback={null}>
        <MangaVolume progressRef={progressRef} pointerRef={pointerRef} />
      </Suspense>
    </Canvas>
  );
}
