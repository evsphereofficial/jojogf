"use client";

import { useRef } from "react";
import { animate } from "animejs";
import { ChapterShell } from "@/components/layout/ChapterShell";
import { ChapterTitle } from "@/components/typography/ChapterTitle";
import { MangaPanel } from "@/components/manga/MangaPanel";
import { PlaceholderArt } from "@/components/manga/PlaceholderArt";
import { SpeechBubble } from "@/components/manga/SpeechBubble";
import { useChapter } from "@/hooks/useChapter";
import { useChoreography } from "@/hooks/useChoreography";
import { gsap, ScrollTrigger, EASE } from "@/lib/gsap";
import { CHAPTERS } from "@/data/chapters";
import { content } from "@/data/content";
import { cn } from "@/lib/utils";

/**
 * CHAPTER 02 — THE FIRST ENCOUNTER (design.md §6.1).
 * Cream paper ground: panels print in sequentially under scrub,
 * dialogue bubbles pop (Anime.js one-shot), layers drift sideways.
 */
export function Chapter02() {
  const chapter = CHAPTERS[1];
  const titleId = `${chapter.id}-title`;
  const handle = useChapter(chapter.index, titleId);
  const contentRef = useRef<HTMLDivElement>(null);
  const { panels, bubbles, intro } = content.ch02;

  useChoreography(contentRef, ({ q }) => {
    /* Header entrance */
    gsap.from(q(".chapter-header"), {
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: EASE.settle,
      scrollTrigger: {
        trigger: q(".chapter-header")[0],
        start: "top 85%",
        once: true,
      },
    });
    gsap.from(q(".enc-intro"), {
      y: 34,
      opacity: 0,
      duration: 0.8,
      ease: EASE.settle,
      scrollTrigger: {
        trigger: q(".enc-intro")[0],
        start: "top 88%",
        once: true,
      },
    });

    /* Ink seam from the Ch01 wipe recedes as you read */
    gsap.to(q(".enc-seam"), {
      xPercent: -14,
      ease: "none",
      scrollTrigger: {
        trigger: q(".chapter-content")[0],
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      },
    });

    /* Panels print in — art wipes left→right under scrub */
    const printTl = gsap.timeline({
      scrollTrigger: {
        trigger: q(".chapter-content")[0],
        start: "top 62%",
        end: "bottom 78%",
        scrub: 0.5,
      },
    });
    q(".enc-print").forEach((el, i) => {
      printTl.fromTo(
        el,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "none" },
        i * 0.7,
      );
    });

    /* Layered horizontal drift */
    q(".enc-panel-wrap").forEach((el, i) => {
      gsap.to(el, {
        xPercent: i % 2 === 0 ? -5 : 5,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    });

    /* Dialogue bubbles — Anime.js one-shot pop (design.md §9.1) */
    const bubbleEls = q(".enc-bubble");
    gsap.set(bubbleEls, { opacity: 0, scale: 0.6 });
    bubbleEls.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 84%",
        once: true,
        onEnter: () => {
          animate(el, {
            scale: [0.6, 1],
            opacity: [0, 1],
            duration: 700,
            ease: "outExpo",
          });
        },
      });
    });
  }, []);

  return (
    <ChapterShell
      chapter={chapter}
      handle={handle}
      contentRef={contentRef}
      className="bg-paper"
    >
      {/* Diagonal ink seam (continuation of Ch01's wipe) */}
      <div
        aria-hidden="true"
        className="enc-seam absolute inset-x-0 top-0 z-10 h-16 bg-ink lg:h-24"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 30%, 0 100%)" }}
      />

      <div className="relative px-6 pt-24 pb-28 lg:px-12 lg:pt-32">
        <div className="mx-auto max-w-6xl">
          <ChapterTitle
            number={chapter.number}
            title={chapter.title}
            subtitle={chapter.subtitle}
            titleId={titleId}
            ground="paper"
          />

          <p className="enc-intro mt-6 max-w-2xl border-l-[3px] border-impact pl-4 font-sans text-body text-ink/85">
            {intro}
          </p>

          <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-16">
            {panels.map((panel, i) => (
              <div key={panel.id} className="enc-panel-wrap">
                <MangaPanel
                  as="figure"
                  tone="paper"
                  label={panel.label}
                  className="enc-panel overflow-hidden"
                >
                  <div className="enc-print">
                    <div className="aspect-[4/3] overflow-hidden border-b-[3px] border-ink">
                      <PlaceholderArt variant={panel.art} />
                    </div>
                    <figcaption className="p-4 font-sans text-body text-ink">
                      {panel.caption}
                    </figcaption>
                  </div>
                </MangaPanel>

                {bubbles[i] && (
                  <SpeechBubble
                    speaker={bubbles[i].speaker}
                    className={cn(
                      "enc-bubble mt-6 max-w-sm",
                      i % 2 === 1 && "lg:ml-auto",
                    )}
                    side={i % 2 === 1 ? "right" : "left"}
                  >
                    {bubbles[i].text}
                  </SpeechBubble>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChapterShell>
  );
}
