"use client";

import type { IconType } from "react-icons";
import { LuAperture, LuClapperboard, LuLayers, LuScrollText } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { services } from "@/data/site";
import { Em, SectionLabel, container } from "./shared";

const ICONS: Record<(typeof services)[number]["key"], IconType> = {
  develop: LuScrollText,
  direct: LuClapperboard,
  camera: LuAperture,
  post: LuLayers,
};

export function Capabilities() {
  return (
    <section className="border-t border-white/10 bg-[#0a0a0a] text-[#f5f5f4]">
      <div className={cn(container, "py-28 md:py-40")}>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-12">
            <SectionLabel index="05">Capabilities</SectionLabel>
          </div>
          <Reveal className="md:col-span-8">
            <h2 className="text-[clamp(3rem,6vw,6.8rem)] leading-[0.9] font-medium tracking-[-0.055em]">
              From the first idea <Em>to the final grade.</Em>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex items-end md:col-span-3 md:col-start-10">
            <p className="text-[17px] leading-relaxed text-white/55">
              One team, one eye, end to end. Nothing is handed off between the story and the screen.
            </p>
          </Reveal>
        </div>

        <ol className="mt-20 grid border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const Icon = ICONS[s.key];
            return (
              <li
                key={s.key}
                className={cn(
                  "group border-b border-white/10 py-10 lg:border-b-0",
                  i > 0 && "lg:border-l lg:pl-8",
                  i % 2 === 1 && "sm:border-l sm:pl-8",
                  i < 3 && "lg:pr-8",
                )}
              >
                <Reveal delay={i * 0.08} className="flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-white/40 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <Icon className="size-6 text-white/45 transition-colors duration-500 group-hover:text-[#e8b04b]" />
                  </div>
                  <h3 className="mt-20 text-[clamp(1.6rem,2vw,2rem)] leading-tight font-medium tracking-[-0.035em]">
                    {s.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-white/55">{s.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
