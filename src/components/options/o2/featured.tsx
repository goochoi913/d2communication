"use client";

import { LuArrowUpRight, LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { YouTubeLite } from "@/components/media/youtube-lite";
import { useVideoPlayer } from "@/components/media/video-player";
import { Reveal } from "@/components/motion/reveal";
import { videos } from "@/data/site";
import { BlockRise, Label, Rise, Unfold, container, foldBlock, redBlock, wide } from "./shared";

/** Featured film, composed like the logo's "2": screen, a red block beside it, a grey tail hanging below. */
export function Featured() {
  const video = videos.find((v) => v.id === "silicon-peninsula") ?? videos[0];
  const { open } = useVideoPlayer();

  return (
    <section className="pb-28 md:pb-36">
      <div className={container}>
        <div className="mb-12 grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 md:col-span-8">
            <Label>Featured film</Label>
            <h2 className={cn(wide, "mt-6 text-[clamp(2.2rem,4vw,4.2rem)] leading-[0.9] font-black tracking-[-0.01em] uppercase")}>
              <Rise>Precision,</Rise>
              <Rise delay={0.08}>nanometre by nanometre.</Rise>
            </h2>
          </div>
          <Reveal className="col-span-12 md:col-span-4" delay={0.1}>
            <p className="text-[15px] leading-relaxed text-neutral-600">
              A science documentary filmed inside working clean rooms — macro cinematography, motion graphics and
              broadcast narration, all produced in-house.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-span-8">
            <YouTubeLite
              youtubeId={video.youtubeId}
              title={video.title}
              poster={video.poster}
              className="bg-neutral-200"
              playButton={
                <span
                  style={redBlock}
                  className="absolute top-1/2 left-1/2 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-br-[26px] text-white shadow-2xl shadow-black/25 transition-transform duration-500 group-hover:scale-105"
                >
                  <LuPlay className="ml-1 size-8 fill-current" />
                </span>
              }
            />
          </div>

          <BlockRise
            style={redBlock}
            className="col-span-12 lg:col-span-4"
            innerClassName="flex flex-col justify-between p-8 text-white md:p-10"
          >
            <div>
              <p className="text-[11px] font-semibold tracking-[0.24em] text-white/80 uppercase">
                {video.client} · {video.year} · {video.runtime}
              </p>
              <h3 className={cn(wide, "mt-6 text-[clamp(1.9rem,2.6vw,2.9rem)] leading-[0.92] font-black uppercase")}>
                {video.title}
              </h3>
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/90">{video.description}</p>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-white/25 pt-6 text-[13px]">
              <div>
                <dt className="text-[10px] font-semibold tracking-[0.24em] text-white/70 uppercase">Genre</dt>
                <dd className="mt-2">{video.subGenre}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold tracking-[0.24em] text-white/70 uppercase">Role</dt>
                <dd className="mt-2">{video.role}</dd>
              </div>
            </dl>
          </BlockRise>

          {/* The grey tail, hung under the red block, with the hook's rounded corner. */}
          <Unfold
            delay={0.35}
            style={foldBlock(30)}
            className="col-span-12 lg:col-span-3 lg:col-start-10"
            innerClassName="rounded-br-[64px]"
          >
            <button
              type="button"
              onClick={() => open(video)}
              className="group flex h-36 w-full cursor-pointer items-end justify-between p-8 text-left md:h-40 md:p-10"
            >
              <span className={cn(wide, "text-[13px] font-extrabold tracking-[0.14em] uppercase")}>Watch the film</span>
              <LuArrowUpRight className="size-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </Unfold>
        </div>
      </div>
    </section>
  );
}
