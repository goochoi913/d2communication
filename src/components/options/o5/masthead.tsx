"use client";

import { useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";

import { cn } from "@/lib/utils";
import { D2LogoAnimated } from "@/components/brand/d2-logo-animated";
import { D2Mark } from "@/components/brand/d2-mark";
import { company, publicCategories, videos } from "@/data/site";
import { DoubleRule, EASE, frame, serif } from "./shared";

const LINKS = [
  ...publicCategories.map((c) => ({ href: `#${c.slug}`, label: c.name })),
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

const city = company.location.split(",")[0];
const years = videos.map((v) => v.year);
const span = `${Math.min(...years)}–${Math.max(...years)}`;

export function Masthead() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });
  const [compact, setCompact] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > 340));

  return (
    <>
      {/* Reading progress: the one red line that runs the length of the issue. */}
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-(--o5-red)"
        style={{ scaleX: progress }}
      />

      <motion.div
        initial={false}
        animate={{ y: compact ? "0%" : "-100%" }}
        transition={{ duration: 0.55, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 border-b border-(--o5-rule) bg-(--o5-paper)/90 backdrop-blur-md"
      >
        <div className={cn(frame, "flex h-14 items-center justify-between gap-8")}>
          <a href="#top" className="flex items-center gap-2.5" aria-label="D2 Communication, back to top">
            <D2Mark title="" className="h-[18px] w-auto" />
            <span className={cn(serif, "text-[1.3rem] leading-none font-medium tracking-[-0.01em]")}>{company.name}</span>
          </a>
          <NavList className="hidden gap-7 lg:flex" />
        </div>
      </motion.div>

      <header id="top" className={frame}>
        <div className="grid grid-cols-1 items-center gap-2 border-b border-(--o5-rule) py-3 text-[11px] font-medium tracking-[0.14em] text-(--o5-muted) uppercase md:grid-cols-3">
          <span>Documentary · Corporate · Performance Film</span>
          <span className={cn(serif, "hidden text-center text-[13px] tracking-normal normal-case italic md:block")}>
            The collected films of {company.founder.name}
          </span>
          <span className="hidden md:block md:text-right">October 2026</span>
        </div>

        <div className="grid items-center gap-6 py-7 md:grid-cols-[1fr_auto_1fr] md:py-9">
          <Ear figure="50+" className="hidden md:block">
            Films on record
          </Ear>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
            className={cn(
              serif,
              "flex items-center justify-center gap-[0.2em] text-[clamp(1.9rem,8.4vw,2.8rem)] leading-[0.9] font-medium tracking-[-0.025em] whitespace-nowrap md:text-[clamp(2.6rem,6.9vw,6.25rem)]",
            )}
          >
            <D2LogoAnimated variant="assemble" delay={0.35} className="h-[0.66em] w-auto shrink-0 translate-y-[0.02em]" />
            <span>D2 Communication</span>
          </motion.h1>
          <Ear figure={span} className="hidden text-right md:block">
            {city}, Korea
          </Ear>
        </div>

        <DoubleRule />
        <nav aria-label="Sections" className="border-b border-(--o5-rule)">
          <NavList className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 py-3.5 md:gap-x-9" />
        </nav>
      </header>
    </>
  );
}

/** Newspaper "ears": the small boxes either side of the nameplate. */
function Ear({ figure, children, className }: { figure: string; children: ReactNode; className?: string }) {
  return (
    <p className={className}>
      <span className={cn(serif, "block text-[2.1rem] leading-none font-light tracking-[-0.02em] tabular-nums")}>
        {figure}
      </span>
      <span className="mt-2 block text-[11px] font-medium tracking-[0.14em] whitespace-nowrap text-(--o5-muted) uppercase">
        {children}
      </span>
    </p>
  );
}

function NavList({ className }: { className?: string }) {
  return (
    <ul className={cn("text-[11.5px] font-semibold tracking-[0.15em] uppercase", className)}>
      {LINKS.map((l) => (
        <li key={l.href}>
          <a
            href={l.href}
            className="relative py-1 text-(--o5-ink) transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-(--o5-red) after:transition-transform after:duration-300 hover:text-(--o5-red) hover:after:scale-x-100"
          >
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
