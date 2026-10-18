"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Still } from "@/components/media/still";
import { useVideoPlayer } from "@/components/media/video-player";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { youtubeThumbnail } from "@/lib/youtube";
import { smallPoster, videos, type Video } from "@/data/site";
import { EASE, Label, RecDot, cond, hideBroken, mono, useReducedMotionSafe } from "./shared";

export type ProgrammeFilter = "all" | Video["category"];

const FILTERS: { value: ProgrammeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "broadcast", label: "Broadcast" },
  { value: "promo", label: "Corporate & Promo" },
  { value: "performance", label: "Performance" },
];

const SHORT: Record<Video["category"], string> = {
  broadcast: "Broadcast",
  promo: "Corporate",
  performance: "Performance",
};

const PREVIEW_W = 400;
const PREVIEW_H = 225;

const posterOf = (v: Video) => (v.poster ? smallPoster(v.poster) : youtubeThumbnail(v.youtubeId));

/** The full filmography, set as a festival programme. */
export function Programme({ filter, onFilter }: { filter: ProgrammeFilter; onFilter: (f: ProgrammeFilter) => void }) {
  const { open } = useVideoPlayer();
  const reduce = useReducedMotionSafe();
  const list = useMemo(
    () => videos.filter((v) => filter === "all" || v.category === filter).sort((a, b) => b.year - a.year),
    [filter],
  );

  // Cursor-follow preview, spring-smoothed, held just above the pointer so the hovered row
  // stays readable; flips to the left near the right edge.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 32, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 260, damping: 32, mass: 0.7 });
  const [active, setActive] = useState<Video | null>(null);
  const first = useRef(true);

  const onMove = (e: PointerEvent) => {
    const flip = e.clientX > window.innerWidth - PREVIEW_W - 80;
    const nx = flip ? e.clientX - PREVIEW_W - 28 : e.clientX + 28;
    const above = e.clientY - PREVIEW_H - 34;
    const ny = above >= 84 ? above : e.clientY + 44;
    if (first.current) {
      // Appear where the cursor is instead of flying in from the corner.
      sx.jump(nx);
      sy.jump(ny);
      first.current = false;
    }
    x.set(nx);
    y.set(ny);
  };

  const counts = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.map((f) => [
          f.value,
          f.value === "all" ? videos.length : videos.filter((v) => v.category === f.value).length,
        ]),
      ),
    [],
  );

  return (
    <section id="programme" className="relative bg-black pt-36 pb-36" aria-label="Programme">
      <div className="mx-auto max-w-[1760px] px-6 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8 border-b border-white/15 pb-10">
          <div>
            <div className="flex items-center gap-3">
              <RecDot />
              <Label className="text-[#bdbdbd]">Programme · {videos.length} films · 50+ produced</Label>
            </div>
            <h2
              className={cn(
                cond,
                "mt-6 text-[clamp(4.5rem,9.4vw,10.5rem)] leading-[0.82] font-bold text-[#f2f2f2] uppercase",
              )}
            >
              Now showing
            </h2>
          </div>

          <ToggleGroup
            type="single"
            value={filter}
            onValueChange={(v) => v && onFilter(v as ProgrammeFilter)}
            spacing={0}
            className="gap-0"
            aria-label="Filter the programme"
          >
            {FILTERS.map((f) => (
              <ToggleGroupItem
                key={f.value}
                value={f.value}
                className={cn(
                  cond,
                  "relative h-12 rounded-none px-5 text-[15px] font-medium tracking-[0.2em] text-[#7a7a7a] uppercase hover:bg-transparent hover:text-white data-[state=on]:bg-transparent data-[state=on]:text-white",
                )}
              >
                {f.label}
                <span className={cn(mono, "ml-1 text-[10px] tracking-normal text-[#5a5a5a]")}>{counts[f.value]}</span>
                {filter === f.value ? (
                  <motion.span
                    layoutId="o4-filter-underline"
                    className="absolute inset-x-5 -bottom-px h-px bg-white"
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                ) : null}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div
          className={cn(
            mono,
            "hidden grid-cols-[64px_minmax(0,1fr)_280px_72px_100px] gap-x-6 border-b border-white/10 py-4 text-[10px] tracking-[0.24em] text-[#5f5f5f] uppercase md:grid",
          )}
          aria-hidden
        >
          <span>No.</span>
          <span>Title / Section</span>
          <span>Broadcaster / Client</span>
          <span>Year</span>
          <span className="text-right">Runtime</span>
        </div>

        <ul
          className="group/list"
          onPointerMove={onMove}
          onPointerLeave={() => {
            setActive(null);
            first.current = true;
          }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {list.map((v, i) => (
              <motion.li
                key={v.id}
                layout={!reduce}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="border-b border-white/10"
              >
                <button
                  type="button"
                  onClick={() => open(v)}
                  onPointerEnter={() => setActive(v)}
                  onFocus={() => setActive(v)}
                  className="group grid w-full cursor-pointer grid-cols-[40px_minmax(0,1fr)_auto] items-baseline gap-x-6 py-5 text-left transition-opacity duration-300 outline-none group-hover/list:opacity-30 hover:opacity-100! focus-visible:bg-white/[0.04] focus-visible:opacity-100! md:grid-cols-[64px_minmax(0,1fr)_280px_72px_100px]"
                  aria-label={`Play ${v.title}: ${v.client}, ${v.year}, ${v.runtime}, ${v.role}`}
                >
                  <span
                    className={cn(
                      mono,
                      "text-[12px] text-[#5f5f5f] tabular-nums transition-colors group-hover:text-[#e5484d]",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        cond,
                        "block truncate text-[clamp(1.6rem,2.45vw,2.7rem)] leading-[1.05] font-semibold tracking-[0.01em] text-[#e6e6e6] uppercase transition-colors group-hover:text-white",
                      )}
                    >
                      {v.title}
                    </span>
                    <span
                      className={cn(mono, "mt-2 block truncate text-[10px] tracking-[0.22em] text-[#6f6f6f] uppercase")}
                    >
                      {SHORT[v.category]} <span className="text-[#3f3f3f]">/</span> {v.subGenre}{" "}
                      <span className="text-[#3f3f3f]">—</span> <span className="text-[#8a8a8a]">{v.role}</span>
                    </span>
                  </span>
                  <span
                    className={cn(
                      cond,
                      "hidden truncate text-[15px] font-medium tracking-[0.12em] text-[#bdbdbd] uppercase md:block",
                    )}
                  >
                    {v.client}
                  </span>
                  <span className={cn(mono, "hidden text-[12px] text-[#8a8a8a] tabular-nums md:block")}>{v.year}</span>
                  <span className={cn(mono, "text-right text-[12px] text-[#8a8a8a] tabular-nums")}>{v.runtime}</span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      {/* The still that follows the cursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-40 hidden md:block"
        style={{ x: sx, y: sy, width: PREVIEW_W, height: PREVIEW_H }}
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.94 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        <div className="relative size-full overflow-hidden bg-[#111]">
          <AnimatePresence initial={false}>
            {active ? (
              <motion.div
                key={active.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <Still
                  src={posterOf(active)}
                  alt=""
                  sizes="400px"
                  onError={hideBroken}
                  className="size-full object-cover"
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute inset-x-4 bottom-3.5 flex items-center justify-between">
            <span
              className={cn(
                cond,
                "flex items-center gap-2 text-[13px] font-semibold tracking-[0.24em] text-white uppercase",
              )}
            >
              <LuPlay className="size-3 fill-current" /> Play
            </span>
            <span className={cn(mono, "text-[11px] text-white/80 tabular-nums")}>{active?.runtime}</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
