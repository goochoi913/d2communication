"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

export const PAPER = "#f4f3ef";
export const INK = "#0a0a0a";
/** Tungsten-light accent, used only for tiny details. */
export const TUNGSTEN = "#e8b04b";

export const container = "mx-auto w-full max-w-[1680px] px-6 md:px-10 xl:px-14";

/** Instrument Serif italic for emphasis words inside Inter Tight headlines. */
export const serif = "[font-family:var(--font-o1-serif)] font-normal italic tracking-[-0.02em]";

export function Em({ children, className }: { children: ReactNode; className?: string }) {
  return <em className={cn(serif, className)}>{children}</em>;
}

/** "(01) — Who we are" style section label. */
export function SectionLabel({
  index,
  children,
  className,
}: {
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("flex items-center gap-3 text-[12px] font-medium tracking-[0.16em] uppercase", className)}>
      {index ? <span className="tabular-nums opacity-45">({index})</span> : null}
      <span aria-hidden className="h-px w-8 bg-current opacity-30" />
      <span>{children}</span>
    </p>
  );
}

/** Seamless horizontal marquee driven by motion (no global CSS keyframes needed). */
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  className,
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className={cn(
        "overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className,
      )}
    >
      <motion.div
        className="flex w-max"
        animate={reduce ? undefined : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
