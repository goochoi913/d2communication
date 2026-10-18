"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

import { cn } from "@/lib/utils";
import { D2Mark } from "@/components/brand/d2-mark";
import { company, publicCategories, type CategorySlug } from "@/data/site";
import { cond } from "./shared";

export function Nav({ ready, onCategory }: { ready: boolean; onCategory: (slug: CategorySlug) => void }) {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > window.innerHeight * 0.85));

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 1, delay: ready ? 0.9 : 0 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500",
        solid ? "border-b border-white/10 bg-black/90 backdrop-blur-md" : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1760px] items-center justify-between px-6 md:px-12">
        <a href="#top" className="flex items-center gap-3.5" aria-label={`${company.name}, home`}>
          <D2Mark title="" className="h-[22px] w-auto" />
          <span className={cn(cond, "text-[15px] font-semibold tracking-[0.32em] text-[#ededed] uppercase")}>
            {company.name}
          </span>
        </a>
        <ul
          className={cn(cond, "hidden items-center gap-9 text-[15px] font-medium tracking-[0.18em] uppercase lg:flex")}
        >
          {publicCategories.map((c) => (
            <li key={c.slug}>
              <a
                href={c.slug === "photography" ? "#stills" : "#programme"}
                onClick={() => onCategory(c.slug)}
                className="text-[#a3a3a3] transition-colors hover:text-white"
              >
                {c.name}
              </a>
            </li>
          ))}
          <li>
            <a href="#director" className="text-[#a3a3a3] transition-colors hover:text-white">
              About
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="border border-white/40 px-4 py-2 text-white transition-colors hover:border-white hover:bg-white hover:text-black"
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </motion.header>
  );
}
