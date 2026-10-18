"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { LuArrowDown, LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { YouTubeBackground } from "@/components/media/youtube-background";
import { useVideoPlayer } from "@/components/media/video-player";
import { company, showreel } from "@/data/site";
import { EASE, EASE_IN_OUT, FrameGuides, Label, RecDot, Timecode, cond, mono, useReducedMotionSafe } from "./shared";

/** Height of each letterbox bar that frames the viewport to 2.39:1 scope. */
const BAR = "max(0px, calc((100svh - 100vw / 2.39) / 2))";

export function Hero({ ready }: { ready: boolean }) {
  const reduce = useReducedMotionSafe();
  const { open: play } = useVideoPlayer();
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setOpen(true), reduce ? 0 : 120);
    return () => clearTimeout(t);
  }, [ready, reduce]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const pictureScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const barTransition = reduce ? "none" : "transform 1.7s cubic-bezier(0.7, 0, 0.2, 1)";

  return (
    <section
      id="top"
      ref={ref}
      className="relative h-svh min-h-[560px] overflow-hidden bg-black"
      style={{ "--bar": BAR } as CSSProperties}
      aria-label="Showreel"
    >
      <motion.div className="absolute inset-0" style={{ scale: pictureScale }}>
        <YouTubeBackground
          youtubeId={showreel.youtubeId}
          poster={showreel.poster ?? "/images/hero/frozen-river-color-2560.webp"}
          start={showreel.start}
        />
      </motion.div>

      {/* Grade: vignette and a floor for the titles */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[66%] bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

      {/* Letterbox: closed to a slit, then opening to scope */}
      <div
        className="absolute inset-x-0 top-0 z-10 h-[50.5svh] bg-black"
        style={{
          transform: open ? "translateY(calc(-50.5svh + var(--bar)))" : "translateY(0)",
          transition: barTransition,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 z-10 h-[50.5svh] bg-black"
        style={{
          transform: open ? "translateY(calc(50.5svh - var(--bar)))" : "translateY(0)",
          transition: barTransition,
        }}
      />

      {/* Everything inside the picture area */}
      <div className="absolute inset-x-0 top-[var(--bar)] bottom-[var(--bar)] z-20">
        <Appear show={open} delay={1.1}>
          <FrameGuides inset={28} />
          <div className="absolute top-12 left-12 flex items-center gap-3">
            <RecDot />
            <Label className="text-[#ededed]">Rec</Label>
            <Timecode className="ml-2 text-[12px] tracking-[0.12em] text-[#ededed]" />
          </div>
          <div className="absolute top-12 right-12 text-right">
            <Label className="text-[#cfcfcf]">Showreel · {showreel.runtime}</Label>
          </div>
        </Appear>

        <motion.div
          style={{ y: copyY, opacity: copyOpacity }}
          className="absolute inset-x-12 bottom-12 flex items-end justify-between gap-10"
        >
          <div>
            <h1
              className={cn(
                cond,
                "text-[clamp(4.25rem,10.4vw,12.5rem)] leading-[0.84] font-bold tracking-[-0.005em] text-[#f2f2f2] uppercase",
              )}
            >
              <Rise show={open} delay={1.0}>
                True stories
              </Rise>
              <Rise show={open} delay={1.12}>
                for the{" "}
                <span className="text-transparent [-webkit-text-stroke:1.5px_#f2f2f2] [filter:drop-shadow(0_2px_14px_rgba(0,0,0,0.45))]">
                  screen
                </span>
              </Rise>
            </h1>
            <Appear show={open} delay={1.6}>
              <p className={cn(mono, "mt-6 text-[12px] tracking-[0.2em] text-[#bdbdbd] uppercase")}>
                50+ documentaries & films <span className="mx-2 text-[#5f5f5f]">/</span> Broadcast · Brand · Performance{" "}
                <span className="mx-2 text-[#5f5f5f]">/</span> Directed by {company.founder.name}
              </p>
            </Appear>
          </div>

          <Appear show={open} delay={1.75}>
            <button
              type="button"
              onClick={() => play(showreel)}
              className="group flex shrink-0 cursor-pointer items-center gap-5 text-left"
            >
              <span className="grid size-[72px] place-items-center rounded-full border border-white/60 text-white transition-all duration-500 group-hover:scale-105 group-hover:border-white group-hover:bg-white group-hover:text-black">
                <LuPlay className="ml-1 size-6 fill-current" />
              </span>
              <span>
                <span className={cn(cond, "block text-[19px] font-semibold tracking-[0.24em] text-white uppercase")}>
                  Play showreel
                </span>
                <span className={cn(mono, "mt-1.5 block text-[11px] tracking-[0.2em] text-[#9a9a9a] uppercase")}>
                  {showreel.runtime.padStart(5, "0")} · Sound on
                </span>
              </span>
            </button>
          </Appear>
        </motion.div>
      </div>

      {/* Slate line in the lower letterbox bar */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex h-[var(--bar)] items-center justify-between px-12">
        <Appear show={open} delay={2}>
          <Label className="text-[#6f6f6f]">
            Prod. {company.name} <span className="mx-3 text-[#3a3a3a]">|</span> Dir. {company.founder.name}{" "}
            <span className="mx-3 text-[#3a3a3a]">|</span> {company.location}
          </Label>
        </Appear>
        <Appear show={open} delay={2.1}>
          <a href="#programme" className="group flex items-center gap-3">
            <Label className="text-[#8a8a8a] transition-colors group-hover:text-white">Now showing</Label>
            <LuArrowDown className="size-3.5 text-[#8a8a8a] transition-transform duration-500 group-hover:translate-y-0.5 group-hover:text-white" />
          </a>
        </Appear>
      </div>
    </section>
  );
}

function Rise({ children, show, delay }: { children: ReactNode; show: boolean; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.04em]">
      <motion.span
        className="block"
        initial={{ y: "102%" }}
        animate={show ? { y: "0%" } : { y: "102%" }}
        transition={{ duration: 1.25, delay: show ? delay : 0, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Appear({ children, show, delay }: { children: ReactNode; show: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 1.1, delay: show ? delay : 0, ease: EASE_IN_OUT }}
    >
      {children}
    </motion.div>
  );
}
