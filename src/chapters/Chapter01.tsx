"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { ChapterShell } from "@/components/layout/ChapterShell";
import { DisplayText } from "@/components/typography/DisplayText";
import { MetaLabel } from "@/components/typography/MetaLabel";
import { HalftoneLayer } from "@/components/manga/HalftoneLayer";
import { SpeedLines } from "@/components/manga/SpeedLines";
import { SwatchStrip } from "@/components/manga/SwatchStrip";
import { PlaceholderArt } from "@/components/manga/PlaceholderArt";
import { useChapter } from "@/hooks/useChapter";
import { useChoreography } from "@/hooks/useChoreography";
import { useInViewport } from "@/hooks/useInViewport";
import { useMotionOK } from "@/hooks/useMotionOK";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { gsap, ScrollTrigger, EASE } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/lenis";
import { CHAPTERS } from "@/data/chapters";
import { content } from "@/data/content";
import { cn } from "@/lib/utils";

const MangaVolumeScene = dynamic(
  () => import("@/three/scenes/MangaVolumeScene"),
  { ssr: false, loading: () => null },
);

const FLOAT_PANELS = [
  {
    id: "p1",
    className: "left-[3%] top-[12%] w-[17vw] max-w-[230px] -rotate-6",
    art: "scene" as const,
    label: "PANEL 01",
  },
  {
    id: "p2",
    className: "right-[5%] top-[8%] w-[15vw] max-w-[210px] rotate-3",
    art: "strip" as const,
    label: "PANEL 02",
  },
  {
    id: "p3",
    className: "bottom-[14%] left-[8%] w-[14vw] max-w-[190px] rotate-4",
    art: "portrait" as const,
    label: "PANEL 03",
  },
  {
    id: "p4",
    className: "right-[7%] bottom-[16%] w-[16vw] max-w-[220px] -rotate-3",
    art: "blocks" as const,
    label: "PANEL 04",
  },
];

/** DOM stand-in when WebGL is unavailable (design.md §11.5). */
function VolumeFallback() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div
        className="w-[58vw] max-w-[280px] border-[5px] border-ink bg-primary p-5 shadow-comic-lg"
        style={{
          aspectRatio: "3 / 4",
          transform:
            "perspective(900px) rotateX(6deg) rotateY(-18deg) rotate(-4deg)",
        }}
      >
        <span className="block font-display text-4xl leading-none text-ink">
          BIZARRE
          <br />
          LOVE
        </span>
        <span className="label-chip mt-5 inline-block">VOL. 06</span>
        <span aria-hidden="true" className="mt-4 block h-2.5 w-full bg-impact" />
      </div>
    </div>
  );
}

/**
 * CHAPTER 01 — THE AWAKENING (design.md §6.1).
 * Explosive pinned entrance: cinematic load choreography, layered
 * manga panels, 3D volume, angular ink wipe into Chapter 02.
 */
export function Chapter01() {
  const chapter = CHAPTERS[0];
  const titleId = `${chapter.id}-title`;
  const handle = useChapter(chapter.index, titleId);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const motionOK = useMotionOK();

  /* Pointer → 3D parallax (data via refs, zero renders) */
  useEffect(() => {
    if (!motionOK) return;
    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [motionOK]);

  /* Selective 3D mounting (design.md §11.1) */
  const webgl = useWebGLSupport();
  const nearViewport = useInViewport(handle.ref, "50% 0px 50% 0px");

  useChoreography(contentRef, ({ q, mm }) => {
    /* ---------- Cinematic entrance (mount, once) ---------- */
    gsap
      .timeline({ defaults: { ease: EASE.settle } })
      .from(q(".hero-badge"), {
        scale: 2.4,
        opacity: 0,
        rotate: -20,
        duration: 0.7,
        ease: EASE.back,
      })
      .from(
        q(".hero-title .split-part"),
        {
          yPercent: 130,
          opacity: 0,
          rotate: 8,
          duration: 0.85,
          stagger: 0.035,
        },
        "-=0.3",
      )
      .from(q(".hero-headline"), { y: 44, opacity: 0, duration: 0.7 }, "-=0.5")
      .from(q(".hero-tagline"), { y: 26, opacity: 0, duration: 0.6 }, "-=0.45")
      .from(
        q(".float-panel"),
        {
          y: 150,
          opacity: 0,
          rotate: () => gsap.utils.random(-16, 16),
          duration: 0.9,
          stagger: 0.1,
          ease: EASE.back,
        },
        "-=0.7",
      )
      .from(
        q(".hero-sfx"),
        { scale: 0, opacity: 0, duration: 0.5, ease: EASE.back, stagger: 0.16 },
        "-=0.6",
      )
      .from(q(".hero-cue"), {
        opacity: 0,
        y: -18,
        duration: 0.5,
        clearProps: "transform",
      }, "-=0.1")
      .from(
        q(".hero-swatch span"),
        {
          scaleY: 0,
          opacity: 0,
          transformOrigin: "bottom",
          duration: 0.45,
          stagger: 0.06,
          ease: EASE.back,
        },
        "-=0.5",
      );

    /* ---------- Scroll choreography ---------- */
    mm.add("(min-width: 1024px)", () => {
      const stage = q(".hero-stage")[0];

      gsap
        .timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=170%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => {
              progressRef.current = self.progress;
            },
          },
          defaults: { ease: "none" },
        })
        .to(
          q(".float-panel"),
          {
            yPercent: (i: number) => [-70, 55, -40, 80][i] ?? -50,
            xPercent: (i: number) => [-30, 35, 25, -40][i] ?? 0,
            rotate: (i: number) => (i % 2 ? 12 : -10),
            stagger: 0.05,
          },
          0,
        )
        .to(q(".hero-copy"), { yPercent: -20, opacity: 0.92 }, 0)
        .to(q(".hero-title"), { xPercent: -3, scale: 1.05 }, 0)
        .to(q(".hero-halftone"), { scale: 1.3, opacity: 0.9 }, 0)
        .to(q(".hero-badge"), { rotate: 10, y: -36 }, 0)
        .to(q(".hero-rays"), { rotation: 30, scale: 1.15 }, 0)
        .to(
          q(".hero-wipe"),
          {
            clipPath:
              "polygon(-10% -10%, 110% -40%, 110% 110%, -10% 110%)",
            ease: "power2.in",
          },
          0.68,
        );
    });

    mm.add("(max-width: 1023px)", () => {
      const stage = q(".hero-stage")[0];

      ScrollTrigger.create({
        trigger: stage,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });

      gsap.to(q(".float-panel"), {
        yPercent: -22,
        stagger: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
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
      <div className="hero-stage relative flex min-h-svh items-center overflow-hidden px-6 pt-24 pb-28 lg:px-12 lg:pb-16">
        {/* Print textures */}
        <HalftoneLayer
          tone="ink"
          fade
          className="hero-halftone opacity-50"
        />
        <SpeedLines
          variant="rays"
          tone="ink"
          className="hero-rays opacity-[0.13]"
        />

        {/* 3D manga volume (or DOM fallback) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 lg:left-[48%]"
        >
          {webgl && nearViewport ? (
            <MangaVolumeScene
              progressRef={progressRef}
              pointerRef={pointerRef}
            />
          ) : (
            <VolumeFallback />
          )}
        </div>

        {/* Floating manga panels (desktop layering) */}
        {FLOAT_PANELS.map((p) => (
          <figure
            key={p.id}
            className={cn(
              "float-panel absolute z-10 hidden border-comic bg-paper shadow-comic lg:block",
              p.className,
            )}
          >
            <span className="label-chip absolute top-1.5 left-1.5 z-10 text-[0.5625rem]">
              {p.label}
            </span>
            <div className="aspect-[4/3] overflow-hidden">
              <PlaceholderArt variant={p.art} />
            </div>
          </figure>
        ))}

        {/* Copy */}
        <div className="hero-copy relative z-20 w-full lg:w-[54%]">
          <MetaLabel className="hero-badge label-chip inline-block -rotate-2">
            {content.ch01.edition} · Anniversary Edition
          </MetaLabel>

          <h1
            id={titleId}
            className="hero-title mt-5 overflow-hidden font-display text-display-xl text-ink uppercase"
          >
            <DisplayText text="BIZARRE LOVE" split="chars" />
          </h1>

          <p className="hero-headline mt-4 font-display text-display-md text-ink uppercase">
            OUR BIZARRE{" "}
            <span className="font-accent italic">ADVENTURE!</span>
          </p>

          <p className="hero-tagline mt-6 inline-block border-[3px] border-ink bg-ink px-4 py-2 font-sans text-label font-bold tracking-[0.18em] text-primary uppercase shadow-comic">
            {content.ch01.tagline}
          </p>
        </div>

        {/* SFX typography */}
        <span
          aria-hidden="true"
          className="hero-sfx pointer-events-none absolute top-[14%] right-[6%] z-10 rotate-12 font-display text-2xl text-ink opacity-75 text-outline-paper sm:text-4xl lg:text-5xl"
        >
          {content.ch01.sfx[0]}
        </span>
        <span
          aria-hidden="true"
          className="hero-sfx pointer-events-none absolute bottom-[22%] left-[6%] z-10 hidden -rotate-6 font-display text-5xl text-ink opacity-75 text-outline-paper lg:block"
        >
          {content.ch01.sfx[1]}
        </span>

        {/* Swatches (reference nod) */}
        <div className="hero-swatch absolute bottom-28 left-6 z-20 hidden lg:bottom-10 lg:left-12 lg:block">
          <SwatchStrip caption />
        </div>

        {/* Entry action */}
        <button
          type="button"
          onClick={() => scrollToTarget(`#${CHAPTERS[1].id}`)}
          className="hero-cue group absolute right-6 bottom-24 z-20 flex items-center gap-3 border-[3px] border-ink bg-paper px-4 py-3 shadow-comic transition-all duration-150 ease-settle hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none lg:right-12 lg:bottom-10"
        >
          <span className="font-sans text-label font-bold tracking-[0.18em] text-ink uppercase">
            {content.ch01.scrollCue}
          </span>
          <span aria-hidden="true" className="anim-nudge text-xl text-impact">
            ↓
          </span>
        </button>

        {/* Angular ink wipe → Chapter 02 */}
        <div
          aria-hidden="true"
          className="hero-wipe pointer-events-none absolute inset-0 z-30 bg-ink"
          style={{
            clipPath: "polygon(-10% 100%, 110% 100%, 110% 100%, -10% 100%)",
          }}
        />
      </div>
    </ChapterShell>
  );
}
