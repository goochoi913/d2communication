"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { D2Mark } from "@/components/brand/d2-mark";
import { publicCategories } from "@/data/site";
import { EASE } from "./shared";

const SMOOTH = "duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Full-width over the hero; folds into a floating blurred pill once the page moves. */
export function Nav({ ready }: { ready: boolean }) {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > 120));

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={ready ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: 0.55, ease: EASE }}
      className={cn("fixed inset-x-0 z-50 transition-[top,padding]", SMOOTH, compact ? "top-3 px-3" : "top-0 px-0")}
    >
      <nav
        className={cn(
          "mx-auto flex items-center justify-between gap-6 border transition-[max-width,height,padding,background-color,border-color,border-radius,box-shadow]",
          SMOOTH,
          compact
            ? "h-14 max-w-[1100px] rounded-full border-white/10 bg-neutral-950/65 pr-2 pl-5 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            : "h-20 max-w-[1680px] rounded-none border-transparent bg-transparent px-6 md:px-10 xl:px-14",
        )}
      >
        <a href="#top" className="flex shrink-0 items-center gap-3" aria-label="D2 Communication, home">
          <D2Mark title="" className="h-6 w-auto" />
          <span className="text-[15px] font-medium tracking-[-0.01em] text-white">D2 Communication</span>
        </a>

        <ul className="hidden items-center gap-7 text-[14px] text-white/70 lg:flex">
          {publicCategories.map((c) => (
            <li key={c.slug}>
              <a href={`#${c.slug}`} className="transition-colors duration-300 hover:text-white">
                {c.name}
              </a>
            </li>
          ))}
          <li>
            <a href="#about" className="transition-colors duration-300 hover:text-white">
              About
            </a>
          </li>
        </ul>

        <Button
          asChild
          className="h-10 shrink-0 rounded-full bg-white px-5 text-[14px] font-medium text-neutral-950 hover:bg-white/85"
        >
          <a href="#contact">Start a project</a>
        </Button>
      </nav>
    </motion.header>
  );
}
