"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionOK } from "@/hooks/useMotionOK";
import { MetaLabel } from "@/components/typography/MetaLabel";
import { cn } from "@/lib/utils";

interface HalftonePadProps {
  /** small caption above the pad */
  label: string;
  /** hint shown while the pad is empty */
  hint: string;
  className?: string;
}

/** ms of inactivity before the fade loop stops (and the pad self-clears) */
const IDLE_MS = 4500;
/** alpha erased per frame — ~3s for a dot to disappear */
const FADE_ALPHA = 0.03;

/**
 * Halftone finger-paint (playful toy).
 *
 * Drag a finger/cursor: dots print in cycling palette bands, sized by
 * speed (slow = fat ink dot, fast = fine speck). Once you stop, the
 * dots fade away like wet ink — the loop idles out and cancels
 * itself, so there is zero background cost on phones when unused.
 *
 * Ownership: canvas pixels are painted imperatively (no CSS/GSAP/anime
 * touches them — nothing conflicts). Under reduced motion the fade
 * loop never starts; the CLEAR button wipes instead.
 */
export function HalftonePad({ label, hint, className }: HalftonePadProps) {
  const motionOK = useMotionOK();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastInkRef = useRef(0);
  const colorsRef = useRef<string[]>([]);
  const dotCountRef = useRef(0);
  const [hasInk, setHasInk] = useState(false);

  /* ---- setup: sizing, palette, resize ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    /* canvas can't resolve CSS custom properties — read them once
       (fallbacks mirror tokens.css, keep in sync) */
    const styles = getComputedStyle(document.documentElement);
    const read = (name: string, fallback: string) =>
      styles.getPropertyValue(name).trim() || fallback;
    colorsRef.current = [
      read("--c-ink", "#141414"),
      read("--c-impact", "#EC3C43"),
      read("--c-electric", "#16B8B1"),
    ];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      ctxRef.current = null;
    };
  }, []);

  /* ---- fade loop (motion-safe) ---- */
  const stopFade = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  /* Plain function (hoisted) so the loop can schedule itself without
     touching a const before its declaration. Reads only refs. */
  function fadeStep() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) {
      rafRef.current = null;
      return;
    }
    rafRef.current = requestAnimationFrame(fadeStep);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = `rgba(0,0,0,${FADE_ALPHA})`;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";

    if (Date.now() - lastInkRef.current > IDLE_MS) {
      /* fully dried — wipe clean and park the loop */
      ctx.clearRect(0, 0, w, h);
      stopFade();
      setHasInk(false);
    }
  }

  const startFade = () => {
    if (!motionOK) return; /* reduced motion: ink stays until CLEAR */
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(fadeStep);
  };

  /* unmount: cancel the loop */
  useEffect(() => stopFade, [stopFade]);

  /* ---- drawing ---- */
  const dotAt = (x: number, y: number, speed: number) => {
    const ctx = ctxRef.current;
    const colors = colorsRef.current;
    if (!ctx || colors.length === 0) return;
    const radius = Math.max(3, Math.min(15, 3 + speed * 0.35));
    ctx.fillStyle = colors[Math.floor(dotCountRef.current / 6) % colors.length];
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    dotCountRef.current += 1;
  };

  const localPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    const p = localPoint(event);
    lastRef.current = p;
    lastInkRef.current = Date.now();
    dotAt(p.x, p.y, 0);
    if (!hasInk) setHasInk(true);
    startFade();
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || !lastRef.current) return;
    const p = localPoint(event);
    const dx = p.x - lastRef.current.x;
    const dy = p.y - lastRef.current.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 4) return;
    /* interpolate so fast swipes leave a continuous dot trail */
    const steps = Math.min(24, Math.floor(dist / 8));
    for (let i = 1; i <= steps; i++) {
      dotAt(
        lastRef.current.x + (dx * i) / steps,
        lastRef.current.y + (dy * i) / steps,
        dist / steps,
      );
    }
    lastRef.current = p;
    lastInkRef.current = Date.now();
  };

  const endStroke = () => {
    drawingRef.current = false;
    lastRef.current = null;
  };

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    }
    stopFade();
    setHasInk(false);
  }, [stopFade]);

  return (
    <div className={cn("relative", className)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <MetaLabel className="text-ink/45">{label}</MetaLabel>
        <button
          type="button"
          onClick={clear}
          className="label-chip text-[0.6875rem] transition-colors duration-150 hover:bg-impact hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          CLEAR
        </button>
      </div>

      <div className="relative h-44 w-full overflow-hidden border-[3px] border-dashed border-ink/30 bg-paper/60 sm:h-52">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={hint}
          className="block h-full w-full cursor-crosshair touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
          onPointerLeave={endStroke}
        />
        {!hasInk && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 grid place-items-center px-4 text-center font-sans text-label tracking-[0.18em] text-ink/35 uppercase"
          >
            {hint}
          </span>
        )}
      </div>
    </div>
  );
}
