"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { LuArrowDown, LuArrowUp, LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Still } from "@/components/media/still";
import { Reveal } from "@/components/motion/reveal";
import { useVideoPlayer } from "@/components/media/video-player";
import { publicCategories, videos, type Video } from "@/data/site";
import { DoubleRule, Kicker, Label, frame, posterFor, serif } from "./shared";

type SortKey = "year" | "title";
type Filter = "all" | Video["category"];

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  ...publicCategories
    .filter((c) => c.slug !== "photography")
    .map((c) => ({ value: c.slug as Filter, label: c.name })),
];

const years = videos.map((v) => v.year);

/** Library order: a leading "The" doesn't count. */
const titleKey = (v: Video) => v.title.replace(/^the\s+/i, "");

/** The Index: every film in the archive, sortable, with a still that follows the cursor. */
export function ArchiveIndex() {
  const { open } = useVideoPlayer();
  const reduce = useReducedMotion();
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "year", dir: -1 });
  const [filter, setFilter] = useState<Filter>("all");
  const [hovered, setHovered] = useState<Video | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 380, damping: 34, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 380, damping: 34, mass: 0.5 });

  const rows = useMemo(() => {
    const list = videos.filter((v) => filter === "all" || v.category === filter);
    return [...list].sort((a, b) =>
      sort.key === "year"
        ? (a.year - b.year) * sort.dir || a.title.localeCompare(b.title)
        : titleKey(a).localeCompare(titleKey(b)) * sort.dir,
    );
  }, [sort, filter]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: key === "year" ? -1 : 1 }));

  return (
    <section id="index" aria-labelledby="index-title" className={cn(frame, "mt-32 scroll-mt-14 md:mt-40")}>
      <DoubleRule />
      <div className="grid gap-8 pt-6 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-7">
          <Kicker>The index</Kicker>
          <h2
            id="index-title"
            className={cn(
              serif,
              "mt-3 text-[clamp(3.2rem,6.4vw,6.6rem)] leading-[0.92] font-normal tracking-[-0.03em] text-balance",
            )}
          >
            Every film, on record
          </h2>
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-5 lg:pt-8">
          <p className={cn(serif, "text-[1.35rem] leading-snug italic")}>
            {videos.length} selected titles, {Math.min(...years)}–{Math.max(...years)}, from a filmography of more than
            fifty.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-(--o5-muted)">
            Documentaries for broadcast, films for companies and institutions, and recordings of the stage. Select any
            title to watch it.
          </p>
        </Reveal>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-(--o5-rule) py-3">
        <div role="group" aria-label="Filter by section" className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "relative cursor-pointer py-1 text-[11.5px] font-semibold tracking-[0.14em] uppercase transition-colors",
                filter === f.value ? "text-(--o5-ink)" : "text-(--o5-muted) hover:text-(--o5-ink)",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "absolute inset-x-0 -bottom-[13px] h-[2px] origin-left bg-(--o5-red) transition-transform duration-300",
                  filter === f.value ? "scale-x-100" : "scale-x-0",
                )}
              />
            </button>
          ))}
        </div>
        <Label>
          {rows.length} {rows.length === 1 ? "title" : "titles"}
        </Label>
      </div>

      <table className="mt-0 w-full border-collapse text-left">
        <thead className="sticky top-14 z-10 bg-(--o5-paper)">
          {/* The rule is a shadow so it travels with the sticky header (collapsed borders stay behind). */}
          <tr className="text-[10.5px] font-semibold tracking-[0.14em] text-(--o5-muted) uppercase [&>th]:shadow-[inset_0_-1px_0_var(--o5-ink)]">
            <SortHeader label="Year" active={sort.key === "year"} dir={sort.dir} onClick={() => toggleSort("year")} className="w-[9%]" />
            <SortHeader label="Title" active={sort.key === "title"} dir={sort.dir} onClick={() => toggleSort("title")} className="w-[33%]" />
            <th scope="col" className="hidden py-3.5 pr-4 font-semibold md:table-cell md:w-[20%]">
              Broadcaster / Client
            </th>
            <th scope="col" className="hidden py-3.5 pr-4 font-semibold lg:table-cell lg:w-[14%]">
              Genre
            </th>
            <th scope="col" className="hidden py-3.5 pr-4 font-semibold sm:table-cell sm:w-[9%]">
              Runtime
            </th>
            <th scope="col" className="hidden py-3.5 font-semibold xl:table-cell">
              Role
            </th>
          </tr>
        </thead>
        <tbody
          onPointerMove={(e) => {
            x.set(e.clientX);
            y.set(e.clientY);
          }}
          onPointerLeave={() => setHovered(null)}
        >
          {rows.map((v) => (
              <motion.tr
                key={v.id}
                layout={reduce ? false : "position"}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onPointerEnter={() => setHovered(v)}
                onClick={() => open(v)}
                className="group cursor-pointer border-b border-(--o5-rule) transition-colors duration-200 hover:bg-(--o5-paper-deep)"
              >
                <td className="py-4 pr-4 align-baseline text-[13px] text-(--o5-muted) tabular-nums">{v.year}</td>
                <td className="py-4 pr-4 align-baseline">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      open(v);
                    }}
                    className={cn(
                      serif,
                      "flex cursor-pointer items-baseline gap-2.5 text-left text-[1.3rem] leading-snug font-medium tracking-[-0.01em] decoration-1 underline-offset-4 group-hover:underline",
                    )}
                  >
                    {v.title}
                    <LuPlay className="size-3 shrink-0 translate-y-[-1px] fill-current text-(--o5-red) opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                </td>
                <td className="hidden py-4 pr-4 align-baseline text-[14px] md:table-cell">{v.client}</td>
                <td className="hidden py-4 pr-4 align-baseline text-[14px] text-(--o5-muted) lg:table-cell">{v.subGenre}</td>
                <td className="hidden py-4 pr-4 align-baseline text-[13px] text-(--o5-muted) tabular-nums sm:table-cell">
                  {v.runtime}
                </td>
                <td className="hidden py-4 align-baseline text-[13px] text-(--o5-muted) xl:table-cell">{v.role}</td>
              </motion.tr>
            ))}
        </tbody>
      </table>

      {/* Cursor-following still, desktop pointers only. */}
      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-40 hidden w-[17.5rem] pointer-fine:block"
          style={{ x: sx, y: sy }}
        >
          <AnimatePresence>
            {hovered ? (
              <motion.div
                key={hovered.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-0 left-0 ml-7 -translate-y-1/2 bg-(--o5-paper) p-1.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)]"
              >
                <div className="aspect-[3/2] w-[17rem] overflow-hidden bg-(--o5-plate)">
                  <Still src={posterFor(hovered)} alt="" sizes="272px" className="size-full object-cover" />
                </div>
                <p className="px-1 pt-1.5 pb-0.5 text-[10px] font-semibold tracking-[0.14em] text-(--o5-muted) uppercase">
                  {hovered.client} · {hovered.year}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </section>
  );
}

function SortHeader({
  label,
  active,
  dir,
  onClick,
  className,
}: {
  label: string;
  active: boolean;
  dir: 1 | -1;
  onClick: () => void;
  className?: string;
}) {
  const Arrow = dir === 1 ? LuArrowUp : LuArrowDown;
  return (
    <th scope="col" aria-sort={active ? (dir === 1 ? "ascending" : "descending") : "none"} className={cn("py-3.5 pr-4 font-semibold", className)}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1.5 uppercase transition-colors",
          active ? "text-(--o5-ink)" : "hover:text-(--o5-ink)",
        )}
      >
        {label}
        <Arrow className={cn("size-3", active ? "text-(--o5-red)" : "opacity-0")} />
      </button>
    </th>
  );
}
