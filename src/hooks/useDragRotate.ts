"use client";

import { useCallback, useRef } from "react";

/**
 * Drag-to-spin state for the 3D objects (Ch01 volume, Ch03 Stand).
 *
 * Ownership rule (design.md §9.1): the hook only writes plain refs —
 * the object reads and integrates them inside `useFrame`, so there is
 * never a React re-render per pointer move.
 *
 * Phone behaviour (design.md §12):
 * - the drag surface uses `touch-action: pan-y`, so a vertical swipe
 *   still scrolls the page and the browser fires `pointercancel`;
 * - a touch drag only *engages* once horizontal movement clearly
 *   dominates, so scrolling past the object never spins it;
 * - a tap (almost no movement) kicks an inertial spin instead.
 */
export interface DragState {
  /** accumulated rotation offset in radians (X = yaw, Y = pitch) */
  x: number;
  y: number;
  /** release velocity for inertial decay (radians per frame) */
  vx: number;
  vy: number;
  active: boolean;
}

export interface DragHandlers {
  onPointerDown: (event: React.PointerEvent) => void;
  onPointerMove: (event: React.PointerEvent) => void;
  onPointerUp: (event: React.PointerEvent) => void;
  onPointerCancel: (event: React.PointerEvent) => void;
}

const YAW_GAIN = 0.0075;
const PITCH_GAIN = 0.0055;
const PITCH_LIMIT = 0.55;
/** px of movement before a touch drag counts as intentional */
const ENGAGE_PX = 12;
/** movement below this (px) counts as a tap, not a drag */
const TAP_SLOP = 8;
const MAX_V = 0.3;

/** `step(delta)` → current yaw/pitch offsets (radians), integrated
    by the 3D object inside `useFrame`. */
export type DragStep = (delta: number) => { x: number; y: number };

export function useDragRotate(): {
  step: DragStep;
  handlers: DragHandlers;
} {
  const dragRef = useRef<DragState>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    active: false,
  });

  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const accRef = useRef({ x: 0, y: 0 });
  const engagedRef = useRef(false);
  const movedRef = useRef(0);
  const velRef = useRef({ x: 0, y: 0 });

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    /* only primary button / touch / pen — never steal right-clicks */
    if (event.pointerType === "mouse" && event.button !== 0) return;
    lastRef.current = { x: event.clientX, y: event.clientY };
    accRef.current = { x: 0, y: 0 };
    movedRef.current = 0;
    velRef.current = { x: 0, y: 0 };
    /* a mouse/pen drag is intentional immediately; touch must prove
       it is horizontal first so page scrolling stays untouched */
    engagedRef.current = event.pointerType !== "touch";

    const state = dragRef.current;
    state.active = true;
    state.vx = 0;
    state.vy = 0;

    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent) => {
    const state = dragRef.current;
    if (!state.active || !lastRef.current) return;

    const dx = event.clientX - lastRef.current.x;
    const dy = event.clientY - lastRef.current.y;
    lastRef.current = { x: event.clientX, y: event.clientY };
    accRef.current.x += dx;
    accRef.current.y += dy;
    movedRef.current += Math.abs(dx) + Math.abs(dy);

    if (!engagedRef.current) {
      const horizontal =
        Math.abs(accRef.current.x) > ENGAGE_PX &&
        Math.abs(accRef.current.x) > Math.abs(accRef.current.y);
      if (!horizontal) return;
      engagedRef.current = true;
      /* drop the pre-engagement drift so the object doesn't jump */
      lastRef.current = { x: event.clientX, y: event.clientY };
      velRef.current = { x: 0, y: 0 };
      return;
    }

    state.x += dx * YAW_GAIN;
    state.y = Math.max(
      -PITCH_LIMIT,
      Math.min(PITCH_LIMIT, state.y + dy * PITCH_GAIN),
    );

    /* smoothed velocity, used for the inertial coast on release */
    velRef.current.x = velRef.current.x * 0.6 + dx * YAW_GAIN * 0.4;
    velRef.current.y = velRef.current.y * 0.6 + dy * PITCH_GAIN * 0.4;
  }, []);

  const onPointerUp = useCallback((event: React.PointerEvent) => {
    const state = dragRef.current;
    if (!state.active) return;
    state.active = false;
    lastRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    if (movedRef.current < TAP_SLOP) {
      /* tap → playful spin impulse */
      state.vx = 0.16;
      state.vy = 0;
      return;
    }
    /* never convert an un-engaged (vertical) gesture into a spin */
    if (!engagedRef.current) return;
    state.vx = Math.max(-MAX_V, Math.min(MAX_V, velRef.current.x));
    state.vy = Math.max(-MAX_V, Math.min(MAX_V, velRef.current.y));
  }, []);

  /** The browser took the gesture over (usually a vertical scroll):
      reset silently — never convert a scroll into a spin. */
  const onPointerCancel = useCallback((event: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    lastRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }, []);

  /**
   * Integrate inertial coast for `delta` seconds and return the
   * current yaw/pitch offsets. Called from `useFrame`, so the only
   * thing components ever do with the drag state is *read* the
   * returned numbers (React Compiler immutability: mutation stays
   * inside this hook, where the ref is born).
   */
  const step = useCallback((delta: number) => {
    const state = dragRef.current;
    if (
      !state.active &&
      (Math.abs(state.vx) > 0.0004 || Math.abs(state.vy) > 0.0004)
    ) {
      state.x += state.vx;
      state.y = Math.max(-0.55, Math.min(0.55, state.y + state.vy));
      const decay = Math.pow(0.94, delta * 60);
      state.vx *= decay;
      state.vy *= decay;
      if (Math.abs(state.vx) <= 0.0004) state.vx = 0;
      if (Math.abs(state.vy) <= 0.0004) state.vy = 0;
    }
    return { x: state.x, y: state.y };
  }, []);

  return {
    step,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
    },
  };
}
