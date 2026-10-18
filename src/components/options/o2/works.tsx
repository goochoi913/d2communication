"use client";

import { LuArrowRight, LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { youtubeThumbnail } from "@/lib/youtube";
import { Still } from "@/components/media/still";
import { useVideoPlayer } from "@/components/media/video-player";
import { Reveal } from "@/components/motion/reveal";
import { categoryBySlug, photos, smallPoster, videosIn, type Video } from "@/data/site";
import { Rise, container, outlineButton, redBlock, wide } from "./shared";

const SECTIONS = ["broadcast", "promo", "performance"] as const;

export function Works() {
  return (
    <>
      {SECTIONS.map((slug, i) => (
        <WorkSection key={slug} slug={slug} index={i} />
      ))}
      <PhotoSection />
    </>
  );
}

function SectionHead({ index, name, description, meta }: { index: number; name: string; description: string; meta: string }) {
  return (
    <div className="grid grid-cols-12 items-end gap-6">
      <div className="col-span-12 flex items-end gap-5 md:gap-7 lg:col-span-8">
        <span
          style={redBlock}
          className={cn(wide, "grid size-16 shrink-0 place-items-center text-[18px] font-black text-white md:size-20 md:text-[22px]")}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className={cn(wide, "text-[clamp(1.9rem,3.7vw,3.55rem)] leading-[0.86] font-black tracking-[-0.015em] whitespace-nowrap uppercase")}>
          <Rise>{name}</Rise>
        </h3>
      </div>
      <Reveal className="col-span-12 lg:col-span-4" delay={0.1}>
        <p className="text-[15px] leading-relaxed text-neutral-600">{description}</p>
        <p className="mt-4 text-[11px] font-semibold tracking-[0.2em] text-neutral-900 uppercase">{meta}</p>
      </Reveal>
    </div>
  );
}

function WorkSection({ slug, index }: { slug: (typeof SECTIONS)[number]; index: number }) {
  const category = categoryBySlug(slug);
  const list = videosIn(slug);

  return (
    <section id={slug} className="scroll-mt-20 border-t border-neutral-200 py-24 md:py-32">
      <div className={container}>
        <SectionHead
          index={index}
          name={category.name}
          description={category.description}
          meta={`${list.length} films · ${category.subGenres.join(" · ")}`}
        />
        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {list.slice(0, 6).map((v, i) => (
            <Reveal key={v.id} delay={(i % 3) * 0.08}>
              <WorkCard video={v} />
            </Reveal>
          ))}
        </div>
        {list.length > 6 ? (
          <div className="mt-14 flex justify-end">
            <a href={`#${slug}`} className={outlineButton}>
              All {list.length} {category.name.toLowerCase()} films
              <LuArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** Hard-edged card; on hover a red bar rises from the bottom edge, as the letters rise from the baseline. */
function WorkCard({ video }: { video: Video }) {
  const { open } = useVideoPlayer();
  const src = video.poster ? smallPoster(video.poster) : youtubeThumbnail(video.youtubeId);

  return (
    <button type="button" onClick={() => open(video)} className="group block w-full cursor-pointer text-left">
      <div className="relative aspect-video overflow-hidden bg-neutral-200">
        <Still
          src={src}
          alt={video.title}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
        <div
          style={redBlock}
          className="absolute inset-x-0 bottom-0 translate-y-[calc(100%+2px)] px-5 py-4 text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
        >
          <span className="flex items-center justify-between gap-4 text-[11px] font-bold tracking-[0.2em] whitespace-nowrap uppercase">
            <span className="flex items-center gap-3">
              <LuPlay className="size-3.5 fill-current" /> Play film
            </span>
            <span className="tabular-nums">{video.runtime}</span>
          </span>
        </div>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-6 border-t-2 border-neutral-950 pt-4">
        <h4 className="text-[17px] leading-snug font-semibold tracking-[-0.01em]">{video.title}</h4>
        <span className="shrink-0 text-[10px] font-semibold tracking-[0.2em] text-[#CC0606] uppercase">
          {video.subGenre}
        </span>
      </div>
      {/* Credit line: broadcaster or client · year · runtime · role. */}
      <p className="mt-2 text-[13px] leading-snug text-neutral-600">
        <span className="font-semibold text-neutral-900">{video.client}</span> · {video.year} · {video.runtime} ·{" "}
        {video.role.replaceAll(" · ", ", ")}
      </p>
    </button>
  );
}

/** Spans repeat so any number of stills keeps a hard-edged, flush mosaic. */
const SPANS = ["lg:col-span-8", "lg:col-span-4", "lg:col-span-4", "lg:col-span-8", "lg:col-span-6", "lg:col-span-6"];

function PhotoSection() {
  const category = categoryBySlug("photography");
  return (
    <section id="photography" className="scroll-mt-20 border-t border-neutral-200 py-24 md:py-32">
      <div className={container}>
        <SectionHead
          index={3}
          name={category.name}
          description={category.description}
          meta={category.subGenres.join(" · ")}
        />
        <div className="mt-14 grid grid-cols-12 gap-3">
          {photos.map((photo, i) => (
            <Reveal key={photo.src} delay={(i % 2) * 0.08} className={cn("col-span-12 sm:col-span-6", SPANS[i % SPANS.length])}>
              <figure>
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-200 lg:aspect-auto lg:h-[min(56vh,560px)]">
                  <Still
                    src={photo.src}
                    alt={photo.alt}
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    className="size-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 flex items-center gap-3 text-[11px] font-semibold tracking-[0.2em] text-neutral-600 uppercase">
                  <span aria-hidden className="size-2" style={redBlock} />
                  {photo.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
