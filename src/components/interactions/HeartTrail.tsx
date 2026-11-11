"use client";

import { useEffect, useRef } from "react";
import { useMotionOK } from "@/hooks/useMotionOK";
import { spawnHeart } from "@/lib/sfx";

const TRAIL_COLORS = [
  "var(--c-impact)",
  "var(--c-primary)",
  "var(--c-electric)",
];

/** min ms + px distance between two spawned hearts (cheap throttle) */
const THROTTLE_MS = 90;
const THROTTLE_PX = 26;
/** hard cap so a fast mouse never floods the DOM */
const MAX_ALIVE = 18;
const LIFE_MS = 950;

/**
 * Cursor heart trail (romantic pass, design.md D19).
 *
 * Throttled `pointermove` (passive) spawns small CSS hearts that
 * drift and fade via anime.js inside `spawnHeart`. Mouse/pen only —
 * touch pointers fire on every scroll and would burn frames for no
 * visual gain (same reasoning as the Ch01 parallax, design.md §12).
 * Renders nothing under reduced motion. All DOM is imperative; a
 * fast cursor is capped at `MAX_ALIVE` concurrent hearts.
 */
export function HeartTrail() {
  const motionOK = useMotionOK();
  const aliveRef = useRef(0);

  useEffect(() => {
    if (!motionOK) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let lastX = Number.NEGATIVE_INFINITY;
    let lastY = Number.NEGATIVE_INFINITY;
    let lastAt = 0;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const now = performance.now();
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      if (
        now - lastAt < THROTTLE_MS ||
        dx * dx + dy * dy < THROTTLE_PX * THROTTLE_PX ||
        aliveRef.current >= MAX_ALIVE
      ) {
        return;
      }
      lastAt = now;
      lastX = event.clientX;
      lastY = event.clientY;
      aliveRef.current += 1;

      spawnHeart({
        parent: document.body,
        x: event.clientX + (Math.random() * 16 - 8),
        y: event.clientY + (Math.random() * 16 - 8),
        fixed: true,
        size: 10 + Math.round(Math.random() * 8),
        color: TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)],
        life: LIFE_MS,
        reduced: false,
      });

      /* release the cap slot when the heart's own tween finishes */
      window.setTimeout(() => {
        aliveRef.current = Math.max(0, aliveRef.current - 1);
      }, LIFE_MS + 60);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [motionOK]);

  return null;
}
