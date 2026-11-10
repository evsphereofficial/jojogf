"use client";

import { useCallback, useEffect, useRef } from "react";
import { animate } from "animejs";
import { useMotionOK } from "@/hooks/useMotionOK";
import {
  BIZARRE_POOL,
  kick,
  pickSfx,
  screenFlash,
  spawnStamp,
} from "@/lib/sfx";
import { cn } from "@/lib/utils";

interface HoldToChargeProps {
  /** visible label on the hold button */
  label: string;
  className?: string;
}

/** circle circumference for r=50 in the 112 viewBox */
const RING_C = 314.159;
const HOLD_MS = 900;
const RESET_MS = 1500;

const CONFETTI = ["bg-primary", "bg-paper", "bg-impact", "bg-electric"];

/**
 * Hold-to-charge finale (playful toy, Ch09).
 *
 * Press and hold: the ring fills (CSS transition owns the dashoffset —
 * the reduced-motion media query in textures.css collapses it to an
 * instant jump for free). Release early: the ring drains back. Held
 * to completion: a fixed burst layer explodes with SFX stamps +
 * confetti panels, one impact flash, then everything removes itself.
 *
 * Keyboard: hold Space/Enter (keydown starts, keyup releases).
 * Under reduced motion: no flash/kick/confetti — static stamps only.
 *
 * The screen-kick deliberately targets the *button*, never the Ch09
 * section: that section gets pinned on desktop, and a transformed
 * ancestor would re-anchor the pinned element (see kick() docs).
 */
export function HoldToCharge({ label, className }: HoldToChargeProps) {
  const motionOK = useMotionOK();
  const ringRef = useRef<SVGCircleElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<number | null>(null);
  const busyRef = useRef(false);

  const setRing = useCallback((offset: number, transition: string) => {
    const ring = ringRef.current;
    if (!ring) return;
    ring.style.transition = transition;
    ring.style.strokeDashoffset = String(offset);
  }, []);

  const release = useCallback(() => {
    if (timerRef.current === null) return;
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
    /* early release — drain back with a short ease */
    setRing(RING_C, "stroke-dashoffset 240ms ease-out");
  }, [setRing]);

  const fire = useCallback(() => {
    timerRef.current = null;
    if (busyRef.current) return;
    busyRef.current = true;

    const layer = document.createElement("div");
    layer.className = "pointer-events-none fixed inset-0 z-overlay";
    document.body.appendChild(layer);

    const w = window.innerWidth;
    const h = window.innerHeight;

    if (!motionOK) {
      /* reduced motion: static celebratory stamps, no flash/kick */
      for (let i = 0; i < 8; i++) {
        spawnStamp({
          parent: layer,
          text: pickSfx(BIZARRE_POOL),
          x: w * (0.1 + Math.random() * 0.8),
          y: h * (0.12 + Math.random() * 0.6),
          rotation: Math.random() * 40 - 20,
          className: "font-display text-4xl text-primary text-outline-ink",
          life: 1500,
          reduced: true,
        });
      }
    } else {
      screenFlash(0.3, 200);
      kick(btnRef.current);
      for (let i = 0; i < 10; i++) {
        spawnStamp({
          parent: layer,
          text: pickSfx(BIZARRE_POOL),
          x: w * (0.08 + Math.random() * 0.84),
          y: h * (0.1 + Math.random() * 0.62),
          rotation: Math.random() * 50 - 25,
          className: cn(
            "font-display",
            Math.random() > 0.5 ? "text-3xl sm:text-5xl" : "text-4xl sm:text-6xl",
            i % 3 === 0
              ? "text-impact text-outline-paper"
              : i % 3 === 1
                ? "text-ink text-outline-primary"
                : "text-primary text-outline-ink",
          ),
          life: 900,
        });
      }
      /* confetti: little comic panels flying out from the centre */
      for (let i = 0; i < 16; i++) {
        const piece = document.createElement("div");
        piece.className = `absolute left-1/2 top-1/2 block h-4 w-6 border-[3px] border-ink ${CONFETTI[i % CONFETTI.length]}`;
        layer.appendChild(piece);
        animate(piece, {
          x: (Math.random() - 0.5) * w * 0.85,
          y: (Math.random() - 0.62) * h * 0.7,
          rotate: (Math.random() - 0.5) * 720,
          opacity: [1, 1, 0],
          duration: 1100 + Math.random() * 500,
          delay: Math.random() * 240,
          ease: "outQuad",
          onComplete: () => piece.remove(),
        });
      }
    }

    /* the whole burst layer is disposable — sweep it after the
       longest inner animation could possibly be done */
    window.setTimeout(() => layer.remove(), 2400);

    /* ring resets smoothly, then the toy is playable again */
    window.setTimeout(() => setRing(RING_C, "stroke-dashoffset 500ms ease-out"), RESET_MS - 500);
    window.setTimeout(() => {
      busyRef.current = false;
    }, RESET_MS);
  }, [motionOK, setRing]);

  const start = useCallback(() => {
    if (busyRef.current || timerRef.current !== null) return;
    setRing(0, `stroke-dashoffset ${HOLD_MS}ms linear`);
    timerRef.current = window.setTimeout(fire, HOLD_MS);
  }, [fire, setRing]);

  /* unmount: never leave a pending fire behind */
  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== " " && event.key !== "Enter") return;
    if (event.repeat) return;
    event.preventDefault();
    start();
  };
  const onKeyUp = (event: React.KeyboardEvent) => {
    if (event.key !== " " && event.key !== "Enter") return;
    release();
  };

  return (
    <div className={cn("relative inline-grid place-items-center", className)}>
      {/* charge ring (SVG geometry only — CSS transition owns the
          animated dashoffset) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 112 112"
        className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
      >
        <circle cx="56" cy="56" r="50" fill="none" stroke="var(--c-ink)" strokeOpacity="0.2" strokeWidth="6" />
        <circle
          ref={ringRef}
          cx="56"
          cy="56"
          r="50"
          fill="none"
          stroke="var(--c-impact)"
          strokeWidth="6"
          strokeLinecap="butt"
          style={{ strokeDasharray: RING_C, strokeDashoffset: RING_C }}
        />
      </svg>

      <button
        ref={btnRef}
        type="button"
        aria-label={`${label} — press and hold to celebrate`}
        onPointerDown={start}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={release}
        className={cn(
          "relative z-10 grid h-24 w-24 place-items-center rounded-full border-[3px] border-ink bg-ink px-2",
          "font-sans text-[0.6875rem] font-bold tracking-[0.14em] text-primary uppercase",
          "transition-colors duration-150 hover:bg-impact hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        )}
      >
        {label}
      </button>
    </div>
  );
}
