"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { ChapterShell } from "@/components/layout/ChapterShell";
import { ChapterTitle } from "@/components/typography/ChapterTitle";
import { MetaLabel } from "@/components/typography/MetaLabel";
import { PlaceholderArt } from "@/components/manga/PlaceholderArt";
import { ImpactFrame } from "@/components/effects/ImpactFrame";
import { useChapter } from "@/hooks/useChapter";
import { useChoreography } from "@/hooks/useChoreography";
import { useModalDialog } from "@/hooks/useModalDialog";
import { gsap, EASE } from "@/lib/gsap";
import { CHAPTERS } from "@/data/chapters";
import { content } from "@/data/content";
import { cn } from "@/lib/utils";
import type { MomentContent } from "@/types/chapter";

const TILT = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1"];
const ART = ["burst", "dots", "scene", "strip", "blocks", "portrait"] as const;

/**
 * Modal dialog for a single memory — Motion owns presence,
 * focus is trapped, Escape closes, focus restores on close.
 */
function MemoryModal({
  moment,
  onClose,
}: {
  moment: MomentContent | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useModalDialog(moment !== null, onClose);

  return (
    <AnimatePresence>
      {moment && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-modal flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            aria-label="Close memory"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-ink/85"
            tabIndex={-1}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="memory-title"
            className="relative max-h-[85svh] w-full max-w-xl overflow-y-auto border-[5px] border-ink bg-paper shadow-comic-lg"
            initial={{ scale: 0.82, rotate: -4, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            onAnimationComplete={() => closeRef.current?.focus()}
          >
            <div className="flex items-center justify-between border-b-[3px] border-ink bg-primary px-4 py-3">
              <MetaLabel>{moment.tag}</MetaLabel>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center border-[3px] border-ink bg-ink text-primary transition-colors duration-150 hover:bg-impact hover:text-paper"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>

            <div className="aspect-[16/9] overflow-hidden border-b-[3px] border-ink">
              <PlaceholderArt variant="burst" />
            </div>

            <div className="p-5">
              <h3
                id="memory-title"
                className="font-display text-display-md text-ink uppercase"
              >
                {moment.title}
              </h3>
              <p className="mt-3 font-sans text-body text-ink/85">{moment.body}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * CHAPTER 04 — OUR BIZARRE MOMENTS (design.md §6.1).
 * Ink ground, overlapping rotated collage flying in from the edges,
 * multi-speed parallax scatter, click-to-open memory modal.
 */
export function Chapter04() {
  const chapter = CHAPTERS[3];
  const titleId = `${chapter.id}-title`;
  const handle = useChapter(chapter.index, titleId);
  const contentRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<MomentContent | null>(null);
  const { moments, headline, hint, sfx } = content.ch04;

  useChoreography(contentRef, ({ q }) => {
    gsap.from(q(".chapter-header"), {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: EASE.settle,
      scrollTrigger: { trigger: q(".chapter-header")[0], start: "top 85%", once: true },
    });

    /* Collage panels fly in from alternating edges */
    q(".mom-card").forEach((el, i) => {
      gsap.from(el, {
        x: i % 2 === 0 ? -140 : 140,
        y: i % 3 === 0 ? 90 : -60,
        opacity: 0,
        rotate: i % 2 === 0 ? -18 : 18,
        duration: 0.75,
        ease: EASE.back,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });

      /* Multi-speed parallax scatter (supporting motion, ≤10%) */
      gsap.to(el, {
        yPercent: i % 2 === 0 ? -7 : 7,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    });

    /* Impact frame flashes once at the section seam */
    gsap.fromTo(
      q(".impact-flash"),
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.12,
        yoyo: true,
        repeat: 1,
        ease: "none",
        scrollTrigger: { trigger: q(".chapter-content")[0], start: "top 60%", once: true },
      },
    );
  }, []);

  return (
    <ChapterShell
      chapter={chapter}
      handle={handle}
      contentRef={contentRef}
      className="bg-ink"
    >
      <ImpactFrame sfx={sfx} className="impact-flash" />

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
            <h3 className="font-display text-display-md text-impact uppercase">
              {headline}
            </h3>
            <MetaLabel className="border-[3px] border-paper px-3 py-2 text-paper">
              {hint}
            </MetaLabel>
          </div>

          {/* Collage — GSAP owns the wrapper, CSS owns the button hover */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {moments.map((moment, i) => (
              <div key={moment.id} className="mom-card">
                <button
                  type="button"
                  onClick={() => setOpen(moment)}
                  className={cn(
                    "group relative block w-full border-[3px] border-paper bg-paper text-left shadow-[6px_6px_0_var(--c-primary)]",
                    "transition-all duration-150 ease-settle",
                    "hover:-translate-y-1 hover:shadow-[10px_10px_0_var(--c-impact)]",
                    "focus-visible:-translate-y-1",
                    TILT[i % TILT.length],
                  )}
                >
                  <span className="label-chip absolute top-2 left-2 z-10 text-[0.5625rem]">
                    {moment.tag}
                  </span>
                  <div className="aspect-[4/3] overflow-hidden border-b-[3px] border-ink">
                    <PlaceholderArt variant={ART[i % ART.length]} />
                  </div>
                  <div className="p-4">
                    <h4 className="font-display text-xl text-ink uppercase">
                      {moment.title}
                    </h4>
                    <p className="mt-2 line-clamp-2 font-sans text-sm text-ink/70">
                      {moment.body}
                    </p>
                    <span className="mt-3 inline-block font-sans text-label font-bold tracking-[0.18em] text-impact uppercase">
                      OPEN →
                    </span>
                  </div>
                </button>
              </div>
            ))}
          </div>

          <p className="mt-12 font-sans text-label text-paper/50 uppercase">
            {chapter.characterTheme}
          </p>
        </div>
      </div>

      <MemoryModal moment={open} onClose={() => setOpen(null)} />
    </ChapterShell>
  );
}
