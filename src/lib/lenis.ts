"use client";

import type Lenis from "lenis";

/**
 * Lenis singleton + scroll helpers (design.md §10.1).
 * Lenis exists only while smooth scrolling is enabled (motion-safe).
 */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export type ScrollTarget = string | number;

/**
 * Scroll to a chapter/position — uses Lenis when active, native
 * scrolling otherwise (reduced motion / touch-conservative paths).
 */
export function scrollToTarget(
  target: ScrollTarget,
  options: { offset?: number; immediate?: boolean } = {},
) {
  const { offset = 0, immediate = false } = options;
  const behavior: ScrollBehavior = immediate ? "auto" : "smooth";

  if (lenis && !immediate) {
    lenis.scrollTo(target, { offset, duration: 1.4 });
    return;
  }

  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior });
    return;
  }

  const el = document.querySelector<HTMLElement>(target);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior });
}
