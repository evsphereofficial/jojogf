"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { ChapterShell } from "@/components/layout/ChapterShell";
import { ChapterTitle } from "@/components/typography/ChapterTitle";
import { MetaLabel } from "@/components/typography/MetaLabel";
import { HalftoneLayer } from "@/components/manga/HalftoneLayer";
import { useChapter } from "@/hooks/useChapter";
import { useChoreography } from "@/hooks/useChoreography";
import { useDragRotate } from "@/hooks/useDragRotate";
import { useInViewport } from "@/hooks/useInViewport";
import { useMotionOK } from "@/hooks/useMotionOK";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { gsap, ScrollTrigger, EASE } from "@/lib/gsap";
import { CHAPTERS } from "@/data/chapters";
import { content } from "@/data/content";
import { cn } from "@/lib/utils";

const StandScene = dynamic(() => import("@/three/scenes/StandScene"), {
  ssr: false,
  loading: () => null,
});

/** DOM stand-in when WebGL is unavailable (design.md §11.5). */
function StandFallback() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="relative grid h-[52vmin] w-[52vmin] place-items-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 border-[3px] border-primary"
          style={{ clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)" }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-[14%] border-[3px] border-electric"
          style={{ clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)" }}
        />
        <span className="relative font-display text-display-md text-primary uppercase">
          STAND
        </span>
      </div>
    </div>
  );
}

/**
 * CHAPTER 03 — THE STAND AWAKENS (design.md §6.1).
 * Theatrical ink ground: radial burst rays spin in, the 3D Stand
 * scales up on scrub, attribute rows stamp into place.
 */
export function Chapter03() {
  const chapter = CHAPTERS[2];
  const titleId = `${chapter.id}-title`;
  const handle = useChapter(chapter.index, titleId);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const motionOK = useMotionOK();
  const { step: stepDrag, handlers } = useDragRotate();

  const webgl = useWebGLSupport();
  const nearViewport = useInViewport(handle.ref, "60% 0px 60% 0px");

  useEffect(() => {
    if (!motionOK) return;
    const onMove = (e: PointerEvent) => {
      /* touch pointers fire on every scroll — parallax is mouse/pen
         only (design.md §12) */
      if (e.pointerType === "touch") return;
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [motionOK]);

  useChoreography(contentRef, ({ q, mm }) => {
    /* Header + intro entrance */
    gsap.from(q(".chapter-header"), {
      y: 50,
      opacity: 0,
      duration: 0.85,
      ease: EASE.settle,
      scrollTrigger: { trigger: q(".chapter-header")[0], start: "top 85%", once: true },
    });
    gsap.from(q(".stand-intro"), {
      y: 30,
      opacity: 0,
      duration: 0.75,
      ease: EASE.settle,
      scrollTrigger: { trigger: q(".stand-intro")[0], start: "top 88%", once: true },
    });

    /* Burst rays spin in, then counter-rotate under scrub */
    gsap.from(q(".stand-rays"), {
      rotation: -45,
      scale: 0.7,
      opacity: 0,
      duration: 1.1,
      ease: EASE.back,
      scrollTrigger: { trigger: q(".stand-stage")[0], start: "top 80%", once: true },
    });
    gsap.to(q(".stand-rays"), {
      rotation: 40,
      ease: "none",
      scrollTrigger: {
        trigger: q(".stand-stage")[0],
        start: "top bottom",
        end: "bottom top",
        scrub: 0.7,
      },
    });

    /* Pinned stage: object scale + progress feed for the 3D scene */
    mm.add("(min-width: 1024px)", () => {
      const stage = q(".stand-stage")[0];
      gsap.to(q(".stand-stage-inner"), {
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });
    });

    mm.add("(max-width: 1023px)", () => {
      const stage = q(".stand-stage")[0];
      ScrollTrigger.create({
        trigger: stage,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });
    });

    /* Ability rows stamp in — count-up style scale snap */
    q(".stand-stat").forEach((el, i) => {
      gsap.from(el, {
        x: -60,
        opacity: 0,
        rotate: -3,
        duration: 0.55,
        ease: EASE.back,
        delay: i * 0.05,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    /* Stand name stamps */
    gsap.from(q(".stand-name"), {
      scale: 1.5,
      opacity: 0,
      duration: 0.6,
      ease: EASE.slam,
      scrollTrigger: { trigger: q(".stand-name")[0], start: "top 85%", once: true },
    });
  }, []);

  const { abilities, intro, standName, standCall, inspectHint } = content.ch03;

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

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <MetaLabel className="label-chip">{standName}</MetaLabel>
            <MetaLabel className="text-paper/70">{standCall}</MetaLabel>
          </div>

          <p className="stand-intro mt-6 max-w-2xl border-l-[3px] border-primary pl-4 font-sans text-body text-paper/85">
            {intro}
          </p>
        </div>

        {/* --- Pinned inspection stage --- */}
        <div className="stand-stage relative mt-12 min-h-[70svh] overflow-hidden border-[3px] border-paper/30 lg:min-h-[76svh]">
          <div className="stand-stage-inner relative h-full min-h-[70svh] w-full lg:min-h-[76svh]">
            <HalftoneLayer tone="primary" fade className="opacity-25" />
            <div
              aria-hidden="true"
              className="stand-rays pointer-events-none absolute inset-[-30%] opacity-30 speed-rays speed-rays-primary"
            />

            {/* Drag-to-inspect surface: touch-pan-y keeps vertical
                scrolling native; horizontal drags spin the Stand */}
            <div
              aria-hidden="true"
              className="absolute inset-0 z-10 cursor-grab touch-pan-y active:cursor-grabbing"
              {...handlers}
            >
              <div className="pointer-events-none absolute inset-0">
                {webgl && nearViewport ? (
                  <StandScene
                    progressRef={progressRef}
                    pointerRef={pointerRef}
                    stepDrag={stepDrag}
                  />
                ) : (
                  <StandFallback />
                )}
              </div>

              <span className="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-center">
                <span className="label-chip rotate-[2deg] text-[0.5625rem]">
                  DRAG TO INSPECT
                </span>
              </span>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-4">
              <MetaLabel className="border-[3px] border-paper bg-ink px-3 py-2 text-paper">
                {inspectHint}
              </MetaLabel>
            </div>
          </div>
        </div>

        {/* --- Attribute table --- */}
        <div className="mt-14 max-w-4xl">
          <h3 className="stand-name font-display text-display-md text-primary uppercase">
            STAND STATS
          </h3>

          <dl className="mt-6 border-[3px] border-paper/40">
            {abilities.map((ability) => (
              <div
                key={ability.id}
                className="stand-stat flex flex-col gap-1 border-b-[3px] border-paper/25 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:gap-6"
              >
                <dt className="flex items-center gap-3 sm:w-72 sm:shrink-0">
                  <span className="grid h-9 w-9 shrink-0 place-items-center border-[3px] border-ink bg-primary font-display text-lg text-ink">
                    {ability.rank}
                  </span>
                  <span className="font-sans text-label font-bold tracking-[0.18em] text-paper uppercase">
                    {ability.name}
                  </span>
                </dt>
                <dd className="font-sans text-body text-paper/80">
                  {ability.detail}
                </dd>
              </div>
            ))}
          </dl>

          <p className={cn("mt-8 font-sans text-label text-paper/50 uppercase")}>
            {chapter.characterTheme}
          </p>
        </div>
      </div>
    </ChapterShell>
  );
}
