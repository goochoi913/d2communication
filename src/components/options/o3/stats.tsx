"use client";

import { cn } from "@/lib/utils";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { copy, stats } from "@/data/site";
import { serif } from "./shared";

export function Stats() {
  return (
    <section id="about" className="relative border-t border-white/10 bg-neutral-950">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 px-6 md:grid-cols-4 md:px-10">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.08}
            className={cn("border-white/10 py-14 md:px-8 md:py-20", i > 0 && "md:border-l", i % 2 === 1 && "border-l md:border-l")}
          >
            <div className={cn("pl-5 md:pl-0", i % 2 === 0 && "pl-0")}>
              <CountUp
                value={s.value}
                suffix={s.suffix}
                className={cn(serif, "block text-[clamp(3.4rem,6vw,6.2rem)] leading-none font-light tabular-nums")}
              />
              <p className="mt-4 text-[11px] tracking-[0.28em] text-neutral-400 uppercase">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mx-auto max-w-[1600px] border-t border-white/10 px-6 py-6 md:px-10">
        <p className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] tracking-[0.32em] text-neutral-500 uppercase md:justify-between">
          {copy.crafts.map((craft) => (
            <span key={craft}>{craft}</span>
          ))}
        </p>
      </div>
    </section>
  );
}
