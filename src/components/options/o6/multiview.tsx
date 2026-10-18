"use client";

import { MotionConfig } from "motion/react";

import { cn } from "@/lib/utils";
import { VideoPlayerProvider } from "@/components/media/video-player";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { geistMono, geistSans } from "./fonts";
import { FilterProvider } from "./shared";
import { Nav } from "./nav";
import { HeroStack } from "./hero";
import { Work } from "./work";
import { Featured } from "./featured";
import { About } from "./about";
import { Photography } from "./photography";
import { Footer } from "./footer";

/**
 * Option 6 — "Multiview". Modelled on a broadcast gallery's multiview wall: the first
 * screen is a bento of tiles that gives a busy client the whole picture at a glance —
 * the reel on air, every category, the numbers, and the contact.
 */
export function Multiview() {
  return (
    <SmoothScroll>
      {/* Reduced motion: motion skips transform animations; opacity fades remain. */}
      <MotionConfig reducedMotion="user">
        <VideoPlayerProvider tone="dark">
          <FilterProvider>
            <div
              className={cn(
                geistSans.variable,
                geistMono.variable,
                "min-h-dvh bg-[#e5e5e5] text-neutral-950 antialiased [font-family:var(--font-o6-sans)] selection:bg-[#CC0606] selection:text-white",
              )}
            >
              <Nav />
              <main>
                <HeroStack>
                  <Work />
                </HeroStack>
                <Featured />
                <About />
                <Photography />
              </main>
              <Footer />
            </div>
          </FilterProvider>
        </VideoPlayerProvider>
      </MotionConfig>
    </SmoothScroll>
  );
}
