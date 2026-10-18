"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

import { cn } from "@/lib/utils";
import { D2Mark } from "@/components/brand/d2-mark";
import { company, publicCategories } from "@/data/site";
import { EASE, useWorkFilter, type WorkFilter } from "./shared";

export function Nav() {
  const { setFilter } = useWorkFilter();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500",
        scrolled ? "bg-[#e5e5e5]/85 shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-4 md:px-5">
        <a href="#top" className="flex items-center gap-2.5" aria-label={`${company.name}, home`}>
          <D2Mark title="" className="h-[22px] w-auto" />
          <span className="text-[15px] font-semibold tracking-[-0.02em]">{company.name}</span>
        </a>

        <ul className="hidden items-center gap-0.5 rounded-full bg-white/75 p-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.04] backdrop-blur lg:flex">
          {publicCategories.map((c) => (
            <li key={c.slug}>
              <a
                href={`#${c.slug}`}
                onClick={() => c.slug !== "photography" && setFilter(c.slug as WorkFilter)}
                className="block rounded-full px-3.5 py-1.5 text-[13px] text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
              >
                {c.name}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#about"
              className="block rounded-full px-3.5 py-1.5 text-[13px] text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
            >
              About
            </a>
          </li>
        </ul>

        <a
          href="#contact"
          className="inline-flex h-9 items-center rounded-full bg-[#CC0606] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#b00505]"
        >
          Contact
        </a>
      </nav>
    </motion.header>
  );
}
