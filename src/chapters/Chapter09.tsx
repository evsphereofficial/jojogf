"use client";

import { useRef } from "react";
import { ChapterShell } from "@/components/layout/ChapterShell";
import { DisplayText } from "@/components/typography/DisplayText";
import { MetaLabel } from "@/components/typography/MetaLabel";
import { HalftoneLayer } from "@/components/manga/HalftoneLayer";
import { SpeedLines } from "@/components/manga/SpeedLines";
import { SwatchStrip } from "@/components/manga/SwatchStrip";
import { MagneticButton } from "@/components/interactions/MagneticButton";
import { useChapter } from "@/hooks/useChapter";
import { useChoreography } from "@/hooks/useChoreography";
import { gsap, EASE } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/lenis";
import { CHAPTERS } from "@/data/chapters";
import { content } from "@/data/content";

/**
 * CHAPTER 09 — TO BE CONTINUED (design.md §6.1).
 * Return to yellow/black: giant kinetic type stamps in, the layered
 * composition pulls back under a slow pin, then the magnetic replay
 * CTA lands. No exit — the story loops back to Chapter 01.
 */
export function Chapter09() {
  const chapter = CHAPTERS[8];
  const titleId = `${chapter.id}-title`;
  const handle = useChapter(chapter.index, titleId);
  const contentRef = useRef<HTMLDivElement>(null);
  const { lines, final, sentiment, cta, kicker } = content.ch09;

  const replay = () => scrollToTarget(0);

  useChoreography(contentRef, ({ q, mm }) => {
    /* Stamped entrance */
    gsap.from(q(".fin-kicker"), {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: EASE.settle,
      scrollTrigger: { trigger: q(".fin-stage")[0], start: "top 80%", once: true },
    });

    gsap.from(q(".fin-line"), {
      scale: 1.4,
      opacity: 0,
      y: 40,
      duration: 0.7,
      stagger: 0.14,
      ease: EASE.slam,
      scrollTrigger: { trigger: q(".fin-stage")[0], start: "top 75%", once: true },
    });

    gsap.from(q(".fin-final .split-part"), {
      yPercent: 120,
      opacity: 0,
      rotate: 6,
      duration: 0.9,
      stagger: 0.04,
      ease: EASE.back,
      scrollTrigger: { trigger: q(".fin-final")[0], start: "top 78%", once: true },
    });

    /* Pinned finale: layered composition pulls back (slow-out) */
    mm.add("(min-width: 1024px)", () => {
      const stage = q(".fin-stage")[0];
      gsap
        .timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
          },
          defaults: { ease: "none" },
        })
        .to(q(".fin-composition"), { scale: 0.86, yPercent: -4 }, 0)
        .to(q(".fin-rays"), { rotation: 45, scale: 1.2 }, 0)
        .to(q(".fin-halftone"), { scale: 1.25, opacity: 0.85 }, 0)
        .to(q(".fin-swatch"), { y: -26, stagger: 0.04 }, 0)
        .fromTo(
          q(".fin-cta"),
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.35 },
          0.55,
        );
    });

    mm.add("(max-width: 1023px)", () => {
      gsap.to(q(".fin-rays"), {
        rotation: 30,
        ease: "none",
        scrollTrigger: {
          trigger: q(".fin-stage")[0],
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    });
  }, []);

  return (
    <ChapterShell
      chapter={chapter}
      handle={handle}
      contentRef={contentRef}
      className="bg-primary"
    >
      <div className="fin-stage relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-28 text-center lg:py-20">
        <HalftoneLayer tone="ink" fade className="fin-halftone opacity-40" />
        <SpeedLines variant="rays" tone="ink" className="fin-rays opacity-[0.12]" />

        <div className="fin-composition relative z-10 flex w-full max-w-5xl flex-col items-center">
          <MetaLabel className="fin-kicker label-chip -rotate-2">
            {kicker} · {chapter.title}
          </MetaLabel>

          <h2 id={titleId} className="sr-only">
            {chapter.title}
          </h2>

          <div className="mt-10 space-y-2">
            {lines.map((line) => (
              <p
                key={line}
                className="fin-line font-display text-display-md text-ink uppercase"
              >
                {line}
              </p>
            ))}
          </div>

          <p
            className="fin-final mt-10 overflow-hidden font-display text-display-xl text-ink uppercase"
          >
            <DisplayText text={final} split="chars" />
          </p>

          <p className="mt-6 max-w-xl font-accent text-lg italic text-ink/80">
            {sentiment}
          </p>

          <div className="fin-cta mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
            <MagneticButton onClick={replay}>{cta}</MagneticButton>
            <SwatchStrip className="fin-swatch" />
          </div>

          <p className="mt-12 font-sans text-label font-bold tracking-[0.18em] text-ink/55 uppercase">
            {chapter.characterTheme}
          </p>
        </div>

        {/* Bottom-corner chapter marker (graphic, like a printed volume) */}
        <span
          aria-hidden="true"
          className="absolute right-6 bottom-6 z-10 font-display text-7xl text-ink/15 lg:text-9xl"
        >
          09
        </span>
      </div>
    </ChapterShell>
  );
}
