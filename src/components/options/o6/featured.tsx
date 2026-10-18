"use client";

import { motion, useReducedMotion } from "motion/react";
import { LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { youtubeThumbnail } from "@/lib/youtube";
import { Still } from "@/components/media/still";
import { useVideoPlayer } from "@/components/media/video-player";
import { YouTubeLite } from "@/components/media/youtube-lite";
import { featuredVideos, smallPoster, videos } from "@/data/site";
import { EASE, Mono, SectionHeader, Tally, Umd, mono, tileBase, tileIn } from "./shared";

export function Featured() {
  const video = videos.find((v) => v.id === "ice-road")!;
  const alsoFeatured = featuredVideos.filter((v) => v.id !== video.id).slice(0, 3);
  const { open } = useVideoPlayer();
  const reduce = useReducedMotion();

  return (
    <section id="featured" className="mx-auto max-w-[1600px] px-2.5">
      <SectionHeader
        index="03"
        label="Featured documentary"
        title={
          <>
            Ice Road <span className="text-neutral-400">— six weeks on a frozen Siberian river.</span>
          </>
        }
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        className="grid grid-cols-1 gap-2.5 lg:grid-cols-12"
      >
        <motion.div variants={tileIn} className={cn(tileBase, "self-start bg-neutral-950 lg:col-span-8")}>
          <YouTubeLite
            youtubeId={video.youtubeId}
            title={video.title}
            poster={video.poster}
            playButton={
              <>
                <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.18)_38%,rgba(0,0,0,0)_60%)]" />
                <span className="absolute top-4 left-4">
                  <Umd>
                    <Tally live /> PVW <span className="text-white/35">/</span> {video.client} {video.year}
                  </Umd>
                </span>
                <span className="absolute bottom-5 left-5 flex items-center gap-4 text-white">
                  <span className="grid size-16 place-items-center rounded-full bg-white text-neutral-950 shadow-lg transition-transform duration-500 group-hover:scale-110">
                    <LuPlay className="ml-0.5 size-6 fill-current" />
                  </span>
                  <span className="text-left">
                    <span className="block text-[22px] leading-none font-semibold tracking-[-0.03em]">Play the film</span>
                    <span className={cn(mono, "mt-2 block text-white/70")}>{video.runtime} · plays here</span>
                  </span>
                </span>
              </>
            }
          />
        </motion.div>

        <motion.div variants={tileIn} className={cn(tileBase, "flex flex-col bg-white p-6 lg:col-span-4 xl:p-8")}>
          <Mono className="text-neutral-400">Credits</Mono>
          <h3 className="mt-4 text-[clamp(1.5rem,1.9vw,2rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-balance">
            {video.title}
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">{video.description}</p>
          <dl className="mt-auto grid grid-cols-3 gap-x-4 gap-y-5 border-t border-neutral-200 pt-5">
            {[
              ["Broadcaster", video.client],
              ["Year", String(video.year)],
              ["Runtime", video.runtime],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className={cn(mono, "text-neutral-400")}>{k}</dt>
                <dd className="mt-2 text-[14px] font-medium">{v}</dd>
              </div>
            ))}
            <div className="col-span-3">
              <dt className={cn(mono, "text-neutral-400")}>Role</dt>
              <dd className="mt-2 text-[14px] font-medium">{video.role}</dd>
            </div>
          </dl>
        </motion.div>

        {alsoFeatured.map((v, i) => (
          <motion.button
            key={v.id}
            variants={tileIn}
            whileHover={reduce ? undefined : { y: -3, transition: { duration: 0.35, ease: EASE } }}
            type="button"
            onClick={() => open(v)}
            className={cn(tileBase, "group flex cursor-pointer items-stretch gap-4 bg-white p-2.5 text-left lg:col-span-4")}
          >
            <span className="relative aspect-video w-[44%] shrink-0 overflow-hidden rounded-[10px] bg-neutral-200">
              <Still
                src={v.poster ? smallPoster(v.poster) : youtubeThumbnail(v.youtubeId)}
                alt=""
                sizes="15vw"
                className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <span className="absolute inset-0 grid place-items-center bg-black/0 transition-colors duration-500 group-hover:bg-black/25">
                <span className="grid size-9 scale-90 place-items-center rounded-full bg-white/95 text-neutral-950 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                  <LuPlay className="ml-0.5 size-3.5 fill-current" />
                </span>
              </span>
            </span>
            <span className="flex min-w-0 flex-col justify-between py-1.5 pr-2">
              <Mono className="text-neutral-400">
                Also featured · {String(i + 1).padStart(2, "0")}
              </Mono>
              <span>
                <span className="block text-[15.5px] leading-snug font-semibold tracking-[-0.02em] text-balance">{v.title}</span>
                <Mono className="mt-2 block text-neutral-500">
                  {v.client} · {v.year} · {v.runtime}
                </Mono>
                <Mono className="mt-1.5 block truncate text-neutral-400">{v.role}</Mono>
              </span>
            </span>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
