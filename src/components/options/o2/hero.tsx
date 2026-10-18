"use client";

import { useRef, type CSSProperties, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { LuArrowDown, LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { D2LogoScroll } from "@/components/brand/d2-logo-animated";
import { useVideoPlayer } from "@/components/media/video-player";
import { showreel, stats } from "@/data/site";
import { EASE, Rise, blockButton, container, outlineButton, redBlock, useReducedMotionSafe, wide } from "./shared";

/* Logo geometry in viewBox units (636 × 506): the artwork's edges and the shared baseline. */
const VB_W = 636;
const VB_H = 506;
const ART_LEFT = 19.4;
const ART_TOP = 19;
const BASELINE = 305.2;
const ART_BOTTOM = 486;
const D_RIGHT = 285.6;
const TWO_LEFT = 351.8;
const ART_RIGHT = 616.8;

/** Vertical position of a logo y-coordinate inside the hero row. */
const ys = (u: number) => `calc(var(--logo-h) * ${u / VB_H})`;
/** Horizontal position of a logo x-coordinate, with the artwork's left edge on the grid. */
const xs = (u: number) => `calc(var(--logo-w) * ${(u - ART_LEFT) / VB_W})`;

const HEADLINE = ["Documentary", "storytelling", "for broadcast,", "brands &", "the stage."];
const LINE = "#e2e2e2";
const films = stats[0];

export function Hero({
  slotRef,
  ready,
  showLogo,
}: {
  slotRef: RefObject<HTMLDivElement | null>;
  ready: boolean;
  showLogo: boolean;
}) {
  const { open } = useVideoPlayer();
  const reduce = useReducedMotionSafe();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  // The folds tuck under the red within the first stretch of scroll, while the logo is in view.
  const fold = useTransform(p, [0.02, 0.32], [0, 1]);
  const logoY = useTransform(p, [0, 1], [0, 260]);
  const linesOpacity = useTransform(p, [0, 0.35], [1, 0]);
  const textY = useTransform(p, [0, 1], [0, -70]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={
        {
          "--logo-w": "min(46vw, 820px)",
          "--logo-h": `calc(var(--logo-w) * ${VB_H / VB_W})`,
        } as CSSProperties
      }
    >
      <div className={cn(container, "flex min-h-[calc(100svh-88px)] items-center pt-24 pb-16")}>
        <div className="relative w-full" style={{ height: "var(--logo-h)" }}>
          <ConstructionLines ready={ready} opacity={linesOpacity} instant={reduce} />

          {/* The logo itself: the intro lands here, then the folds tuck away as you scroll. */}
          <motion.div
            ref={slotRef}
            aria-hidden={!showLogo}
            className="absolute top-0"
            style={{
              y: logoY,
              left: `calc(var(--logo-w) * ${-ART_LEFT / VB_W})`,
              width: "var(--logo-w)",
              opacity: showLogo ? 1 : 0,
            }}
          >
            <D2LogoScroll progress={fold} effect="fold" className="block w-full" />
          </motion.div>

          <motion.div
            style={{ y: textY, left: `calc(${xs(ART_RIGHT)} + clamp(40px, 4.5vw, 88px))` }}
            className="absolute inset-y-0 right-0"
          >
            {/* Cap line to baseline: the headline stands on the logo's baseline. */}
            <div
              className="absolute inset-x-0 flex flex-col justify-between"
              style={{ top: ys(ART_TOP), height: `calc(var(--logo-h) * ${(BASELINE - ART_TOP) / VB_H})` }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: ready ? 1 : 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.8, delay: 0.25 }}
                className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.24em] text-neutral-500 uppercase"
              >
                <span aria-hidden className="size-2.5" style={redBlock} />
                Production company of director Jin Sam Choi
              </motion.p>
              <h1
                className={cn(
                  wide,
                  "-mb-[0.1em] text-[clamp(2.2rem,3.65vw,3.3rem)] leading-[0.92] font-black tracking-[-0.01em] uppercase",
                )}
              >
                {HEADLINE.map((line, i) => (
                  <Rise key={line} animate={ready} delay={0.2 + i * 0.07} duration={1.05} className="pb-[0.04em]">
                    {line}
                  </Rise>
                ))}
              </h1>
            </div>

            {/* Baseline to the foot of the tails: the supporting copy and actions. */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={reduce ? { duration: 0 } : { duration: 0.9, delay: 0.65, ease: EASE }}
              className="absolute inset-x-0 flex flex-col justify-between"
              style={{
                top: `calc(${ys(BASELINE)} + clamp(18px, 2.2vw, 34px))`,
                bottom: `calc(var(--logo-h) - ${ys(ART_BOTTOM)})`,
              }}
            >
              <div className="flex items-start gap-5">
                <span
                  className={cn(wide, "text-[clamp(2.4rem,3.4vw,3.6rem)] leading-[0.78] font-black text-[#CC0606] tabular-nums")}
                >
                  {films.value}
                  {films.suffix}
                </span>
                <p className="max-w-[27rem] text-[clamp(14px,1.08vw,17px)] leading-relaxed text-neutral-600">
                  documentaries and films — from the Joseon court archives to six weeks on the Siberian ice — developed,
                  shot and finished under one roof.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => open(showreel)} style={redBlock} className={blockButton}>
                  <LuPlay className="size-4 fill-current" />
                  Watch showreel
                  <span className="text-white/70 tabular-nums">{showreel.runtime}</span>
                </button>
                <a href="#work" className={outlineButton}>
                  See the work
                  <LuArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Hairline construction lines taken from the logo's own edges and baseline. */
function ConstructionLines({
  ready,
  opacity,
  instant,
}: {
  ready: boolean;
  opacity: MotionValue<number>;
  instant: boolean;
}) {
  const horizontals = [ART_TOP, BASELINE, ART_BOTTOM];
  const verticals = [ART_LEFT, D_RIGHT, TWO_LEFT, ART_RIGHT];
  return (
    <motion.div aria-hidden style={{ opacity }} className="pointer-events-none absolute inset-0">
      {horizontals.map((u, i) => (
        <motion.span
          key={`h${u}`}
          className="absolute h-px origin-left"
          style={{
            top: ys(u),
            left: "calc((100% - 100vw) / 2)",
            right: "calc((100% - 100vw) / 2)",
            background: `linear-gradient(90deg, transparent, ${LINE} 7%, ${LINE} 93%, transparent)`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: ready ? 1 : 0 }}
          transition={instant ? { duration: 0 } : { duration: 1.6, delay: 0.05 + i * 0.08, ease: EASE }}
        />
      ))}
      {verticals.map((u, i) => (
        <motion.span
          key={`v${u}`}
          className="absolute w-px origin-top"
          style={{
            left: xs(u),
            top: "-11vh",
            bottom: "-15vh",
            background: `linear-gradient(180deg, transparent, ${LINE} 24%, ${LINE} 76%, transparent)`,
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: ready ? 1 : 0 }}
          transition={instant ? { duration: 0 } : { duration: 1.6, delay: 0.1 + i * 0.07, ease: EASE }}
        />
      ))}
    </motion.div>
  );
}
