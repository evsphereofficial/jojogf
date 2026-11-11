"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MetaLabel } from "@/components/typography/MetaLabel";
import { cn } from "@/lib/utils";

interface HalftonePadProps {
  /** small caption above the pad */
  label: string;
  /** hint shown while the pad is empty */
  hint: string;
  /** brush toggle: dots label */
  dotsLabel: string;
  /** brush toggle: hearts label */
  heartsLabel: string;
  className?: string;
}

type Brush = "dots" | "hearts";

/**
 * Halftone finger-paint (playful toy, design.md D19).
 *
 * Drag a finger/cursor: the chosen brush prints — halftone dots sized
 * by swipe speed, or ink hearts — in cycling palette bands. The ink
 * **stays** until CLEAR (no fade loop: zero background cost on
 * phones, and the drawing is yours to keep).
 *
 * Two brushes via a DOTS/HEARTS toggle; hearts are drawn with a
 * canvas bezier path in the palette colours. Canvas pixels are
 * painted imperatively — no CSS/GSAP/anime touches them, so
 * ownership stays clean. Under reduced motion nothing differs:
 * painting was always static.
 */
export function HalftonePad({
  label,
  hint,
  dotsLabel,
  heartsLabel,
  className,
}: HalftonePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const colorsRef = useRef<string[]>([]);
  const countRef = useRef(0);
  const [brush, setBrush] = useState<Brush>("dots");
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

  /* ---- brush strokes (imperative canvas pixels) ---- */

  /** heart outline via two symmetric cubic beziers (canvas path) */
  const heartPath = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    s: number,
  ) => {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.5);
    ctx.bezierCurveTo(
      x + s * 0.9,
      y + s * 0.1,
      x + s * 0.6,
      y - s * 0.55,
      x,
      y - s * 0.15,
    );
    ctx.bezierCurveTo(
      x - s * 0.6,
      y - s * 0.55,
      x - s * 0.9,
      y + s * 0.1,
      x,
      y + s * 0.5,
    );
    ctx.closePath();
  };

  const stampAt = useCallback((x: number, y: number, speed: number) => {
    const ctx = ctxRef.current;
    const colors = colorsRef.current;
    if (!ctx || colors.length === 0) return;
    /* hearts change colour every 3 stamps, dots every 6 */
    const stride = 6;
    ctx.fillStyle = colors[Math.floor(countRef.current / stride) % colors.length];
    if (brush === "hearts") {
      const s = Math.max(9, Math.min(20, 9 + speed * 0.28));
      heartPath(ctx, x, y, s);
      ctx.fill();
    } else {
      const radius = Math.max(3, Math.min(15, 3 + speed * 0.35));
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    countRef.current += 1;
  }, [brush]);

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
    stampAt(p.x, p.y, 0);
    if (!hasInk) setHasInk(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || !lastRef.current) return;
    const p = localPoint(event);
    const dx = p.x - lastRef.current.x;
    const dy = p.y - lastRef.current.y;
    const dist = Math.hypot(dx, dy);
    /* hearts need breathing room, dots want a continuous trail */
    const gap = brush === "hearts" ? 22 : 8;
    if (dist < gap) return;
    const steps = Math.min(24, Math.floor(dist / gap));
    for (let i = 1; i <= steps; i++) {
      stampAt(
        lastRef.current.x + (dx * i) / steps,
        lastRef.current.y + (dy * i) / steps,
        dist / steps,
      );
    }
    lastRef.current = p;
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
    countRef.current = 0;
    setHasInk(false);
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <MetaLabel className="text-ink/45">{label}</MetaLabel>
        <div className="flex items-center gap-2">
          {/* brush toggle */}
          <div role="group" aria-label="Brush" className="flex">
            <button
              type="button"
              aria-pressed={brush === "dots"}
              onClick={() => setBrush("dots")}
              className={cn(
                "border-[2px] border-ink px-3 py-1 font-sans text-[0.6875rem] font-bold tracking-[0.18em] uppercase",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                brush === "dots"
                  ? "bg-ink text-primary"
                  : "bg-paper text-ink hover:bg-primary",
              )}
            >
              {dotsLabel}
            </button>
            <button
              type="button"
              aria-pressed={brush === "hearts"}
              onClick={() => setBrush("hearts")}
              className={cn(
                "-ml-[2px] border-[2px] border-ink px-3 py-1 font-sans text-[0.6875rem] font-bold tracking-[0.18em] uppercase",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                brush === "hearts"
                  ? "bg-impact text-paper"
                  : "bg-paper text-ink hover:bg-primary",
              )}
            >
              {heartsLabel}
            </button>
          </div>
          <button
            type="button"
            onClick={clear}
            className="label-chip text-[0.6875rem] transition-colors duration-150 hover:bg-impact hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            CLEAR
          </button>
        </div>
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
