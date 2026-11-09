"use client";

import { useRef } from "react";
import { ChapterShell } from "@/components/layout/ChapterShell";
import { MetaLabel } from "@/components/typography/MetaLabel";
import { PlaceholderArt } from "@/components/manga/PlaceholderArt";
import { useChapter } from "@/hooks/useChapter";
import { useChoreography } from "@/hooks/useChoreography";
import { gsap, EASE } from "@/lib/gsap";
import { CHAPTERS } from "@/data/chapters";
import { content } from "@/data/content";

/**
 * CHAPTER 07 — GOLDEN MEMORIES (design.md §6.1 / D6).
 * Desktop: horizontal pin — vertical scroll drives the timeline
 * track sideways, with an SVG line that draws as you advance.
 * Mobile: vertical milestone list with a scrubbed progress rail.
 */
export function Chapter07() {
  const chapter = CHAPTERS[6];
  const titleId = `${chapter.id}-title`;
  const handle = useChapter(chapter.index, titleId);
  const contentRef = useRef<HTMLDivElement>(null);
  const { milestones, headline, hint } = content.ch07;

  useChoreography(contentRef, ({ q, mm }) => {
    /* Header entrance + timeline line draw (shared) */
    gsap.from(q(".chapter-header"), {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: EASE.settle,
      scrollTrigger: { trigger: q(".chapter-header")[0], start: "top 85%", once: true },
    });

    /* ---- DESKTOP: horizontal pin ---- */
    mm.add("(min-width: 1024px)", () => {
      const track = q(".gold-track")[0];
      const pin = q(".gold-pin")[0];
      if (!track || !pin) return;

      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.6}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      tl.to(track, { x: () => -distance() }, 0);

      /* SVG rail draws in sync with the track travel */
      tl.fromTo(
        q(".gold-rail-draw"),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1 },
        0,
      );

      /* Cards register (misregistration shift ≤4px) as they arrive */
      q(".gold-card").forEach((el, i) => {
        tl.fromTo(
          el,
          { opacity: 0.35, y: 34, rotate: i % 2 ? 1.5 : -1.5 },
          { opacity: 1, y: 0, rotate: 0, duration: 0.18 },
          i * 0.16,
        );
      });
    });

    /* ---- MOBILE: vertical milestone rail (§12.2 fallback) ---- */
    mm.add("(max-width: 1023px)", () => {
      gsap.fromTo(
        q(".gold-rail-mobile"),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: q(".gold-list")[0],
            start: "top 75%",
            end: "bottom 70%",
            scrub: 0.5,
          },
        },
      );

      q(".gold-card").forEach((el) => {
        gsap.from(el, {
          x: 40,
          opacity: 0,
          duration: 0.6,
          ease: EASE.back,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
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
      <div className="relative px-6 pt-24 pb-10 lg:px-12 lg:pt-28">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center border-[3px] border-ink bg-ink font-display text-lg text-primary">
                {chapter.number}
              </span>
              <MetaLabel>Chapter {chapter.number}</MetaLabel>
            </div>
            <h2
              id={titleId}
              className="mt-4 font-display text-display-lg text-ink uppercase"
            >
              {chapter.title}
            </h2>
            <p className="mt-2 max-w-xl font-sans text-body text-ink/80">
              {chapter.subtitle}
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-end">
            <h3 className="font-display text-2xl text-ink uppercase lg:text-right">
              {headline}
            </h3>
            <MetaLabel className="border-[3px] border-ink bg-ink px-3 py-2 text-primary">
              {hint}
            </MetaLabel>
          </div>
        </div>
      </div>

      {/* ---------- DESKTOP: pinned horizontal timeline ---------- */}
      <div className="gold-pin relative hidden overflow-hidden lg:block lg:h-svh">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pt-16">
          {/* Drawn rail */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1 w-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 1000 4"
          >
            <line x1="0" y1="2" x2="1000" y2="2" stroke="#141414" strokeWidth="4" opacity="0.25" />
            <line
              className="gold-rail-draw"
              x1="0"
              y1="2"
              x2="1000"
              y2="2"
              stroke="#141414"
              strokeWidth="4"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={0}
            />
          </svg>

          <div className="gold-track flex w-max gap-8 pl-12 pr-24">
            {milestones.map((ms, i) => (
              <article
                key={ms.id}
                className="gold-card relative w-[26rem] shrink-0 border-[3px] border-ink bg-paper shadow-comic"
              >
                {/* Marker sitting on the rail */}
                <span
                  aria-hidden="true"
                  className="absolute -top-[86px] left-8 grid h-12 w-12 place-items-center border-[4px] border-ink bg-impact font-display text-lg text-paper"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="aspect-[16/10] overflow-hidden border-b-[3px] border-ink">
                  <PlaceholderArt
                    variant={(["scene", "blocks", "dots", "strip", "burst"] as const)[i % 5]}
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <MetaLabel className="text-impact">{ms.marker}</MetaLabel>
                    <MetaLabel className="text-ink/50">{ms.date}</MetaLabel>
                  </div>
                  <h4 className="mt-3 font-display text-2xl text-ink uppercase">
                    {ms.title}
                  </h4>
                  <p className="mt-2 font-sans text-sm text-ink/75">{ms.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <span
          aria-hidden="true"
          className="absolute right-10 bottom-8 rotate-180 font-display text-6xl text-ink/25 [writing-mode:vertical-rl]"
        >
          SCROLL →
        </span>
      </div>

      {/* ---------- MOBILE: vertical rail fallback ---------- */}
      <div className="gold-list relative px-6 pb-28 lg:hidden">
        <div
          aria-hidden="true"
          className="gold-rail-mobile absolute top-4 bottom-24 left-[30px] w-[4px] origin-top scale-y-100 bg-ink/30"
        />
        <ol className="relative space-y-10">
          {milestones.map((ms, i) => (
            <li key={ms.id} className="relative pl-16">
              <span
                aria-hidden="true"
                className="absolute top-1 left-0 grid h-12 w-12 place-items-center border-[4px] border-ink bg-impact font-display text-base text-paper"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <article className="gold-card border-[3px] border-ink bg-paper shadow-comic">
                <div className="aspect-[16/10] overflow-hidden border-b-[3px] border-ink">
                  <PlaceholderArt
                    variant={(["scene", "blocks", "dots", "strip", "burst"] as const)[i % 5]}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <MetaLabel className="text-impact">{ms.marker}</MetaLabel>
                    <MetaLabel className="text-ink/50">{ms.date}</MetaLabel>
                  </div>
                  <h4 className="mt-2 font-display text-xl text-ink uppercase">
                    {ms.title}
                  </h4>
                  <p className="mt-2 font-sans text-sm text-ink/75">{ms.body}</p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </ChapterShell>
  );
}
