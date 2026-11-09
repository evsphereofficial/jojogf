"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import {
  Diamond,
  Flame,
  Music2,
  Orbit,
  Star,
  Zap,
} from "lucide-react";
import { ChapterShell } from "@/components/layout/ChapterShell";
import { ChapterTitle } from "@/components/typography/ChapterTitle";
import { MetaLabel } from "@/components/typography/MetaLabel";
import { useChapter } from "@/hooks/useChapter";
import { useChoreography } from "@/hooks/useChoreography";
import { useModalDialog } from "@/hooks/useModalDialog";
import { gsap, EASE } from "@/lib/gsap";
import { CHAPTERS } from "@/data/chapters";
import { content } from "@/data/content";
import { cn } from "@/lib/utils";
import type { UniverseObject } from "@/types/chapter";

const ICONS = {
  star: Star,
  ring: Orbit,
  diamond: Diamond,
  bolt: Zap,
  cassette: Music2,
  planet: Flame,
} as const;

const TONES = [
  "bg-primary text-ink",
  "bg-electric text-ink",
  "bg-impact text-paper",
  "bg-paper text-ink",
  "bg-primary text-ink",
  "bg-electric text-ink",
];

const FLOAT = [
  { x: -30, y: -40 },
  { x: 40, y: -20 },
  { x: -20, y: 50 },
  { x: 35, y: 40 },
  { x: -45, y: 10 },
  { x: 20, y: -50 },
];

function ObjectDetail({
  object,
  onClose,
}: {
  object: UniverseObject | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useModalDialog(object !== null, onClose);
  const Icon = object ? ICONS[object.icon] : Star;

  return (
    <AnimatePresence>
      {object && (
        <motion.div
          key="universe-overlay"
          className="fixed inset-0 z-modal flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          <button
            type="button"
            aria-label="Close detail"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-ink/85"
            tabIndex={-1}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="universe-detail-title"
            className="relative w-full max-w-md border-[5px] border-ink bg-paper shadow-comic-lg"
            initial={{ y: 40, opacity: 0, rotate: -2 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onAnimationComplete={() => closeRef.current?.focus()}
          >
            <div className="flex items-center justify-between border-b-[3px] border-ink bg-ink px-4 py-3">
              <span className="flex items-center gap-2 text-primary">
                <Icon size={16} strokeWidth={3} />
                <MetaLabel>{object.label}</MetaLabel>
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center border-[3px] border-paper bg-ink text-paper transition-colors duration-150 hover:bg-impact"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>
            <div className="p-5">
              <h3
                id="universe-detail-title"
                className="font-display text-2xl text-ink uppercase"
              >
                {object.label}
              </h3>
              <p className="mt-3 font-sans text-body text-ink/85">{object.detail}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * CHAPTER 06 — OUR UNIVERSE (design.md §6.1).
 * Ink ground with a perspective grid, floating themed objects that
 * drift in from depth, pointer-tilt layer, tap-for-detail files.
 */
export function Chapter06() {
  const chapter = CHAPTERS[5];
  const titleId = `${chapter.id}-title`;
  const handle = useChapter(chapter.index, titleId);
  const contentRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<UniverseObject | null>(null);
  const { objects, headline, hint } = content.ch06;

  useChoreography(contentRef, ({ q }) => {
    gsap.from(q(".chapter-header"), {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: EASE.settle,
      scrollTrigger: { trigger: q(".chapter-header")[0], start: "top 85%", once: true },
    });

    /* Perspective grid extends toward the viewer on entry */
    gsap.from(q(".uni-grid"), {
      scaleY: 0.2,
      opacity: 0,
      duration: 1.2,
      ease: EASE.settle,
      transformOrigin: "bottom center",
      scrollTrigger: { trigger: q(".uni-stage")[0], start: "top 80%", once: true },
    });
    gsap.to(q(".uni-grid"), {
      backgroundPositionY: "120px",
      ease: "none",
      scrollTrigger: {
        trigger: q(".uni-stage")[0],
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8,
      },
    });

    /* Objects drift in from depth (z) at staggered depths */
    q(".uni-object").forEach((el, i) => {
      gsap.from(el, {
        z: -320,
        opacity: 0,
        scale: 0.7,
        duration: 1,
        delay: i * 0.07,
        ease: EASE.settle,
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });

      /* Layered parallax speeds — nearer objects travel further */
      gsap.to(el, {
        yPercent: FLOAT[i % FLOAT.length].y / 6,
        ease: "none",
        scrollTrigger: {
          trigger: q(".uni-stage")[0],
          start: "top bottom",
          end: "bottom top",
          scrub: 0.7,
        },
      });
    });

    /* Pointer tilt — GSAP owns the transform property */
    const stage = q(".uni-stage")[0];
    if (stage) {
      const onMove = (e: PointerEvent) => {
        /* touch pointers fire continuously while scrolling past the
           stage — tilt stays a mouse/pen affordance (design.md §12) */
        if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
        const rect = stage.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        gsap.to(q(".uni-tilt"), {
          rotateY: nx * 6,
          rotateX: -ny * 5,
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
        });
      };
      const onLeave = () => {
        gsap.to(q(".uni-tilt"), {
          rotateY: 0,
          rotateX: 0,
          duration: 0.9,
          ease: EASE.settle,
          overwrite: "auto",
        });
      };
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerleave", onLeave);
      return () => {
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerleave", onLeave);
      };
    }
  }, []);

  return (
    <ChapterShell
      chapter={chapter}
      handle={handle}
      contentRef={contentRef}
      className="bg-ink"
    >
      <div className="relative px-6 pt-24 pb-28 lg:px-12 lg:pt-32">
        <div className="mx-auto max-w-6xl">
          <ChapterTitle
            number={chapter.number}
            title={chapter.title}
            subtitle={chapter.subtitle}
            titleId={titleId}
            ground="ink"
          />

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
            <h3 className="font-display text-display-md text-electric uppercase">
              {headline}
            </h3>
            <MetaLabel className="border-[3px] border-paper px-3 py-2 text-paper">
              {hint}
            </MetaLabel>
          </div>

          {/* --- Tilt stage with perspective grid --- */}
          <div
            ref={stageRef}
            className="uni-stage relative mt-12 overflow-hidden border-[3px] border-paper/30 p-6 sm:p-10 lg:p-14"
            style={{ perspective: "1100px" }}
          >
            <div
              aria-hidden="true"
              className="uni-grid pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(22,184,177,0.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(22,184,177,0.55) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
                transform: "rotateX(58deg)",
                transformOrigin: "bottom center",
                maskImage: "linear-gradient(to top, #000, transparent)",
                WebkitMaskImage: "linear-gradient(to top, #000, transparent)",
              }}
            />

            <div className="uni-tilt relative z-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {objects.map((object, i) => {
                const Icon = ICONS[object.icon];
                return (
                  <div key={object.id} className="uni-object">
                    <button
                      type="button"
                      onClick={() => setOpen(object)}
                      className={cn(
                        "group w-full border-[3px] border-ink p-5 text-left shadow-comic",
                        "transition-all duration-150 ease-settle",
                        "hover:-translate-y-1.5 hover:shadow-[10px_10px_0_var(--c-electric)]",
                        TONES[i % TONES.length],
                        [
                          "-rotate-1",
                          "rotate-1",
                          "-rotate-2",
                          "rotate-2",
                          "-rotate-1",
                          "rotate-1",
                        ][i % 6],
                      )}
                    >
                      <span className="grid h-11 w-11 place-items-center border-[3px] border-ink bg-ink text-primary">
                        <Icon size={20} strokeWidth={2.6} />
                      </span>
                      <span className="mt-4 block font-display text-xl uppercase">
                        {object.label}
                      </span>
                      <span className="mt-1 block font-sans text-sm opacity-75">
                        {object.detail.slice(0, 64)}…
                      </span>
                      <span className="mt-3 inline-block font-sans text-label font-bold tracking-[0.18em] uppercase opacity-60 group-hover:opacity-100">
                        OPEN FILE →
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-10 font-sans text-label text-paper/50 uppercase">
            {chapter.characterTheme}
          </p>
        </div>
      </div>

      <ObjectDetail object={open} onClose={() => setOpen(null)} />
    </ChapterShell>
  );
}
