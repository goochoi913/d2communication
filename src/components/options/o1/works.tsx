"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { LuArrowRight, LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Still } from "@/components/media/still";
import { useVideoPlayer } from "@/components/media/video-player";
import { categoryBySlug, smallPoster, videos, type Video } from "@/data/site";
import { Em, SectionLabel, container } from "./shared";

const PICKS = [
  "royal-archives",
  "building-giants",
  "new-year-gala",
  "silicon-peninsula",
  "fan-dance",
  "city-never-sleeps",
  "glacier-archive",
  "precision",
];

/**
 * Pinned horizontal gallery: vertical scroll moves the row sideways at 1:1 speed. The
 * section's height is set from the measured track width, so nothing is scroll-jacked.
 */
export function Works() {
  const picks = PICKS.map((id) => videos.find((v) => v.id === id)!);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform([scrollYProgress, distance], ([p, d]: number[]) => -p * d);
  const [active, setActive] = useState(1);

  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setActive(Math.min(picks.length, Math.floor(p * picks.length) + 1)),
  );

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;
      const d = Math.max(0, track.scrollWidth - window.innerWidth);
      distance.set(d);
      section.style.height = `calc(${d}px + 100svh)`;
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distance]);

  return (
    <section
      id="works"
      ref={sectionRef}
      className="relative h-[300svh] rounded-t-[2.5rem] bg-[#0a0a0a] text-[#f5f5f4] [box-shadow:0_-1px_0_#0a0a0a]"
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-16">
        <div className={cn(container, "flex flex-wrap items-end justify-between gap-8")}>
          <div>
            <SectionLabel index="04">Selected work</SectionLabel>
            <h2 className="mt-6 text-[clamp(2.8rem,5.4vw,6rem)] leading-[0.9] font-medium tracking-[-0.055em]">
              Recent films, <Em>across the work.</Em>
            </h2>
          </div>
          <div className="flex items-center gap-8 text-[14px]">
            <span className="text-white/45 tabular-nums">
              <span className="text-white">{String(active).padStart(2, "0")}</span> /{" "}
              {String(picks.length).padStart(2, "0")}
            </span>
            <a
              href="#broadcast"
              className="group inline-flex items-center gap-2 border-b border-white/25 pb-0.5 font-medium transition-colors hover:border-white"
            >
              All {videos.length} films
              <LuArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="mt-12 flex w-max gap-5 px-6 md:mt-14 md:gap-6 md:px-10 xl:px-14"
        >
          {picks.map((video, i) => (
            <WorkCard key={video.id} video={video} index={i} />
          ))}
        </motion.div>

        <div className={cn(container, "mt-12")}>
          <div className="h-px w-full bg-white/10">
            <motion.div className="h-px origin-left bg-white" style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkCard({ video, index }: { video: Video; index: number }) {
  const { open } = useVideoPlayer();
  const category = categoryBySlug(video.category);
  return (
    <button
      type="button"
      onClick={() => open(video)}
      className="group w-[clamp(320px,33vw,600px)] shrink-0 cursor-pointer text-left"
    >
      <span className="relative block aspect-[16/11] overflow-hidden rounded-[22px] bg-neutral-900">
        {video.poster ? (
          <Still
            src={smallPoster(video.poster)}
            alt={video.title}
            sizes="34vw"
            className="size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
        ) : null}
        <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        <span className="absolute top-4 left-4 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-md">
          {category.name}
        </span>
        <span className="absolute top-4 right-4 text-[12px] font-medium text-white/80 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-16 scale-75 place-items-center rounded-full bg-white text-neutral-950 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100">
            <LuPlay className="ml-0.5 size-5 fill-current" />
          </span>
        </span>
      </span>
      <span className="mt-5 block text-[clamp(1.25rem,1.6vw,1.65rem)] leading-tight font-medium tracking-[-0.03em]">
        {video.title}
      </span>
      <span className="mt-2 block text-[14px] text-white/60 tabular-nums">
        {video.client} · {video.year} · {video.runtime}
      </span>
      <span className="mt-0.5 block text-[14px] text-white/40">{video.role}</span>
    </button>
  );
}
