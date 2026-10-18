"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

import { cn } from "@/lib/utils";
import { D2Mark } from "@/components/brand/d2-mark";
import { publicCategories } from "@/data/site";

export function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > window.innerHeight * 0.9));

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        solid
          ? "border-b border-white/10 bg-neutral-950/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-6 md:px-10">
        <a href="#top" className="flex items-center gap-3" aria-label="D2 Communication, home">
          <D2Mark title="" className="h-6 w-auto" />
          <span className="text-[12px] font-medium tracking-[0.28em] text-white uppercase">D2 Communication</span>
        </a>
        <ul className="hidden items-center gap-8 text-[13px] text-neutral-200 lg:flex">
          {publicCategories.map((c) => (
            <li key={c.slug}>
              <a href={`#${c.slug}`} className="transition-colors hover:text-white">
                {c.name}
              </a>
            </li>
          ))}
          <li>
            <a href="#about" className="transition-colors hover:text-white">
              About
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="rounded-full border border-white/30 px-4 py-2 text-white transition-colors hover:border-white hover:bg-white hover:text-neutral-950"
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </motion.header>
  );
}
