"use client";

import { useEffect } from "react";
import { ChapterNavigator } from "@/components/navigation/ChapterNavigator";
import { ProgressBar } from "@/components/navigation/ProgressBar";
import { SkipLink } from "@/components/navigation/SkipLink";
import { SmoothScroll } from "./SmoothScroll";
import { SwatchStrip } from "@/components/manga/SwatchStrip";
import { MetaLabel } from "@/components/typography/MetaLabel";
import { initMotionOverride } from "@/lib/store";
import { useMotionOK } from "@/hooks/useMotionOK";
import { content } from "@/data/content";
import { Chapter01 } from "@/chapters/Chapter01";
import { Chapter02 } from "@/chapters/Chapter02";
import { Chapter03 } from "@/chapters/Chapter03";
import { Chapter04 } from "@/chapters/Chapter04";
import { Chapter05 } from "@/chapters/Chapter05";
import { Chapter06 } from "@/chapters/Chapter06";
import { Chapter07 } from "@/chapters/Chapter07";
import { Chapter08 } from "@/chapters/Chapter08";
import { Chapter09 } from "@/chapters/Chapter09";

/**
 * The whole experience (design.md §7): smooth scroll, progress,
 * navigator, grain overlay and the nine-chapter narrative.
 */
export function Experience() {
  const motionOK = useMotionOK();

  useEffect(() => {
    initMotionOverride();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = motionOK ? "full" : "reduced";
  }, [motionOK]);

  return (
    <>
      <SkipLink />
      <SmoothScroll />
      <ProgressBar />
      <ChapterNavigator />

      {/* Global print grain — procedural, zero downloads.
          Phone perf: full-screen mix-blend-multiply forces an extra
          compositing pass over every frame, so the blend is enabled
          from lg up only; below that the 5% grain draws plain. */}
      <div
        aria-hidden="true"
        className="paper-grain pointer-events-none fixed inset-0 z-[45] opacity-[0.05] lg:mix-blend-multiply"
      />

      <main id="main" className="relative w-full">
        <Chapter01 />
        <Chapter02 />
        <Chapter03 />
        <Chapter04 />
        <Chapter05 />
        <Chapter06 />
        <Chapter07 />
        <Chapter08 />
        <Chapter09 />
      </main>

      <footer className="relative border-t-[3px] border-ink bg-ink px-6 py-10 text-paper lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-3xl text-primary uppercase">
              BIZARRE LOVE
            </p>
            <MetaLabel className="mt-2 block text-paper/70">
              {content.ch09.footerNote}
            </MetaLabel>
          </div>
          <SwatchStrip caption />
        </div>
      </footer>
    </>
  );
}
