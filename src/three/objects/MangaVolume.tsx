"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createCoverTexture, getToonGradient } from "../materials/toon";

export interface VolumeObjectProps {
  /** 0..1 chapter scroll progress — written by GSAP, read in useFrame */
  progressRef: RefObject<number>;
  /** -1..1 pointer position for parallax */
  pointerRef?: RefObject<{ x: number; y: number }>;
}

/**
 * Stylized manga tankōbon (design.md §11.2): ink cover, cream page
 * block, procedurally drawn cover art. Flat toon shading only.
 */
export function MangaVolume({ progressRef, pointerRef }: VolumeObjectProps) {
  const group = useRef<THREE.Group>(null);
  const cover = useMemo(() => createCoverTexture(), []);
  const gradient = useMemo(() => getToonGradient(), []);

  useEffect(() => () => cover.dispose(), [cover]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const p = progressRef.current ?? 0;
    const px = pointerRef?.current?.x ?? 0;
    const py = pointerRef?.current?.y ?? 0;
    const t = state.clock.elapsedTime;

    // Scroll-driven turn + pointer parallax + idle float
    g.rotation.y = -0.55 + p * Math.PI * 1.35 + px * 0.35;
    g.rotation.x = 0.1 + py * 0.18 + Math.sin(t * 0.7) * 0.03;
    g.position.y = Math.sin(t * 0.9) * 0.09;
  });

  return (
    <group ref={group}>
      {/* Ink cover shell */}
      <mesh>
        <boxGeometry args={[2.3, 3.3, 0.5]} />
        <meshToonMaterial color="#141414" gradientMap={gradient} />
      </mesh>

      {/* Cream page block, peeking from the fore-edge */}
      <mesh position={[0.13, 0, 0]}>
        <boxGeometry args={[2.1, 3.14, 0.44]} />
        <meshToonMaterial color="#F7F1DF" gradientMap={gradient} />
      </mesh>

      {/* Front cover art plane */}
      <mesh position={[0, 0, 0.252]}>
        <planeGeometry args={[2.3, 3.3]} />
        <meshBasicMaterial map={cover} toneMapped={false} />
      </mesh>

      {/* Cyan spine accent */}
      <mesh position={[-1.06, 0, 0.256]}>
        <planeGeometry args={[0.16, 3.3]} />
        <meshBasicMaterial color="#16B8B1" toneMapped={false} />
      </mesh>
    </group>
  );
}
