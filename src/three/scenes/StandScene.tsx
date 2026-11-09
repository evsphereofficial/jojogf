"use client";

import { Suspense, useState, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { StandCore } from "../objects/StandCore";
import type { DragStep } from "@/hooks/useDragRotate";

export interface StandSceneProps {
  progressRef: RefObject<number>;
  pointerRef?: RefObject<{ x: number; y: number }>;
  stepDrag?: DragStep;
}

/** Ch03 Stand reveal scene (design.md §11.2). dpr capped on phones. */
export default function StandScene({
  progressRef,
  pointerRef,
  stepDrag,
}: StandSceneProps) {
  const [dpr] = useState<[number, number]>(() =>
    typeof window !== "undefined" && window.innerWidth < 1024 ? [1, 1.25] : [1, 1.75],
  );

  return (
    <Canvas
      dpr={dpr}
      camera={{ fov: 38, position: [0, 0, 6.6] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 6, 6]} intensity={1.4} />
      <directionalLight position={[-5, -4, -2]} intensity={0.6} color="#EC3C43" />
      <Suspense fallback={null}>
        <StandCore
          progressRef={progressRef}
          pointerRef={pointerRef}
          stepDrag={stepDrag}
        />
      </Suspense>
    </Canvas>
  );
}
