"use client";

import { useRef } from "react";
import { ChapterShell } from "@/components/layout/ChapterShell";
import { MetaLabel } from "@/components/typography/MetaLabel";
import { HalftoneLayer } from "@/components/manga/HalftoneLayer";
import { useChapter } from "@/hooks/useChapter";
import { useChoreography } from "@/hooks/useChoreography";
import { gsap, EASE } from "@/lib/gsap";
import { CHAPTERS } from "@/data/chapters";
import { content } from "@/data/content";
import { splitWords } from "@/lib/utils";

/**
 * CHAPTER 05 — THE QUIET BETWEEN BATTLES (design.md §6.1).
 * Intimate cream ground, huge negative space, restrained motion:
 * word-by-word reveal, serif emphasis, ≤15% travel, no overshoot.
 */
export function Chapter05() {
  const chapter = CHAPTERS[4];
  const titleId = `${chapter.id}-title`;
  const handle = useChapter(chapter.index, titleId);
  const contentRef = useRef<HTMLDivElement>(null);
  const { headline, lines, signature, footnote, kicker } = content.ch05;

  useChoreography(contentRef, ({ q }) => {
    /* Gentle header fade — intimacy = restraint (§9.2 rule 6) */
    gsap.from(q(".quiet-kicker"), {
      y: 18,
      opacity: 0,
      duration: 1,
      ease: EASE.soft,
      scrollTrigger: { trigger: q(".quiet-kicker")[0], start: "top 88%", once: true },
    });

    gsap.from(q(".quiet-headline .split-part"), {
      yPercent: 60,
      opacity: 0,
      duration: 0.9,
      stagger: 0.045,
      ease: EASE.soft,
      scrollTrigger: { trigger: q(".quiet-headline")[0], start: "top 82%", once: true },
    });

    /* Word-by-word reveal for each soft line, scrubbed but non-blocking */
    q(".quiet-line").forEach((line) => {
      gsap.fromTo(
        line.querySelectorAll(".split-part"),
        { opacity: 0.12, y: 10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: line,
            start: "top 86%",
            end: "top 46%",
            scrub: 0.5,
          },
        },
      );
    });

    /* Signature settles in last */
    gsap.from(q(".quiet-sign"), {
      opacity: 0,
      y: 14,
      duration: 1.1,
      ease: EASE.soft,
      scrollTrigger: { trigger: q(".quiet-sign")[0], start: "top 90%", once: true },
    });

    /* Very slow background drift (≤8% travel) */
    gsap.to(q(".quiet-tone"), {
      yPercent: 8,
      ease: "none",
      scrollTrigger: {
        trigger: q(".chapter-content")[0],
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, []);

  return (
    <ChapterShell
      chapter={chapter}
      handle={handle}
      contentRef={contentRef}
      className="bg-paper"
    >
      {/* Soft halftone field, barely there */}
      <HalftoneLayer tone="ink" fade className="quiet-tone opacity-[0.07]" />

      <div className="relative mx-auto flex min-h-[90svh] max-w-3xl flex-col justify-center px-6 py-32 lg:px-12">
        <MetaLabel className="quiet-kicker text-ink/50">{kicker}</MetaLabel>

        <h2
          id={titleId}
          className="quiet-headline mt-6 font-accent text-display-lg italic text-ink"
        >
          {splitWords(headline).map((word, i) => (
            <span key={i} className="split-part inline-block" aria-hidden="true">
              {/^\s+$/.test(word) ? "\u00A0" : word}
            </span>
          ))}
          <span className="sr-only">{headline}</span>
        </h2>

        <div className="mt-14 space-y-12">
          {lines.map((line, i) => (
            <p
              key={i}
              className="quiet-line font-sans text-body text-ink/80"
            >
              {splitWords(line).map((word, j) => (
                <span key={j} className="split-part inline-block" aria-hidden="true">
                  {/^\s+$/.test(word) ? "\u00A0" : word}
                </span>
              ))}
              <span className="sr-only">{line}</span>
            </p>
          ))}
        </div>

        <p className="quiet-sign mt-16 font-accent text-xl italic text-ink/70">
          {signature}
        </p>

        <div aria-hidden="true" className="mt-16 h-px w-24 bg-ink/30" />
        <MetaLabel className="quiet-sign mt-4 text-ink/40">{footnote}</MetaLabel>
      </div>
    </ChapterShell>
  );
}
