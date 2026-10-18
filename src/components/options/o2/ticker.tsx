"use client";

import { Fragment } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { broadcasters, categories, stats } from "@/data/site";
import { redBlock, useReducedMotionSafe, wide } from "./shared";

const ITEMS = [
  `${stats[0].value}${stats[0].suffix} ${stats[0].label}`,
  ...categories.map((c) => c.title),
  "History",
  "Science",
  "Technology",
  ...broadcasters,
];

/** A full-width red bar, like the logo's top stroke, carrying a slow ticker. */
export function Ticker() {
  const reduce = useReducedMotionSafe();
  const row = (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <Fragment key={item}>
          <span className={cn(wide, "px-8 text-[clamp(15px,1.25vw,20px)] font-extrabold whitespace-nowrap uppercase")}>
            {item}
          </span>
          <span aria-hidden className="size-2 shrink-0 bg-white/80" />
        </Fragment>
      ))}
    </div>
  );

  return (
    <div style={redBlock} className="relative flex h-[88px] items-center overflow-hidden text-white">
      <motion.div
        className="flex w-max"
        animate={reduce ? { x: "0%" } : { x: ["0%", "-50%"] }}
        transition={reduce ? { duration: 0 } : { duration: 60, ease: "linear", repeat: Infinity }}
      >
        {row}
        <div aria-hidden className="flex shrink-0">
          {row}
        </div>
      </motion.div>
    </div>
  );
}
