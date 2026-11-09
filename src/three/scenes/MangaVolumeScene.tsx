"use client";

import { Suspense, useState, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { MangaVolume } from "../objects/MangaVolume";
import type { DragStep } from "@/hooks/useDragRotate";

export interface MangaVolumeSceneProps {
  progressRef: RefObject<number>;
  pointerRef?: RefObject<{ x: number; y: number }>;
  stepDrag?: DragStep;
}

/**
 * Ch01 hero scene (design.md §11.2) — mounted only near the
 * chapter (selective mounting), no shadows/postFX. Pointer parallax
 * and drag-to-spin are applied to the volume itself (refs), so the
 * camera stays untouched.
 *
 * dpr is capped at 1.25 on phones (design.md §11.4) — the single
 * biggest WebGL cost on mid-range devices.
 */
export default function MangaVolumeScene({
  progressRef,
  pointerRef,
  stepDrag,
}: MangaVolumeSceneProps) {
  const [dpr] = useState<[number, number]>(() =>
    typeof window !== "undefined" && window.innerWidth < 1024 ? [1, 1.25] : [1, 1.75],
  );

  return (
    <Canvas
      dpr={dpr}
      camera={{ fov: 35, position: [0, 0, 7.4] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 7]} intensity={1.5} />
      <directionalLight position={[-6, -2, -4]} intensity={0.55} color="#16B8B1" />
      <Suspense fallback={null}>
        <MangaVolume
          progressRef={progressRef}
          pointerRef={pointerRef}
          stepDrag={stepDrag}
        />
      </Suspense>
    </Canvas>
  );
}
