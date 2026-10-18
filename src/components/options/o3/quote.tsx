"use client";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { broadcasters, copy } from "@/data/site";
import { serif } from "./shared";

export function Quote() {
  return (
    <section className="border-t border-white/10 py-32 md:py-44">
      <Reveal>
        <figure className="mx-auto max-w-5xl px-6 text-center">
          <span aria-hidden className={cn(serif, "block h-16 text-[8rem] leading-none text-[#CC0606] md:h-20")}>
            “
          </span>
          <blockquote className={cn(serif, "text-[clamp(1.9rem,3.6vw,3.7rem)] leading-[1.16] font-light italic")}>
            {copy.quote.text}
          </blockquote>
          <figcaption className="mt-10 text-[11px] tracking-[0.34em] text-neutral-400 uppercase">
            {copy.quote.by}, Director & Producer
          </figcaption>
        </figure>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="mx-auto mt-28 max-w-[1200px] px-6">
          <p className="text-center text-[10px] tracking-[0.36em] text-neutral-500 uppercase">Broadcast on</p>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
            {broadcasters.map((b) => (
              <li key={b} className={cn(serif, "text-[1.9rem] text-neutral-300")}>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
