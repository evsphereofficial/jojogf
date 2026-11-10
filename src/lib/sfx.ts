"use client";

import { animate } from "animejs";

/**
 * Shared sound-effect vocabulary + imperative stamp/flash helpers for
 * the playful "toy" interactions (design.md §2.1 — original Latin
 * graphic SFX, no copyrighted glyphs).
 *
 * Everything here creates and destroys DOM imperatively: toys never
 * put transient pops into React state, so a burst of taps costs zero
 * re-renders. Ownership (design.md §9.1): anime.js = one-shot micro;
 * the helper is the single transform owner of every node it spawns.
 */

/** Original SFX words — also used by the Ch01 tappable stamp. */
export const SFX_POOL = ["GOROGORO", "DODODO", "DOKAN", "DOON", "ZAN", "BASH"];

/** Punch-machine vocabulary (Ch04). */
export const PUNCH_POOL = [
  "BAMM!",
  "DOON!",
  "ZAKK!",
  "WHAM!",
  "KRAK!",
  "BADOOM!",
];

/** Celebration / secret-mode vocabulary (Ch09 + BIZARRE MODE). */
export const BIZARRE_POOL = [
  "GOROGORO",
  "DOKAN",
  "DOON!",
  "ZAN!",
  "BADOOM!",
  "DODODO",
  "WHAM!",
  "KRAK!",
];

/** Random pick that never returns `current` (for tap-to-shuffle). */
export function pickSfx(pool: string[], current?: string): string {
  if (pool.length === 0) return "";
  if (pool.length === 1) return pool[0];
  let next = pool[Math.floor(Math.random() * pool.length)];
  if (current) {
    let guard = 0;
    while (next === current && guard++ < 8) {
      next = pool[Math.floor(Math.random() * pool.length)];
    }
  }
  return next;
}

export interface StampOptions {
  /** positioned ancestor — must be `relative`/`absolute` and
      `pointer-events-none` if it covers interactive content */
  parent: HTMLElement;
  text: string;
  /** px offsets from the parent's top-left corner */
  x: number;
  y: number;
  /** stamp rotation in degrees */
  rotation?: number;
  /** extra utility classes (size / colour / outline) */
  className?: string;
  /** ms on screen before the fade-out (default 700) */
  life?: number;
  /** no motion: spawn fully visible, remove after `life` */
  reduced?: boolean;
}

/**
 * Spawn a comic SFX stamp that pops in (outBack), holds for `life`,
 * then fades and removes itself. Never throws if the parent is
 * detached mid-flight (removal is a no-op).
 */
export function spawnStamp(options: StampOptions): void {
  const {
    parent,
    text,
    x,
    y,
    rotation = 0,
    className = "",
    life = 700,
    reduced = false,
  } = options;

  const wrap = document.createElement("div");
  wrap.className = "sfx-stamp-wrap";
  wrap.style.left = `${Math.round(x)}px`;
  wrap.style.top = `${Math.round(y)}px`;
  wrap.style.transform = `translate(-50%, -50%) rotate(${Math.round(rotation)}deg)`;

  const inner = document.createElement("span");
  inner.className = `sfx-stamp ${className}`;
  inner.textContent = text;

  wrap.appendChild(inner);
  parent.appendChild(wrap);

  if (reduced) {
    window.setTimeout(() => wrap.remove(), life);
    return;
  }

  animate(inner, {
    scale: [0.2, 1.25, 1],
    opacity: [0, 1],
    duration: 340,
    ease: "outBack",
  });

  window.setTimeout(() => {
    animate(inner, {
      opacity: [1, 0],
      duration: 240,
      ease: "inQuad",
      onComplete: () => wrap.remove(),
    });
  }, life);
}

/**
 * One full-screen impact-red flash (fixed layer appended to body).
 * Skipped entirely under reduced motion by callers.
 */
export function screenFlash(alpha = 0.4, duration = 170): void {
  const flash = document.createElement("div");
  flash.className = "sfx-flash";
  document.body.appendChild(flash);
  animate(flash, {
    opacity: [0, alpha, 0],
    duration,
    ease: "linear",
    onComplete: () => flash.remove(),
  });
}

/**
 * Tiny screen-kick (anime one-shot). Clears every transform-related
 * inline property afterwards so the element returns to being
 * transform-free — important because a transformed ancestor would
 * re-anchor any `position: fixed` descendants (ScrollTrigger pins).
 * Only ever call this on sections with no active pins.
 */
export function kick(el: Element | null | undefined): void {
  if (!el || !(el instanceof HTMLElement)) return;
  animate(el, {
    x: [0, 6, -5, 3, 0],
    y: [0, -4, 3, -1, 0],
    duration: 260,
    ease: "outQuad",
    onComplete: () => {
      el.style.transform = "";
      el.style.translate = "";
      el.style.scale = "";
      el.style.rotate = "";
    },
  });
}
