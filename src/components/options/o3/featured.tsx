"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Still } from "@/components/media/still";
import { useVideoPlayer } from "@/components/media/video-player";
import { videos } from "@/data/site";
import { Eyebrow, RedLine, serif } from "./shared";

/** The photograph's own film: black-and-white that comes into colour as it reaches the centre. */
export function Featured() {
  const video = videos.find((v) => v.id === "ice-road")!;
  const { open } = useVideoPlayer();
  const ref = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const gray = useTransform(scrollYProgress, [0.45, 1], [1, 0]);
  const filter = useMotionTemplate`grayscale(${gray})`;
  const scale = useTransform(scrollYProgress, [0, 1], [1.14, 1]);

  return (
    <section className="bg-neutral-950 py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex items-end justify-between gap-6">
          <Eyebrow>Featured documentary</Eyebrow>
          <Eyebrow className="hidden md:block">
            {video.client} · {video.year} · {video.runtime}
          </Eyebrow>
        </div>
        <RedLine className="mt-5" />

        <button
          ref={ref}
          type="button"
          onClick={() => open(video)}
          className="group relative mt-10 block aspect-[4/5] w-full cursor-pointer overflow-hidden bg-neutral-900 text-left md:aspect-[2.25/1]"
        >
          <motion.div className="absolute inset-0" style={{ scale, filter }}>
            <Still
              src="/images/hero/frozen-river-color-2560.webp"
              alt="Colour still: the crew prepares snowmobiles on the frozen river"
              className="size-full object-cover object-[50%_72%]"
            />
          </motion.div>
          <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/5" />
          <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-6 md:inset-x-12 md:bottom-12">
            <div>
              <h2 className={cn(serif, "text-[clamp(3rem,6vw,6.5rem)] leading-[0.9] font-light text-white")}>Ice Road</h2>
              <p className={cn(serif, "mt-3 text-[clamp(1.2rem,1.8vw,1.9rem)] text-white/85 italic")}>
                A Winter on the Siberian River
              </p>
            </div>
            <span className="relative grid size-20 shrink-0 place-items-center rounded-full border border-white/50 text-white backdrop-blur-sm transition-all duration-500 group-hover:scale-105 group-hover:border-white group-hover:bg-white group-hover:text-neutral-950 md:size-28">
              <LuPlay className="ml-1 size-6 fill-current md:size-8" />
            </span>
          </div>
        </button>

        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <p className={cn(serif, "text-[1.6rem] leading-snug font-light text-neutral-200 md:col-span-6")}>
            {video.description}
          </p>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 text-sm md:col-span-5 md:col-start-8 md:grid-cols-3">
            {[
              ["Broadcaster", video.client],
              ["Year", String(video.year)],
              ["Runtime", video.runtime],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase">{k}</dt>
                <dd className="mt-2 text-neutral-200">{v}</dd>
              </div>
            ))}
            <div className="col-span-2 md:col-span-3">
              <dt className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase">Role</dt>
              <dd className="mt-2 text-neutral-200">{video.role}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
