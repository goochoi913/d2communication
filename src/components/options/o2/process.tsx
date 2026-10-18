"use client";

import { motion } from "motion/react";
import type { IconType } from "react-icons";
import { LuCamera, LuClapperboard, LuFilm, LuScrollText } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { services } from "@/data/site";
import { EASE, Label, Rise, container, foldBlock, redBlock, useReducedMotionSafe, wide } from "./shared";

const ICONS: Record<(typeof services)[number]["key"], IconType> = {
  develop: LuScrollText,
  direct: LuClapperboard,
  camera: LuCamera,
  post: LuFilm,
};

/**
 * The process as a folded ribbon: red faces alternate with grey backs, and each grey
 * block steps down and carries the fold strip on the edge where it turns under the red.
 */
export function Process() {
  const reduce = useReducedMotionSafe();
  return (
    <section className="border-t border-neutral-200 py-24 md:py-32">
      <div className={container}>
        <div className="mb-14 grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 md:col-span-8">
            <Label>How we work</Label>
            <h2 className={cn(wide, "mt-6 text-[clamp(2.2rem,4vw,4.2rem)] leading-[0.9] font-black tracking-[-0.01em] uppercase")}>
              <Rise>From first idea</Rise>
              <Rise delay={0.08}>to final master.</Rise>
            </h2>
          </div>
          <Reveal className="col-span-12 md:col-span-4" delay={0.1}>
            <p className="text-[15px] leading-relaxed text-neutral-600">
              One director carries the film from research to delivery, so nothing is lost between the story and the
              screen.
            </p>
          </Reveal>
        </div>

        <ol className="grid gap-y-3 sm:grid-cols-2 lg:grid-cols-4 lg:pb-12">
          {services.map((s, i) => {
            const face = i % 2 === 0;
            const Icon = ICONS[s.key];
            return (
              <motion.li
                key={s.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={reduce ? { duration: 0 } : { duration: 0.9, delay: i * 0.1, ease: EASE }}
                style={face ? redBlock : foldBlock(26, "left")}
                className={cn(
                  "flex min-h-[340px] flex-col justify-between p-8 md:p-10",
                  face ? "text-white" : "text-neutral-950 lg:translate-y-12",
                  i === services.length - 1 && "rounded-br-[48px]",
                )}
              >
                <div className="flex items-start justify-between">
                  <span className={cn(wide, "text-[clamp(2.6rem,3.6vw,3.6rem)] leading-none font-black tabular-nums")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className={cn("size-6", face ? "text-white/85" : "text-neutral-800")} />
                </div>
                <div>
                  <h3 className={cn(wide, "text-[clamp(1.05rem,1.35vw,1.35rem)] leading-tight font-extrabold uppercase")}>
                    {s.title}
                  </h3>
                  <p className={cn("mt-4 text-[14px] leading-relaxed", face ? "text-white/90" : "text-neutral-800")}>
                    {s.body}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
