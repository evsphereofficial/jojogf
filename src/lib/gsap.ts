"use client";

/**
 * Central GSAP registration (design.md §8 / §9.1).
 * Import gsap/ScrollTrigger ONLY from client components via this module.
 * One property → one owning library; ScrollTrigger lives here.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  /* Keep pin measurements correct after fonts/images settle */
  if (typeof document !== "undefined" && document.fonts) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

export { gsap, ScrollTrigger };

/** Shared easing names (mirror tokens.css §5.4) */
export const EASE = {
  settle: "power4.out",
  slam: "expo.inOut",
  back: "back.out(1.7)",
  soft: "power2.out",
} as const;

export const DUR = {
  fast: 0.14,
  base: 0.32,
  slow: 0.72,
  cine: 1.2,
} as const;
