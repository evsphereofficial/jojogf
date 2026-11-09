"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Outlines } from "@react-three/drei";
import * as THREE from "three";
import { getToonGradient } from "../materials/toon";

export interface StandObjectProps {
  progressRef: RefObject<number>;
  pointerRef?: RefObject<{ x: number; y: number }>;
}

const SHARD_COLORS = ["#EC3C43", "#16B8B1", "#F4D94E", "#EC3C43", "#16B8B1", "#F4D94E"];

/**
 * Abstract "Stand" guardian (design.md §11.2): toon-shaded core,
 * orbiting shards, electric ring — graphic and illustrative,
 * no PBR, no post-processing.
 */
export function StandCore({ progressRef, pointerRef }: StandObjectProps) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const shards = useRef<THREE.Group>(null);
  const gradient = useMemo(() => getToonGradient(), []);
  const shardGeo = useMemo(() => new THREE.TetrahedronGeometry(0.3), []);
  const shardMats = useMemo(
    () =>
      SHARD_COLORS.map(
        (c) => new THREE.MeshToonMaterial({ color: c, gradientMap: gradient }),
      ),
    [gradient],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const p = progressRef.current ?? 0;
    const px = pointerRef?.current?.x ?? 0;
    const py = pointerRef?.current?.y ?? 0;
    const t = state.clock.elapsedTime;

    // Reveal across the first quarter of the chapter scrub
    const reveal = Math.min(1, Math.max(0, (p - 0.04) / 0.22));
    const eased = 1 - Math.pow(1 - reveal, 3);
    g.scale.setScalar(0.55 + eased * 0.45);

    g.rotation.y = p * Math.PI * 1.8 + px * 0.5 + t * 0.04;
    g.rotation.x = py * 0.25 + Math.sin(t * 0.6) * 0.04;

    if (ring.current) ring.current.rotation.z += delta * 0.45;
    if (shards.current) {
      shards.current.rotation.y = t * 0.35;
      shards.current.children.forEach((child, i) => {
        child.rotation.x += delta * (0.6 + i * 0.12);
        child.rotation.y += delta * 0.4;
      });
    }
  });

  return (
    <group ref={group}>
      {/* Core */}
      <mesh>
        <icosahedronGeometry args={[1.15, 0]} />
        <meshToonMaterial color="#F4D94E" gradientMap={gradient} />
        <Outlines thickness={0.05} color="#141414" />
      </mesh>

      {/* Inner ink heart */}
      <mesh scale={0.55}>
        <octahedronGeometry args={[1.15, 0]} />
        <meshToonMaterial color="#141414" gradientMap={gradient} />
      </mesh>

      {/* Electric ring */}
      <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.05, 0.055, 8, 72]} />
        <meshToonMaterial color="#16B8B1" gradientMap={gradient} />
      </mesh>

      {/* Orbiting shards */}
      <group ref={shards}>
        {SHARD_COLORS.map((_, i) => {
          const angle = (i / SHARD_COLORS.length) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * 2.05,
                Math.sin(angle * 2) * 0.5,
                Math.sin(angle) * 2.05,
              ]}
              geometry={shardGeo}
              material={shardMats[i]}
            />
          );
        })}
      </group>
    </group>
  );
}
