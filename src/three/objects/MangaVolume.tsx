"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createCoverTexture, getToonGradient } from "../materials/toon";
import type { DragStep } from "@/hooks/useDragRotate";

export interface VolumeObjectProps {
  /** 0..1 chapter scroll progress — written by GSAP, read in useFrame */
  progressRef: RefObject<number>;
  /** -1..1 pointer position for parallax */
  pointerRef?: RefObject<{ x: number; y: number }>;
  /** optional drag-to-spin integration (tap = spin impulse) */
  stepDrag?: DragStep;
}

/**
 * Stylized manga tankōbon (design.md §11.2): ink cover, cream page
 * block, procedurally drawn cover art. Flat toon shading only.
 *
 * Phone behaviour: the viewport is narrow, so the volume scales down
 * and uses a shorter rotation sweep — otherwise it fills the screen
 * and swallows the hero copy (design.md §12).
 */
export function MangaVolume({ progressRef, pointerRef, stepDrag }: VolumeObjectProps) {
  const group = useRef<THREE.Group>(null);
  const size = useThree((state) => state.size);
  const cover = useMemo(() => createCoverTexture(), []);
  const gradient = useMemo(() => getToonGradient(), []);

  /* Narrow viewport = compact presentation (ssr:false, client only) */
  const compact = size.width < 1024;
  const scale = compact ? 0.62 : 1;
  const sweep = compact ? Math.PI * 1.0 : Math.PI * 1.35;

  useEffect(() => () => cover.dispose(), [cover]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const p = progressRef.current ?? 0;
    const px = pointerRef?.current?.x ?? 0;
    const py = pointerRef?.current?.y ?? 0;
    const t = state.clock.elapsedTime;

    /* drag + inertial coast — `step` lives in the hook, so this
       component only reads the returned offsets (refs-only, no
       React re-render per pointer move) */
    let dragX = 0;
    let dragY = 0;
    if (stepDrag) {
      const d = stepDrag(delta);
      dragX = d.x;
      dragY = d.y;
    }

    /* Scroll-driven turn + pointer parallax + drag + idle float.
       `ease` keeps delta-time independent for the frame-rate-sensitive
       pointer term; the scroll term is absolute (scrub-driven). */
    const targetY = -0.55 + p * sweep + px * 0.35 + dragX;
    const targetX = 0.1 + py * 0.18 + dragY + Math.sin(t * 0.7) * 0.03;

    g.rotation.y = targetY;
    g.rotation.x = targetX;
    g.position.y = Math.sin(t * 0.9) * 0.09;
    g.scale.setScalar(scale);
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
