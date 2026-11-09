"use client";

import { Suspense, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { StandCore } from "../objects/StandCore";

export interface StandSceneProps {
  progressRef: RefObject<number>;
  pointerRef?: RefObject<{ x: number; y: number }>;
}

/**
 * Ch03 Stand reveal scene (design.md §11.2). Pointer inspection is
 * applied to the Stand group itself (refs) — the camera never moves.
 */
export default function StandScene({ progressRef, pointerRef }: StandSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 38, position: [0, 0, 6.6] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 6, 6]} intensity={1.4} />
      <directionalLight position={[-5, -4, -2]} intensity={0.6} color="#EC3C43" />
      <Suspense fallback={null}>
        <StandCore progressRef={progressRef} pointerRef={pointerRef} />
      </Suspense>
    </Canvas>
  );
}
