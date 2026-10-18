"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils";
import { VideoPlayerProvider } from "@/components/media/video-player";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import type { CategorySlug } from "@/data/site";
import { condFont, monoFont } from "./fonts";
import { Grain, useReducedMotionSafe } from "./shared";
import { TitleSequence } from "./title-sequence";
import { Nav } from "./nav";
import { Hero } from "./hero";
import { Slate } from "./slate";
import { Programme, type ProgrammeFilter } from "./programme";
import { Feature } from "./feature";
import { Reels } from "./reels";
import { Stills } from "./stills";
import { Director } from "./director";
import { BroadcastOn } from "./broadcast-on";
import { Footer } from "./footer";

/**
 * Option 4 — "Premiere". The site as a screening: opening titles, a letterboxed showreel,
 * the filmography as a festival programme, a feature presentation, the categories as reels,
 * and the director's credits rolling at the end.
 */
export function Premiere() {
  const reduce = useReducedMotionSafe();
  const [introFinished, setIntroFinished] = useState(false);
  const introDone = introFinished || !!reduce;
  const finishIntro = useCallback(() => setIntroFinished(true), []);

  const [filter, setFilter] = useState<ProgrammeFilter>("all");
  const onCategory = useCallback((slug: CategorySlug) => {
    if (slug !== "photography") setFilter(slug);
  }, []);

  return (
    <SmoothScroll>
      <VideoPlayerProvider tone="dark" className="rounded-none">
        <div
          className={cn(
            condFont.variable,
            monoFont.variable,
            "min-h-dvh bg-black text-[#ededed] antialiased [font-family:var(--font-o4-cond)] selection:bg-[#CC0606] selection:text-white",
          )}
        >
          <AnimatePresence>{!introDone && <TitleSequence key="titles" onDone={finishIntro} />}</AnimatePresence>
          <Grain />
          <Nav ready={introDone} onCategory={onCategory} />
          <main>
            <Hero ready={introDone} />
            <Slate />
            <Programme filter={filter} onFilter={setFilter} />
            <Feature />
            <Reels onCategory={onCategory} />
            <Stills />
            <Director />
            <BroadcastOn />
          </main>
          <Footer onCategory={onCategory} />
        </div>
      </VideoPlayerProvider>
    </SmoothScroll>
  );
}
