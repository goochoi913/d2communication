"use client";

import { cn } from "@/lib/utils";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { copy, stats } from "@/data/site";
import { BlockRise, Label, Unfold, container, foldBlock, redBlock, wide } from "./shared";

/**
 * Who we are, composed like the logo's "d": a red block carrying 50+, with grey panels
 * hanging beneath it that tuck under the red (the fold shadow), beside the introduction.
 */
export function About() {
  const [films, years, partners, crafts] = stats;

  return (
    <section id="about" className="scroll-mt-20 py-28 md:py-36">
      <div className={container}>
        <div className="grid grid-cols-12">
          <BlockRise
            style={redBlock}
            className="col-span-12 md:col-span-5"
            innerClassName="relative flex min-h-[460px] flex-col justify-between p-8 text-white md:min-h-[540px] md:p-10"
          >
            <Label tone="light">Who we are</Label>
            <div>
              <CountUp
                value={films.value}
                suffix={films.suffix}
                className={cn(
                  wide,
                  "block text-[clamp(7rem,12.5vw,13rem)] leading-[0.78] font-black tracking-[-0.03em] tabular-nums",
                )}
              />
              <p className="mt-7 text-[12px] font-semibold tracking-[0.24em] uppercase">{films.label}</p>
            </div>
          </BlockRise>

          <div className="col-span-12 flex flex-col justify-between bg-neutral-100 p-8 md:col-span-7 md:p-14">
            <Reveal>
              <p className="text-[clamp(1.45rem,2.05vw,2.15rem)] leading-[1.28] font-medium tracking-[-0.015em] text-neutral-950">
                {copy.intro}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-10 max-w-2xl text-[16px] leading-relaxed text-neutral-600">{copy.about}</p>
            </Reveal>
          </div>

          {/* Grey panels hanging under the red block: the fold strip sits where they tuck under it. */}
          {[years, partners].map((s, i) => (
            <Unfold
              key={s.label}
              delay={0.15 + i * 0.1}
              style={foldBlock(30)}
              className={cn("col-span-6", i === 0 ? "md:col-span-3" : "md:col-span-2")}
              innerClassName="flex min-h-[220px] flex-col justify-end p-8 md:p-10"
            >
              <CountUp
                value={s.value}
                suffix={s.suffix}
                className={cn(wide, "block text-[clamp(3rem,4.6vw,4.8rem)] leading-[0.85] font-black tabular-nums")}
              />
              <p className="mt-4 text-[11px] font-semibold tracking-[0.2em] text-neutral-900 uppercase">{s.label}</p>
            </Unfold>
          ))}

          <div className="col-span-12 flex flex-col justify-end border-b border-neutral-200 p-8 md:col-span-7 md:p-14 md:pb-10">
            <div className="flex items-end gap-6">
              <CountUp
                value={crafts.value}
                suffix={crafts.suffix}
                className={cn(wide, "block text-[clamp(3rem,4.6vw,4.8rem)] leading-[0.85] font-black text-[#CC0606] tabular-nums")}
              />
              <p className="pb-1 text-[11px] font-semibold tracking-[0.2em] uppercase">{crafts.label}</p>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2">
              {copy.crafts.map((craft) => (
                <li
                  key={craft}
                  className="rounded-br-[10px] border border-neutral-300 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase"
                >
                  {craft}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
