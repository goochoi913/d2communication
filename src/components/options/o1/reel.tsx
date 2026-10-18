"use client";

import { useCallback, useState } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { VideoPlayerProvider } from "@/components/media/video-player";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { sans, serifFace } from "./fonts";
import { Preloader } from "./preloader";
import { Nav } from "./nav";
import { Hero } from "./hero";
import { Intro } from "./intro";
import { Featured } from "./featured";
import { Categories } from "./categories";
import { Works } from "./works";
import { Broadcasters } from "./broadcasters";
import { Capabilities } from "./capabilities";
import { Contact } from "./contact";

/**
 * Option 1 — "Reel". A showreel-led modern studio site with no constraints from the logo or
 * the original mockup: the reel opens as a framed film and grows to full screen on scroll,
 * a paper mid-section carries the story, the work and the featured film, and the page
 * closes in the dark with the call to action.
 */
export function Reel() {
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const ready = loaded || !!reduce;
  const onLoaded = useCallback(() => setLoaded(true), []);

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <VideoPlayerProvider tone="dark">
          <div
            className={cn(
              sans.variable,
              serifFace.variable,
              "min-h-dvh bg-[#0a0a0a] text-[#f5f5f4] antialiased [font-family:var(--font-o1-sans)] selection:bg-[#e8b04b] selection:text-[#0a0a0a]",
            )}
          >
            {reduce ? null : <Preloader onDone={onLoaded} />}
            <Nav ready={ready} />
            <main>
              <Hero ready={ready} />
              <Intro />
              <Featured />
              <Categories />
              <Works />
              <Broadcasters />
              <Capabilities />
            </main>
            <Contact />
          </div>
        </VideoPlayerProvider>
      </SmoothScroll>
    </MotionConfig>
  );
}
