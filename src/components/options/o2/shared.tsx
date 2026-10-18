"use client";

import { useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import { LOGO_COLORS } from "@/components/brand/logo-geometry";

export const EASE = [0.22, 1, 0.36, 1] as const;

const noSubscription = () => () => {};

/** False while server-rendering and hydrating, true afterwards. */
export function useIsClient() {
  return useSyncExternalStore(noSubscription, () => true, () => false);
}

/**
 * The visitor's reduced-motion preference, reported only after hydration so the first
 * client render matches the server HTML exactly.
 */
export function useReducedMotionSafe() {
  const isClient = useIsClient();
  const reduce = useReducedMotion();
  return isClient && !!reduce;
}

/** Archivo's width axis at its widest — the display voice of this option. */
export const wide = "[font-variation-settings:'wdth'_125]";

/** The logo's letters: a vertical red gradient. */
export const redBlock: CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${LOGO_COLORS.red} 0%, ${LOGO_COLORS.redLight} 100%)`,
};

/**
 * The logo's folds: grey that tucks under red carries a dark strip on the edge it
 * tucks under (30 units against a 75-unit stroke). `edge` is that edge.
 */
export function foldBlock(strip = 26, edge: "top" | "left" = "top"): CSSProperties {
  const dir = edge === "top" ? "180deg" : "90deg";
  return {
    backgroundImage: `linear-gradient(${dir}, ${LOGO_COLORS.grayShadow} 0px, ${LOGO_COLORS.gray} ${strip}px, ${LOGO_COLORS.gray} 100%)`,
  };
}

/** Small tracked-caps label led by a red module, the logo's smallest block. */
export function Label({
  children,
  className,
  tone = "ink",
}: {
  children: ReactNode;
  className?: string;
  tone?: "ink" | "light";
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-[11px] font-semibold tracking-[0.24em] uppercase",
        tone === "ink" ? "text-neutral-900" : "text-white",
        className,
      )}
    >
      <span aria-hidden className="size-2.5 shrink-0" style={tone === "ink" ? redBlock : { background: "white" }} />
      {children}
    </p>
  );
}

/**
 * Reveals its child by raising it out of a clipped baseline, the way the logo's letters
 * rise in the intro. The unclipped outer span is what gets observed for in-view.
 */
export function Rise({
  children,
  className,
  delay = 0,
  duration = 1,
  animate,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  /** Drive manually instead of on scroll-into-view. */
  animate?: boolean;
}) {
  const reduce = useReducedMotionSafe();
  const variants: Variants = {
    hidden: { y: "105%" },
    shown: { y: "0%", transition: reduce ? { duration: 0 } : { duration, delay, ease: EASE } },
  };
  return (
    <motion.span
      className={cn("block overflow-hidden", className)}
      initial="hidden"
      {...(animate === undefined
        ? { whileInView: "shown", viewport: { once: true, amount: 0.5 } }
        : { animate: animate ? "shown" : "hidden" })}
    >
      <motion.span className="block" variants={variants}>
        {children}
      </motion.span>
    </motion.span>
  );
}

/**
 * A block revealed upwards from its bottom edge (clip), like a letter rising from the
 * baseline. `className` places the observed outer box; `innerClassName` styles the block.
 */
export function BlockRise({
  children,
  className,
  innerClassName,
  style,
  delay = 0,
}: {
  children?: ReactNode;
  className?: string;
  innerClassName?: string;
  style?: CSSProperties;
  delay?: number;
}) {
  const reduce = useReducedMotionSafe();
  const variants: Variants = {
    hidden: { clipPath: "inset(100% 0% 0% 0%)" },
    shown: {
      clipPath: "inset(0% 0% 0% 0%)",
      transition: reduce ? { duration: 0 } : { duration: 1.1, delay, ease: EASE },
    },
  };
  return (
    <motion.div className={className} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.25 }}>
      <motion.div className={cn("h-full", innerClassName)} style={style} variants={variants}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * A grey piece unfolding from the edge it hangs from, like the logo's tails.
 * `className` places the observed outer box; `innerClassName` styles the piece.
 */
export function Unfold({
  children,
  className,
  innerClassName,
  style,
  delay = 0,
  origin = "top",
}: {
  children?: ReactNode;
  className?: string;
  innerClassName?: string;
  style?: CSSProperties;
  delay?: number;
  origin?: "top" | "left";
}) {
  const reduce = useReducedMotionSafe();
  const transition = reduce ? { duration: 0 } : { duration: 0.9, delay, ease: EASE };
  const variants: Variants =
    origin === "top"
      ? { hidden: { scaleY: 0 }, shown: { scaleY: 1, transition } }
      : { hidden: { scaleX: 0 }, shown: { scaleX: 1, transition } };
  return (
    <motion.div className={className} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.3 }}>
      <motion.div
        className={cn("h-full", innerClassName)}
        style={{ ...style, transformOrigin: origin === "top" ? "50% 0%" : "0% 50%" }}
        variants={variants}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Primary action: a red block with the hook's single rounded corner. */
export const blockButton =
  "group inline-flex h-14 items-center gap-4 rounded-br-[18px] px-7 text-[12px] font-bold tracking-[0.2em] text-white uppercase transition-[filter,transform] duration-300 hover:brightness-110 active:translate-y-px";

/** Secondary action: an ink outline with the same corner. */
export const outlineButton =
  "group inline-flex h-14 items-center gap-4 rounded-br-[18px] border-2 border-neutral-950 px-7 text-[12px] font-bold tracking-[0.2em] text-neutral-950 uppercase transition-colors duration-300 hover:bg-neutral-950 hover:text-white";

export const container = "mx-auto w-full max-w-[1600px] px-6 md:px-10";
