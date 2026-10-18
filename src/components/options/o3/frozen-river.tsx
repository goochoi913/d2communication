"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { D2LogoAnimated } from "@/components/brand/d2-logo-animated";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";
import { VideoPlayerProvider } from "@/components/media/video-player";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { display, ui } from "./fonts";
import { Nav } from "./nav";
import { Hero } from "./hero";
import { Stats } from "./stats";
import { Featured } from "./featured";
import { Chapters } from "./chapters";
import { Photography } from "./photography";
import { Quote } from "./quote";
import { Contact } from "./contact";

/**
 * Option 3 — "Frozen River". Jin Sam Choi's own homepage concept, elevated: his
 * frozen-river photograph as a deep black-and-white with the red net left in colour,
 * serif type set where the sky is darkest, navigation at the top, a first-person voice.
 */
export function FrozenRiver() {
  const reduce = useReducedMotionSafe();
  const [introFinished, setIntroFinished] = useState(false);
  // Skip the logo intro entirely when motion is reduced.
  const introDone = introFinished || !!reduce;

  return (
    <SmoothScroll>
      <VideoPlayerProvider tone="dark">
        <div
          className={cn(
            display.variable,
            ui.variable,
            "min-h-dvh bg-neutral-950 text-neutral-50 antialiased [font-family:var(--font-o3-ui)] selection:bg-[#CC0606] selection:text-white",
          )}
        >
          <AnimatePresence>
            {!introDone && (
              <motion.div
                key="intro"
                className="fixed inset-0 z-[60] grid place-items-center bg-neutral-950"
                exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }}
              >
                <D2LogoAnimated
                  variant="draw"
                  speed={1.7}
                  className="w-24 md:w-28"
                  onComplete={() => setTimeout(() => setIntroFinished(true), 150)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Nav />
          <main>
            <Hero ready={introDone} />
            <Stats />
            <Featured />
            <Chapters />
            <Photography />
            <Quote />
          </main>
          <Contact />
        </div>
      </VideoPlayerProvider>
    </SmoothScroll>
  );
}
