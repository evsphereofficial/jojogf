"use client";

import { useRef } from "react";
import { ChapterShell } from "@/components/layout/ChapterShell";
import { MetaLabel } from "@/components/typography/MetaLabel";
import { HalftoneLayer } from "@/components/manga/HalftoneLayer";
import { FloatingHearts } from "@/components/manga/FloatingHearts";
import { Heart } from "lucide-react";
import { useChapter } from "@/hooks/useChapter";
import { useChoreography } from "@/hooks/useChoreography";
import { gsap, EASE } from "@/lib/gsap";
import { CHAPTERS } from "@/data/chapters";
import { content } from "@/data/content";

/**
 * CHAPTER 08 — THE LETTER (design.md §6.1).
 * Intimate editorial paper column: line-by-line mask reveals under
 * scrub (non-blocking — the text is readable without the animation),
 * finishing with a seal stamp.
 */
export function Chapter08() {
  const chapter = CHAPTERS[7];
  const titleId = `${chapter.id}-title`;
  const handle = useChapter(chapter.index, titleId);
  const contentRef = useRef<HTMLDivElement>(null);
  const { paragraphs, signOff, seal, headline, kicker } = content.ch08;

  useChoreography(contentRef, ({ q }) => {
    /* Column rises */
    gsap.from(q(".letter-sheet"), {
      y: 70,
      opacity: 0,
      duration: 1,
      ease: EASE.settle,
      scrollTrigger: { trigger: q(".letter-sheet")[0], start: "top 88%", once: true },
    });

    gsap.from(q(".letter-kicker"), {
      opacity: 0,
      y: 16,
      duration: 0.8,
      ease: EASE.soft,
      scrollTrigger: { trigger: q(".letter-kicker")[0], start: "top 90%", once: true },
    });

    /* Line-mask reveal per paragraph — scrubbed, never hidden fully */
    q(".letter-para").forEach((para) => {
      gsap.fromTo(
        para,
        { clipPath: "inset(0 0 100% 0)", opacity: 0.25 },
        {
          clipPath: "inset(0 0 0% 0)",
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: para,
            start: "top 88%",
            end: "top 55%",
            scrub: 0.4,
          },
        },
      );
    });

    /* Signature underline draws */
    gsap.from(q(".letter-rule"), {
      scaleX: 0,
      duration: 1.1,
      ease: EASE.settle,
      transformOrigin: "left center",
      scrollTrigger: { trigger: q(".letter-sign")[0], start: "top 88%", once: true },
    });

    /* Seal stamps in — one impact, then still */
    gsap.from(q(".letter-seal"), {
      scale: 2.2,
      opacity: 0,
      rotate: -24,
      duration: 0.45,
      ease: EASE.slam,
      scrollTrigger: { trigger: q(".letter-seal")[0], start: "top 85%", once: true },
    });
  }, []);

  return (
    <ChapterShell
      chapter={chapter}
      handle={handle}
      contentRef={contentRef}
      className="bg-paper"
    >
      <HalftoneLayer tone="ink" fade className="opacity-[0.06]" />

      {/* Ambient hearts behind the letter sheet (DOM order: the
          relative sheet below paints above them) */}
      <FloatingHearts
        count={6}
        size={16}
        color="var(--c-impact)"
        duration={10000}
        className="opacity-70"
      />

      <div className="relative mx-auto max-w-3xl px-6 py-28 lg:px-12 lg:py-36">
        <div
          className="letter-sheet relative border-[3px] border-ink bg-paper px-6 py-10 shadow-comic sm:px-10 sm:py-14"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0 31px, rgba(20,20,20,0.07) 31px 32px)",
          }}
        >
          {/* Letterhead */}
          <div className="letter-kicker flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-ink pb-5">
            <MetaLabel>{kicker}</MetaLabel>
            <MetaLabel className="text-ink/50">VOL. 06 · P. 08</MetaLabel>
          </div>

          <h2
            id={titleId}
            className="letter-kicker mt-8 font-accent text-display-md italic text-ink"
          >
            {headline}
          </h2>

          {/* Body */}
          <div className="mt-8 space-y-6">
            {paragraphs.map((para, i) => (
              <p key={i} className="letter-para font-sans text-body text-ink/85">
                {para}
              </p>
            ))}
          </div>

          {/* Sign-off */}
          <div className="letter-sign mt-12">
            <div aria-hidden="true" className="letter-rule h-[3px] w-40 bg-impact" />
            <p className="mt-4 flex items-center gap-2 font-accent text-xl italic text-ink">
              {signOff}
              <Heart
                aria-hidden="true"
                size={16}
                strokeWidth={2.5}
                fill="currentColor"
                className="shrink-0 rotate-[-8deg] text-impact"
              />
            </p>
          </div>

          {/* Seal */}
          <div
            aria-hidden="true"
            className="letter-seal absolute right-6 bottom-8 grid h-24 w-24 rotate-[-8deg] place-items-center border-[4px] border-impact text-center sm:right-10"
            style={{ borderRadius: "50%" }}
          >
            <span className="font-display text-lg leading-none text-impact">
              {seal}
              <span className="mt-1 block font-sans text-[0.5rem] tracking-[0.2em]">
                SEALED
              </span>
            </span>
          </div>
        </div>

        <MetaLabel className="mt-8 block text-center text-ink/40">
          {chapter.characterTheme}
        </MetaLabel>
      </div>
    </ChapterShell>
  );
}
