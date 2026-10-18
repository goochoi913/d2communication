"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";
import { D2Mark } from "@/components/brand/d2-mark";
import { Still } from "@/components/media/still";
import { CountUp } from "@/components/motion/count-up";
import { broadcasters, company, copy, stats } from "@/data/site";
import { Label, cond, useReducedMotionSafe } from "./shared";

/** One person, every craft — the brief's own list of skills, set as end credits. */
const ROLES = [
  "Story & development",
  "Written & directed by",
  "Produced by",
  "Director of photography",
  "Stills photography",
  "Edited by",
  "Visual effects",
];

/** Where the crawl starts and stops, as fractions of the viewport height. */
const START = 0.16;
const END = 0.58;

/**
 * End credits: the list crawls upward while the section is pinned, beside a still from
 * location. Travel is measured, so the roll always ends on the production card.
 */
export function Director() {
  const reduce = useReducedMotionSafe();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dims = useRef({ vh: 900, h: 2400 });
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => {
      const vh = window.innerHeight;
      const h = contentRef.current?.offsetHeight ?? 0;
      dims.current = { vh, h };
      setHeight(vh + Math.max(0, h - vh * (END - START)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const y = useTransform(scrollYProgress, (p) => {
    const { vh, h } = dims.current;
    const from = vh * START;
    const to = vh * END - h;
    return from + (to - from) * p;
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.16, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0.35, 1, 1, 0.5]);

  const credits = <Credits />;

  if (reduce) {
    return (
      <section id="director" ref={sectionRef} className="bg-black px-6 py-36 md:px-12" aria-label="The director">
        <div ref={contentRef}>{credits}</div>
      </section>
    );
  }

  return (
    <section
      id="director"
      ref={sectionRef}
      className="relative bg-black"
      style={{ height: height ?? "320vh" }}
      aria-label="The director"
    >
      <div className="sticky top-0 grid h-svh grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="relative hidden overflow-hidden md:block">
          <motion.div className="absolute inset-0" style={{ scale: imageScale, opacity: imageOpacity }}>
            <Still
              src="/images/hero/frozen-river-bw-1600.webp"
              alt="Jin Sam Choi's crew on location on a frozen Siberian river"
              sizes="45vw"
              className="size-full object-cover object-[36%_74%]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/20 to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
          <div className="absolute bottom-10 left-12">
            <Label className="text-[#bdbdbd]">On location · Siberia</Label>
          </div>
        </div>

        <div className="relative overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_16%,black_84%,transparent_100%)]">
          <motion.div ref={contentRef} style={{ y }} className="px-6 md:px-12 will-change-transform">
            {credits}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Credits() {
  return (
    <div className="mx-auto max-w-[46rem] pb-6 text-center">
      <Label className="text-[#9a9a9a]">The director</Label>
      <h2
        className={cn(cond, "mt-7 text-[clamp(4rem,7.2vw,8.4rem)] leading-[0.82] font-bold text-[#f2f2f2] uppercase")}
      >
        {company.founder.name}
      </h2>
      <p lang="ko" className="mt-5 text-[1.15rem] tracking-[0.3em] text-[#8a8a8a]">
        {company.founder.nameKo}
      </p>

      <CreditBlock className="mt-28">
        {ROLES.map((role) => (
          <CreditLine key={role} role={role}>
            {company.founder.name}
          </CreditLine>
        ))}
      </CreditBlock>

      <CreditBlock className="mt-24">
        <CreditLine role="Narration">Professional broadcast announcers</CreditLine>
        <CreditLine role="Broadcast partners">
          <span className="flex flex-col gap-3">
            {broadcasters.map((b) => (
              <span key={b}>{b}</span>
            ))}
          </span>
        </CreditLine>
      </CreditBlock>

      <dl className="mt-28 grid grid-cols-2 gap-x-10 gap-y-14 border-y border-white/10 py-14">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <CountUp
                value={s.value}
                suffix={s.suffix}
                className={cn(
                  cond,
                  "block text-[clamp(3.6rem,5.6vw,6.2rem)] leading-none font-bold text-[#f2f2f2] tabular-nums",
                )}
              />
              <span
                className={cn(cond, "mt-3 block text-[14px] font-medium tracking-[0.3em] text-[#8a8a8a] uppercase")}
              >
                {s.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <p className={cn(cond, "mt-24 text-left text-[clamp(1.35rem,1.65vw,1.75rem)] leading-[1.35] text-[#cfcfcf]")}>
        {copy.about}
      </p>

      <div className="mt-28 flex flex-col items-center gap-6">
        <D2Mark title="" className="h-14 w-auto" />
        <p className={cn(cond, "text-[15px] font-semibold tracking-[0.5em] text-[#ededed] uppercase")}>
          A {company.name} production
        </p>
      </div>
    </div>
  );
}

function CreditBlock({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-6", className)}>{children}</div>;
}

function CreditLine({ role, children }: { role: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 items-baseline gap-x-8">
      <span className={cn(cond, "text-right text-[14px] font-medium tracking-[0.32em] text-[#7a7a7a] uppercase")}>
        {role}
      </span>
      <span
        className={cn(
          cond,
          "text-left text-[clamp(1.25rem,1.6vw,1.6rem)] leading-tight font-semibold tracking-[0.14em] text-[#ededed] uppercase",
        )}
      >
        {children}
      </span>
    </div>
  );
}
