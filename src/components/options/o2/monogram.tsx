"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { VideoPlayerProvider } from "@/components/media/video-player";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { archivo } from "./fonts";
import { Intro } from "./intro";
import { Nav } from "./nav";
import { Hero } from "./hero";
import { Ticker } from "./ticker";
import { About } from "./about";
import { Featured } from "./featured";
import { Categories } from "./categories";
import { Works } from "./works";
import { Process } from "./process";
import { Footer } from "./footer";
import { useIsClient, useReducedMotionSafe } from "./shared";

/**
 * Option 2 — "Monogram". The d2 logo is the brand experience: its blocks, red gradient,
 * grey folds and single rounded corner build every section on a white page.
 */
export function Monogram() {
  const isClient = useIsClient();
  const reduce = useReducedMotionSafe();
  const slotRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<"assemble" | "travel" | "done">("assemble");

  const heroIn = stage !== "assemble" || !!reduce;
  const introDone = stage === "done" || !!reduce;

  return (
    <SmoothScroll>
      <VideoPlayerProvider tone="dark">
        <div
          className={cn(
            archivo.variable,
            "min-h-dvh bg-white text-neutral-950 antialiased [font-family:var(--font-o2)] selection:bg-[#CC0606] selection:text-white",
          )}
        >
          {!introDone && (
            <Intro
              slotRef={slotRef}
              play={isClient}
              onTravel={() => setStage("travel")}
              onDone={() => setStage("done")}
            />
          )}
          <Nav ready={heroIn} />
          <main>
            <Hero slotRef={slotRef} ready={heroIn} showLogo={introDone} />
            <Ticker />
            <About />
            <Featured />
            <Categories />
            <Works />
            <Process />
          </main>
          <Footer />
        </div>
      </VideoPlayerProvider>
    </SmoothScroll>
  );
}
