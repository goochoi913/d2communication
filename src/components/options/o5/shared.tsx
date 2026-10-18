"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { youtubeThumbnail } from "@/lib/youtube";
import { Still } from "@/components/media/still";
import { useVideoPlayer } from "@/components/media/video-player";
import { smallPoster, type Video } from "@/data/site";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Paper, ink and the logo red, exposed as CSS variables on the page root. */
export const PALETTE = {
  "--o5-paper": "#f7f5f0",
  "--o5-paper-deep": "#efebe2",
  "--o5-plate": "#e6e1d6",
  "--o5-ink": "#171717",
  "--o5-rule": "#d9d4c7",
  "--o5-muted": "#6b6b6b",
  "--o5-red": "#CC0606",
} as CSSProperties;

export const serif = "[font-family:var(--font-o5-serif)]";
export const ROMAN = ["I", "II", "III", "IV", "V"];

/** Page container: a 1440px measure on a 12-column grid. */
export const frame = "mx-auto w-full max-w-[1440px] px-6 md:px-10";

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-[11px] font-semibold tracking-[0.16em] text-(--o5-red) uppercase", className)}>{children}</p>
  );
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-[11px] font-medium tracking-[0.14em] text-(--o5-muted) uppercase", className)}>
      {children}
    </span>
  );
}

/** The newspaper "thick-thin" rule. */
export function DoubleRule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      <div className="border-t-[3px] border-(--o5-ink)" />
      <div className="mt-[3px] border-t border-(--o5-ink)" />
    </div>
  );
}

/** "KBS 1TV · 2016 · 52 min" */
export function Credits({ video, className }: { video: Video; className?: string }) {
  return (
    <p className={cn("text-[11px] font-medium tracking-[0.14em] text-(--o5-muted) uppercase", className)}>
      {video.client}
      <span className="mx-1.5 text-(--o5-rule)">·</span>
      {video.year}
      <span className="mx-1.5 text-(--o5-rule)">·</span>
      {video.runtime}
    </p>
  );
}

export function posterFor(video: Video, size: "sm" | "lg" = "sm") {
  if (!video.poster) return youtubeThumbnail(video.youtubeId, size === "lg" ? "maxresdefault" : "hqdefault");
  return size === "lg" ? video.poster : smallPoster(video.poster);
}

/** A plate that unrolls top-to-bottom as it enters the page, its photograph settling as it does. */
export function Plate({
  src,
  alt,
  className,
  imgClassName,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const reduce = useReducedMotion();
  // The in-view trigger sits on the unclipped wrapper: a fully clipped element never
  // reports as intersecting, so it could not reveal itself.
  return (
    <motion.div
      className={cn("relative", className)}
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden bg-(--o5-plate)"
        variants={{
          hidden: { clipPath: "inset(0% 0% 100% 0%)" },
          shown: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.25, ease: EASE } },
        }}
      >
        <motion.div
          className="absolute inset-0"
          variants={{ hidden: { scale: 1.1 }, shown: { scale: 1, transition: { duration: 1.8, ease: EASE } } }}
        >
          <Still
            src={src}
            alt={alt}
            sizes={sizes}
            priority={priority}
            className={cn(
              "size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035]",
              imgClassName,
            )}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** Small play affordance laid over a plate. */
export function PlayTag({ runtime, className }: { runtime: string; className?: string }) {
  return (
    <span
      className={cn(
        "absolute bottom-4 left-4 inline-flex items-center gap-2 bg-(--o5-paper) py-1.5 pr-3 pl-2 text-[11px] font-semibold tracking-[0.14em] text-(--o5-ink) uppercase shadow-sm transition-colors duration-300 group-hover:bg-(--o5-ink) group-hover:text-(--o5-paper)",
        className,
      )}
    >
      <LuPlay className="size-3 fill-current" />
      Watch · {runtime}
    </span>
  );
}

/** A captioned film in a section grid: plate, serif title, credits, standfirst. */
export function FilmFigure({ video, className }: { video: Video; className?: string }) {
  const { open } = useVideoPlayer();
  return (
    <figure className={cn("group", className)}>
      <button
        type="button"
        onClick={() => open(video)}
        className="block w-full cursor-pointer text-left"
        aria-label={`Play ${video.title}`}
      >
        <div className="relative">
          <Plate src={posterFor(video)} alt={video.title} className="aspect-[3/2]" sizes="(min-width: 768px) 30vw, 100vw" />
          <PlayTag runtime={video.runtime} className="opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" />
        </div>
        <figcaption className="mt-5">
          <Label className="text-(--o5-red)">{video.subGenre}</Label>
          <h4
            className={cn(
              serif,
              "mt-2 text-[1.55rem] leading-[1.12] font-medium tracking-[-0.01em] decoration-1 underline-offset-[5px] group-hover:underline",
            )}
          >
            {video.title}
          </h4>
          <Credits video={video} className="mt-3" />
          <p className="mt-1 text-[12px] text-(--o5-muted)">{video.role}</p>
          <p className={cn(serif, "mt-3 text-[1.05rem] leading-relaxed text-(--o5-ink)/75")}>{video.description}</p>
        </figcaption>
      </button>
    </figure>
  );
}
