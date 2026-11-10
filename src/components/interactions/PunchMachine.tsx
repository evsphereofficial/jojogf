"use client";

import { useCallback, useRef } from "react";
import { animate } from "animejs";
import { useMotionOK } from "@/hooks/useMotionOK";
import { PUNCH_POOL, kick, pickSfx, screenFlash, spawnStamp } from "@/lib/sfx";
import { cn } from "@/lib/utils";

interface PunchMachineProps {
  /** visible button word */
  label: string;
  /** small meta caption under/next to the button */
  hint: string;
  className?: string;
}

const COOLDOWN_MS = 150;

/**
 * Punch-it SFX machine (playful toy, Ch04).
 *
 * Every tap fires three cheap one-shots (anime.js, §9.1):
 * 1. a random Latin SFX stamp popping above the button,
 * 2. a one-frame impact-red screen flash,
 * 3. a tiny screen-kick of the chapter section.
 *
 * All nodes are imperative (`spawnStamp`/`screenFlash`) — taps never
 * re-render React. Under reduced motion: the stamp still appears
 * (content feedback) but flash + kick are skipped.
 *
 * Section kick is safe here: the Ch04 section contains no pinned
 * elements (see `kick()` docs in lib/sfx.ts).
 */
export function PunchMachine({ label, hint, className }: PunchMachineProps) {
  const motionOK = useMotionOK();
  const layerRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const lastRef = useRef(0);
  const wordRef = useRef<string | undefined>(undefined);

  const punch = useCallback(() => {
    const now = Date.now();
    if (now - lastRef.current < COOLDOWN_MS) return;
    lastRef.current = now;

    const layer = layerRef.current;
    const btn = btnRef.current;
    if (!layer || !btn) return;

    /* Random word, never the same twice running */
    const word = pickSfx(PUNCH_POOL, wordRef.current);
    wordRef.current = word;

    /* Stamp lands just above the button, jittered */
    const lr = layer.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    const x = br.left - lr.left + br.width / 2 + (Math.random() * 72 - 36);
    const y = br.top - lr.top - 8 - Math.random() * 46;

    spawnStamp({
      parent: layer,
      text: word,
      x,
      y,
      rotation: Math.random() * 24 - 12,
      className: cn(
        "font-display text-3xl sm:text-5xl",
        Math.random() > 0.5 ? "text-impact text-outline-paper" : "text-ink text-outline-primary",
      ),
      life: 650,
      reduced: !motionOK,
    });

    if (!motionOK) return;

    screenFlash(0.35, 170);
    kick(btn.closest("section"));
    /* Button slam — anime owns this element's transform (no CSS
       hover transform here, per ownership rule D9) */
    animate(btn, {
      scale: [1, 0.88, 1.06, 1],
      duration: 300,
      ease: "outQuad",
      onComplete: () => {
        btn.style.transform = "";
        btn.style.scale = "";
        btn.style.rotate = "";
      },
    });
  }, [motionOK]);

  return (
    <div className={cn("relative", className)}>
      {/* imperative stamp layer */}
      <div
        ref={layerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20"
      />

      <div className="relative z-10 flex flex-wrap items-center gap-4">
        <button
          ref={btnRef}
          type="button"
          onClick={punch}
          aria-label={`${label} — fire an impact sound effect`}
          className={cn(
            "border-[3px] border-ink bg-impact px-6 py-4 font-display text-2xl text-paper shadow-comic",
            "transition-shadow duration-150 hover:shadow-[6px_6px_0_var(--c-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
            "active:shadow-none",
          )}
        >
          {label}
        </button>
        <span className="label-chip -rotate-1 text-[0.6875rem]">{hint}</span>
      </div>
    </div>
  );
}
