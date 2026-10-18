"use client";

import type { Ref } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LuArrowUpRight, LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { youtubeThumbnail } from "@/lib/youtube";
import { Still } from "@/components/media/still";
import { useVideoPlayer } from "@/components/media/video-player";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categoryBySlug, smallPoster, stats, videos, videosIn, type Video } from "@/data/site";
import { EASE, Mono, SectionHeader, Tally, Umd, mono, tileBase, useWorkFilter, type WorkFilter } from "./shared";

/** Shown in its own featured section further down, so the grid leaves it out. */
const FEATURE_ID = "ice-road";
const SOURCES = ["broadcast", "promo", "performance"] as const;

const TABS: { value: WorkFilter; label: string; count?: number }[] = [
  { value: "all", label: "All work" },
  ...SOURCES.map((s) => ({ value: s, label: categoryBySlug(s).name, count: videosIn(s).length })),
];

/** "All": featured films first, then the rest interleaved by category so the mix shows range. */
const ALL_ORDER: Video[] = (() => {
  const pool = videos.filter((v) => v.id !== FEATURE_ID);
  const byCategory = SOURCES.map((c) => pool.filter((v) => !v.featured && v.category === c));
  const mixed: Video[] = [];
  for (let i = 0; byCategory.some((list) => i < list.length); i++) {
    byCategory.forEach((list) => list[i] && mixed.push(list[i]));
  }
  return [...pool.filter((v) => v.featured), ...mixed];
})();

const CTA_COPY: Record<WorkFilter, string> = {
  all: "Commissioning a film?",
  broadcast: "Commissioning a documentary?",
  promo: "Need a brand or corporate film?",
  performance: "Filming a performance or event?",
};

/**
 * Grid recipe (12 columns): an info tile (3×2), the lead film (6×2), two films stacked
 * beside it, then rows of four. A closing call-to-action tile always completes the last
 * row, so the wall never shows a gap whatever the filter.
 */
function layoutFor(filter: WorkFilter) {
  const total = filter === "all" ? videos.length : videosIn(filter).length;
  const list = filter === "all" ? ALL_ORDER : videosIn(filter).filter((v) => v.id !== FEATURE_ID);
  const lead = list.find((v) => v.featured) ?? list[0];
  const rest = list.filter((v) => v !== lead);
  const side = rest.slice(0, 2);
  const remaining = rest.length - side.length;
  const rowCount = remaining >= 7 ? 7 : remaining >= 3 ? 3 : remaining;
  const grid = rest.slice(2, 2 + rowCount);
  const ctaSpan = rowCount === 7 || rowCount === 3 ? 3 : 12 - 3 * rowCount;
  const more = total - 1 - side.length - grid.length;
  return { lead, side, grid, ctaSpan, more };
}

export function Work() {
  const { filter, setFilter } = useWorkFilter();
  const { lead, side, grid, ctaSpan, more } = layoutFor(filter);

  return (
    <section id="work" className="relative mx-auto max-w-[1600px] scroll-mt-16 px-2.5 pb-2.5">
      {/* Deep-link targets for the nav and the camera tiles (#broadcast, #promo, #performance). */}
      {SOURCES.map((s) => (
        <span key={s} id={s} aria-hidden className="absolute top-0 scroll-mt-16" />
      ))}

      <Tabs value={filter} onValueChange={(v) => setFilter(v as WorkFilter)} className="block">
        <SectionHeader
          index="02"
          label="Selected work"
          className="pt-20 md:pt-24"
          title={
            <>
              Every source, <span className="text-neutral-400">one wall.</span>
            </>
          }
          aside={
            <TabsList
              aria-label="Filter work by category"
              className="h-11 max-w-full justify-start overflow-x-auto rounded-full bg-white p-1 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.05] [scrollbar-width:none] group-data-horizontal/tabs:h-11"
            >
              {TABS.map((t) => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="h-full cursor-pointer gap-2 rounded-full px-4 text-[13px] font-medium text-neutral-500 hover:text-neutral-950 data-active:bg-neutral-950 data-active:text-white data-active:shadow-none data-active:hover:text-white"
                >
                  {t.label}
                  {t.count ? (
                    <span className={cn(mono, "text-[10px] tracking-[0.06em] opacity-60")}>{t.count}</span>
                  ) : null}
                </TabsTrigger>
              ))}
            </TabsList>
          }
        />

        <TabsContent value={filter} forceMount className="text-base">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative grid grid-flow-dense grid-cols-2 gap-2.5 lg:auto-rows-[clamp(176px,14vw,236px)] lg:grid-cols-12"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <InfoTile key={`info-${filter}`} filter={filter} />
              <WorkTile key={lead.id} video={lead} size="lg" />
              {[...side, ...grid].map((v) => (
                <WorkTile key={v.id} video={v} />
              ))}
              <CtaTile key={`cta-${filter}`} filter={filter} span={ctaSpan} more={more} />
            </AnimatePresence>
          </motion.div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

const tileMotion = {
  layout: true,
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
  transition: { duration: 0.55, ease: EASE },
} as const;

function InfoTile({ filter, ref }: { filter: WorkFilter; ref?: Ref<HTMLDivElement> }) {
  const { setFilter } = useWorkFilter();
  const category = filter === "all" ? null : categoryBySlug(filter);
  const cam = filter === "all" ? 0 : SOURCES.indexOf(filter) + 1;

  if (!category) {
    // "All": an index of the three disciplines, each with its one-line explanation.
    return (
      <motion.div
        ref={ref}
        {...tileMotion}
        className={cn(tileBase, "col-span-2 flex flex-col bg-neutral-950 p-6 text-white lg:col-span-3 lg:row-span-2")}
      >
        <motion.div layout="position" className="flex items-center justify-between gap-3">
          <Umd className="bg-white/10">
            <Tally live /> All sources
          </Umd>
          <Mono className="text-neutral-500">
            {stats[0].value}
            {stats[0].suffix} productions
          </Mono>
        </motion.div>
        <motion.ul layout="position" className="mt-auto divide-y divide-white/10 border-t border-white/10">
          {SOURCES.map((s, i) => {
            const c = categoryBySlug(s);
            return (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => setFilter(s)}
                  className="group/row w-full cursor-pointer py-3 text-left"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-[14.5px] font-semibold tracking-[-0.015em] group-hover/row:underline">{c.name}</span>
                    <Mono className="text-neutral-500">
                      Cam {i + 1} · {videosIn(s).length}
                    </Mono>
                  </span>
                  <span className="mt-1 line-clamp-3 block text-[12.5px] leading-[1.45] text-neutral-400 max-[1399px]:line-clamp-2">
                    {c.description}
                  </span>
                </button>
              </li>
            );
          })}
        </motion.ul>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      {...tileMotion}
      className={cn(tileBase, "col-span-2 flex flex-col justify-between bg-neutral-950 p-6 text-white lg:col-span-3 lg:row-span-2")}
    >
      <motion.div layout="position">
        <Umd className="bg-white/10">
          <Tally live /> Cam {cam} <span className="text-white/35">/</span> {category.name}
        </Umd>
        <h3 className="mt-5 text-[clamp(1.5rem,1.9vw,1.9rem)] leading-[1.06] font-semibold tracking-[-0.035em]">
          {category.title}
        </h3>
        <p className="mt-3 text-[14px] leading-relaxed text-neutral-400">{category.description}</p>
      </motion.div>
      <motion.div layout="position">
        <div className="flex flex-wrap gap-1.5">
          {category.subGenres.map((c) => (
            <span key={c} className="rounded-full border border-white/15 px-2.5 py-1 text-[12px] text-neutral-300">
              {c}
            </span>
          ))}
        </div>
        <p className="mt-5 flex items-baseline gap-2.5">
          <span className="text-[2.75rem] leading-none font-semibold tracking-[-0.05em] tabular-nums">
            {videosIn(filter as (typeof SOURCES)[number]).length}
          </span>
          <Mono className="text-neutral-500">films online</Mono>
        </p>
      </motion.div>
    </motion.div>
  );
}

function WorkTile({ video, size = "sm", ref }: { video: Video; size?: "sm" | "lg"; ref?: Ref<HTMLButtonElement> }) {
  const { open } = useVideoPlayer();
  const reduce = useReducedMotion();
  const lg = size === "lg";
  const src = video.poster ? (lg ? video.poster : smallPoster(video.poster)) : youtubeThumbnail(video.youtubeId);

  return (
    <motion.button
      ref={ref}
      {...tileMotion}
      type="button"
      onClick={() => open(video)}
      whileHover={reduce ? undefined : { y: -3 }}
      className={cn(
        tileBase,
        "group cursor-pointer bg-neutral-800 text-left",
        lg ? "col-span-2 aspect-video lg:col-span-6 lg:row-span-2 lg:aspect-auto" : "col-span-2 aspect-video sm:col-span-1 lg:col-span-3 lg:aspect-auto",
      )}
    >
      <motion.div layout className="absolute inset-0">
        <Still
          src={src}
          alt=""
          sizes={lg ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
          className="size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.72)_38%,rgba(0,0,0,0.2)_70%,rgba(0,0,0,0.3)_100%)]" />

      <motion.div layout="position" className="absolute top-3 left-3">
        <Umd>
          <Tally className="group-hover:bg-[#CC0606] group-hover:shadow-[0_0_0_3px_rgba(204,6,6,0.22)]" />
          {video.subGenre}
        </Umd>
      </motion.div>

      <span
        aria-hidden
        className={cn(
          "absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2 scale-90 place-items-center rounded-full bg-white/95 text-neutral-950 opacity-0 shadow-lg transition-all duration-500 group-hover:scale-100 group-hover:opacity-100",
          lg ? "size-16" : "size-12",
        )}
      >
        <LuPlay className={cn("ml-0.5 fill-current", lg ? "size-6" : "size-4")} />
      </span>

      <motion.div layout="position" className={cn("absolute inset-x-4 text-white", lg ? "bottom-5 lg:inset-x-6" : "bottom-3.5")}>
        <p
          className={cn(
            "font-semibold tracking-[-0.025em] text-balance [text-shadow:0_1px_14px_rgba(0,0,0,0.45)]",
            lg ? "text-[clamp(1.5rem,2.1vw,2.2rem)] leading-[1.05]" : "text-[15.5px] leading-snug",
          )}
        >
          {video.title}
        </p>
        {lg ? <p className="mt-2.5 max-w-xl text-[14px] leading-relaxed text-white/75">{video.description}</p> : null}
        {/* Credit line, always visible: client · year · runtime, then the role. */}
        <Mono className={cn("block text-white/70", lg ? "mt-3.5" : "mt-2 line-clamp-2 leading-[1.35]")}>
          {video.client} · {video.year} · {video.runtime}
        </Mono>
        <Mono className="mt-1.5 block truncate text-white/45">{video.role}</Mono>
      </motion.div>
    </motion.button>
  );
}

function CtaTile({
  filter,
  span,
  more,
  ref,
}: {
  filter: WorkFilter;
  span: number;
  more: number;
  ref?: Ref<HTMLAnchorElement>;
}) {
  return (
    <motion.a
      ref={ref}
      {...tileMotion}
      href="#contact"
      className={cn(
        tileBase,
        "group col-span-2 flex flex-col justify-between bg-white p-5 transition-colors hover:bg-neutral-950 hover:text-white",
        span === 3 && "lg:col-span-3",
        span === 6 && "lg:col-span-6",
        span === 9 && "lg:col-span-9",
        span === 12 && "lg:col-span-12",
      )}
    >
      <motion.div layout="position" className="flex items-center justify-between">
        <Mono className="text-neutral-400 group-hover:text-neutral-500">
          {more > 0 ? `+${more} more in the archive` : "Your film next"}
        </Mono>
        <LuArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </motion.div>
      <motion.div layout="position">
        <p className="text-[clamp(1.15rem,1.45vw,1.45rem)] leading-tight font-semibold tracking-[-0.03em]">
          {CTA_COPY[filter]}
        </p>
        <p className="mt-1.5 text-[13px] text-neutral-500 group-hover:text-neutral-400">Tell us about it — we reply within two days.</p>
      </motion.div>
    </motion.a>
  );
}
