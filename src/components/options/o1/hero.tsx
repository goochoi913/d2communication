"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { useVideoPlayer } from "@/components/media/video-player";
import { company, showreel } from "@/data/site";
import { ReelBackground } from "./reel-background";
import { EASE, Em, TUNGSTEN, container } from "./shared";

/** The resting frame: 46vw wide, 16:9, centred. */
const FRAME_W = 46;
const HALF_H = (FRAME_W * 9) / 16 / 2; // vw
const SIDE = (100 - FRAME_W) / 2; // vw
const GAP = 1.4; // vw between the frame and the headline
const FALLBACK_POSTER = "/images/hero/frozen-river-color-2560.webp";
/** The placeholder reel opens with title cards; start past them. */
const REEL_START = 75;
/** …and it is letterboxed scope inside a 16:9 file, so zoom past the bars. */
const REEL_OVERSCAN = 1.45;

/**
 * Scroll-expanding showreel (320vh, pinned). The reel sits full-size underneath and is
 * revealed through a window that opens to full bleed; the wheel is never hijacked.
 *   0 → 0.36     the window opens, the headline halves part
 *   0.30 → 0.44  play controls arrive
 *   0.545 → 1    the next section slides up over the reel like a sheet
 */
export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { open } = useVideoPlayer();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const framed = useTransform(p, [0, 0.36], [1, 0]);
  const clipPath = useMotionTemplate`inset(calc(${framed} * (50svh - ${HALF_H}vw)) calc(${framed} * ${SIDE}vw) round calc(${framed} * 28px))`;
  const videoScale = useTransform(p, [0, 0.36, 0.545, 1], [1.16, 1, 1, 0.94]);
  const dim = useTransform(p, [0.545, 1], [0, 0.7]);
  const topX = useTransform(p, [0, 0.32], ["0vw", "-24vw"]);
  const bottomX = useTransform(p, [0, 0.32], ["0vw", "24vw"]);
  const linesOpacity = useTransform(p, [0, 0.26], [1, 0]);
  const restingOpacity = useTransform(p, [0, 0.08], [1, 0]);
  const controlsOpacity = useTransform(p, [0.3, 0.42, 0.62, 0.74], [0, 1, 1, 0]);
  const controlsY = useTransform(p, [0.3, 0.42], [28, 0]);

  return (
    <section id="top" ref={ref} className="relative z-0 h-[320vh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-[#0a0a0a]">
        {/* The reel */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.1, ease: EASE }}
        >
          <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath }}>
            <motion.div className="absolute inset-0" style={{ scale: videoScale }}>
              <ReelBackground
                youtubeId={showreel.youtubeId}
                poster={showreel.poster ?? FALLBACK_POSTER}
                start={REEL_START}
                overscan={REEL_OVERSCAN}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/35" />
            <motion.div className="absolute inset-0 bg-black" style={{ opacity: dim }} />
          </motion.div>
        </motion.div>

        {/* Labels pinned to the resting frame's corners */}
        <motion.div style={{ opacity: restingOpacity }} className="pointer-events-none absolute inset-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.1 }}
            className="absolute flex items-center justify-between text-[11px] font-medium tracking-[0.16em] text-white/85 uppercase"
            style={{
              top: `calc(50svh - ${HALF_H}vw + 18px)`,
              left: `calc(${SIDE}vw + 20px)`,
              right: `calc(${SIDE}vw + 20px)`,
            }}
          >
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full" style={{ backgroundColor: TUNGSTEN }} />
              Showreel 2026
            </span>
            <span className="tabular-nums">{showreel.runtime}</span>
          </motion.div>
        </motion.div>

        {/* Headline, split around the frame */}
        <motion.h1 style={{ opacity: linesOpacity }} className="pointer-events-none absolute inset-0">
          <span
            className={cn(container, "absolute inset-x-0 block")}
            style={{ bottom: `calc(50svh + ${HALF_H + GAP}vw)` }}
          >
            <motion.span
              style={{ x: topX }}
              className="block text-[8.6vw] leading-[0.84] font-medium tracking-[-0.058em]"
            >
              <Rise ready={ready} delay={0.35}>
                True stories,
              </Rise>
            </motion.span>
          </span>
          <span
            className={cn(container, "absolute inset-x-0 flex justify-end")}
            style={{ top: `calc(50svh + ${HALF_H + GAP}vw)` }}
          >
            <motion.span
              style={{ x: bottomX }}
              className="block text-[8.6vw] leading-[0.98] font-medium tracking-[-0.058em]"
            >
              <Rise ready={ready} delay={0.5}>
                made for the <Em className="tracking-[-0.03em]">screen.</Em>
              </Rise>
            </motion.span>
          </span>
        </motion.h1>

        {/* Supporting copy in the free corners */}
        <motion.div style={{ opacity: restingOpacity }} className="pointer-events-none absolute inset-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.95, ease: EASE }}
            className={cn(container, "absolute inset-x-0 flex justify-end")}
            style={{ bottom: `calc(50svh + ${HALF_H + GAP}vw + 0.6vw)` }}
          >
            <p className="flex max-w-[300px] items-start gap-4 text-[15px] leading-snug text-white/60">
              <span className="text-[2.75rem] leading-[0.78] font-medium tracking-[-0.05em] text-white tabular-nums">
                50+
              </span>
              <span>documentaries and films for broadcasters, brands and the stage.</span>
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.05, ease: EASE }}
            className={cn(container, "absolute inset-x-0")}
            style={{ top: `calc(50svh + ${HALF_H + GAP}vw + 1.2vw)` }}
          >
            <p className="max-w-[230px] text-[15px] leading-snug text-white/60">
              The production company of director &amp; producer {company.founder.name}.
            </p>
          </motion.div>
        </motion.div>

        {/* Full-bleed controls */}
        <motion.div
          style={{ opacity: controlsOpacity, y: controlsY }}
          className="pointer-events-none absolute inset-0 grid place-items-center"
        >
          <button
            type="button"
            onClick={() => open(showreel)}
            className="group pointer-events-auto flex cursor-pointer items-center gap-4 rounded-full border border-white/20 bg-black/40 py-2 pr-7 pl-2 text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-colors duration-300 hover:bg-white hover:text-neutral-950"
          >
            <span className="grid size-14 place-items-center rounded-full bg-white text-neutral-950 transition-transform duration-300 group-hover:scale-95 group-hover:bg-neutral-950 group-hover:text-white">
              <LuPlay className="ml-0.5 size-5 fill-current" />
            </span>
            <span className="text-[17px] font-medium tracking-[-0.01em]">Play showreel</span>
            <span className="text-[15px] text-white/60 tabular-nums transition-colors group-hover:text-neutral-950/50">
              {showreel.runtime}
            </span>
          </button>
        </motion.div>
        <motion.div
          style={{ opacity: controlsOpacity }}
          className={cn(
            container,
            "pointer-events-none absolute inset-x-0 bottom-14 flex items-end justify-between gap-6 text-[11px] font-medium tracking-[0.16em] text-white/80 uppercase",
          )}
        >
          <span>Documentaries · Brand films · Performance</span>
          <span className="hidden md:block">Directed &amp; edited by {company.founder.name}</span>
        </motion.div>
      </div>
    </section>
  );
}

function Rise({ children, ready, delay }: { children: ReactNode; ready: boolean; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="block whitespace-nowrap"
        initial={{ y: "110%" }}
        animate={ready ? { y: "0%" } : {}}
        transition={{ duration: 1.25, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}
