"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** The logo's red: the only colour on the site besides the photographs. */
export const RED = "#CC0606";

/** The display face chosen in edit mode (Cormorant Garamond and MaruBuri by default). */
export const serif = "font-display";

/** Small spaced capitals above headings. */
export const eyebrow = "text-xs font-medium tracking-[0.28em] text-neutral-400 uppercase";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn(eyebrow, className)}>{children}</p>;
}

/** The red line from the photograph, drawn across the page as a section rule. */
export function RedLine({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      aria-hidden
      className={cn("h-px origin-left", className)}
      style={{ backgroundColor: RED }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 1.6, delay, ease: EASE }}
    />
  );
}

/** Roman numerals for the chapters. */
export const NUMERALS = ["I", "II", "III", "IV", "V", "VI"];
