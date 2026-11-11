"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { MetaLabel } from "@/components/typography/MetaLabel";
import { useMotionOK } from "@/hooks/useMotionOK";
import { ROMANCE_POOL, pickSfx, spawnStamp } from "@/lib/sfx";
import { cn } from "@/lib/utils";

interface HeartCatchProps {
  /** heading for the game block */
  label: string;
  /** hint shown while idle */
  hint: string;
  className?: string;
}

/** round length */
const ROUND_MS = 20_000;
/** ms a heart stays catchable before it drifts off */
const HEART_LIFE = 1500;
/** base ms between spawns (randomised ±40%) */
const SPAWN_MS = 460;
/** max hearts alive at once */
const MAX_ALIVE = 6;

const HEART_COLORS = [
  "var(--c-impact)",
  "var(--c-primary)",
  "var(--c-electric)",
];

const pad2 = (n: number) => String(Math.max(0, n)).padStart(2, "0");

/**
 * HEART CATCH — playable game (romantic pass, design.md D19).
 *
 * Tap/click hearts before they float away; each catch fires a
 * random ROMANCE stamp ("DOKI DOKI", "KISS!"…) inside the arena.
 * 20-second round with a live score + timer.
 *
 * Everything transient is imperative DOM (hearts, stamps) — React
 * state only flips the phase (idle → running → done), so a round
 * costs a handful of re-renders total. The round auto-pauses when
 * the arena scrolls out of view (IntersectionObserver) and resumes
 * with the remaining time. Hearts are real `<button>`s (keyboard
 * focusable); under reduced motion they appear/leave without
 * tweens. Full cleanup on unmount — no orphaned timers.
 */
export function HeartCatch({ label, hint, className }: HeartCatchProps) {
  const motionOK = useMotionOK();
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [finalScore, setFinalScore] = useState(0);

  const arenaRef = useRef<HTMLDivElement>(null);
  const scoreElRef = useRef<HTMLSpanElement>(null);
  const timeElRef = useRef<HTMLSpanElement>(null);
  const spawnRef = useRef<number | null>(null);
  const tickRef = useRef<number | null>(null);
  /** latest `spawn` closure — see the sync effect below */
  const spawnFnRef = useRef<() => void>(() => {});
  const aliveRef = useRef<HTMLElement[]>([]);
  const scoreRef = useRef(0);
  const endsAtRef = useRef(0);
  const remainingRef = useRef(ROUND_MS);
  const phaseRef = useRef<"idle" | "running" | "done">("idle");

  const stopTimers = useCallback(() => {
    if (spawnRef.current !== null) {
      window.clearTimeout(spawnRef.current);
      spawnRef.current = null;
    }
    if (tickRef.current !== null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const clearHearts = useCallback(() => {
    for (const el of aliveRef.current) el.remove();
    aliveRef.current = [];
  }, []);

  const writeHud = useCallback((score: number, msLeft: number) => {
    if (scoreElRef.current) scoreElRef.current.textContent = pad2(score);
    if (timeElRef.current) {
      timeElRef.current.textContent = pad2(Math.ceil(msLeft / 1000));
    }
  }, []);

  const finish = useCallback(() => {
    stopTimers();
    clearHearts();
    phaseRef.current = "done";
    setFinalScore(scoreRef.current);
    setPhase("done");
    writeHud(scoreRef.current, 0);

    /* victory fanfare — one romance stamp at the arena centre */
    const arena = arenaRef.current;
    if (arena) {
      spawnStamp({
        parent: arena,
        text: scoreRef.current >= 10 ? "Soulmate!" : "Love!",
        x: arena.clientWidth / 2,
        y: arena.clientHeight / 2,
        rotation: -4,
        className: "font-display text-4xl text-impact text-outline-paper",
        life: 1400,
        reduced: !motionOK,
      });
    }
  }, [clearHearts, motionOK, stopTimers, writeHud]);

  /* Plain hoisted function (same pattern as HalftonePad's fadeStep):
     the spawn loop schedules itself, which a const/`useCallback`
     cannot do without touching itself before declaration. */
  function spawn() {
    if (phaseRef.current !== "running") return;
    const arena = arenaRef.current;
    if (!arena) return;

    if (aliveRef.current.length < MAX_ALIVE) {
      const w = arena.clientWidth;
      const h = arena.clientHeight;
      const size = 34 + Math.round(Math.random() * 18);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hc-heart";
      btn.setAttribute("aria-label", "Catch this heart");
      btn.style.left = `${8 + Math.random() * Math.max(1, w - size - 16)}px`;
      btn.style.top = `${8 + Math.random() * Math.max(1, h - size - 16)}px`;
      btn.style.width = `${size}px`;
      btn.style.height = `${size}px`;

      const glyph = document.createElement("span");
      glyph.className = "bit-heart";
      glyph.style.setProperty("--hsize", `${size}px`);
      glyph.style.setProperty(
        "--heart-color",
        HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      );
      btn.appendChild(glyph);
      arena.appendChild(btn);
      aliveRef.current.push(btn);

      if (motionOK) {
        animate(glyph, {
          scale: [0.2, 1.2, 1],
          duration: 320,
          ease: "outBack",
        });
      }

      const catchHeart = () => {
        const idx = aliveRef.current.indexOf(btn);
        if (idx === -1) return;
        aliveRef.current.splice(idx, 1);
        btn.remove();

        scoreRef.current += 1;
        writeHud(scoreRef.current, endsAtRef.current - Date.now());

        const rect = arena.getBoundingClientRect();
        const b = btn.getBoundingClientRect();
        spawnStamp({
          parent: arena,
          text: pickSfx(ROMANCE_POOL),
          x: b.left - rect.left + b.width / 2,
          y: b.top - rect.top + b.height / 2,
          rotation: Math.random() * 30 - 15,
          className: cn(
            "font-display text-xl sm:text-2xl",
            Math.random() > 0.5
              ? "text-impact text-outline-paper"
              : "text-primary text-outline-ink",
          ),
          life: 700,
          reduced: !motionOK,
        });

        if (motionOK) {
          animate(btn, {
            scale: [1, 1.5],
            opacity: [1, 0],
            duration: 200,
            ease: "outQuad",
            onComplete: () => btn.remove(),
          });
        }
      };

      btn.addEventListener("click", catchHeart);

      /* miss: the heart drifts off on its own */
      window.setTimeout(() => {
        const idx = aliveRef.current.indexOf(btn);
        if (idx === -1) return;
        aliveRef.current.splice(idx, 1);
        if (motionOK) {
          animate(btn, {
            y: -30,
            opacity: [1, 0],
            duration: 420,
            ease: "inQuad",
            onComplete: () => btn.remove(),
          });
        } else {
          btn.remove();
        }
      }, HEART_LIFE);
    }

    spawnRef.current = window.setTimeout(
      () => spawnFnRef.current(),
      Math.round(SPAWN_MS * (0.6 + Math.random() * 0.8)),
    );
  }

  const startTick = useCallback(() => {
    tickRef.current = window.setInterval(() => {
      if (phaseRef.current !== "running") return;
      const left = endsAtRef.current - Date.now();
      if (left <= 0) {
        finish();
      } else {
        remainingRef.current = left;
        writeHud(scoreRef.current, left);
      }
    }, 120);
  }, [finish, writeHud]);

  const start = useCallback(() => {
    stopTimers();
    clearHearts();
    scoreRef.current = 0;
    endsAtRef.current = Date.now() + ROUND_MS;
    remainingRef.current = ROUND_MS;
    phaseRef.current = "running";
    setPhase("running");
    writeHud(0, ROUND_MS);
    spawnFnRef.current();
    startTick();
  }, [clearHearts, startTick, stopTimers, writeHud]);

  /* Keep the spawn fn in a ref: `spawn` is a plain hoisted function
     (it schedules itself), so its identity changes every render —
     calling it through the ref keeps `start`/observer deps stable. */
  useEffect(() => {
    spawnFnRef.current = spawn;
  });

  /* auto-pause while the arena is off screen (design.md D17 pattern) */
  useEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && phaseRef.current === "running") {
          /* freeze: stash remaining time, kill timers, keep hearts */
          remainingRef.current = Math.max(0, endsAtRef.current - Date.now());
          stopTimers();
        } else if (
          entry.isIntersecting &&
          phaseRef.current === "running" &&
          spawnRef.current === null &&
          tickRef.current === null &&
          remainingRef.current > 0
        ) {
          endsAtRef.current = Date.now() + remainingRef.current;
          spawnFnRef.current();
          startTick();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(arena);
    return () => observer.disconnect();
  }, [startTick, stopTimers]);

  /* unmount: never leave timers or hearts behind */
  useEffect(
    () => () => {
      stopTimers();
      clearHearts();
    },
    [clearHearts, stopTimers],
  );

  return (
    <div className={cn("relative", className)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <MetaLabel className="text-paper/60">{label}</MetaLabel>
        <div
          aria-live="off"
          className="flex items-center gap-4 font-sans text-[0.6875rem] font-bold tracking-[0.18em] text-paper/80 uppercase"
        >
          <span>
            SCORE <span ref={scoreElRef} className="text-primary">00</span>
          </span>
          <span>
            TIME <span ref={timeElRef} className="text-primary">20</span>
          </span>
        </div>
      </div>

      <div
        ref={arenaRef}
        className={cn(
          "hc-arena relative h-56 w-full overflow-hidden border-[3px] border-paper/40 bg-ink/60 sm:h-64",
          phase === "running" && "border-primary/70",
        )}
      >
        {phase !== "running" && (
          <div className="absolute inset-0 grid place-items-center px-6 text-center">
            <div>
              <p className="font-sans text-label tracking-[0.18em] text-paper/70 uppercase">
                {phase === "done"
                  ? `ROUND OVER — ${pad2(finalScore)} CAUGHT`
                  : hint}
              </p>
              <button
                type="button"
                onClick={start}
                className={cn(
                  "mt-4 border-[3px] border-ink bg-impact px-6 py-3 font-display text-xl text-paper shadow-comic",
                  "transition-shadow duration-150 hover:shadow-[6px_6px_0_var(--c-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  "active:shadow-none",
                )}
              >
                {phase === "done" ? "PLAY AGAIN" : "START"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
