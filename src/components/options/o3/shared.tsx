"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { youtubeThumbnail } from "@/lib/youtube";
import { Still } from "@/components/media/still";
import { useVideoPlayer } from "@/components/media/video-player";
import { smallPoster, type Video } from "@/data/site";

export const EASE = [0.22, 1, 0.36, 1] as const;
export const RED = "#CC0606";

/** Display serif for headlines and statements. */
export const serif = "[font-family:var(--font-o3-display)]";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-[11px] font-medium tracking-[0.32em] text-neutral-400 uppercase", className)}>{children}</p>
  );
}

/** The red line from the photograph, drawn across the page as a section rule. */
export function RedLine({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      aria-hidden
      className={cn("h-px origin-left", className)}
      style={{ backgroundColor: RED }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 1.6, delay, ease: EASE }}
    />
  );
}

/** Black-and-white film still that comes into colour on hover, opening the player on click. */
export function FilmCard({
  video,
  size = "sm",
  className,
}: {
  video: Video;
  size?: "sm" | "lg";
  className?: string;
}) {
  const { open } = useVideoPlayer();
  const src = video.poster ? (size === "lg" ? video.poster : smallPoster(video.poster)) : youtubeThumbnail(video.youtubeId);

  return (
    <button type="button" onClick={() => open(video)} className={cn("group block w-full cursor-pointer text-left", className)}>
      <div className="relative aspect-video overflow-hidden bg-neutral-900">
        <Still
          src={src}
          alt={video.title}
          sizes={size === "lg" ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"}
          className="size-full object-cover grayscale transition-[filter,transform] duration-[1400ms] ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
        />
        <span className="absolute inset-0 bg-black/20 transition-colors duration-700 group-hover:bg-black/0" />
        <span
          className={cn(
            "absolute bottom-4 left-4 flex items-center gap-2.5 rounded-full border border-white/30 bg-black/30 py-1.5 pr-4 pl-1.5 text-[11px] tracking-[0.2em] text-white uppercase opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100",
            size === "lg" && "opacity-100",
          )}
        >
          <span className="grid size-7 place-items-center rounded-full bg-white text-neutral-950">
            <LuPlay className="ml-0.5 size-3 fill-current" />
          </span>
          Watch · {video.runtime}
        </span>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-6">
        <h4 className={cn(serif, "leading-tight text-neutral-50", size === "lg" ? "text-[2rem]" : "text-[1.45rem]")}>
          {video.title}
        </h4>
      </div>
      <p className="mt-2 text-[11px] tracking-[0.2em] text-neutral-400 uppercase">
        {video.client} <span className="text-neutral-700">·</span> {video.year} <span className="text-neutral-700">·</span>{" "}
        {video.runtime}
      </p>
      <p className="mt-1 text-[11px] tracking-[0.2em] text-neutral-600 uppercase">{video.role}</p>
      {size === "lg" ? <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-neutral-400">{video.description}</p> : null}
    </button>
  );
}
