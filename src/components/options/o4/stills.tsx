"use client";

import { LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Still } from "@/components/media/still";
import { useVideoPlayer } from "@/components/media/video-player";
import { categoryBySlug, company, photos, smallPoster, videos, type Video } from "@/data/site";
import { Label, Reveal, cond, hideBroken, mono } from "./shared";

type Frame = { key: string; src: string; caption: string; credit: string; video?: Video };

/** Photography as a 35mm contact sheet: numbered frames, every caption on the page. */
export function Stills() {
  const { open } = useVideoPlayer();
  const category = categoryBySlug("photography");

  const frames: Frame[] = [
    ...photos.map((p) => ({
      key: p.src,
      src: p.src.replace(/-(1600|2560)\.webp$/, "-960.webp"),
      caption: p.caption,
      credit: `Photograph · ${company.founder.name}`,
    })),
    ...videos
      .filter((v) => v.poster && !v.poster.startsWith("/images/hero/"))
      .filter((_, i) => i % 4 === 1)
      .slice(0, Math.max(0, 6 - photos.length))
      .map((v) => ({
        key: v.id,
        src: smallPoster(v.poster!),
        caption: `Frame · ${v.title}`,
        credit: `${v.client} · ${v.year} · ${v.runtime}`,
        video: v,
      })),
  ];

  return (
    <section id="stills" className="relative bg-black py-36" aria-label="Photography">
      <div className="mx-auto max-w-[1760px] px-6 md:px-12">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6 border-b border-white/15 pb-10">
            <div>
              <Label>Reel 04 · Stills</Label>
              <h2
                className={cn(
                  cond,
                  "mt-6 text-[clamp(4.5rem,9.4vw,10.5rem)] leading-[0.82] font-bold text-[#f2f2f2] uppercase",
                )}
              >
                {category.name}
              </h2>
            </div>
            <p className={cn(cond, "max-w-[30rem] text-[1.35rem] leading-snug text-[#9a9a9a]")}>
              {category.description}
            </p>
          </div>
        </Reveal>

        <ul className="mt-14 grid gap-x-3 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {frames.map((f, i) => {
            const no = 12 + i * 2;
            const body = (
              <>
                <span
                  className={cn(
                    mono,
                    "mb-2 flex justify-between text-[10px] tracking-[0.18em] text-[#5f5f5f] tabular-nums",
                  )}
                >
                  <span>{no}</span>
                  <span className="text-[#3a3a3a]">D2C ▸</span>
                  <span>{no}A</span>
                </span>
                <span className="relative block aspect-[3/2] overflow-hidden bg-[#111] ring-1 ring-white/10">
                  <Still
                    src={f.src}
                    alt={f.caption}
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 92vw"
                    onError={hideBroken}
                    className="size-full object-cover transition-[transform,filter] duration-[1400ms] ease-out group-hover/frame:scale-[1.04] group-hover/frame:brightness-110"
                  />
                  {f.video ? (
                    <span className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full border border-white/50 bg-black/30 text-white backdrop-blur-sm transition-colors duration-300 group-hover/frame:border-white group-hover/frame:bg-white group-hover/frame:text-black">
                      <LuPlay className="ml-0.5 size-3.5 fill-current" />
                    </span>
                  ) : null}
                </span>
                <span className={cn(mono, "mt-3 block truncate text-[10px] tracking-[0.2em] text-[#a3a3a3] uppercase")}>
                  {f.caption}
                </span>
                <span className={cn(mono, "mt-1 block truncate text-[10px] tracking-[0.2em] text-[#5f5f5f] uppercase")}>
                  {f.credit}
                </span>
              </>
            );
            return (
              <li key={f.key}>
                <Reveal delay={(i % 3) * 0.08} amount={0.2}>
                  {f.video ? (
                    <button
                      type="button"
                      onClick={() => open(f.video!)}
                      className="group/frame block w-full cursor-pointer text-left"
                      aria-label={`Play ${f.video.title}`}
                    >
                      {body}
                    </button>
                  ) : (
                    <div className="group/frame">{body}</div>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
