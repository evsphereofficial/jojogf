"use client";

import { useEffect, useRef } from "react";
import { useExperienceStore } from "@/lib/store";
import { useMotionOK } from "@/hooks/useMotionOK";
import { BIZARRE_POOL, pickSfx, spawnStamp } from "@/lib/sfx";

/** classic Konami sequence — desktop key path into BIZARRE MODE */
const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const STAMP_SIZES = [
  "font-display text-3xl text-impact text-outline-paper",
  "font-display text-4xl text-ink text-outline-primary",
  "font-display text-2xl text-primary text-outline-ink",
  "font-display text-5xl text-paper text-outline-ink",
];

/**
 * BIZARRE MODE — the Konami-style secret (tap the Ch01 badge five
 * times, or type the arrow sequence on desktop).
 *
 * While the store flag is up, a viewport-fixed layer rains SFX stamps
 * in waves until the window closes (store-managed timeout). All
 * spawns are imperative; the overlay itself never re-renders per
 * stamp. Reduced motion: one static wave, no interval.
 */
export function BizarreOverlay() {
  const bizarre = useExperienceStore((s) => s.bizarre);
  const triggerBizarre = useExperienceStore((s) => s.triggerBizarre);
  const motionOK = useMotionOK();
  const layerRef = useRef<HTMLDivElement>(null);

  /* Always-on desktop key sequence */
  useEffect(() => {
    let idx = 0;
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === KONAMI[idx]) {
        idx += 1;
        if (idx === KONAMI.length) {
          idx = 0;
          triggerBizarre();
        }
      } else {
        idx = key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [triggerBizarre]);

  /* Stamp rain while active */
  useEffect(() => {
    if (!bizarre) return;
    const layer = layerRef.current;
    if (!layer) return;

    const spawnWave = (count: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < count; i++) {
        spawnStamp({
          parent: layer,
          text: pickSfx(BIZARRE_POOL),
          x: w * (0.06 + Math.random() * 0.88),
          y: h * (0.08 + Math.random() * 0.74),
          rotation: Math.random() * 50 - 25,
          className: STAMP_SIZES[Math.floor(Math.random() * STAMP_SIZES.length)],
          life: 850,
          reduced: !motionOK,
        });
      }
    };

    spawnWave(motionOK ? 7 : 12);
    const interval =
      motionOK && typeof window !== "undefined"
        ? window.setInterval(() => spawnWave(3), 650)
        : null;

    return () => {
      if (interval !== null) window.clearInterval(interval);
      layer.replaceChildren();
    };
  }, [bizarre, motionOK]);

  if (!bizarre) return null;

  return (
    <>
      {/* imperative stamp layer */}
      <div
        ref={layerRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-overlay"
      />
      {/* banner — pure CSS pulse (auto-disabled by reduced-motion CSS) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-overlay grid place-items-center"
      >
        <span className="label-chip anim-pulse-step -rotate-3 text-xl sm:text-3xl shadow-comic">
          BIZARRE MODE!
        </span>
      </div>
    </>
  );
}
