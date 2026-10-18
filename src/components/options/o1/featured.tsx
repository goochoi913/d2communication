"use client";

import { LuArrowRight, LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { YouTubeLite } from "@/components/media/youtube-lite";
import { Reveal } from "@/components/motion/reveal";
import { videos } from "@/data/site";
import { ContainerScroll } from "./container-scroll";
import { Em, SectionLabel, container } from "./shared";

/** The featured documentary, presented on a screen that tilts up into view. */
export function Featured() {
  const video = videos.find((v) => v.id === "northern-lights")!;
  const [lead, ...rest] = video.title.split(" the ");

  return (
    <section className="relative bg-[#f4f3ef] text-[#0a0a0a]">
      <div className={cn(container, "flex items-center justify-between gap-6 border-t border-black/10 pt-10")}>
        <SectionLabel index="02">Featured film</SectionLabel>
        <p className="hidden text-[12px] font-medium tracking-[0.16em] text-black/45 uppercase md:block">
          {video.subGenre} · {video.client}
        </p>
      </div>

      <ContainerScroll
        title={
          <div className="pb-4">
            <h2 className="text-[clamp(3.2rem,7vw,7.8rem)] leading-[0.88] font-medium tracking-[-0.055em]">
              {rest.length ? (
                <>
                  {lead} the <Em>{rest.join(" the ")}</Em>
                </>
              ) : (
                video.title
              )}
            </h2>
            <p className="mt-6 text-[13px] font-medium tracking-[0.14em] text-black/50 uppercase">
              {video.client} · {video.year} · {video.runtime} · {video.role}
            </p>
          </div>
        }
      >
        <YouTubeLite
          youtubeId={video.youtubeId}
          title={video.title}
          poster={video.poster}
          className="absolute inset-0 aspect-auto size-full"
          playButton={
            <span className="absolute inset-0 grid place-items-center">
              <span className="flex items-center gap-4 rounded-full border border-white/25 bg-black/30 py-2 pr-6 pl-2 text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-white group-hover:text-neutral-950">
                <span className="grid size-12 place-items-center rounded-full bg-white text-neutral-950">
                  <LuPlay className="ml-0.5 size-4 fill-current" />
                </span>
                <span className="text-[16px] font-medium">Watch the film</span>
                <span className="text-[14px] opacity-60">{video.runtime}</span>
              </span>
            </span>
          }
        />
      </ContainerScroll>

      <div className={cn(container, "grid gap-10 pb-28 md:grid-cols-12 md:pb-36")}>
        <Reveal className="md:col-span-6 md:col-start-2">
          <p className="text-[clamp(1.5rem,2.2vw,2.2rem)] leading-[1.2] font-medium tracking-[-0.03em]">
            {video.description}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="flex items-end md:col-span-3 md:col-start-9">
          <a
            href="#broadcast"
            className="group inline-flex items-center gap-3 border-b border-black/20 pb-1 text-[15px] font-medium transition-colors hover:border-black"
          >
            More broadcast documentaries
            <LuArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
