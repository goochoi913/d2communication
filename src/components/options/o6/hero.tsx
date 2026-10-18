"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { LuArrowUpRight, LuPlay, LuVolume2 } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { D2LogoAnimated } from "@/components/brand/d2-logo-animated";
import { Still } from "@/components/media/still";
import { useVideoPlayer } from "@/components/media/video-player";
import { YouTubeBackground } from "@/components/media/youtube-background";
import { CountUp } from "@/components/motion/count-up";
import { categoryBySlug, company, publicCategories, showreel, smallPoster, stats, videosIn, type CategorySlug } from "@/data/site";
import { Mono, SeoulClock, Tally, Timecode, Umd, mono, tileBase, tileIn, useWorkFilter, type WorkFilter } from "./shared";

/**
 * The first screen stays pinned while the work section slides over it like a sheet;
 * the wall recedes (scale + dim) underneath. Transform and opacity only.
 */
export function HeroStack({ children }: { children: ReactNode }) {
  const nextRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: nextRef, offset: ["start end", "start start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.94]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 0.65]);

  return (
    <div className="relative">
      <div className="lg:sticky lg:top-0 lg:h-svh lg:min-h-[680px] lg:overflow-hidden">
        <motion.div style={{ scale }} className="h-full">
          <Hero />
        </motion.div>
        <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-[#e5e5e5]" />
      </div>
      <div
        ref={nextRef}
        className="relative z-10 rounded-t-[28px] bg-[#e5e5e5] shadow-[0_-28px_60px_-34px_rgba(0,0,0,0.35)]"
      >
        {children}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="mx-auto h-full max-w-[1600px] px-2.5 pt-16 pb-2.5">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.065, delayChildren: 0.1 } } }}
        className="grid grid-cols-2 gap-2.5 lg:h-full lg:grid-cols-12 lg:grid-rows-[1.22fr_1.22fr_1fr_1fr]"
      >
        <PgmTile className="col-span-2 aspect-video lg:col-span-7 lg:row-span-2 lg:aspect-auto" />
        <IdentityTile className="col-span-2 lg:col-span-5 lg:row-span-2" />
        <CountTile className="col-span-2 min-h-44 sm:col-span-1 lg:col-span-3 lg:min-h-0" />
        <StatsTile className="col-span-2 min-h-44 sm:col-span-1 lg:col-span-4 lg:min-h-0" />
        <ContactTile className="col-span-2 min-h-40 lg:col-span-5 lg:min-h-0" />
        {publicCategories.map((c, i) => (
          <CamTile key={c.slug} slug={c.slug} index={i} className="col-span-2 aspect-[16/9] sm:col-span-1 lg:col-span-3 lg:aspect-auto" />
        ))}
      </motion.div>
    </section>
  );
}

const POSTER = showreel.poster ?? "/images/hero/frozen-river-color-2560.webp";

function PgmTile({ className }: { className?: string }) {
  const { open } = useVideoPlayer();
  return (
    <motion.div variants={tileIn} className={cn(tileBase, "group bg-neutral-950", className)}>
      {/* The placeholder reel is letterboxed inside its 16:9 file; overscan crops the baked-in bars. */}
      <YouTubeBackground youtubeId={showreel.youtubeId} poster={POSTER} start={showreel.start} overscan={1.45} />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_28%,rgba(0,0,0,0)_52%,rgba(0,0,0,0.72)_100%)]" />
      {/* Programme tally: the source on air carries a red border, as on a real multiview. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[16px] ring-2 ring-[#CC0606] ring-inset" />

      <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between">
        <Umd>
          <Tally live pulse /> On air <span className="text-white/35">/</span> PGM
        </Umd>
        <Umd>
          <span className="text-white/45">TC</span> <Timecode />
        </Umd>
      </div>

      <button
        type="button"
        onClick={() => open(showreel)}
        aria-label="Play the showreel with sound"
        className="absolute inset-0 flex cursor-pointer items-end p-5 text-left text-white xl:p-6"
      >
        <span className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-white text-neutral-950 shadow-lg transition-transform duration-500 ease-out group-hover:scale-110 xl:size-16">
            <LuPlay className="ml-0.5 size-5 fill-current" />
          </span>
          <span>
            <span className="block text-[clamp(1.25rem,1.6vw,1.6rem)] leading-none font-semibold tracking-[-0.03em]">
              {showreel.title}
            </span>
            <span className={cn(mono, "mt-2 flex items-center gap-1.5 text-white/70")}>
              <LuVolume2 className="size-3.5" /> Watch with sound · {showreel.runtime}
            </span>
          </span>
        </span>
      </button>
    </motion.div>
  );
}

function IdentityTile({ className }: { className?: string }) {
  const { open } = useVideoPlayer();
  return (
    <motion.div variants={tileIn} className={cn(tileBase, "flex flex-col bg-white p-6 xl:p-8", className)}>
      <div className="flex items-start justify-between gap-4">
        <D2LogoAnimated variant="assemble" delay={0.5} className="h-14 w-auto xl:h-16 2xl:h-20" />
        <Mono className="flex items-center gap-1.5 text-neutral-400">
          Seoul <SeoulClock className="text-neutral-800" /> KST
        </Mono>
      </div>

      <div className="mt-auto pt-6">
        <Mono className="text-neutral-400">{company.name} · Production company</Mono>
        <h1 className="mt-4 text-[clamp(1.9rem,2.55vw,3.05rem)] leading-[1.03] font-semibold tracking-[-0.042em] text-balance text-neutral-950">
          Documentaries, brand films and performance — directed by {company.founder.name}.
        </h1>
        <p className="mt-4 max-w-[30rem] text-[15px] leading-relaxed text-neutral-500">
          More than fifty documentaries and corporate films, developed, shot and finished under one roof.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => open(showreel)}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-[#CC0606] pr-5 pl-4 text-[14px] font-medium text-white transition-colors hover:bg-[#b00505]"
          >
            <LuPlay className="size-3.5 fill-current" /> Watch showreel
          </button>
          <a
            href="#contact"
            className="inline-flex h-11 items-center gap-1.5 rounded-full px-5 text-[14px] font-medium text-neutral-900 ring-1 ring-neutral-300 transition-colors ring-inset hover:bg-neutral-100"
          >
            Start a project <LuArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function CountTile({ className }: { className?: string }) {
  const s = stats[0];
  return (
    <motion.div
      variants={tileIn}
      className={cn(tileBase, "flex flex-col justify-between bg-neutral-950 p-5 text-white xl:p-6", className)}
    >
      <Mono className="text-[#A6A6A6]">On record</Mono>
      <div className="flex items-end justify-between gap-3">
        <CountUp
          value={s.value}
          suffix={s.suffix}
          className="text-[clamp(3.5rem,5.4vw,6.4rem)] leading-[0.78] font-semibold tracking-[-0.065em] tabular-nums"
        />
        <p className="text-right text-[13px] leading-snug text-neutral-400">
          Documentaries
          <br />& corporate films
        </p>
      </div>
    </motion.div>
  );
}

function StatsTile({ className }: { className?: string }) {
  return (
    <motion.div variants={tileIn} className={cn(tileBase, "grid grid-cols-3 bg-white", className)}>
      {stats.slice(1).map((s, i) => (
        <div key={s.label} className={cn("flex flex-col justify-between p-4 xl:p-5", i > 0 && "border-l border-neutral-200")}>
          <Mono className="text-neutral-400">{String(i + 2).padStart(2, "0")}</Mono>
          <div>
            <CountUp
              value={s.value}
              suffix={s.suffix}
              className="text-[clamp(1.75rem,2.5vw,2.75rem)] leading-none font-semibold tracking-[-0.05em] tabular-nums"
            />
            {/* Two-line slot keeps every number on the same baseline. */}
            <p className="mt-2 min-h-[2.8em] text-[12.5px] leading-snug text-neutral-500">{s.label}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function ContactTile({ className }: { className?: string }) {
  return (
    <motion.div variants={tileIn} className={cn(tileBase, "flex flex-col justify-between bg-white p-5 xl:p-6", className)}>
      <div className="flex items-center justify-between gap-4">
        <Mono className="text-neutral-400">
          Contact <span className="text-neutral-300">·</span> <span className="text-neutral-700">{company.founder.name}</span>
        </Mono>
        <Mono className="hidden text-neutral-400 sm:block">Replies within two working days</Mono>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <a
            href={`mailto:${company.email}`}
            className="block truncate text-[clamp(1.2rem,1.65vw,1.7rem)] font-semibold tracking-[-0.035em] text-neutral-950 underline-offset-[6px] hover:underline"
          >
            {company.email}
          </a>
          <p className="mt-2 text-[13px] text-neutral-500">
            <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="text-neutral-700 underline-offset-4 hover:underline">
              {company.phone}
            </a>{" "}
            <span className="text-neutral-300">·</span> {company.location}
          </p>
        </div>
        <a
          href={`mailto:${company.email}`}
          aria-label={`Email ${company.email}`}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-neutral-950 text-white transition-colors hover:bg-[#CC0606]"
        >
          <LuArrowUpRight className="size-5" />
        </a>
      </div>
    </motion.div>
  );
}

function CamTile({ slug, index, className }: { slug: CategorySlug; index: number; className?: string }) {
  const { setFilter } = useWorkFilter();
  const reduce = useReducedMotion();
  const category = categoryBySlug(slug);
  const count = slug === "photography" ? null : videosIn(slug).length;

  return (
    <motion.a
      variants={tileIn}
      whileHover={reduce ? undefined : { y: -3 }}
      href={`#${slug}`}
      onClick={() => slug !== "photography" && setFilter(slug as WorkFilter)}
      className={cn(tileBase, "group block bg-neutral-800", className)}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1.02, 1.13] }}
        transition={{ duration: 15 + index * 2.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      >
        <Still
          src={smallPoster(category.cover)}
          alt=""
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="size-full object-cover brightness-[0.72] saturate-[0.8] transition-[filter] duration-700 group-hover:brightness-100 group-hover:saturate-100"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.72)_38%,rgba(0,0,0,0.2)_70%,rgba(0,0,0,0.3)_100%)]" />
      <div className="absolute top-3 left-3">
        <Umd>
          <Tally className="group-hover:bg-[#CC0606] group-hover:shadow-[0_0_0_3px_rgba(204,6,6,0.22)]" /> Cam {index + 1}
          <span className="text-white/35">/</span> {count ? `${count} films` : "Stills"}
        </Umd>
      </div>
      <div className="absolute inset-x-4 bottom-3.5 flex items-end justify-between gap-3 text-white">
        <div className="min-w-0">
          <p className="text-[clamp(1rem,1.25vw,1.2rem)] leading-tight font-semibold tracking-[-0.02em] [text-shadow:0_1px_14px_rgba(0,0,0,0.45)]">
            {category.name}
          </p>
          <p className="mt-1 text-[12.5px] leading-snug text-white/75">{category.tagline}</p>
        </div>
        <LuArrowUpRight className="size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </motion.a>
  );
}
