"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";
import { D2Mark } from "@/components/brand/d2-mark";
import { publicCategories } from "@/data/site";
import { EASE, redBlock, useReducedMotionSafe, wide } from "./shared";

export function Nav({ ready }: { ready: boolean }) {
  const reduce = useReducedMotionSafe();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 24));
  // The hero carries the big logo; the small mark joins the nav once it has scrolled away.
  const markOpacity = useTransform(scrollY, [260, 520], [0, 1]);
  const markWidth = useTransform(scrollY, [260, 520], [0, 48]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
      transition={reduce ? { duration: 0 } : { duration: 0.9, delay: 0.35, ease: EASE }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500",
        solid ? "bg-white shadow-[0_1px_0_0_rgb(0_0_0/0.08)]" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 md:px-10">
        <a href="#top" className="flex items-center" aria-label="D2 Communication, home">
          <motion.span style={{ opacity: markOpacity, width: markWidth }} className="block overflow-hidden">
            <D2Mark title="" className="h-7 w-auto max-w-none" />
          </motion.span>
          <span className={cn(wide, "text-[13px] font-extrabold tracking-[0.06em] uppercase")}>D2 Communication</span>
        </a>
        <ul className="hidden items-center gap-7 text-[11px] font-semibold tracking-[0.18em] uppercase lg:flex">
          {publicCategories.map((c) => (
            <li key={c.slug}>
              <a href={`#${c.slug}`} className="relative py-2 text-neutral-600 transition-colors hover:text-neutral-950">
                {c.name}
              </a>
            </li>
          ))}
          <li>
            <a href="#about" className="py-2 text-neutral-600 transition-colors hover:text-neutral-950">
              About
            </a>
          </li>
          <li>
            <a
              href="#contact"
              style={redBlock}
              className="inline-flex h-10 items-center rounded-br-[12px] px-5 text-white transition-[filter] hover:brightness-110"
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </motion.header>
  );
}
